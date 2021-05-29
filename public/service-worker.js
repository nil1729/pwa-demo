importScripts('/workbox-sw.js');
importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');
workbox.setConfig({ debug: true });

const FALLBACK_HTML_URL = '/offline.html';
const FALLBACK_IMAGE_URL = '/src/images/offline.jpg';

self.skipWaiting();

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			if ('navigationPreload' in self.registration) {
				await self.registration.navigationPreload.enable();
			}
		})()
	);
	self.clients.claim();
});

workbox.precaching.precacheAndRoute([{"revision":"2cab47d9e04d664d93c8d91aec59e812","url":"favicon.ico"},{"revision":"74edfd0b90b53625663ccc1b81927d2c","url":"index.html"},{"revision":"92b2c8e54007ca32af0b9efe5d0455bb","url":"manifest.json"},{"revision":"4dac8d9151f1120207ee97c50de634c6","url":"offline.html"},{"revision":"26719f404eef804028ddda347c8efc26","url":"src/css/app.css"},{"revision":"435e31a13d5e089c704b268b1a38db43","url":"src/css/help.css"},{"revision":"3d8bcee9c08272304c8ccd642e141196","url":"src/css/main.css"},{"revision":"9f8374415ec7c668a47396b84a9db73d","url":"src/js/app.js"},{"revision":"59336d002230226ae977fd402a7d07d0","url":"src/js/feed.js"},{"revision":"6b82fbb55ae19be4935964ae8c338e92","url":"src/js/fetch.js"},{"revision":"7f14df9b9adfa61a1c300e7b9e50680d","url":"src/js/idb.js"},{"revision":"713af0c6ce93dbbce2f00bf0a98d0541","url":"src/js/material.min.js"},{"revision":"10c2238dcd105eb23f703ee53067417f","url":"src/js/promise.js"},{"revision":"41d7b8676a87517a4f413e857bef49ea","url":"src/js/utility.js"},{"revision":"0ccda0de0d403edf16b276efb53da557","url":"workbox-sw.js"},{"revision":"84c568338e0d6fd0e728fdac08b2aefd","url":"src/images/main-bg.jpg"},{"revision":"73898b781627214e1df133f6474bf13d","url":"src/images/offline.jpg"}]);

workbox.routing.registerRoute(
	({ url }) =>
		url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'google-fonts',
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				maxAgeSeconds: 30 * 24 * 60 * 60,
			}),
		],
	})
);

workbox.routing.registerRoute(
	({ request, url }) =>
		request.destination === 'image' && url.origin === 'https://storage.googleapis.com',
	new workbox.strategies.CacheFirst({
		cacheName: 'post-images',
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				maxAgeSeconds: 7 * 24 * 60 * 60,
				maxEntries: 5,
			}),
			new workbox.cacheableResponse.CacheableResponsePlugin({
				statuses: [0, 200],
			}),
		],
	})
);

workbox.routing.registerRoute(
	'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css',
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'material-css',
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				maxAgeSeconds: 30 * 24 * 60 * 60,
				maxEntries: 1,
			}),
		],
	})
);

workbox.routing.registerRoute(`${SERVER_DOMAIN}/getPosts`, async function (args) {
	return fetch(args.request).then(function (res) {
		const clonedResponse = res.clone();
		clearStore('feed-posts')
			.then(function () {
				return clonedResponse.json();
			})
			.then(function (data) {
				for (let key in data) {
					writeData('feed-posts', data[key]);
				}
			});
		return res;
	});
});

workbox.routing.registerRoute(
	({ request }) => request.mode === 'navigate',
	async function ({ event }) {
		return fetch(event.request).catch(function () {
			return workbox.precaching.matchPrecache(FALLBACK_HTML_URL);
		});
	}
);

workbox.routing.setCatchHandler(async ({ event }) => {
	switch (event.request.destination) {
		case 'image':
			return workbox.precaching.matchPrecache(FALLBACK_IMAGE_URL);
			break;
		default:
			return Response.error();
	}
});

// Background Sync
const bgSyncPluginForSendingPost = new workbox.backgroundSync.BackgroundSyncPlugin('syncing-post', {
	maxRetentionTime: 24 * 60,
});
workbox.routing.registerRoute(
	`${SERVER_DOMAIN}/savePost`,
	new workbox.strategies.NetworkOnly({
		plugins: [bgSyncPluginForSendingPost],
	}),
	'POST'
);

// Push Notification
self.addEventListener('notificationclick', function (event) {
	console.log('[Service Worker] Notification Clicked', event);
	let notification = event.notification;

	if (event.action === 'open') {
		event.waitUntil(
			clients.matchAll().then(function (clientList) {
				let client = clientList.find(function (it) {
					return it.visibilityState === 'visible';
				});
				if (client) {
					client.navigate(notification.data.url);
					client.focus();
				} else {
					clients.openWindow(notification.data.url);
				}
				notification.close();
			})
		);
	} else notification.close();
});

self.addEventListener('notificationclose', function (event) {
	console.log('[Service Worker] Notification Closed', event);
});

self.addEventListener('push', function (event) {
	console.log('[Service Worker] Push Notification received', event);

	let data = {
		title: 'New Post',
		content: 'New post added to PWAGram',
		postPhoto: '/src/images/main-bg.jpg',
		openURL: '/',
	};

	if (event.data) data = JSON.parse(event.data.text());

	const options = {
		body: data.content,
		icon: '/src/images/icons/app-icon-96x96.png',
		image: data.postPhoto,
		dir: 'ltr',
		lang: 'en-US',
		vibrate: [100, 50, 200],
		badge: '/src/images/icons/app-icon-96x96.png',
		tag: 'new-post-notification',
		renotify: false,
		actions: [
			{ action: 'open', title: 'Open Post', icon: '/src/images/icons/open.png' },
			{ action: 'close', title: 'Close', icon: '/src/images/icons/close.png' },
		],
		data: {
			url: data.openURL,
		},
	};

	event.waitUntil(self.registration.showNotification(data.title, options));
});
