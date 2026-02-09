import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// 🔧 Fix para el icono por defecto de Leaflet (bug conocido con Vite)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Icono personalizado con colores corporativos
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  zoom?: number;
  height?: string;
  className?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  title,
  address,
  zoom = 16,
  height = '400px',
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Esperar a que el componente esté montado
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Solo inicializar si está montado y no existe el mapa
    if (!isMounted || !mapContainerRef.current || mapRef.current) return;

    try {
      // Crear el mapa
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: zoom,
        scrollWheelZoom: false, // Deshabilitado para evitar zoom sensible con scroll
        zoomControl: false,
        attributionControl: true
      });

      // Agregar capa de tiles de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);

      // Agregar marcador con popup
      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
      
      marker.bindPopup(`
        <div style="font-family: 'Montserrat', sans-serif; min-width: 200px;">
          <h3 style="color: #022550; font-weight: 600; margin: 0 0 8px 0; font-size: 14px;">${title}</h3>
          <p style="color: #666; margin: 0; font-size: 12px; display: flex; align-items: start; gap: 4px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ec520b" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${address}
          </p>
        </div>
      `);

      // Control de zoom en esquina inferior derecha (evita solaparse con el label)
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapRef.current = map;

    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isMounted, latitude, longitude, title, address, zoom]);

  // Loading state mientras se monta el componente
  if (!isMounted) {
    return (
      <div 
        className={`relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#022550]/10 ${className}`}
        style={{ height, width: '100%' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-[#ec520b] animate-pulse mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-montserrat">Cargando mapa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#022550]/10 ${className}`}>
      {/* Badge de ubicación */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#022550] px-3 py-2 rounded-lg shadow-lg z-[1000] flex items-center gap-2">
        <MapPin className="h-4 w-4 text-[#ec520b]" />
        <span className="text-sm font-semibold">Ubicación exacta</span>
      </div>

      {/* Instrucciones de zoom */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-gray-600 px-3 py-1.5 rounded-lg shadow-lg z-[1000] text-xs">
        <span className="hidden sm:inline">Zoom con los botones</span>
        <span className="sm:hidden">Toca y arrastra para mover</span>
      </div>

      {/* Contenedor del mapa */}
      <div 
        ref={mapContainerRef} 
        style={{ height, width: '100%' }}
        className="z-0"
      />
    </div>
  );
};

export default PropertyMap;

