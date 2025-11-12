# 📋 Endpoints que el FRONTEND está consumiendo

## ✅ Configuración actual del Frontend

**Base URL:** `http://localhost:3000/api` (configurable en `.env` con `VITE_API_URL`)

---

## 🎯 Endpoints IMPLEMENTADOS en el Frontend

### 1️⃣ **Listar todas las propiedades**
```typescript
GET /api/propiedades
```

**Usado en:**
- `src/pages/Properties.tsx` (listado completo con filtros)
- `src/pages/Home.tsx` (propiedades destacadas con `?destacada=true&limit=3`)

**Query params opcionales:**
- `destacada=true` - Filtrar solo destacadas
- `limit=3` - Limitar cantidad de resultados

**Respuesta esperada:**
```json
[
  {
    "id": 69,
    "slug": "casa-3-dormitorios-nueva-cordoba-69",
    "titulo": "Casa 3 Dormitorios",
    "destacada": true,
    "tipos_propiedad": { "nombre": "casa" },
    "ubicaciones": { "ciudad": "Córdoba", "barrio": "Nueva Córdoba" },
    "imagenes_propiedad": [
      { "url_imagen": "https://...", "es_principal": true, "orden": 1 }
    ],
    "operaciones_propiedad": [
      { "precio": 250000, "moneda": "USD", "tipos_operacion": { "nombre": "venta" } }
    ]
  }
]
```

---

### 2️⃣ **Obtener detalle de propiedad por SLUG** (Método Principal)
```typescript
GET /api/propiedades/slug/:slug
```

**Usado en:** `src/pages/PropertyDetail.tsx`

**Ejemplo:**
```bash
GET /api/propiedades/slug/casa-3-dormitorios-nueva-cordoba-69
```

**Respuesta esperada:** Objeto completo de propiedad (igual estructura que el listado pero con todos los detalles)

---

### 3️⃣ **Obtener detalle de propiedad por ID** (Fallback)
```typescript
GET /api/propiedades/:id
```

**Usado en:** `src/pages/PropertyDetail.tsx` (como fallback cuando slug falla o parámetro es numérico)

**Ejemplo:**
```bash
GET /api/propiedades/69
```

**Respuesta esperada:** ✅ **MISMA estructura que endpoint de slug**

---

## 🚀 Lógica DUAL PATH del Frontend

### PropertyDetail.tsx implementa:

```typescript
// 1. Detecta si el parámetro es ID numérico
const isNumericId = /^\d+$/.test(slug);

// 2. Si es numérico → intenta primero por ID (más rápido)
if (isNumericId) {
  try {
    const response = await axios.get(`/api/propiedades/${slug}`);
    return response.data;
  } catch (error) {
    // Si falla, intenta por slug
  }
}

// 3. Siempre intenta por slug (incluso si es numérico)
const response = await axios.get(`/api/propiedades/slug/${slug}`);
return response.data;
```

### Ventajas:
- ✅ Funciona con URLs antiguas que usan ID: `/propiedad/69`
- ✅ Funciona con URLs SEO-friendly: `/propiedad/casa-3-dormitorios-69`
- ✅ No rompe durante la migración de datos
- ✅ Transición suave cuando se generen todos los slugs

---

## 📦 Otros endpoints auxiliares usados

### Tipos de Propiedad
```typescript
GET /api/tipos
```
**Usado en:** Properties.tsx, filtros

### Ubicaciones únicas
```typescript
GET /api/ubicaciones/ciudades-unicas
```
**Usado en:** Properties.tsx, filtros de ubicación

### Tipos de Operación
```typescript
GET /api/tipos-operacion
```
**Usado en:** Properties.tsx, PropertyDetail.tsx

### Tipos de Característica
```typescript
GET /api/tipos-caracteristica
```
**Usado en:** PropertyDetail.tsx (para agrupar características por tipo)

---

## ⚠️ Problema ACTUAL a resolver en Backend

