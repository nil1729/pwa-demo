if (!window.Promise) window.Promise = Promise;
const enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

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

function displayConfirmNotification() {
	if (navigator.serviceWorker) {
		const options = {
			body: 'You successfully subscribed to our Notification Services',
			icon: '/src/images/icons/app-icon-96x96.png',
			image: '/src/images/main-bg.jpg',
			dir: 'ltr',
			lang: 'en-US',
			vibrate: [100, 50, 200],
			badge: '/src/images/icons/app-icon-96x96.png',
			// tag: 'confirm-notification',
			// renotify: true,
			// actions: [
			// 	{ action: 'confirm', title: 'Okay', icon: '/src/images/icons/app-icon-96x96.png' },
			// 	{ action: 'cancel', title: 'Cancel', icon: '/src/images/icons/app-icon-96x96.png' },
			// ],
		};
		return navigator.serviceWorker.ready.then(function (sw) {
			sw.showNotification('Successfully Subscribed!', options);
		});
	}
}

function askForNotificationPermissions() {
	if (Notification.permission === 'default') {
		Notification.requestPermission().then(function (result) {
			if (result === 'granted') {
				displayConfirmNotification().then(hideNotificationsButtons);
			}
		});
	} else if (Notification.permission === 'denied') {
		alert('Kindly allow Notifications from Site Settings');
	} else alert('You already enabled Notifications!');
}

function showNotificationButton() {
	for (let buttonElem of enableNotificationsButtons) {
		buttonElem.style.display = 'inline-block';
		buttonElem.addEventListener('click', askForNotificationPermissions);
	}
}

function hideNotificationsButtons() {
	for (let buttonElem of enableNotificationsButtons) {
		buttonElem.style.display = 'none';
		buttonElem.removeEventListener('click', askForNotificationPermissions);
	}
}

if (window.Notification && Notification.permission !== 'granted' && navigator.serviceWorker)
	showNotificationButton();
