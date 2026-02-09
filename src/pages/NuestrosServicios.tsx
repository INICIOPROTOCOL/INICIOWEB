import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ContactForm from '@/components/ContactForm';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import { 
  ArrowRight, 
  Building, 
  Calculator,
  CheckCircle,
  FileText,
  Gavel,
  Key,
  MessageCircle,
  Settings,
  Star,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-bg.jpg';

const NuestrosServicios = () => {
  useScrollToHash();

  // Datos detallados de servicios - Actualizar colores a naranja corporativo
  const serviciosDetallados = [
    {
      id: 'ventas',
      titulo: 'Ventas',
      descripcionCorta: 'Asesoramiento completo para la venta de tu propiedad.',
      icono: Key,
      color: 'from-[#ec520b] to-[#ff6b1a]', 
      caracteristicas: [
        'Valuación profesional',
        'Marketing digital especializado',
        'Fotografía profesional',
        'Tours virtuales 360°',
        'Asesoramiento legal incluido',
        'Gestión completa de documentación'
      ],
      link: '/servicios/ventas'
    },
    {
      id: 'alquileres',
      titulo: 'Alquileres',
      descripcionCorta: 'Gestión integral de alquileres.',
      icono: Building,
      color: 'from-[#ec520b] to-[#ff6b1a]', // Cambiar a naranja
      caracteristicas: [
        'Búsqueda personalizada de inquilinos',
        'Verificación de informes y garantías',
        'Gestión de contratos',
      ],
      link: '/servicios/alquileres'
    },
    {
      id: 'tasaciones',
      titulo: 'Tasaciones',
      descripcionCorta: 'Valuaciones profesionales con certificación oficial',
      icono: Calculator,
      color: 'from-[#ec520b] to-[#ff6b1a]', // Cambiar a naranja
      caracteristicas: [
        'Análisis comparativo de mercado',
        'Informe detallado',
        'Actualización de valores'
      ],
      link: '/servicios/tasaciones'
    },
    {
      id: 'legales',
      titulo: 'Servicios Legales',
      descripcionCorta: 'Asesoría jurídica especializada en derecho inmobiliario',
      icono: Gavel,
      color: 'from-[#ec520b] to-[#ff6b1a]', // Cambiar a naranja
      caracteristicas: [
        'Abogados especializados',
        'Revisión de documentación',
        'Gestión de escrituras',
        'Resolución de conflictos',
        'Asesoramiento preventivo',
        'Representación legal'
      ],
      link: '/servicios/legales'
    },
    {
      id: 'contabilidad',
      titulo: 'Servicios Contables',
      descripcionCorta: 'Gestión contable especializada para el sector inmobiliario',
      icono: FileText,
      color: 'from-[#ec520b] to-[#ff6b1a]', // Cambiar a naranja
      caracteristicas: [
        'Liquidación de impuestos',
        'Asesoramiento fiscal',
        'Optimización tributaria',
        'Gestión de AFIP',
        'Informes financieros'
      ],
      link: '/servicios/contabilidad'
    },
    {
      id: 'administraciones',
      titulo: 'Administraciones',
      descripcionCorta: 'Administración profesional de propiedades y consorcios',
      icono: Settings,
      color: 'from-[#ec520b] to-[#ff6b1a]', // Cambiar a naranja
      caracteristicas: [
        'Gestion de Locacion e impuestos',
        'Gestión de expensas',
        'Mantenimiento preventivo',
        'Asambleas y reuniones',
      ],
      link: '/servicios/administraciones'
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
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins">
              Nuestros Servicios
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light font-montserrat">
              Soluciones integrales para tus necesidades inmobiliarias, legales y contables
            </p>
          </div>
        </div>
      </section>

      {/* Servicios Detallados */}
      <section className="py-10 sm:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 items-stretch">
            {serviciosDetallados.map((servicio, index) => {
              const IconComponent = servicio.icono;
              return (
                <Card 
                  key={servicio.id}
                  id={servicio.id}
                  className="flex flex-col h-full scroll-mt-20 border border-gray-100 bg-white/95 shadow-lg"
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="space-y-5 sm:space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${servicio.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {servicio.titulo}
                        </h3>
                        <p className="text-gray-600 font-montserrat">
                          {servicio.descripcionCorta}
                        </p>
                      </div>
                    </div>
                    {/* Características */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 flex-1">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ¿Qué incluye?
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-[140px] overflow-hidden">
                        {servicio.caracteristicas.map((caracteristica, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-[#ec520b] rounded-full"></div>
                            <span className="text-gray-600 text-sm font-montserrat">{caracteristica}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Formulario de Contacto Reutilizable CON información de contacto */}
      <ContactForm 
        title="¿Necesitas alguno de nuestros servicios?"
        subtitle="Contáctanos y te brindaremos toda la información que necesitas"
        badge="Consultanos"
        showContactInfo={true}
        backgroundImage={heroImage}
      />

      {/* Botón Flotante de WhatsApp - SIN animación de pulso */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/message/2672WUGF2M56K1"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" />
          
          {/* Tooltip */}
          <span className="absolute right-full mr-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            ¡Contáctanos por WhatsApp!
            <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></span>
          </span>
        </a>
      </div>
    </div>
  );
};

export default NuestrosServicios;
