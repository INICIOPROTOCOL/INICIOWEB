import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface TipoPropiedad {
  id: number;
  nombre: string;
}

interface Ubicacion {
  id: number;
  ciudad: string;
  barrio?: string;
  provincia: string;
  pais: string;
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
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [ubicacionesFiltradas, setUbicacionesFiltradas] = useState<Ubicacion[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [loadingUbicaciones, setLoadingUbicaciones] = useState(false);
  const [selectedUbicacion, setSelectedUbicacion] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar tipos de propiedad y ubicaciones al montar el componente
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

    const fetchUbicaciones = async () => {
      setLoadingUbicaciones(true);
      try {
        const response = await axios.get(`${API_URL}/ubicaciones`);
        const ubicacionesData = response.data || [];
        setUbicaciones(ubicacionesData);
        setUbicacionesFiltradas(ubicacionesData);
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error);
        setUbicaciones([]);
        setUbicacionesFiltradas([]);
      }
      setLoadingUbicaciones(false);
    };

    fetchTiposPropiedad();
    fetchUbicaciones();
  }, []);

  // Filtrar ubicaciones mientras escribe - mostrar todas si no hay texto
  useEffect(() => {
    if (ubicacionInput.trim() === '') {
      setUbicacionesFiltradas(ubicaciones);
    } else {
      const filtradas = ubicaciones.filter(ubicacion => {
        const searchText = ubicacionInput.toLowerCase();
        return (
          ubicacion.ciudad.toLowerCase().includes(searchText) ||
          ubicacion.barrio?.toLowerCase().includes(searchText) ||
          ubicacion.provincia.toLowerCase().includes(searchText)
        );
      });
      setUbicacionesFiltradas(filtradas);
    }
  }, [ubicacionInput, ubicaciones]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar selección de ubicación
  const handleUbicacionSelect = (ubicacion: Ubicacion) => {
    const ubicacionText = `${ubicacion.ciudad}${ubicacion.barrio ? `, ${ubicacion.barrio}` : ''}`;
    setUbicacionInput(ubicacionText);
    setSelectedUbicacion(ubicacion.id.toString());
    setShowDropdown(false);
  };

  // Manejar búsqueda
  const handleSearch = () => {
    const filters: SearchFilters = {
      operacion: operationType,
      tipoPropiedad: selectedTipoPropiedad,
      ubicacion: selectedUbicacion || ubicacionInput.trim()
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
    if (selectedUbicacion || ubicacionInput.trim()) {
      queryParams.set('ubicacion', selectedUbicacion || ubicacionInput.trim());
    }

    // Navegar a la página de propiedades con filtros
    const queryString = queryParams.toString();
    navigate(`/propiedades${queryString ? `?${queryString}` : ''}`);
  };

  // Manejar Enter y otras teclas en el input de ubicación
  const handleUbicacionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  // Manejar focus en input de ubicación
  const handleUbicacionFocus = () => {
    setShowDropdown(true);
  };

  return (
    <Card className={`w-full max-w-7xl mx-auto bg-white/85 backdrop-blur-md border border-white/20 shadow-xl ${className}`}>
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-stretch">
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
                  <SelectTrigger className="w-full h-10 min-w-[250px] bg-white/80 border-gray-200 hover:border-[#ec520b]/50 focus:ring-2 focus:ring-[#ec520b]/20">
        <SelectValue placeholder={loadingTipos ? "Cargando..." : "Seleccionar tipo"} />
      </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="todos" className="hover:bg-[#ec520b]/10 focus:bg-[#ec520b]/10">
                    Todos los tipos
                  </SelectItem>
                  {tiposPropiedad.map((tipo) => (
                    <SelectItem 
                      key={tipo.id} 
                      value={tipo.id.toString()}
                      className="hover:bg-[#ec520b]/10 focus:bg-[#ec520b]/10"
                    >
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* PASO 3: Ubicación - Combobox con autocompletado mejorado */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center md:text-left">
              <span className="inline-flex items-center justify-center md:justify-start">
                <span className="w-5 h-5 bg-[#ec520b] text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">3</span>
                Ubicación
              </span>
            </label>
            <div className="flex justify-center">
              <div className="relative w-full" ref={dropdownRef}>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 z-10" />
                  <Input
                    ref={inputRef}
                    value={ubicacionInput}
                    onChange={(e) => {
                      setUbicacionInput(e.target.value);
                      setSelectedUbicacion('');
                    }}
                    onKeyDown={handleUbicacionKeyPress}
                    onFocus={handleUbicacionFocus}
                    placeholder="Escribe ciudades o barrios..."
                    className="w-full min-w-[250px] h-10 pl-10 pr-10 bg-white/80 border-gray-200 hover:border-[#ec520b]/50 focus:border-[#ec520b] focus:ring-2 focus:ring-[#ec520b]/20 transition-all duration-300"
                    disabled={loadingUbicaciones}
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                
                {/* Dropdown de resultados */}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {loadingUbicaciones ? (
                      <div className="p-3 text-center text-gray-500">
                        Cargando ubicaciones...
                      </div>
                    ) : ubicacionesFiltradas.length > 0 ? (
                      ubicacionesFiltradas.map((ubicacion) => (
                        <button
                          key={ubicacion.id}
                          onClick={() => handleUbicacionSelect(ubicacion)}
                          className="w-full px-4 py-3 text-left hover:bg-[#ec520b]/10 focus:bg-[#ec520b]/10 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-[#ec520b] mr-3 flex-shrink-0" />
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">{ubicacion.ciudad}</span>
                              {ubicacion.barrio && (
                                <span className="text-sm text-gray-500">{ubicacion.barrio}, {ubicacion.provincia}</span>
                              )}
                              {!ubicacion.barrio && (
                                <span className="text-sm text-gray-500">{ubicacion.provincia}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        {ubicacionInput.trim() ? `No se encontraron ubicaciones para "${ubicacionInput}"` : 'Escribe para buscar ubicaciones'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botón de Búsqueda */}
          <div className="flex-1 flex items-end justify-center md:justify-start">
            <Button 
              onClick={handleSearch}
              className="w-full max-w-xs md:max-w-none bg-[#022550] hover:bg-[#ec520b] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 h-12 font-semibold"
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