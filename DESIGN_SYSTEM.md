# Atlas Digital Apps - Design System

## Overview
Diseño oscuro futurista minimalista inspirado en interfaces modernas de SaaS.

---

## Arquitectura y Datos

### ⚠️ IMPORTANTE: Supabase como Backend Único

**TODAS las herramientas deben usar Supabase como backend.**

Este proyecto está desplegado en **Netlify** (hosting estático), por lo tanto:
- ❌ NO usar almacenamiento local
- ❌ NO usar servidores Node.js locales
- ❌ NO usar sistemas de archivos del servidor
- ✅ SÍ usar Supabase para base de datos
- ✅ SÍ usar Supabase Storage para archivos
- ✅ SÍ procesar todo en el cliente (React)

### Configuración de Supabase
```
URL: https://bupnqihroawrvcvzpbqv.supabase.co
Ubicación: src/lib/supabase.js
```

### Patrón de Integración para Nuevas Herramientas

Cuando agregues una nueva herramienta, sigue este patrón:

1. **Crear servicio de datos** en `src/data/[nombre]Data.js`:
   ```javascript
   import { supabase, supabaseAdmin } from '../lib/supabase';
   
   // Funciones CRUD usando Supabase
   export const getData = async () => { ... }
   export const createData = async () => { ... }
   export const updateData = async () => { ... }
   export const deleteData = async () => { ... }
   ```

2. **Crear tabla en Supabase** (SQL Editor):
   - Define estructura de datos
   - Habilita RLS (Row Level Security)
   - Crea políticas de acceso públicas

3. **Crear bucket de Storage** (si necesitas archivos):
   - Público para descargas
   - Configura políticas de acceso
   - Usa `supabaseAdmin` para uploads

4. **Script de setup** en `scripts/setup-[nombre]-supabase.js`:
   - Verifica tabla existente
   - Verifica bucket
   - Muestra SQL necesario

5. **Documentación** en `[NOMBRE]_SETUP.md`:
   - Pasos de configuración
   - Estructura de datos
   - Troubleshooting

### Ejemplos Implementados
- ✅ **Marcajes App**: Tabla `marcajes_products`
- ✅ **InPage Maker**: Tabla `inpages`, Storage `inpage-images`
- ✅ **Comunicados App**: Tabla `comunicados`, Storage `comunicados-files`

---

## Color Palette

### Base Colors
```
Background:     #0a0a0f (casi negro)
Surface:        rgba(255, 255, 255, 0.03) - glass effect
Border:         rgba(255, 255, 255, 0.10)
Border Hover:   rgba(255, 255, 255, 0.30)
```

### Text Colors
```
Primary:        white / text-white
Secondary:      rgba(255, 255, 255, 0.80) / text-white/80
Muted:          rgba(255, 255, 255, 0.50) / text-white/50
Subtle:         rgba(255, 255, 255, 0.40) / text-white/40
Disabled:       rgba(255, 255, 255, 0.20) / text-white/20
```

### Accent Colors (Gradients)
```
Cyan/Blue:      rgba(56, 189, 248) → rgba(99, 102, 241)
Purple/Pink:    rgba(168, 85, 247) → rgba(236, 72, 153)
Teal/Emerald:   rgba(20, 184, 166) → rgba(16, 185, 129)
Amber/Orange:   rgba(251, 191, 36) → rgba(251, 146, 60)
Blue:           rgba(59, 130, 246) → rgba(99, 102, 241)
```

### Cursor/Highlight
```
Cyan accent:    bg-cyan-400 (para cursores y highlights)
```

---

## Animated Background

### Canvas Aurora Effect
5 blobs de gradiente radial con movimientos independientes:

1. **Blob Cyan/Indigo** (bottom center)
   - Movimiento: Horizontal principal
   - Velocidad: `time * 0.8` (X), `time * 0.5` (Y)
   - Opacity: 0.15 → 0.08

2. **Blob Purple/Pink** (top right)
   - Movimiento: Diagonal
   - Velocidad: `time * 0.6` (X), `time * 0.9` (Y)
   - Opacity: 0.10 → 0.05

3. **Blob Teal/Emerald** (left side)
   - Movimiento: Vertical principal
   - Velocidad: `time * 0.4` (X), `time * 0.7` (Y)
   - Opacity: 0.08 → 0.04

