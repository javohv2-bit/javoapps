# 📸 Guía Completa: Creación de Detalle de Producto Canon

> **Documento de referencia para crear páginas de detalle de producto en el Digital Brochure**
> 
> Esta guía detalla el proceso paso a paso para replicar exactamente el contenido y las imágenes de Canon Asia en nuestro sistema.

---

## 🚀 MÉTODO RECOMENDADO: Scraping Automatizado

**NUEVO**: Usa el script de scraping automatizado para extraer todas las imágenes de un producto:

```bash
# Desde la carpeta del proyecto
node scripts/scrape-canon-product.cjs "URL_CANON_ASIA" nombre-producto
```

**Ejemplo:**
```bash
node scripts/scrape-canon-product.cjs "https://asia.canon/en/consumer/eos-r8/body/product" eos-r8
```

**El script genera:**
1. `scripts/scraped-[producto].json` - JSON con todas las imágenes clasificadas
2. `src/data/products/[producto].js` - Template inicial del producto

**Para ver los resultados:**
```bash
# Ver features extraídas
node -e "const d = require('./scripts/scraped-eos-r8.json'); d.images.features.forEach((f,i) => console.log(i+1, f.name, f.url));"

# Ver ángulos del producto
node -e "const d = require('./scripts/scraped-eos-r8.json'); d.images.angles.filter(a => a.label.toLowerCase().includes('r8')).forEach((a,i) => console.log(i+1, a.label));"

# Ver galería
node -e "const d = require('./scripts/scraped-eos-r8.json'); d.images.gallery.forEach((g,i) => console.log(i+1, g));"
```

**Después del scraping:**
1. Revisar el JSON generado para organizar las imágenes
2. Editar el archivo de producto para traducir al español
3. Organizar las secciones según el diseño deseado
4. Registrar en `src/data/products/index.js`

### ⚠️ REGLAS CRÍTICAS POST-SCRAPING

**🚨 NUNCA INVENTES URLs DE IMÁGENES - SOLO USA LAS DEL JSON SCRAPEADO**

1. **OBLIGATORIO: Usar SOLO imágenes del JSON scrapeado**
   - ❌ **NUNCA** crear URLs inventadas como `R6+Mark+II+-+Impressive+Details`
   - ✅ **SIEMPRE** copiar URLs exactas del array `images.features` del JSON
   - ✅ Verificar que cada URL existe en el JSON antes de usarla

2. **Mapeo correcto de imágenes de features:**
   ```javascript
   // ❌ INCORRECTO - URL inventada
   image: 'https://asia.canon/media/image/2022/11/17/INVENTADA_R6+Mark+II+-+Feature.png'
   
   // ✅ CORRECTO - URL del JSON scraped
   image: 'https://asia.canon/media/image/2022/10/31/c33fbdc304ac4c2e8f35f2c54b659a1e_EOS+R6+Mark+II+24.2-megapixel+CMOS+full-frame+sensor.png'
   ```

3. **Proceso para asignar imágenes a features:**
   ```bash
   # 1. Listar todas las features scrapeadas
   node -e "const d = require('./scripts/scraped-[producto].json'); d.images.features.forEach((f,i) => console.log(i, f.name, '→', f.url));"
   
   # 2. Identificar qué imagen corresponde a cada sección del website
   # 3. Copiar la URL EXACTA del JSON al archivo del producto
   # 4. NUNCA modificar o inventar el nombre del archivo en la URL
   ```

4. **SIEMPRE usar imagen con lente como hero** - Las cámaras deben mostrar lente en la foto principal

5. **Reorganizar ángulos**: Las primeras 3 imágenes deben ser CON LENTE

6. **Filtrar imágenes del modelo correcto** - El scraper puede capturar imágenes de productos relacionados

7. **Cada feature usa UNA imagen única** - No repetir imágenes entre secciones

8. **Verificar URLs antes de committing** - Testear que las imágenes cargan correctamente

### 🚨 PROPIEDADES OBLIGATORIAS

El archivo de producto **DEBE** incluir estas propiedades o causará errores en ProductDetail.jsx:

```javascript
// ❌ INCORRECTO - Causará error
specs: { ... }

// ✅ CORRECTO - Usar "specifications" con formato específico
specifications: {
    'Sensor': {
        'Tipo': 'Full-Frame CMOS',
        'Megapíxeles efectivos': 'Aprox. 24.2 MP',
        // ... más specs
    },
    'Video': { ... },
    'Enfoque': { ... },
    'Disparo': { ... },
    'Visor y Pantalla': { ... },
    'Físico': { ... }
}

// ❌ INCORRECTO - Causará error
canonUrl: 'https://...'

// ✅ CORRECTO - Usar "externalLinks" con estructura completa
externalLinks: {
    officialPage: 'https://asia.canon/en/consumer/[producto]/body/product',
    photoLibrary: 'https://asia.canon/en/consumer/[producto]/body/photos',
    support: 'https://asia.canon/en/support/[PRODUCTO]/model'
}

// ✅ OPCIONAL pero RECOMENDADO - Botón de descarga de fotos HD
downloads: {
    allImages: {
        url: 'https://asia.canon/en/consumer/[producto]/body/photos', // URL de Photo Library
        size: '11.71 MB', // Tamaño aproximado (opcional)
        label: 'Todas las imágenes (Photo Library)'
    },
    individual: [] // Array vacío o con URLs individuales
}
```

