## Workbox

- Workbox is a high-level service worker toolkit built on top of the Service Worker and Cache Storage APIs. It provides a production-ready set of libraries for adding offline support to web apps.

- We are going to use Workbox-Sw module for this project.

  - > Install Workbox-Cli and Setup Instructions
    - `npm install --save-dev workbox-cli`
    - In `package.json` setup some scripts to generate Service Worker File
      ```
      ...
      "scripts": {
          ...
          "generateSW": "workbox wizard --injectManifest",
          "buildSW": "workbox injectManifest workbox-config.js",
          ...
        }
        ...
      ```
    - Workbox Config File Setup
      ```
        module.exports = {
          globDirectory: '<- Directory Path which will be hosted later on ->',
          globPatterns: [
            <- All static files that we want to precache ->
          ],
          swDest: '<- Service Worker Destination Path ->',
          swSrc: '<- Service Worker that contains other functionality eg. Push Notifications (Base SW File) ->',
          globIgnores: [<- Files or directory which we don't want to precache ->],
        };
      ```
    - Workbox-Sw File [Download](https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js) and import it on Sw-Base file.
      - With this we’ll have the workbox namespace in our service worker that will provide access to all of the Workbox modules. eg. `workbox.precaching.*`, `workbox.routing.*`, etc.
      ```
        importScript('/workbox-sw.js')
      ```
  - Working With Workbox Caching Strategies

    - Precaching all Static Files we mentioned earlier on our workbox-config File
      - **Code**
        ```
          workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
        ```
    - Caching only Google Fonts

      - **Code**

      ```
       workbox.routing.registerRoute(
         ({ url }) =>
           url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',

         new workbox.strategies.StaleWhileRevalidate({

           cacheName: '<- Cache Name specifically for Fonts ->',

           plugins: [

             new workbox.expiration.ExpirationPlugin({
               maxAgeSeconds: <- Time Interval (in Seconds) ->, // By this Plugin, we can set a time limit after which service worker automatically delete the old Caches
             }),

           ],

         })
       );
      ```

    - Caching Uploaded (Firebase Storage) Images

      - **Code**

        ```
          workbox.routing.registerRoute(
            ({ request, url }) =>
              request.destination === 'image' && url.origin === 'https://storage.googleapis.com',

            new workbox.strategies.CacheFirst({

              cacheName: '<- Cache Name specifically for Storage Images ->',

              plugins: [

                new workbox.expiration.ExpirationPlugin({
                  maxAgeSeconds: <- Time Interval (in Seconds) ->,
                  maxEntries: <- Max entries Count ->, // By this Plugin, We can only store up to a specified number of entries in that Cache
                }),

                new workbox.cacheableResponse.CacheableResponsePlugin({
                  statuses: [0, 200], // By this Plugin, We can only store the request resource which respond with successful 200 status code
                }),
              ],
            })
          );
        ```

    - Caching Theme CSS

      - **Code**

        ```
          workbox.routing.registerRoute(
            '<- CSS Cdn ->',
            new workbox.strategies.StaleWhileRevalidate({

              cacheName: '<- Cache name for this purpose ->',

              plugins: [

                new workbox.expiration.ExpirationPlugin({
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                  maxEntries: 1,
                }),

              ],
            })
          );
        ```

      - Custom Caching Strategy with Workbox

        - **Code**

        ```
          workbox.routing.registerRoute(<- Server URL for getting resources ->, async function (args) {

            return fetch(args.request).then(function (res) {
              const clonedResponse = res.clone();

              // Do: Store JSON Data on Indexed DB

              return res;
            });
         });
        ```

      - Fallback Setup for Offline (Via Network Only Strategy)

        - **Code**

        ```
          if (workbox.navigationPreload.isSupported()) {
            workbox.navigationPreload.enable();
          }

          workbox.routing.registerRoute(
            ({ request }) => request.mode === 'navigate',

            async function ({ event }) {

              return fetch(event.request).catch(function () {
                return workbox.precaching.matchPrecache(<- Fallback HTML Path src ->);
              });

            }
          );
        ```

      - Other Fallbacks for Offline Support (eg. Image)

        - **Code**

          ```
            workbox.routing.setCatchHandler(async ({ event }) => {

              switch (event.request.destination) {

                case 'image':
                  return workbox.precaching.matchPrecache(<- Fallback Image Path src ->);
                  break;

                default:
                  return Response.error();
              }
            });
          ```

      - Background Sync Via Workbox

        - **Code**

          ```
            const bgSyncPluginForSendingPost = new workbox
                                                .backgroundSync
                                                .BackgroundSyncPlugin(
                                                  '<-Sync Tag Name->',
                                                  {
                                                    maxRetentionTime: 24 * 60,
                                                  });

            workbox.routing.registerRoute(
              <- Request URL ->,

              new workbox.strategies.NetworkOnly({
                plugins: [bgSyncPluginForSendingPost],
              }),

              'POST' // HTTP Method
            );
          ```

### Helpful Links

- [Workbox Cli](https://developers.google.com/web/tools/workbox/modules/workbox-cli)
- [Workbox SW](https://developers.google.com/web/tools/workbox/modules/workbox-sw)
- [Workbox SW Packages](https://developers.google.com/web/tools/workbox/modules)
