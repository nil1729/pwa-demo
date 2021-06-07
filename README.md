## Web Push Notifications

- Notify Web Apps about important Events!
- Show up even if App (and Browser!) is Closed! Drive User Engagement. Mobile App-like Experience
- > ![slide-1](./slides/1.jpeg)

- We are going to use Firebase Functions for saving endpoints of Subscriptions and sending Notifications to subscribers

  - > Displaying Notification

    - No **push** Event needs to be triggered to display notifications
    - **Notification API**
      - Create Notification in Web App
      - We can set Title, body & more via this API
      - We can use Page Javascript or Service Worker (Necessary when working with **push** Event)
    - **Code for this Example**

      ```
        function displayNotification() {

          if (navigator.serviceWorker) {

            const options = {
              body: 'You successfully subscribed to our Notification Services',
              icon: '<- Icon Src Path ->',
              image: '<- Image Src Path (If we want to show an Image)->',
              dir: 'ltr',
              lang: 'en-US',
              vibrate: [<- Time Interval->],
              badge: '<- Icon Src Path ->',
              tag: '<- Notification Tag for Grouping->',
              renotify: true,
              actions: [
              	{ action: '<- Unique Action Name->', title: '<- Action Title which will be shown to User->', icon: '<- Icon Src Path ->' },
              	...
              ],
            };

            return navigator.serviceWorker.ready.then(function (sw) {
              sw.showNotification('<- Notification Title->', options);
            });

          }
        }
      ```

  - > Asking for Notification Permission

    - By default Browser don't allow us to send notification without permission of the User. So we have to ask users to allow notification for the Current Site
    - **Code for this Example**

      ```
        function askForNotificationPermissions() {

          if (Notification.permission === 'default') {

            Notification.requestPermission().then(function (result) {

              // result -> ['granted', 'denied'];

              if (result === 'granted') {

                // Show Some confirmation Messages to Users

              }

            });

          } else if (Notification.permission === 'denied') {

            // Show Some alert message to enable Notification and guide users to enable Notification via Browser Setting

          } else {

            // Showing some messages to alert users that the user already enabled the Notification

          };

        }
      ```

  - > Listening to Notifications' Actions

    - **Code for this Example**

      ```
        self.addEventListener('notificationclick', function (event) {
          let notification = event.notification;

          if (event.action === <- Unique Action Name ->) {
            event.waitUntil(

              // Finding appropriate all tabs or window which currently opened with this website
              clients.matchAll().
                then(function (clientList) {

                  // Finding if any tab currently opened with this website
                  let client = clientList.find(function (it) {
                    return it.visibilityState === 'visible';
                  });

                  // If website is currently open
                  if (client) {

                    // Navigate to a Specific page
                    client.navigate(<- URL for that page ->);
                    client.focus();

                  } else {

                    // Open the Website with appropriate page open
                    clients.openWindow(<- URL for that page ->);
                  }

                // Closing Notification
                notification.close();
              })
            );
          } else notification.close();
        });

        self.addEventListener('notificationclose', function (event) {

          // Do some analytics stuffs

        });
      ```

  - > Add Subscription for a Particular Browser

    - For Sending Push Notification from our Server to Vendor Server we will use `web-push` module.
    - For Generating Public Keys run this command `web-push generate-vapid-keys`. It will give us a Public Key (for using it on Browser) and other is Private key (we will store it for now and will use it with Firebase Functions)
    - **Code for this Example**

      ```
        async function addSubscription() {

          if (navigator.serviceWorker) {
            let swReg;

            return navigator.serviceWorker.ready
              .then(function (sw) {

                swReg = sw;
                return sw.pushManager.getSubscription();

              })
              .then(function (subscription) {

                if (subscription === null) {

                  return swReg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(<- Vapid Public Key->),
                  });

                } else {

                  // We can check this subscription exists on out database or not

                }

              })
              .then(function (newSubscription) {

                return fetch(<- Subscription URL ->, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                  body: JSON.stringify(<- New Subscription ->),
                });

              })
              .then(function (res) {
                if (res.ok) {
                  // Show some confirmation Messages
                }
              })
              .catch(function (err) {
                // Show Some Error Messages
              });
          }
        }
      ```

  - > Listening to **Push** Events

    - **Code for this Example**

      ```
        self.addEventListener('push', function (event) {

          // Create some fallback data (If server fails to send data)
          let data = {
            title: '<- Notification Title ->',
            ...
          };

          // If server send some data
          if (event.data) {
            data = JSON.parse(event.data.text());
          }

          const options = {
            body: ...,
            icon: ...,
            image: ..,
            dir: 'ltr',
            lang: 'en-US',
            vibrate: [...],
            badge: ...,
            tag: '<- Notification tag (if any) ->',
            renotify: false,
            actions: [
              { action: '...', title: '...', icon: '...' },
              ...
            ],

            // Custom data for Handling Notification Clicks
            data: {
              ...
            },
          };

          event.waitUntil(self.registration.showNotification(<- Notification Title ->, options));
        });
      ```

### Helpful Links

- [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/notification)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Web-Push Module](https://www.npmjs.com/package/web-push)
- [Vapid Information](https://blog.mozilla.org/services/2016/08/23/sending-vapid-identified-webpush-notifications-via-mozillas-push-service/)
