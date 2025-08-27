# ---
#
# ## Dashboard
# - Muestra métricas clave: cantidad total de propiedades, en venta y en alquiler.
# - Consulta los datos en tiempo real desde Supabase.
# - Diseño responsive, limpio y accesible.
# - Código en `/src/pages/admin/Dashboard.tsx`.
#
# ## CRUD de Propiedades
# - Listado de propiedades en tabla responsive.
# - Acciones: editar, eliminar (próximamente: alta y edición con formulario, subida de imágenes).
# - Usa servicios de `/src/services/supabaseService.ts` para interactuar con la base de datos.
# - Notificaciones toast para feedback de usuario.
# - Código en `/src/pages/admin/Propiedades.tsx`.
#
# ## Cómo funciona el enrutamiento
# - El layout de admin (`AdminLayout`) contiene las rutas hijas:
#   - `/admin` → Home del panel
#   - `/admin/dashboard` → Dashboard de métricas
#   - `/admin/propiedades` → Gestión de propiedades
# - Todas las rutas están protegidas por login (ver `ProtectedRoute`).
#
# ## Ejemplo de navegación
# - Para ver el dashboard: `/admin/dashboard`
# - Para ver propiedades: `/admin/propiedades`
#
# ## Buenas prácticas
# - Mantén los componentes y servicios separados y reutilizables.
# - Usa el sistema de notificaciones para informar al usuario.
# - El código es TypeScript, modular y fácil de mantener.
# - Todo el CMS es responsive y accesible.
#
# ---
# INICIO CMS - Panel de Administración

Este CMS es un panel privado para la gestión de propiedades inmobiliarias, contactos, citas y más. Está construido con React, Vite, TypeScript y TailwindCSS, y se conecta a un backend Node.js con Prisma y Supabase (Postgres + Storage + Auth).

## Estructura del proyecto

- `/src/pages/admin/` — Páginas del panel (dashboard, login, propiedades, etc.)
- `/src/components/admin/` — Componentes de UI y layout del CMS (sidebar, navbar, layout, toast, rutas protegidas)
- `/src/services/` — Servicios para conexión con Supabase y backend
- `/src/contexts/` — Contextos globales (AuthProvider)
- `/src/hooks/` — Hooks reutilizables (ej: useToast)

## Autenticación y protección
- Todo el CMS está protegido por login de Supabase Auth (email/contraseña).
- Solo usuarios autenticados pueden acceder a `/admin`.
- El contexto de autenticación (`AuthProvider`) gestiona el usuario globalmente.
- El componente `ProtectedRoute` protege las rutas privadas.

## Layout y navegación
- El CMS tiene un layout con sidebar y navbar, responsivo y accesible.
- El sidebar permite navegar entre las secciones del panel.
- El navbar muestra el usuario logueado y permite cerrar sesión.

## Notificaciones
- El sistema de notificaciones (`ToastProvider`) permite mostrar mensajes de éxito, error e info en cualquier parte del CMS.
- Usa el hook `useToast` para disparar toasts desde tus componentes.

## Servicios y conexión
- Los servicios en `/src/services/supabaseService.ts` permiten interactuar con la base de datos y el storage de Supabase (ej: CRUD de propiedades, subida de imágenes).

## Estándares y buenas prácticas
- Código en TypeScript, limpio y comentado.
- UI consistente con Tailwind y accesible.
- Estructura modular y escalable.
- Todo el CMS es responsive (usable en desktop, tablet y móvil).

## ¿Cómo seguir?
1. Agrega nuevas páginas en `/src/pages/admin/` y rutas hijas en el layout de admin.
2. Usa los servicios y hooks para conectar con el backend y Supabase.
3. Usa el sistema de notificaciones para feedback al usuario.
4. Mantén la estructura y estilos para asegurar consistencia.

---

### Ejemplo de uso de notificaciones
```tsx
import { useToast } from '@/hooks/useToast';

const MiComponente = () => {
  const { showToast } = useToast();
  // ...
  showToast('Propiedad guardada con éxito', 'success');
};
```

---

Para dudas o mejoras, revisa los archivos de `/src/components/admin/`, `/src/contexts/` y `/src/services/`.
