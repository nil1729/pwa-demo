if (!window.Promise) window.Promise = Promise;
const enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (navigator.serviceWorker) {
	navigator.serviceWorker
		.register('/service-worker.js')
		.then(function () {
			console.log('Service Worker Registered!');
		})
		.catch(function (e) {
			console.log(e);
		});
} else console.log('Service Worker not supported by this browser');

async function displayConfirmNotification() {
	if (navigator.serviceWorker) {
		const options = {
			body: 'You successfully subscribed to our Notification Services',
			icon: '/src/images/icons/app-icon-96x96.png',
			image: '/src/images/main-bg.jpg',
			dir: 'ltr',
			lang: 'en-US',
			vibrate: [100, 50, 200],
			badge: '/src/images/icons/app-icon-96x96.png',
			tag: 'confirm-notification',
			renotify: false,
		};
		return navigator.serviceWorker.ready.then(function (sw) {
			sw.showNotification('Successfully Subscribed!', options);
		});
	}
}

async function addSubscription() {
	if (navigator.serviceWorker) {
		let swReg;
		return navigator.serviceWorker.ready
			.then(function (sw) {
				swReg = sw;
				return sw.pushManager.getSubscription();
			})
			.then(function (subscription) {
				if (subscription === null) {
					return swReg.pushManager.subscribe({
						userVisibleOnly: true,
						applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
					});
				} else {
					// Do nothing
				}
			})
			.then(function (newSubscription) {
				return fetch(`${SERVER_DOMAIN}/addNewSubscription`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
					body: JSON.stringify({ subscription: newSubscription }),
				});
			})
			.then(function (res) {
				if (res.ok) {
					return displayConfirmNotification();
				}
			})
			.catch(function (err) {
				console.error(err);
			});
	}
}

function askForNotificationPermissions() {
	if (Notification.permission === 'default') {
		Notification.requestPermission().then(function (result) {
			if (result === 'granted') {
				addSubscription()
					.then(hideNotificationsButtons)
					.catch(function (err) {
						console.log(err);
					});
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
