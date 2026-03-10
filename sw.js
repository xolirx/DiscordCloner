self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response.status === 429) {
                    return new Response(null, { status: 429 });
                }
                return response;
            })
            .catch(() => {
                return new Response(null, { 
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            })
    );
});
