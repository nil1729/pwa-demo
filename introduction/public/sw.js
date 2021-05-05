const STATIC_CACHE_NAME = 'static-v1';
const STATIC_CACHES = ['/', '/index.html', '/src/css/style.css', '/src/js/app.js'];

self.addEventListener('install', function (event) {
	console.log('[Service Worker] Installing ....', event);
	event.waitUntil(
		caches.open(STATIC_CACHE_NAME).then(function (cache) {
			cache.addAll(STATIC_CACHES);
		})
	);
});

self.addEventListener('activate', function (event) {
	console.log('[Service Worker] Activating ....', event);
});

self.addEventListener('fetch', function (event) {
	console.log('[Service Worker] Fetching Something....', event.request.url);
	event.respondWith(
		caches.match(event.request.url).then(function (response) {
			if (response) return response;
			else return fetch(event.request.url);
		})
	);
});
