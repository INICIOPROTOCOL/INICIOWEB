import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ContactForm from '@/components/ContactForm';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Calendar,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Shield
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import heroImage from '@/assets/hero-bg.jpg';

const Contact = () => {
  // Hook para scroll al inicio
  useScrollToTop();
  
  // Hook para scroll a sección específica via hash
  useScrollToHash();
  
  // Obtener parámetros de URL para pre-seleccionar servicio
  const [searchParams] = useSearchParams();
  const servicioParam = searchParams.get('servicio');
  
  // Mapear parámetro de URL a valor del select
  const getDefaultTipoInmueble = () => {
    switch (servicioParam) {
      case 'tasacion':
        return 'Tasación de propiedad';
      case 'venta':
        return 'Venta de propiedad';
      case 'compra':
        return 'Compra de propiedad';
      case 'alquiler':
        return 'Alquiler de propiedad';
      case 'busco-alquilar':
        return 'Busco alquilar';
      case 'legal':
        return 'Asesoramiento legal';
      case 'contable':
        return 'Servicios contables';
      case 'administracion':
        return 'Administración de propiedad';
      default:
        return '';
    }
  };

  // Datos de contacto y empresa
  const contactInfo = {
    telefono: '+54 3515155669',
    email: 'inicio.inmob@gmail.com',
    ubicacion: 'Mendiolaza, Córdoba',
    horarios: {
      semana: 'Lun - Vie: 9:00 - 18:00',
      sabado: 'Sábados: 9:00 - 13:00',
      domingo: 'Domingos: Solo urgencias'
    }
  };

  const whyChooseUs = [
    {
      title: 'Atención Personalizada',
      description: 'Cada cliente recibe un servicio único y adaptado a sus necesidades específicas',
      icon: Users
    },
    {
      title: 'Respuesta Rápida',
      description: 'Contestamos todas las consultas en menos de 2 horas durante horario laboral',
      icon: MessageCircle
    },
    {
      title: 'Experiencia Comprobada',
      description: 'Más de 3 años ayudando a familias a encontrar su hogar ideal',
      icon: Star
    },
    {
      title: 'Transparencia Total',
      description: 'Sin costos ocultos, información clara y procesos transparentes',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-[40vh] sm:min-h-[35vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#022550]/90 via-[#022550]/70 to-[#ec520b]/30"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Contacto
            </h1>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a
                href="https://wa.me/5493515155669?text=Hola,%20quiero%20información%20sobre%20sus%20servicios%20inmobiliarios"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp Directo
              </a>
              <a
                href="tel:+5493515155669"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/30"
              >
                <Phone className="h-5 w-5 mr-2" />
                Llamar Ahora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Información de Contacto Rápida */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-[#ec520b] border-[#ec520b]/30 bg-[#ec520b]/5">
              Múltiples formas de contacto
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Elige la forma que prefieras
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Teléfono */}
            <Card className="bg-[#fff7f2] border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
              <CardContent className="p-8 text-center relative">
                <div className="w-16 h-16 bg-[#ec520b] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Teléfono
                </h3>
                <p className="text-lg font-medium text-[#ec520b] mb-2">
                  {contactInfo.telefono}
                </p>
                <a
                  href={`tel:${contactInfo.telefono}`}
                  className="inline-flex items-center text-[#ec520b] hover:text-[#022550] font-medium transition-colors"
                >
                  Llamar ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="bg-[#f2f6fa] border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
              <CardContent className="p-8 text-center relative">
                <div className="w-16 h-16 bg-[#022550] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Email
                </h3>
                <p className="text-lg font-medium text-[#022550] mb-2">
                  {contactInfo.email}
                </p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="inline-flex items-center text-[#022550] hover:text-[#ec520b] font-medium transition-colors"
                >
                  Enviar email
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            {/* Ubicación */}
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-green-500/10 group-hover:bg-green-500/20 transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Oficina
                  </h3>
                  <p className="text-lg font-medium text-green-700 mb-2">
                    {contactInfo.ubicacion}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Atención presencial con cita previa
                  </p>
                  <Button
                    variant="ghost"
                    className="text-green-700 hover:text-green-800 font-medium p-0"
                  >
                    Ver en mapa
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* Formulario de Contacto con diseño innovador */}
      <section id="formulario" className="relative scroll-mt-20">
        {/* Fondo con imagen y overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#022550]/85 via-[#022550]/70 to-[#ec520b]/40"></div>
        </div>

        <div className="relative z-10 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header personalizado */}
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 bg-white/20 text-white border-white/30">
                Formulario de Contacto
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                ¡Conversemos sobre tu proyecto!
              </h2>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Completa el formulario y un especialista se comunicará contigo en menos de 24 horas
              </p>
            </div>

            {/* ContactForm sin header propio */}
            <div className="max-w-4xl mx-auto">
              <ContactForm 
                showHeader={false}
                showContactInfo={true}
                className="!py-0"
                defaultTipoInmueble={getDefaultTipoInmueble()}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action final */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-[#ec520b]/10 to-[#022550]/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#ec520b]/20 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#022550]/20 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                ¿Listo para dar el siguiente paso?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                No esperes más. Nuestro equipo está preparado para ayudarte a alcanzar tus objetivos inmobiliarios.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-[#022550] hover:bg-[#033366] text-white font-semibold transform hover:scale-105 transition-all duration-300"
                >
                  <Link to="/nuestros-servicios">
                    Ver Nuestros Servicios
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-[#ec520b] text-[#ec520b] hover:bg-[#ec520b] hover:text-white transform hover:scale-105 transition-all duration-300"
                >
                  <Link to="/propiedades">
                    Ver Propiedades
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Botón Flotante de WhatsApp */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/5493515155669?text=Hola,%20quiero%20información%20sobre%20sus%20servicios%20inmobiliarios"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" />
          
          <span className="absolute right-full mr-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            ¡Contáctanos por WhatsApp!
            <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></span>
          </span>
        </a>
      </div>
    </div>
  );
};

export default Contact;