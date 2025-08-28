import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface TipoPropiedad {
  id: number;
  nombre: string;
}

interface SearchFormProps {
  onSearch?: (filters: SearchFilters) => void;
  className?: string;
}

interface SearchFilters {
  operacion: string;
  tipoPropiedad: string;
  ubicacion: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, className = '' }) => {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [operationType, setOperationType] = useState<string>('venta');
  const [selectedTipoPropiedad, setSelectedTipoPropiedad] = useState<string>('');
  const [ubicacionInput, setUbicacionInput] = useState<string>('');
  
  // Estados para datos del backend
  const [tiposPropiedad, setTiposPropiedad] = useState<TipoPropiedad[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);

  // Cargar tipos de propiedad al montar el componente
  useEffect(() => {
    const fetchTiposPropiedad = async () => {
      setLoadingTipos(true);
      try {
        const response = await axios.get(`${API_URL}/tipos`);
        setTiposPropiedad(response.data || []);
      } catch (error) {
        console.error('Error al cargar tipos de propiedad:', error);
        setTiposPropiedad([]);
      }
      setLoadingTipos(false);
    };

    fetchTiposPropiedad();
  }, []);

  // Manejar búsqueda
  const handleSearch = () => {
    const filters: SearchFilters = {
      operacion: operationType,
      tipoPropiedad: selectedTipoPropiedad,
      ubicacion: ubicacionInput.trim()
    };

    // Si hay callback personalizado, usarlo
    if (onSearch) {
      onSearch(filters);
      return;
    }

    // Construir query params para la navegación
    const queryParams = new URLSearchParams();
    
    if (operationType) queryParams.set('operacion', operationType);
    if (selectedTipoPropiedad) queryParams.set('tipo', selectedTipoPropiedad);
    if (ubicacionInput.trim()) queryParams.set('ubicacion', ubicacionInput.trim());

    // Navegar a la página de propiedades con filtros
    const queryString = queryParams.toString();
    navigate(`/propiedades${queryString ? `?${queryString}` : ''}`);
  };

  // Manejar Enter en el input de ubicación
  const handleUbicacionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className={`w-full max-w-5xl mx-auto bg-white/85 backdrop-blur-md border border-white/20 shadow-xl ${className}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch">
          {/* PASO 1: Tipo de Operación */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center md:text-left">
              <span className="inline-flex items-center justify-center md:justify-start">
                <span className="w-5 h-5 bg-[#ec520b] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">1</span>
                Operación
              </span>
            </label>
            <div className="flex justify-center md:justify-start space-x-4">
              <Button
                variant={operationType === 'venta' ? 'default' : 'outline'}
                onClick={() => setOperationType('venta')}
                className={`${operationType === 'venta' 
                  ? 'bg-[#ec520b] hover:bg-[#022550] text-white' 
                  : 'bg-white/80 hover:bg-[#ec520b]/10 hover:border-[#ec520b]'
                } transition-all duration-200`}
              >
                Venta
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
              <Select 
                value={selectedTipoPropiedad} 
                onValueChange={setSelectedTipoPropiedad}
                disabled={loadingTipos}
              >
                <SelectTrigger className="w-full max-w-xs md:max-w-none bg-white/80 border-gray-200 hover:border-[#ec520b]/50 transition-colors">
                  <SelectValue placeholder={loadingTipos ? "Cargando..." : "Seleccionar tipo"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  {tiposPropiedad.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* PASO 3: Ubicación (Campo de texto simple) */}
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
                  value={ubicacionInput}
                  onChange={(e) => setUbicacionInput(e.target.value)}
                  onKeyPress={handleUbicacionKeyPress}
                  placeholder="Ingresa ciudad, barrio o zona"
                  className="w-full pl-10 bg-white/80 border-gray-200 hover:border-[#ec520b]/50 focus:border-[#ec520b] focus:ring-2 focus:ring-[#ec520b]/20 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Botón de Búsqueda */}
          <div className="flex-1 flex items-end justify-center md:justify-start">
            <Button 
              onClick={handleSearch}
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