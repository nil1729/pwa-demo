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

- The web app is not already installed
- Has a **web manifest** file with:

  - a `short_name` (used on the home screen)
  - a `name` (used on the banner)
  - a `144x144 png` icon (the icon declarations must include a mime type of `image/png`)
  - a `start_url` that loads
  - `display` - must be one of **fullscreen**, **standalone**, or **minimal-ui**
  - `prefer_related_applications` must not be present, or be false

- Has a **Service Worker** registered on the Site.
- Is served over **HTTPS** (a requirement for using Service Worker).
- Meets a user engagement heuristic

---

- **Other Browsers criteria for showing the install banner is almost same. See criteria [here](https://web.dev/install-criteria/)**
- **Changing the default installation behavior of Add to Home Screen Banner. Docs [here](https://developers.google.com/web/updates/2018/06/a2hs-updates)**
