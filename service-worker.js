const CACHE_NAME = 'my-app-cache-v1'
const STATIC_FILES = [
	'/dist/',
	'/dist/index.html',
	'/dist/favicon.ico',
	'/dist/manifest.json',
	'/dist/metadata.json',
	'/dist/_sitemap.html',
	'/dist/+not-found.html',
	'/dist/AddTransaction.html',
	'/dist/AnalyticsScreen.html',
	'/dist/OfflineScreen.html',
	'/dist/ReportsScreen.html',
	'/dist/TransactionContext.html',
	'/dist/_expo/static/js/entry-98c524306db50a5823efa7739e775bbe.js',
]

self.addEventListener('install', event => {
	console.log('Service Worker installing...')
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			console.log('Caching static files...')
			return cache.addAll(STATIC_FILES)
		})
	)
})

self.addEventListener('activate', event => {
	console.log('Service Worker activated...')
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (cacheName !== CACHE_NAME) {
						console.log(`Deleting old cache: ${cacheName}`)
						return caches.delete(cacheName)
					}
				})
			)
		})
	)
})

self.addEventListener('fetch', event => {
	console.log('Fetching:', event.request.url)
	if (event.request.url.startsWith('http')) {
		event.respondWith(
			caches.match(event.request).then(cachedResponse => {
				if (cachedResponse) {
					return cachedResponse
				}
				return fetch(event.request)
					.then(response => {
						// Кэшируем новый ресурс
						return caches.open(CACHE_NAME).then(cache => {
							cache.put(event.request, response.clone())
							return response
						})
					})
					.catch(() => caches.match('/dist/index.html'))
			})
		)
	}
})
