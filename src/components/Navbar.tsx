import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const servicios = [
  { href: "/nuestros-servicios#ventas", label: "Ventas" },
  { href: "/nuestros-servicios#alquileres", label: "Alquileres" },
  { href: "/nuestros-servicios#administraciones", label: "Administraciones" },
  { href: "/nuestros-servicios#tasaciones", label: "Tasaciones" },
  { href: "/nuestros-servicios#legales", label: "Asesoria Legal" },
  { href: "/nuestros-servicios#contabilidad", label: "Asesoria Contable" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: "#002553" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo_grande_fondo_azul 1.svg"
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="flex flex-col leading-tight -translate-y-1">
              <span className="text-[#ec520b] font-bold text-lg tracking-wide">
                INICIO
              </span>
              <span className="text-white text-xs">NEGOCIOS INMOBILIARIOS</span>
            </div>
          </Link>

          {/* Desktop Navigation - Menú responsive con hover mejorado */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:bg-[#ec520b] font-raleway`}
            >
              Home
            </Link>

            {/* Dropdown de Nuestros Servicios con hover extendido */}
            <div className="relative group">
              <Link
                to="/nuestros-servicios"
                className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:bg-[#ec520b] group-hover:bg-[#ec520b] font-raleway"
              >
                Nuestros Servicios
              </Link>
              {/* Dropdown con zona extendida de hover para mejor UX */}
              <div className="absolute left-0 mt-0 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-20">
                {/* Área invisible de conexión para evitar que se cierre el menú */}
                <div className="h-2 w-full"></div>
                <div className="bg-white rounded-md shadow-lg border border-gray-200 py-2">
                  {servicios.map((servicio) => (
                    <Link
                      key={servicio.href}
                      to={servicio.href}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-[#ec520b] hover:text-white transition-colors duration-200 font-raleway"
                    >
                      {servicio.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/nosotros"
              className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:bg-[#ec520b] font-raleway"
            >
              Nosotros
            </Link>

            <Link
              to="/contacto"
              className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:bg-[#ec520b] font-raleway"
            >
              Contacto
            </Link>

            <Link
              to="/propiedades"
              className="px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors bg-[#ec520b] font-raleway"
              style={{ backgroundColor: "#ec520b" }}
            >
              Ver Propiedades
            </Link>
          </div>

          {/* Menú móvil con estilos consistentes */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-[#ec520b] transition-colors"
              >
                <Menu className="h-6 w-6 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 p-0"
              style={{ backgroundColor: "#022550" }}
            >
              <div className="flex flex-col h-full">
                {/* Header del menú móvil */}
                <div className="px-6 py-6 border-b border-white/10">
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3"
                  >
                    <img
                      src="/logo_grande_fondo_azul 1.svg"
                      alt="Logo INICIO"
                      className="w-12 h-12 object-contain flex-shrink-0"
                    />
                    <div className="flex flex-col leading-tight">
                      <span className="text-[#ec520b] font-bold text-lg tracking-wide">
                        INICIO
                      </span>
                      <span className="text-white text-xs">
                        NEGOCIOS INMOBILIARIOS
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Navegación principal */}
                <div className="flex-1 px-4 py-6 overflow-y-auto">
                  <div className="space-y-1">
                    {/* Home */}
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-white transition-colors hover:bg-[#ec520b] hover:text-white font-raleway"
                    >
                      Home
                    </Link>

                    {/* Propiedades destacado */}
                    <Link
                      to="/propiedades"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-white bg-[#ec520b] transition-colors shadow-md font-raleway"
                    >
                      Ver Propiedades
                    </Link>

                    {/* Separador */}
                    <div className="my-4 border-t border-white/10"></div>

                    {/* Nuestros Servicios - Sección expandible */}
                    <div className="space-y-1">
                      <Link
                        to="/nuestros-servicios"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-white transition-colors hover:bg-[#ec520b] font-raleway"
                      >
                        Nuestros Servicios
                      </Link>

                      {/* Servicios específicos */}
                      <div className="ml-4 space-y-1">
                        <span className="block px-4 py-2 text-white/60 text-sm font-medium uppercase tracking-wide">
                          Servicios Específicos
                        </span>
                        {servicios.map((servicio) => (
                          <Link
                            key={servicio.href}
                            to={servicio.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2 rounded-lg text-sm text-white/90 transition-colors hover:bg-[#ec520b]/80 hover:text-white hover:pl-6 font-raleway"
                          >
                            <span className="w-2 h-2 bg-[#ec520b] rounded-full mr-3 opacity-60"></span>
                            {servicio.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Separador */}
                    <div className="my-4 border-t border-white/10"></div>

                    {/* Otras páginas */}
                    <Link
                      to="/nosotros"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-white transition-colors hover:bg-[#ec520b] font-raleway"
                    >
                      Nosotros
                    </Link>

                    <Link
                      to="/contacto"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-white transition-colors hover:bg-[#ec520b] font-raleway"
                    >
                      Contacto
                    </Link>
                  </div>
                </div>

                {/* Footer del menú móvil */}
                <div className="px-6 py-4 border-t border-white/10">
                  <a
                    href="https://wa.me/5493515155669?text=Hola,%20quiero%20información%20sobre%20sus%20servicios"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium font-raleway"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
