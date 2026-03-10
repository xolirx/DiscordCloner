// Service Worker для фоновой синхронизации
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    // Просто проксируем запросы
    event.respondWith(fetch(event.request));
});
