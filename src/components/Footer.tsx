import { Link } from 'react-router-dom';
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">InmoReal</span>
            </div>
            <p className="text-secondary-foreground/80 text-sm">
              Tu socio de confianza en el mercado inmobiliario. Más de 20 años conectando personas con sus hogares ideales.
            </p>
            <div className="flex space-x-3">
              <Button size="icon" variant="ghost" className="hover:bg-secondary-foreground/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-secondary-foreground/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-secondary-foreground/10">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-secondary-foreground/10">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ventas" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Venta de Propiedades
                </Link>
              </li>
              <li>
                <Link to="/alquileres" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Alquileres
                </Link>
              </li>
              <li>
                <Link to="/tasaciones" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Tasaciones
                </Link>
              </li>
              <li>
                <Link to="/legales" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                  Asesoría Legal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+54 11 4000-0000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@inmoreal.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Av. Corrientes 1234, CABA</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-sm text-secondary-foreground/80">
              Recibe las mejores oportunidades inmobiliarias directamente en tu email.
            </p>
            <div className="space-y-2">
              <Input 
                placeholder="Tu email" 
                className="bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/60"
              />
              <Button className="w-full bg-gradient-primary">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="py-6 border-t border-secondary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-secondary-foreground/80">
              © 2024 InmoReal. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6">
              <Link to="/privacidad" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terminos" className="text-sm text-secondary-foreground/80 hover:text-secondary-foreground transition-colors">
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;