# Guía para Crear Detalles de Producto - Digital Brochure Canon

Esta guía documenta el proceso completo para agregar un nuevo producto al Digital Brochure con página de detalle completa.

## 📁 Estructura de Archivos

```
src/
├── data/
│   └── productDetails.js    # Datos de todos los productos
├── pages/
│   └── ProductDetail.jsx    # Componente de visualización
└── components/
    └── ...                  # Componentes reutilizables

scripts/
├── organize-all-buckets.cjs # Organización de buckets
├── download-r50-lifestyle.cjs # Descarga de imágenes
└── ...

docs/
└── GUIA_DETALLE_PRODUCTO.md # Esta guía
```

---

## 🗂️ Estructura del Bucket (Supabase Storage)

Cada producto tiene su propia carpeta en el bucket `brochure_products` con la siguiente estructura:

```
brochure_products/
└── [producto-slug]/           # Ej: eos-r50, eos-r10
    ├── common/                # Imágenes del body (compartidas entre kits)
    │   ├── top-black.png
    │   ├── top-white.png
    │   ├── bottom-black.png
    │   ├── back-black.png
    │   └── ...
    ├── kit-[nombre]/          # Una carpeta por cada kit
    │   ├── 0.png              # Imagen principal del kit
    │   ├── front.png
    │   ├── left.png
    │   ├── screen.png
    │   └── ...
    ├── lifestyle/             # Imágenes de uso/estilo de vida
    │   ├── vlogger.jpg
    │   ├── photographer.jpg
    │   └── ...
    ├── usage/                 # Imágenes de uso para feature grids (NUEVO)
    │   ├── vlogger-companion.jpg
    │   ├── human-detection.jpg
    │   ├── animal-detection.jpg
    │   └── ...
    └── samples/               # Fotos de muestra tomadas con el producto
        ├── sample-portrait.jpg
        ├── sample-landscape.jpg
        └── ...
```

### Nomenclatura de Kits

| Tipo de Kit | Carpeta |
|-------------|---------|
| Solo cuerpo | `body-only/` |
| Kit 18-45mm negro | `kit-18-45-black/` |
| Kit 18-45mm blanco | `kit-18-45-white/` |
| Kit 18-150mm | `kit-18-150/` |
| Kit doble lente | `kit-double-lens/` |
| Kit content creator | `kit-content-creator/` |
| Kit zoom | `kit-zoom/` |
| Reacondicionado | `kit-[nombre]-refurbished/` |

---

## 🖼️ Obtención de Imágenes

### Fuentes de Imágenes

1. **Canon Asia** (Recomendado) - https://asia.canon/en/consumer/
   - Alta calidad
   - Acceso público
   - URLs estables

2. **Canon Latinoamérica** - https://www.usa.canon.com/
   - Imágenes en español
   - Algunas restricciones de acceso

3. **Scene7 CDN** (Cuidado con resolución)
   - Servidor: `s7d1.scene7.com/is/image/`
   - **Requiere parámetros de resolución**

### Resolución de Imágenes Scene7

Scene7 permite controlar la resolución con el parámetro `wid`:

```
# Miniatura (evitar)
https://s7d1.scene7.com/is/image/canon/eos-r50-black?wid=200

# Resolución Media (RECOMENDADA PARA WEB)
https://s7d1.scene7.com/is/image/canon/eos-r50-black?wid=600

# Resolución Alta (para zoom/detalles)
https://s7d1.scene7.com/is/image/canon/eos-r50-black?wid=1200

# Resolución Original (puede ser muy pesada)
https://s7d1.scene7.com/is/image/canon/eos-r50-black
```

**⚠️ IMPORTANTE:** Siempre usar `?wid=600` o `?wid=1200` para evitar imágenes pixeladas.

### Descarga de Imágenes de Canon Asia

Las URLs de Canon Asia siguen este patrón:

```
https://asia.canon/media/image/[YYYY]/[MM]/[DD]/[UUID]_[nombre].png
```

Ejemplo:
```
https://asia.canon/media/image/2023/02/06/aa40086891434857aa3e5c6465f427a0_EOS+R50+Black+Front+Slant+Left.png
```

