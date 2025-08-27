# Rutas del Backend Requeridas para el Admin Panel

## Resumen de Endpoints Necesarios

Basándome en el frontend del admin panel, tu backend Express+Prisma necesita estos endpoints:

### 1. Tipos de Propiedad
- `GET /api/tipos` - Obtener todos los tipos
- `POST /api/tipos` - Crear nuevo tipo
- `PUT /api/tipos/:id` - Actualizar tipo
- `DELETE /api/tipos/:id` - Eliminar tipo

### 2. Ubicaciones
- `GET /api/ubicaciones` - Obtener todas las ubicaciones
- `POST /api/ubicaciones` - Crear nueva ubicación
- `PUT /api/ubicaciones/:id` - Actualizar ubicación
- `DELETE /api/ubicaciones/:id` - Eliminar ubicación

### 3. Tipos de Características
- `GET /api/tipos-caracteristica` - Obtener todos los tipos
- `POST /api/tipos-caracteristica` - Crear nuevo tipo
- `PUT /api/tipos-caracteristica/:id` - Actualizar tipo
- `DELETE /api/tipos-caracteristica/:id` - Eliminar tipo

### 4. Características
- `GET /api/caracteristicas` - Obtener todas las características
- `POST /api/caracteristicas` - Crear nueva característica
- `PUT /api/caracteristicas/:id` - Actualizar característica
- `DELETE /api/caracteristicas/:id` - Eliminar característica

### 5. Tipos de Operación (IMPORTANTE: Rutas inconsistentes corregidas)
- `GET /api/operaciones` - Obtener todos los tipos
- `POST /api/operaciones` - Crear nuevo tipo
- `PUT /api/operaciones/:id` - Actualizar tipo
- `DELETE /api/operaciones/:id` - Eliminar tipo

### 6. Propiedades
- `GET /api/propiedades` - Obtener todas las propiedades
- `POST /api/propiedades` - Crear nueva propiedad
- `PUT /api/propiedades/:id` - Actualizar propiedad
- `DELETE /api/propiedades/:id` - Eliminar propiedad

## Formato de Respuesta Esperado

El frontend ahora maneja ambos formatos:
1. **Datos directos**: `response.data` (array)
2. **Datos envueltos**: `response.data.data` (objeto con array)

Ejemplo respuesta exitosa:
```json
// Opción 1: Datos directos
[
  { "id": 1, "nombre": "Casa" },
  { "id": 2, "nombre": "Departamento" }
]

// Opción 2: Datos envueltos
{
  "success": true,
  "data": [
    { "id": 1, "nombre": "Casa" },
    { "id": 2, "nombre": "Departamento" }
  ]
}
```

## Estructura de Datos Propiedades

Según lo que vimos en la consola, las propiedades tienen esta estructura:

```typescript
interface Propiedad {
  id: number;
  titulo: string;
  descripcion?: string;
  area_construida?: number;
  area_total?: number;
  habitaciones?: number;
  banos?: number;
  garages?: number;
  direccion: string;
  estado_propiedad: 'disponible' | 'vendido' | 'alquilado' | 'reservado';
  fecha_publicacion: string;
  agente_id: number;
  tipo_propiedad_id: number;
  ubicacion_id: number;
  
  // Relaciones
  tipos_propiedad: {
    id: number;
    nombre: string;
  };
  ubicaciones: {
    id: number;
    pais: string;
    provincia: string;
    ciudad: string;
    barrio?: string;
  };
  imagenes_propiedad: Array<{
    id: number;
    url_imagen: string;
    es_principal: boolean;
    orden: number;
  }>;
  propiedades_caracteristicas: Array<{
    id: number;
    caracteristicas: {
      id: number;
      nombre: string;
    };
  }>;
  operaciones_propiedad: Array<{
    id: number;
    precio: number;
    moneda: string;
    tipos_operacion: {
      id: number;
      nombre: string;
    };
  }>;
}
```

## Cambios Realizados en el Frontend

1. **Unificación de manejo de respuestas**: Ahora maneja tanto arrays directos como datos envueltos
2. **Corrección de rutas**: Cambié `/tipos-operacion` por `/operaciones` para consistencia
3. **Actualización de interfaces**: Para coincidir con la estructura real del backend
4. **Manejo de casos null/undefined**: Para campos opcionales

## Estado Actual

✅ **Properties.tsx** - Corregido para mostrar datos del backend
✅ **TiposPropiedad.tsx** - Actualizado manejo de respuestas
✅ **TiposOperacion.tsx** - Rutas corregidas y respuestas actualizadas  
✅ **Ubicaciones.tsx** - Manejo de respuestas actualizado
✅ **Caracteristicas.tsx** - Interfaz moderna implementada
✅ **TiposCaracteristica.tsx** - Componente creado
✅ **AdminPanel.tsx** - Panel principal creado

## Próximos Pasos

1. **Verificar que tu backend tenga todas estas rutas**
2. **Probar cada endpoint individualmente**
3. **Agregar datos de prueba completos**
4. **Revisar relaciones Prisma para includes automáticos**
