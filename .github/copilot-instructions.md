# AI Coding Instructions - Real Estate Website (INICIO)

## Project Overview

This is a React/TypeScript real estate website for "INICIO" - a comprehensive real estate platform built with modern web technologies. The architecture emphasizes component reusability, consistent corporate branding, and preparation for backend integration.

## Core Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Routing**: React Router with hash-based navigation
- **Build Tool**: Vite
- **Package Manager**: Bun

## Corporate Design System

### Brand Colors
- **Primary Blue**: `#022550` - Usado para headers, botones primarios, branding principal
- **Accent Orange**: `#ec520b` - Usado para CTAs, highlights, hover states


### Visual Hierarchy
```css
/* Section backgrounds */
bg-white                                    /* Primary content sections */
bg-gradient-to-b from-gray-50 to-white    /* Alternating sections */

/* Container spacing */
py-12 sm:py-16                             /* Section vertical padding */
px-4 sm:px-6 lg:px-8                       /* Horizontal container padding */
max-w-7xl mx-auto                          /* Content max width */
```

### Animation Standards
```tsx
// Card hover effects
hover:scale-105 transition-all duration-300

// Staggered animations
style={{ animationDelay: `${index * 0.1}s` }}

// Button hover states - reverse gradients
hover:bg-gradient-to-r hover:from-[#022550] hover:to-[#033366]
```

## Component Architecture

### Reusable Components

#### ContactForm (`src/components/ContactForm.tsx`)
**Purpose**: Universal contact form with configurable display options
```tsx
interface ContactFormProps {
  showHeader?: boolean;      // Toggle form title section
  showContactInfo?: boolean; // Toggle contact info sidebar
  backgroundImage?: string;  // Optional hero background
}

<ContactForm 
  showHeader={false}
  showContactInfo={true}
  backgroundImage={heroImage}
/>
```

#### PropertyCard (`src/components/PropertyCard.tsx`)
**Purpose**: Display property listings with consistent formatting
```tsx
interface PropertyCardProps {
  property: Property;
  onContact?: () => void;
}
```

### UI Component Patterns

#### Service Cards
```tsx
// Standard service card structure
<div className="group bg-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 min-h-[140px] sm:min-h-[160px]">
  <div className="p-6 text-center">
    <div className="mx-auto w-12 h-12 bg-gradient-to-r from-[#ec520b] to-[#ff6b1a] rounded-lg flex items-center justify-center mb-4 group-hover:from-[#022550] group-hover:to-[#033366] transition-all duration-300">
      <Icon className="h-6 w-6 text-white" />
    </div>
    {/* Content */}
  </div>
</div>
```

#### Hero Sections
```tsx
// Standard hero pattern (solo azul)
<section className="relative h-screen flex items-center justify-center overflow-hidden">
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${heroImage})` }}
  />
  <div className="absolute inset-0 bg-gradient-to-r from-[#022550]/80 to-[#033366]/70" />
  <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Hero content */}
  </div>
</section>

```

## Page Structure Standards

### Standard Page Layout
All pages should follow this structure:
1. **Hero Section**: Full-height with background image and gradient overlay
2. **Main Content**: Alternating white and light gray backgrounds
3. **Contact Integration**: ContactForm component near bottom
4. **Floating WhatsApp**: Fixed position bottom-right (NO pulse animation)

### Page-Specific Patterns

#### Home Page (`src/pages/Home.tsx`)
- Services grid: 2 columns mobile, 3 columns desktop
- Property showcase with filtered display
- Integrated contact form with `showContactInfo={true}`

#### Services Page (`src/pages/NuestrosServicios.tsx`)
- Hash-based navigation to service sections
- Service detail cards with alternating left/right layouts
- Process workflow visualizations

#### Properties Page (`src/pages/Properties.tsx`)
- Search filters with responsive design
- Grid layout: 1 column mobile, 2 tablet, 3 desktop
- Pagination with backend preparation

#### Contact Page (`src/pages/Contact.tsx`)
- Multiple contact methods display
- ContactForm with `showHeader={true}` and `showContactInfo={false}`
- Office information and business hours

## Navigation System

### Hash-Based Routing
```tsx
// Service navigation pattern
<Link 
  to="/nuestros-servicios#tasaciones"
  className="text-orange-600 hover:text-orange-700"
