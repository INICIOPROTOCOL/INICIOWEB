import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix para el icono por defecto de Leaflet (bug conocido con Webpack/Vite)
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

  useEffect(() => {
    // Solo inicializar si no existe el mapa
    if (mapContainerRef.current && !mapRef.current) {
      // Crear el mapa con Leaflet directamente (sin react-leaflet)
      const map = L.map(mapContainerRef.current).setView([latitude, longitude], zoom);

      // Añadir capa de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Añadir marcador
      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

      // Añadir popup
      marker.bindPopup(`
        <div class="font-montserrat p-2">
          <h3 class="font-bold text-[#022550] mb-1 text-sm">${title}</h3>
          <p class="text-gray-600 text-xs flex items-start gap-1">
            <span>📍 ${address}</span>
          </p>
        </div>
      `);

      // Deshabilitar scroll wheel zoom
      map.scrollWheelZoom.disable();

      // Guardar referencia
      mapRef.current = map;

      // Ajustar tamaño después de montaje
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, title, address, zoom]);

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#022550]/10 ${className}`}>
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