### **Las propiedades NO tienen slugs generados**

**Evidencia:**
```
PropertyCard.tsx:55 🏠 PropertyCard - ID: 69, Slug: NO TIENE SLUG
```

### **Solución URGENTE - Generar slugs:**

```sql
-- Script SQL para generar slugs automáticamente
UPDATE propiedades 
SET slug = LOWER(
  CONCAT(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
      REGEXP_REPLACE(TRIM(titulo), '[^a-zA-Z0-9 ]', ''), 
      ' ', '-'), 
      'á', 'a'), 
      'é', 'e'), 
      'í', 'i'), 
      'ó', 'o'), 
      'ú', 'u'
    ),
    '-',
    id
  )
)
WHERE slug IS NULL OR slug = '' OR slug = 'undefined';
```

**O usando código Node.js/TypeScript:**

```typescript
import slugify from 'slugify';

async function generarSlugs() {
  const propiedades = await prisma.propiedad.findMany({
    where: { 
      OR: [
        { slug: null }, 
        { slug: '' },
        { slug: 'undefined' }
      ] 
    }
  });
  
  for (const prop of propiedades) {
    const slug = slugify(`${prop.titulo}-${prop.id}`, { 
      lower: true, 
      strict: true,
      locale: 'es'
    });
    
    await prisma.propiedad.update({
      where: { id: prop.id },
      data: { slug }
    });
    
    console.log(`✅ Propiedad ${prop.id}: ${slug}`);
  }
  
  console.log(`\n✅ Total: ${propiedades.length} slugs generados`);
}

// Ejecutar
generarSlugs();
```

---

## 🎯 PropertyCard - Navegación

**Usa slug con fallback a ID:**
```typescript
// Link generado en PropertyCard.tsx
const propertyUrl = `/propiedad/${property.slug || property.id}`;

// Ejemplos de URLs generadas:
// ✅ Con slug: /propiedad/casa-3-dormitorios-nueva-cordoba-69
// ⚠️ Sin slug: /propiedad/69 (fallback temporal)
```

---

## ✅ Checklist para el Backend

- [ ] Endpoint `GET /api/propiedades` devuelve array de propiedades
- [ ] Endpoint `GET /api/propiedades/slug/:slug` funciona y devuelve propiedad completa
- [ ] Endpoint `GET /api/propiedades/:id` funciona y devuelve **la misma estructura** que por slug
- [ ] Todas las propiedades tienen campo `slug` en la base de datos
- [ ] Los slugs son únicos (constraint UNIQUE)
- [ ] Script de migración ejecutado para generar slugs faltantes
- [ ] Query params `?destacada=true&limit=3` funcionan en `/api/propiedades`
- [ ] Ambos endpoints incluyen todas las relaciones necesarias:
  - `tipos_propiedad`
  - `ubicaciones`
  - `usuarios`
  - `imagenes_propiedad`
  - `operaciones_propiedad` con `tipos_operacion`
  - `propiedades_caracteristicas` con `caracteristicas` y `tipo_caracteristica`

---

## 🧪 Tests recomendados para el Backend

```bash
# Test 1: Listar propiedades
curl http://localhost:3000/api/propiedades

# Test 2: Propiedades destacadas
curl "http://localhost:3000/api/propiedades?destacada=true&limit=3"

# Test 3: Buscar por slug
curl http://localhost:3000/api/propiedades/slug/casa-3-dormitorios-nueva-cordoba-69

# Test 4: Buscar por ID (fallback)
curl http://localhost:3000/api/propiedades/69

# Test 5: Error 404 por slug inexistente
curl http://localhost:3000/api/propiedades/slug/no-existe-999

# Test 6: Error 404 por ID inexistente
curl http://localhost:3000/api/propiedades/99999
```

---

## 📞 Contacto

Si hay dudas sobre la implementación del frontend o necesitan ajustar algo en la estructura de datos, avisar.

**Prioridad ALTA:** Generar slugs para todas las propiedades existentes.
