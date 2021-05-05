const appTitle = document.querySelector('.title');
const appFeatures = document.querySelectorAll('.app-feature .feature');
const startAgainBtn = document.querySelector('.start-over button');

if ('serviceWorker' in navigator) {
	console.log('Service Worker is available on this browser');
	navigator.serviceWorker.register('/sw.js');
}

function animate() {
	// Make all elements opacity to zero
	appTitle.style.opacity = 0;
	appTitle.classList.remove('animate-in');
	for (let i = 0; i < appFeatures.length; i++) {
		appFeatures[i].style.opacity = 0;
		appFeatures[i].classList.remove('animate-in');
	}
	startAgainBtn.style.opacity = 0;
	startAgainBtn.classList.remove('animate-in');
	startAgainBtn.disabled = true;

	// App Title
	setTimeout(() => {
		appTitle.classList.add('animate-in');
		appTitle.style.opacity = 1;
	}, 800);

	// App features
	for (let i = 0; i < appFeatures.length; i++) {
		setTimeout(() => {
			appFeatures[i].classList.add('animate-in');
			appFeatures[i].style.opacity = 1;
		}, 800 * (i + 2));
	}

	// Start Again Button
	setTimeout(() => {
		startAgainBtn.classList.add('animate-in');
		startAgainBtn.style.opacity = 1;
		startAgainBtn.disabled = false;
	}, 800 * (appFeatures.length + 2));
}

animate();

startAgainBtn.addEventListener('click', animate);
