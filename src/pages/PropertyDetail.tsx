import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useParams } from 'react-router-dom';
import { MapPin, Home, Bed, Bath, Car, Square, Eye, ArrowLeft, ArrowRight, X, MessageCircle, Calendar, Check } from 'lucide-react';
import { Tag } from 'lucide-react';
import logoInicioBlanco from '@/assets/inicio_icono_blanco.svg';
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
  const { data: propiedad, loading, error, request } = useApiRequest<PropiedadDetalle>({ retries: 2, retryDelay: 1500 });
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

  const [tiposCaracteristica, setTiposCaracteristica] = useState<{ id: number; nombre: string }[]>([]);
  const [tiposOperacion, setTiposOperacion] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    const fetchPropiedad = async () => {
      if (!id) return;
      await request(async () => {
        const response = await axios.get(`${API_URL}/propiedades/${id}`);
        localStorage.setItem(`propiedad_${id}`, JSON.stringify(response.data));
        return response.data;
      });
    };

    const fetchAux = async () => {
      try {
        const [tiposCaracRes, tiposOpRes] = await Promise.all([
          axios.get(`${API_URL}/tipos-caracteristica`),
          axios.get(`${API_URL}/tipos-operacion`)
        ]);
        setTiposCaracteristica(tiposCaracRes.data || []);
        setTiposOperacion(tiposOpRes.data || []);
      } catch (e) {
        setTiposCaracteristica([]);
        setTiposOperacion([]);
      }
    };

    fetchPropiedad();
    fetchAux();
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
          <p className="text-gray-600">{error || 'La propiedad que buscas no existe o ha sido eliminada.'}</p>
        </div>
      </div>
    );
  }

  // Ordenar imágenes: principal primero, luego por orden
  const imagenes = propiedad.imagenes_propiedad
    ? [...propiedad.imagenes_propiedad].sort((a, b) => {
        // Primero principal, luego por orden
        if (a.es_principal && !b.es_principal) return -1;
        if (!a.es_principal && b.es_principal) return 1;
        return a.orden - b.orden;
      })
    : [];

  const operacionPrincipal = propiedad.operaciones_propiedad?.[0];
  const tipoOperacionNombre = operacionPrincipal
    ? (tiposOperacion.find(t => t.id === (operacionPrincipal as any).tipo_operacion_id)?.nombre ||
       operacionPrincipal.tipos_operacion?.nombre ||
       'N/A')
    : 'N/A';
  const caracteristicasPorTipo = propiedad.propiedades_caracteristicas?.reduce((acc, item) => {
    const tipoId = item.caracteristicas.tipo_id; // Usar tipo_id
    const tipo = tiposCaracteristica.find(t => t.id === tipoId);
    const tipoNombre = tipo ? tipo.nombre : 'Otros';
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

  // WhatsApp link con mensaje personalizado y link directo
  const propertyUrl = window.location.href;
  const whatsappMessage = `Hola! Estoy interesado en la propiedad: ${propiedad.titulo}. Puedes ver la propiedad aquí: ${propertyUrl}`;
  const whatsappLink = `https://wa.me/5493515155669?text=${encodeURIComponent(whatsappMessage)}`;

  return (
  <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Gallery Modal Mejorado */}
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
                  className="max-w-3xl max-h-[80vh] object-contain rounded-2xl shadow-2xl border-4 border-[#ec520b]"
                  style={{ boxShadow: '0 8px 32px rgba(34,37,80,0.25)' }}
                />
                {imagenes.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-[#ec520b] bg-opacity-80 text-white p-3 rounded-full hover:bg-[#022550] shadow-lg"
                    >
                      <ArrowLeft className="h-7 w-7" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-[#ec520b] bg-opacity-80 text-white p-3 rounded-full hover:bg-[#022550] shadow-lg"
                    >
                      <ArrowRight className="h-7 w-7" />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-lg font-bold bg-[#022550]/80 px-4 py-2 rounded-xl shadow">
            {currentImageIndex + 1} / {imagenes.length}
          </div>
        </div>
      )}

      {/* Main Content Mejorado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Collage Mejorado: principal grande, otras abajo en grid */}
          <div className="lg:col-span-2">
            {imagenes.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 h-[520px]">
                {/* Imagen principal grande */}
                <div
                  className="col-span-2 row-span-2 rounded-2xl overflow-hidden cursor-pointer group relative shadow-lg border-4 border-[#022550] flex items-center justify-center h-full bg-white"
                  onClick={() => { setCurrentImageIndex(0); setIsGalleryOpen(true); }}
                  style={{ gridRow: '1 / span 2', gridColumn: '1 / span 2' }}
                >
                  <img
                    src={imagenes[0]?.url_imagen || '/placeholder.svg'}
                    alt={propiedad.titulo}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 right-2 bg-[#ec520b]/80 text-white text-xs px-3 py-1 rounded shadow-lg">
                    Ver galería
                  </span>
                </div>
                {/* Mosaico de imágenes secundarias */}
                {imagenes.slice(1, 5).map((img, idx) => (
                  <div
                    key={img.url_imagen}
                    className="rounded-xl overflow-hidden cursor-pointer group relative flex items-center justify-center h-full bg-white border-2 border-[#ec520b]/30 shadow"
                    onClick={() => { setCurrentImageIndex(idx + 1); setIsGalleryOpen(true); }}
                    style={{ gridColumn: idx === 0 ? 3 : undefined, gridRow: idx === 0 ? 1 : undefined }}
                  >
                    <img
                      src={img.url_imagen}
                      alt={`${propiedad.titulo} - Imagen ${idx + 2}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 right-2 bg-[#022550]/80 text-white text-xs px-2 py-1 rounded shadow">
                      Ver
                    </span>
                  </div>
                ))}
                {imagenes.length > 5 && (
                  <div
                    className="rounded-xl overflow-hidden bg-[#ec520b]/80 flex items-center justify-center text-white text-lg font-semibold cursor-pointer h-full"
                    onClick={() => setIsGalleryOpen(true)}
                    style={{ gridColumn: 3, gridRow: 2 }}
                  >
                    +{imagenes.length - 5}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-[520px] bg-gray-200 rounded-lg flex items-center justify-center">
                <Home className="h-16 w-16 text-gray-400" />
              </div>
            )}

            {/* Descripción debajo de las imágenes */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border-2 border-[#022550]/10">
              <h2 className="text-2xl font-bold text-[#022550] mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-[#ec520b]" />
                Descripción
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                {propiedad.descripcion || 'Esta propiedad no tiene descripción disponible.'}
              </div>
            </div>

            {/* Características agrupadas por tipo, bien separadas, con iconos */}
            {Object.keys(caracteristicasPorTipo).length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-[#022550] mb-6 text-center flex items-center justify-center gap-2">
                  <Check className="h-6 w-6 text-green-600" />
                  Características de la propiedad
                </h2>
                <div className="flex flex-col gap-6">
                  {Object.entries(caracteristicasPorTipo).map(([tipo, caracteristicas]) => (
                    <div key={tipo} className="bg-white rounded-xl shadow p-6 border-2 border-[#ec520b]/10">
                      <h3 className="text-lg font-semibold text-[#ec520b] mb-2 border-b border-gray-100 pb-1 flex items-center gap-2">
                        <Tag className="h-5 w-5 text-[#022550]" />
                        {tipo}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {caracteristicas.map((caracteristica, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 bg-[#022550]/10 text-[#022550] text-sm px-4 py-2 rounded-full shadow"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                            {caracteristica}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Property Info Section (sin cambios) */}
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
                    {tipoOperacionNombre}
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

        {/* Additional Property Details - Only Measurements (sin cambios) */}
        {/* Sección de medidas eliminada para mejor UX/UI */}
      </div>

      {/* Floating WhatsApp Button (sin cambios) */}
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