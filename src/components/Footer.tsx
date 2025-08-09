import { Link } from 'react-router-dom';
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Footer = () => {
  // Estado para manejar el archivo CV
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Manejar selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea PDF o DOC
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert('Por favor selecciona un archivo PDF o Word (.doc, .docx)');
        e.target.value = '';
      }
    }
  };

  // Manejar envío de CV
  const handleSubmitCV = () => {
    if (!selectedFile) {
      alert('Por favor selecciona tu CV antes de enviar');
      return;
    }
    
    // Aquí iría la lógica para enviar el CV
    console.log('CV enviado:', selectedFile.name);
    alert('¡CV enviado correctamente! Nos pondremos en contacto contigo pronto.');
    
    // Reset
    setSelectedFile(null);
    const fileInput = document.getElementById('cv-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <footer className="bg-[#022550] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#ec520b] to-[#022550] rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Inicio Inmobiliaria</span>
            </div>
            <p className="text-white/80 text-sm">
              Tu socio de confianza en el mercado inmobiliario.
            </p>
            <div className="flex space-x-3">
              <Button 
                size="icon" 
                variant="ghost" 
                className="hover:bg-white/10 text-white hover:text-white transition-colors duration-300"
                asChild
              >
                <a 
                  href="https://www.facebook.com/InicioInmobiliaria" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Síguenos en Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="hover:bg-white/10 text-white hover:text-white transition-colors duration-300"
                asChild
              >
                <a 
                  href="https://www.instagram.com/inicio_inmob/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Síguenos en Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/ventas" 
                  className="text-sm text-white/80 hover:text-white transition-colors duration-300"
                >
                  Venta de Propiedades
                </Link>
              </li>
              <li>
                <Link 
                  to="/alquileres" 
                  className="text-sm text-white/80 hover:text-white transition-colors duration-300"
                >
                  Alquileres
                </Link>
              </li>
              <li>
                <Link 
                  to="/tasaciones" 
                  className="text-sm text-white/80 hover:text-white transition-colors duration-300"
                >
                  Tasaciones
                </Link>
              </li>
              <li>
                <Link 
                  to="/legales" 
                  className="text-sm text-white/80 hover:text-white transition-colors duration-300"
                >
                  Asesoría Legal
                </Link>
              </li>
              <li>
                <Link 
                  to="/contabilidad" 
                  className="text-sm text-white/80 hover:text-white transition-colors duration-300"
                >
                  Asesoría Contable
                </Link>
              </li>
              <li>
                <Link 
                  to="/administraciones" 
                  className="text-sm text-white/80 hover:text-white transition-colors duration-300"
                >
                  Administraciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#ec520b]" />
                <span className="text-sm text-white/80">+54 3515155669</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#ec520b]" />
                <span className="text-sm text-white/80">inicio.inmob@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-[#ec520b]" />
                <span className="text-sm text-white/80">Córdoba, Argentina</span>
              </div>
            </div>
          </div>

          {/* Trabaja con Nosotros */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Trabaja con Nosotros</h3>
            <p className="text-sm text-white/80">
              ¿Te apasiona el mercado inmobiliario? Únete a nuestro equipo y crece profesionalmente.
            </p>
            <div className="space-y-2">
              
              {/* Input de archivo personalizado */}
              <div className="relative">
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/15 transition-colors duration-300 cursor-pointer flex items-center justify-between">
                  <span className="flex items-center">
                    <Upload className="h-4 w-4 mr-2 text-[#ec520b]" />
                    {selectedFile ? selectedFile.name : 'Adjuntar CV (PDF, Word)'}
                  </span>
                </div>
              </div>
              
              {/* Mostrar archivo seleccionado */}
              {selectedFile && (
                <p className="text-xs text-white/60 flex items-center">
                  ✓ Archivo seleccionado: {selectedFile.name}
                </p>
              )}
              
              <Button 
                onClick={handleSubmitCV}
                className="w-full bg-gradient-to-r from-[#ec520b] to-[#022550] hover:from-[#022550] hover:to-[#ec520b] text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                disabled={!selectedFile}
              >
                Enviar CV
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="py-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-white/80">
              © 2025 Inicio Inmobiliaria. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6">
              <Link 
                to="/privacidad" 
                className="text-sm text-white/80 hover:text-white transition-colors duration-300"
              >
                Política de Privacidad
              </Link>
              <Link 
                to="/terminos" 
                className="text-sm text-white/80 hover:text-white transition-colors duration-300"
              >
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