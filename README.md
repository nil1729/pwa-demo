## IndexedDB

- IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs. We don't want to store JSON data which are changing too much often. For that Cache Storage may be a good choice to store. But `IndexedDB` gives us some high-performance searches, operations for this data.
- > Dynamic Caching and Caching Dynamic Content  
  > ![slide-1](./slides/1.jpeg)

- > IndexDB Introduction
  > ![slide-2](./slides/2.jpeg)

- We are going to use another third-party library which mostly mirros the `IndexedDB` API but with some improvements, which makes development too much easier.
  - > [IDB Pakage](https://github.com/jakearchibald/idb)
  - > Creating DB Instance
    ```
    const dbPromise = idb.openDB(<- Database Name ->, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(<-Store Name->)) {
                db.createObjectStore(<-Store Name->, {
                    keyPath: 'id',
                });
            }
        },
    });
    ```
  - > Writing Data
    ```
    function writeData(storeName, data) {
        return dbPromise.then(function (db) {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.put(data);
            return tx.done;
        });
    }
    ```
  - > Reading Data
    ```
    function readData(storeName) {
        return dbPromise.then(function (db) {
            const store = db.transaction(storeName, 'readonly').objectStore(storeName);
            return store.getAll();
        });
    }
    ```
  - > Clearing Store Data
    ```
    function clearStore(storeName) {
        return dbPromise.then(function (db) {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.clear();
            return tx.done;
        });
    }
    ```
  - > Deleting Single Item From Store
    ```
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
    ```
