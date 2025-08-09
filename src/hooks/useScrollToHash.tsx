import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Si hay hash, scroll a la sección específica
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 500);
      }
    } else {
      // Si no hay hash, SIEMPRE ir al inicio inmediatamente
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [location.pathname, location.hash]); // Escuchar cambios en pathname también
};