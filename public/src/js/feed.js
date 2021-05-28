const showModalButton = document.querySelector('.show-modal');
const feedContainer = document.querySelector('.feed-container');
const postModal = document.querySelector('#post-modal');
const toastContainer = document.querySelector('#notification-toast');
const form = document.querySelector('form');
const titleInput = document.querySelector('#post_title');
const locationInput = document.querySelector('#post_location');
const imagePickerArea = document.querySelector('.image-picker-container');
const videoPlayer = document.querySelector('video#player');
const captureButton = document.querySelector('#capture-btn');
const canvasElement = document.querySelector('canvas#canvas');
const pickedImage = document.querySelector('#picked-image');
const imagePicker = document.querySelector('#image-picker');
const pickedImageText = document.querySelector('#image-picker-text');
const getLocationBtn = document.querySelector('#get-location-btn');
const locationSpinner = document.querySelector('#location-spinner');
const locationBtnContainer = document.querySelector('.location-btn-container');
let picture;
let fetchedLocation;

function captureImage() {
	videoPlayer.style.display = 'none';
	canvasElement.style.display = 'block';
	canvas.width = videoPlayer.videoWidth;
	canvas.height = videoPlayer.videoHeight;
	canvas
		.getContext('2d')
		.drawImage(videoPlayer, 0, 0, videoPlayer.videoWidth, videoPlayer.videoHeight); // for drawing the video element on the canvas
	picture = dataURItoBlob(canvasElement.toDataURL());
	closeVideoPlayer();
}

function closeVideoPlayer() {
	if (videoPlayer.srcObject)
		videoPlayer.srcObject.getVideoTracks().forEach(function (track) {
			track.stop();
		});
}

function checkGeolocationFeature() {
	if (!navigator.geolocation) {
		locationBtnContainer.style.display = 'none';
		return;
	}
}

function getLocation(position) {
	const { latitude, longitude } = position.coords;
	fetch(
		`${GEOCODING_API_URL}?key=${GEOCODING_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
	)
		.then(function (res) {
			return res.json();
		})
		.then(function (data) {
			let addressCityOrState = data.address.city || data.address.state;
			fetchedLocation = `In ${addressCityOrState || ''}${addressCityOrState ? ', ' : ''}${
				data.address.country
			}`;
			locationInput.value = fetchedLocation;
			locationInput.parentElement.classList.add('is-focused', 'is-dirty');
			getLocationBtn.style.display = 'inline-block';
			locationSpinner.style.display = 'none';
		})
		.catch(function (err) {
			getLocationBtn.style.display = 'inline-block';
			locationSpinner.style.display = 'none';
			alert(`Sorry, couldn't fetch the location, Please type manually`);
		});
}

function getLocationCoordinates() {
	navigator.geolocation.getCurrentPosition(
		getLocation,
		function (error) {
			getLocationBtn.style.display = 'inline-block';
			locationSpinner.style.display = 'none';
			alert(`Sorry, couldn't fetch the location, Please type manually`);
		},
		{ timeout: 5000 }
	);
}

getLocationBtn.addEventListener('click', function () {
	this.style.display = 'none';
	locationSpinner.style.display = 'inline-block';
	getLocationCoordinates();
});

function initializeMedia() {
	if (!navigator.mediaDevices) {
		navigator.mediaDevices = {};
	}

	if (!navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia = function (constraints) {
			let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

			if (!getUserMedia) {
				return Promise.reject(new Error('Browser does not support getUserMedia'));
			}

			return new Promise(function (resolve, reject) {
				getUserMedia.call(navigator, constraints, resolve, reject);
			});
		};
	}

	navigator.mediaDevices
		.getUserMedia({ video: true })
		.then(function (stream) {
			videoPlayer.srcObject = stream;
			videoPlayer.style.display = 'block';
			imagePicker.removeAttribute('required');
			captureButton.addEventListener('click', captureImage);
		})
		.catch(function (err) {
			imagePickerArea.style.display = 'block';
			imagePicker.setAttribute('required', true);
			captureButton.style.display = 'none';
		});
}

function showModal() {
	let inputs = document.querySelectorAll('input');
	inputs.forEach(function (inputItem) {
		inputItem.value = '';
		inputItem.parentElement.classList.remove('is-invalid');
	});
	postModal.style.display = 'block';
	initializeMedia();
	checkGeolocationFeature();
}

function closeModal() {
	clearInput();
	closeVideoPlayer();
	postModal.style.display = 'none';
	videoPlayer.style.display = 'none';
	imagePickerArea.style.display = 'none';
	picture = undefined;
	canvasElement.getContext('2d').clearRect(0, 0, canvasElement.width, canvasElement.height);
	canvasElement.style.display = 'none';
	getLocationBtn.style.display = 'inline-block';
	locationSpinner.style.display = 'none';
}

showModalButton.addEventListener('click', showModal);
postModal.querySelector('.close').addEventListener('click', closeModal);

function clearCards() {
	while (feedContainer.hasChildNodes()) feedContainer.removeChild(feedContainer.lastChild);
}

function clearInput() {
	let inputs = document.querySelectorAll('input');
	inputs.forEach(function (inputItem) {
		inputItem.value = '';
		inputItem.parentElement.classList.remove('is-dirty', 'is-focused', 'is-invalid');
	});
	pickedImage.style.display = 'none';
	pickedImage.src = '';
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

let networkDataReceived = false;

fetch(`${SERVER_DOMAIN}/getPosts`)
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
	const postData = new FormData();
	postData.append('id', data.id);
	postData.append('location', data.location);
	postData.append('title', data.title);
	postData.append(
		'image',
		data.image,
		data.id + '.' + data.image.type.split('/').pop().toLowerCase()
	);

	fetch(`${SERVER_DOMAIN}/savePost`, {
		method: 'POST',
		body: postData,
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

	if (!picture) picture = imagePicker.files[0];

	// Last Check
	if (!picture) {
		alert('Please pick an Image!');
		return;
	}

	const newPost = {
		id: new Date().toISOString(),
		title: titleInput.value,
		location: locationInput.value,
		image: picture,
	};

	// Clear Input and Close Modal
	closeModal();
	clearInput();

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
					sendData(newPost);
				});
		});
	} else sendData(newPost);
});

/* Post Modal */
imagePicker.onchange = function () {
	pickedImageText.value = this.files[0].name;
	pickedImage.style.display = 'block';
	pickedImage.src = URL.createObjectURL(this.files[0]);
	pickedImage.onload = function () {
		URL.revokeObjectURL(pickedImage.src);
	};
};
