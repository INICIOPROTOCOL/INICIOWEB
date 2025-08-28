import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Home, Bed, Bath, Car, Square, Eye, ArrowLeft, ArrowRight, X, MessageCircle, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';

interface PropiedadDetalle {
  id: number;
  titulo: string;
  descripcion?: string;
  area_construida?: number;
  area_total?: number;
  superficie_lote?: number;
  frente?: number;
  fondo?: number;
  habitaciones?: number;
  banos?: number;
  garages?: number;
  direccion: string;
  latitud?: number;
  longitud?: number;
  estado_propiedad?: string;
  fecha_publicacion?: string;
  fecha_actualizacion?: string;
  tipos_propiedad?: { nombre: string };
  ubicaciones?: { 
    pais: string;
    provincia: string; 
    ciudad: string; 
    barrio?: string; 
    codigo_postal?: string;
  };
  usuarios?: {
    nombre: string;
    apellido: string;
    telefono?: string;
    email: string;
  };
  imagenes_propiedad?: Array<{ url_imagen: string; es_principal: boolean; orden: number }>;
  propiedades_caracteristicas?: Array<{
    caracteristicas: {
      id: number;
      nombre: string;
      tipo_caracteristica: { id: number; nombre: string };
    };
  }>;
  operaciones_propiedad?: Array<{
    precio: number;
    moneda: string;
    disponible: boolean;
    tipos_operacion: { nombre: string };
  }>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [propiedad, setPropiedad] = useState<PropiedadDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  // Estados del formulario de visita (siempre abierto)
  const [visitForm, setVisitForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    fecha_preferida: '',
    hora_preferida: '',
    mensaje: ''
  });

  useEffect(() => {
    const fetchPropiedad = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/propiedades/${id}`);
        setPropiedad(response.data);
      } catch (error) {
        console.error('Error al cargar propiedad:', error);
        setPropiedad(null);
      }
      setLoading(false);
    };

    fetchPropiedad();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#ec520b] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (!propiedad) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Propiedad no encontrada</h2>
          <p className="text-gray-600">La propiedad que buscas no existe o ha sido eliminada.</p>
        </div>
      </div>
    );
  }

  const imagenes = propiedad.imagenes_propiedad?.sort((a, b) => a.orden - b.orden) || [];
  const operacionPrincipal = propiedad.operaciones_propiedad?.[0];
  const caracteristicasPorTipo = propiedad.propiedades_caracteristicas?.reduce((acc, item) => {
    const tipoNombre = item.caracteristicas.tipo_caracteristica?.nombre || 'Otros';
    if (!acc[tipoNombre]) acc[tipoNombre] = [];
    acc[tipoNombre].push(item.caracteristicas.nombre);
    return acc;
  }, {} as Record<string, string[]>) || {};

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagenes.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  const formatPrice = (precio: number, moneda: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: moneda === 'USD' ? 'USD' : 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio);
  };

  const handleVisitFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/contactos`, {
        ...visitForm,
        propiedad_id: propiedad.id,
        tipo_contacto: 'solicitud_visita'
      });
      
      setVisitForm({
        nombre: '',
        telefono: '',
        email: '',
        fecha_preferida: '',
        hora_preferida: '',
        mensaje: ''
      });
      
      alert('Solicitud de visita enviada correctamente');
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      alert('Error al enviar la solicitud. Inténtalo nuevamente.');
    }
  };

  const whatsappMessage = `Hola! Me interesa obtener más información sobre la propiedad: ${propiedad.titulo}. ${window.location.href}`;
  const whatsappLink = `https://wa.me/5493515155669?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            {imagenes.length > 0 && (
              <>
                <img
                  src={imagenes[currentImageIndex]?.url_imagen || '/placeholder.svg'}
                  alt={`${propiedad.titulo} - Imagen ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
                
                {imagenes.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <ArrowLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    >
                      <ArrowRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
            {currentImageIndex + 1} / {imagenes.length}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery Section */}
          <div className="lg:col-span-2">
            <div className="relative">
              {imagenes.length > 0 ? (
                <div className="relative group">
                  <img
                    src={imagenes[currentImageIndex]?.url_imagen || '/placeholder.svg'}
                    alt={propiedad.titulo}
                    className="w-full h-96 sm:h-[500px] object-cover rounded-lg cursor-pointer"
                    onClick={() => setIsGalleryOpen(true)}
                  />
                  
                  {/* Image Navigation */}
                  {imagenes.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  
                  {/* Gallery Button */}
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-all"
                  >
                    <Eye className="h-4 w-4" />
                    Ver todas ({imagenes.length})
                  </button>
                </div>
              ) : (
                <div className="w-full h-96 sm:h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                  <Home className="h-16 w-16 text-gray-400" />
                </div>
              )}
              
              {/* Thumbnail Strip */}
              {imagenes.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {imagenes.slice(0, 6).map((imagen, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index 
                          ? 'border-[#ec520b]' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={imagen.url_imagen}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {imagenes.length > 6 && (
                    <button
                      onClick={() => setIsGalleryOpen(true)}
                      className="flex-shrink-0 w-20 h-16 rounded-lg bg-gray-800 bg-opacity-80 flex items-center justify-center text-white text-xs font-medium"
                    >
                      +{imagenes.length - 6}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Property Info Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              {/* Title and Location */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#022550] mb-2">
                {propiedad.titulo}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {propiedad.direccion}
                  {propiedad.ubicaciones?.barrio && `, ${propiedad.ubicaciones.barrio}`}
                  {propiedad.ubicaciones?.ciudad && `, ${propiedad.ubicaciones.ciudad}`}
                  {propiedad.ubicaciones?.provincia && `, ${propiedad.ubicaciones.provincia}`}
                </span>
              </div>

              {/* Price and Operation Type */}
              {operacionPrincipal && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-[#ec520b]">
                      {formatPrice(operacionPrincipal.precio, operacionPrincipal.moneda)}
                    </span>
                    <span className="bg-[#022550] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {operacionPrincipal.tipos_operacion?.nombre || 'N/A'}
                    </span>
                  </div>
                  {propiedad.tipos_propiedad && (
                    <p className="text-gray-600 text-sm">
                      {propiedad.tipos_propiedad.nombre}
                    </p>
                  )}
                  {!operacionPrincipal.disponible && (
                    <p className="text-red-600 text-sm font-medium mt-1">No disponible</p>
                  )}
                </div>
              )}

              {/* Physical Characteristics Icons */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                {propiedad.habitaciones && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-[#ec520b]" />
                    <span className="text-sm font-medium">{propiedad.habitaciones} hab.</span>
                  </div>
                )}
                {propiedad.banos && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-[#ec520b]" />
                    <span className="text-sm font-medium">{propiedad.banos} baños</span>
                  </div>
                )}
                {propiedad.garages && (
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-[#ec520b]" />
                    <span className="text-sm font-medium">{propiedad.garages} cocheras</span>
                  </div>
                )}
                {(propiedad.area_total || propiedad.area_construida) && (
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-[#ec520b]" />
                    <span className="text-sm font-medium">
                      {propiedad.area_total || propiedad.area_construida} m²
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#ec520b] hover:bg-[#022550] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 font-medium"
                >
                  <MessageCircle className="h-5 w-5" />
                  Consultar por WhatsApp
                </a>
              </div>

              {/* Visit Form - Always Expanded */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-[#022550] mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#ec520b]" />
                    Solicitar Visita
                  </h3>
                  <form onSubmit={handleVisitFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Input
                          placeholder="Nombre completo"
                          value={visitForm.nombre}
                          onChange={(e) => setVisitForm(prev => ({ ...prev, nombre: e.target.value }))}
                          required
                          className="border-gray-300 focus:border-[#ec520b]"
                        />
                      </div>
                      <div>
                        <Input
                          type="tel"
                          placeholder="Teléfono"
                          value={visitForm.telefono}
                          onChange={(e) => setVisitForm(prev => ({ ...prev, telefono: e.target.value }))}
                          required
                          className="border-gray-300 focus:border-[#ec520b]"
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Email"
                          value={visitForm.email}
                          onChange={(e) => setVisitForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                          className="border-gray-300 focus:border-[#ec520b]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          value={visitForm.fecha_preferida}
                          onChange={(e) => setVisitForm(prev => ({ ...prev, fecha_preferida: e.target.value }))}
                          required
                          className="border-gray-300 focus:border-[#ec520b]"
                        />
                        <Input
                          type="time"
                          value={visitForm.hora_preferida}
                          onChange={(e) => setVisitForm(prev => ({ ...prev, hora_preferida: e.target.value }))}
                          required
                          className="border-gray-300 focus:border-[#ec520b]"
                        />
                      </div>
                      <div>
                        <Textarea
                          placeholder="Mensaje adicional (opcional)"
                          value={visitForm.mensaje}
                          onChange={(e) => setVisitForm(prev => ({ ...prev, mensaje: e.target.value }))}
                          rows={3}
                          className="border-gray-300 focus:border-[#ec520b]"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#022550] hover:bg-[#ec520b] text-white transition-all duration-300"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Enviar Solicitud
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#022550] mb-4">Descripción</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {propiedad.descripcion || 'Esta propiedad no tiene descripción disponible.'}
            </div>
          </div>
        </div>

        {/* Characteristics with Check Icons */}
        {Object.keys(caracteristicasPorTipo).length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-[#022550] mb-6 text-center">
              Características de la propiedad
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(caracteristicasPorTipo).map(([tipo, caracteristicas]) => (
                <Card key={tipo} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-[#ec520b] mb-4 border-b border-gray-200 pb-2">
                      {tipo}
                    </h3>
                    <ul className="space-y-3">
                      {caracteristicas.map((caracteristica, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm leading-relaxed">{caracteristica}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Additional Property Details - Only Measurements */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Measurements */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#022550] mb-4">Medidas</h3>
              <div className="space-y-3 text-sm">
                {propiedad.area_construida && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Área construida:</span>
                    <span className="font-medium">{propiedad.area_construida} m²</span>
                  </div>
                )}
                {propiedad.area_total && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Área total:</span>
                    <span className="font-medium">{propiedad.area_total} m²</span>
                  </div>
                )}
                {propiedad.superficie_lote && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Superficie del lote:</span>
                    <span className="font-medium">{propiedad.superficie_lote} m²</span>
                  </div>
                )}
                {propiedad.frente && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frente:</span>
                    <span className="font-medium">{propiedad.frente} m</span>
                  </div>
                )}
                {propiedad.fondo && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fondo:</span>
                    <span className="font-medium">{propiedad.fondo} m</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40 group"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Contactar por WhatsApp
        </span>
      </a>
    </div>
  );
};

export default PropertyDetail;