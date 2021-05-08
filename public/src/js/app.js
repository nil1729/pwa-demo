if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(function (event) {
		console.log('Service Worker Registered!', event);
	});
} else console.log('Service Worker not supported by this browser');
