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
    {/* Formulario horizontal en una sola fila */}
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch">
      {/* PASO 1: Tipo de Operación */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2 text-center md:text-left">
          <span className="inline-flex items-center justify-center md:justify-start">
            <span className="w-5 h-5 bg-[#ec520b] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
            Operación
          </span>
        </label>
        <RadioGroup className="mt-2">
          <div className="flex justify-center md:justify-start space-x-4">
            <Button
              variant={operationType === 'compra' ? 'default' : 'outline'}
              onClick={() => setOperationType('compra')}
              className={`${operationType === 'compra' 
                ? 'bg-[#ec520b] hover:bg-[#022550] text-white' 
                : 'bg-white/80 hover:bg-[#ec520b]/10 hover:border-[#ec520b]'
              } transition-all duration-200`}
            >
              Compra
            </Button>
            <Button
              variant={operationType === 'alquiler' ? 'default' : 'outline'}
              onClick={() => setOperationType('alquiler')}
              className={`${operationType === 'alquiler' 
                ? 'bg-[#ec520b] hover:bg-[#022550] text-white' 
                : 'bg-white/80 hover:bg-[#ec520b]/10 hover:border-[#ec520b]'
              } transition-all duration-200`}
            >
              Alquiler
            </Button>
          </div>
        </RadioGroup>
      </div>

      {/* PASO 2: Tipo de Propiedad */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2 text-center md:text-left">
          <span className="inline-flex items-center justify-center md:justify-start">
            <span className="w-5 h-5 bg-[#ec520b] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">2</span>
            Tipo de Propiedad
          </span>
        </label>
        <div className="flex justify-center">
          <Select className="w-full max-w-xs md:max-w-none">
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
      </div>

      {/* PASO 3: Ubicación */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2 text-center md:text-left">
          <span className="inline-flex items-center justify-center md:justify-start">
            <span className="w-5 h-5 bg-[#ec520b] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">3</span>
            Ubicación
          </span>
        </label>
        <div className="flex justify-center">
          <div className="relative w-full max-w-xs md:max-w-none">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 z-10" />
            <Input
              placeholder="Ingresa la Localidad"
              className="w-full pl-10 bg-white/80 border-gray-200 hover:border-[#ec520b]/50 focus:border-[#ec520b] focus:ring-2 focus:ring-[#ec520b]/20 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Botón de Búsqueda */}
      <div className="flex-1 flex items-end justify-center md:justify-start">
        <Button 
          className="w-full max-w-xs md:max-w-none bg-[#022550] hover:bg-[#ec520b] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 h-10 font-semibold"
          size="default"
        >
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
  );
};

export default SearchForm;
