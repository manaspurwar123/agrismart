const CACHE_NAME = 'agrismart-v1';
const OFFLINE_URL = '/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) {
    // For API calls, network first, fallback to cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
           const clonedResponse = response.clone();
           caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clonedResponse));
           return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // For static assets, cache first, fallback to network
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      }).catch(() => caches.match(OFFLINE_URL))
    );
  }
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[SW] Background sync triggered');
  // In a real scenario, this would get data from IndexedDB and POST it to /api/offline/sync
}