Para descargar y subir al bucket, usar el script `download-r50-lifestyle.cjs` como plantilla:

```javascript
// Definir imágenes a descargar
const IMAGES = [
  {
    url: 'https://asia.canon/media/image/.../imagen.png',
    folder: 'lifestyle',   // Carpeta destino en el bucket
    name: 'vlogger.jpg'    // Nombre final del archivo
  }
];
```

---

## 📝 Estructura de Datos del Producto

El archivo `src/data/productDetails.js` contiene todos los datos de productos. Cada producto tiene la siguiente estructura:

```javascript
export const productDetails = {
  'slug-del-producto': {
    // === INFORMACIÓN BÁSICA ===
    id: 'slug-del-producto',
    name: 'Nombre del Producto',
    tagline: 'Slogan corto',
    category: 'Cámaras', // o 'Lentes', 'Impresoras', etc.
    description: 'Descripción completa del producto...',

    // === IMÁGENES ===
    images: {
      hero: 'URL_imagen_principal',
      angles: [
        { src: 'URL', alt: 'Descripción' },
        // ... más ángulos
      ],
      white: [ /* variante blanca si existe */ ],
      lifestyle: [ /* imágenes de uso */ ]
    },

    // === CARACTERÍSTICAS CLAVE ===
    keyFeatures: [
      {
        title: '24.2MP APS-C',
        subtitle: 'Sensor CMOS',
        icon: 'sensor'
      },
      // ... más características
    ],

    // === SECCIONES DE CONTENIDO ===
    sections: [
      // Ver tipos de secciones abajo
    ],

    // === ESPECIFICACIONES ===
    specifications: {
      'Sensor': {
        'Tipo': 'APS-C CMOS',
        'Megapíxeles': '24.2 MP'
      },
      // ... más categorías
    },

    // === RECURSOS ===
    resources: {
      photoLibrary: { url: '...', description: '...' },
      links: { /* enlaces oficiales */ }
    },

    // === KITS DISPONIBLES (NUEVO) ===
    kits: [
      {
        type: 'LENS_KIT',           // Tipo: LENS_KIT, BODY_ONLY, CONTENT_CREATOR, ZOOM_KIT
        description: 'Negra + RF-S 18-45mm',
        url: 'URL_canontienda',     // Enlace directo a Canon Tienda
        image: 'URL_imagen_kit'     // Imagen del kit desde el bucket
      },
      // ... más kits
    ]
  }
};
```

---

## 🛒 Sistema de Kits Disponibles

El dropdown "Kits Disponibles" aparece junto al botón "Descargar Fotos HD" cuando el producto tiene un array `kits` definido.

### Estructura del Kit

```javascript
kits: [
  {
    type: 'LENS_KIT',
    description: 'Negra + RF-S 18-45mm',
    url: 'https://www.canontiendaonline.cl/es_cl/p/eos-r50-rf-s-18-45mm',
    image: 'https://...supabase.../eos-r50/kit-18-45-black/0.png'
  },
  {
    type: 'LENS_KIT',
    description: 'Blanca + RF-S 18-45mm',
    url: 'https://www.canontiendaonline.cl/es_cl/p/eos-r50-rf-s-18-45mm?color=White',
    image: 'https://...supabase.../eos-r50/kit-18-45-white/0.png'
  },
  {
    type: 'CONTENT_CREATOR',
    description: 'Content Creator Kit',
    url: 'https://www.canontiendaonline.cl/es_cl/p/eos-r50-content-creator-kit',
    image: 'https://...supabase.../eos-r50/kit-content-creator/0.png'
  }
]
```

### Tipos de Kits Soportados

| Tipo | Descripción |
|------|-------------|
| `BODY_ONLY` | Solo cuerpo de cámara |
| `LENS_KIT` | Cámara + lente |
| `CONTENT_CREATOR` | Kit para creadores de contenido |
| `ZOOM_KIT` | Kit con lente zoom |

### URL de Canon Tienda

Las URLs siguen el patrón:
```
https://www.canontiendaonline.cl/es_cl/p/[slug-producto]
```

Para variantes de color, agregar parámetro:
```
?color=White
?color=Black
```

