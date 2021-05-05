## PWA (Progressive Web App)

- Access Device Camera
- Push Notifications
- Get User Location
- Background Sync
- Offline Accessibility
- Install on Home Screen

### What are Progressive Web App (PWA)

- Progressively enhance web apps to look and feel like native apps
  1. Be **Reliable**: Load fast and provide offline functionality
  2. **Fast**: Respond quickly to users actions
  3. **Engaging**: Feel like a native app on mobile devices

### Mobile Web Vs Native Apps

- According to **comScore Mobile Matrix 2019** **63%** times People uses their native Mobile Apps and **7%** times on Mobile Web.
- **Why people use most of the time on native Mobile App?**
  1. Push notifications bring users back
  2. Home screen icons make Access Easy
  3. Access Native Device features like Camera, GeoLocation
  4. Possibly Work Offline
- **Do you really want to build a Native App?**
  1. Learn two different Languages
  2. **80%** of the time people spent their time on top most popular Apps like FB, Google, WhatsApp etc.

### PWAs Vs Native Apps Vs "Traditional" Web Pages

| App/Web              | Capability                           | Reach                            |
| -------------------- | ------------------------------------ | -------------------------------- |
| Native Apps          | Access Device features, Leverage OS  | Top popular apps win, Rest Loses |
| Traditional Web Apps | Highly limited Device Feature access | High Reach, No Borders           |
| Progressive Web Apps | Access Device features, Leverage OS  | High Reach, No Borders           |

### PWA - Core Building Blocks

- Service Worker
  - Caching for Offline Support
  - Enable other PWA features
- Background Sync (Sync user data in the Background)
- Web Push (Mobile-like Push Notifications)
- Application Manifest (Allows addition to Home Screen)
- Responsive Design (App/Layout should work and looks good across devices)
- GeoLocation API (Access user location)
- Media API (Access Device Camera and Microphone)

### PWAs and SPAs (Single Page Applications) [Wrong Comparison]

| SPA                                | PWA                                              |
| ---------------------------------- | ------------------------------------------------ |
| Powered by Javascript              | Uses a lot of Javascript (but works without it!) |
| Highly Reactive (to User Input)    | Aims to have high reactivity                     |
| Only one HTML File sent to Browser | Works with multiple files                        |

**SPA can become great PWAs but we can turn any other web page/ app into a PWA!**

### Progressive Enhancement

| Starting Point                                                                     | Near Future                                 | Future                    |
| ---------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------- |
| Existing (legacy) App (Old Technology may be needs to support (very) old browsers) | Add some features                           | Use multiple PWA features |
| Existing "modern" App (Modern Technology, only needs to support modern Browsers)   | Implement some core PWA features            | Completely Convert to PWA |
| Upcoming Project                                                                   | Fully implement as PWA right from the start | Complete PWA              |
