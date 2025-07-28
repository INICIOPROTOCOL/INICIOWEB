import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Clock, MessageCircle, Calendar } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="outline" className="mb-4 bg-white/10 border-white/30 text-white">
            Contacto
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hablemos de tu próximo hogar
          </h1>
          <p className="text-xl text-white/90">
            Nuestro equipo de expertos está listo para ayudarte a encontrar la propiedad perfecta
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-primary" />
                    Teléfono
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground">+54 11 4000-0000</p>
                  <p className="text-muted-foreground">Línea directa 24/7</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground">info@inmoreal.com</p>
                  <p className="text-muted-foreground">Respuesta en menos de 2 horas</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Oficina Central
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground">Av. Corrientes 1234</p>
                  <p className="text-muted-foreground">CABA, Argentina (C1043AAZ)</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Horarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-foreground">Lun - Vie: 9:00 - 19:00</p>
                    <p className="text-foreground">Sábados: 9:00 - 14:00</p>
                    <p className="text-muted-foreground">Domingos: Cerrado</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-card border-border/50 shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-2xl">Envíanos un mensaje</CardTitle>
                  <p className="text-muted-foreground">
                    Completa el formulario y nos pondremos en contacto contigo en breve
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Nombre *</label>
                      <Input placeholder="Tu nombre completo" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email *</label>
                      <Input type="email" placeholder="tu@email.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Teléfono</label>
                      <Input placeholder="+54 11 1234-5678" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Tipo de consulta</label>
                      <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground">
                        <option>Quiero comprar</option>
                        <option>Quiero vender</option>
                        <option>Quiero alquilar</option>
                        <option>Necesito tasación</option>
                        <option>Consulta legal</option>
                        <option>Otro</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Presupuesto estimado</label>
                    <select className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground">
                      <option>Hasta $100.000</option>
                      <option>$100.000 - $200.000</option>
                      <option>$200.000 - $300.000</option>
                      <option>$300.000 - $500.000</option>
                      <option>Más de $500.000</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Mensaje *</label>
                    <Textarea 
                      placeholder="Cuéntanos más detalles sobre lo que estás buscando..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1 bg-gradient-primary">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar Mensaje
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Reunión
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Al enviar este formulario, aceptas nuestros términos de privacidad y 
                    que un asesor se ponga en contacto contigo.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Visítanos</h2>
            <p className="text-muted-foreground">
              Estamos ubicados en el corazón de Buenos Aires, fácil acceso en transporte público
            </p>
          </div>
          
          <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Mapa interactivo próximamente</p>
              <p className="text-sm text-muted-foreground mt-2">
                Av. Corrientes 1234, CABA - A 2 cuadras de la estación Carlos Pellegrini
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;