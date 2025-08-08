import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const servicios = [
  { href: '/ventas', label: 'Ventas' },
  { href: '/alquileres', label: 'Alquileres' },
  { href: '/administraciones', label: 'Administraciones' },
  { href: '/tasaciones', label: 'Tasaciones' },
  { href: '/legales', label: 'Asesoria Legal' },
  { href: '/contables', label: 'Asesoria Contable' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: '#022550' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
         <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
          <img 
            src="src\assets\inicio_ico.png"  // Asegúrate que la ruta es correcta
            alt="Logo" 
            className="h-12 object-contain" // Ajusta la altura según necesites
            style={{ 
              width: '100px', // Esto mantendrá la proporción
              maxHeight: '50px', // Limita la altura máxima
              minHeight: '30px' // Altura mínima
            }} 
          />
        </Link>

          {/* Desktop Navigation - Menú responsive con hover mejorado */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors  hover:bg-[#ec520b]`}
            >
              Home
            </Link>
            
            {/* Dropdown de Nuestros Servicios con hover extendido */}
            <div className="relative group">
              <button className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:bg-[#ec520b] group-hover:bg-[#ec520b]">
                Nuestros Servicios
              </button>
              {/* Dropdown con zona extendida de hover para mejor UX */}
              <div className="absolute left-0 mt-0 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-20">
                {/* Área invisible de conexión para evitar que se cierre el menú */}
                <div className="h-2 w-full"></div>
                <div className="bg-white rounded-md shadow-lg border border-gray-200 py-2">
                  {servicios.map((servicio) => (
                    <Link
                      key={servicio.href}
                      to={servicio.href}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#ec520b] hover:text-white transition-colors duration-200"
                    >
                      {servicio.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link
              to="/nosotros"
              className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:bg-[#ec520b]"
              
            >
              Nosotros
            </Link>
            
            <Link
              to="/contacto"
              className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:bg-[#ec520b]"
            >
              Contacto
            </Link>
            
            <Link
              to="/propiedades"
              className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors bg-[#ec520b]"
              style={{ backgroundColor: "#ec520b" }}
            >
              Ver Propiedades
            </Link>
          </div>

          {/* Menú móvil con estilos consistentes */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-[#ec520b] transition-colors">
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80" style={{ backgroundColor: '#022550' }}>
              <div className="flex flex-col space-y-4 mt-8">
                {/* Logo en menú móvil con mejor diseño */}
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-white transition-colors hover:bg-[#ec520b]">
                  <img 
                    src="/src/assets/inicio_ico.png" 
                    alt="Logo" 
                    className="w-8 h-8 object-contain flex-shrink-0" 
                  />
                  <span>Inicio</span>
                </Link>
                
                {/* Sección de servicios en móvil */}
                <div className="flex flex-col">
                  <span className="px-4 py-2 text-white font-semibold">Nuestros Servicios</span>
                  {servicios.map((servicio) => (
                    <Link
                      key={servicio.href}
                      to={servicio.href}
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-2 rounded-lg text-sm text-white transition-colors hover:bg-[#ec520b]"
                    >
                      {servicio.label}
                    </Link>
                  ))}
                </div>
                
                <Link to="/nosotros" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-white transition-colors hover:bg-[#ec520b]">
                  Nosotros
                </Link>
                
                <Link to="/contacto" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-white transition-colors hover:bg-[#ec520b]">
                  Contacto
                </Link>
                
                <Link to="/propiedades" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-white bg-[#ec520b] transition-colors"
                  style={{ backgroundColor: "#ec520b" }}>
                  Ver Propiedades
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;