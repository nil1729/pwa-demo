importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

const STATIC_CACHE_NAME = 'static-v2';
const DYNAMIC_CACHE_NAME = 'dynamic-v2';
const STATIC_FILES = [
	'/',
	'/index.html',
	'/offline.html',
	'/src/css/app.css',
	'/src/css/main.css',
	'/src/js/app.js',
	'/src/js/feed.js',
	'/src/js/promise.js',
	'/src/js/fetch.js',
	'/src/js/idb.js',
	'/src/js/utility.js',
	'/src/js/material.min.js',
	'/src/images/main-bg.jpg',
	'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css',
	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
];

function isInStaticFiles(requestURL, array = STATIC_FILES) {
	for (let i = 0; i < array.length; i++) {
		if (requestURL === array[i]) return true;
		else if (array[i] !== '/' && requestURL.indexOf(array[i]) > -1) return true;
	}
	return false;
}

self.addEventListener('install', function (event) {
	console.log('[Service Worker] Installing Service Worker...');
	event.waitUntil(
		caches
			.open(STATIC_CACHE_NAME)
			.then(function (cache) {
				console.log('[Service Worker] Caching App Shell...');
				cache.addAll(STATIC_FILES);
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
	const URL = 'https://us-central1-pwa-demo-nil1729.cloudfunctions.net/getPosts';

	if (event.request.method === 'GET') {
		if (event.request.url.indexOf(URL) > -1) {
			event.respondWith(
				fetch(event.request).then(function (res) {
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
				})
			);
		} else if (isInStaticFiles(event.request.url)) {
			event.respondWith(caches.match(event.request));
		} else {
			event.respondWith(
				// First trying to find the resource from cache
				caches.match(event.request).then(function (response) {
					if (response) return response;
					// If not in cache try to load the resource from network
					else {
						return (
							fetch(event.request)
								.then(function (res) {
									return caches.open(DYNAMIC_CACHE_NAME).then(function (cache) {
										cache.put(event.request.url, res.clone());
										return res;
									});
								})
								// If network fails or the resource not cached yet
								.catch(function (e) {
									if (event.request.headers.get('accept').includes('text/html')) {
										return caches.match('/offline.html');
									}
								})
						);
					}
				})
			);
		}
	}
});

self.addEventListener('sync', function (event) {
	console.log('[Service Worker] Background Syncing ...', event);
	if (event.tag === 'sync-new-post') {
		event.waitUntil(
			readData('sync-posts').then(function (data) {
				for (let dt of data) {
					fetch('https://us-central1-pwa-demo-nil1729.cloudfunctions.net/savePost', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
						body: JSON.stringify(dt),
					})
						.then(function (res) {
							if (res.ok) {
								return res.json();
							}
							throw new Error('Failed to Save!');
						})
						.then(function (data) {
							console.log('[Service Worker]', data.message);
							return clearItemFromStore('sync-posts', data.id);
						})
						.catch(function (err) {
							console.log('Error! While sending data to the Server', err);
						});
				}
			})
		);
	}
});