>
  Ver más sobre Tasaciones
</Link>

// Destination page implementation
useScrollToHash(); // Custom hook for hash navigation

// Section containers
<section id="tasaciones" className="scroll-mt-20 py-12">
  {/* Content */}
</section>
```

### Custom Hooks

#### useScrollToTop
```tsx
// Auto-scroll to top on route changes
const useScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
};
```

#### useScrollToHash
```tsx
// Handle hash-based section navigation
const useScrollToHash = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
};
```

## Backend Integration Preparation

### TypeScript Interfaces

#### Property Management
```tsx
interface Property {
  id: string;
  titulo: string;
  descripcion?: string;
  precio: number;
  moneda: 'ARS' | 'USD';
  tipo_operacion: 'venta' | 'alquiler' | 'venta_alquiler';
  tipo_propiedad: string;
  superficie_total?: number;
  superficie_cubierta?: number;
  habitaciones?: number;
  banios?: number;
  cocheras?: number;
  expensas?: number;
  antiguedad?: number;
  estado_conservacion?: string;
  orientacion?: string;
  ubicacion: {
    provincia: string;
    ciudad: string;
    barrio?: string;
    direccion?: string;
    piso?: string;
    departamento?: string;
  };
  caracteristicas: string[];
  imagenes: string[];
  video_url?: string;
  contacto: {
    nombre: string;
    telefono: string;
    email: string;
  };
  fecha_publicacion: Date;
  fecha_actualizacion: Date;
  activo: boolean;
  destacado: boolean;
}
```

#### API Integration Pattern
```tsx
// Prepare for backend integration
const fetchProperties = async (page: number, filters: SearchFilters): Promise<PropertyResponse> => {
  try {
    // TODO: Replace with actual API endpoint
    const response = await fetch(`/api/propiedades?page=${page}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters)
    });
    return await response.json();
  } catch (error) {
    // Currently using hardcoded data
    return { properties: mockProperties, total: mockProperties.length };
  }
};
```

## Responsive Design Rules

### Grid Systems
```css
/* Services grid */
grid-cols-2 sm:grid-cols-3

/* Properties grid */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Content container */
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Component Sizing
```css
/* Icons */
h-6 w-6 sm:h-7 sm:w-7

/* Buttons */
px-8 py-3    /* Large buttons */
px-4 py-2    /* Small buttons */

/* Cards */
min-h-[140px] sm:min-h-[160px]  /* Consistent heights */

/* Text sizing */
text-3xl sm:text-4xl lg:text-5xl /* Hero titles */
text-xl sm:text-2xl              /* Section titles */
```

## WhatsApp Integration

### Contact Links
```tsx
// Standard WhatsApp link format
const whatsappLink = `https://wa.me/5493515155669?text=${encodeURIComponent(
  `Hola! Me interesa obtener más información sobre ${propertyTitle}`
)}`;

// Floating WhatsApp button (NO pulse animation)
<a
  href={whatsappLink}
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 group"
>
  <MessageCircle className="h-6 w-6" />
  <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
    Contactar por WhatsApp
  </span>
</a>
```

## Database Schema (Real Estate Context)

### Key Entities for Argentine Market
```sql
-- Properties with local market considerations
CREATE TABLE propiedades (
  id UUID PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  precio DECIMAL(12,2) NOT NULL,
  moneda ENUM('ARS', 'USD') DEFAULT 'ARS',
  expensas DECIMAL(10,2),           -- Common in Argentina
  antiguedad INTEGER,               -- Property age
  orientacion VARCHAR(50),          -- Important for lighting
  -- ... other fields
);

-- Location hierarchy
CREATE TABLE ubicaciones (
  id UUID PRIMARY KEY,
  provincia VARCHAR(100) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  barrio VARCHAR(100),
  codigo_postal VARCHAR(10)
);

-- Lead management
CREATE TABLE consultas (
  id UUID PRIMARY KEY,
  propiedad_id UUID REFERENCES propiedades(id),
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  mensaje TEXT,
  estado ENUM('nuevo', 'contactado', 'interesado', 'cerrado') DEFAULT 'nuevo',
  origen ENUM('web', 'whatsapp', 'telefono') DEFAULT 'web',
  fecha_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development Workflows

### Component Creation Checklist
1. ✅ Follow shadcn/ui patterns and naming conventions
2. ✅ Include comprehensive TypeScript interfaces
3. ✅ Add responsive breakpoints (mobile-first approach)
4. ✅ Apply corporate color scheme consistently
5. ✅ Implement hover states and transitions
6. ✅ Add proper accessibility attributes
7. ✅ Test across mobile, tablet, and desktop

### Page Development Checklist
1. ✅ Import and use `useScrollToTop()` hook
2. ✅ Include hero section with gradient overlay
3. ✅ Integrate ContactForm with appropriate props
4. ✅ Add floating WhatsApp button (no pulse)
5. ✅ Ensure mobile-first responsive design
6. ✅ Add proper meta tags and SEO considerations
7. ✅ Test hash-based navigation if applicable

### Code Quality Standards
```tsx
// Always include proper TypeScript interfaces
interface ComponentProps {
  required: string;
  optional?: number;
  callback?: () => void;
}

// Use consistent naming conventions
const ComponentName: React.FC<ComponentProps> = ({ required, optional, callback }) => {
  // Component logic
};

// Export with proper typing
export default ComponentName;
export type { ComponentProps };
```

## Common Patterns and Examples

### Service Grid Implementation
```tsx
const services = [
  { id: 'ventas', title: 'Ventas', icon: Home, path: '/nuestros-servicios#ventas' },
  { id: 'alquileres', title: 'Alquileres', icon: Key, path: '/nuestros-servicios#alquileres' },
  // ... more services
];

return (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
    {services.map((service, index) => (
      <Link
        key={service.id}
        to={service.path}
        className="group bg-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Service card content */}
      </Link>
    ))}
  </div>
);
```

### Property Filter Implementation
```tsx
const [filters, setFilters] = useState<SearchFilters>({
  tipoOperacion: 'todas',
  tipoPropiedad: 'todas',
  precioMin: '',
  precioMax: '',
  habitaciones: 'todas',
  ubicacion: 'todas'
});

// Handle filter changes
const handleFilterChange = (key: keyof SearchFilters, value: string) => {
  setFilters(prev => ({ ...prev, [key]: value }));
};
```

## Error Handling Patterns

```tsx
// API error handling
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) throw new Error('Network response was not ok');
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Error:', error);
  // Fallback to mock data or show error message
  return mockData;
}

// Form validation
const validateForm = (formData: FormData): string[] => {
  const errors: string[] = [];
  if (!formData.nombre.trim()) errors.push('El nombre es requerido');
  if (!formData.telefono.trim()) errors.push('El teléfono es requerido');
  // ... more validations
  return errors;
};
```

## Performance Considerations

### Image Optimization
```tsx
// Use proper image loading
<img 
  src={imageSrc} 
  alt={altText}
  loading="lazy"
  className="w-full h-48 object-cover rounded-lg"
/>

// For hero images, preload for better performance
<link rel="preload" as="image" href={heroImage} />
```

### Bundle Optimization
```tsx
// Lazy load pages for better initial load time
const Home = lazy(() => import('./pages/Home'));
const Properties = lazy(() => import('./pages/Properties'));

// Wrap with Suspense
<Suspense fallback={<div>Cargando...</div>}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/propiedades" element={<Properties />} />
  </Routes>
</Suspense>
```

## Testing Guidelines

### Component Testing
```tsx
// Test component rendering and interactions
describe('ContactForm', () => {
  it('renders with correct props', () => {
    render(<ContactForm showHeader={true} showContactInfo={false} />);
    expect(screen.getByText('Contáctanos')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const onSubmit = jest.fn();
    render(<ContactForm onSubmit={onSubmit} />);
    // ... test form submission
  });
});
```

## Deployment Considerations

### Environment Variables
```env
VITE_API_BASE_URL=https://api.inicio-inmobiliaria.com
VITE_WHATSAPP_NUMBER=5493515155669
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### Build Configuration
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

Remember: Always prioritize mobile-first responsive design, maintain consistent branding with the corporate colors, and prepare components for future backend integration. The architecture should remain scalable and maintainable as the real estate platform grows.
