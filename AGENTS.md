# Agente Frontend – Sitio Web Inmobiliaria (React + Vite)

## CONTEXTO GENERAL
Este proyecto corresponde al sitio web de una **única inmobiliaria**.
El frontend es una aplicación web pública cuyo objetivo es:
- Mostrar propiedades sincronizadas desde un CRM (Tokko Broker)
- Mostrar el detalle de cada propiedad
- Permitir a los usuarios enviar consultas mediante un formulario de contacto

Este frontend **NO maneja lógica de negocio ni integraciones externas directas**.

---

## STACK TECNOLÓGICO
- React
- TypeScript
- Vite
- Deploy en Vercel
- Comunicación vía HTTP con un backend propio (Node + Express)

---

## RESPONSABILIDADES DEL FRONTEND
- Renderizar listado de propiedades
- Renderizar páginas de detalle de propiedad (`/propiedad/:id`)
- Consumir APIs REST del backend
- Enviar formularios de contacto al backend
- Integrar Pixel de Meta (eventos: vista de propiedad, lead)
- SEO básico (titles, meta description)
- UI responsive (mobile / desktop)
- Accesibilidad básica (alt, labels, semantic HTML)

---

## LO QUE EL FRONTEND NO DEBE HACER
? Consumir directamente la API de Tokko Broker  
? Usar claves privadas o API Keys  
? Acceder directamente a la base de datos  
? Enviar emails  
? Subir imágenes a Supabase  
? Implementar lógica de sincronización  

Todo eso pertenece al backend.

---

## COMUNICACIÓN CON EL BACKEND
El frontend **solo** se comunica con endpoints propios, por ejemplo:
- GET `/api/propiedades`
- GET `/api/propiedades/:id`
- POST `/api/contacto`

El frontend **NO debe asumir la estructura interna del backend** sin confirmación.

---

## VARIABLES DE ENTORNO
- Solo se permiten variables `VITE_`
- Nunca colocar secretos
- Variable usada en el frontend: `VITE_API_URL`
- Default si no existe: `http://localhost:3000/api`

---

## FUNCIONALIDADES NO IMPLEMENTADAS (NO ASUMIR)
- Chatwoot
- WhatsApp / Evolution API
- IA o chatbots
- n8n
- Login de usuarios
- Panel administrativo

No generar código para estas funciones salvo que se solicite explícitamente.

---

## ENDPOINTS DEL BACKEND (RESUMEN)
- GET `/api/propiedades` (listado, acepta `?destacada=true&limit=3`)
- GET `/api/propiedades/slug/:slug` (detalle por slug)
- GET `/api/propiedades/:id` (detalle por ID, fallback)
- GET `/api/tipos`
- GET `/api/ubicaciones/ciudades-unicas`
- GET `/api/tipos-operacion`
- GET `/api/tipos-caracteristica`
- POST `/api/contacto`

Fuente de verdad: `ENDPOINTS_FRONTEND.md`.

---

## RUTAS Y FALLBACKS
- La ruta de detalle es `/propiedad/:id-or-slug`.
- El frontend intenta por ID si el parámetro es numérico y siempre hace fallback a slug.
- Si falta `slug`, se navega con `id` temporalmente.

---

## EXPECTATIVAS AL GENERAR CÓDIGO
- Código claro y comentado
- Manejo de estados: loading / error / empty
- Manejo de errores de red
- Componentes reutilizables
- No sobre-ingeniería
- Priorizar simplicidad y mantenimiento

---

## CUÁNDO DEBE HACER PREGUNTAS
Antes de implementar, preguntar si no está claro:
- Forma exacta del JSON de respuesta
- Qué campos mostrar (precio, moneda, imágenes, ubicación)
- Comportamiento UX esperado (redirect, toast, mensaje)
- Eventos a trackear con Meta Pixel
- Reglas de SEO específicas

---

## PRINCIPIO GUÍA
Si una funcionalidad no ayuda a:
- Mostrar propiedades
- Generar consultas
- Mejorar la experiencia del usuario

Probablemente no deba implementarse.
