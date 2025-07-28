import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';

const SearchForm = () => {
  const [searchType, setSearchType] = useState('venta');

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-elegant bg-card/95 backdrop-blur-sm border-border/50">
      <CardContent className="p-6">
        {/* Search Type Tabs */}
        <div className="flex mb-6 bg-muted rounded-lg p-1">
          <Button
            variant={searchType === 'venta' ? 'default' : 'ghost'}
            className={`flex-1 ${searchType === 'venta' ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => setSearchType('venta')}
          >
            Comprar
          </Button>
          <Button
            variant={searchType === 'alquiler' ? 'default' : 'ghost'}
            className={`flex-1 ${searchType === 'alquiler' ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => setSearchType('alquiler')}
          >
            Alquilar
          </Button>
        </div>

        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Location */}
          <div className="lg:col-span-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Ubicación (ej. Palermo, CABA)"
                className="pl-10"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <Select>
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Tipo" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="house">Casa</SelectItem>
                <SelectItem value="apartment">Departamento</SelectItem>
                <SelectItem value="office">Oficina</SelectItem>
                <SelectItem value="commercial">Local Comercial</SelectItem>
                <SelectItem value="land">Terreno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <Select>
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Precio" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {searchType === 'venta' ? (
                  <>
                    <SelectItem value="0-100000">Hasta $100.000</SelectItem>
                    <SelectItem value="100000-200000">$100.000 - $200.000</SelectItem>
                    <SelectItem value="200000-300000">$200.000 - $300.000</SelectItem>
                    <SelectItem value="300000-500000">$300.000 - $500.000</SelectItem>
                    <SelectItem value="500000+">Más de $500.000</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="0-50000">Hasta $50.000</SelectItem>
                    <SelectItem value="50000-100000">$50.000 - $100.000</SelectItem>
                    <SelectItem value="100000-150000">$100.000 - $150.000</SelectItem>
                    <SelectItem value="150000-200000">$150.000 - $200.000</SelectItem>
                    <SelectItem value="200000+">Más de $200.000</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div>
            <Button className="w-full bg-gradient-primary">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Dormitorios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Baños" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Área mín." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50m²+</SelectItem>
                <SelectItem value="100">100m²+</SelectItem>
                <SelectItem value="150">150m²+</SelectItem>
                <SelectItem value="200">200m²+</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Antigüedad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">A estrenar</SelectItem>
                <SelectItem value="5">Hasta 5 años</SelectItem>
                <SelectItem value="10">Hasta 10 años</SelectItem>
                <SelectItem value="any">Cualquiera</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchForm;