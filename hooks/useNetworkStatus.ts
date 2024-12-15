import { useState, useEffect } from 'react';

// Хук для отслеживания статуса сети (онлайн/оффлайн)
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Добавляем слушатели событий для изменения статуса сети
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Очистка слушателей при размонтировании компонента
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
