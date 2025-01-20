if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/service-worker.js')
		.then(function (registration) {
			console.log('Service worker Registered:', registration)
		})
		.catch(function (error) {
			console.log('Registration error service worker:', error)
		})
} else {
	console.log('The current browser does not support service worker')
}
