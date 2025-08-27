import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Heart, Phone, Eye } from 'lucide-react';

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'venta' | 'alquiler';
  image: string;
  featured?: boolean;
}

const PropertyCard = ({ 
  title, 
  price, 
  location, 
  bedrooms, 
  bathrooms, 
  area, 
  type, 
  image, 
  featured = false 
}: PropertyCardProps) => {
  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 overflow-hidden border-border/50 bg-gradient-card">
      <div className="relative">
        <img 
          src={image || '/placeholder.svg'} 
          alt={title || 'Propiedad'}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge 
            variant={type === 'venta' ? 'default' : 'secondary'}
            className={type === 'venta' ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'}
          >
            {type === 'venta' ? 'En Venta' : 'En Alquiler'}
          </Badge>
          {featured && (
            <Badge variant="outline" className="bg-accent text-accent-foreground border-accent">
              Destacada
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <Button size="icon" variant="ghost" className="bg-card/80 backdrop-blur-sm hover:bg-card">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {location || 'Ubicación no informada'}
            </div>
          </div>
          
          <div className="text-2xl font-bold text-primary">
            {price || 'Consultar precio'}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{area}m²</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" className="flex-1">
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalles
        </Button>
        <Button className="flex-1 bg-gradient-primary">
          <Phone className="h-4 w-4 mr-2" />
          Contactar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;