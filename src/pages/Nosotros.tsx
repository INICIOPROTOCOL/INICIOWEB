import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ContactForm from '@/components/ContactForm';
import { 
  Building, 
  Calendar,
  Heart, 
  MessageCircle, 
  Shield, 
  TrendingUp,
  Eye
} from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { trackClickWhatsApp } from '@/utils/googleAnalytics';

const Nosotros = () => {
    useScrollToTop();
  
    const empresaData = {
    lema: " En INICIO NEGOCIOS INMOBILIARIOS, nos enorgullecemos de asesorar a nuestros clientes en sus objetivos, brindando facilidades para concretar sus operaciones",
    quienesSomos: "Un equipo de profesionales dedicados a los servicios inmobiliarios en Villa Allende,Mendiolaza, alrededores en Sierras Chicas y Córdoba.",
    mision: "Acompañarte en cada paso de tus operaciones inmobiliarias, brindándote un servicio integral y de confianza. Por eso hemos creado un equipo que va más allá de lo tradicional, con un departamento de asesoría legal y contable para resolver todas tus inquietudes.",
    vision: "Ser la inmobiliaria de referencia, reconocida por nuestra integridad, profesionalismo y por la excelencia en el servicio al cliente. Buscamos ser la guia de confianza para quienes nos eligen.",
    valores: [
      {
        titulo: "Transparencia",
        descripcion: " Comprometidos a una comunicación clara en todo el proceso, logrando la tranquilidad a la hora de confiar en nosotros.",
        icono: Shield
      },
      {
        titulo: "Compromiso",
        descripcion: "Asumimos cada operación con seriedad y dedicación que se merece, trabajando para alcanzar los objetivos de quienes confían en nosotros.",
        icono: Heart
      },
      {
        titulo: "Innovación",
        descripcion: "Estamos en constante aprendizaje sobre las nuevas tendencias del mercado para ofrecer las soluciones más efectivas.",
        icono: TrendingUp
      }
    ],
    fundacion: {
      año: "2021", 
      historia: "En INICIO, crecemos y nos adaptamos constantemente para ofrecerte la mejor experiencia. Tu tranquilidad y éxito son nuestro principal objetivo."
    },
  };

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
            <Badge variant="outline" className="mb-6 bg-white/20 text-white border-white/30">
              Conoce Nuestra Historia
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins">
              Nosotros
            </h1>
          </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <Badge variant="outline" className="mb-4 text-[#ec520b] border-[#ec520b]/30 bg-[#ec520b]/5">
                Quiénes Somos
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                 SOMOS INICIO NEGOCIOS INMOBILIARIOS
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 font-montserrat">
                {empresaData.quienesSomos}
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#ec520b] rounded-full flex items-center justify-center">
  <Calendar className="h-6 w-6 text-white" />
</div>
                <div>
                  <div className="font-semibold text-gray-900">Fundada en {empresaData.fundacion.año}</div>
                  <div className="text-gray-600 text-sm font-montserrat">{empresaData.fundacion.historia}</div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-gradient-to-br from-[#ec520b]/10 to-[#022550]/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ec520b]/20 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#022550]/20 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10 text-center">
                  <Building className="h-16 w-16 text-[#ec520b] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Nuestra Misión
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-montserrat">
                    {empresaData.mision}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visión */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#ec520b]/90 to-white">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#ec520b]/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#022550]/10 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div className="relative z-10">
              <Badge variant="outline" className="mb-6 text-[#ec520b] border-[#ec520b]/30 bg-[#ec520b]/5">
                Nuestra Visión
              </Badge>
              
              {/* Icono centrado, estilo "Nuestra Misión" */}
              <div className="w-20 h-20 bg-[#022550] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Eye className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Hacia Dónde Vamos
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto font-montserrat">
                {empresaData.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-[#ec520b] border-[#ec520b]/30 bg-[#ec520b]/5">
              Nuestros Valores
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {empresaData.valores.map((valor, index) => {
              const IconComponent = valor.icono;
              return (
                <Card 
                  key={valor.titulo}
                  className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-6 text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ec520b]/5 to-[#022550]/5"></div>
                    <div className="relative z-10 flex flex-col items-center">
                      {/* Icono centrado, estilo "Nuestra Misión" */}
                      <div className="w-12 h-12 bg-[#ec520b] rounded-full flex items-center justify-center mb-4 shadow-lg mx-auto">
  <IconComponent className="h-6 w-6 text-white" />
</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {valor.titulo}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-center font-montserrat">
                        {valor.descripcion}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Formulario de Contacto Reutilizable */}
      <ContactForm 
        title="¡Hablemos!"
        subtitle="Estamos aquí para ayudarte con todas tus necesidades inmobiliarias"
        badge="Contáctanos"
        backgroundImage={heroImage}
      />

      {/* Botón Flotante de WhatsApp - SIN animación de pulso */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
	          href="https://wa.me/message/2672WUGF2M56K1"
	          target="_blank"
	          rel="noopener noreferrer"
	          onClick={() => trackClickWhatsApp({ location: 'nosotros_floating' })}
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

export default Nosotros;
