import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Car, MessageCircle, Eye, Layers, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { capitalizeAndFixAccent } from '@/utils/capitalize';

interface PropertyCardProps {
  property: {
    id: number;
    titulo: string;
    descripcion?: string;
    area_construida?: string | number;
    area_total?: string | number;
    superficie_lote?: string | number;
    frente?: string | number;
    fondo?: string | number;
    habitaciones?: string | number;
    banos?: string | number;
    garages?: string | number;
    direccion: string;
    tipos_propiedad?: { nombre: string };
    ubicaciones?: { ciudad?: string; barrio?: string };
    imagenes_propiedad?: Array<{ url_imagen: string; es_principal: boolean; orden: number }>;
    operaciones_propiedad?: Array<{
      precio: number;
      moneda: string;
      tipo_operacion?: { nombre: string };
      disponible?: boolean;
    }>;
    usuarios?: { nombre: string; apellido: string; telefono?: string; email?: string };
  };
  onContact?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onContact }) => {
  const navigate = useNavigate();

  console.log('PropertyCard property:', property);
  if (property.operaciones_propiedad) {
    console.log('operaciones_propiedad[0]:', property.operaciones_propiedad[0]);
    if (property.operaciones_propiedad[0]) {
      console.log('tipo_operacion:', property.operaciones_propiedad[0].tipo_operacion);
    }
  }
  if (property.tipos_propiedad) {
    console.log('tipos_propiedad:', property.tipos_propiedad);
  }

  // Imagen principal
  const imagenPrincipal =
    property.imagenes_propiedad?.find((img) => img.es_principal) ||
    property.imagenes_propiedad?.[0];
  const imageSrc = imagenPrincipal?.url_imagen || '/logo_grande_fondo_azul.png';

  const operacion = property.operaciones_propiedad?.[0];
  // Soporta ambos nombres, igual que en PropertyDetail
  const tipoOperacion =
    operacion?.tipo_operacion?.nombre
      ? capitalizeAndFixAccent(operacion.tipo_operacion.nombre)
      : operacion?.tipos_operacion?.nombre
        ? capitalizeAndFixAccent(operacion.tipos_operacion.nombre)
        : '';

  const tipoProp = property.tipos_propiedad?.nombre
    ? capitalizeAndFixAccent(property.tipos_propiedad.nombre)
    : '';

  // Ubicación
  const ubicacion =
    [property.ubicaciones?.ciudad, property.ubicaciones?.barrio]
      .filter(Boolean)
      .join(' - ') || '';

  // Título
  const titulo = property.titulo;

  // Precio
  const formatPrice = (precio: number, moneda: string) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: moneda === 'USD' ? 'USD' : 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio);
  const precio = operacion ? formatPrice(operacion.precio, operacion.moneda) : 'Consultar';

  // WhatsApp link con mensaje personalizado y link directo
  const propertyUrl = `${window.location.origin}/propiedad/${property.id}`;
  const whatsappMessage = `Hola! Me interesa obtener más información sobre la propiedad: ${titulo}. Puedes ver la propiedad aquí: ${propertyUrl}`;
  const whatsappLink = `https://wa.me/5493515155669?text=${encodeURIComponent(whatsappMessage)}`;

  // handleCardClick removido - ahora solo elementos específicos son clickeables

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se ejecute handleCardClick
    // WhatsApp se abre en nueva pestaña automáticamente
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    if (onContact) {
      onContact();
    }
  };

  const handleVerMasClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Previene cualquier comportamiento por defecto
    e.stopPropagation(); // Evita que se ejecute handleCardClick
    // Abrir en nueva pestaña (igual que Properties.tsx)
    window.open(`/propiedad/${property.id}`, '_blank');
  };

  return (
    <Card className="group bg-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 min-h-[140px] overflow-hidden border border-gray-200 hover:border-[#ec520b]/30">
      {/* Imagen principal */}
      <div
        className="relative cursor-pointer"
        onClick={() => window.open(`/propiedad/${property.id}`, '_blank')}
      >
        <img
          src={imageSrc}
          alt={titulo}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {/* Etiqueta tipo de operación */}
        {tipoOperacion && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#ec520b] text-white shadow">
              {tipoOperacion}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex flex-col gap-2">
        {/* Tipo de propiedad */}
        <div className="flex items-center gap-2 mb-1">
          {tipoProp && (
            <Badge className="bg-[#022550] text-white font-medium">{tipoProp}</Badge>
          )}
        </div>
        
        {/* Ubicación y dirección */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-[#ec520b]" />
          <span>
            {ubicacion}
            {property.direccion && (
              <span className="ml-2 text-xs text-gray-500 font-normal">| {property.direccion}</span>
            )}
          </span>
        </div>
        
        {/* Título */}
        <h3 
          className="font-semibold text-lg text-[#022550] line-clamp-1 cursor-pointer hover:text-[#ec520b] transition-colors"
          onClick={() => window.open(`/propiedad/${property.id}`, '_blank')}
        >
          {titulo}
        </h3>
        
        {/* Características principales */}
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
          {/* Superficie de lote - prioritaria para lotes/terrenos */}
          {property.superficie_lote && Number(property.superficie_lote) !== 0 && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-[#ec520b]" />
              <span>{property.superficie_lote} m² lote</span>
            </div>
          )}
          
          {/* Dimensiones del lote (frente x fondo) */}
          {property.frente && property.fondo && Number(property.frente) !== 0 && Number(property.fondo) !== 0 && (
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4 text-[#022550]" />
              <span>{property.frente}x{property.fondo}m</span>
            </div>
          )}

          {/* Superficie total (solo si no hay superficie_lote) */}
          {property.area_total && Number(property.area_total) !== 0 && !property.superficie_lote && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-[#ec520b]" />
              <span>{property.area_total} m²</span>
            </div>
          )}
          
          {/* Superficie cubierta/construida con icono Layers */}
          {property.area_construida && Number(property.area_construida) !== 0 && (
            <div className="flex items-center gap-1">
              <Layers className="h-4 w-4 text-[#022550]" />
              <span>{property.area_construida} m² cub.</span>
            </div>
          )}
          
          {property.habitaciones && Number(property.habitaciones) !== 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-[#ec520b]" />
              <span>{property.habitaciones}</span>
            </div>
          )}
          {property.banos && Number(property.banos) !== 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-[#ec520b]" />
              <span>{property.banos}</span>
            </div>
          )}
          {property.garages && Number(property.garages) !== 0 && (
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4 text-[#022550]" />
              <span>{property.garages}</span>
            </div>
          )}
        </div>
        
        {/* Precio */}
        <div className="text-xl font-bold text-[#ec520b] mt-2">{precio}</div>
        
        {/* Botones de acción */}
        <div className="flex gap-2 mt-3" data-interactive="true">
          <Button
            onClick={handleVerMasClick}
            variant="outline"
            type="button"
            className="flex-1 border-[#022550] text-[#022550] hover:bg-[#022550] hover:text-white transition-all duration-300 font-medium"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver +
          </Button>
          
          <Button 
            onClick={handleWhatsAppClick}
            className="flex-1 bg-[#ec520b] hover:bg-[#022550] text-white transition-all duration-300 font-medium"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;