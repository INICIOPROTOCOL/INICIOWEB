import { useState } from 'react';
import PropertyCard from '@/components/PropertyCard';
import SearchForm from '@/components/SearchForm';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';

const Properties = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const properties = [
    {
      id: '1',
      title: 'Casa Moderna en Palermo',
      price: '$350.000',
      location: 'Palermo, CABA',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      type: 'venta' as const,
      image: property1,
      featured: true
    },
    {
      id: '2',
      title: 'Departamento Premium',
      price: '$180.000/mes',
      location: 'Puerto Madero, CABA',
      bedrooms: 2,
      bathrooms: 2,
      area: 85,
      type: 'alquiler' as const,
      image: property2,
      featured: true
    },
    {
      id: '3',
      title: 'Oficina Corporativa',
      price: '$450.000',
      location: 'Microcentro, CABA',
      bedrooms: 0,
      bathrooms: 4,
      area: 200,
      type: 'venta' as const,
      image: property3
    },
    {
      id: '4',
      title: 'Loft en San Telmo',
      price: '$280.000',
      location: 'San Telmo, CABA',
      bedrooms: 1,
      bathrooms: 1,
      area: 60,
      type: 'venta' as const,
      image: property1
    },
    {
      id: '5',
      title: 'Casa en Zona Norte',
      price: '$220.000/mes',
      location: 'San Isidro, GBA',
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      type: 'alquiler' as const,
      image: property2
    },
    {
      id: '6',
      title: 'Departamento Nuevo',
      price: '$420.000',
      location: 'Belgrano, CABA',
      bedrooms: 2,
      bathrooms: 2,
      area: 95,
      type: 'venta' as const,
      image: property3,
      featured: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Todas las Propiedades
            </h1>
            <p className="text-xl text-white/90">
              Explora nuestra amplia selección de propiedades disponibles
            </p>
          </div>
          <SearchForm />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Resultados de búsqueda
              </h2>
              <p className="text-muted-foreground">
                Mostrando {properties.length} propiedades disponibles
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select defaultValue="newest">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Más recientes</SelectItem>
                  <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                  <SelectItem value="area-large">Área: mayor a menor</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters */}
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="px-3 py-1">
              Buenos Aires × 
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              2+ dormitorios ×
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              $100.000 - $400.000 ×
            </Badge>
          </div>

          {/* Properties Grid */}
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
                <PropertyCard {...property} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <Button variant="default">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <span className="px-2 text-muted-foreground">...</span>
              <Button variant="outline">10</Button>
              <Button variant="outline">
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Properties;