# Agente Frontend – Sitio Web Inmobiliaria (React + Vite)

## CONTEXTO GENERAL

Este proyecto corresponde al sitio web de una **única inmobiliaria**. Incluye:

- **Sitio público:** listado y detalle de propiedades, páginas institucionales, formulario de contacto.
- **Panel de administración:** rutas bajo `/admin` (login, layout protegido y pantallas de gestión). El detalle de auth y de cada pantalla está en el código; no asumir flujos que no existan en el repo.

Las propiedades mostradas al público provienen de datos sincronizados con un CRM (Tokko Broker) **vía backend**, no desde el navegador.

Este frontend **no implementa la sincronización con Tokko ni la lógica de negocio del CRM**; consume una API REST propia.

---

## STACK TECNOLÓGICO

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS y componentes tipo shadcn/ui
- Deploy en Vercel (típico)
- HTTP hacia un **backend propio** (Node + Express u otro; el contrato está documentado en este repo, no en el código del backend)

---

## RESPONSABILIDADES DEL FRONTEND

**Sitio público**

- Renderizar listado de propiedades y filtros asociados.
- Renderizar detalle de propiedad (ruta `/propiedad/:slug`; el segmento puede comportarse como slug o como id según la lógica documentada en `ENDPOINTS_FRONTEND.md`).
- Consumir APIs REST del backend (`VITE_API_URL`).
- Enviar formularios de contacto al backend.
- Integrar Meta Pixel (eventos según implementación actual).
- Integrar Google Analytics cuando `VITE_GA_MEASUREMENT_ID` está configurado.
- SEO básico (titles, meta description).
- UI responsive y accesibilidad básica (alt, labels, HTML semántico).

**Panel admin**

- Pantallas y flujos bajo `/admin` (ver rutas en `App.tsx`). Pueden combinar llamadas al backend y, donde aplique, cliente Supabase con claves **anon** expuestas solo en variables `VITE_*` (nunca secretos de servidor).

---

## LO QUE EL SITIO PÚBLICO NO DEBE HACER

- Consumir directamente la API de Tokko Broker.
- Incrustar claves privadas, service role o secretos de servidor.
- Sustituir al backend para sincronización, envío de emails o persistencia de negocio del CRM.

La **fuente de verdad de contratos HTTP** del listado y detalle público es el backend documentado en `ENDPOINTS_FRONTEND.md`.

---

## COMUNICACIÓN CON EL BACKEND

El frontend se comunica con **endpoints propios** (prefijo configurable con `VITE_API_URL`), por ejemplo:

- `GET /api/propiedades`
- `GET /api/propiedades/slug/:slug`
- `GET /api/propiedades/:id`
- `POST /api/contacto`
- Otros listados en `ENDPOINTS_FRONTEND.md` (tipos, ubicaciones, tipos de operación, características, etc.).

No asumir forma exacta de JSON ni campos obligatorios sin revisar `ENDPOINTS_FRONTEND.md` o el código que consume cada endpoint.

---

## VARIABLES DE ENTORNO

- Solo variables con prefijo `VITE_` (exigencia de Vite).
- No commitear valores secretos; usar `.env` local y `.env.example` como plantilla.

| Variable | Uso típico |
|----------|------------|
| `VITE_API_URL` | Base URL de la API propia (ej. `http://localhost:3000/api`). Es la variable **estándar** para el cliente HTTP del proyecto. |
| `VITE_META_PIXEL_ID` | Opcional. Si falta o está vacío, el tracking de Meta Pixel no se inicializa. |
| `VITE_GA_MEASUREMENT_ID` | Opcional. ID de medición de Google Analytics 4 (también referenciado en plantillas de HTML según la build). |
| `VITE_SUPABASE_URL` | Opcional / admin. URL del proyecto Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Opcional / admin. Clave **anon** pública de Supabase (no usar service role en el frontend). |

**Nota para agentes:** en el código puede existir uso histórico de nombres distintos (por ejemplo `VITE_API_BASE_URL` en un archivo aislado) o defaults distintos entre archivos. El estándar documentado aquí es `VITE_API_URL`. Unificar eso es deuda técnica y debe abordarse con cambios de código explícitos, no asumir variables que no aparezcan en `.env.example`.

Valores por defecto en código: muchos módulos caen en `http://localhost:3000/api` si `VITE_API_URL` no está definida; no asumir que todos los archivos usan el mismo fallback (revisar el archivo concreto si el comportamiento importa).

Plantilla recomendada: `.env.example`.

---

## FUNCIONALIDADES NO IMPLEMENTADAS (NO ASUMIR)

Salvo que exista código explícito en el repo, **no** dar por existentes:

- Chatwoot
- WhatsApp / Evolution API
- IA o chatbots
- n8n
- Integraciones no descritas en `ENDPOINTS_FRONTEND.md` o en `AGENTS.md`

No generar código para estas piezas salvo petición explícita del equipo.

---

## ENDPOINTS DEL BACKEND (RESUMEN)

- `GET /api/propiedades` (listado; acepta `?destacada=true&limit=3`, entre otros query params documentados)
- `GET /api/propiedades/slug/:slug` (detalle por slug)
- `GET /api/propiedades/:id` (detalle por id, fallback)
- `GET /api/tipos`
- `GET /api/ubicaciones/ciudades-unicas`
- `GET /api/tipos-operacion`
- `GET /api/tipos-caracteristica`
- `POST /api/contacto`

**Fuente de verdad:** `ENDPOINTS_FRONTEND.md`.

---

## RUTAS Y DETALLE DE PROPIEDAD

- En la app, la ruta declarada es **`/propiedad/:slug`** (nombre del parámetro en React Router: `slug`).
- La lógica de la página de detalle puede tratar ese segmento como **id numérico** o **slug** y llamar a los endpoints correspondientes (orden y fallback: `ENDPOINTS_FRONTEND.md`).

---

## EXPECTATIVAS AL GENERAR CÓDIGO

- Código claro; comentarios donde aporten contexto de negocio o APIs.
- Estados: loading / error / empty cuando aplique.
- Errores de red manejados de forma comprensible para el usuario.
- Componentes reutilizables; evitar sobre-ingeniería.
- Priorizar simplicidad y mantenimiento.

---

## CUÁNDO DEBE HACER PREGUNTAS

Antes de implementar, aclarar si falta definición sobre:

- Forma exacta del JSON o campos nuevos
- Qué mostrar en UI (precio, moneda, imágenes, ubicación)
- UX esperada (redirect, toast, mensajes)
- Eventos de analítica o Pixel
- Reglas de SEO específicas

---

## PRINCIPIO GUÍA

Si una funcionalidad no ayuda a mostrar propiedades, generar consultas o mejorar la experiencia del usuario (incluido el mantenimiento razonable del admin), probablemente no deba añadirse sin acuerdo explícito.

---

## NOTAS PARA AGENTES (DOCUMENTACIÓN)

- Puede haber **archivos no enlazados a rutas** o módulos poco referenciados (plantillas heredadas, páginas admin sin ruta, servicios sin imports). No asumir que todo archivo bajo `src/` está en uso hasta comprobar imports y el router.
- Para cambios que afecten contrato HTTP o variables de entorno, cruzar siempre con `ENDPOINTS_FRONTEND.md` y `.env.example`.