---

## 🧩 Tipos de Secciones

### 1. Hero Section
Banner grande con título y descripción.

```javascript
{
  type: 'hero_section',
  id: 'unique-id',
  title: 'Título Principal',
  subtitle: 'Subtítulo',
  description: 'Descripción detallada...',
  image: 'URL_imagen_fondo', // Opcional
  gradient: 'from-red-600 to-rose-800'
}
```

### 2. Image + Text
Imagen con texto a un lado.

```javascript
{
  type: 'image_text',
  id: 'unique-id',
  layout: 'image_left', // o 'text_right'
  title: 'Título',
  description: 'Descripción...',
  image: 'URL_imagen'
}
```

### 3. Feature Grid
Cuadrícula de características con iconos e imágenes.

```javascript
{
  type: 'feature_grid',
  id: 'unique-id',
  columns: 4, // 2, 3 o 4
  features: [
    {
      title: 'Título',
      description: 'Descripción...',
      icon: 'nombre_icono',
      image: 'URL_imagen' // REQUERIDO para consistencia visual
    },
    // ... más features
  ]
}
```

**⚠️ IMPORTANTE:** Todas las features en un feature_grid deben tener imagen. Si no existe una imagen de apoyo visual para una característica específica, **no incluirla** en el grid. Esto mantiene la consistencia visual y evita que algunas features se vean incompletas comparadas con otras.

Las imágenes se obtienen de la carpeta `usage/` del bucket del producto.

### 4. Video
Video de YouTube embebido.

```javascript
{
  type: 'video',
  id: 'unique-id',
  title: 'Título del Video',
  youtubeId: 'VIDEO_ID',
  description: 'Descripción opcional'
}
```

### 5. Gallery
Galería de imágenes de muestra.

```javascript
{
  type: 'gallery',
  id: 'unique-id',
  title: 'Galería',
  images: [
    {
      src: 'URL_imagen',
      caption: 'Descripción técnica',
      settings: 'f/2.8, 1/250s, ISO 400'
    }
  ]
}
```

### 6. Connectivity
Iconos de conectividad.

```javascript
{
  type: 'connectivity',
  id: 'unique-id',
  title: 'Conectividad',
  items: [
    { name: 'Wi-Fi 2.4 GHz', icon: 'wifi' },
    { name: 'USB-C', icon: 'usb' },
    { name: 'Bluetooth 4.2', icon: 'bluetooth' }
  ]
}
```

---

## 🎨 Iconos Disponibles

```javascript
const ICONS = {
  // Producto
  'sensor', 'video', 'speed', 'focus', 'weight', 'quality',
  
  // Características
  'zoom', 'slowmo', 'stabilization', 'stream', 'vertical',
  'aspect', 'hybrid', 'breathing', 'hdr', 'panning',
  'panorama', 'teleconverter', 'auto',
  
  // Detección
  'human', 'animal', 'vehicle',
  
  // Diseño
  'flash', 'evf', 'lcd', 'shoe',
  
  // Conectividad
  'wifi', 'usb', 'bluetooth', 'cloud'
};
```

---

## 🔄 Proceso Paso a Paso

### 1. Preparar el Bucket

```bash
# Si es un producto nuevo, agregar al script organize-all-buckets.cjs
# y ejecutar:
node scripts/organize-all-buckets.cjs [slug-producto]
```

### 2. Descargar Imágenes

1. Buscar imágenes en Canon Asia o fuente oficial
2. Copiar URLs de imágenes (verificar resolución)
3. Crear script de descarga basado en `download-r50-lifestyle.cjs`
4. Ejecutar descarga

### 3. Crear Datos del Producto

1. Abrir `src/data/productDetails.js`
2. Copiar estructura de un producto existente (ej: `eos-r50`)
3. Modificar todos los campos con información del nuevo producto
4. Actualizar URLs de imágenes apuntando al bucket

### 4. Verificar

```bash
# Iniciar servidor de desarrollo
npm run dev

# Navegar a:
# http://localhost:5173/product/[slug-producto]
```

---

## 📋 Checklist de Contenido

### Imágenes Mínimas Requeridas

