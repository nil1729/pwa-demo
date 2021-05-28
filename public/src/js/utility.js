const SERVER_DOMAIN = 'https://us-central1-pwa-demo-nil1729.cloudfunctions.net';
const GEOCODING_API_URL = 'https://us1.locationiq.com/v1/reverse.php';
const vapidPublicKey =
	'BP4PlsYeQd4Wg6Mqn-o48s6mtktxM2EexAHHBVzplZqUUt8BSooje8UcRnmcAKhPBC6ETLlx21-MiX2yYu9UUnw';
const GEOCODING_API_KEY = 'pk.7b5b75ce36499da797a396dac9a449cc';

const dbPromise = idb.openDB('Posts', 1, {
	upgrade(db) {
		if (!db.objectStoreNames.contains('feed-posts')) {
			db.createObjectStore('feed-posts', {
				keyPath: 'id',
			});
		}
		if (!db.objectStoreNames.contains('sync-posts') && window.SyncManager) {
			db.createObjectStore('sync-posts', {
				keyPath: 'id',
			});
		}
	},
});

function writeData(storeName, data) {
	return dbPromise.then(function (db) {
		const tx = db.transaction(storeName, 'readwrite');
		const store = tx.objectStore(storeName);
		store.put(data);
		return tx.done;
	});
}

function readData(storeName) {
	return dbPromise.then(function (db) {
		const store = db.transaction(storeName, 'readonly').objectStore(storeName);
		return store.getAll();
	});
}

function clearStore(storeName) {
	return dbPromise.then(function (db) {
		const tx = db.transaction(storeName, 'readwrite');
		const store = tx.objectStore(storeName);
		store.clear();
		return tx.done;
	});
}

function clearItemFromStore(storeName, key) {
	dbPromise
		.then(function (db) {
			const tx = db.transaction(storeName, 'readwrite');
			const store = tx.objectStore(storeName);
			store.delete(key);
			return tx.done;
		})
		.then(function () {
			console.log('Item Deleted!');
		});
}

function urlBase64ToUint8Array(base64String) {
	var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

	var rawData = window.atob(base64);
	var outputArray = new Uint8Array(rawData.length);

	for (var i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function dataURItoBlob(dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	var byteString = atob(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length);

	// create a view into the buffer
	var ia = new Uint8Array(ab);

	// set the bytes of the buffer to the correct values
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	var blob = new Blob([ab], { type: mimeString });
	return blob;
}
