const CACHE_NAME = 'my-app-cache-v1'
const STATIC_FILES = [
   '/dist/',
   '/dist/index.html',
   '/dist/assets/images/favicon.png',
   '/dist/manifest.json',
   '/dist/metadata.json',
   '/dist/_sitemap.html',
   '/dist/+not-found.html',
   '/dist/AddTransaction.html',
   '/dist/AnalyticsScreen.html',
   '/dist/TransactionContext.html',
   '/dist/_expo/static/js/entry-98c524306db50a5823efa7739e775bbe.js',
   '/dist/reducers/transactionReducer.ts',
   '/dist/scripts/locationHandler.ts',
   '/dist/styles/addStyles.ts',
   '/dist/styles/analyticsStyles.ts',
   '/dist/styles/customModalStyles.ts',
   '/dist/styles/homeScreenStyles.ts',
   '/dist/styles/layoutStyles.ts',
   '/dist/styles/offlineScreenStyles.ts',
   '/dist'
]

self.addEventListener('install', event => {
   event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
         console.log('Caching static files...');
         return cache.addAll(STATIC_FILES);
      })
   );
});

self.addEventListener('activate', event => {
   console.log('Service Worker activated...');
   event.waitUntil(
      caches.keys().then(cacheNames => {
         return Promise.all(
            cacheNames.map(cacheName => {
               if (cacheName !== CACHE_NAME) {
                  console.log(`Deleting old cache: ${cacheName}`);
                  return caches.delete(cacheName);
               }
            })
         );
      })
   );
});

self.addEventListener('fetch', event => {
   const url = new URL(event.request.url);

   if (url.pathname === '/' || url.pathname.endsWith('index.html')) {
      event.respondWith(
         caches.match('/dist/index.html').then(cachedResponse => {
            return cachedResponse || fetch(event.request).then(response => {
               // Кэшируем новую версию index.html
               return caches.open(CACHE_NAME).then(cache => {
                  cache.put('/dist/index.html', response.clone());
                  return response;
               });
            }).catch(() => {
               return caches.match('/dist/index.html');
            });
         })
      );
   } else if (url.pathname.startsWith('/dist/') || STATIC_FILES.includes(url.pathname)) {
      event.respondWith(
         caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request).then(response => {
               return caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, response.clone());
                  return response;
               });
            });
         })
      );
   } else if (url.origin === 'https://67135de66c5f5ced66262fd3.mockapi.io') {
      event.respondWith(
         fetch(event.request).then(response => {
            if (response.ok) {
               return caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, response.clone());
                  return response;
               });
            }
            return response;
         }).catch(() => caches.match(event.request))
      );
   }
});