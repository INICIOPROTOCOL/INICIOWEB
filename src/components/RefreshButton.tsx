import React from 'react';
import { useForceRefresh } from '@/hooks/useForceRefresh';

/**
 * Componente RefreshButton para agregar al footer
 * Permite a los usuarios actualizar manualmente el contenido
 */
const RefreshButton: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { clearCache } = useForceRefresh();

  return (
    <button
      onClick={clearCache}
      className={`text-xs text-gray-500 hover:text-gray-700 transition-colors ${className}`}
      title="Actualizar contenido y limpiar caché"
    >
      🔄 Actualizar
    </button>
  );
};

export default RefreshButton;