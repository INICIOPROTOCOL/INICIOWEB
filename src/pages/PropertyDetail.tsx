import { useEffect, useState, useCallback } from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useParams } from 'react-router-dom';
import { MapPin, Home, Bed, Bath, Car, Square, Eye, ArrowLeft, ArrowRight, X, MessageCircle, Calendar, Check, CheckCircle, Ruler, Layers } from 'lucide-react';
import { Tag } from 'lucide-react';
import logoInicioBlanco from '@/assets/inicio_icono_blanco.svg';
import propertyPlaceholder from '@/assets/property-placeholder.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import PropertyMap from '@/components/PropertyMap';
import axios from 'axios';
import { createEventId, getMetaCookies, trackEvent } from '@/utils/metaPixel';
// import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { capitalizeAndFixAccent, capitalizeTitle } from '@/utils/capitalize';

interface PropiedadDetalle {
  id: number;
  tokko_id?: number | null;
  slug: string;
  origen: string;
  destacada: boolean;
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
    id: number;
    pais: string;
    provincia: string;
    departamento: string | null;
    ciudad: string;
    barrio: string | null;
    codigo_postal: string | null;
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
  const { slug } = useParams<{ slug: string }>();
  const { data: propiedad, loading, error, request } = useApiRequest<PropiedadDetalle>({ retries: 2, retryDelay: 1500 });
  const { loading: visitFormLoading, error: visitFormError, request: visitFormRequest } = useApiRequest({ retries: 2, retryDelay: 1500 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({ show: false, type: 'success', message: '' });
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  // Estados del formulario de visita (siempre abierto)
  const [visitForm, setVisitForm] = useState({
    nombre: '',
    celular: '', // Cambiar a celular para coincidir con ContactForm
    email: '',
    fecha_preferida: '',
    mensaje: ''
  });

  const [tiposCaracteristica, setTiposCaracteristica] = useState<{ id: number; nombre: string }[]>([]);
  const [tiposOperacion, setTiposOperacion] = useState<{ id: number; nombre: string }[]>([]);

  // Función para mostrar toast
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: 'success', message: '' });
    }, 4000);
  };

  // Handler para errores de carga de imagen (Safari iOS fix)
  const handleImageError = (index: number) => {
    console.warn(`Error loading image at index ${index}, using fallback`);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  // Función para obtener URL de imagen con fallback a placeholder de casa
  const getImageUrl = (imagen: { url_imagen: string } | undefined, index: number) => {
    if (!imagen || imageErrors[index]) {
      return propertyPlaceholder; // Fallback al ícono de casa naranja
    }
    return imagen.url_imagen;
  };

  useEffect(() => {
    if (!slug) return;
    
    let mounted = true;
    
    const fetchData = async () => {
      try {
        // 🔍 Detectar si es ID numérico para decidir la estrategia
        const isNumericId = /^\d+$/.test(slug);
        
        // 🚀 DUAL PATH: Priorizar slug, fallback a ID
        await request(async () => {
          // Estrategia 1: Si parece ID numérico, intentar primero por ID (más rápido)
          if (isNumericId) {
            try {
              const response = await axios.get(`${API_URL}/propiedades/${slug}`);
              if (!mounted) return null;
              return response.data;
            } catch (idError) {
              console.warn('⚠️ No encontrada por ID, intentando por slug...');
            }
          }
          
          // Estrategia 2: Intentar por slug (siempre, incluso si es numérico)
          try {
            const response = await axios.get(`${API_URL}/propiedades/slug/${slug}`);
            if (!mounted) return null;
            return response.data;
          } catch (slugError) {
            // Si no es numérico y falló, no hay más opciones
            if (!isNumericId) {
              throw new Error(`Propiedad con slug "${slug}" no encontrada`);
            }
            throw slugError;
          }
        });
        
        if (!mounted) return;
        
        // Fetch datos auxiliares en paralelo
        const [tiposCaracRes, tiposOpRes] = await Promise.all([
          axios.get(`${API_URL}/tipos-caracteristica`),
          axios.get(`${API_URL}/tipos-operacion`)
        ]);
        
        if (!mounted) return;
        setTiposCaracteristica(tiposCaracRes.data || []);
        setTiposOperacion(tiposOpRes.data || []);
      } catch (error) {
        if (!mounted) return;
        console.error('❌ Error al cargar propiedad:', error);
        setTiposCaracteristica([]);
        setTiposOperacion([]);
      }
    };

    fetchData();
    
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]); // Solo dependemos de 'slug'


  // Ordenar imágenes: principal primero, luego por orden
  const imagenes = propiedad?.imagenes_propiedad
    ? [...propiedad.imagenes_propiedad].sort((a, b) => {
        // Primero principal, luego por orden
        if (a.es_principal && !b.es_principal) return -1;
        if (!a.es_principal && b.es_principal) return 1;
        return a.orden - b.orden;
      })
    : [];

  // Funciones de navegación de imágenes con useCallback
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % imagenes.length);
  }, [imagenes.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  }, [imagenes.length]);

  // Navegación por teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGalleryOpen && imagenes.length > 1) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextImage();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevImage();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setIsGalleryOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGalleryOpen, imagenes.length, nextImage, prevImage]);

  // Dentro del modal de galería (isGalleryOpen)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left → next image
        nextImage();
      } else {
        // Swipe right → previous image
        prevImage();
      }
    }
    setTouchStartX(null);
  };

  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  // });

  const lat = propiedad ? propiedad.latitud : undefined;
  const lng = propiedad ? propiedad.longitud : undefined;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#ec520b] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-montserrat">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (!propiedad) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">Propiedad no encontrada</h2>
          <p className="text-gray-600 font-montserrat">{error || 'La propiedad que buscas no existe o ha sido eliminada.'}</p>
        </div>
      </div>
    );
  }

  const operacionPrincipal = propiedad.operaciones_propiedad?.[0];
  const tipoOperacionNombre = operacionPrincipal
    ? capitalizeAndFixAccent(
        tiposOperacion.find(t => t.id === (operacionPrincipal as unknown as { tipo_operacion_id: number }).tipo_operacion_id)?.nombre ||
        operacionPrincipal.tipos_operacion?.nombre ||
        'N/A'
      )
    : 'N/A';
  const caracteristicasPorTipo = propiedad.propiedades_caracteristicas?.reduce((acc, item) => {
    const tipoId = item.caracteristicas.tipo_caracteristica?.id;
    const tipo = tiposCaracteristica.find(t => t.id === tipoId);
    const tipoNombre = tipo ? capitalizeTitle(tipo.nombre) : 'Otros';
    
    if (!acc[tipoNombre]) acc[tipoNombre] = [];
    acc[tipoNombre].push(capitalizeAndFixAccent(item.caracteristicas.nombre));
    return acc;
  }, {} as Record<string, string[]>) || {};

  useEffect(() => {
    if (!propiedad) return;

    const eventParams: Record<string, unknown> = {
      content_name: propiedad.titulo,
      content_type: 'product',
      content_ids: [propiedad.id],
      content_category: tipoOperacionNombre,
    };

    if (operacionPrincipal?.precio && operacionPrincipal.moneda) {
      eventParams.value = operacionPrincipal.precio;
      eventParams.currency = operacionPrincipal.moneda;
    }

    trackEvent('ViewContent', eventParams);
  }, [propiedad, operacionPrincipal?.precio, operacionPrincipal?.moneda, tipoOperacionNombre]);

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

    const eventId = createEventId();
    const eventSourceUrl = window.location.href;
    const userAgent = navigator.userAgent;
    const { fbp, fbc } = getMetaCookies();
    
    // Construir información detallada de la propiedad para el cliente
    const propertyUrl = window.location.href;
    const operacionInfo = operacionPrincipal 
      ? `${tipoOperacionNombre} - ${formatPrice(operacionPrincipal.precio, operacionPrincipal.moneda)}`
      : 'Precio a consultar';
    
    const ubicacionCompleta = [
      propiedad.direccion,
      propiedad.ubicaciones?.ciudad,
      propiedad.ubicaciones?.barrio
    ].filter(Boolean).join(', ');

    // Construir características principales para el resumen
    const caracteristicasPrincipales = [];
    if (isValidNumber(propiedad.superficie_lote)) 
      caracteristicasPrincipales.push(`${formatNumber(propiedad.superficie_lote)}m² lote`);
    if (isValidNumber(propiedad.frente) && isValidNumber(propiedad.fondo)) 
      caracteristicasPrincipales.push(`${formatNumber(propiedad.frente)}x${formatNumber(propiedad.fondo)}m`);
    if (isValidNumber(propiedad.area_construida)) 
      caracteristicasPrincipales.push(`${formatNumber(propiedad.area_construida)}m² construidos`);
    if (isValidNumber(propiedad.habitaciones)) 
      caracteristicasPrincipales.push(`${formatNumber(propiedad.habitaciones)} habitaciones`);
    if (isValidNumber(propiedad.banos)) 
      caracteristicasPrincipales.push(`${formatNumber(propiedad.banos)} baños`);
    if (isValidNumber(propiedad.garages)) 
      caracteristicasPrincipales.push(`${formatNumber(propiedad.garages)} cocheras`);

    const mensajeCompleto = `🏠 SOLICITUD DE VISITA - NUEVA CONSULTA

═══════════════════════════════════════════════
📋 INFORMACIÓN DE LA PROPIEDAD
═══════════════════════════════════════════════

🏷️ Título: ${propiedad.titulo}

� Operación: ${operacionInfo}

🏠 Tipo: ${capitalizeAndFixAccent(propiedad.tipos_propiedad?.nombre) || 'No especificado'}

📍 Ubicación: ${ubicacionCompleta}

${caracteristicasPrincipales.length > 0 ? `🏗️ Características: ${caracteristicasPrincipales.join(' | ')}

