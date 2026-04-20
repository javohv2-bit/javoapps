# Guía Completa: Creación de Productos para Digital Brochure

> **Última actualización:** Febrero 2026  
> **Autor:** Documentación basada en troubleshooting real del EOS R1

---

## 📋 Índice

1. [Flujo Completo del Proceso](#flujo-completo-del-proceso)
2. [Paso 1: Scraping de la Fuente](#paso-1-scraping-de-la-fuente)
3. [Paso 2: Análisis del JSON Scrapeado](#paso-2-análisis-del-json-scrapeado)
4. [Paso 3: Identificar el Producto en BD](#paso-3-identificar-el-producto-en-bd)
5. [Paso 4: Crear el Seed Script](#paso-4-crear-el-seed-script)
6. [Arquitectura del Sistema](#arquitectura-del-sistema)
7. [Tipos de Bloques Válidos](#tipos-de-bloques-válidos)
8. [Problemas Comunes y Soluciones](#problemas-comunes-y-soluciones)
9. [Checklist de Verificación](#checklist-de-verificación)

---

## 🔄 Flujo Completo del Proceso

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. SCRAPING                                                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │ Canon UK    │    │ Canon Asia  │    │ Canon EU    │                 │
│  │ (Scrapy)    │    │ (Puppeteer) │    │ (Scrapy)    │                 │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                 │
│         │                  │                  │                         │
│         └──────────────────┼──────────────────┘                         │
│                            ▼                                            │
│                   scraped-[producto].json                               │
└─────────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  2. ANÁLISIS                                                            │
│  • Revisar imágenes extraídas                                          │
│  • Mapear secciones de la fuente a tipos de bloque                     │
│  • Identificar textos y descripciones                                  │
└─────────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  3. IDENTIFICAR PRODUCTO                                                │
│  • Buscar product_id correcto en brochure_products                     │
│  • Verificar que el slug coincida con la URL esperada                  │
│  • ⚠️ CRÍTICO: NO crear productos nuevos                               │
└─────────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  4. SEED SCRIPT                                                         │
│  • Crear seed-[producto].mjs con el product_id correcto                │
│  • Usar tipos de bloque válidos de BlockRenderers.jsx                  │
│  • Mapear contenido scrapeado a block_data                             │
└─────────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  5. EJECUCIÓN Y VERIFICACIÓN                                            │
│  • node scripts/seed-[producto].mjs                                    │
│  • Verificar en /product/[slug]                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🕷️ Paso 1: Scraping de la Fuente

Existen **DOS herramientas de scraping** dependiendo de la fuente:

### Opción A: Scrapy (Canon UK / Canon Europe)

**Ubicación:** `scripts/scrapy-canon/`

```bash
# 1. Instalar dependencias (solo primera vez)
cd scripts/scrapy-canon
pip3 install -r requirements.txt

# 2. Ejecutar spider con URL específica
python3 -m scrapy crawl canon_europe -a url="https://www.canon.co.uk/cameras/eos-r1/" -o ../scraped-eos-r1.json
```

**Spiders disponibles:**
| Spider | Uso | Dominios |
|--------|-----|----------|
| `canon_europe` | Canon UK/Europe | canon.co.uk, canon-europe.com |
| `eos_r1_spider` | EOS R1 específico | canon.co.uk |
| `powershot_spider` | PowerShot series | canon-europe.com |

**Estructura del output JSON:**
```json
{
  "name": "EOS R1",
  "tagline": "When speed is everything...",
  "description": "...",
  "url": "https://www.canon.co.uk/cameras/eos-r1/",
  "images": {
    "hero": ["https://..."],
    "angles": ["https://...", "https://..."],
    "features": ["https://..."],
    "lifestyle": ["https://..."],
    "gallery": ["https://..."],
    "other": ["https://..."]
  },
  "specifications": {
    "Sensor Type": "Full-frame CMOS",
    "Megapixels": "24.2 MP"
  },
  "features": [
    {
      "title": "Deep Learning AF",
      "description": "...",
      "image": "https://..."
    }
  ]
}
```

### Opción B: Puppeteer (Canon Asia)

**Ubicación:** `scripts/scrape-canon-product.cjs`

```bash
# Ejecutar scraper
node scripts/scrape-canon-product.cjs https://asia.canon/en/consumer/eos-r8/body/product scraped-eos-r8
```

**Ventajas de Puppeteer:**
- Ejecuta JavaScript (mejor para SPAs)
- Captura imágenes lazy-loaded
- Simula scroll para cargar todo el contenido

**Output generado:** `scripts/scraped-[producto].json`

### 📋 Formato de JSON Correcto (Modelo: EOS R6 Mark II)

El archivo `scraped-eos-r6-mark-ii.json` es el **modelo de referencia** para el formato correcto. Todo scrape debe generar un JSON con esta estructura:

```json
{
  "url": "https://asia.canon/en/consumer/eos-r6-mark-ii/...",
  "productInfo": {
    "name": "EOS R6 Mark II (RF24-105mm f/4-7.1 IS STM)",
    "tagline": "...",
    "description": "...",
    "specs": {},
    "sections": [
      {
        "title": "Videography Ready",
        "description": "Descripción completa de la sección..."
      },
      {
        "title": "Impressive Details at 4K 60p",
        "description": "The EOS R6 Mark II gives you amazing 4K..."
      }
      // ... todas las secciones de la página
    ]
  },
  "images": {
    "hero": [
      "https://asia.canon/media/image/.../EOS+R6+Mark+II+Body+Front+Slant.png",
      "https://asia.canon/media/image/.../EOS+R6+Mark+II+Front+Slant+RF24-105mm.png"
    ],
    "angles": [
      {
        "src": "https://asia.canon/media/image/.../EOS+R6+Mark+II+Body+Front+Slant.png",
        "label": "eos r6 mark ii Body front slant"
      },
      {
        "src": "https://asia.canon/media/image/.../EOS+R6+Mark+II+Body+Top.png",
        "label": "eos r6 mark ii Body top"
      },
      {
        "src": "https://asia.canon/media/image/.../EOS+R6+Mark+II+Body+Back.png",
        "label": "eos r6 mark ii Body back"
      },
      {
        "src": "https://asia.canon/media/image/.../EOS+R6+Mark+II+Body+Left.png",
        "label": "eos r6 mark ii Body left"
      },
      {
        "src": "https://asia.canon/media/image/.../EOS+R6+Mark+II+Body+Right.png",
        "label": "eos r6 mark ii Body right"
      },
      {
        "src": "https://asia.canon/media/image/.../EOS+R6+Mark+II+Body+Bottom.png",
        "label": "eos r6 mark ii Body bottom"
      }
      // ... TODAS las vistas del producto
    ],
    "features": [
      {
        "url": "https://asia.canon/media/image/.../EOS+R6+Mark+II+40FPS.jpg",
        "name": "eos r6 mark ii 40fps"
      },
      {
        "url": "https://asia.canon/media/image/.../EOS+R6+Mark+II+Canon+Log+3.png",
        "name": "eos r6 mark ii canon log 3"
      }
      // ... TODAS las imágenes de features
    ],
    "gallery": [],
    "other": [
      "https://asia.canon/media/image/.../EOS+R6+Mark+II+Focus+Breathing+Correction+Off.gif",
      "https://asia.canon/media/image/.../EOS+R6+Mark+II+Pre-recording.png"
      // ... otras imágenes
    ]
  },
  "totalImages": 66,
  "scrapedAt": "2026-02-01T03:23:28.749Z"
}
```

### ✅ Checklist del JSON Scrapeado

Antes de crear el seed, verifica que el JSON tenga:

- [ ] **URL fuente** - La URL original de donde se scrapeó
- [ ] **productInfo.name** - Nombre del producto
- [ ] **productInfo.sections[]** - TODAS las secciones con título y descripción
- [ ] **images.hero[]** - Imágenes principales/hero
- [ ] **images.angles[]** - TODAS las vistas del producto (front, back, top, left, right, bottom)
- [ ] **images.features[]** - Imágenes de características con nombre descriptivo
- [ ] **totalImages** - Cantidad total de imágenes (debe ser > 30 para un producto completo)
- [ ] **scrapedAt** - Timestamp del scrape

> ⚠️ **Si el JSON no tiene esta estructura completa, el scraper necesita ajustes antes de continuar.**

### Crear un Nuevo Spider para Otra Región

Si necesitas scrapear de una nueva fuente (ej: Canon Latinoamérica), crea un nuevo spider:

```python
# scripts/scrapy-canon/canon_scraper/spiders/canon_latam_spider.py

import scrapy
from ..items import CanonProductItem

class CanonLatamSpider(scrapy.Spider):
    name = "canon_latam"
    allowed_domains = ["www.canon.cl", "www.canon.com.mx", "scene7.com"]
    
    def __init__(self, url=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if url:
            self.start_urls = [url]
    
    def parse(self, response):
        item = CanonProductItem()
        item['url'] = response.url
        item['name'] = self.extract_name(response)
        item['images'] = self.extract_all_images(response)
        # ... adaptar selectores según estructura del sitio
        yield item
```

**Tips para adaptar selectores:**
1. Inspecciona la página destino con DevTools
2. Identifica los selectores CSS para: nombre, imágenes, specs
3. Busca patrones de URL de imágenes (scene7.com, cdn.media.amplience.net, etc.)

---

## 📊 Paso 2: Análisis del JSON Scrapeado

Después de scrapear, revisa el JSON generado:

```bash
# Ver resumen del JSON
node -e "
const data = require('./scripts/scraped-eos-r1.json');
console.log('Nombre:', data[0]?.name || data.name);
console.log('Imágenes por categoría:');
const imgs = data[0]?.images || data.images;
Object.keys(imgs).forEach(k => console.log('  -', k + ':', imgs[k].length));
"
```

### Mapeo de Contenido a Bloques

| Contenido de la Fuente | Tipo de Bloque | Notas |
|------------------------|----------------|-------|
| Hero image + nombre | `hero_header` | Primera imagen, key features |
| Sección con título + párrafo | `hero_section` | Para títulos grandes con gradiente |
| Imagen + texto descriptivo | `image_text` | Layout left/right |
| Lista de características | `feature_grid` | Con iconos |
| Galería de fotos muestra | `gallery` | Fotos de ejemplo |
| Tabla de especificaciones | `specifications` | Acordeón expandible |
| Links externos | `cta_buttons` | Botones de acción |

---

## 🔍 Paso 3: Identificar el Producto en BD

**⚠️ CRÍTICO: Este paso evita el 90% de los problemas**

### Script de Verificación

Crea/usa este script para encontrar el product_id correcto:

```javascript
// scripts/find-product.mjs
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bupnqihroawrvcvzpbqv.supabase.co',
  'YOUR_SERVICE_KEY'
);

const generateSlug = (name) => {
  if (!name) return null;
  const patterns = [
    /^(EOS\s+R\d+\s+MARK\s+[IVX]+)/i,
    /^(EOS\s+R\d+\s+V)\b/i,
    /^(EOS\s+R\d+)/i,
    /^(EOS\s+REBEL\s+T\d+)/i,
    /^(EOS\s+RP)\b/i,
    /^(POWERSHOT\s+[A-Z]+)/i,
  ];
  for (const pattern of patterns) {
    const match = name.toUpperCase().match(pattern);
    if (match) return match[1].toLowerCase().replace(/\s+/g, '-');
  }
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

// Cambiar el slug que buscas
const TARGET_SLUG = 'eos-r1';

async function find() {
  const { data: products } = await supabase.from('brochure_products').select('id, name');
  const { data: blocks } = await supabase.from('brochure_product_blocks').select('product_id');
  
  const withBlocks = new Set(blocks.map(b => b.product_id));
  
  console.log(`\nBuscando producto para slug: ${TARGET_SLUG}\n`);
  
  products.forEach(p => {
    const slug = generateSlug(p.name);
    if (slug === TARGET_SLUG) {
      const hasBlocks = withBlocks.has(p.id);
      console.log(`✅ MATCH: ${p.name}`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Has Blocks: ${hasBlocks}`);
      console.log(`   👆 USA ESTE ID EN TU SEED\n`);
    }
  });
}

find();
```

```bash
node scripts/find-product.mjs
```

### Entendiendo el Sistema de Slugs

El sistema **NO usa una columna `slug`**. En cambio:
1. Toma el `name` del producto
2. Aplica la función `generateSlug()`
3. El resultado determina la URL

| Nombre en BD | Slug Generado | URL |
|--------------|---------------|-----|
| `EOS R1 BODY` | `eos-r1` | `/product/eos-r1` ✅ |
| `Canon EOS R1` | `canon-eos-r1` | `/product/canon-eos-r1` ❌ |
| `EOS R6 MARK II BODY` | `eos-r6-mark-ii` | `/product/eos-r6-mark-ii` ✅ |

> ⚠️ **Error común**: Crear un producto "Canon EOS R1" pensando que la URL será `/product/eos-r1`. NO funciona así.

---

## 📝 Paso 4: Crear el Seed Script

### Plantilla Completa

```javascript
/**
 * [NOMBRE PRODUCTO] - Seed Script
 * Fuente: [URL de Canon UK/Asia/Europe]
 * 
 * TIPOS DE BLOQUE VÁLIDOS (de BlockRenderers.jsx):
 * - hero_header, hero_section, image_text, text_only
 * - feature_grid, icon_list, video, gallery
 * - image_banner, specifications, cta_buttons, kits_section
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const supabaseKey = 'YOUR_SERVICE_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// ⚠️ CRÍTICO: Usar el ID del producto que genera el slug correcto
// Encontrar con: node scripts/find-product.mjs
// ============================================================================
const TARGET_PRODUCT_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

// ============================================================================
// IMÁGENES (copiadas del JSON scrapeado)
// ============================================================================
const IMG = {
  hero: 'https://...',
  
  angles: [
    'https://...',
    'https://...',
  ],
  
  features: [
    'https://...',
    'https://...',
  ],
  
  lifestyle: [
    { src: 'https://...', caption: 'Descripción de la foto' },
  ],
};

// ============================================================================
// BLOQUES - Mapear contenido de la fuente a tipos válidos
// ============================================================================
const BLOCKS = [
  // 1. HERO HEADER - Siempre primero
  {
    block_type: 'hero_header',
    block_order: 0,
    block_data: {
      name: 'Nombre del Producto',
      tagline: 'Tagline de la fuente',
      category: 'CATEGORÍA',
      colors: ['Negra'],
      images: {
        angles: IMG.angles.map((src, i) => ({ src, alt: `Vista ${i + 1}` })),
        white: [],
        lifestyle: IMG.lifestyle,
      },
      keyFeatures: [
        { title: '24.2MP', subtitle: 'Sensor', icon: 'sensor' },
        { title: '40fps', subtitle: 'Continuous', icon: 'speed' },
        // ... más features
      ],
      externalLinks: {
        officialPage: 'URL de la fuente',
        support: 'URL de soporte',
      },
    },
  },

  // 2. HERO SECTION - Para títulos destacados
  {
    block_type: 'hero_section',
    block_order: 1,
    block_data: {
      title: 'TÍTULO EN MAYÚSCULAS',
      subtitle: 'Subtítulo descriptivo',
      description: 'Párrafo completo copiado de la fuente...',
      gradient: 'red', // red, amber, blue, green
    },
  },

  // 3. IMAGE TEXT - Para secciones con imagen
  {
    block_type: 'image_text',
    block_order: 2,
    block_data: {
      image: IMG.features[0],
      title: 'Título de la Sección',
      description: 'Descripción completa de la fuente...',
      layout: 'image_left', // image_left, image_right
    },
  },

  // 4. FEATURE GRID - Para lista de características
  {
    block_type: 'feature_grid',
    block_order: 3,
    block_data: {
      title: 'Características Principales',
      features: [
        {
          title: 'Feature 1',
          description: 'Descripción...',
          image: IMG.features[1],
        },
        // ... más features
      ],
    },
  },

  // 5. GALLERY - Para galería de imágenes muestra
  {
    block_type: 'gallery',
    block_order: 4,
    block_data: {
      title: 'Galería de Imágenes',
      columns: 3,
      images: IMG.lifestyle,
    },
  },

  // 6. SPECIFICATIONS - Para specs técnicas
  {
    block_type: 'specifications',
    block_order: 5,
    block_data: {
      categories: [
        {
          name: 'Sensor',
          specs: [
            { label: 'Tipo', value: 'CMOS Full Frame' },
            { label: 'Megapíxeles', value: '24.2 MP' },
          ],
        },
        {
          name: 'Video',
          specs: [
            { label: 'Resolución', value: '6K RAW' },
          ],
        },
      ],
    },
  },

  // 7. CTA BUTTONS - Enlaces de acción
  {
    block_type: 'cta_buttons',
    block_order: 6,
    block_data: {
      buttons: [
        { label: 'Ver en Canon', url: 'https://...', style: 'primary' },
        { label: 'Descargar Manual', url: 'https://...', style: 'secondary' },
      ],
    },
  },
];

// ============================================================================
// MAIN - No modificar
// ============================================================================
async function seed() {
  console.log('🚀 Starting seed...\n');
  
  // 1. Verificar producto existe
  const { data: product, error: searchError } = await supabase
    .from('brochure_products')
    .select('*')
    .eq('id', TARGET_PRODUCT_ID)
    .single();
  
  if (searchError || !product) {
    console.error('❌ Product not found:', TARGET_PRODUCT_ID);
    console.error('   Ejecuta: node scripts/find-product.mjs');
    return;
  }
  
  console.log(`✅ Found: ${product.name} (${product.id})`);
  
  // 2. Eliminar bloques existentes
  const { error: deleteError } = await supabase
    .from('brochure_product_blocks')
    .delete()
    .eq('product_id', TARGET_PRODUCT_ID);
  
  if (deleteError) {
    console.error('❌ Error deleting blocks:', deleteError);
    return;
  }
  console.log('🗑️  Deleted existing blocks');
  
  // 3. Insertar nuevos bloques
  const blocksToInsert = BLOCKS.map(block => ({
    product_id: TARGET_PRODUCT_ID,
    block_type: block.block_type,
    block_order: block.block_order,
    block_data: block.block_data,
  }));
  
  const { data: inserted, error: insertError } = await supabase
    .from('brochure_product_blocks')
    .insert(blocksToInsert)
    .select();
  
  if (insertError) {
    console.error('❌ Error inserting:', insertError);
    return;
  }
  
  console.log(`\n✅ Inserted ${inserted.length} blocks`);
  
  // 4. Resumen
  console.log('\n📋 Blocks:');
  inserted.forEach((b, i) => {
    console.log(`${i + 1}. [${b.block_type}] ${b.block_data?.title || b.block_data?.name}`);
  });
  
  console.log('\n🎉 Done!');
}

seed().catch(console.error);
```

---

## 🏗️ Arquitectura del Sistema

### Tablas en Supabase

```
brochure_products (productos)
       ↓
       └── brochure_product_blocks (bloques de contenido)
```

### Tabla: `brochure_products`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | Identificador único (auto-generado) |
| `name` | TEXT | Nombre del producto (ej: "EOS R1 BODY") |
| `category` | TEXT | Categoría (cameras, lenses, etc.) |
| `image` | TEXT | URL de imagen principal |
| `description` | TEXT | Descripción corta |

### Tabla: `brochure_product_blocks`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | Identificador único |
| `product_id` | UUID | **FK a brochure_products.id** |
| `block_type` | TEXT | Tipo de bloque (ver sección siguiente) |
| `block_order` | INTEGER | Orden de renderizado (0, 1, 2...) |
| `block_data` | JSONB | **Contenido del bloque** |

> ⚠️ **Nombres de columnas correctos**: `block_type`, `block_order`, `block_data`  
> ❌ **NO usar**: `type`, `sort_order`, `content`, `data`

---

## 🧱 Tipos de Bloques Válidos

Los tipos de bloques están definidos en `src/components/product-detail/BlockRenderers.jsx`:

| block_type | Descripción | Propiedades Principales |
|------------|-------------|------------------------|
| `hero_header` | Galería de producto + info | `name`, `images`, `colors`, `keyFeatures` |
| `hero_section` | Banner con gradiente | `title`, `subtitle`, `description`, `gradient` |
| `image_text` | Imagen + texto | `image`, `title`, `description`, `layout` |
| `text_only` | Solo texto | `title`, `description` |
| `feature_grid` | Cuadrícula de features | `features[]` |
| `icon_list` | Lista con iconos | `items[]` |
| `video` | Video embed | `videoUrl`, `title` |
| `gallery` | Galería de imágenes | `images[]`, `columns` |
| `image_banner` | Banner de imagen | `image`, `title` |
| `specifications` | Especificaciones acordeón | `categories[]` |
| `cta_buttons` | Botones de acción | `buttons[]` |
| `kits_section` | Sección de kits | `kits[]` |

> ⚠️ **Tipos que NO existen**: `hero`, `highlight`, `image_gallery`, `specs`

---

## ❌ Problemas Comunes y Soluciones

### Problema 1: "La página no muestra los cambios"

**Causa**: Los bloques se insertaron en un producto que NO es el que se carga en la URL.

**Diagnóstico**:
```javascript
// Verificar qué producto genera el slug
const products = await supabase.from('brochure_products').select('id, name');
const blocks = await supabase.from('brochure_product_blocks').select('product_id');

products.data.forEach(p => {
  const slug = generateSlug(p.name);
  const hasBlocks = blocks.data.some(b => b.product_id === p.id);
  if (slug === 'tu-slug-aqui') {
    console.log('MATCH:', p.id, p.name, 'Has Blocks:', hasBlocks);
  }
});
```

**Solución**: Usar el `product_id` del producto que genera el slug correcto.

---

### Problema 2: "Error: column 'content' does not exist"

**Causa**: Usando nombres de columnas incorrectos.

| ❌ Incorrecto | ✅ Correcto |
|--------------|-------------|
| `content` | `block_data` |
| `type` | `block_type` |
| `sort_order` | `block_order` |
| `data` | `block_data` |

---

### Problema 3: "Los bloques se insertan pero no se renderizan"

**Causa**: Usando `block_type` que no existe en `BlockRenderers.jsx`.

| ❌ NO existe | ✅ Usar en su lugar |
|-------------|---------------------|
| `hero` | `hero_header` o `hero_section` |
| `highlight` | `image_text` |
| `image_gallery` | `gallery` |
| `specs` | `specifications` |

---

### Problema 4: "Hay dos productos con el mismo nombre"

**Causa**: Se creó un producto nuevo en vez de usar el existente.

**Solución**: 
1. Siempre buscar primero si el producto existe
2. Usar el `TARGET_PRODUCT_ID` explícitamente
3. NO crear productos nuevos desde el seed

---

## ✅ Checklist de Verificación

Antes de ejecutar un seed, verifica:

- [ ] **Product ID**: ¿Estoy usando el ID del producto que genera el slug correcto?
- [ ] **Nombres de columnas**: ¿Uso `block_type`, `block_order`, `block_data`?
- [ ] **Tipos de bloque**: ¿Todos los `block_type` existen en `BlockRenderers.jsx`?
- [ ] **Orden de bloques**: ¿Los `block_order` empiezan en 0 y son consecutivos?
- [ ] **Estructura de datos**: ¿El `block_data` tiene las propiedades correctas para cada tipo?

Después de ejecutar:

- [ ] ¿El script reportó los bloques insertados correctamente?
- [ ] ¿La página `/product/[slug]` muestra el contenido nuevo?
- [ ] ¿Las imágenes cargan correctamente?
- [ ] ¿No hay errores en la consola del navegador?

---

## 🔧 Scripts de Utilidad

### Verificar productos y bloques

```bash
# Archivo: scripts/check-products.mjs
node scripts/check-products.mjs
```

### Listar todos los productos con bloques

```javascript
const { data } = await supabase
  .from('brochure_product_blocks')
  .select('product_id, brochure_products(name)')
  .order('product_id');

const grouped = data.reduce((acc, b) => {
  acc[b.product_id] = acc[b.product_id] || { name: b.brochure_products?.name, count: 0 };
  acc[b.product_id].count++;
  return acc;
}, {});

console.table(grouped);
```

---

## 📚 Archivos de Referencia

| Archivo | Descripción |
|---------|-------------|
| `src/components/product-detail/BlockRenderers.jsx` | Definición de todos los bloques |
| `src/lib/productDetailDB.js` | Lógica de carga de productos y slugs |
| `src/pages/ProductDetailPage.jsx` | Página que renderiza los bloques |
| `scripts/scrapy-canon/` | Spiders de Scrapy para Canon UK/Europe |
| `scripts/scrape-canon-product.cjs` | Scraper Puppeteer para Canon Asia |
| `scripts/seed-eos-r1.mjs` | Ejemplo de seed funcional |
| `scripts/seed-powershot-pick.mjs` | Otro ejemplo de seed |
| `scripts/find-product.mjs` | Utilidad para encontrar product_id |

---

## 🎯 Resumen Ejecutivo

### El Flujo Completo

```
1. SCRAPEAR    →  scrapy crawl canon_europe -a url="..." -o scraped.json
2. ANALIZAR    →  Revisar JSON, mapear imágenes y secciones
3. ENCONTRAR   →  node scripts/find-product.mjs (obtener product_id)
4. SEEDEAR     →  Crear seed-[producto].mjs con product_id correcto
5. EJECUTAR    →  node scripts/seed-[producto].mjs
6. VERIFICAR   →  Abrir /product/[slug] en el navegador
```

### Reglas de Oro

1. **SCRAPEAR** antes de crear el seed - no inventar contenido
2. **SIEMPRE** encontrar el `product_id` correcto con `find-product.mjs`
3. **NUNCA** crear productos nuevos desde seeds
4. **SIEMPRE** usar nombres de columnas exactos: `block_type`, `block_order`, `block_data`
5. **SIEMPRE** usar tipos de bloque de `BlockRenderers.jsx`
6. **SIEMPRE** verificar la página después de ejecutar

### Comandos Rápidos

```bash
# Scrapear Canon UK
cd scripts/scrapy-canon && python3 -m scrapy crawl canon_europe -a url="https://www.canon.co.uk/cameras/eos-r5-mark-ii/" -o ../scraped-eos-r5-ii.json

# Scrapear Canon Asia
node scripts/scrape-canon-product.cjs https://asia.canon/en/consumer/eos-r8/body/product scraped-eos-r8

# Encontrar product_id
node scripts/find-product.mjs

# Ejecutar seed
node scripts/seed-[producto].mjs

# Verificar bloques insertados
node scripts/check-r1.mjs
```
