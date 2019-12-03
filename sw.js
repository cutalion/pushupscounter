var cacheName = 'pushupscounter-v3'
var contentToCache = [
  '/pushupscounter/',
  '/pushupscounter/index.html',
  '/pushupscounter/js/app.js',
  '/pushupscounter/css/app.css',
  '/pushupscounter/icons/icon-32.png',
  '/pushupscounter/icons/icon-64.png',
  '/pushupscounter/icons/icon-128.png',
  '/pushupscounter/icons/icon-192.png',
  '/pushupscounter/icons/icon-256.png',
  '/pushupscounter/icons/icon-512.png',
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
