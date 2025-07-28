import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Phone, Users, FileText, Calculator, Key, Gavel } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigationItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/propiedades', label: 'Propiedades', icon: Home },
  { href: '/ventas', label: 'Ventas', icon: Key },
  { href: '/alquileres', label: 'Alquileres', icon: Home },
  { href: '/tasaciones', label: 'Tasaciones', icon: Calculator },
  { href: '/legales', label: 'Legales', icon: Gavel },
  { href: '/nosotros', label: 'Nosotros', icon: Users },
  { href: '/contacto', label: 'Contacto', icon: Phone },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">InmoReal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/contacto">Consultar</Link>
            </Button>
            <Button className="bg-gradient-primary" asChild>
              <Link to="/propiedades">Ver Propiedades</Link>
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <div className="pt-4 space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/contacto" onClick={() => setIsOpen(false)}>
                      Consultar
                    </Link>
                  </Button>
                  <Button className="w-full bg-gradient-primary" asChild>
                    <Link to="/propiedades" onClick={() => setIsOpen(false)}>
                      Ver Propiedades
                    </Link>
                  </Button>
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