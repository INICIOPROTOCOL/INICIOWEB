# INICIOWEB
sitio web de inmbobiliaria INICIO

Aqui te dejo lo que hicimos en el backend para que leas por favor

 ACCIÓN REQUERIDA:
Actualizar todos los Link que apunten a /propiedad/${id}
Cambiar useParams().id por useParams().slug
Actualizar fetch/axios de /api/propiedades/${id} a /api/propiedades/slug/${slug}
Actualizar rutas en React Route


# 🚀 Implementación de Slugs y Propiedades Manuales

## ✅ Cambios Realizados

### 1. **Modelo de Base de Datos (`prisma/schema.prisma`)**

Se agregaron 3 campos al modelo `propiedades`:

```prisma
model propiedades {
  tokko_id    Int?      @unique  // Ahora es OPCIONAL (Int? en vez de Int)
  slug        String    @unique  // URL SEO-friendly única
  origen      String    @default("tokko") @db.VarChar(20) // 'tokko' o 'manual'
  
  // ... resto de campos
}
```

**Impacto:**
- `tokko_id`: Ya no es obligatorio, permitiendo propiedades sin ID de Tokko
- `slug`: URL amigable para SEO (ej: `1234-hermosa-casa-mendiolaza`)
- `origen`: Distingue entre propiedades de Tokko y manuales

---

### 2. **Migración de Base de Datos**

Archivo: `prisma/migrations/20251111230313_add_slug_and_origen_to_propiedades/migration.sql`

**Manejo inteligente de datos existentes:**
- Genera slugs automáticamente para las 9 propiedades existentes
- Usa formato: `{tokko_id}-{titulo-normalizado}`
- Limpia acentos y caracteres especiales
- Asigna `origen='tokko'` por defecto a propiedades existentes

---

### 3. **Servicio de Sincronización (`src/services/tokkoSyncService.js`)**

#### **Nueva función: `generarSlug()`**
```javascript
function generarSlug(titulo, tokkoId, tipo = '') {
  const baseSlug = titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Quitar acentos
    .replace(/[^a-z0-9\s-]/g, '')     // Solo letras, números, espacios y guiones
    .trim()
    .replace(/\s+/g, '-')              // Espacios a guiones
    .replace(/-+/g, '-')               // Múltiples guiones a uno
    .substring(0, 60);                 // Limitar longitud
  
  if (tokkoId) {
    return `${tokkoId}-${baseSlug}`;  // Tokko: ID-titulo
  }
  
  const timestamp = Date.now();
  return `${tipo.toLowerCase()}-${baseSlug}-${timestamp}`; // Manual: tipo-titulo-timestamp
}
```

#### **Modificación en `mapTokkoToLocal()`**
Ahora genera slug automáticamente al sincronizar:
```javascript
return {
  tokko_id: p.id,
  slug: generarSlug(titulo, p.id, tipoPropiedadNombre), // ✅ NUEVO
  origen: 'tokko',                                       // ✅ NUEVO
  titulo: titulo,
  // ... resto de campos
};
```

#### **Protección de Propiedades Manuales**
La eliminación de propiedades obsoletas ahora **EXCLUYE las manuales**:
```javascript
await prisma.propiedades.deleteMany({
  where: {
    AND: [
      { tokko_id: { notIn: idsTokko } },
      { origen: 'tokko' }  // ✅ Solo elimina propiedades de Tokko
    ]
  }
});
```

---

### 4. **Controlador de Propiedades (`src/controllers/propertyController.js`)**

#### **Nueva función auxiliar**
Se agregó `generarSlug()` (misma implementación que tokkoSyncService)

#### **Nuevo endpoint: `getPropertyBySlug()`**
```javascript
export const getPropertyBySlug = async (req, res) => {
  const { slug } = req.params;
  const propiedad = await prisma.propiedades.findUnique({
    where: { slug: slug },
    include: { /* todas las relaciones */ }
  });
  // ...
};
```

**Uso:** `GET /api/propiedades/slug/1234-hermosa-casa-mendiolaza`

#### **Modificación en `createProperty()`**
Ahora genera slug y marca origen como 'manual':
```javascript
const tipoPropiedad = await prismaTransaction.tipos_propiedad.findUnique({
  where: { id: tipo_propiedad_id }
});

const slug = generarSlug(titulo, null, tipoPropiedad?.nombre || 'propiedad');

const nuevaPropiedad = await prismaTransaction.propiedades.create({
  data: {
    slug,                 // ✅ NUEVO
    origen: 'manual',     // ✅ NUEVO
    tokko_id: null,       // ✅ NULL para propiedades manuales
    titulo,
    // ... resto de campos
  }
});
```

---

### 5. **Rutas (`src/routes/propertyRoutes.js`)**

Se agregó la nueva ruta **ANTES de `/:id`** (importante para evitar conflictos):
```javascript
// ✅ NUEVA RUTA - debe ir ANTES de /:id
router.get('/slug/:slug', getPropertyBySlug);

// Ruta existente
router.get('/:id', getPropertyById);
```

---

## 🎯 Funcionalidades Implementadas

### 1. **URLs SEO-Friendly**
✅ **Antes:** `/api/propiedades/72`  
✅ **Ahora:** `/api/propiedades/slug/1234-hermosa-casa-con-pileta-mendiolaza`

### 2. **Propiedades Manuales Protegidas**
- Al crear una propiedad manualmente: `origen='manual'`
- La sincronización de Tokko **NO las eliminará**
- Solo se eliminan propiedades con `origen='tokko'` que ya no existen en Tokko

### 3. **Compatibilidad con Propiedades Existentes**
- La migración generó slugs automáticamente para las 9 propiedades existentes
- No se perdió ningún dato en el proceso

---

## 📋 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/propiedades` | Listar todas las propiedades |
| GET | `/api/propiedades/:id` | Obtener por ID numérico |
| GET | `/api/propiedades/slug/:slug` | **NUEVO** - Obtener por slug SEO |
| POST | `/api/propiedades` | Crear propiedad manual (genera slug automático) |
| PUT | `/api/propiedades/:id` | Actualizar propiedad (preserva slug y origen) |
| DELETE | `/api/propiedades/:id` | Eliminar propiedad |

---

## 🔧 Ejemplos de Uso

### **Crear propiedad manual desde el frontend:**
```javascript
const response = await fetch('/api/propiedades', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    titulo: 'Hermosa Casa en Barrio Privado',
    descripcion: '<p>Casa con pileta y quincho</p>',
    tipo_propiedad_id: 2,  // Casa
    ubicacion_id: 5,
    agente_id: 2,
    direccion: 'Calle Falsa 123',
    habitaciones: 3,
    banos: 2,
    // ... más campos
  })
});

// Respuesta incluirá:
// {
//   id: 73,
//   slug: "casa-hermosa-casa-en-barrio-privado-1731436789123",
//   origen: "manual",
//   tokko_id: null,
//   titulo: "Hermosa Casa en Barrio Privado",
//   ...
// }
```

### **Obtener propiedad por slug (SEO):**
```javascript
const propiedad = await fetch('/api/propiedades/slug/1234-hermosa-casa-mendiolaza');
```

---

## ⚠️ Consideraciones Importantes

### **Orden de Rutas en Express**
La ruta `/slug/:slug` **DEBE IR ANTES** que `/:id`:
```javascript
router.get('/slug/:slug', getPropertyBySlug);  // ✅ Primero
router.get('/:id', getPropertyById);            // ✅ Segundo
```
Si se invierte, Express interpretará "slug" como un ID numérico.

### **Unicidad de Slugs**
- Propiedades de Tokko: `{tokko_id}-{titulo}` (garantiza unicidad por tokko_id)
- Propiedades manuales: `{tipo}-{titulo}-{timestamp}` (garantiza unicidad por timestamp)

### **Preservación de Origen**
- El endpoint `PUT /api/propiedades/:id` **NO modifica** `slug` ni `origen`
- Estos campos solo se asignan en la creación

---

## 🧪 Testing Recomendado

### **1. Verificar slugs generados automáticamente:**
```bash
npx prisma studio
```
Revisar que las 9 propiedades existentes tienen slugs válidos.

### **2. Crear propiedad manual:**
```bash
POST http://localhost:3000/api/propiedades
Content-Type: application/json

{
  "titulo": "Test Casa Manual",
  "descripcion": "Propiedad de prueba",
  "tipo_propiedad_id": 2,
  "ubicacion_id": 1,
  "agente_id": 2,
  "direccion": "Test 123"
}
```

### **3. Verificar protección en sync:**
1. Crear propiedad manual
2. Ejecutar sync de Tokko
3. Verificar que la propiedad manual sigue existiendo

