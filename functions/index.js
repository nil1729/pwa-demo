const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./admin.json');
const configKeys = require('./secret.json');
const webPush = require('web-push');
const { v4: idGenerator } = require('uuid');
const vapidPublicKey = configKeys.vapidPublicKey;
const vapidPrivateKey = configKeys.vapidPrivateKey;
const corsOptions = {
	origin: function (origin, callback) {
		const allowedOrigins = configKeys.allowedSites;
		console.log('Logged Output ~ file: index.js ~ line 7 ~ Requested Origin', origin);
		if (allowedOrigins.indexOf(origin) > -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};
const cors = require('cors')(corsOptions);
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

admin.initializeApp({
	projectId: serviceAccount.project_id,
	credential: admin.credential.cert(serviceAccount),
	databaseURL: configKeys.databaseURL,
	storageBucket: configKeys.storageBucket,
});

const db = admin.database();
const bucket = admin.storage().bucket();

exports.getPosts = functions.https.onRequest((req, res) => {
	cors(req, res, function () {
		db.ref('posts')
			.get()
			.then(function (data) {
				return res.status(200).json(data);
			});
	});
});

exports.savePost = functions.https.onRequest((req, res) => {
	cors(req, res, function () {
		const busboy = new Busboy({ headers: req.headers });
		const tmpdir = os.tmpdir();

		// This object will accumulate all the fields, keyed by their name
		const fields = {};

		// This object will accumulate all the uploaded files, keyed by their name.
		const uploads = {};

		// This code will process each non-file field in the form.
		busboy.on('field', function (fieldName, val) {
			fields[fieldName] = val;
		});

		const fileWrites = [];

		// This code will process each file uploaded.
		busboy.on('file', (fieldName, file, filename) => {
			const filepath = path.join(tmpdir, filename);
			uploads[fieldName] = filepath;

			const writeStream = fs.createWriteStream(filepath);
			file.pipe(writeStream);

			// File was processed by Busboy; wait for it to be written.
			// Note: GCF may not persist saved files across invocations.
			// Persistent files must be kept in other locations
			// (such as Cloud Storage buckets).
			const promise = new Promise((resolve, reject) => {
				file.on('end', () => {
					writeStream.end();
				});
				writeStream.on('finish', resolve);
				writeStream.on('error', reject);
			});
			fileWrites.push(promise);
		});

		// Triggered once all uploaded files are processed by Busboy.
		// We still need to wait for the disk writes (saves) to complete.
		busboy.on('finish', function () {
			Promise.all(fileWrites).then(function () {
				if (!uploads.image || !fields.title || !fields.location)
					return res.status(400).json({ error: 'Please enter valid data!' });

				const uploadOptions = {
					destination: `pwa-posts/${path.basename(uploads.image)}`,
					uploadType: 'media',
				};
				bucket
					.upload(uploads.image, uploadOptions)
					.then(function () {
						return bucket.file(uploadOptions.destination).getSignedUrl({
							action: 'read',
							expires: '01-01-2500',
						});
					})
					.then(function (publicURL) {
						db.ref('posts')
							.push({
								id: idGenerator(),
								image: publicURL[0],
								title: fields.title,
								location: fields.location,
							})
							.then(function () {
								webPush.setVapidDetails(
									'mailto:ceo@nilanjandeb.me',
									vapidPublicKey,
									vapidPrivateKey
								);
								return db.ref('subscriptions').once('value');
							})
							.then(function (subscriptions) {
								subscriptions.forEach(function (sub) {
									const pushConfig = {
										endpoint: sub.val().endpoint,
										keys: {
											auth: sub.val().keys.auth,
											p256dh: sub.val().keys.p256dh,
										},
									};
									webPush
										.sendNotification(
											pushConfig,
											JSON.stringify({
												title: 'New Post Added',
												content: `New Moment ${fields.title} shared at ${fields.location}`,
												postPhoto: publicURL[0],
												openURL: '/help',
											})
										)
										.catch(function (err) {
											console.log(
												'Logged Output ~ file: index.js ~ line 70 ~ Push Notification Error',
												err
											);
										});
								});
								return res.status(200).json({ message: 'Post Saved!', id: fields.id });
							});
					})
					.catch(function (err) {
						return res.status(500).json({ error: 'Something went wrong on the server :/' });
					})
					.finally(function () {
						for (const file in uploads) fs.unlinkSync(uploads[file]);
					});
			});
		});

		busboy.end(req.rawBody);
	});
});

exports.addNewSubscription = functions.https.onRequest((req, res) => {
	cors(req, res, function () {
		if (!req.body.subscription)
			return res.status(400).json({ error: 'Subscription request not valid' });
		db.ref('subscriptions')
			.push(req.body.subscription)
			.then(function () {
				return res.status(200).json({ message: 'Subscribed Successfully!' });
			})
			.catch(function () {
				return res.status(500).json({ error: 'Something went wrong on the server :/' });
			});
	});
});
