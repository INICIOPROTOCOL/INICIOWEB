import SearchForm from '@/components/SearchForm';
import PropertyCard from '@/components/PropertyCard';
import ServiceCard from '@/components/ServiceCard';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Key, Calculator, Gavel, Users, Star, Award, TrendingUp, CheckCircle, MessageCircle, Building, Car, Scale, FileText, Settings, Phone, Mail, User, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import heroImage from '@/assets/hero-bg.jpg';
import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const Home = () => {
  // Scroll to top on mount
  useScrollToTop();
  const featuredProperties = [
    {
      id: '1',
      title: 'Casa Moderna en Palermo',
      price: '$350.000',
      location: 'Palermo, CABA',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      type: 'venta' as const,
      image: property1,
      featured: true
    },
    {
      id: '2',
      title: 'Departamento Premium',
      price: '$180.000/mes',
      location: 'Puerto Madero, CABA',
      bedrooms: 2,
      bathrooms: 2,
      area: 85,
      type: 'alquiler' as const,
      image: property2,
      featured: true
    },
    {
      id: '3',
      title: 'Oficina Corporativa',
      price: '$450.000',
      location: 'Microcentro, CABA',
      bedrooms: 0,
      bathrooms: 4,
      area: 200,
      type: 'venta' as const,
      image: property3
    }
  ];

  const services = [
    {
      title: 'Ventas',
      description: 'Asesoramiento completo para la venta de tu propiedad al mejor precio del mercado.',
      icon: Key,
      href: '/nuestros-servicios#ventas'
    },
    {
      title: 'Alquileres',
      description: 'Gestión integral de alquileres, desde la búsqueda hasta la administración. ',
      icon: Building,
      href: '/nuestros-servicios#alquileres'
    },
    {
      title: 'Tasaciones',
      description: 'Valuaciones profesionales realizadas por martilleros matriculados.',
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
      description: 'Servicios contables especializados para el sector inmobiliario.',
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


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <Badge variant="outline" className="mb-6 bg-card/90 backdrop-blur-sm text-foreground border-border/50">
              #Pinta algo aca?
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Encuentra el
              <span className="bg-gradient-to-r from-[#ff7b25] to-[#ff5e00] bg-clip-text text-transparent"> lugar que buscas</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              La Plataforma inmobiliaria mas completa para la busqueda de tu propiedad
            </p>
          </div>
          
          <div className="animate-slide-up">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Sección de Invitación con Botones */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-white relative">        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Gradient overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ec520b]/5 via-transparent to-[#022550]/5 rounded-3xl"></div>
            
            <div className="text-center mb-8 relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#ec520b] to-[#022550] rounded-full mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                Estamos para acompañarte
              </h3>
              <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                Sea cual sea tu objetivo inmobiliario, tenemos la solución perfecta para ti
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative">
              {/* Card Ver Propiedades */}
              <div className="bg-gradient-to-br from-[#022550] to-[#033366] rounded-xl p-6 text-white relative overflow-hidden group transform hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 group-hover:to-white/10 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <Search className="h-8 w-8 mb-4 text-white/90" />
                  <h4 className="text-lg font-semibold mb-2">¿Buscas tu hogar ideal?</h4>
                  <p className="text-white/80 text-sm mb-4">
                    Explora nuestra selección de propiedades exclusivas
                  </p>
                  <Button 
                    asChild
                    className="w-full bg-white text-[#022550] hover:bg-gray-100 font-semibold shadow-lg"
                  >
                    <Link to="/propiedades">
                      Ver Propiedades
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Card Solicitar Tasación */}
              <div className="bg-gradient-to-br from-[#ec520b] to-[#ff6b1a] rounded-xl p-6 text-white relative overflow-hidden group transform hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 group-hover:to-white/10 transition-colors duration-300"></div>
                <div className="relative z-10">
                  <Calculator className="h-8 w-8 mb-4 text-white/90" />
                  <h4 className="text-lg font-semibold mb-2">¿Estás buscando vender tu propiedad?</h4>
                  <p className="text-white/80 text-sm mb-4">
                    Solicita una tasación profesional
                  </p>
                  <Button 
                    asChild
                    className="w-full bg-white text-[#ec520b] hover:bg-gray-100 font-semibold shadow-lg"
                  >
                    <Link to="/tasaciones">
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
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="outline" className="mb-4">Propiedades Destacadas</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Las mejores oportunidades del mercado
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Descubre una selección exclusiva de propiedades premium, cuidadosamente elegidas por nuestro equipo de expertos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProperties.map((property, index) => (
              <div 
                key={property.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <PropertyCard {...property} />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button className="bg-gradient-to-r from-[#ec520b] to-[#022550] hover:from-[#022550] hover:to-[#ec520b]" asChild>
              <Link to="/propiedades">
                Ver todas las propiedades
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="outline" className="mb-4 text-[#ec520b] border-[#ec520b]/30 bg-[#ec520b]/5">
              Nuestros Servicios
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Soluciones inmobiliarias integrales
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base mb-6">
              Ofrecemos un servicio completo que abarca todas tus necesidades inmobiliarias, legales y contables
            </p>
            
          </div>

          <div className="flex justify-center">
            <Card className="bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl p-4 sm:p-6 w-full max-w-5xl relative overflow-hidden">
              {/* Gradient overlay interno */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ec520b]/5 via-transparent to-[#022550]/5 rounded-3xl"></div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 relative">
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <Link key={service.title} to={service.href} className="group">
                      <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:bg-gradient-to-r hover:from-[#ec520b] hover:to-[#022550] hover:text-white hover:shadow-xl hover:scale-105 min-h-[140px] sm:min-h-[160px] border border-transparent hover:border-white/20">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#ec520b] to-[#022550] rounded-full flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-[#ec520b] transition-all duration-300 shadow-lg group-hover:shadow-xl">
                          <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:text-[#ec520b]" />
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-white transition-colors text-center mb-2">
                          {service.title}
                        </span>
                        <span className="text-xs text-gray-500 group-hover:text-white/80 text-center px-2 leading-tight">
                          {service.description}
                        </span>
                        
                        {/* Indicador de "más info" */}
                        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowRight className="h-4 w-4 text-white/80" />
                        </div>
                      </div>
                    </Link>
                  );
                })}

              </div>
              
              {/* Nota informativa */}
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

      {/* Contact Section - Usando ContactForm reutilizable */}
      <div className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `linear-gradient(rgba(2, 37, 80, 0.85), rgba(236, 82, 11, 0.15)), url(${heroImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#022550]/80 via-[#022550]/60 to-[#ec520b]/40"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20">
          {/* Header personalizado para mantener el estilo original */}
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="outline" className="mb-4 bg-white/20 text-white border-white/30">
              Contacto
            </Badge>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-white/90 text-lg sm:text-xl">
              <span>Podes comunicarte por</span>
              <a 
                href="https://wa.me/5491123456789" 
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

          {/* Formulario reutilizable sin el header */}
          <ContactForm 
            showContactInfo={false}
            showHeader={false}
            className="!py-0"
          />
        </div>
      </div>

      {/* Botón Flotante de WhatsApp - SIN animación de pulso */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/5491123456789?text=Hola,%20estoy%20interesado%20en%20sus%20servicios%20inmobiliarios"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" />
          
          {/* Tooltip de información */}
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