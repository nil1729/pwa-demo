const showModalButton = document.querySelector('.show-modal');
const feedContainer = document.querySelector('.feed-container');
const postModal = document.querySelector('#post-modal');
const toastContainer = document.querySelector('#notification-toast');
const form = document.querySelector('form');
const titleInput = document.querySelector('#post_title');
const locationInput = document.querySelector('#post_location');

function showModal() {
	postModal.style.display = 'block';
}
function closeModal() {
	postModal.style.display = 'none';
}

showModalButton.addEventListener('click', showModal);
postModal.querySelector('.close').addEventListener('click', closeModal);

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

	componentHandler.upgradeElement(feedCard);
	feedContainer.appendChild(feedCard);
}

function updateUI(data) {
	clearCards();
	for (let i in data) createCard(data[i]);
}

const URL = 'https://us-central1-pwa-demo-nil1729.cloudfunctions.net/getPosts';
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

function showNotifications(message) {
	toastContainer.MaterialSnackbar.showSnackbar({ message });
}

function sendData(data) {
	fetch(URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify(data),
	})
		.then(function (res) {
			if (res.ok) {
				showNotifications('Your post has been successfully posted');
			}
		})
		.catch(function (err) {
			console.log(err);
		});
}

form.addEventListener('submit', function (event) {
	event.preventDefault();

	if (titleInput.value.trim() === '' || locationInput.value.trim() === '') {
		alert('Please enter valid data!');
		return;
	}

	closeModal();

	const newPost = {
		id: new Date().toISOString(),
		title: titleInput.value,
		location: locationInput.value,
		image:
			'https://firebasestorage.googleapis.com/v0/b/pwa-demo-nil1729.appspot.com/o/download.jpg?alt=media&token=439861b2-5a65-4a4b-adf3-346677c69a3c',
	};

	if (navigator.serviceWorker && window.SyncManager) {
		navigator.serviceWorker.ready.then(function (sw) {
			writeData('sync-posts', newPost)
				.then(function () {
					return sw.sync.register('sync-new-post');
				})
				.then(function () {
					showNotifications('Your post has been saved for syncing!');
				})
				.catch(function (e) {
					console.log(e);
				});
		});
	} else sendData(newPost);
});
