# 🗺️ PropertyMap Component

Componente modular y reutilizable para mostrar mapas de ubicación de propiedades usando **Leaflet** y **React-Leaflet**.

## 📦 Tecnologías

- **Leaflet**: Librería de mapas JavaScript de código abierto
- **React-Leaflet**: Componentes React para Leaflet
- **OpenStreetMap**: Tiles de mapas gratuitos

## 🎨 Características

- ✅ **Marcador personalizado** con icono naranja corporativo
- ✅ **Popup informativo** con título y dirección de la propiedad
- ✅ **Badge de ubicación** en la esquina superior izquierda
- ✅ **Instrucciones de zoom** con Ctrl + Scroll
- ✅ **Responsive** y adaptable a diferentes tamaños
- ✅ **Estilos corporativos** con colores #ec520b (naranja) y #022550 (azul)
- ✅ **Altura configurable** mediante props
- ✅ **Zoom configurable** para diferentes tipos de propiedades

## 🔧 Props

```typescript
interface PropertyMapProps {
  latitude: number;           // Latitud de la propiedad (requerido)
  longitude: number;          // Longitud de la propiedad (requerido)
  title: string;              // Título de la propiedad (requerido)
  address: string;            // Dirección completa (requerido)
  zoom?: number;              // Nivel de zoom (default: 16)
  height?: string;            // Altura del mapa (default: '400px')
  className?: string;         // Clases CSS adicionales
}
```

## 📋 Uso básico

```tsx
import PropertyMap from '@/components/PropertyMap';

<PropertyMap
  latitude={-31.4201}
  longitude={-64.1888}
  title="Casa en Venta - Córdoba"
  address="Av. Colón 123, Centro, Córdoba"
  zoom={16}
  height="400px"
/>
```

## 🎯 Uso en PropertyDetail

El componente se integra automáticamente en la página de detalle de propiedades:

```tsx
{propiedad.latitud && propiedad.longitud && (
  <div className="mt-8">
    <h2 className="text-2xl font-bold text-[#022550] mb-6 flex items-center gap-2">
      <MapPin className="h-6 w-6 text-[#ec520b]" />
      Ubicación en el mapa
    </h2>
    <PropertyMap
      latitude={propiedad.latitud}
      longitude={propiedad.longitud}
      title={propiedad.titulo}
      address={ubicacionCompleta}
      zoom={16}
      height="400px"
    />
  </div>
)}
```

## 🌍 Configuración de zoom recomendada

- **Propiedades urbanas**: `zoom={16}` - Vista detallada de la calle
- **Propiedades suburbanas**: `zoom={14}` - Vista del barrio
- **Propiedades rurales/campos**: `zoom={12}` - Vista panorámica del área

## 🎨 Personalización

### Cambiar el icono del marcador

Edita la constante `customIcon` en `PropertyMap.tsx`:

```typescript
const customIcon = new L.Icon({
  iconUrl: 'URL_DE_TU_ICONO',
  shadowUrl: 'URL_DE_SOMBRA',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
```

### Cambiar el proveedor de tiles

Reemplaza en el componente `TileLayer`:

```tsx
<TileLayer
  attribution='Tu atribución'
  url="https://tu-proveedor/{z}/{x}/{y}.png"
/>
```

Proveedores alternativos:
- **Mapbox**: Requiere API key, estilo premium
- **CartoDB**: Estilo limpio y minimalista
- **Stamen**: Estilos artísticos (Watercolor, Toner)

## 🐛 Troubleshooting

### Los iconos no se muestran

Asegúrate de que el CSS de Leaflet esté importado en `index.css`:

```css
@import 'leaflet/dist/leaflet.css';
```

### El mapa no se renderiza correctamente

Llama a `invalidateSize()` después de cambios en el contenedor:

```typescript
useEffect(() => {
  if (mapRef.current) {
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 100);
  }
}, []);
```

### Error "delete operator"

Agrega el comentario de ESLint:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
```

## 📦 Dependencias

```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.12"
  }
}
```

## 🔒 Ventajas sobre Google Maps

- ✅ **Gratis** sin límites de uso
- ✅ **Sin API key** necesaria
- ✅ **Open source** y personalizable
- ✅ **Ligero** y rápido
- ✅ **GDPR compliant** sin tracking externo

## 🚀 Futuras mejoras

- [ ] Agregar controles de zoom personalizados
- [ ] Integrar Street View (si disponible en la zona)
- [ ] Agregar marcadores de puntos de interés cercanos
- [ ] Calcular distancias a servicios (escuelas, hospitales, etc.)
- [ ] Modo oscuro para el mapa
- [ ] Exportar ubicación como imagen
