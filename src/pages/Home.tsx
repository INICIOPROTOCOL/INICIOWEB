import SearchForm from '@/components/SearchForm';
import PropertyCard from '@/components/PropertyCard';
import ServiceCard from '@/components/ServiceCard';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Key, Calculator, Gavel, Users, Star, Award, TrendingUp, CheckCircle, MessageCircle, Building, Car, Scale, FileText, Settings, Phone, Mail, User, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks/useApiRequest';
import axios from 'axios';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import heroImage from '@/assets/hero-bg.jpg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Home = () => {
  useScrollToTop();
  const { data: featuredProperties, loading, error, request } = useApiRequest<any[]>({ retries: 2, retryDelay: 1500 });

  useEffect(() => {
    const fetchFeatured = async () => {
      await request(async () => {
        const response = await axios.get(`${API_URL}/propiedades?destacada=true&limit=3`);
        // Asegura que featuredProperties sea el array correcto
        return response.data?.data || response.data || [];
      });
    };
    fetchFeatured();
  }, []);

  const services = [
    {
      title: 'Ventas',
      description: 'Asesoramiento completo para la venta de tu propiedad.',
      icon: Key,
      href: '/nuestros-servicios#ventas'
    },
    {
      title: 'Alquileres',
      description: 'Gestión integral tanto para el Locador como Locatario. ',
      icon: Building,
      href: '/nuestros-servicios#alquileres'
    },
    {
      title: 'Tasaciones',
      description: 'Valuaciones profesionales.',
      icon: Calculator,
      href: '/nuestros-servicios#tasaciones'
    },
    {
      title: 'Legales',
      description: 'Asesoría jurídica especializada en derecho inmobiliario.',
      icon: Gavel,
      href: '/nuestros-servicios#legales'
    },
    {
      title: 'Contabilidad',
      description: 'Servicios contables.',
      icon: FileText,
      href: '/nuestros-servicios#contabilidad'
    },
    {
      title: 'Administraciones',
      description: 'Administración profesional de propiedades y consorcios.',
      icon: Settings,
      href: '/nuestros-servicios#administraciones'
    }
  ];

 
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#ec520b] mb-2">Error al cargar propiedades</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }
  return (
  <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] sm:min-h-[55vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Encontra el
              <span className="bg-gradient-to-r from-[#ff7b25] to-[#ff5e00] bg-clip-text text-transparent"> lugar que buscas</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              La inmobiliaria mas completa para la busqueda de tu propiedad
            </p>
          </div>
          
          <div className="animate-slide-up">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Sección de Invitación actualizada */}
      <section 
        className="py-8 sm:py-12 relative bg-[#FFF4E5]"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-8 lg:px-16 relative z-10">
          <div className="bg-white backdrop-blur-sm border border-white/30 rounded-3xl p-4 sm:p-10 shadow-xl relative overflow-hidden">
            {/* Overlay sutil interno */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 bg-white/80 shadow-lg">
                {/* logo de inicio */}
                <img
                  src="/logo_grande_fondo_azul 1.svg"
                  alt="Logo"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#022550] mb-3 drop-shadow-sm">
                Estamos para acompañarte
              </h3>
              <p className="text-[#022550] text-sm sm:text-base max-w-md mx-auto drop-shadow-sm font-medium">
                Tu compañia en el proceso de tus objetivos inmobiliarios
              </p>
            </div>

            {/* Card Solicitar Tasación */}
            <div className="w-full relative z-10">
              <div className="bg-[#ec520b] rounded-xl p-6 text-white relative overflow-hidden group transform hover:scale-105 transition-all duration-300 w-full shadow-xl">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 group-hover:to-black/20 transition-colors duration-300"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <Calculator className="h-8 w-8 mb-4 text-white/90" />
                    <h4 className="text-lg font-semibold mb-2">¿Estás buscando vender tu propiedad?</h4>
                    <p className="text-white/80 text-sm mb-4 md:mb-0">
                      Solicita una tasación profesional
                    </p>
                  </div>
                  <Button 
                    asChild
                    className="w-full md:w-auto bg-white text-[#ec520b] hover:bg-[#022550] hover:text-white font-semibold shadow-lg transition-all duration-300"
                  >
                    <Link to="/contacto?servicio=tasacion#formulario">
                      Solicitar Tasación
                      <Calculator className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Properties */}
      <section 
        className="py-8 sm:py-12 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/family-inicio.png)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-6 sm:mb-10">
            <Badge variant="outline" className="mb-2">Propiedades Destacadas</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Las mejores oportunidades del mercado
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-base">
              Descubre una selección exclusiva de propiedades premium, cuidadosamente elegidas por nuestro equipo de expertos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-56 sm:h-64 bg-gray-100 rounded-xl animate-pulse" />
              ))
            ) : (
              Array.isArray(featuredProperties) && featuredProperties.length > 0 ? (
                featuredProperties
                  .filter((property: any) => property.destacada === true)
                  .map((property: any, index: number) => (
                    <div 
                      key={property.id}
                      className="group animate-fade-in-up transition-all duration-500 hover:scale-105 hover:shadow-xl"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <PropertyCard property={property} />
                    </div>
                  ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400">
                  No hay propiedades destacadas actualmente.
                </div>
              )
            )}
          </div>
        </div>
      </section>


       {/* Services Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-6 sm:mb-10">
            <Badge variant="outline" className="mb-2 text-[#ec520b] border-[#ec520b]/30 bg-[#ec520b]/5">
              Nuestros Servicios
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Soluciones inmobiliarias integrales
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-xs sm:text-base mb-4">
              Ofrecemos un servicio completo que abarca todas tus necesidades inmobiliarias, legales y contables
            </p>
          </div>
          <div className="flex justify-center">
            <Card className="bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl p-2 sm:p-4 w-full max-w-5xl relative overflow-hidden">
              {/* Gradient overlay interno */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ec520b]/5 via-transparent to-[#ec520b]/10 rounded-3xl"></div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 relative">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <Link key={service.title} to={service.href} className="group">
                      <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:bg-[#ec520b] hover:text-white hover:shadow-xl hover:scale-105 min-h-[140px] sm:min-h-[160px] border border-transparent hover:border-white/20">
                        {/* Icono: Naranja normal, Azul corporativo en hover para contraste */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#ec520b] group-hover:bg-[#022550] rounded-full flex items-center justify-center mb-4 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                          <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-white transition-colors duration-300" />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-white transition-colors text-center mb-2">
                          {service.title}
                        </span>
                        <span className="text-xs text-gray-500 group-hover:text-white/80 text-center px-2 leading-tight">
                          {service.description}
                        </span>
                        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowRight className="h-4 w-4 text-white/80" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="text-center mt-6 pt-4 border-t border-gray-200/50">
                <p className="text-xs text-gray-500">
                  <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
                  Todos nuestros servicios incluyen asesoramiento personalizado.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ContactForm con fondo de imagen y overlay como Contact.tsx */}
      {/* Contact Section - Estilo clásico, fondo blanco, card con overlay, logo, header, CTA WhatsApp, ContactForm sin header ni info lateral */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-4 sm:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ec520b]/5 via-transparent to-[#022550]/5 rounded-3xl"></div>
            <div className="text-center mb-8 relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#ec520b] to-[#ec520b] rounded-full mb-4">
                <img src="/logo_grande_fondo_azul 1.svg" alt="Logo" className="w-10 h-10 object-contain" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Contacto
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[#022550] text-lg sm:text-xl">
                <span>Podes comunicarte por</span>
                <a 
                  href="https://wa.me/message/2672WUGF2M56K1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded-full transition-colors duration-300 font-semibold text-sm sm:text-base"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <span>o completar el siguiente formulario</span>
              </div>
            </div>
            <div className="max-w-3xl mx-auto">
              <ContactForm 
                showContactInfo={false}
                showHeader={false}
                className="!py-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Botón Flotante de WhatsApp */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/message/2672WUGF2M56K1"
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

export default Home;