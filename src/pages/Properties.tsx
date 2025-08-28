import { useEffect, useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Home } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';
import axios from 'axios';

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
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tipo, setTipo] = useState('');
  const [operacion, setOperacion] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [tiposPropiedad, setTiposPropiedad] = useState<{ id: number; nombre: string }[]>([]);
  const [ubicaciones, setUbicaciones] = useState<{ id: number; ciudad: string; provincia: string; pais: string; barrio?: string }[]>([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Propiedades
        const propiedadesRes = await axios.get(`${API_URL}/propiedades`);
        setPropiedades(propiedadesRes.data || []);
        // Tipos de propiedad (igual que SearchForm)
        const tiposRes = await axios.get(`${API_URL}/tipos`);
        setTiposPropiedad(tiposRes.data || []);
        // Ubicaciones (igual que admin/Ubicaciones)
        const ubicacionesRes = await axios.get(`${API_URL}/ubicaciones`);
        setUbicaciones(ubicacionesRes.data || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
        setPropiedades([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-[40vh] sm:min-h-[32vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/assets/hero-bg.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#022550]/90 via-[#022550]/70 to-[#ec520b]/30"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Propiedades
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light">
              Explora nuestra selección exclusiva de propiedades.
            </p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filtros mejorados - Estilo SearchForm */}
          <div className="mb-8">
            <Card className="w-full bg-white/85 backdrop-blur-md border border-white/20 shadow-xl">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
                  
                  {/* Tipo de Operación */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center lg:text-left">
                      Operación
                    </label>
                    <select
                      className="w-full bg-white/80 border-gray-200 hover:border-[#022550]/50 focus:border-[#022550] focus:ring-2 focus:ring-[#022550]/20 transition-all duration-300 rounded-lg px-3 py-2 text-sm"
                      value={operacion}
                      onChange={e => setOperacion(e.target.value)}
                    >
                      <option value="">Todas</option>
                      <option value="venta">Venta</option>
                      <option value="alquiler">Alquiler</option>
                    </select>
                  </div>

                  {/* Tipo de Propiedad dinámico (igual que SearchForm) */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center lg:text-left">
                      Tipo de Propiedad
                    </label>
                    <select
                      className="w-full bg-white/80 border-gray-200 hover:border-[#022550]/50 focus:border-[#022550] focus:ring-2 focus:ring-[#022550]/20 transition-all duration-300 rounded-lg px-3 py-2 text-sm"
                      value={tipo}
                      onChange={e => setTipo(e.target.value)}
                    >
                      <option value="">Todos los tipos</option>
                      {tiposPropiedad.map(tp => (
                        <option key={tp.id} value={tp.nombre}>{tp.nombre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ubicación dinámico (igual que admin/Ubicaciones) */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center lg:text-left">
                      Ubicación
                    </label>
                    <select
                      className="w-full bg-white/80 border-gray-200 hover:border-[#022550]/50 focus:border-[#022550] focus:ring-2 focus:ring-[#022550]/20 transition-all duration-300 rounded-lg px-3 py-2 text-sm"
                      value={ubicacionSeleccionada}
                      onChange={e => setUbicacionSeleccionada(e.target.value)}
                    >
                      <option value="">Todas las ubicaciones</option>
                      {ubicaciones.map(ubi => (
                        <option key={ubi.id} value={ubi.ciudad}>{ubi.ciudad} ({ubi.provincia})</option>
                      ))}
                    </select>
                  </div>

                  {/* Precio compacto (rango en una sola línea) */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-center lg:text-left">
                      Precio (rango)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        className="w-1/2 bg-white/80 border-gray-200 hover:border-[#022550]/50 focus:border-[#022550] focus:ring-2 focus:ring-[#022550]/20 transition-all duration-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="Mín"
                        value={precioMin}
                        onChange={e => setPrecioMin(e.target.value)}
                        min={0}
                      />
                      <span className="self-center text-gray-400">-</span>
                      <input
                        type="number"
                        className="w-1/2 bg-white/80 border-gray-200 hover:border-[#022550]/50 focus:border-[#022550] focus:ring-2 focus:ring-[#022550]/20 transition-all duration-300 rounded-lg px-3 py-2 text-sm"
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


          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <span className="animate-spin h-8 w-8 border-4 border-[#ec520b] border-t-transparent rounded-full inline-block" />
            </div>
          ) : (
            /* Properties Grid filtrada */
            <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}>
              {propiedades
                .filter(p =>
                  (!tipo || p.tipos_propiedad?.nombre === tipo) &&
                  (!operacion || (Array.isArray(p.operaciones_propiedad) && p.operaciones_propiedad.length > 0 && p.operaciones_propiedad.some(op => op.tipos_operacion?.nombre?.toLowerCase() === operacion))) &&
                  (!precioMin || (p.operaciones_propiedad?.[0]?.precio ?? 0) >= Number(precioMin)) &&
                  (!precioMax || (p.operaciones_propiedad?.[0]?.precio ?? 0) <= Number(precioMax)) &&
                  (!ubicacionSeleccionada || p.ubicaciones?.ciudad === ubicacionSeleccionada) 
                )
                .map((property, idx) => (
                  <div key={property.id}>
                    <PropertyCard property={property} />
                  </div>
                ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && propiedades.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay propiedades en la base de datos
              </h3>
              <p className="text-sm text-gray-500">
                Puedes agregar propiedades desde el panel de administración.
              </p>
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
              <div className="w-16 h-16 bg-gradient-to-r from-[#ec520b] to-[#022550] rounded-full flex items-center justify-center mx-auto mb-6">
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
                  className="bg-gradient-to-r from-[#ec520b] to-[#022550] hover:from-[#022550] hover:to-[#ec520b] transform hover:scale-105 transition-all duration-300"
                >
                  <a href="https://wa.me/5493515155669?text=Hola,%20no%20encontré%20la%20propiedad%20que%20busco,%20¿pueden%20ayudarme?">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Contactar por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ContactForm para consultas */}
      <ContactForm 
        title="¿Tenés alguna consulta sobre las propiedades?"
        subtitle="Nuestro equipo está listo para ayudarte a encontrar tu hogar ideal"
        badge="Consultas"
        showContactInfo={true}
        backgroundImage={heroImage}
      />

      {/* Botón Flotante de WhatsApp */}
      <div className="fixed bottom-6 right-6 z-50">
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