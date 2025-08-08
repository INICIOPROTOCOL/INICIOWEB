import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Radio } from 'lucide-react';
import { RadioGroup } from '@radix-ui/react-context-menu';

const SearchForm = () => {
  const [operationType, setOperationType] = useState<string>('compra');

  return (
    <Card className="w-full max-w-5xl mx-auto bg-white/85 backdrop-blur-md border border-white/20 shadow-xl">
      <CardContent className="p-4 sm:p-6">
        {/* Encabezado compacto */}
        {/* <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
            Encuentra tu propiedad ideal
          </h2>
        </div> */}

        {/* Formulario horizontal en una sola fila */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* PASO 1: Tipo de Operación */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="inline-flex items-center">
                <span className="w-5 h-5 bg-[#ec520b] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
                Operación
              </span>
            </label>
            {/* <Select value={operationType} onValueChange={setOperationType}>
              <SelectTrigger className="w-full bg-white/80 border-gray-200 hover:border-[#ec520b]/50 transition-colors">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compra">💰 Compra</SelectItem>
                <SelectItem value="alquiler">🏠 Alquiler</SelectItem>
              </SelectContent>
            </Select> */}
            <RadioGroup className="mt-2">
              <div className="flex space-x-4">
                <Button
                  variant={operationType === 'compra' ? 'default' : 'outline'}
                  onClick={() => setOperationType('compra')}
                  className={`${operationType === 'compra' 
                    ? 'bg-gradient-to-r from-[#ec520b] to-[#022550] hover:from-[#022550] hover:to-[#ec520b] text-white' 
                    : 'bg-white/80 hover:bg-[#ec520b]/10 hover:border-[#ec520b]'
                  } transition-all duration-200`}
                >
                  Compra
                </Button>
                <Button
                  variant={operationType === 'alquiler' ? 'default' : 'outline'}
                  onClick={() => setOperationType('alquiler')}
                  className={`${operationType === 'alquiler' 
                    ? 'bg-gradient-to-r from-[#ec520b] to-[#022550] hover:from-[#022550] hover:to-[#ec520b] text-white' 
                    : 'bg-white/80 hover:bg-[#ec520b]/10 hover:border-[#ec520b]'
                  } transition-all duration-200`}
                >
                Alquiler
                </Button>
          </div>
            </RadioGroup>
                
          </div>

          {/* PASO 2: Tipo de Propiedad */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="inline-flex items-center">
                <span className="w-5 h-5 bg-[#ec520b] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
                Tipo de Propiedad
              </span>
            </label>
            <Select>
              <SelectTrigger className="w-full bg-white/80 border-gray-200 hover:border-[#ec520b]/50 transition-colors">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casa">🏠 Casa</SelectItem>
                <SelectItem value="departamento">🏢 Departamento</SelectItem>
                <SelectItem value="cochera">🚗 Cochera</SelectItem>
                <SelectItem value="terreno">🌿 Terreno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PASO 3: Ubicación */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="inline-flex items-center">
                <span className="w-5 h-5 bg-[#ec520b] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">3</span>
                Ubicación
              </span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 z-10" />
              <Input
                placeholder="Ingresa la Localidad"
                className="pl-10 bg-white/80 border-gray-200 hover:border-[#ec520b]/50 focus:border-[#ec520b] focus:ring-2 focus:ring-[#ec520b]/20 transition-all duration-300"
              />
            </div>
          </div>

          {/* Botón de Búsqueda */}
          <div className="md:col-span-2">
            <Button 
              className="w-full bg-gradient-to-r from-[#ec520b] to-[#022550] hover:from-[#022550] hover:to-[#ec520b] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 h-10"
              size="default"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        {/* Versión móvil - Stack vertical */}
        <div className="md:hidden space-y-4 mt-6">
          {/* PASO 1 Móvil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="inline-flex items-center">
                <span className="w-5 h-5 bg-[#ec520b] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
                Operación
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={operationType === 'compra' ? 'default' : 'outline'}
                onClick={() => setOperationType('compra')}
                className={`${operationType === 'compra' 
                  ? 'bg-gradient-to-r from-[#ec520b] to-[#022550] hover:from-[#022550] hover:to-[#ec520b] text-white' 
                  : 'bg-white/80 hover:bg-[#ec520b]/10 hover:border-[#ec520b]'
                } transition-all duration-200`}
              >
                💰 Compra
              </Button>
              <Button
                variant={operationType === 'alquiler' ? 'default' : 'outline'}
                onClick={() => setOperationType('alquiler')}
                className={`${operationType === 'alquiler' 
                  ? 'bg-gradient-to-r from-[#ec520b] to-[#022550] hover:from-[#022550] hover:to-[#ec520b] text-white' 
                  : 'bg-white/80 hover:bg-[#ec520b]/10 hover:border-[#ec520b]'
                } transition-all duration-200`}
              >
                🏠 Alquiler
              </Button>
            </div>
          </div>

          {/* PASO 2 Móvil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="inline-flex items-center">
                <span className="w-5 h-5 bg-[#ec520b] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
                Tipo de Propiedad
              </span>
            </label>
            <Select>
              <SelectTrigger className="w-full bg-white/80 border-gray-200">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casa">🏠 Casa</SelectItem>
                <SelectItem value="departamento">🏢 Departamento</SelectItem>
                <SelectItem value="cochera">🚗 Cochera</SelectItem>
                <SelectItem value="terreno">🌿 Terreno</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PASO 3 Móvil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="inline-flex items-centers">
                <span className="w-5 h-5 bg-[#ec520b] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">3</span>
                Ubicación
              </span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Ingresa la ubicación"
                className="pl-10 bg-white/80 border-gray-200"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchForm;