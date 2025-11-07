// Diccionario de reemplazos para tildes y palabras comunes del rubro inmobiliario
const accentMap: Record<string, string> = {
  'bano': 'baño',
  'banos': 'baños',
  'habitacion': 'habitación',
  'habitaciones': 'habitaciones',
  'cochera': 'cochera',
  'cocheras': 'cocheras',
  'departamento': 'departamento',
  'departamentos': 'departamentos',
  'oficina': 'oficina',
  'oficinas': 'oficinas',
  'local': 'local',
  'locales': 'locales',
  'superficie': 'superficie',
  'frente': 'frente',
  'fondo': 'fondo',
  'lote': 'lote',
  'terreno': 'terreno',
  'terrenos': 'terrenos',
  'antiguedad': 'antigüedad',
  'expensas': 'expensas',
  'patio': 'patio',
  'quincho': 'quincho',
  'pileta': 'pileta',
  'balcon': 'balcón',
  'balcones': 'balcones',
  'galeria': 'galería',
  'galerias': 'galerías',
  'dormitorio': 'dormitorio',
  'dormitorios': 'dormitorios',
  'ambiente': 'ambiente',
  'ambientes': 'ambientes',
  'lavadero': 'lavadero',
  'terraza': 'terraza',
  'jardin': 'jardín',
  'jardines': 'jardines',
  'planta': 'planta',
  'plantas': 'plantas',
  'ph': 'PH',
  'monoambiente': 'monoambiente',
  'casa': 'casa',
  'casas': 'casas',
  'duplex': 'dúplex',
  'triplex': 'tríplex',
  'piscina': 'piscina',
  'suite': 'suite',
  'toilette': 'toilette',
  'garage': 'garage',
  'garages': 'garages',
  'vista': 'vista',
  'vistas': 'vistas',
  'azotea': 'azotea',
  'azoteas': 'azoteas',
  'parrilla': 'parrilla',
  'parrillas': 'parrillas',
  'baulera': 'baulera',
  'bauleras': 'bauleras',
  'deposito': 'depósito',
  'depositos': 'depósitos',
  'playroom': 'playroom',
  'sum': 'SUM',
  'quincho': 'quincho',
  'balcon terraza': 'balcón terraza',
  'balcon corrido': 'balcón corrido',
  'living': 'living',
  'comedor': 'comedor',
  'cocina': 'cocina',
  'toilette': 'toilette',
  'escritorio': 'escritorio',
  'patio': 'patio',
  'lavadero': 'lavadero',
  
  // Tipos de características comunes
  'interiores': 'Interiores',
  'exteriores': 'Exteriores',
  'servicios': 'Servicios',
  'comodidades': 'Comodidades',
  'caracteristicas generales': 'Características Generales',
  'caracteristicas': 'Características',
  'ambientes': 'Ambientes',
  'equipamiento': 'Equipamiento',
  'seguridad': 'Seguridad',
  'ubicacion': 'Ubicación',
  'entorno': 'Entorno',
  'instalaciones': 'Instalaciones',
  'acabados': 'Acabados',
  'adicionales': 'Adicionales',
  'espacios comunes': 'Espacios Comunes',
  'amenities': 'Amenities',
  'infraestructura': 'Infraestructura',
  'calefaccion': 'Calefacción',
  'refrigeracion': 'Refrigeración',
  'pisos': 'Pisos',
  'techos': 'Techos',
  'paredes': 'Paredes',
  'ventanas': 'Ventanas',
  'puertas': 'Puertas',
  'iluminacion': 'Iluminación',
  'conectividad': 'Conectividad',
  'accesibilidad': 'Accesibilidad'
};

export function capitalizeAndFixAccent(text?: string) {
  if (!text || text.trim() === '') return '';
  
  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();
  
  // Buscar reemplazo exacto primero
  if (accentMap[lower]) {
    // Mantener mayúscula inicial del reemplazo
    const replacement = accentMap[lower];
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  
  // Si no hay reemplazo exacto, capitalizar la primera letra y mantener el resto
  // Pero asegurándonos de limpiar espacios y caracteres extraños
  const normalized = cleanText
    .replace(/^\s+|\s+$/g, '') // Trim extra
    .replace(/\s+/g, ' '); // Normalizar espacios múltiples
    
  if (normalized.length === 0) return '';
  
  // Capitalizar solo la primera letra, mantener el resto como vino (por si tiene tildes correctas)
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}

// Función específica para capitalizar títulos (cada palabra)
export function capitalizeTitle(text?: string) {
  if (!text || text.trim() === '') return '';
  
  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();
  
  // Buscar reemplazo exacto primero
  if (accentMap[lower]) {
    return accentMap[lower];
  }
  
  // Para títulos, capitalizar cada palabra
  return cleanText
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      // Buscar palabra individual en el diccionario
      if (accentMap[word]) {
        return accentMap[word];
      }
      // Capitalizar primera letra
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Compatibilidad retro (por si hay imports viejos)
export const capitalizeFirst = capitalizeAndFixAccent;