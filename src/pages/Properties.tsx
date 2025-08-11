import { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import SearchForm from '@/components/SearchForm';
import ContactForm from '@/components/ContactForm';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  SlidersHorizontal, 
  Grid3X3, 
  List, 
  MapPin, 
  Filter,
  Search,
  Star,
  TrendingUp,
  Home,
  Building2,
  MessageCircle
} from 'lucide-react';
import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';
import heroImage from '@/assets/hero-bg.jpg';

// Interfaces para TypeScript (preparadas para backend)
interface Property {
  id: string;
  titulo: string;
  descripcion?: string;
  precio: number;
  moneda: string;
  precio_alquiler?: number;
  expensas?: number;
  area_construida: number;
  area_total?: number;
  habitaciones: number;
  banos: number;
  garages: number;
  direccion: string;
  latitud?: number;
  longitud?: number;
  estado_propiedad: 'disponible' | 'vendido' | 'alquilado' | 'reservado';
  tipo_operacion: 'venta' | 'alquiler' | 'venta_alquiler';
  fecha_publicacion: string;
  agente_id: string;
  tipo_propiedad: {
    id: string;
    nombre: string;
  };
  ubicacion: {
    id: string;
    nombre: string;
    tipo: string;
  };
  imagen_principal: string;
  imagenes: Array<{
    id: string;
    url_imagen: string;
    es_principal: boolean;
    orden: number;
  }>;
  caracteristicas: Array<{
    id: string;
    nombre: string;
  }>;
  destacada: boolean;
  visitas: number;
  slug: string;
}

interface SearchFilters {
  tipo_operacion?: string;
  tipo_propiedad_id?: string;
  ubicacion_id?: string;
  precio_min?: number;
  precio_max?: number;
  habitaciones_min?: number;
  banos_min?: number;
  area_min?: number;
  caracteristicas?: string[];
}

