const CACHE_NAME = 'my-app-cache-v1';
const STATIC_FILES = [
   '/dist/',
   '/dist/index.html',
];

self.addEventListener('install', (event) => {
   console.log('Service Worker installing...');
   event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
         return cache.addAll(STATIC_FILES);
      })
   );
});

self.addEventListener('activate', (event) => {
   console.log('Service Worker activated...');
   event.waitUntil(
      caches.keys().then((cacheNames) => {
         return Promise.all(
            cacheNames.map((cacheName) => {
               if (cacheName !== CACHE_NAME) {
                  return caches.delete(cacheName);
               }
            })
         );
      })
   );
});

self.addEventListener('fetch', (event) => {
   console.log('Fetching:', event.request.url);
   event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
         // Если в кэше есть ресурс, возвращаем его
         if (cachedResponse) {
            return cachedResponse;
         }
         // Если нет, делаем запрос к сети
         return fetch(event.request).then((response) => {
            // Кэшируем ответ, если это возможно
            return caches.open(CACHE_NAME).then((cache) => {
               if (event.request.url.indexOf('http') === 0) {
                  cache.put(event.request, response.clone());
               }
               return response;
            });
         });
      })
   );
});