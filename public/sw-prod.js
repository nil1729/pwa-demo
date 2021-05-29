const FALLBACK_HTML_URL = '/offline.html';
const FALLBACK_IMAGE_URL = '/src/images/offline.jpg';

self.skipWaiting();

self.addEventListener('activate', (event) => {
	self.clients.claim();
});

if (workbox.navigationPreload.isSupported()) {
	workbox.navigationPreload.enable();
}

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

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
