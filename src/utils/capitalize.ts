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
  // eliminados duplicados: 'baño', 'baños', 'quincho', 'pileta', 'terraza', 'jardín', 'jardines'
};

export function capitalizeAndFixAccent(text?: string) {
  if (!text) return '';
  const lower = text.trim().toLowerCase();
  // Buscar reemplazo exacto
  if (accentMap[lower]) {
    // Mantener mayúscula inicial
    return accentMap[lower].charAt(0).toUpperCase() + accentMap[lower].slice(1);
  }
  // Si no hay reemplazo, capitalizar y devolver original
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Compatibilidad retro (por si hay imports viejos)
export const capitalizeFirst = capitalizeAndFixAccent;