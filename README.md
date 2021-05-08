## Service Workers

- Doing work behind the scenes
- Service Worker Browser Support. See here on [isServiceWorkerReady?](https://jakearchibald.github.io/isserviceworkerready/)

### What are Service Workers?

![sw-1](./slides/1.jpeg)

### "Listenable" Events (in Service Workers)

| Event                    | Source                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------- |
| Fetch                    | Browser or Page-related Javascript initiates a fetch (Http request)                    |
| Push Notifications       | Service Workers receives Web Push Notifications (from Server)                          |
| Notification Interaction | User interacts with displayed Notification                                             |
| Background Sync          | Service Workers receives Background Sync Event (e.g. Internet Connection was restored) |
| Service Worker Lifecycle | Service Worker phase changes                                                           |

### Service Worker Lifecycle

![sw-2](./slides/2.jpeg)

### Criteria for Showing `Install Banner` by Chrome

1. Has a **web manifest** file with:

   - a `short_name` (used on the home screen)
   - a `name` (used on the banner)
   - a `144x144 png` icon (the icon declarations must include a mime type of `image/png`)
   - a `start_url` that loads

2. Has a **Service Worker** registered on the Site.
3. Is served over **HTTPS** (a requirement for using Service Worker).
4. Is visited at least twice, with at least five minutes between visits. (For Older Chrome Versions)  
   (Modern Versions show the banner instantly if all criteria mentioned earlier is fulfilled)
