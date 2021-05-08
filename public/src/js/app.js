if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(function (event) {
		console.log('Service Worker Registered!', event);
	});
} else console.log('Service Worker not supported by this browser');

// For changing the behavior of A2HS banner prompt
let deferredPrompt;
// window.addEventListener('beforeinstallprompt', (event) => {
// 	console.log('[beforeinstallprompt] fired', event);
// 	// Prevent Chrome <= 67 from automatically showing the prompt
// 	event.preventDefault();
// 	// Stash the event so it can be triggered later.
// 	deferredPrompt = event;
// 	console.log('[deferredPrompt]', deferredPrompt);
// 	return false;
// });
