const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./admin.json');
const webPush = require('web-push');
const corsOptions = {
	origin: function (origin, callback) {
		const allowedOrigins = [
			'http://localhost:8000',
			'https://pwa-bg-sync.web.app',
			'https://pwa-push-notifications.web.app',
		];
		console.log('Logged Output ~ file: index.js ~ line 7 ~ Requested Origin', origin);
		if (allowedOrigins.indexOf(origin) > -1) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
};

const cors = require('cors')(corsOptions);
const { v4: idGenerator } = require('uuid');
const vapidPublicKey =
	'BP4PlsYeQd4Wg6Mqn-o48s6mtktxM2EexAHHBVzplZqUUt8BSooje8UcRnmcAKhPBC6ETLlx21-MiX2yYu9UUnw';
const vapidPrivateKey = 'sH9tUupLl6h31NYnCeP60s6Acvm_rbIwC2LxxSQpe7k';

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://pwa-demo-nil1729-default-rtdb.firebaseio.com',
});

const db = admin.database();

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
		const { image, title, location } = req.body;
		if (!image || !title || !location)
			return res.status(400).json({ error: 'Please enter valid data!' });
		db.ref('posts')
			.push({
				id: idGenerator(),
				image,
				title,
				location,
			})
			.then(function () {
				webPush.setVapidDetails('mailto:ceo@nilanjandeb.me', vapidPublicKey, vapidPrivateKey);
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
								content: `New Moment ${req.body.title} shared at ${req.body.location}`,
								postPhoto: req.body.image,
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
				return res.status(200).json({ message: 'Post Saved!', id: req.body.id });
			})
			.catch(function () {
				return res.status(500).json({ error: 'Something went wrong on the server :/' });
			});
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
