import { useEffect, useState, useRef } from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import PropertyCard from '@/components/PropertyCard';
import ContactForm from '@/components/ContactForm';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Home, ChevronUp, Filter, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import heroImage from '@/assets/hero-bg.jpg';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

interface Propiedad {
  id: number;
  titulo: string;
  descripcion?: string;
  area_construida?: number;
  area_total?: number;
  habitaciones?: number;
  banos?: number;
  garages?: number;
  direccion: string;
  latitud?: number;
  longitud?: number;
  estado_propiedad: 'disponible' | 'vendido' | 'alquilado' | 'reservado';
  fecha_publicacion: string;
  agente_id: number;
  tipo_propiedad_id: number;
  ubicacion_id: number;
  tipos_propiedad: {
    id: number;
    nombre: string;
  };
  ubicaciones: {
    id: number;
    pais: string;
    provincia: string;
    ciudad: string;
    barrio?: string;
  };
  imagenes_propiedad: Array<{
    id: number;
    url_imagen: string;
    es_principal: boolean;
    orden: number;
  }>;
  propiedades_caracteristicas: Array<{
    id: number;
    caracteristicas: {
      id: number;
      nombre: string;
    };
  }>;
  operaciones_propiedad: Array<{
    id: number;
    precio: number;
    moneda: string;
    tipos_operacion: {
      id: number;
      nombre: string;
    };
  }>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Properties = () => {
  useScrollToTop(); // Hook para scroll automático al inicio al cambiar de página
  const location = useLocation();
  const navigate = useNavigate();
  const [habitaciones, setHabitaciones] = useState('');
  const [tipo, setTipo] = useState('');
  const [operacion, setOperacion] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('');
  const [tiposPropiedad, setTiposPropiedad] = useState<{ id: number; nombre: string }[]>([]);
  const [ubicaciones, setUbicaciones] = useState<{ id: number; ciudad: string; provincia: string; pais: string; barrio?: string }[]>([]);
  const [tiposOperacion, setTiposOperacion] = useState<{ id: number; nombre: string }[]>([]);
  const { data, loading, error, request } = useApiRequest<Propiedad[]>({ retries: 2, retryDelay: 1500 });
  const propiedades = data ?? [];
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  
  // Keep a mounted flag to prevent state updates on unmounted component
  useEffect(() => {
    let mounted = true;

    const fetchMeta = async () => {
      try {
        const [tiposRes, ubicacionesRes, tiposOperacionRes] = await Promise.all([
          axios.get(`${API_URL}/tipos`),
          axios.get(`${API_URL}/ubicaciones`),
          axios.get(`${API_URL}/tipos-operacion`),
        ]);
        if (!mounted) return;
        setTiposPropiedad(tiposRes.data || []);
        setUbicaciones(ubicacionesRes.data || []);
        setTiposOperacion(tiposOperacionRes.data || []);
      } catch (err) {
        // ignore - useApiRequest will handle propiedades fetch fallback
        // console.error('meta fetch error', err);
      }
    };

    const fetchProps = async () => {
      await request(async () => {
        const propiedadesRes = await axios.get(`${API_URL}/propiedades`);
        if (!mounted) return [];
        localStorage.setItem('propiedades', JSON.stringify(propiedadesRes.data || []));
        return propiedadesRes.data || [];
      });
    };

    fetchMeta();
    fetchProps();

    return () => {
      mounted = false;
    };
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setOperacion(queryParams.get('operacion') || '');
    setTipo(queryParams.get('tipo') || '');
    setUbicacionSeleccionada(queryParams.get('ubicacion') || '');
  }, [location.search]);

  // Debounced update of query params.
  const debounceRef = useRef<number | null>(null);
  const updateQueryParams = (key: string, value: string | number) => {
    // normalize value: if numeric string, convert to number
    const parsed = value === '' ? '' : Number(value);
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      // Use current window.location to compose params (avoid stale location in closures)
      const queryParams = new URLSearchParams(window.location.search);
      if (parsed === '') {
        queryParams.delete(key);
      } else {
        queryParams.set(key, String(parsed));
      }
    // update URL query params (debounced)
      navigate(`?${queryParams.toString()}`, { replace: true });
    }, 400) as unknown as number;
  };

  // Clear debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 400); // Show after scrolling 400px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleOperacionChange = (value: string) => {
    // treat '0' as clear/empty
    const normalized = value === '0' || value === '' ? '' : String(Number(value));
    setOperacion(normalized);
    updateQueryParams('operacion', normalized === '' ? '' : Number(normalized));
  };

  const handleTipoChange = (value: string) => {
    const normalized = value === '0' || value === '' ? '' : String(Number(value));
    setTipo(normalized);
    updateQueryParams('tipo', normalized === '' ? '' : Number(normalized));
  };

  const handleUbicacionChange = (value: string) => {
    const normalized = value === '0' || value === '' ? '' : String(Number(value));
    setUbicacionSeleccionada(normalized);
    updateQueryParams('ubicacion', normalized === '' ? '' : Number(normalized));
  };

  const clearFilters = () => {
    setOperacion('');
    setTipo('');
    setUbicacionSeleccionada('');
    setHabitaciones('');
    setPrecioMin('');
    setPrecioMax('');
    navigate('/propiedades', { replace: true });
  };

  // Contar filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (operacion) count++;
    if (tipo) count++;
    if (ubicacionSeleccionada) count++;
    if (habitaciones) count++;
    if (precioMin || precioMax) count++;
    return count;
  };

  // Helpers to get display names for chips
  const getOperacionName = (idStr: string) => {
    if (!idStr) return '';
    const id = Number(idStr);
    // Business mapping: show 'Comprar' for id === 2 (frontend label for users)
    if (id === 4) return 'Compra';
    const found = tiposOperacion.find(t => t.id === id);
    return found ? found.nombre : idStr;
  };

  // Helper to robustly extract operation type id from various backend shapes
  const getOperacionId = (op: unknown): number | undefined => {
    if (!op || typeof op !== 'object') return undefined;
    const rec = op as Record<string, unknown>;
    const tipoOper = rec['tipo_operacion'];
    if (tipoOper && typeof tipoOper === 'object') {
      const id = (tipoOper as Record<string, unknown>)['id'];
      if (typeof id === 'number') return id;
    }
    const tipoOperId = rec['tipo_operacion_id'];
    if (typeof tipoOperId === 'number') return tipoOperId;
    const tiposOper = rec['tipos_operacion'];
    if (tiposOper && typeof tiposOper === 'object') {
      const id = (tiposOper as Record<string, unknown>)['id'];
      if (typeof id === 'number') return id;
    }
    const tipoOperNumber = rec['tipo_operacion'];
    if (typeof tipoOperNumber === 'number') return tipoOperNumber;
    return undefined;
  };

  const getTipoName = (idStr: string) => {
    if (!idStr) return '';
    const id = Number(idStr);
    const found = tiposPropiedad.find(t => t.id === id);
    return found ? found.nombre : idStr;
  };

  const getUbicacionName = (idStr: string) => {
    if (!idStr) return '';
    const id = Number(idStr);
    const found = ubicaciones.find(u => u.id === id);
    return found ? `${found.ciudad} (${found.provincia})` : idStr;
  };

  const filteredProperties = propiedades.filter(p => {
    const matchesOperacion = !operacion || (
      p.operaciones_propiedad?.some(op => {
        const opId = getOperacionId(op);
        return opId !== undefined && opId === Number(operacion);
      })
    );

    const matchesTipo = !tipo || p.tipos_propiedad?.id === Number(tipo);

    const matchesUbicacion = !ubicacionSeleccionada || p.ubicaciones?.id === Number(ubicacionSeleccionada);

    const matchesHabitaciones = !habitaciones || (p.habitaciones ?? 0) === Number(habitaciones);

    const matchesPrecio = (!precioMin && !precioMax) || (
      p.operaciones_propiedad?.some(op => {
        const precio = op.precio ?? 0;
        return (!precioMin || precio >= Number(precioMin)) &&
               (!precioMax || precio <= Number(precioMax));
      })
    );

    return matchesOperacion && matchesTipo && matchesUbicacion && matchesHabitaciones && matchesPrecio;
  });

  // production-ready: no debug output


  return (
    <div className="min-h-screen">
      {/* Hero Section con Filtros Transparentes */}
      <section 
        className="relative min-h-[90vh] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/family-inicio.png)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#022550]/85 via-[#022550]/60 to-[#ec520b]/20"></div>
        
        <div className="relative z-10 flex flex-col justify-center min-h-[90vh] py-20">
          {/* Título */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Propiedades
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light">
                Explora nuestra selección exclusiva de propiedades.
              </p>
            </div>
          </div>

          {/* Filtros Transparentes al final del Hero */}
          <div className="absolute bottom-8 left-0 right-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
                    {/* Tipo de Operación */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-white/90 mb-2 text-center lg:text-left">
                        Tipo de Operación
                      </label>
                      <Select value={operacion} onValueChange={handleOperacionChange}>
                        <SelectTrigger className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 hover:bg-white/30 focus:bg-white/30 transition-all duration-300">
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="0">Todas</SelectItem>
                            {tiposOperacion.map(op => (
                              <SelectItem key={op.id} value={String(op.id)}>{op.id === 4 ? 'Compra' : op.nombre}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tipo de Propiedad */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-white/90 mb-2 text-center lg:text-left">
                        Tipo de Propiedad
                      </label>
                      <Select value={tipo} onValueChange={handleTipoChange}>
                        <SelectTrigger className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 hover:bg-white/30 focus:bg-white/30 transition-all duration-300">
                          <SelectValue placeholder="Todos los tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="0">Todos los tipos</SelectItem>
                            {tiposPropiedad.map(tp => (
                              <SelectItem key={tp.id} value={String(tp.id)}>{tp.nombre}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ubicación */}
                    <div className="flex-[1.5]">
                      <label className="block text-sm font-medium text-white/90 mb-2 text-center lg:text-left">
                        Ubicación
                      </label>
                      <Select value={ubicacionSeleccionada} onValueChange={handleUbicacionChange}>
                        <SelectTrigger className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 hover:bg-white/30 focus:bg-white/30 transition-all duration-300">
                          <SelectValue placeholder="Todas las ubicaciones" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="0">Todas las ubicaciones</SelectItem>
                            {ubicaciones.map(ubi => (
                              <SelectItem key={ubi.id} value={String(ubi.id)}>{`${ubi.ciudad} (${ubi.provincia})`}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Habitaciones */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-white/90 mb-2 text-center lg:text-left">
                        Habitaciones
                      </label>
                      <Select value={habitaciones} onValueChange={(v) => setHabitaciones(v === '0' ? '' : v)}>
                        <SelectTrigger className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 hover:bg-white/30 focus:bg-white/30 transition-all duration-300">
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="0">Todas</SelectItem>
                            {[1,2,3,4,5,6,7,8].map(n => (
                              <SelectItem key={n} value={String(n)}>{String(n)}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Precio */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-white/90 mb-2 text-center lg:text-left">
                        Precio (rango)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          className="w-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="Mín"
                          value={precioMin}
                          onChange={e => setPrecioMin(e.target.value)}
                          min={0}
                        />
                        <span className="self-center text-white/70">-</span>
                        <input
                          type="number"
                          className="w-1/2 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:ring-2 focus:ring-white/50 transition-all duration-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="Máx"
                          value={precioMax}
                          onChange={e => setPrecioMax(e.target.value)}
                          min={0}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Active Filters Chips (solo si hay filtros activos) */}
      {getActiveFiltersCount() > 0 && (
        <section className="py-4 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {operacion && (
                <span className="bg-[#ec520b] text-white px-3 py-1 rounded-full text-sm">
                  Operación: {getOperacionName(operacion)}
                  <button
                    onClick={() => handleOperacionChange('')}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              )}
              {tipo && (
                <span className="bg-[#ec520b] text-white px-3 py-1 rounded-full text-sm">
                  Tipo: {getTipoName(tipo)}
                  <button
                    onClick={() => handleTipoChange('')}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              )}
              {ubicacionSeleccionada && (
                <span className="bg-[#ec520b] text-white px-3 py-1 rounded-full text-sm">
                  Ubicación: {getUbicacionName(ubicacionSeleccionada)}
                  <button
                    onClick={() => handleUbicacionChange('')}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              )}
              {habitaciones && (
                <span className="bg-[#ec520b] text-white px-3 py-1 rounded-full text-sm">
                  Habitaciones: {habitaciones}
                  <button
                    onClick={() => setHabitaciones('')}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              )}
              {(precioMin || precioMax) && (
                <span className="bg-[#ec520b] text-white px-3 py-1 rounded-full text-sm">
                  Precio: {precioMin || '0'} - {precioMax || '∞'}
                  <button
                    onClick={() => {
                      setPrecioMin('');
                      setPrecioMax('');
                    }}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm"
            >
              Limpiar filtros
            </button>
          </div>
        </section>
      )}

  {/* Results Section */}
  <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            /* Loader */
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-[#ec520b] rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#022550] rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Cargando propiedades...</p>
              <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}>
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay propiedades que coincidan con los filtros
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta modificar los filtros para ver más resultados
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 bg-[#ec520b] hover:bg-[#022550] text-white px-4 py-2 rounded-lg text-sm"
              >
                Ver todas las propiedades
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-[#ec520b]/10 to-[#022550]/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#ec520b]/20 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#022550]/20 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#022550] rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                ¿No encontraste lo que buscabas?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Nuestro equipo puede ayudarte a encontrar la propiedad perfecta. Contáctanos y recibe atención personalizada.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-[#022550] hover:bg-[#ec520b] transform hover:scale-105 transition-all duration-300 border-0"
                >
                  <a 
                    href="https://wa.me/5493515155669?text=Hola,%20no%20encontré%20la%20propiedad%20que%20busco,%20¿pueden%20ayudarme?"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Contactar por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* debug panel removed */}

      {/* ContactForm para consultas */}
      <ContactForm 
        title="¿Tenés alguna consulta sobre las propiedades?"
        subtitle="Nuestro equipo está listo para ayudarte a encontrar tu hogar ideal"
        badge="Consultas"
        showContactInfo={true}
        backgroundImage={heroImage}
      />

      {/* Botones Flotantes */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Botón Scroll to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#022550] to-[#033366] hover:from-[#ec520b] hover:to-[#ff6b1a] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
            aria-label="Volver arriba"
          >
            <ChevronUp className="h-6 w-6 sm:h-7 sm:w-7" />
            
            <span className="absolute right-full mr-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              Volver arriba
              <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></span>
            </span>
          </button>
        )}
        
        {/* Botón WhatsApp */}
        <a
          href="https://wa.me/5493515155669?text=Hola,%20quiero%20información%20sobre%20las%20propiedades%20disponibles"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" />
          
          <span className="absolute right-full mr-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            ¡Consultanos por WhatsApp!
            <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></span>
          </span>
        </a>
      </div>
    </div>
  );
};

export default Properties;