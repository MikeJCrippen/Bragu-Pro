
const CACHE_NAME = 'beanlog-v8';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use cache.addAll but catch individual failures to avoid breaking install
      return Promise.allSettled(ASSETS.map(url => cache.add(url)));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // For the large Babel file and Tailwind, prefer cache, then network
  if (event.request.url.includes('unpkg.com') || event.request.url.includes('tailwindcss.com')) {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
    return;
  }

  // For everything else, try network first to get latest updates, fallback to cache
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request) || (
        event.request.mode === 'navigate' ? caches.match('/index.html') : null
      );
    })
  );
});
