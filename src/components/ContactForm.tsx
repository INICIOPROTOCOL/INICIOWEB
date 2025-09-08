import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApiRequest } from '@/hooks/useApiRequest';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  CheckCircle, 
  Building, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Phone, 
  User
} from 'lucide-react';

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  showContactInfo?: boolean;
  showHeader?: boolean; // Nueva prop
  backgroundImage?: string;
  className?: string;
}

const ContactForm = ({ 
  title = "¡Hablemos!",
  subtitle = "Estamos aquí para ayudarte con todas tus necesidades inmobiliarias",
  badge = "Contáctanos",
  showContactInfo = true,
  showHeader = true, // Por defecto true
  backgroundImage,
  className = ""
}: ContactFormProps) => {
  // Estado para el formulario de contacto
  const [contactForm, setContactForm] = useState({
    nombre: '',
    apellido: '',
    celular: '',
    email: '',
    tipoInmueble: '',
    mensaje: ''
  });
  const [modal, setModal] = useState<{ open: boolean; success: boolean; message: string }>({ open: false, success: false, message: '' });
  const { loading, error, request } = useApiRequest({ retries: 2, retryDelay: 1500 });

  // Opciones para el select de inmuebles
  const tiposInmuebles = [
    'Venta de propiedad',
    'Compra de propiedad', 
    'Alquiler de propiedad',
    'Busco alquilar',
    'Tasación de propiedad',
    'Asesoramiento legal',
    'Servicios contables',
    'Administración de propiedad',
    'Consulta general'
  ];

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const payload = {
      nombre: contactForm.nombre,
      apellido: contactForm.apellido,
      celular: contactForm.celular,
      email: contactForm.email,
      tipoInmueble: contactForm.tipoInmueble,
      mensaje: contactForm.mensaje
    };
    await request(async () => {
      const res = await fetch(`${API_URL}/contactos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('No se pudo enviar el mensaje');
      return await res.json();
    });
    if (!error) {
      setModal({ open: true, success: true, message: '¡Gracias por tu consulta! Nos pondremos en contacto contigo pronto.' });
      setContactForm({
        nombre: '',
        apellido: '',
        celular: '',
        email: '',
        tipoInmueble: '',
        mensaje: ''
      });
    } else {
      setModal({ open: true, success: false, message: error });
    }
  };

  const sectionStyle = backgroundImage ? {
    backgroundImage: `linear-gradient(rgba(2, 37, 80, 0.85), rgba(236, 82, 11, 0.15)), url(${backgroundImage})`
  } : {};

  return (
    <section 
      className={`py-16 sm:py-20 relative bg-cover bg-center bg-no-repeat ${className}`}
      style={sectionStyle}
    >
      {/* Modal de éxito/error */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-[#ec520b]" onClick={() => setModal({ ...modal, open: false })}>
              &times;
            </button>
            {modal.success ? (
              <div className="flex flex-col items-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                <h3 className="text-xl font-bold text-[#022550] mb-2">Mensaje enviado</h3>
                <p className="text-gray-700 mb-2">{modal.message}</p>
                <p className="text-sm text-gray-500">Te responderemos en menos de 24 horas.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
                <h3 className="text-xl font-bold text-[#ec520b] mb-2">Error</h3>
                <p className="text-gray-700 mb-2">{modal.message}</p>
              </div>
            )}
            <Button className="mt-6 w-full bg-[#022550] hover:bg-[#ec520b] text-white" onClick={() => setModal({ ...modal, open: false })}>Cerrar</Button>
          </div>
        </div>
      )}
      {/* Loader mientras se envía */}
      {loading && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
          <div className="bg-white/80 rounded-xl shadow-xl p-8 flex flex-col items-center">
            <div className="animate-spin-slow mb-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#022550" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <span className="text-lg text-[#022550] font-semibold">Enviando mensaje...</span>
          </div>
        </div>
      )}
      {backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#022550]/80 via-[#022550]/60 to-[#ec520b]/40"></div>
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header condicional */}
        {showHeader && (
          <div className="text-center mb-12">
            <Badge variant="outline" className={`mb-4 ${backgroundImage ? 'bg-white/20 text-white border-white/30' : 'text-[#ec520b] border-[#ec520b]/30 bg-[#ec520b]/5'}`}>
              {badge}
            </Badge>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${backgroundImage ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>
            <p className={`text-lg ${backgroundImage ? 'text-white/90' : 'text-gray-600'}`}>
              {subtitle}
            </p>
          </div>
        )}

        <div className={`grid grid-cols-1 ${showContactInfo ? 'lg:grid-cols-3' : ''} gap-8`}>
          {/* Información de contacto */}
{showContactInfo && (
  <div className="lg:col-span-1">
    <Card className="bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Información de Contacto
        </h3>
        <div className="space-y-4">
          {/* Teléfono */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#ec520b] rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-medium text-[#022550]">Teléfono</div>
              <div className="text-[#ec520b] font-semibold">+54 3515155669</div>
            </div>
          </div>
          {/* Email */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-[#022550] rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-medium text-[#022550]">Email</div>
              <div className="text-[#ec520b] font-semibold break-words">inicio.inmob@gmail.com</div>
            </div>
          </div>
          {/* WhatsApp */}
          <div className="pt-4 border-t border-gray-200">
            <a 
              href="https://wa.me/5491123456789" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-300 font-semibold"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)}

          {/* Formulario */}
          <div className={showContactInfo ? 'lg:col-span-2' : ''}>
            <Card className="bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Fila: Nombre y Apellido */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="nombre" className="text-sm font-medium text-gray-700 flex items-center">
                        <User className="h-4 w-4 mr-2 text-[#ec520b]" />
                        Tu Nombre
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        required
                        value={contactForm.nombre}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ec520b] focus:border-transparent transition-colors bg-white/80 backdrop-blur-sm"
                        placeholder="Ingresa tu nombre"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="apellido" className="text-sm font-medium text-gray-700 flex items-center">
                        <User className="h-4 w-4 mr-2 text-[#ec520b]" />
                        Tu Apellido
                      </label>
                      <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        required
                        value={contactForm.apellido}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ec520b] focus:border-transparent transition-colors bg-white/80 backdrop-blur-sm"
                        placeholder="Ingresa tu apellido"
                      />
                    </div>
                  </div>

                  {/* Fila: Celular y Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="celular" className="text-sm font-medium text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-[#ec520b]" />
                        Tu Celular
                      </label>
                      <input
                        type="tel"
                        id="celular"
                        name="celular"
                        required
                        value={contactForm.celular}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ec520b] focus:border-transparent transition-colors bg-white/80 backdrop-blur-sm"
                        placeholder="+54 351 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-[#ec520b]" />
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={contactForm.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ec520b] focus:border-transparent transition-colors bg-white/80 backdrop-blur-sm"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  {/* Select: Información sobre inmuebles */}
                  <div className="space-y-2">
                    <label htmlFor="tipoInmueble" className="text-sm font-medium text-gray-700 flex items-center">
                      <Building className="h-4 w-4 mr-2 text-[#ec520b]" />
                      En que te podemos asesorar?
                    </label>
                    <select
                      id="tipoInmueble"
                      name="tipoInmueble"
                      required
                      value={contactForm.tipoInmueble}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ec520b] focus:border-transparent transition-colors bg-white/80 backdrop-blur-sm"
                    >
                      <option value="">Selecciona el tipo de consulta</option>
                      {tiposInmuebles.map((tipo, index) => (
                        <option key={index} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Campo de texto */}
                  <div className="space-y-2">
                    <label htmlFor="mensaje" className="text-sm font-medium text-gray-700 flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2 text-[#ec520b]" />
                      Cuéntanos más detalles
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={4}
                      required
                      value={contactForm.mensaje}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ec520b] focus:border-transparent transition-colors bg-white/80 backdrop-blur-sm resize-none"
                      placeholder="Describe tu consulta, ubicación preferida, presupuesto, características deseadas, etc."
                    ></textarea>
                  </div>

                  {/* Botón de envío */}
                  <div className="text-center pt-4">
                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto px-8 py-3 bg-[#ec520b] hover:bg-[#022550] text-white font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      Enviar Consulta
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    
                    <p className="text-sm text-gray-500 mt-4">
                      <CheckCircle className="inline h-4 w-4 mr-1 text-green-500" />
                      Te responderemos en menos de 24 horas
                    </p>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;