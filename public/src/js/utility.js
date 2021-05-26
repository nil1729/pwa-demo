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
