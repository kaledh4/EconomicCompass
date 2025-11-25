const CACHE_NAME = 'economic-compass-v1';
const urlsToCache = [
  '/EconomicCompass/',
  '/EconomicCompass/static/style.css',
  '/EconomicCompass/static/manifest.json',
  '/EconomicCompass/static/icons/icon-192x192.png',
  '/EconomicCompass/static/icons/icon-256x256.png',
  '/EconomicCompass/static/icons/icon-384x384.png',
  '/EconomicCompass/static/icons/icon-512x512.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  // Only cache requests for EconomicCompass resources
  if (event.request.url.includes('/EconomicCompass/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version or fetch from network
          return response || fetch(event.request);
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});