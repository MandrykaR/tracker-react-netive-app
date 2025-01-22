const CACHE_NAME = 'my-app-cache-v1'

const STATIC_FILES = [
	'/',
	'/index.html',
	'/manifest.json',
	'/+not-found.html',
	'/AddTransaction',
	'/AnalyticsScreen',
	'/TransactionContext',
	'/register-sw.js',
]

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(STATIC_FILES).catch(error => {
				console.error('Error during caching static files:', error)
				throw error
			})
		})
	)
})

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (cacheName !== CACHE_NAME) {
						console.log('Deleting old cache: ${cacheName}')
						return caches.delete(cacheName)
					}
				})
			)
		})
	)
	self.clients.claim()
})

self.addEventListener('fetch', event => {
	const url = new URL(event.request.url)

	if (url.pathname.startsWith('/_expo/static/js/web')) {
		event.respondWith(
			caches.match(event.request).then(cachedResponse => {
				return (
					cachedResponse ||
					fetch(event.request)
						.then(networkResponse => {
							if (networkResponse && networkResponse.status === 200) {
								return caches.open(CACHE_NAME).then(cache => {
									cache.put(event.request, networkResponse.clone())
									return networkResponse
								})
							} else {
								return caches.match('/+not-found.html')
							}
						})
						.catch(() => caches.match('/+not-found.html'))
				)
			})
		)
	} else if (STATIC_FILES.includes(url.pathname)) {
		event.respondWith(
			caches.match(event.request).then(cachedResponse => {
				return (
					cachedResponse ||
					fetch(event.request)
						.then(networkResponse => {
							if (networkResponse && networkResponse.status === 200) {
								caches.open(CACHE_NAME).then(cache => {
									cache.put(event.request, networkResponse.clone())
								})
								return networkResponse
							}
						})
						.catch(() => caches.match('/+not-found.html'))
				)
			})
		)
	} else {
		event.respondWith(async () =>
			caches.match(event.request).then(async cachedResponse => {
				return (
					cachedResponse ||
					fetch(event.request)
						.then(networkResponse => {
							if (networkResponse && networkResponse.status === 200) {
								return networkResponse
							}
						})
						.catch(() => caches.match('/index.html'))
				)
			})
		)
	}
})
