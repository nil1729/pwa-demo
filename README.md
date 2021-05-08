## Web App Manifest

- Make our App installable
- It is a **JSON file** that contains some information about our Web App (**manifest.json**)
- ```
   {
       "name": "PWAGram - Image sharing App",   // Long name of app (e.g. on Splash Screen)
       "short_name": "PWAGram",    // Short name of app (e.g. below Icon)
       "start_url": "/index.html",    // Which page to load on startup
       "scope": ".",    // Which pages are included in "PWA Experience"
       "display": "standalone",    // Should it look like a standalone app?
       "background_color": "#ffffff",    // Background whilst loading & on Splash Screen
       "theme_color": "#3F51B5",    // Theme color (e.g. on top bar in task switcher)
       "description": "PWAGram, Where we can share our moments with all of our Friends",    // Description (e.g. as favorite)
       "dir": "ltr",    // Read direction of our app
       "lang" "en-US",    // Main language of App
       "orientation": "portrait-primary",    // Set (and enforce) default orientation
       "icons": [    // Icons for the application (e.g. to be shown on Home Screen)
           ...,
           {
               "src": "/src/images/icons/app-icon-48x48.png"    // icon path
               "type": "image/png"    // Image type
               "sizes": "48x48"    // Icon size, browser chooses best one for given device
           }
           ...,
       ],
       "related_applications": [
           {
               "platform": "play",
               "url": "https://play.google.com/store/apps/details?id=com.example.app1",
               "id": "com.example.app1"
           }
       ]
   }
  ```

- But Older browsers like internet explorer don't support this feature. But we can add some meta tags for better user experiences
  - `<meta name="msapplication-TileImage" content="<Icon Src Path>" />`
  - `<meta name="msapplication-TileColor" content="<Hex Color Code>" />`
  - `<meta name="theme-color" content="<Hex color code>" />` (Although it is supported by chrome also if something went wrong with **manifest.json** file)
- Safari (iOS/Mac) also don't have support for this feature. We can add some meta tags for the same
  - `<meta name="apple-mobile-web-app-capable" content="yes" />`
  - `<meta name="apple-mobile-web-app-status-bar-style" content="black" />`
  - `<meta name="apple-mobile-web-app-title" content="<overwritten title>" />`
  - `<link rel="apple-touch-icon" href="<apple-icon src path>" sizes="<dimensions eg. 120x120>" />`
