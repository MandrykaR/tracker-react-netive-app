const CACHE_NAME = 'my-app-cache-v1'
const STATIC_FILES = [
	'/index.html',
	'/assets/images/favicon.png',
	'/manifest.json',
	'/AddTransaction.html',
	'/AnalyticsScreen.html',
	'/TransactionContext.html',
	'/_expo/static/js/web/entry-a022f10703664585793fd973db9c841b.js',
	'/reducers/transactionReducer.ts',
	'/scripts/locationHandler.ts',
	'/styles/addStyles.ts',
	'/styles/analyticsStyles.ts',
	'/styles/customModalStyles.ts',
	'/styles/homeScreenStyles.ts',
	'/styles/layoutStyles.ts',
	'/styles/offlineScreenStyles.ts',
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