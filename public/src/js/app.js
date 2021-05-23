if (!window.Promise) window.Promise = Promise;

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/sw.js')
		.then(function () {
			console.log('Service Worker Registered!');
		})
		.catch(function (e) {
			console.log(e);
		});
} else console.log('Service Worker not supported by this browser');

/**
 *
 *
 * @Chapter Service Worker Caching
 *
 */
