if ("serviceWorker" in navigator) {
   navigator.serviceWorker
      .register("/service-worker.js")
      .then(function (registration) {
         console.log("Service worker зарегистрирован:", registration);
      })
      .catch(function (error) {
         console.log("Ошибка при регистрации service worker-а:", error);
      });
} else {
   console.log("Текущий браузер не поддерживает service worker-ы");
}