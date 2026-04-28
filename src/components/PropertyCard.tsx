import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Car, MessageCircle, Eye, Layers, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { capitalizeAndFixAccent } from '@/utils/capitalize';
import { trackClickWhatsApp } from '@/utils/googleAnalytics';

interface PropertyCardProps {
  property: {
    id: number;
    tokko_id?: number | null;
    slug: string;
    origen?: string;
    destacada?: boolean;
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
    ubicacion_id?: number;
    tipos_propiedad?: { nombre: string };
    ubicaciones?: { 
      id: number;
      pais: string;
      provincia: string;
      departamento: string | null;
      ciudad: string;
      barrio: string | null;
      codigo_postal: string | null;
    };
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
  
  // Imagen principal
  const imagenPrincipal =
    property.imagenes_propiedad?.find((img) => img.es_principal) ||
    property.imagenes_propiedad?.[0];
  const imageSrc = imagenPrincipal?.url_imagen || '/logo_grande_fondo_azul.png';

  const operacion = property.operaciones_propiedad?.[0];
  const tipoOperacion =
    operacion?.tipo_operacion?.nombre
      ? capitalizeAndFixAccent(operacion.tipo_operacion.nombre)
      : '';

  const tipoProp = property.tipos_propiedad?.nombre
    ? capitalizeAndFixAccent(property.tipos_propiedad.nombre)
    : '';

  // Ubicación - mostrar ciudad y barrio (sin país/provincia)
  const ubicacion = (() => {
    if (property.ubicaciones?.ciudad) {
      const partes = [
        property.ubicaciones.ciudad,
        property.ubicaciones.barrio
      ].filter(Boolean);
      return partes.join(' - ');
    }
    
    // Fallback a dirección si no hay ubicaciones
    if (property.direccion && property.direccion !== 'No especificado') {
      return property.direccion;
    }
    
    return 'Consultar ubicación';
  })();

  // Título
  const titulo = property.titulo;

  // Precio usando colores corporativos
  const formatPrice = (precio: number, moneda: string) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: moneda === 'USD' ? 'USD' : 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio);
  const precio = operacion ? formatPrice(operacion.precio, operacion.moneda) : 'Consultar';

  // WhatsApp link siguiendo las instrucciones del proyecto - USAR SLUG
  const propertyUrl = `${window.location.origin}/propiedad/${property.slug || property.id}`;
  const whatsappMessage = `Hola! Me interesa obtener más información sobre la propiedad: ${titulo}. Puedes ver la propiedad aquí: ${propertyUrl}`;
  const whatsappLink = `https://wa.me/5493515155669?text=${encodeURIComponent(whatsappMessage)}`;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackClickWhatsApp({
      location: 'property_card',
      property_id: property.id,
      property_title: titulo,
    });
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    if (onContact) {
      onContact();
    }
  };

  const handleVerMasClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`/propiedad/${property.slug || property.id}`, '_blank');
  };

  // Función helper para validar números (maneja tanto string como number y Decimal de Prisma)
  const isValidNumber = (value: string | number | null | undefined): boolean => {
    if (value === null || value === undefined || value === '') return false;
    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
    return !isNaN(numValue) && numValue > 0;
  };

  const formatNumber = (value: string | number | null | undefined): string => {
    if (!isValidNumber(value)) return '';
    return typeof value === 'string' ? value : String(value);
  };

  return (
    <Card className="group bg-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 min-h-[140px] overflow-hidden border border-gray-200 hover:border-[#ec520b]/30 h-full flex flex-col">
      {/* Imagen principal */}
      <div
        className="relative cursor-pointer"
        onClick={() => window.open(`/propiedad/${property.slug || property.id}`, '_blank')}
      >
        <img
          src={imageSrc}
          alt={titulo}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        
        {/* Badge de Destacada */}
        {property.destacada && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
            ⭐ Destacada
          </div>
        )}
        
        {/* Etiqueta tipo de operación siguiendo design system */}
        {tipoOperacion && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#ec520b] text-white shadow">
              {tipoOperacion}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-3.5 flex flex-col gap-1 flex-1">
        {/* Tipo de propiedad usando colores corporativos */}
        <div className="flex items-center gap-2 mb-1">
          {tipoProp && (
            <Badge className="bg-[#022550] text-white font-medium">{tipoProp}</Badge>
          )}
        </div>
        
        {/* Ubicación y dirección */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-[#ec520b]" />
          <span className="line-clamp-1">
            {ubicacion}
            {property.direccion && (
              <span className="ml-2 text-xs text-gray-500 font-normal">| {property.direccion}</span>
            )}
          </span>
        </div>
        
        {/* Título con colores corporativos */}
        <h3 
          className="font-semibold text-lg text-[#022550] line-clamp-1 cursor-pointer hover:text-[#ec520b] transition-colors"
          onClick={() => window.open(`/propiedad/${property.slug || property.id}`, '_blank')}
        >
          {titulo}
        </h3>
        
        {/* Características principales - VALIDACIÓN CORREGIDA */}
        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm text-gray-700 h-[64px] overflow-hidden">
          {/* Superficie de lote - Decimal en schema */}
          {isValidNumber(property.superficie_lote) && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-[#ec520b]" />
              <span>{formatNumber(property.superficie_lote)} m² lote</span>
            </div>
          )}
          
          {/* Dimensiones del lote - Decimal en schema */}
          {isValidNumber(property.frente) && isValidNumber(property.fondo) && (
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4 text-[#022550]" />
              <span>{formatNumber(property.frente)}x{formatNumber(property.fondo)}m</span>
            </div>
          )}

          {/* Superficie total - Decimal en schema - solo si no hay superficie_lote */}
          {isValidNumber(property.area_total) && !isValidNumber(property.superficie_lote) && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-[#ec520b]" />
              <span>{formatNumber(property.area_total)} m²</span>
            </div>
          )}
          
          {/* Superficie construida - Decimal en schema */}
          {isValidNumber(property.area_construida) && (
            <div className="flex items-center gap-1">
              <Layers className="h-4 w-4 text-[#022550]" />
              <span>{formatNumber(property.area_construida)} m² cub.</span>
            </div>
          )}
          
          {/* Habitaciones - Int en schema */}
          {isValidNumber(property.habitaciones) && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-[#ec520b]" />
              <span>{formatNumber(property.habitaciones)} hab.</span>
            </div>
          )}

          {/* Baños - Decimal en schema */}
          {isValidNumber(property.banos) && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-[#ec520b]" />
              <span>{formatNumber(property.banos)} baños</span>
            </div>
          )}

          {/* Cocheras - Int en schema */}
          {isValidNumber(property.garages) && (
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4 text-[#022550]" />
              <span>{formatNumber(property.garages)} cocheras</span>
            </div>
          )}
        </div>
        
        {/* Precio usando color corporativo */}
        <div className="text-xl font-bold text-[#ec520b] mt-1.5">{precio}</div>
        
        {/* Botones de acción siguiendo design system */}
        <div className="flex gap-2 mt-2.5" data-interactive="true">
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
