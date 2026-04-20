# Canon Digital Brochure - Resumen del Proyecto

## 📋 Información General

**Ubicación Original:** `/Users/javohv/Desktop/Canon Apps/CanonDigitalBrochure/` (Next.js standalone)  
**Ubicación Integrada:** `/Users/javohv/Desktop/Canon Apps/Javo Apps/src/pages/digital-brochure-app/`  
**Estado:** ✅ Integrado en Javo Apps - Listo para Netlify  
**Tipo:** React component (adaptado de Next.js)

## 🔄 Cambios de Integración

### ✅ Lo que se hizo:
1. Código copiado de Next.js a `src/pages/digital-brochure-app/`
2. Assets copiados a `public/digital-brochure/`
3. products.json integrado en `src/pages/digital-brochure-app/data/`
4. Componente React creado en `src/pages/DigitalBrochure.jsx`
5. **Ya NO requiere servidor Next.js separado**
6. **Funciona completamente en Netlify**

## 🎨 Características

- **Diseño:** Liquid Glass premium
- **Colores:** Canon Red (#C41230), Premium Black (#1C1917)
- **Tipografía:** Bodoni Moda / Jost
- **Animaciones:** GSAP

## 📁 Estructura del Proyecto

```
CanonDigitalBrochure/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing/Home
│   │   ├── layout.tsx         # Layout principal
│   │   ├── globals.css        # Estilos globales
│   │   ├── cameras/           # Página de cámaras
│   │   ├── lenses/            # Página de lentes
│   │   ├── printers/          # Página de impresoras
│   │   ├── accessories/       # Página de accesorios
│   │   └── product/[id]/      # Detalle de producto (dinámico)
│   ├── components/ui/
│   │   ├── GlassCard.tsx
│   │   ├── ProductCard.tsx
│   │   ├── Navigation.tsx
│   │   └── CategoryHero.tsx
│   └── data/
│       └── products.json      # Datos de productos
├── scripts/
│   ├── scrape-canon.js        # Scraper de canon.cl
│   ├── scrape-chile.js
│   ├── merge-real-data.js
│   └── generate-rich-products.js
├── public/                     # Assets estáticos
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 Cómo Iniciar el Proyecto

### Opción 1: Desarrollo independiente
```bash
cd "/Users/javohv/Desktop/Canon Apps/CanonDigitalBrochure"
npm install
npm run dev
```
El brochure estará disponible en: http://localhost:3001

### Opción 2: Integrado con Javo Apps
1. Inicia el Digital Brochure (puerto 3001):
```bash
cd "/Users/javohv/Desktop/Canon Apps/CanonDigitalBrochure"
npm run dev
```

2. Inicia Javo Apps (puerto 5173):
```bash
cd "/Users/javohv/Desktop/Canon Apps/Javo Apps"
npm run dev
```

3. Accede a través de Javo Apps:
   - Ve a http://localhost:5173
   - Click en "Digital Brochure" en el menú o QuickAppMenu
   - Se mostrará en un iframe dentro de Javo Apps

## 🔗 Integración en Javo Apps

### Archivos Modificados:
1. **`src/main.jsx`** - Agregada ruta `/digital-brochure`
2. **`src/pages/LandingPage.jsx`** - Agregado al menú de navegación
3. **`src/components/QuickAppMenu.jsx`** - Agregado al menú rápido

### Archivo Nuevo:
- **`src/pages/DigitalBrochure.jsx`** - Wrapper que carga el brochure en iframe

## 📊 Datos del Proyecto

### Categories en products.json:
- **Cameras** (Cámaras)
- **Lenses** (Lentes) 
- **Printers** (Impresoras)
- **Accessories** (Accesorios)

### Estructura de Datos:
```json
{
  "brand": {
    "name": "Canon",
    "logo": "/assets/canon-logo.png"
  },
  "categories": [
    {
      "id": "cameras",
      "name": "Cámaras",
      "description": "...",
      "subcategories": [
        {
          "id": "mirrorless",
          "name": "Mirrorless",
          "products": [
            {
              "id": "eos-r5",
              "name": "EOS R5",
              "featured": true,
              "price": 4599999,
              "image": "/assets/...",
              "specs": {...}
            }
          ]
        }
      ]
    }
  ]
}
```

## 🛠️ Scripts Disponibles

### En CanonDigitalBrochure:
- `npm run dev` - Desarrollo (Next.js)
- `npm run build` - Build para producción
- `npm start` - Servidor de producción

### Scripts de scraping (en /scripts):
- `scrape-canon.js` - Scraper de productos de canon.cl
- `scrape-chile.js` - Scraper de canon chile
- `merge-real-data.js` - Merge de datos
- `generate-rich-products.js` - Generar productos enriquecidos

## 🎯 Próximos Pasos de Desarrollo

1. **Completar datos de productos** en `src/data/products.json`
2. **Agregar imágenes reales** de productos Canon
3. **Mejorar páginas de categorías** (cameras, lenses, printers, accessories)
4. **Optimizar página de detalle** de producto (`product/[id]/page.tsx`)
5. **Agregar filtros y búsqueda** de productos
6. **Implementar comparador** de productos
7. **Agregar más animaciones** GSAP
8. **SEO y metadatos** para cada página
9. **Responsive design** perfeccionamiento
10. **Deploy a Netlify** (ya tiene `netlify.toml` configurado)

## 🌐 Deploy

El proyecto está configurado para Netlify con export estático:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"
```

Para hacer deploy:
1. Push a GitHub
2. Conectar repositorio en Netlify
3. Build automático

## 📝 Notas Importantes

- **Puerto 3001:** Usar este puerto para evitar conflictos con Vite (5173)
- **Iframe sandbox:** Por seguridad, el iframe tiene restricciones controladas
- **Servidor independiente:** El brochure debe estar corriendo para verse en Javo Apps
- **TypeScript:** El proyecto usa TS, mientras Javo Apps usa JS
- **Next.js vs Vite:** Son stacks diferentes, por eso la integración vía iframe

## 🔍 Dependencias Principales

```json
{
  "next": "^16.1.6",
  "react": "18.3.1",
  "gsap": "^3.12.5",
  "tailwindcss": "^3.4.4",
  "typescript": "^5"
}
```

## 📞 Acceso Rápido

- **Javo Apps:** http://localhost:5173
- **Digital Brochure (standalone):** http://localhost:3001
- **Digital Brochure (integrado):** http://localhost:5173/digital-brochure

---

**Creado por:** javohv  
**Fecha de integración:** 31 de enero de 2026  
**Versión:** 1.0.0
