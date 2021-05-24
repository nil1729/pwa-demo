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

function createCard(id, imgSrc, title, location) {
	const feedCard = document.createElement('div');
	feedCard.className = 'demo-card-wide mdl-card mdl-shadow--2dp';
	feedCard.id = id;

	// feed title
	const feedTitle = document.createElement('div');
	feedTitle.className = 'mdl-card__title';
	feedTitle.style.backgroundImage = `url(${imgSrc})`;
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

const URL = 'https://jsonplaceholder.typicode.com/photos?_limit=5';
let networkDataReceived = false;

fetch(URL)
	.then(function (response) {
		console.log('From Networks', response);
		return response.json();
	})
	.then(function (data) {
		if (Array.isArray(data)) {
			networkDataReceived = true;
			clearCards();
			data.forEach(function (item) {
				createCard(item.id, item.url, item.title, 'In India');
			});
		}
	})
	.catch(function (err) {});

if (window.caches) {
	caches
		.match(URL)
		.then(function (response) {
			console.log('From Cache', response);
			if (response) return response.json();
		})
		.then(function (data) {
			clearCards();
			if (Array.isArray(data) && !networkDataReceived) {
				data.forEach(function (item) {
					createCard(item.id, item.url, item.title, 'In India');
				});
			}
		});
}

// fetch('https://jsonplaceholder.typicode.com/photos/10')
// 	.then(function (response) {
// 		return response.json();
// 	})
// 	.then(function (data) {
// 		createCard(data.id, data.url, data.title, 'In India');
// 	})
// 	.catch(function (err) {
// 		console.error(err);
// 	});

// Save for Offline Access on demand based on User choice
// const saveForOfflineAccess = function (photoURL) {
// 	return function () {
// 		if (window.caches) {
// 			caches
// 				.open('user-requested')
// 				.then(function (cache) {
// 					return Promise.all([
// 						cache.add('https://jsonplaceholder.typicode.com/photos/10'),
// 						fetch(photoURL, { mode: 'no-cors' }).then(function (res) {
// 							cache.put(photoURL, res.clone());
// 						}),
// 					]);
// 				})
// 				.catch(function (err) {
// 					console.error(err);
// 				});
// 		}
// 	};
// };
