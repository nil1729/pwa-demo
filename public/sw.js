const STATIC_CACHE_NAME = 'static-v10';
const DYNAMIC_CACHE_NAME = 'dynamic-v10';
const STATIC_FILES = [
	'/',
	'/index.html',
	'/offline.html',
	'/src/css/app.css',
	'/src/css/main.css',
	'/src/js/app.js',
	'/src/js/feed.js',
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

/**
 *
 *
 * @Strategy Cache with Networks Fallback
 *
 */
// self.addEventListener('fetch', function (event) {
// 	event.respondWith(
// 		// First trying to find the resource from cache
// 		caches.match(event.request).then(function (response) {
// 			if (response) return response;
// 			// If not in cache try to load the resource from network
// 			else {
// 				return (
// 					fetch(event.request)
// 						.then(function (res) {
// 							return caches.open(DYNAMIC_CACHE_NAME).then(function (cache) {
// 								cache.put(event.request.url, res.clone());
// 								return res;
// 							});
// 						})

// 						// If network fails or the resource not cached yet
// 						.catch(function (e) {
// 							return caches.match('/offline.html');
// 						})
// 				);
// 			}
// 		})
// 	);
// });

/**
 *
 *
 * @Strategy Cache Only
 *
 *
 */
// self.addEventListener('fetch', function (event) {
// 	event.respondWith(caches.match(event.request));
// });

/**
 *
 *
 * @Strategy Network Only
 *
 *
 */
// self.addEventListener('fetch', function (event) {
// 	event.respondWith(fetch(event.request));
// });

/**
 *
 *
 * @Strategy  Network with Cache Fallback
 *
 *
 */
// self.addEventListener('fetch', function (event) {
// 	event.respondWith(
// 		fetch(event.request)
// 			.then(function (res) {
// 				return caches.open(DYNAMIC_CACHE_NAME).then(function (cache) {
// 					cache.put(event.request, res.clone());
// 					return res;
// 				});
// 			})
// 			.catch(function (err) {
// 				return caches.match(event.request).then(function (response) {
// 					if (response) return response;
// 					else return caches.match('/offline.html');
// 				});
// 			})
// 	);
// });

/**
 *
 *
 * @Strategy Cache, then Network
 *
 *
 */
self.addEventListener('fetch', function (event) {
	const URL = 'https://jsonplaceholder.typicode.com/photos?_limit=5';

	if (event.request.url.indexOf(URL) > -1) {
		event.respondWith(
			caches.open(DYNAMIC_CACHE_NAME).then(function (cache) {
				return fetch(event.request).then(function (res) {
					cache.put(event.request, res.clone());
					return res;
				});
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
								if (event.request.url.indexOf('/help') > -1) {
									return caches.match('/offline.html');
								}
							})
					);
				}
			})
		);
	}
});
