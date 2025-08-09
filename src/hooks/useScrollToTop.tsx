import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll al inicio cada vez que cambia la ruta
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
};