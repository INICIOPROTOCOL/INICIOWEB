import { useEffect } from 'react';

/**
 * Hook para forzar la actualización de la aplicación y evitar problemas de caché
 * Este hook verifica si hay una nueva versión disponible
 */
export const useForceRefresh = () => {
  useEffect(() => {
    // Función para verificar si hay actualizaciones
    const checkForUpdates = async () => {
      try {
        // Agregar timestamp para evitar caché del navegador
        const timestamp = new Date().getTime();
        const response = await fetch(`/index.html?v=${timestamp}`, {
          method: 'HEAD',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        // Verificar si el ETag o Last-Modified han cambiado
        const etag = response.headers.get('etag');
        const lastModified = response.headers.get('last-modified');
        
        const storedEtag = localStorage.getItem('app-etag');
        const storedLastModified = localStorage.getItem('app-last-modified');

        if (storedEtag && storedLastModified) {
          if (etag !== storedEtag || lastModified !== storedLastModified) {
            console.log('🔄 Nueva versión detectada, recargando...');
            
            // Limpiar caché del navegador
            if ('caches' in window) {
              const cacheNames = await caches.keys();
              await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
              );
            }

            // Forzar recarga sin caché
            window.location.reload();
          }
        }

        // Guardar valores actuales
        if (etag) localStorage.setItem('app-etag', etag);
        if (lastModified) localStorage.setItem('app-last-modified', lastModified);

      } catch (error) {
        console.log('🔍 Error verificando actualizaciones:', error);
      }
    };

    // Verificar inmediatamente y luego cada 5 minutos
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 5 * 60 * 1000);

    // Limpiar interval al desmontar
    return () => clearInterval(interval);
  }, []);

  // Función para limpiar caché manualmente
  const clearCache = async () => {
    try {
      // Limpiar localStorage específico de la app
      localStorage.removeItem('app-etag');
      localStorage.removeItem('app-last-modified');
      
      // Limpiar cache storage si está disponible
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Forzar recarga completa
      window.location.reload();
    } catch (error) {
      console.error('Error limpiando caché:', error);
      // Fallback: recarga normal
      window.location.reload();
    }
  };

  return { clearCache };
};