const Properties = () => {
  // Hook para scroll al inicio
  useScrollToTop();

  // Estados
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');

  // Datos hardcodeados (2 propiedades como ejemplo)
  const hardcodedProperties: Property[] = [
    {
      id: '1',
      titulo: 'Casa Moderna en Villa Allende',
      descripcion: 'Hermosa casa moderna con amplio jardín y piscina',
      precio: 350000,
      moneda: 'USD',
      precio_alquiler: 180000,
      expensas: 15000,
      area_construida: 120,
      area_total: 200,
      habitaciones: 3,
      banos: 2,
      garages: 2,
      direccion: 'Av. San Martín 1234, Villa Allende',
      latitud: -31.2951,
      longitud: -64.2615,
      estado_propiedad: 'disponible',
      tipo_operacion: 'venta_alquiler',
      fecha_publicacion: '2024-01-15',
      agente_id: '1',
      tipo_propiedad: { id: '1', nombre: 'Casa' },
      ubicacion: { id: '1', nombre: 'Villa Allende', tipo: 'ciudad' },
      imagen_principal: property1,
      imagenes: [
        { id: '1', url_imagen: property1, es_principal: true, orden: 1 }
      ],
      caracteristicas: [
        { id: '1', nombre: 'Piscina' },
        { id: '2', nombre: 'Jardín' },
        { id: '3', nombre: 'Garage' }
      ],
      destacada: true,
      visitas: 245,
      slug: 'casa-moderna-villa-allende'
    },
    {
      id: '2',
      titulo: 'Departamento Premium en Centro',
      descripcion: 'Moderno departamento en el corazón de Villa Allende',
      precio: 280000,
      moneda: 'USD',
      expensas: 25000,
      area_construida: 85,
      habitaciones: 2,
      banos: 2,
      garages: 1,
      direccion: 'Calle Córdoba 567, Villa Allende',
      estado_propiedad: 'disponible',
      tipo_operacion: 'venta',
      fecha_publicacion: '2024-01-20',
      agente_id: '1',
      tipo_propiedad: { id: '2', nombre: 'Departamento' },
      ubicacion: { id: '1', nombre: 'Villa Allende', tipo: 'ciudad' },
      imagen_principal: property2,
      imagenes: [
        { id: '2', url_imagen: property2, es_principal: true, orden: 1 }
      ],
      caracteristicas: [
        { id: '4', nombre: 'Balcón' },
        { id: '5', nombre: 'Luminoso' },
        { id: '6', nombre: 'Céntrico' }
      ],
      destacada: true,
      visitas: 189,
      slug: 'departamento-premium-centro'
    }
  ];

  // Simulación de API call (preparado para backend)
  const fetchProperties = async (page: number = 1, searchFilters: SearchFilters = {}) => {
    setLoading(true);
    try {
      // TODO: Reemplazar con llamada real al backend
      // const response = await fetch(`/api/propiedades?page=${page}&limit=12`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(searchFilters)
      // });
      // const data = await response.json();
      
      // Simulación con datos hardcodeados
      await new Promise(resolve => setTimeout(resolve, 500));
      setProperties(hardcodedProperties);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar propiedades
  useEffect(() => {
    fetchProperties(currentPage, filters);
  }, [currentPage, filters, sortBy]);

  // Estadísticas para mostrar
  const stats = {
    total: properties.length,
    ventas: properties.filter(p => p.tipo_operacion.includes('venta')).length,
    alquileres: properties.filter(p => p.tipo_operacion.includes('alquiler')).length,
    destacadas: properties.filter(p => p.destacada).length
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#022550]/90 via-[#022550]/70 to-[#ec520b]/30"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Badge variant="outline" className="mb-6 bg-white/20 text-white border-white/30">
              Encuentra tu hogar ideal
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Propiedades
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light">
              Explora nuestra selección exclusiva de propiedades en Villa Allende y alrededores
            </p>

            {/* Stats rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-white/80">Propiedades</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{stats.ventas}</div>
                <div className="text-sm text-white/80">En Venta</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{stats.alquileres}</div>
                <div className="text-sm text-white/80">En Alquiler</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{stats.destacadas}</div>
                <div className="text-sm text-white/80">Destacadas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Busca tu propiedad ideal
            </h2>
            <p className="text-gray-600">
              Utiliza nuestros filtros avanzados para encontrar exactamente lo que necesitas
            </p>
          </div>
          <SearchForm />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Resultados de búsqueda
              </h2>
              <p className="text-gray-600">
                {loading ? 'Cargando...' : `Mostrando ${properties.length} propiedades disponibles`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más recientes</SelectItem>
                  <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                  <SelectItem value="area-large">Área: mayor a menor</SelectItem>
                  <SelectItem value="most-visited">Más visitadas</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border border-gray-200 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-[#ec520b] hover:bg-[#ec520b]' : ''}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-[#ec520b] hover:bg-[#ec520b]' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters */}
              <Button 
                variant="outline"
                className="border-[#ec520b] text-[#ec520b] hover:bg-[#ec520b] hover:text-white"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="px-3 py-1 bg-[#ec520b]/10 text-[#ec520b]">
              Villa Allende
              <button className="ml-2 hover:text-red-600">×</button>
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 bg-[#ec520b]/10 text-[#ec520b]">
              2+ dormitorios
              <button className="ml-2 hover:text-red-600">×</button>
            </Badge>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Properties Grid */
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {properties.map((property, index) => (
                <div 
                  key={property.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PropertyCard 
                    id={property.id}
                    title={property.titulo}
                    price={`$${property.precio.toLocaleString()}`}
                    location={property.direccion}
                    bedrooms={property.habitaciones}
                    bathrooms={property.banos}
                    area={property.area_construida}
                    type={property.tipo_operacion as 'venta' | 'alquiler'}
                    image={property.imagen_principal}
                    featured={property.destacada}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && properties.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No encontramos propiedades
              </h3>
              <p className="text-gray-600 mb-6">
                Intenta modificar los filtros de búsqueda o contáctanos para ayudarte a encontrar lo que necesitas
              </p>
              <Button 
                onClick={() => setFilters({})}
                className="bg-gradient-to-r from-[#ec520b] to-[#022550] hover:from-[#022550] hover:to-[#ec520b]"
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Anterior
                </Button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => (
                  <Button 
                    key={i + 1}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    className={currentPage === i + 1 ? 'bg-[#ec520b] hover:bg-[#ec520b]' : ''}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                {totalPages > 5 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Siguiente
                </Button>
              </div>
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