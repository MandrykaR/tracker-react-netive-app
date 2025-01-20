const CACHE_NAME = 'my-app-cache-v1'

const STATIC_FILES = [
	'/',
	'/index.html',
	'/manifest.json',
	'/+not-found.html',
	'/AddTransaction.html',
	'/AnalyticsScreen.html',
	'/TransactionContext.html',
]

self.addEventListener('install', event => {
	console.log('Service Worker: Установка')
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(STATIC_FILES).catch(error => {
				console.error('Ошибка при кэшировании статических файлов:', error)
				throw error // Прерываем установку, если кэширование не удалось
			})
		})
	)
})

self.addEventListener('activate', event => {
	console.log('Service Worker: Активация')
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (cacheName !== CACHE_NAME) {
						console.log(`Удаление старого кэша: ${cacheName}`)
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

	if (url.pathname.startsWith('/dist/_expo/static/js/')) {
		// Динамическое кэширование JS-файлов
		event.respondWith(
			fetch(event.request)
				.then(response => {
					if (
						response.ok &&
						response.headers.get('Content-Type').includes('javascript')
					) {
						return caches.open(CACHE_NAME).then(cache => {
							cache.put(event.request, response.clone())
							return response
						})
					} else {
						console.warn(
							'Ожидался JS-файл, но получен другой:',
							event.request.url
						)
						return caches.match('/+not-found.html') // Возвращаем fallback для JS
					}
				})
				.catch(() => {
					console.warn('Ошибка сети при запросе JS-файла:', event.request.url)
					return caches.match('/+not-found.html') // Возвращаем fallback при сетевой ошибке
				})
		)
	} else if (STATIC_FILES.includes(url.pathname)) {
		// Кэширование статических файлов
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
						.catch(() => caches.match('/+not-found.html')) // Обработка сетевых ошибок
				)
			})
		)
	} else {
		// Обработка запросов, которые не попадают в статические файлы (например, SPA)
		event.respondWith(
			caches.match(event.request).then(cachedResponse => {
				return (
					cachedResponse ||
					fetch(event.request)
						.then(networkResponse => {
							if (networkResponse && networkResponse.status === 200) {
								return networkResponse
							}
						})
						.catch(() => caches.match('/index.html')) // Fallback для страниц
				)
			})
		)
	}
})
