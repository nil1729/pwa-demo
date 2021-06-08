## Native Device Features

- This feature allows our users not to leave our web app to attach some kind of media or something like that. Via Native Device feature like GeoLocation API we can find the user Current Coordinates of location and via Media API we can capture use device camera or microphone.
- > Initializing Media API

  - **Code for this Example**

    ```
      function initializeMedia() {

        if (!navigator.mediaDevices) {
          navigator.mediaDevices = {};
        }

        if (!navigator.mediaDevices.getUserMedia) {

          navigator.mediaDevices.getUserMedia = function (constraints) {

            // Safari or Mozilla Browsers
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

            // Do some stuffs to show the current stream to the User

          })
          .catch(function (err) {

            // Show some error messages or Use another option for that purpose

          });
      }
    ```

- > Accessing GeoLocation API

  - **Code for this Example**

    ```
      function getLocationCoordinates() {

        navigator.geolocation.getCurrentPosition(
          function (position) {

            // Do some stuffs after getting position Coordinates (Use some GeoCoding API to get the formatted Address)

          },
          function (error) {

            // Show Some Error Messages

          },
          {<- Options (If Any) ->}
        );

      }
    ```

### Helpful Links

- [Media API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API)
- [GeoLocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
