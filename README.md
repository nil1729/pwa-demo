## Service Worker Caching

> Javascript is Non Blocking Single Threaded Language

- ```
   setTimeout(function () {
       console.log('This will execute when the timer is done');  --- this will run after 5 seconds
   }, 5000);

   console.log('This will execute right after the setTimeout()');  --- this will run immediately after the JS file loaded on the browser

  ```

- ```
    let promise = new Promise(function (resolve, reject) {
        // Do some Task which take some time
            resolve(<Resolve Message>) // when successfully task done;
            reject(<Rejection Message>) // when some task fails;
    });

    promise
        .then(function (response) {
            // do some operation on response
        })
        .then(...) // `then` chain if we need some more promise to resolve
        .then(...)
        .then(...)
        .catch(function (e) { // this catch error which may happens any the upper then block
            // Handle the error
        })
        .finally(function () { // it will always run
           // Do some task which independent of success or fails of the promise
        });
  ```

- ```
   fetch(<URL>, {
       method: '<Request Method>',
       ...
       mode: 'cors', // ['no-cors', 'same-origin'],
       cache: 'default', // ['no-cache', 'reload', 'force-cache', 'only-if-cached']
       headers: {
           'Content-Type': 'application/json',
           ...
       },
       body: JSON.stringify(<Data>), // When send a POST/PUT/DELETE request
   })
       .then(function (res) {
           return res.json();
       })
       .then(function (data) {
           // Do something with the fetched data
       })
       .catch(function (e) {
           // Handle Error
       })
       .finally(function () {
           // Do something which independent of the requested data but need to wait for finish fetch
       });

  ```

> **Regular AJAX requests or XHR, or any other third-party `fetch` alternatives cannot be listened to by Service Worker.**

> We need to add some polyfills to enable `fetch` and `promises` on our app to run well in some older Browsers also.

### Helpful Links

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
