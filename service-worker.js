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
	const url = event.request.url
	console.log('Fetching:', url)

	if (url.startsWith('https://67135de66c5f5ced66262fd3.mockapi.io/money')) {
		event.respondWith(
			caches.match(event.request).then(cachedResponse => {
				if (cachedResponse) {
					return cachedResponse
				}

				return fetch(event.request)
					.then(response => {
						if (response.ok) {
							caches.open(CACHE_NAME).then(cache => {
								cache.put(event.request, response.clone())
							})
						}
						return response
					})
					.catch(() => {
						return caches.match('/dist/index.html')
					})
			})
		)
	} else {
		event.respondWith(
			caches.match(event.request).then(cachedResponse => {
				return cachedResponse || fetch(event.request)
			})
		)
	}
})
