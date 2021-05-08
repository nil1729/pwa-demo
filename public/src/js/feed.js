const dialog = document.querySelector('dialog');
const showModalButton = document.querySelector('.show-modal');
if (!dialog.showModal) {
	dialogPolyfill.registerDialog(dialog);
}
showModalButton.addEventListener('click', function () {
	dialog.showModal();
	if (deferredPrompt) {
		deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		deferredPrompt.userChoice.then((choice) => {
			console.log('User Choice', choice);
			if (choice.outcome === 'accepted') {
				console.log('User accepted the A2HS prompt');
			} else {
				console.log('User dismissed the A2HS prompt');
			}
			// Clear the saved prompt since it can't be used again
			deferredPrompt = null;
			console.log('[deferredPrompt]', deferredPrompt);
		});
	}
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

	feedContainer.appendChild(feedCard);
}

createCard('https://wallpapercave.com/wp/wp2646303.jpg', 'Nice Javascript', 'In India');