### 📋 CHECKLIST PROPIEDADES OBLIGATORIAS

Antes de registrar un producto, verificar que tenga:

| Propiedad | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | ✅ | ID único (ej: 'eos-r8') |
| `name` | string | ✅ | Nombre del producto |
| `tagline` | string | ✅ | Eslogan corto |
| `category` | string | ✅ | 'cameras', 'printers', 'lenses', 'accessories' |
| `description` | string | ✅ | Descripción larga |
| `images.hero` | string | ✅ | URL imagen principal (CON LENTE) |
| `images.angles` | array | ✅ | Array de {src, label} |
| `keyFeatures` | array | ✅ | Array de {icon, title, description} |
| `sections` | array | ✅ | Secciones de contenido |
| `specifications` | object | ✅ | **NO usar 'specs'** - Formato con categorías en español |
| `externalLinks` | object | ✅ | **Obligatorio** - {officialPage, photoLibrary, support} |
| `downloads` | object | ⭐ | **Recomendado** - Habilita botón "Descargar Fotos HD" |

---

## 📋 Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Estructura de URLs](#estructura-de-urls)
3. [Prerrequisitos](#prerrequisitos)
4. [Paso 1: Identificar URLs Fuente](#paso-1-identificar-urls-fuente)
5. [Paso 2: Extraer TODAS las Imágenes](#paso-2-extraer-todas-las-imágenes)
6. [Paso 3: Mapear Contenido por Secciones](#paso-3-mapear-contenido-por-secciones)
7. [Paso 4: Crear Archivo Individual de Producto](#paso-4-crear-archivo-individual-de-producto)
8. [Paso 5: Registrar en el Índice](#paso-5-registrar-en-el-índice)
9. [Paso 6: Verificación y QA](#paso-6-verificación-y-qa)
10. [Anexo: Patrones de URLs de Canon Asia](#anexo-patrones-de-urls-de-canon-asia)
11. [Checklist Final](#checklist-final)

---

## 📥 Botón "Descargar Fotos HD"

### ¿Qué es?

El botón "Descargar Fotos HD" aparece en la sección hero del detalle de producto y permite a los usuarios acceder a la Photo Library oficial de Canon Asia para descargar imágenes en alta resolución.

![Botón Descargar Fotos HD](https://via.placeholder.com/400x60?text=Descargar+Fotos+HD)

### ¿Cómo se implementa?

Se requiere agregar la propiedad `downloads` al archivo de producto:

```javascript
// Descargas - Habilita botón "Descargar Fotos HD"
downloads: {
    allImages: {
        url: 'https://asia.canon/en/consumer/[producto]/[variant]/photos',
        size: '11.71 MB', // Opcional - tamaño aproximado
        label: 'Todas las imágenes (Photo Library)'
    },
    individual: [] // Reservado para descargas individuales futuras
}
```

### ¿Dónde obtener la URL?

1. Ir a la página del producto en Canon Asia
2. Buscar la pestaña **"Photo Library"** o **"Photos"**
3. Copiar la URL de esa página

**Patrón de URL:**
```
https://asia.canon/en/consumer/[producto]/[variant]/photos
```

**Ejemplos:**
| Producto | URL Photo Library |
|----------|-------------------|
| EOS R50 | `https://asia.canon/en/consumer/eos-r50/body/photos` |
| EOS R100 | `https://asia.canon/en/consumer/eos-r100/rf-s18-45mm-f-4-5-6-3-is-stm/photos` |
| EOS R8 | `https://asia.canon/en/consumer/eos-r8/body/photos` |
| EOS R10 | `https://asia.canon/en/consumer/eos-r10/body/photos` |

### ¿Es obligatorio?

**No**, pero es **altamente recomendado** porque:
- Mejora la experiencia del usuario
- Permite acceso a imágenes oficiales de alta calidad
- Es útil para distribuidores y medios

### Lógica en ProductDetail.jsx

El botón solo aparece si existe la propiedad `downloads`:

```jsx
{product.downloads && (
    <a
        href={product.downloads.allImages?.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/20..."
    >
        <Download size={18} />
        Descargar Fotos HD
    </a>
)}
```

---

## Arquitectura del Sistema

### Estructura de Archivos de Productos

Los productos se organizan en **archivos individuales** para mantener el código modular y escalable:

```
src/data/products/
├── index.js          # Archivo índice que agrega todos los productos
├── eos-r50.js        # Producto individual
├── eos-r10.js        # Producto individual
├── eos-rp.js         # Producto individual
└── [nuevo-producto].js
```

### ¿Por qué archivos individuales?

1. **Escalabilidad**: Un archivo monolítico se vuelve inmanejable con muchos productos
2. **Mantenibilidad**: Fácil de editar un producto sin afectar otros
3. **Versionamiento**: Git trackea cambios de forma más clara
4. **Carga**: Posibilidad futura de lazy-loading por producto

---

## Estructura de URLs

### URLs del Digital Brochure

El sistema usa **rutas basadas en categorías**:

| Ruta | Descripción |
|------|-------------|
| `/digital-brochure` | Página principal del catálogo |
| `/digital-brochure/cameras` | Catálogo filtrado por cámaras |
| `/digital-brochure/printers` | Catálogo filtrado por impresoras |
| `/digital-brochure/lenses` | Catálogo filtrado por lentes |
| `/digital-brochure/accessories` | Catálogo filtrado por accesorios |
| `/digital-brochure/:category/:productId` | Detalle de producto |

### Ejemplos de URLs de producto

```
/digital-brochure/cameras/eos-r50
/digital-brochure/cameras/eos-r10
/digital-brochure/cameras/eos-rp
/digital-brochure/printers/pixma-g3160
```

### Navegación "Volver"

Al presionar el botón "Volver" en un detalle de producto, el usuario regresa a la **categoría correspondiente**, no a la página principal. Esto se logra mediante:

1. El campo `category` en cada archivo de producto
2. La función `handleBackClick()` en ProductDetail.jsx

---

## Prerrequisitos

### Herramientas necesarias
- Acceso a Canon Asia website
- VS Code con el proyecto abierto
- Navegador con DevTools (F12)

### Archivos a crear/modificar
```
src/data/products/[nuevo-producto].js   # CREAR - Datos del producto
src/data/products/index.js              # MODIFICAR - Agregar import y export
```

### Reglas de oro
1. **NUNCA inventar información** - Todo debe venir de Canon Asia
2. **NUNCA reutilizar imágenes** - Cada feature tiene su imagen ÚNICA
3. **NUNCA usar imágenes de body-only en heroes** - Las cámaras deben mostrar lente en fotos principales
4. **SIEMPRE incluir el campo `category`** - Necesario para la navegación
5. **SIEMPRE verificar que cada imagen corresponda a su feature específico**

---

## Paso 1: Identificar URLs Fuente

### 1.1 Encontrar la página del producto en Canon Asia

La URL base de Canon Asia es:
```
https://asia.canon/en/consumer/[nombre-producto]/[variante]/product
```

**Ejemplos:**
- EOS R10 Body: `https://asia.canon/en/consumer/eos-r10/body/product`
- EOS R10 Kit: `https://asia.canon/en/consumer/eos-r10/rf-s18-150mm-f-3-5-6-3-is-stm/product`
- EOS R50: `https://asia.canon/en/consumer/eos-r50-rf-s18-45mm/product`
- EOS RP: `https://asia.canon/en/consumer/eos-rp/rf24-105mm-f-4-7-1-is-stm/product`

### 1.2 Páginas importantes a revisar

Para cada producto, revisar AMBAS páginas:
1. **Página Body** - Tiene todas las especificaciones técnicas
2. **Página Kit** - Tiene las imágenes con lente (necesarias para hero)

### 1.3 Página de Galería/Fotos

Siempre existe una página adicional con todas las fotos:
```
https://asia.canon/en/consumer/[nombre-producto]/[variante]/photos
```

---

## Paso 2: Extraer TODAS las Imágenes

### 2.1 Patrón de URLs de imágenes Canon Asia

Las imágenes de Canon Asia siguen **dos patrones principales**:

#### Patrón A: Imágenes de producto (ángulos)
```
https://asia.canon/media/image/[AÑO]/[MES]/[DIA]/[GUID]_[MODELO]+[DESCRIPCION]_[TAMAÑO].png
```

**Ejemplo:**
```
https://asia.canon/media/image/2026/01/14/870cde46c4344796b8521c09a4e929e0_1_K433_FrontSlantDown_Body_362x320.png
```

#### Patrón B: Imágenes de features (varía por producto)

**Patrón B1 - Modelos recientes (EOS RP, etc.):**
```
https://asia.canon/media/image/[AÑO]/[MES]/[DIA]/[GUID]_[producto]-prodes-feature-[NUMERO].jpg
```

**Patrón B2 - Modelos más antiguos (EOS R8, etc.):**
```
https://asia.canon/media/image/[AÑO]/[MES]/[DIA]/[GUID]_[Nombre+Descriptivo].jpg
```

**Ejemplos reales:**
```
# EOS RP (patrón prodes-feature)
https://asia.canon/media/image/2026/01/15/5391f2e343c84aec82ddd2f89aca1cf2_eosrp-prodes-feature-02.jpg

# EOS R8 (patrón descriptivo)
https://asia.canon/media/image/2023/02/03/6c3d7cdf1bf04d95ace664d4b9f0c0bb_Superior+Image+Quality.jpg
https://asia.canon/media/image/2023/02/03/7ce56a65a54d424eb665b6ae777cc452_Canon+Log+3.jpg
```

### 2.2 Método RECOMENDADO: Explorar carpeta media/image en DevTools

⚠️ **Este es el método más completo para encontrar TODAS las imágenes:**

1. Abrir la página del producto en Chrome
2. Presionar **F12** para abrir DevTools
3. Ir a la pestaña **Sources** (no Network)
4. En el panel izquierdo, expandir: `asia.canon` → `media/image`
5. Buscar la carpeta por fecha (ej: `2023/02/03` para EOS R8)
6. **Verás TODAS las imágenes** organizadas:
   - Imágenes de features (Superior+Image, Canon+Log, HDR, etc.)
   - Imágenes de galería (EOS+R8+Gallery+...)
   - Imágenes de producto (Body, Front, Back, etc.)
7. Click derecho en cualquier archivo → "Copy link address"

**Cómo encontrar la fecha correcta:**
- La fecha generalmente es cercana al lanzamiento del producto
- EOS R8: `2023/02/03` (lanzamiento febrero 2023)
- EOS RP: `2026/01/15` (actualización reciente)

### 2.3 Método alternativo: DevTools Network

1. Abrir la página del producto en Chrome: `https://asia.canon/en/consumer/[producto]/body/product`
2. Presionar **F12** para abrir DevTools
3. Ir a la pestaña **Network**
4. En el filtro escribir: `prodes-feature` o `feature` o el nombre del modelo (ej: `R8`)
5. Recargar la página (F5)
6. **IMPORTANTE**: Hacer scroll lento por TODA la página para cargar las imágenes lazy-loaded
7. Click derecho en cada request → "Copy" → "Copy link address"

### 2.4 Método alternativo: Buscar en el HTML

```javascript
// Ejecutar en la consola del navegador (F12 → Console)
const features = document.querySelectorAll('img[src*="feature"]');
features.forEach((img, i) => {
    console.log(`Feature ${i + 1}:`, img.src);
});
```

### 2.4 Script completo para extraer TODAS las imágenes

```javascript
// Ejecutar en la consola del navegador en la página del producto
console.log('=== IMÁGENES DE PRODUCTO ===');
document.querySelectorAll('img').forEach(img => {
    const src = img.src || img.dataset.src;
    if (src && src.includes('asia.canon/media/image')) {
        // Clasificar por tipo
        if (src.includes('prodes-feature') || src.includes('feature')) {
            console.log('[FEATURE]', src);
        } else if (src.includes('Body') || src.includes('Slant') || src.includes('Front') || src.includes('Back') || src.includes('Top')) {
            console.log('[ANGLE]', src);
        } else {
            console.log('[OTHER]', src);
        }
    }
});
```

### 2.5 Patrones de nombre por modelo

| Modelo | Patrón de features | Ejemplo |
|--------|-------------------|---------|
| EOS RP | `eosrp-prodes-feature-XX.jpg` | `eosrp-prodes-feature-02.jpg` |
| EOS R10 | `EOS+R10+XX+[Feature].png` | `EOS+R10+01+Superior+Image+Quality.png` |
| EOS R50 | Similar a R10 | `EOS+R50+...` |
| Modelos nuevos | Verificar en Network tab | Varía |

### 2.6 Categorías de imágenes a extraer

#### A. Imágenes de Producto (Ángulos)
| Tipo | Descripción | Ejemplo nombre archivo |
|------|-------------|------------------------|
| Front | Vista frontal | `EOS+R10+Front+Body.png` |
| Back | Vista posterior | `EOS+R10+Back+Body.png` |
| Top | Vista superior | `EOS+R10+Top+Body.png` |
| Left | Vista lateral izquierda | `EOS+R10+Left+Body.png` |
| Right | Vista lateral derecha | `EOS+R10+Right+Body.png` |
| Bottom | Vista inferior | `EOS+R10+Bottom+Body.png` |
| Front Slant | Vista frontal angular (con lente) | `EOS+R10+w+RF-S18-150mm...+Front+Slant.png` |

#### B. Imágenes de Features (CRÍTICO: cada una es ÚNICA)
Cada sección de la página tiene imágenes específicas:

| Sección | Features típicos | Nombre archivo típico |
|---------|-----------------|----------------------|
| Superior Image Quality | Sensor, High ISO, DLO | `01+Superior+Image+Quality`, `02+High+Resolution`, `03+High+ISO`, `04+DLO` |
| HDR PQ | HDR Composite | `HDR+PQ+%26+Composite` |
| High Speed | 23fps, AF, RAW Burst | `23fps`, `Dual+Pixel+AF+II`, `RAW+Burst+Mode` |
| Intelligent Tracking | People, Animal, Vehicle | `People+Priority+AF`, `Animal+Priority+AF`, `Vehicle+Priority+AF` |
| Vlog/Video | 4K, HDR Movies, Crop, IS | `6K+Oversampling`, `HDR+PQ+Movies`, `4K+UHD+Crop`, `OIS+x+Movie+Digital+IS` |
| Convenient Features | Panorama, Focus Bracketing, Panning | `Panorama`, `Depth+Compositing`, `Panning+Mode` |
| Portable Build | EVF, Flash, LCD, Switch, Controls | `EVF`, `Pop-up+Flash`, `Vari-angle+LCD`, `Focus+mode+switch`, `Quick+Access` |

#### C. Imágenes de Galería (lifestyle/sample shots)
```
Gallery+Image+1.jpg
Gallery+Image+2.jpg
...
```

---

## Paso 3: Mapear Contenido por Secciones

### 3.1 Estructura típica de página Canon Asia

Las páginas de Canon Asia siguen esta estructura:

```
1. HERO PRINCIPAL
   - Nombre del producto
   - Tagline
   - Imagen principal (con lente)

2. SECCIÓN: Superior Image Quality / Calidad de Imagen
   - Imagen hero de sección
   - Sub-features: Sensor, ISO, DLO
   - Cada sub-feature tiene su propia imagen

3. SECCIÓN: HDR PQ (si aplica)
   - Imagen de ejemplo HDR

4. SECCIÓN: High Speed / Alta Velocidad
   - fps continuo
   - AF Coverage
   - RAW Burst

5. SECCIÓN: Intelligent Tracking
   - People Priority
   - Animal Priority  
   - Vehicle Priority

6. SECCIÓN: Video/Vlog
   - 4K UHD
   - HDR Movies
   - Crop modes
   - Stabilization

7. SECCIÓN: Convenient Features
   - Panorama
   - Focus Bracketing
   - Panning Mode

8. SECCIÓN: Build/Design
   - EVF
   - Flash
   - LCD
   - Controls

9. ESPECIFICACIONES TÉCNICAS
   - Tabla detallada
```

### 3.2 Extraer textos de cada sección

Para cada sección, copiar:
1. **Título principal** (ej: "Superior Image Quality")
2. **Subtítulo** (si existe)
3. **Descripción del párrafo principal**
4. **Títulos de cada feature**
5. **Descripciones de cada feature**

### 3.3 Traducir al español

- Mantener los nombres técnicos en inglés: "HDR PQ", "Dual Pixel CMOS AF II", "DIGIC X"
- Traducir descripciones al español
- Usar terminología consistente con otros productos

---

## Paso 4: Crear Archivo Individual de Producto

### 4.1 Crear el archivo

Crear un nuevo archivo en `src/data/products/[product-id].js`:

```javascript
/**
 * [Nombre Producto] - Product Detail Data
 * Category: [cameras|printers|lenses|accessories]
 */
const [productVariable] = {
    // ========== INFORMACIÓN BÁSICA ==========
    id: '[product-id]',
    name: '[Nombre Oficial]',
    tagline: '[Tagline de Canon]',
    category: 'cameras',  // ⚠️ CRÍTICO: 'cameras', 'printers', 'lenses', 'accessories'
    description: '[Descripción principal traducida]',

    // ========== IMÁGENES ==========
    images: {
        // Hero: Imágenes principales para el carrusel (CON LENTE para cámaras)
        hero: [
            'https://asia.canon/media/image/.../Front+Slant.png',
            'https://asia.canon/media/image/.../Front.png',
            'https://asia.canon/media/image/.../Left.png',
            'https://asia.canon/media/image/.../Back+Body.png',
            'https://asia.canon/media/image/.../Top+Body.png'
        ],
        // Angles: Para el selector de vistas
        angles: [
            { src: 'URL_IMAGEN', label: 'Descripción' },
            // ... más ángulos
        ],
        // White: Versión en color blanco (si existe)
        white: [],
        // Lifestyle: Fotos de ejemplo/galería
        lifestyle: []
    },

    // ========== KEY FEATURES (badges principales) ==========
    keyFeatures: [
        {
            icon: 'camera',      // nombre del icono
            title: 'Título',     // ej: '24.2MP APS-C'
            description: 'Desc'  // ej: 'Sensor CMOS con DIGIC X'
        },
        // ... 4-5 features principales
    ],

    // ========== SECCIONES DE CONTENIDO ==========
    sections: [
        // Ver 4.3 para tipos de secciones
    ],

    // ========== ESPECIFICACIONES TÉCNICAS ==========
    specifications: {
        'Categoría': {
            'Spec': 'Valor',
            // ...
        },
        // ... más categorías
    },

    // ========== DESCARGAS ==========
    downloads: {
        allImages: {
            url: 'https://asia.canon/.../photos',
            size: 'Todas las imágenes',
            label: 'Photo Library Completa'
        },
        individual: []
    },

    // ========== ACCESORIOS ==========
    accessories: [
        { name: 'Nombre accesorio', url: 'URL Canon Asia' },
        // ...
    ],

    // ========== COLORES ==========
    colors: ['Negra'],  // o ['Negra', 'Blanca']

    // ========== KITS DISPONIBLES ==========
    kits: [
        {
            type: 'LENS_KIT',  // o 'BODY_ONLY'
            description: 'Descripción del kit',
            url: 'URL tienda',
            image: 'URL imagen'
        },
        // ...
    ],

    // ========== ENLACES EXTERNOS ==========
    externalLinks: {
        officialPage: 'https://asia.canon/...',
        photoLibrary: 'https://asia.canon/.../photos',
        support: 'https://asia.canon/en/support/...'
    }
};

export default [productVariable];
```

### 4.2 Campo `category` (CRÍTICO)

El campo `category` es **obligatorio** y determina:
1. La URL del producto: `/digital-brochure/[category]/[product-id]`
2. El destino del botón "Volver": `/digital-brochure/[category]`

**Valores permitidos:**
- `'cameras'` - Cámaras (EOS R, EOS Rebel, PowerShot, etc.)
- `'printers'` - Impresoras (PIXMA, imagePROGRAF, etc.)
- `'lenses'` - Lentes (RF, EF, etc.)
- `'accessories'` - Accesorios (flashes, baterías, etc.)

### 4.3 Tipos de secciones disponibles

#### `hero_section` - Sección principal con gradiente
```javascript
{
    type: 'hero_section',
    id: 'unique-id',
    title: 'Título Principal',
    subtitle: 'Subtítulo',
    description: 'Descripción larga...',
    gradient: 'from-purple-600 to-pink-600',  // Tailwind gradient
    image: 'URL_IMAGEN_OPCIONAL'  // Imagen de fondo si aplica
}
```

#### `image_text` - Imagen con texto al lado
```javascript
{
    type: 'image_text',
    id: 'unique-id',
    layout: 'image_left',  // o 'text_right'
    title: 'Título',
    description: 'Descripción...',
    image: 'URL_IMAGEN'
}
```

#### `feature_grid` - Grid de features con imágenes
```javascript
{
    type: 'feature_grid',
    id: 'unique-id',
    columns: 3,  // opcional: 2 o 3
    features: [
        {
            title: 'Título Feature',
            description: 'Descripción...',
            icon: 'nombre-icono',
            image: 'URL_IMAGEN_ESPECÍFICA'  // ¡ÚNICA para cada feature!
        },
        // ... más features
    ]
}
```

#### `connectivity` - Iconos de conectividad
```javascript
{
    type: 'connectivity',
    id: 'connectivity',
    title: 'Conexiones',
    items: [
        { name: 'Wi-Fi', icon: 'wifi' },
        { name: 'USB-C', icon: 'usb' },
        { name: 'Bluetooth', icon: 'bluetooth' },
        { name: 'image.canon', icon: 'cloud' }
    ]
}
```

### 4.3 Gradientes recomendados por sección

| Sección | Gradiente |
|---------|-----------|
| Image Quality | `from-purple-600 to-pink-600` |
| High Speed | `from-amber-500 to-orange-700` |
| Tracking/AF | `from-blue-600 to-indigo-800` |
| Video/Vlog | `from-emerald-600 to-teal-800` |
| Convenient Features | `from-rose-500 to-red-700` |
| Build/Design | `from-cyan-600 to-blue-800` |

### 4.4 Iconos disponibles

```javascript
// En ProductDetail.jsx, función getFeatureIcon()
const icons = {
    sensor: Camera,
    video: Video,
    speed: Zap,
    focus: Target,
    weight: Layers,
    zoom: Maximize2,
    slowmo: Play,
    stabilization: Settings,
    stream: Wifi,
    vertical: Smartphone,
    aspect: Monitor,
    hybrid: Layers,
    breathing: Aperture,
    quality: ImageIcon,
    hdr: Sun,
    panning: Camera,
    panorama: ImageIcon,
    teleconverter: Target,
    auto: Settings,
    human: Users,
    animal: Dog,
    vehicle: Car,
    flash: Sun,
    evf: Eye,
    lcd: Monitor,
    shoe: Settings,
    wifi: Wifi,
    usb: Usb,
    bluetooth: Bluetooth,
    cloud: Cloud,
    camera: Camera,
    zap: Zap,
    target: Target,
    feather: Feather,
    moon: Moon,
    eye: Eye,
    settings: Settings
};
```

---

## Paso 5: Registrar en el Índice

### 5.1 Ubicación del archivo índice

```
src/data/products/index.js
```

### 5.2 Proceso de registro

1. **Abrir el archivo** `index.js` en `src/data/products/`
2. **Agregar el import** al inicio del archivo:
   ```javascript
   import nuevoProducto from './nuevo-producto';
   ```
3. **Agregar al objeto** `productDetails`:
   ```javascript
   export const productDetails = {
       'eos-r50': eosR50,
       'eos-r10': eosR10,
       'eos-rp': eosRp,
       'nuevo-producto': nuevoProducto,  // ← Agregar aquí
   };
   ```
4. **Agregar al export** de productos individuales (opcional):
   ```javascript
   export { eosR50, eosR10, eosRp, nuevoProducto };
   ```

### 5.3 Verificar que el ID del producto coincida

El `id` del producto debe coincidir con:
- La key en `productDetails`
- El nombre del archivo (sin `.js`)
- La URL esperada

| Archivo | Key | URL |
|---------|-----|-----|
| `eos-r10.js` | `'eos-r10'` | `/digital-brochure/cameras/eos-r10` |
| `eos-rp.js` | `'eos-rp'` | `/digital-brochure/cameras/eos-rp` |
| `pixma-g3160.js` | `'pixma-g3160'` | `/digital-brochure/printers/pixma-g3160` |

### 5.4 Ejemplo completo de index.js

```javascript
/**
 * Product Details Index
 */
import eosR50 from './eos-r50';
import eosR10 from './eos-r10';
import eosRp from './eos-rp';
// import nuevoProducto from './nuevo-producto';

export const productDetails = {
    'eos-r50': eosR50,
    'eos-r10': eosR10,
    'eos-rp': eosRp,
    // 'nuevo-producto': nuevoProducto,
};

// Helper functions
export const getProductsByCategory = (category) => {
    return Object.values(productDetails).filter(p => p.category === category);
};

export const getProductById = (productId) => {
    return productDetails[productId] || null;
};

export { eosR50, eosR10, eosRp };
export default productDetails;
```

---

## Paso 6: Verificación y QA

### 6.1 Checklist de imágenes

- [ ] Hero images muestran cámara CON LENTE
- [ ] Cada feature tiene su imagen ÚNICA (no repetida)
- [ ] Las imágenes de tracking son:
  - People: foto de persona
  - Animal: foto de animal
  - Vehicle: foto de vehículo
- [ ] Las imágenes de video features son específicas:
  - HDR Movies: imagen específica
  - 4K Crop: imagen con overlay de crop
  - IS: logo o diagrama de estabilización
- [ ] Las imágenes de build son close-ups:
  - EVF: visor
  - Flash: flash popup
  - LCD: pantalla articulada
  - Switch: interruptor AF/MF
  - Controls: controles superiores

### 6.2 Checklist de contenido

- [ ] Nombre del producto correcto
- [ ] Tagline oficial de Canon
- [ ] Campo `category` correcto ('cameras', 'printers', 'lenses', 'accessories')
- [ ] Descripción traducida correctamente
- [ ] Especificaciones técnicas exactas
- [ ] Enlaces externos funcionan

### 6.3 Prueba en navegador

1. Iniciar el servidor de desarrollo: `npm run dev`
2. Navegar a `/digital-brochure/[category]/[product-id]`
3. Verificar:
   - [ ] Carga correctamente
   - [ ] Imágenes se muestran
   - [ ] Scroll funciona
   - [ ] Botón "Volver" lleva a `/digital-brochure/[category]`
   - [ ] No hay errores en consola

---

## Anexo: Patrones de URLs de Canon Asia

### Estructura de nombres de archivo

```
EOS+[MODELO]+[NUMERO]+[FEATURE].png

Ejemplos:
EOS+R10+01+Superior+Image+Quality.png
EOS+R10+02+High+Resolution.png
EOS+R10+03+High+ISO.png
EOS+R10+04+DLO.png
EOS+R10+10+People+Priority+AF.png
EOS+R10+11+Animal+Priority+AF.png
EOS+R10+14+HDR+PQ+Movies.png
EOS+R10+15+4K+UHD+Crop.png
EOS+R10+17+Panorama.png
EOS+R10+20+EVF.png
EOS+R10+21+Pop-up+Flash.png
EOS+R10+22+Vari-angle+LCD.png
EOS+R10+23+Focus+mode+switch.png
```

### Imágenes compartidas entre modelos

Algunas imágenes son compartidas (ej: logo Dual Pixel AF II):
```
EOS+R7+08+Dual+Pixel+AF+II.png  // Usado también para R10
```

### URLs codificadas

Los espacios se convierten en `+`:
```
"EOS R10" → "EOS+R10"
"HDR PQ & Composite" → "HDR+PQ+%26+Composite"
```

---

## Checklist Final

Antes de dar por terminado un producto, verificar:

### Información Básica
- [ ] ID único y correcto
- [ ] Nombre oficial
- [ ] Tagline de Canon Asia
- [ ] Categoría correcta (`cameras`, `printers`, `lenses`, `accessories`)
- [ ] Descripción traducida

### Imágenes Hero
- [ ] Mínimo 5 imágenes
- [ ] Primera imagen: Front Slant con lente
- [ ] Incluye: Front, Left, Back, Top
- [ ] URLs de Canon Asia válidas

### ⚠️ Imágenes de Features (REGLA CRÍTICA)
- [ ] **CADA IMAGEN SE USA EXACTAMENTE UNA VEZ** - Sin repeticiones
- [ ] Cantidad de features = cantidad de imágenes disponibles
- [ ] Si hay 8 imágenes de features, crear exactamente 8 cards de features
- [ ] No inventar features para usar más imágenes
- [ ] No repetir imágenes para llenar más features

### Especificaciones
- [ ] Sensor completo
- [ ] Video completo
- [ ] Enfoque completo
- [ ] Disparo continuo
- [ ] Visor y pantalla
- [ ] Físico (peso, dimensiones)
- [ ] Conectividad
- [ ] Otros (ISO, batería, etc.)

### Enlaces
- [ ] Página oficial Canon Asia
- [ ] Photo Library
- [ ] Soporte

---

## Regla de Oro: Una Imagen Por Feature

### ❌ INCORRECTO - Imágenes repetidas:
```javascript
features: [
    { title: 'Eye Detection', image: 'feature-03.jpg' },
    { title: 'AF Coverage', image: 'feature-03.jpg' },  // ❌ REPETIDA
    { title: 'Low Light AF', image: 'feature-02.jpg' }, // ❌ YA USADA ANTES
]
```

### ✅ CORRECTO - Cada imagen única:
```javascript
features: [
    { title: 'Eye Detection', image: 'feature-03.jpg' },
    { title: 'AF Coverage', image: 'feature-04.jpg' },
    { title: 'Low Light AF', image: 'feature-05.jpg' },
]
```

### Cómo organizar con imágenes limitadas

Si tienes **8 imágenes de features**, organiza así:

```javascript
sections: [
    // Sección 1: 2 features
    { type: 'feature_grid', columns: 2, features: [
        { image: 'feature-01.jpg' },
        { image: 'feature-02.jpg' },
    ]},
    
    // Sección 2: 2 features
    { type: 'feature_grid', columns: 2, features: [
        { image: 'feature-03.jpg' },
        { image: 'feature-04.jpg' },
    ]},
    
    // Sección 3: 2 features
    { type: 'feature_grid', columns: 2, features: [
        { image: 'feature-05.jpg' },
        { image: 'feature-06.jpg' },
    ]},
    
    // Sección 4: 2 features
    { type: 'feature_grid', columns: 2, features: [
        { image: 'feature-07.jpg' },
        { image: 'feature-08.jpg' },
    ]},
]
// Total: 8 imágenes, 8 features, 0 repeticiones ✅
```

---

## Ejemplo de Flujo Completo

### Paso 1: Obtener URLs
```
Body: https://asia.canon/en/consumer/eos-rp/body/product
Kit:  https://asia.canon/en/consumer/eos-rp/rf24-105mm-f-4-7-1-is-stm/product
```

### Paso 2: Extraer imágenes con DevTools
```
1. Abrir página en Chrome
2. F12 → Network → filtrar por "feature" o "prodes"
3. Recargar página (F5)
4. Scroll LENTO por toda la página (lazy loading)
5. Copiar URLs que aparezcan con patrón:
   - [producto]-prodes-feature-XX.jpg
   - EOS+[modelo]+XX+[Feature].png
```

### Paso 3: Contar imágenes y planificar
```
Ejemplo: 8 imágenes de features encontradas
→ Crear 4 secciones con 2 features cada una
→ NO repetir ninguna imagen
```

### Paso 4: Crear archivo en src/data/products/
```javascript
// src/data/products/eos-rp.js
const eosRp = {
    id: 'eos-rp',
    category: 'cameras',  // ⚠️ OBLIGATORIO
    // ... resto de la estructura
};
export default eosRp;
```

### Paso 5: Registrar en index.js
```javascript
import eosRp from './eos-rp';
export const productDetails = {
    'eos-rp': eosRp,
};
```

### Paso 6: Verificar en navegador
```
http://localhost:5173/digital-brochure/cameras/eos-rp
```

---

**Documento creado: Enero 2026**
**Última actualización: 31 Enero 2026**
**Autor: Equipo Canon Digital Brochure**
