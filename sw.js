var cacheName = 'pushupscounter-v6'
var contentToCache = [
  '/',
  '/index.html',
  '/js/pouchdb.min.js',
  '/js/app.js',
  '/css/app.css',
  '/icons/icon-32.png',
  '/icons/icon-64.png',
  '/icons/icon-128.png',
  '/icons/icon-192.png',
  '/icons/icon-256.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  console.log('[Service Worker] install');
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache);
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] fetch');

  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', (e) => {
  console.log('[Service Worker] activate');

  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if(cacheName.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
