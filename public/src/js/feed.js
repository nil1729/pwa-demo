const dialog = document.querySelector('dialog');
const showModalButton = document.querySelector('.show-modal');
if (!dialog.showModal) {
	dialogPolyfill.registerDialog(dialog);
}
showModalButton.addEventListener('click', function () {
	dialog.showModal();
});

dialog.querySelector('.close').addEventListener('click', function () {
	dialog.close();
});

const feedContainer = document.querySelector('.feed-container');
function createCard(imgSrc, title, location) {
	const feedCard = document.createElement('div');
	feedCard.className = 'demo-card-wide mdl-card mdl-shadow--2dp';

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
	componentHandler.upgradeElement(feedCard);
	feedContainer.appendChild(feedCard);
}

fetch('https://jsonplaceholder.typicode.com/photos?_limit=5')
	.then(function (response) {
		return response.json();
	})
	.then(function (data) {
		if (Array.isArray(data)) {
			data.forEach(function (item) {
				createCard(item.url, item.title, 'In India');
			});
		}
	});
