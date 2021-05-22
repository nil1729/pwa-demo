if (!window.Promise) window.Promise = Promise;

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/sw.js')
		.then(function (event) {
			console.log('Service Worker Registered!', event);
		})
		.catch(function (e) {
			console.log(e);
		});
} else console.log('Service Worker not supported by this browser');

/**
 *
 *
 * @Chapter Promise and Fetch API
 *
 */

// Set Timeout Examples
// setTimeout(function () {
// 	console.log('This will execute when the timer is done');
// }, 5000);
// console.log('This will execute right after the setTimeout()');

// Promise
// let promise = new Promise(function (resolve, reject) {
// 	setTimeout(function () {
// 		resolve({ code: 200, message: 'Promise was resolved successfully' });
// 		// reject({ code: 500, message: 'Something went wrong!' });
// 	}, 5000);
// });
// promise
// 	.then(function (res) {
// 		console.log(res);
// 		return res.message;
// 	})
// 	.then(function (message) {
// 		console.log(message.toCapitalCase());
// 	})
// 	.catch(function (e) {
// 		console.log(e);
// 	})
// 	.finally(function () {
// 		console.log('Promise Done!');
// 	});

// Fetch
// fetch('https://jsonplaceholder.typicode.com/posts/1', {
// 	method: 'PUT',
// 	headers: {
// 		'Content-Type': 'application/json',
// 	},
// 	body: JSON.stringify({
// 		userId: 5,
// 		id: 101,
// 		title: 'New Post Updated',
// 		body: 'Post Body Updated',
// 	}),
// })
// 	.then(function (res) {
// 		console.log(res);
// 		return res.json();
// 	})
// 	.then(function (data) {
// 		console.log(data);
// 	})
// 	.catch(function (e) {
// 		console.log(e);
// 	})
// 	.finally(function () {
// 		console.log('Post Fetching finished ...');
// 	});

// let xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/1');
// xhr.onerror = function () {
// 	console.log('Error!');
// };
// xhr.onload = function () {
// 	console.log(xhr.response, xhr.status);
// };
// xhr.send();
