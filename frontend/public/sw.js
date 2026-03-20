const CACHE = 'budget-v1';

const STATIC_EXTENSIONS = ['.js', '.css', '.png', '.svg', '.woff2', '.ico'];

function isStaticAsset(url) {
  return STATIC_EXTENSIONS.some(ext => url.pathname.endsWith(ext));
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

// On install: skip waiting immediately so updates activate without the user
// needing to close all tabs. The new SW takes over on next navigation.
self.addEventListener('install', () => {
  self.skipWaiting();
});

// On activate: claim all open clients so the update takes effect right away,
// then clear any caches from previous versions.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API requests: network-first, no caching — always want fresh data.
  if (isApiRequest(url)) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Static hashed assets (JS/CSS with content hashes): cache-first.
  // Vite appends a hash to filenames on build so stale cache is never an issue.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // Navigation requests (HTML): network-first, fall back to cached index.html
  // so the app shell loads offline and React Router handles the route.
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() =>
        caches.match('/index.html')
      )
  );
});
