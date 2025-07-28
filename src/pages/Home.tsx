import SearchForm from '@/components/SearchForm';
import PropertyCard from '@/components/PropertyCard';
import ServiceCard from '@/components/ServiceCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Key, Calculator, Gavel, Users, Star, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-bg.jpg';
import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';

const Home = () => {
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
      features: [
        'Valuación profesional gratuita',
        'Marketing digital especializado',
        'Gestión de documentación',
        'Acompañamiento hasta la escritura'
      ],
      href: '/ventas'
    },
    {
      title: 'Tasaciones',
      description: 'Valuaciones profesionales realizadas por martilleros matriculados.',
      icon: Calculator,
      features: [
        'Informe técnico detallado',
        'Análisis de mercado',
        'Certificación oficial',
        'Entrega en 48hs'
      ],
      href: '/tasaciones'
    },
    {
      title: 'Legales',
      description: 'Asesoría jurídica especializada en derecho inmobiliario.',
      icon: Gavel,
      features: [
        'Revisión de contratos',
        'Gestión de escrituras',
        'Asesoría fiscal',
        'Resolución de conflictos'
      ],
      href: '/legales'
    },
    {
      title: 'Nosotros',
      description: 'Conoce nuestro equipo de profesionales y nuestra trayectoria.',
      icon: Users,
      features: [
        'Más de 20 años de experiencia',
        'Equipo multidisciplinario',
        'Presencia nacional',
        'Atención personalizada'
      ],
      href: '/nosotros'
    }
  ];

  const stats = [
    { number: '2000+', label: 'Propiedades Vendidas', icon: Award },
    { number: '98%', label: 'Clientes Satisfechos', icon: Star },
    { number: '15+', label: 'Años de Experiencia', icon: TrendingUp },
    { number: '24/7', label: 'Atención al Cliente', icon: CheckCircle }
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
              🏆 #1 Inmobiliaria en CABA
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Encuentra tu
              <span className="bg-gradient-accent bg-clip-text text-transparent"> hogar ideal</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              La plataforma inmobiliaria más completa de Argentina. Más de 10,000 propiedades disponibles para venta y alquiler.
            </p>
          </div>
          
          <div className="animate-slide-up">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Propiedades Destacadas</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Las mejores oportunidades del mercado
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
            <Button className="bg-gradient-primary" asChild>
              <Link to="/propiedades">
                Ver todas las propiedades
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Nuestros Servicios</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Soluciones inmobiliarias integrales
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos un servicio completo que abarca todas tus necesidades inmobiliarias, desde la búsqueda hasta la escrituración.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div 
                key={service.title}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para encontrar tu próxima propiedad?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Nuestro equipo de expertos está aquí para ayudarte en cada paso del camino.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/contacto">Contactar Asesor</Link>
            </Button>
            <Button size="lg" className="bg-gradient-accent text-accent-foreground" asChild>
              <Link to="/propiedades">Explorar Propiedades</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;