- [ ] Hero image (imagen principal)
- [ ] 4-6 ángulos del producto (front, left, right, back, top, bottom)
- [ ] 2-3 imágenes de lifestyle/uso
- [ ] 1 imagen por cada sección image_text
- [ ] Imágenes para feature grids (opcional pero recomendado)

### Imágenes de Uso para Feature Grids

**⚠️ REGLA:** Todas las features en un grid DEBEN tener imagen. Si no hay imagen disponible para una característica, no incluirla.

Imágenes recomendadas para la carpeta `usage/`:

```
usage/
├── vlogger-companion.jpg    # Para sección de vlogging
├── closeup-mode.jpg         # Modo primer plano
├── slowmo-recording.jpg     # Cámara lenta
├── streaming-ready.jpg      # Streaming
├── human-detection.jpg      # Detección de personas
├── animal-detection.jpg     # Detección de animales
├── vehicle-detection.jpg    # Detección de vehículos
├── built-in-flash.jpg       # Flash incorporado
├── evf.jpg                  # Visor electrónico
└── ...
```

**Características excluidas por falta de imagen:**
- Modo Auto Híbrido
- Corrección de Respiración
- A+ Avanzado

Estas features no se incluyen porque no tienen imagen de apoyo visual.

### Secciones Recomendadas

- [ ] Hero section principal
- [ ] 2-3 secciones temáticas (Video, Fotografía, Diseño, etc.)
- [ ] Feature grids para cada sección (con imágenes de apoyo)
- [ ] Al menos 1 video de YouTube
- [ ] Especificaciones técnicas completas
- [ ] Enlaces a recursos oficiales
- [ ] Array de kits con links a Canon Tienda (si aplica)

### Textos

- [ ] Todos los textos en español
- [ ] Descripciones concisas pero informativas
- [ ] Beneficios orientados al usuario, no solo specs técnicas

---

## 🛠️ Scripts Útiles

| Script | Descripción |
|--------|-------------|
| `organize-all-buckets.cjs` | Reorganiza estructura de buckets |
| `download-r50-lifestyle.cjs` | Plantilla para descargar imágenes lifestyle |
| `download-r50-usage-images.cjs` | Descarga imágenes de uso para feature grids |
| `verify-eos-r50-bucket.cjs` | Verifica contenido del bucket |

---

## 📌 URLs del Proyecto

- **Supabase Dashboard:** https://supabase.com/dashboard/project/bupnqihroawrvcvzpbqv
- **Bucket Storage:** brochure_products
- **Tabla Productos:** normalized_products
- **Canon Asia:** https://asia.canon/en/consumer/

---

## Ejemplo Completo: EOS R50

Ver archivo `src/data/productDetails.js` sección `'eos-r50'` para un ejemplo completo de implementación con:

- 25+ imágenes en bucket (incluyendo carpeta usage/)
- 5 key features
- 12+ secciones de contenido
- Feature grids con imágenes de apoyo visual
- 6 kits disponibles con links a Canon Tienda
- Especificaciones completas
- Recursos y enlaces

### Funcionalidades del ProductDetail

La página de detalle de producto incluye:

1. **Header con acciones:**
   - Botón "Descargar Fotos HD" - Descarga ZIP con imágenes del producto
   - Dropdown "Kits Disponibles" - Lista de kits con links a Canon Tienda

2. **Galería de imágenes:**
   - Navegación por ángulos del producto
   - Selector de color (si hay variantes)
   - **Botones de edición de imágenes** (ver sección Edición en Vivo)

3. **Secciones de contenido:**
   - Hero sections con gradientes
   - Feature grids con iconos e imágenes
   - Secciones image+text
   - Videos embebidos
   - Galerías de fotos de muestra

4. **Especificaciones técnicas:**
   - Organizadas por categorías
   - Formato acordeón expandible

5. **Herramientas de edición:** (NUEVO)
   - Editor de imágenes del producto
   - Editor de textos con formato

---

## ✏️ Edición en Vivo de Productos

La página de detalle de producto incluye herramientas de edición que permiten modificar imágenes y textos directamente desde la interfaz.

### Edición de Imágenes