### **4. Probar endpoint por slug:**
```bash
GET http://localhost:3000/api/propiedades/slug/1234-hermosa-casa-mendiolaza
```

---

## 🚀 Deploy a Railway

Los cambios ya están listos para deploy:

```bash
git add .
git commit -m "feat: add slug URLs and manual properties support"
git push origin main
```

Railway ejecutará automáticamente:
1. `npm ci --omit=dev`
2. `npx prisma generate`
3. `npx prisma migrate deploy` ← Aplicará la migración
4. `node server.js`

---

## 📊 Resumen de Cambios

| Archivo | Cambios |
|---------|---------|
| `prisma/schema.prisma` | Agregados campos `slug`, `origen`, `tokko_id?` |
| `prisma/migrations/...` | Migración con generación automática de slugs |
| `src/services/tokkoSyncService.js` | Función `generarSlug()`, protección de manuales |
| `src/controllers/propertyController.js` | Nuevo `getPropertyBySlug()`, slug en `createProperty()` |
| `src/routes/propertyRoutes.js` | Nueva ruta `/slug/:slug` |

---

## ✅ Checklist de Implementación

- [x] Modificar `schema.prisma` con nuevos campos
- [x] Crear migración con generación automática de slugs
- [x] Agregar función `generarSlug()` en `tokkoSyncService.js`
- [x] Actualizar `mapTokkoToLocal()` con slug y origen
- [x] Proteger propiedades manuales en eliminación de sync
- [x] Agregar `generarSlug()` en `propertyController.js`
- [x] Crear endpoint `getPropertyBySlug()`
- [x] Modificar `createProperty()` para manuales
- [x] Agregar ruta `/slug/:slug` en `propertyRoutes.js`
- [x] Aplicar migración a la base de datos
- [x] Verificar servidor funciona correctamente
- [ ] Testing en desarrollo
- [ ] Deploy a Railway
- [ ] Actualizar frontend para usar slugs

---

**Fecha de implementación:** 11 de Noviembre de 2025  
**Versión:** 2.0.0 - Slugs y Propiedades Manuales





ambio Principal: URLs ahora usan SLUG en lugar de ID
El backend ahora genera URLs SEO-friendly usando slugs únicos para cada propiedad.

✅ CAMBIOS NECESARIOS EN EL FRONTEND:
 Endpoint de detalle de propiedad
 GET /api/propiedades/slug/${slug}
 Mantener compatibilidad con ID (opcional):
 GET /api/propiedades/${id}  // Sigue funcionandoEstructura de datos de propiedad
Cada propiedad ahora incluye estos campos nuevos:
{
  id: 72,                           // ID interno (no usar en URLs)
  tokko_id: 12345,                  // ID de Tokko (puede ser null)
  slug: "12345-casa-mendiolaza",    // ✅ USAR ESTE EN URLs
  origen: "tokko",                  // "tokko" o "manual"
  titulo: "Casa en Mendiolaza",
  destacada: false,                 // ✅ NUEVO campo booleano
  // ...resto de campos
}
Actualizar rutas de navegación


Ejemplos de slugs generados

// Propiedades de Tokko (usan tokko_id como prefijo)
"12345-hermosa-casa-con-pileta-mendiolaza"
"12346-lote-en-san-alfonso-del-talar"
"12347-departamento-en-nueva-cordoba"

// Propiedades manuales (usan tipo + timestamp)
"casa-propiedad-exclusiva-inicio-1731012345678"
"lote-terreno-villa-allende-1731012400000"

Campo destacada para filt
// Filtrar propiedades destacadas en el frontend
const destacadas = propiedades.filter(p => p.destacada === true);

// O hacer query al backend (si implementamos endpoint)
GET /api/propiedades?destacada=true

RESUMEN DE CAMBIOS:
Antes	Ahora
GET /api/propiedades/72	GET /api/propiedades/slug/12345-casa-mendiolaza
navigate(/propiedad/${id})	navigate(/propiedad/${slug})
useParams().id	useParams().slug
Sin campo destacada	Campo destacada booleano disponible
Sin campo origen	Campo origen ("tokko" o "manual")
✅ BENEFICIOS:
🔍 SEO mejorado: URLs descriptivas indexadas por Google
🔒 Más seguro: No expone IDs internos
📌 Estable: URLs no cambian aunque se re-sincronice
🎯 UX mejorada: URLs legibles para usuarios
⭐ Destacadas: Ahora pueden filtrar/marcar propiedades destacadas