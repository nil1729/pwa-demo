const dialog = document.querySelector('dialog');
const showModalButton = document.querySelector('.show-modal');
const feedContainer = document.querySelector('.feed-container');

if (!dialog.showModal) {
	dialogPolyfill.registerDialog(dialog);
}
showModalButton.addEventListener('click', function () {
	dialog.showModal();

	// if (navigator.serviceWorker) {
	// 	navigator.serviceWorker.getRegistrations().then(function (registrations) {
	// 		for (let i in registrations) registrations[i].unregister();
	// 	});
	// }
});
dialog.querySelector('.close').addEventListener('click', function () {
	dialog.close();
});

function clearCards() {
	while (feedContainer.hasChildNodes()) feedContainer.removeChild(feedContainer.lastChild);
}

function createCard({ id, image, title, location }) {
	const feedCard = document.createElement('div');
	feedCard.className = 'demo-card-wide mdl-card mdl-shadow--2dp';
	feedCard.id = id;

	// feed title
	const feedTitle = document.createElement('div');
	feedTitle.className = 'mdl-card__title';
	feedTitle.style.backgroundImage = `url(${image})`;
	const titleText = document.createElement('h2');
	titleText.className = 'mdl-card__title-text';
	titleText.textContent = title;
	feedTitle.appendChild(titleText);
	feedCard.appendChild(feedTitle);

	// feed Location
	const feedLocation = document.createElement('div');
	feedLocation.className = 'mdl-card__supporting-text text-center';
	feedLocation.textContent = location;
	feedCard.appendChild(feedLocation);

	// Create a Save Button
	// const saveButton = document.createElement('button');
	// saveButton.className = 'mdl-button mdl-js-button mdl-button--raised';
	// saveButton.textContent = 'Save';
	// feedCard.appendChild(saveButton);
	// saveButton.addEventListener('click', saveForOfflineAccess(imgSrc));

	componentHandler.upgradeElement(feedCard);
	feedContainer.appendChild(feedCard);
}

function updateUI(data) {
	clearCards();
	for (let i in data) createCard(data[i]);
}

const URL = 'https://pwa-demo-nil1729-default-rtdb.firebaseio.com/posts.json';
let networkDataReceived = false;

fetch(URL)
	.then(function (response) {
		console.log('From Networks', response);
		return response.json();
	})
	.then(function (data) {
		networkDataReceived = true;
		updateUI(data);
	})
	.catch(function (err) {});

if (window.indexedDB) {
	readData('feed-posts').then(function (data) {
		console.log('From Cache', data);
		if (!networkDataReceived) updateUI(data);
	});
}
