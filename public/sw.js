const STATIC_CACHE_NAME = 'static-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-v1';

self.addEventListener('install', function (event) {
	console.log('[Service Worker] Installing Service Worker...');
	event.waitUntil(
		caches
			.open(STATIC_CACHE_NAME)
			.then(function (cache) {
				console.log('[Service Worker] Caching App Shell...');
				cache.addAll([
					'/',
					'/index.html',
					'/src/css/app.css',
					'/src/css/main.css',
					'/src/js/app.js',
					'/src/js/feed.js',
					'/src/js/material.min.js',
					'/src/images/main-bg.jpg',
					'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css',
					'https://fonts.googleapis.com/icon?family=Material+Icons',
					'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
				]);
			})
			.finally(function () {
				self.skipWaiting();
			})
	);
});

self.addEventListener('activate', function (event) {
	console.log('[Service Worker] Activating Service Worker...');
	event.waitUntil(
		caches
			.keys()
			.then(function (keyList) {
				return Promise.all(
					keyList.map(function (key) {
						if (![DYNAMIC_CACHE_NAME, STATIC_CACHE_NAME].includes(key)) {
							console.log('[Service Worker] Removing Old Cache ...', key);
							return caches.delete(key);
						}
					})
				);
			})
			.finally(function () {
				self.clients.claim();
			})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) return response;
			else {
				return fetch(event.request).then(function (res) {
					return caches
						.open(DYNAMIC_CACHE_NAME)
						.then(function (cache) {
							cache.put(event.request.url, res.clone());
							return res;
						})
						.catch(function (e) {
							console.log(e);
						});
				});
			}
		})
	);
});