` : ''}�🔗 VER PROPIEDAD COMPLETA: ${propertyUrl}


═══════════════════════════════════════════════
👤 DATOS DEL INTERESADO
═══════════════════════════════════════════════

👨‍💼 Nombre: ${visitForm.nombre}

📞 Teléfono: ${visitForm.celular}

📧 Email: ${visitForm.email}

📅 Fecha preferida: ${visitForm.fecha_preferida}

${visitForm.mensaje ? `

💬 Mensaje del cliente:
"${visitForm.mensaje}"

` : ''}

═══════════════════════════════════════════════
⚡ ACCIONES RÁPIDAS
═══════════════════════════════════════════════

📱 WhatsApp directo: https://wa.me/54${visitForm.celular.replace(/[^\d]/g, '')}

🏠 Ver propiedad: ${propertyUrl}

📧 Responder email: ${visitForm.email}


--
✨ Solicitud generada desde el sitio web de INICIO
🕐 Fecha y hora: ${new Date().toLocaleString('es-AR', { 
  timeZone: 'America/Argentina/Buenos_Aires',
  year: 'numeric',
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}`;

    // Preparar datos en el formato que espera el backend (igual a ContactForm)
    const payload = {
      nombre: visitForm.nombre,
      apellido: '', // Campo vacío para solicitudes de visita
      telefono: visitForm.celular,
      email: visitForm.email,
      tipoInmueble: `Solicitud de visita - ${propiedad.titulo}`,
      mensaje: mensajeCompleto,
      property_id: propiedad.id,
      propertyId: propiedad.id,
      event_id: eventId,
      event_source_url: eventSourceUrl,
      user_agent: userAgent,
      fbp,
      fbc
    };

    // Usar el hook useApiRequest igual que ContactForm
    await visitFormRequest(async () => {
      const res = await fetch(`${API_URL}/contactos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('No se pudo enviar la solicitud de visita');
      return await res.json();
    });

    // Manejar resultado igual que ContactForm
    if (!visitFormError) {
      showToast('success', '¡Solicitud de visita enviada! Te contactaremos pronto para coordinar la visita.');
      trackEvent('Lead', {
        content_name: propiedad.titulo,
        content_category: tipoOperacionNombre,
        content_ids: [propiedad.id],
      }, { eventID: eventId });
      setVisitForm({
        nombre: '',
        celular: '',
        email: '',
        fecha_preferida: '',
        mensaje: ''
      });
    } else {
      showToast('error', `Error al enviar solicitud: ${visitFormError}`);
    }
  };

  // WhatsApp link con mensaje personalizado y link directo
  const propertyUrl = window.location.href;
  const whatsappMessage = `Hola! Estoy interesado en la propiedad: ${propiedad.titulo}. Puedes ver la propiedad aquí: ${propertyUrl}`;
  const whatsappLink = `https://wa.me/5493515155669?text=${encodeURIComponent(whatsappMessage)}`;



  return (
  <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        } animate-slide-in-right`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {toast.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button 
              onClick={() => setToast({ show: false, type: 'success', message: '' })}
              className="ml-3 text-white hover:text-gray-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Loader mientras se envía solicitud de visita */}
      {visitFormLoading && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
          <div className="bg-white/80 rounded-xl shadow-xl p-8 flex flex-col items-center">
            <div className="animate-spin-slow mb-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#022550" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <span className="text-lg text-[#022550] font-semibold">Enviando solicitud de visita...</span>
          </div>
        </div>
      )}
      
      {/* Modal de Galería Premium con Navegación por Teclado */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop-blur-sm">
          {/* Botón cerrar mejorado */}
          <button
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#ec520b] z-10 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-all duration-300"
            title="Cerrar (Esc)"
          >
            <X className="h-6 w-6" />
          </button>
          
          {/* Indicador de navegación por teclado */}
          <div className="absolute top-6 left-6 text-white/70 text-sm bg-black/50 px-3 py-2 rounded-full">
            Usa ← → para navegar
          </div>
          
          <div className="relative w-full h-full flex items-center justify-center px-4">
            {imagenes.length > 0 && (
              <>
                {/* Imagen principal del modal */}
                <div
                  className="relative max-w-5xl max-h-[85vh] flex items-center justify-center"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    src={getImageUrl(imagenes[currentImageIndex], currentImageIndex)}
                    alt={`${propiedad.titulo} - Imagen ${currentImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    style={{ 
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(236, 82, 11, 0.3)' 
                    }}
                    onError={() => handleImageError(currentImageIndex)}
                    loading="lazy"
                  />
                </div>
                
                {/* Botones de navegación mejorados */}
                {imagenes.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 bg-[#ec520b]/90 hover:bg-[#ec520b] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
                      title="Anterior (←)"
                    >
                      <ArrowLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 bg-[#ec520b]/90 hover:bg-[#ec520b] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
                      title="Siguiente (→)"
                    >
                      <ArrowRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          
          {/* Contador e indicadores mejorados */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
            {/* Indicadores de página */}
            {imagenes.length > 1 && (
              <div className="flex gap-2">
                {imagenes.slice(0, Math.min(imagenes.length, 10)).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-[#ec520b] scale-125'
                        : 'bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
                {imagenes.length > 10 && (
                  <span className="text-white/60 text-sm ml-2">...</span>
                )}
              </div>
            )}
            
            {/* Contador de imágenes */}
            <div className="bg-black/70 text-white px-6 py-3 rounded-full font-semibold text-lg backdrop-blur-sm">
              {currentImageIndex + 1} de {imagenes.length}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Mejorado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nueva Galería Mejorada: imagen principal grande + 2 miniaturas + contador */}
          <div className="lg:col-span-2">
            {imagenes.length > 0 ? (
              <div className="space-y-4">
                {/* Imagen Principal - Extra Grande */}
                <div
                  className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-2xl border-4 border-[#022550] h-[400px] bg-white"
                  onClick={() => { setCurrentImageIndex(0); setIsGalleryOpen(true); }}
                >
                  <img
                    src={getImageUrl(imagenes[0], 0)}
                    alt={propiedad.titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => handleImageError(0)}
                    loading="lazy"
                  />
                  {/* Overlay con degradado para mejor visibilidad del texto */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  
                  {/* Badge de Ver Galería - Mejorado */}
                  <div className="absolute top-4 right-4 bg-[#ec520b] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-4 w-4" />
                    Ver galería ({imagenes.length})
                  </div>
                  
                  {/* Indicador de imagen principal */}
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Imagen principal
                  </div>
                </div>

                {/* Miniaturas - Solo 2 imágenes medianas + contador */}
                {imagenes.length > 1 && (
                  <div className="grid grid-cols-3 gap-4 h-[140px]">
                    {/* Primera miniatura */}
                    {imagenes[1] && (
                      <div
                        className="rounded-xl overflow-hidden cursor-pointer group relative shadow-lg border-2 border-[#ec520b]/30 bg-white transition-all duration-300 hover:shadow-xl hover:border-[#ec520b]"
                        onClick={() => { setCurrentImageIndex(1); setIsGalleryOpen(true); }}
                      >
                        <img
                          src={getImageUrl(imagenes[1], 1)}
                          alt={`${propiedad.titulo} - Imagen 2`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={() => handleImageError(1)}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute bottom-2 right-2 bg-[#022550] text-white text-xs px-2 py-1 rounded-md opacity-90">
                          2
                        </div>
                      </div>
                    )}
                    
                    {/* Segunda miniatura */}
                    {imagenes[2] && (
                      <div
                        className="rounded-xl overflow-hidden cursor-pointer group relative shadow-lg border-2 border-[#ec520b]/30 bg-white transition-all duration-300 hover:shadow-xl hover:border-[#ec520b]"
                        onClick={() => { setCurrentImageIndex(2); setIsGalleryOpen(true); }}
                      >
                        <img
                          src={getImageUrl(imagenes[2], 2)}
                          alt={`${propiedad.titulo} - Imagen 3`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={() => handleImageError(2)}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute bottom-2 right-2 bg-[#022550] text-white text-xs px-2 py-1 rounded-md opacity-90">
                          3
                        </div>
                      </div>
                    )}
                    
                    {/* Botón Ver Más - Diseño premium */}
                    <div
                      className="rounded-xl cursor-pointer group relative shadow-lg bg-gradient-to-br from-[#ec520b] to-[#022550] text-white transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col items-center justify-center"
                      onClick={() => setIsGalleryOpen(true)}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-1">+{imagenes.length - 3}</div>
                        <div className="text-xs font-medium opacity-90">más fotos</div>
                      </div>
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-colors duration-300" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex flex-col items-center justify-center border-4 border-gray-300 border-dashed">
                <Home className="h-20 w-20 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg font-medium font-montserrat">Sin imágenes disponibles</p>
              </div>
            )}

            {/* Descripción debajo de las imágenes */}
            {propiedad.descripcion && (
              <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border-2 border-[#022550]/10">
                <h2 className="text-2xl font-bold text-[#022550] mb-6 flex items-center gap-2 font-poppins">
                  <Eye className="h-6 w-6 text-[#ec520b]" />
                  Descripción
                </h2>
                <div 
                  className="font-montserrat prose prose-base max-w-none
                            prose-headings:font-poppins prose-headings:font-bold prose-headings:text-[#022550] prose-headings:mt-6 prose-headings:mb-3
                            prose-h1:text-2xl prose-h1:border-b-2 prose-h1:border-[#ec520b]/30 prose-h1:pb-2
                            prose-h2:text-xl prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                            prose-h3:text-lg prose-h3:text-[#ec520b]
                            prose-h4:text-base prose-h4:text-gray-700 prose-h4:font-semibold
                            prose-p:text-gray-700 prose-p:text-base prose-p:leading-relaxed prose-p:mb-4
                            prose-strong:text-[#022550] prose-strong:font-semibold
                            prose-em:text-[#ec520b] prose-em:not-italic
                            prose-ul:my-3 prose-ul:list-disc prose-ul:pl-6
                            prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-6
                            prose-li:text-gray-700 prose-li:text-base prose-li:mb-2 prose-li:leading-relaxed
                            prose-a:text-[#ec520b] prose-a:hover:text-[#022550] prose-a:transition-colors prose-a:underline
                            prose-blockquote:border-l-4 prose-blockquote:border-[#ec520b] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                            prose-code:text-[#022550] prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded"
                  dangerouslySetInnerHTML={{ __html: propiedad.descripcion }}
                />
              </div>
            )}

            {/* Características agrupadas por tipo, bien separadas, con iconos */}
            {Object.keys(caracteristicasPorTipo).length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-[#022550] mb-6 text-center flex items-center justify-center gap-2 font-poppins">
                  <Check className="h-6 w-6 text-green-600" />
                  Características de la propiedad
                </h2>
                <div className="flex flex-col gap-6">
                  {Object.entries(caracteristicasPorTipo).map(([tipo, caracteristicas]) => (
                    <div key={tipo} className="bg-white rounded-xl shadow p-6 border-2 border-[#ec520b]/10">
                      <h3 className="text-lg font-semibold text-[#ec520b] mb-2 border-b border-gray-100 pb-1 flex items-center gap-2">
                        <Tag className="h-5 w-5 text-[#022550]" />
                        {capitalizeTitle(tipo)}
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

            {/* Mapa de ubicación - Leaflet */}
            {propiedad.latitud && propiedad.longitud && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-[#022550] mb-6 flex items-center gap-2 font-poppins">
                  <MapPin className="h-6 w-6 text-[#ec520b]" />
                  Ubicación en el mapa
                </h2>
                <PropertyMap
                  latitude={propiedad.latitud}
                  longitude={propiedad.longitud}
                  title={propiedad.titulo}
                  address={`${propiedad.direccion}${propiedad.ubicaciones?.ciudad ? `, ${propiedad.ubicaciones.ciudad}` : ''}${propiedad.ubicaciones?.barrio ? `, ${propiedad.ubicaciones.barrio}` : ''}`}
                  zoom={16}
                  height="400px"
                />
              </div>
            )}

          </div>

          {/* Property Info Section (sin cambios) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Title and Location */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#022550] mb-2 font-poppins">
                {propiedad.titulo}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {propiedad.direccion}
                  {propiedad.ubicaciones?.ciudad && `, ${propiedad.ubicaciones.ciudad}`}
                  {propiedad.ubicaciones?.barrio && `, ${propiedad.ubicaciones.barrio}`}
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
                      {capitalizeAndFixAccent(propiedad.tipos_propiedad.nombre)}
                    </p>
                  )}
                  {!operacionPrincipal.disponible && (
                    <p className="text-red-600 text-sm font-medium mt-1">No disponible</p>
                  )}
                </div>
              )}

              {/* Physical Characteristics Icons - CORREGIDO para no mostrar 0s */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                {/* Superficie de lote */}
                {isValidNumber(propiedad.superficie_lote) && (
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-[#ec520b]" />
                    <span className="text-sm font-medium">{formatNumber(propiedad.superficie_lote)} m² lote</span>
                  </div>
                )}
                
                {/* Dimensiones del lote */}
                {isValidNumber(propiedad.frente) && isValidNumber(propiedad.fondo) && (
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-[#022550]" />
                    <span className="text-sm font-medium">{formatNumber(propiedad.frente)} x {formatNumber(propiedad.fondo)} m</span>
                  </div>
                )}
                
                {/* Superficie total - solo si no hay superficie_lote */}
                {isValidNumber(propiedad.area_total) && !isValidNumber(propiedad.superficie_lote) && (
                  <div className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-[#ec520b]" />
                    <span className="text-sm font-medium">{formatNumber(propiedad.area_total)} m² totales</span>
                  </div>
                )}
                
                {/* Superficie construida */}
                {isValidNumber(propiedad.area_construida) && (
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-[#022550]" />
                    <span className="text-sm font-medium">{formatNumber(propiedad.area_construida)} m² cubiertos</span>
                  </div>
                )}
                
                {/* Habitaciones */}
                {isValidNumber(propiedad.habitaciones) && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-[#ec520b]" />
                    <span className="text-sm font-medium">{formatNumber(propiedad.habitaciones)} hab.</span>
                  </div>
                )}

                {/* Baños */}
                {isValidNumber(propiedad.banos) && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-[#ec520b]" />
                    <span className="text-sm font-medium">{formatNumber(propiedad.banos)} baños</span>
                  </div>
                )}

                {/* Cocheras */}
                {isValidNumber(propiedad.garages) && (
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-[#ec520b]" />
                    <span className="text-sm font-medium">{formatNumber(propiedad.garages)} cocheras</span>
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
                          value={visitForm.celular}
                          onChange={(e) => setVisitForm(prev => ({ ...prev, celular: e.target.value }))}
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
                      <div>
                        <Input
                          type="date"
                          placeholder="Fecha preferida para la visita"
                          value={visitForm.fecha_preferida}
                          onChange={(e) => setVisitForm(prev => ({ ...prev, fecha_preferida: e.target.value }))}
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

        {/* 
        Mejoras implementadas en la galería:
        - Imagen principal extra grande (400px altura)
        - 2 miniaturas de buen tamaño (140px altura)
        - Botón +X más fotos con diseño premium
        - Navegación por teclado (← → Esc)
        - Modal mejorado con indicadores de página
        - Animaciones y transiciones suaves
        - Mejor accesibilidad y UX
      */}
      </div>

      {/* 
        Mejoras implementadas en la galería:
        - Imagen principal extra grande (400px altura)
        - 2 miniaturas de buen tamaño (140px altura)
        - Botón +X más fotos con diseño premium
        - Navegación por teclado (← → Esc)
        - Modal mejorado con indicadores de página
        - Animaciones y transiciones suaves
        - Mejor accesibilidad y UX
      */}

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

// Función helper para validar números (igual que en PropertyCard)
const isValidNumber = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined || value === '') return false;
  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  return !isNaN(numValue) && numValue > 0;
};

const formatNumber = (value: string | number | null | undefined): string => {
  if (!isValidNumber(value)) return '';
  return typeof value === 'string' ? value : String(value);
};






