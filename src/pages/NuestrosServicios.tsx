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
  // Hook para scroll automático al hash O al inicio
  useScrollToHash();

  // Datos detallados de servicios - IDs actualizados para coincidir con Navbar
  const serviciosDetallados = [
    {
      id: 'ventas',
      titulo: 'Ventas',
      descripcionCorta: 'Asesoramiento completo para vender tu propiedad al mejor precio',
      icono: Key,
      color: 'from-blue-500 to-blue-600',
      caracteristicas: [
        'Valuación profesional gratuita',
        'Marketing digital especializado',
        'Fotografía profesional',
        'Tours virtuales 360°',
        'Asesoramiento legal incluido',
        'Gestión completa de documentación'
      ],
      beneficios: [
        'Venta en menor tiempo',
        'Mejor precio de mercado',
        'Sin preocupaciones legales',
        'Acompañamiento total'
      ],
      proceso: [
        'Evaluación y tasación',
        'Estrategia de marketing',
        'Presentación a compradores',
        'Negociación y cierre'
      ],
      link: '/servicios/ventas'
    },
    {
      id: 'alquileres',
      titulo: 'Alquileres',
      descripcionCorta: 'Gestión integral de alquileres con garantía de tranquilidad',
      icono: Building,
      color: 'from-green-500 to-green-600',
      caracteristicas: [
        'Búsqueda personalizada de inquilinos',
        'Verificación de antecedentes',
        'Gestión de contratos',
        'Administración de cobros',
        'Mantenimiento preventivo',
        'Resolución de conflictos'
      ],
      beneficios: [
        'Inquilinos confiables',
        'Cobro puntual garantizado',
        'Propiedad bien cuidada',
        'Gestión sin estrés'
      ],
      proceso: [
        'Análisis de la propiedad',
        'Búsqueda de inquilinos',
        'Evaluación y selección',
        'Gestión administrativa'
      ],
      link: '/servicios/alquileres'
    },
    {
      id: 'tasaciones',
      titulo: 'Tasaciones',
      descripcionCorta: 'Valuaciones profesionales con certificación oficial',
      icono: Calculator,
      color: 'from-purple-500 to-purple-600',
      caracteristicas: [
        'Martilleros matriculados',
        'Metodología técnica certificada',
        'Análisis comparativo de mercado',
        'Informe detallado escrito',
        'Validez legal y bancaria',
        'Actualización de valores'
      ],
      beneficios: [
        'Valor real de mercado',
        'Respaldo legal',
        'Aceptado por bancos',
        'Decisiones informadas'
      ],
      proceso: [
        'Inspección técnica',
        'Análisis de mercado',
        'Cálculo de valor',
        'Entrega de informe'
      ],
      link: '/servicios/tasaciones'
    },
    {
      id: 'legales',
      titulo: 'Servicios Legales',
      descripcionCorta: 'Asesoría jurídica especializada en derecho inmobiliario',
      icono: Gavel,
      color: 'from-red-500 to-red-600',
      caracteristicas: [
        'Abogados especializados',
        'Revisión de documentación',
        'Gestión de escrituras',
        'Resolución de conflictos',
        'Asesoramiento preventivo',
        'Representación legal'
      ],
      beneficios: [
        'Operaciones seguras',
        'Sin riesgos legales',
        'Documentación correcta',
        'Tranquilidad total'
      ],
      proceso: [
        'Consulta inicial',
        'Análisis del caso',
        'Estrategia legal',
        'Ejecución y seguimiento'
      ],
      link: '/servicios/legales'
    },
    {
      id: 'contabilidad',
      titulo: 'Servicios Contables',
      descripcionCorta: 'Gestión contable especializada para el sector inmobiliario',
      icono: FileText,
      color: 'from-yellow-500 to-orange-500',
      caracteristicas: [
        'Contadores públicos matriculados',
        'Liquidación de impuestos',
        'Asesoramiento fiscal',
        'Optimización tributaria',
        'Gestión de AFIP',
        'Informes financieros'
      ],
      beneficios: [
        'Ahorro en impuestos',
        'Cumplimiento normativo',
        'Optimización fiscal',
        'Gestión profesional'
      ],
      proceso: [
        'Análisis fiscal',
        'Planificación tributaria',
        'Gestión de trámites',
        'Seguimiento continuo'
      ],
      link: '/servicios/contabilidad'
    },
    {
      id: 'administraciones',
      titulo: 'Administraciones',
      descripcionCorta: 'Administración profesional de propiedades y consorcios',
      icono: Settings,
      color: 'from-indigo-500 to-indigo-600',
      caracteristicas: [
        'Administradores matriculados',
        'Gestión de expensas',
        'Mantenimiento preventivo',
        'Control de proveedores',
        'Asambleas y reuniones',
        'Informes mensuales'
      ],
      beneficios: [
        'Propiedad bien mantenida',
        'Gastos optimizados',
        'Gestión transparente',
        'Valor preservado'
      ],
      proceso: [
        'Diagnóstico inicial',
        'Plan de administración',
        'Implementación',
        'Monitoreo y reportes'
      ],
      link: '/servicios/administraciones'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-[70vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#022550]/90 via-[#022550]/70 to-[#ec520b]/30"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Badge variant="outline" className="mb-6 bg-white/20 text-white border-white/30">
              Servicios Profesionales
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Nuestros Servicios
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light">
              Soluciones integrales para todas tus necesidades inmobiliarias, legales y contables
            </p>
            
            {/* Stats rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">6</div>
                <div className="text-sm text-white/80">Servicios Especializados</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/80">Soporte Disponible</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-white/80">Profesional</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">3+</div>
                <div className="text-sm text-white/80">Años de Experiencia</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Detallados */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-[#ec520b] border-[#ec520b]/30 bg-[#ec520b]/5">
              Servicios Completos
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cada servicio está diseñado para brindarte la mejor experiencia y resultados excepcionales
            </p>
          </div>

          <div className="space-y-16">
            {serviciosDetallados.map((servicio, index) => {
              const IconComponent = servicio.icono;
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={servicio.id}
                  id={servicio.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:grid-flow-dense' : ''} scroll-mt-20`}
                >
                  {/* Contenido */}
                  <div className={`space-y-6 ${!isEven ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${servicio.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {servicio.titulo}
                        </h3>
                        <p className="text-gray-600">
                          {servicio.descripcionCorta}
                        </p>
                      </div>
                    </div>

                    {/* Características */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ¿Qué incluye?
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {servicio.caracteristicas.map((caracteristica, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-[#ec520b] rounded-full"></div>
                            <span className="text-gray-600 text-sm">{caracteristica}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Proceso */}
                    <div className="bg-gradient-to-r from-[#ec520b]/5 to-[#022550]/5 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Proceso de trabajo
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {servicio.proceso.map((paso, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-[#ec520b] to-[#022550] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{idx + 1}</span>
                            </div>
                            <span className="text-gray-700 text-sm font-medium">{paso}</span>
                            {idx < servicio.proceso.length - 1 && (
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      asChild
                      className="bg-gradient-to-r from-[#ec520b] to-[#022550] hover:from-[#022550] hover:to-[#ec520b] transform hover:scale-105 transition-all duration-300"
                    >
                      <Link to={servicio.link}>
                        Más información
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  {/* Visual/Beneficios */}
                  <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <Card className="bg-white border-0 shadow-2xl overflow-hidden">
                      <CardContent className="p-8 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ec520b]/5 to-[#022550]/5"></div>
                        
                        <div className="relative z-10 text-center">
                          <div className={`w-20 h-20 bg-gradient-to-r ${servicio.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                            <IconComponent className="h-10 w-10 text-white" />
                          </div>
                          
                          <h4 className="text-xl font-semibold text-gray-900 mb-6">
                            Beneficios principales
                          </h4>
                          
                          <div className="space-y-4">
                            {servicio.beneficios.map((beneficio, idx) => (
                              <div key={idx} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <Star className="h-4 w-4 text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">{beneficio}</span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-8 p-4 bg-gradient-to-r from-[#ec520b]/10 to-[#022550]/10 rounded-xl">
                            <div className="flex items-center justify-center space-x-2">
                              <Users className="h-5 w-5 text-[#ec520b]" />
                              <span className="text-sm font-medium text-gray-700">
                                Atención personalizada garantizada
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
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
          href="https://wa.me/5491123456789?text=Hola,%20quiero%20información%20sobre%20sus%20servicios%20inmobiliarios"
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