El botón **"Editar Fotos"** en la galería de imágenes abre un modal donde puedes:

1. **Editar imágenes existentes:**
   - Modificar URL de la imagen
   - Cambiar el texto alternativo (alt)
   - Reordenar imágenes
   - Eliminar imágenes

2. **Agregar nuevas imágenes por URL:**
   - Pegar URL de imagen externa
   - Agregar texto alternativo
   - La imagen se agrega al final de la lista

3. **Subir archivos de imagen:**
   - Soporta JPG, PNG, WebP (máx. 10MB)
   - Las imágenes se guardan en el bucket `brochure-images` de Supabase
   - Se genera automáticamente una URL pública

#### Tipos de imágenes editables:
- **angles**: Imágenes principales del producto (versión negra)
- **white**: Imágenes de la versión blanca (si existe)
- **lifestyle**: Imágenes de estilo de vida

#### Bucket de almacenamiento:
Las imágenes subidas se guardan en:
```
brochure-images/
└── products/
    └── [product-id]/
        └── [timestamp]-[nombre].ext
```

### Edición de Textos

El botón **"Editar Textos"** en el área de información del producto abre un editor con tres pestañas:

#### 1. Información Básica
- **Nombre del producto**: Título principal
- **Tagline**: Eslogan o frase corta
- **Descripción**: Texto descriptivo con soporte de formato

#### 2. Características Clave
- Editar título y subtítulo de cada característica
- Las características aparecen en el hero del producto

#### 3. Secciones de Contenido
- Editar textos de todas las secciones:
  - Hero sections (título, subtítulo, descripción)
  - Image+text sections (título, descripción)
  - Feature grids (título y descripción de cada feature)
  - Videos (título, descripción)
  - Connectivity (título)

#### Formato de texto disponible:
- **Negrita** (Ctrl+B)
- *Cursiva* (Ctrl+I)
- Subrayado (Ctrl+U)
- Listas con viñetas
- Alineación izquierda/centro
- Deshacer/Rehacer

### Comportamiento de guardado

Al hacer clic en **"Guardar Cambios"**:

1. Se actualiza el estado local del componente
2. Se actualiza el objeto global `productDetails` para persistencia durante la sesión
3. Los cambios se reflejan inmediatamente en la interfaz

**⚠️ IMPORTANTE:** Los cambios se mantienen solo durante la sesión actual. Para persistir permanentemente los cambios:
- Editar el archivo de datos del producto correspondiente
- O implementar guardado en base de datos Supabase

### Componentes involucrados

```
src/components/
├── ProductImageEditor.jsx   # Editor de imágenes
└── ProductTextEditor.jsx    # Editor de textos

src/lib/
└── supabase.js              # Cliente Supabase para uploads
```

### Ejemplo de uso

1. Navegar a `/digital-brochure/cameras/eos-r50`
2. En la galería, hacer clic en **"Editar Fotos"**
3. Agregar/editar imágenes según necesidad
4. Hacer clic en **"Guardar Cambios"**
5. Verificar que las imágenes se actualizaron

Para textos:
1. Hacer clic en **"Editar Textos"** 
2. Modificar información básica, características o secciones
3. Usar la barra de herramientas para agregar formato
4. Hacer clic en **"Guardar Cambios"**

---

## Notas Adicionales

### Gradientes Recomendados por Categoría

```javascript
// Cámaras mirrorless entry
'from-red-600 to-rose-800'      // Rojo Canon

// Cámaras profesionales
'from-slate-700 to-zinc-900'    // Negro elegante

// Video/Vlogging
'from-amber-500 to-orange-700'  // Naranja energético

// Fotografía
'from-blue-600 to-indigo-800'   // Azul profesional

// Diseño/Tecnología
'from-emerald-600 to-teal-800'  // Verde tecnológico
```

### Resolución de Imágenes Recomendada

| Uso | Resolución | Formato |
|-----|------------|---------|
| Hero | 1200x800 px | JPG/PNG |
| Ángulos producto | 800x800 px | PNG (fondo transparente) |
| Lifestyle | 1200x800 px | JPG |
| Samples | 1600x1200 px | JPG |
| Thumbnails | 400x400 px | PNG |
