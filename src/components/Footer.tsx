import { Link } from 'react-router-dom';
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';

const Footer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({ show: false, type: 'success', message: '' });
  const { loading, error, request } = useApiRequest({ retries: 2, retryDelay: 1500 });

  // Función para mostrar toast
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast({ show: false, type: 'success', message: '' });
    }, 4000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Archivo seleccionado:', {
        nombre: file.name,
        tipo: file.type,
        tamaño: file.size,
        tamañoMB: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      });

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      const allowedExtensions = ['.pdf', '.doc', '.docx'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      
      if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        // Validar tamaño (máximo 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          showToast('error', `El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)} MB). Por favor selecciona un archivo menor a 10MB.`);
          e.target.value = '';
          return;
        }
        
        setSelectedFile(file);
        showToast('success', `Archivo "${file.name}" seleccionado correctamente (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        showToast('error', `Tipo de archivo no válido: ${file.type || 'desconocido'}. Por favor selecciona un archivo PDF o Word (.doc, .docx)`);
        e.target.value = '';
      }
    }
  };

  const handleSubmitCV = async () => {
    if (!selectedFile) {
      showToast('error', 'Por favor selecciona tu CV antes de enviar');
      return;
    }

    // Validar tamaño del archivo (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (selectedFile.size > maxSize) {
      showToast('error', 'El archivo es demasiado grande. Por favor selecciona un archivo menor a 10MB.');
      return;
    }

    setUploading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    
    console.log('Enviando CV:', {
      nombre: selectedFile.name,
      tamaño: selectedFile.size,
      tipo: selectedFile.type
    });

    try {
      // Convertir el archivo a base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          
          const payload = {
            pdfBase64: base64,
            nombreArchivo: selectedFile.name,
            tipoArchivo: selectedFile.type,
            tamañoArchivo: selectedFile.size
          };
          
          console.log('Payload preparado:', {
            nombreArchivo: payload.nombreArchivo,
            tipoArchivo: payload.tipoArchivo,
            tamañoArchivo: payload.tamañoArchivo,
            base64Length: base64.length
          });

          const response = await fetch(`${API_URL}/contactos/send-cv`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          console.log('Respuesta del servidor:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
          });

          if (!response.ok) {
            // Intentar obtener el mensaje de error del servidor
            let errorMessage = 'Error al enviar el CV';
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorData.error || errorMessage;
              console.error('Error del servidor:', errorData);
            } catch (parseError) {
              const errorText = await response.text();
              console.error('Error del servidor (texto):', errorText);
              errorMessage = `Error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
          }

          const result = await response.json();
          console.log('CV enviado exitosamente:', result);
          
          showToast('success', `CV enviado correctamente! Tu CV "${selectedFile.name}" ha sido enviado a nuestro equipo.`);
          setSelectedFile(null);
          const fileInput = document.getElementById('cv-upload') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
          
        } catch (err) {
          console.error('Error en el proceso de envío:', err);
          const errorMessage = err instanceof Error ? err.message : 'Error desconocido al enviar el CV';
          showToast('error', errorMessage);
        } finally {
          setUploading(false);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
        showToast('error', 'Error al leer el archivo. Por favor, inténtalo nuevamente.');
        setUploading(false);
      };
      
      reader.readAsDataURL(selectedFile);
      
    } catch (err) {
      console.error('Error general:', err);
      showToast('error', 'Error al procesar el archivo. Por favor, inténtalo nuevamente.');
      setUploading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {toast.type === 'success' ? (
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button 
              onClick={() => setToast({ show: false, type: 'success', message: '' })}
              className="ml-3 text-white hover:text-gray-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
    <footer className="bg-[#022550] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                  src="/logo_grande_fondo_azul 1.svg"
                  alt="Logo INICIO"
                  className="w-12 h-12 object-contain"
                />
              <span className="text-lg sm:text-xl font-bold">
                <span>Inicio</span> Negocios{' '}
                <span >Inmobiliarios</span>
              </span>
            </div>
            <div className="h-2" />
            <span className="text-sm text-white/80">
              Conrado Cazzola Matricula CPI: 6842.
            </span>
            <p className="text-white/80 text-sm">
              Tu inmobiliaria de confianza.
            </p>
            <div className="flex space-x-3">
              <Button 
                size="icon" 
                variant="ghost" 
                className="hover:bg-white/10 text-white hover:text-white transition-colors duration-300"
                asChild
              >
                <a 
                  href="https://www.facebook.com/inicio.neg.inmob/" 
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
            <h3 className="text-lg font-semibold text-[#ec520b] border-b border-[#ec520b]/20 pb-2">
              Servicios
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/nuestros-servicios#ventas" 
                  className="text-sm text-white/80 hover:text-[#ec520b] transition-colors duration-300"
                >
                  Venta de Propiedades
                </Link>
              </li>
              <li>
                <Link 
                  to="/nuestros-servicios#alquileres" 
                  className="text-sm text-white/80 hover:text-[#ec520b] transition-colors duration-300"
                >
                  Alquileres
                </Link>
              </li>
              <li>
                <Link 
                  to="/nuestros-servicios#tasaciones" 
                  className="text-sm text-white/80 hover:text-[#ec520b] transition-colors duration-300"
                >
                  Tasaciones
                </Link>
              </li>
              <li>
                <Link 
                  to="/nuestros-servicios#legales" 
                  className="text-sm text-white/80 hover:text-[#ec520b] transition-colors duration-300"
                >
                  Asesoría Legal
                </Link>
              </li>
              <li>
                <Link 
                  to="/nuestros-servicios#contabilidad" 
                  className="text-sm text-white/80 hover:text-[#ec520b] transition-colors duration-300"
                >
                  Asesoría Contable
                </Link>
              </li>
              <li>
                <Link 
                  to="/nuestros-servicios#administraciones" 
                  className="text-sm text-white/80 hover:text-[#ec520b] transition-colors duration-300"
                >
                  Administraciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#ec520b] border-b border-[#ec520b]/20 pb-2">
              Contacto
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[#ec520b]" />
                <span className="text-sm text-white/80">+54 351-5155669</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-[#ec520b]" />
                <span className="text-sm text-white/80">inicio.inmob@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-[#ec520b]" />
                <span className="text-sm text-white/80">Mendiolaza, Córdoba, Argentina</span>
              </div>
            </div>
          </div>

          {/* Trabaja con Nosotros */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#ec520b] border-b border-[#ec520b]/20 pb-2">
              Trabaja con Nosotros
            </h3>
            <p className="text-sm text-white/80">
              ¿Te apasiona el mercado inmobiliario? Únete a nuestro equipo y crece profesionalmente.
            </p>
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Adjuntar CV"
                />
                <div className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/15 transition-colors duration-300 cursor-pointer flex items-center justify-between">
                  <span className="flex items-center">
                    <Upload className="h-4 w-4 mr-2 text-[#ec520b]" />
                    {selectedFile ? selectedFile.name : 'Adjuntar CV (PDF)'}
                  </span>
                </div>
              </div>
              {selectedFile && (
                <p className="text-xs text-white/60 flex items-center">
                  ✓ Archivo seleccionado: {selectedFile.name}
                </p>
              )}
              <Button 
                onClick={handleSubmitCV}
                className="w-full bg-[#ec520b] hover:bg-[#d64807] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border border-[#ec520b]/20"
                disabled={!selectedFile || uploading || loading}
              >
                {(uploading || loading) ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  'Enviar CV'
                )}
              </Button>
            </div>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="py-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-white/80">
              © 2025 Inicio Negocios Inmobiliarios. Todos los derechos reservados.
            </div>
            {/* <div className="flex space-x-6">
              <Link 
                to="/privacidad" 
                className="text-sm text-white/80 hover:text-[#ec520b] transition-colors duration-300"
              >
                Política de Privacidad
              </Link>
              <Link 
                to="/terminos" 
                className="text-sm text-white/80 hover:text-[#ec520b] transition-colors duration-300"
              >
                Términos de Uso
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;