4. **Blob Amber/Orange** (bottom left)
   - Movimiento: Circular lento
   - Velocidad: `time * 0.35` (both)
   - Opacity: 0.07 → 0.03

5. **Blob Blue Central** (center floating)
   - Movimiento: Drift + pulse
   - Velocidad: `time * 0.25` (X), `time * 0.3` (Y), pulse `time * 1.5`
   - Opacity: 0.06 → 0.03

---

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Sizes (Landing Hero)
```
H1 Welcome:     text-[4rem] md:text-[7rem] lg:text-[9rem]
H2 Name:        text-[2rem] md:text-[3rem]
Subtitle:       text-xl md:text-2xl
Body:           text-sm / text-base
Small/Labels:   text-xs
```

### Weights
```
Light:          font-light (hero text)
Medium:         font-medium (buttons, labels)
```

---

## Animations

### Typewriter Effect
- Letra por letra con delays
- Cursor cyan parpadeante (530ms interval)
- Fases secuenciales para múltiples textos

```javascript
// Velocidades
Text principal: 80ms por letra
Text secundario: 100ms por letra
Delay entre fases: 200-300ms
```

### Fade In From Bottom
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: 'easeOut' }}
```

### Header Fade
```javascript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.8 }}
```

---

## Components

### Header (White Background)
```jsx
className="px-8 py-4 bg-white"
// Logo: h-5
// Separator: h-4 w-px bg-black/20
// Text: text-black/50 text-xs tracking-wider
// Nav links: text-black/40 hover:text-black/80
```

### Pill Buttons (Discrete)
```jsx
className="group flex items-center gap-3 px-5 py-3 rounded-full 
           border border-white/10 hover:border-white/30 
           hover:bg-white/5 transition-all cursor-pointer"
// Icon: text-white/50 group-hover:text-white/80
// Text: text-white/60 group-hover:text-white/90 text-sm font-medium
// Arrow: text-white/30 group-hover:text-white/60 + translate-x-1 on hover
```

### Footer (Minimal)
```jsx
className="px-8 py-6"
// Logos: brightness-0 invert opacity-20 hover:opacity-40
// Credit text: text-white/20 text-xs
```

---

## Layout Structure

```
┌─────────────────────────────────────┐
│  Header (bg-white, logo + nav)      │
├─────────────────────────────────────┤
│                                     │
│  Canvas Background (absolute)       │
│  ┌───────────────────────────────┐  │
│  │  Main Content                 │  │
│  │  - Hero Text (typewriter)     │  │
│  │  - Subtitle (fade)            │  │
│  │  - Buttons (fade)             │  │
│  └───────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│  Footer (logos + credit)            │
└─────────────────────────────────────┘
```

---

## File Structure
```
src/pages/
  LandingPage.jsx      - Home con selección de apps
  MarcajesMaker.jsx    - Herramienta de UTM tracking
  ComunicadosApp.jsx   - Generador de comunicados HTML
  
src/App.jsx            - InPage Maker (editor principal)

src/data/
  marcajesData.js      - Servicio Supabase para marcajes
  supabaseData.js      - Servicio Supabase para InPages
  comunicadosData.js   - Servicio Supabase para comunicados
  
src/lib/
  supabase.js          - Cliente Supabase configurado

scripts/
  setup-comunicados-supabase.js  - Setup de comunicados
  migrate-marcajes-to-supabase.js - Setup de marcajes
```

---

## Assets Required
```
/assets/logo-atlas.gif   - Logo animado para header
/assets/logoatlas.png    - Logo estático para footer (invertir a blanco)
/assets/logo-rojo.png    - Logo Canon para footer (invertir a blanco)
```

---

## Deployment

### Netlify Configuration
El proyecto se despliega automáticamente en Netlify desde el repositorio Git.

**Build settings:**
```
Build command: npm run build
Publish directory: dist
```

**Variables de entorno necesarias:**
- `VITE_SUPABASE_URL`: URL de Supabase
- `VITE_SUPABASE_ANON_KEY`: Anon key de Supabase
- `VITE_SUPABASE_SERVICE_KEY`: Service role key (para Storage)

### Pre-deployment Checklist
Antes de desplegar una nueva herramienta:
- [ ] Tabla creada en Supabase
- [ ] Bucket de Storage creado (si aplica)
- [ ] Políticas RLS configuradas
- [ ] Servicio de datos probado localmente
- [ ] Documentación de setup actualizada
