# 📦 Guía Paso a Paso: Crear Productos e InPages en Canon InPage Maker

> **Última actualización:** Marzo 2026  
> **Propósito:** Documentar el proceso completo para que CUALQUIER persona pueda crear un producto nuevo con su InPage y que todo quede correctamente guardado en Supabase.

---

## 📋 Índice

1. [Resumen del Sistema](#1-resumen-del-sistema)
2. [Esquema de Base de Datos](#2-esquema-de-base-de-datos)
3. [Módulos Disponibles (1-9)](#3-módulos-disponibles-1-9)
4. [Proceso Completo Paso a Paso](#4-proceso-completo-paso-a-paso)
5. [Crear el Producto en Supabase](#5-crear-el-producto-en-supabase)
6. [Obtener Contenido (Scraping)](#6-obtener-contenido-scraping)
7. [Crear el Seed Script](#7-crear-el-seed-script)
8. [Ejecutar el Seed Script](#8-ejecutar-el-seed-script)
9. [Verificación](#9-verificación)
10. [Editar InPages desde la App](#10-editar-inpages-desde-la-app)
11. [Flujo de Guardado (saveManager)](#11-flujo-de-guardado-savemanager)
12. [Flujo de Carga (loadInPage)](#12-flujo-de-carga-loadinpage)
13. [Imágenes y Storage](#13-imágenes-y-storage)
14. [Reglas de Falabella](#14-reglas-de-falabella)
15. [Errores Comunes y Soluciones](#15-errores-comunes-y-soluciones)
16. [Checklist Final](#16-checklist-final)

---

## 1. Resumen del Sistema

### ¿Qué es el InPage Maker?

Es una app React que permite crear, editar y exportar InPages (páginas de producto para Falabella) usando módulos predefinidos. Todo se almacena en **Supabase** (base de datos + storage de imágenes).

### Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   products   │  │inpage_blocks │  │ edit_history │      │
│  │              │──│              │  │              │      │
│  │ id, sku,     │  │ product_id,  │  │ product_id,  │      │
│  │ name,        │  │ module_id,   │  │ action,      │      │
│  │ category,    │  │ block_order, │  │ details,     │      │
│  │ image_folder │  │ block_data   │  │ timestamp    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │         STORAGE: inpage-images (bucket)           │      │
│  │    Imágenes subidas desde la app por producto     │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              REACT FRONTEND (Netlify)                        │
├─────────────────────────────────────────────────────────────┤
│  Dashboard → Editor → Preview → Export (Excel + ZIP)        │
│                                                             │
│  Archivos clave:                                            │
│  • src/data/supabaseData.js   → carga productos/bloques    │
│  • src/utils/saveManager.js   → guarda cambios a Supabase  │
│  • src/lib/supabase.js        → configuración del cliente   │
│  • src/config/falabellaRules.js → definición de módulos     │
│  • src/data/canonInPages.js   → datos fallback (4 campañas)│
└─────────────────────────────────────────────────────────────┘
```

### Regla de Oro

> **TODO producto debe existir en la tabla `products` Y sus bloques deben existir en `inpage_blocks`.**  
> Si un producto solo existe en código JS (staticData) pero no en `inpage_blocks`, las ediciones del usuario se pierden al recargar.

---

## 2. Esquema de Base de Datos

### Tabla `products`

| Columna | Tipo | Descripción | Ejemplo |
|---------|------|-------------|---------|
| `id` | TEXT (PK) | Identificador único del producto | `eos-r8` |
| `name` | TEXT | Nombre del producto | `EOS R8` |
| `sku` | TEXT | SKU de Falabella | `17507574` |
| `category` | TEXT | Categoría | `Photo` |
| `image_folder` | TEXT | Carpeta en Storage | `eos-r8` |
| `is_template` | BOOLEAN | Si es plantilla | `false` |
| `excel_path` | TEXT | Ruta del Excel (si hay) | `null` |
| `badges` | TEXT[] | Etiquetas | `[]` |
| `created_at` | TIMESTAMPTZ | Fecha creación | auto |
| `updated_at` | TIMESTAMPTZ | Fecha actualización | auto |

### Tabla `inpage_blocks`

| Columna | Tipo | Descripción | Ejemplo |
|---------|------|-------------|---------|
| `id` | SERIAL (PK) | ID autoincremental | `42` |
| `product_id` | TEXT (FK) | Referencia a products.id | `eos-r8` |
| `module_id` | INTEGER | Tipo de módulo (1-9) | `6` |
| `block_order` | INTEGER | Posición en la página | `1` |
| `block_data` | JSONB | Contenido del bloque | `{"title": "...", "image": "..."}` |
| `created_at` | TIMESTAMPTZ | Fecha creación | auto |
| `updated_at` | TIMESTAMPTZ | Fecha actualización | auto |

### Tabla `edit_history`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | SERIAL (PK) | ID autoincremental |
| `product_id` | TEXT (FK) | Referencia a products.id |
| `action` | TEXT | Tipo de acción (`save`, `save_blocks`) |
| `details` | JSONB | Detalles de la acción |
| `created_at` | TIMESTAMPTZ | Timestamp automático |

---

## 3. Módulos Disponibles (1-9)

Estos son los 9 módulos que Falabella acepta para InPages. Cada `moduleId` tiene campos específicos.

### Módulo 1: Banner Principal Sin Texto
- **Imagen:** 1160 × 480 px
- **Campos:** `image`, `altImage`
- **Uso:** Banner hero sin texto, solo imagen

```json
{
  "moduleId": 1,
  "data": {
    "image": "URL_o_ruta_de_imagen",
    "altImage": "Texto alternativo para accesibilidad"
  }
}
```

### Módulo 2: Texto en Dos Columnas
- **Imagen:** Ninguna
- **Campos:** `title`, `col1Text`, `col2Text`
- **Uso:** Comparaciones, texto dividido

```json
{
  "moduleId": 2,
  "data": {
    "title": "Título del bloque",
    "col1Text": "Texto columna izquierda",
    "col2Text": "Texto columna derecha"
  }
}
```

### Módulo 3: Imagen y Texto (imagen izquierda)
- **Imagen:** 560 × 315 px
- **Campos:** `image`, `altImage`, `title`, `description`
- **Uso:** Feature con imagen a la izquierda

```json
{
  "moduleId": 3,
  "data": {
    "image": "URL_de_imagen",
    "altImage": "Descripción de la imagen",
    "title": "Título del feature",
    "description": "Descripción detallada del feature..."
  }
}
```

### Módulo 4: Texto e Imagen (imagen derecha)
- **Imagen:** 560 × 315 px
- **Campos:** `title`, `description`, `image`, `altImage`
- **Uso:** Feature con imagen a la derecha (alternar con Módulo 3)

```json
{
  "moduleId": 4,
  "data": {
    "title": "Título del feature",
    "description": "Descripción detallada...",
    "image": "URL_de_imagen",
    "altImage": "Descripción de la imagen"
  }
}
```

### Módulo 5: Lista en Dos Columnas
- **Imagen:** Ninguna
- **Campos:** `title`, `item1` a `item8`
- **Uso:** Specs destacadas, características clave

```json
{
  "moduleId": 5,
  "data": {
    "title": "Especificaciones Destacadas",
    "item1": "Sensor CMOS 24,2 MP",
    "item2": "Procesador DIGIC X",
    "item3": "Video 4K UHD 60p",
    "item4": "Dual Pixel CMOS AF II",
    "item5": "Pantalla articulada 3\"",
    "item6": "WiFi + Bluetooth",
    "item7": "USB-C · Peso 461 g",
    "item8": "Batería LP-E17"
  }
}
```

### Módulo 6: Banner Grande y Texto
- **Imagen:** 1160 × 360 px
- **Campos:** `image`, `altImage`, `title`, `description`
- **Uso:** Header principal del InPage (normalmente el primer bloque)

```json
{
  "moduleId": 6,
  "data": {
    "image": "URL_de_imagen_hero",
    "altImage": "Canon EOS R8 - Cámara mirrorless full frame",
    "title": "EOS R8: Full Frame Para Todos",
    "description": "Descripción larga del producto con sus principales ventajas..."
  }
}
```

### Módulo 7: Dos Imágenes con Texto
- **Imágenes:** 560 × 315 px (cada una)
- **Campos:** `leftImage`, `leftAlt`, `leftTitle`, `leftText`, `rightImage`, `rightAlt`, `rightTitle`, `rightText`
- **Uso:** Dos features lado a lado

```json
{
  "moduleId": 7,
  "data": {
    "leftImage": "URL_imagen_izquierda",
    "leftAlt": "Alt imagen izquierda",
    "leftTitle": "Título izquierdo",
    "leftText": "Descripción izquierda...",
    "rightImage": "URL_imagen_derecha",
    "rightAlt": "Alt imagen derecha",
    "rightTitle": "Título derecho",
    "rightText": "Descripción derecha..."
  }
}
```

### Módulo 8: Video y Texto
- **Imagen:** Ninguna (usa video de YouTube)
- **Campos:** `youtubeCode`, `title`, `description`
- **Uso:** Video oficial del producto

```json
{
  "moduleId": 8,
  "data": {
    "youtubeCode": "dQw4w9WgXcQ",
    "title": "Canon EOS R8 en Acción",
    "description": "Descubre todo lo que la EOS R8 puede hacer..."
  }
}
```

> ⚠️ **IMPORTANTE:** Solo el código del video (ej: `dQw4w9WgXcQ`), NO la URL completa de YouTube.

### Módulo 9: Banner Clickeable
- **Imagen:** 1160 × 480 px
- **Campos:** `url`, `image`, `altImage`
- **Uso:** Banner promocional con link

```json
{
  "moduleId": 9,
  "data": {
    "url": "https://www.falabella.com/canon-promo",
    "image": "URL_de_imagen",
    "altImage": "Texto alternativo"
  }
}
```

---

## 4. Proceso Completo Paso a Paso

### Diagrama del Flujo

```
 ┌──────────────────────────────────────────────────────────────┐
 │ PASO 1: Crear producto en tabla `products` de Supabase       │
 └──────────────────────┬───────────────────────────────────────┘
                        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ PASO 2: Recopilar contenido (scraping o manual)              │
 │         - Imágenes del producto                              │
 │         - Textos, títulos, descripciones                     │
 │         - Video de YouTube (si hay)                          │
 │         - Especificaciones técnicas                          │
 └──────────────────────┬───────────────────────────────────────┘
                        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ PASO 3: Planificar la estructura del InPage                  │
 │         - Elegir qué módulos usar (6, 3, 4, 7, 8, 5...)     │
 │         - Decidir el orden de los bloques                    │
 │         - Asignar imágenes a cada bloque                     │
 └──────────────────────┬───────────────────────────────────────┘
                        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ PASO 4: Crear el seed script (.mjs)                          │
 │         - Definir el array de bloques                        │
 │         - Cada bloque con moduleId + data                    │
 └──────────────────────┬───────────────────────────────────────┘
                        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ PASO 5: Ejecutar el seed → `node scripts/seed-[producto].mjs│
 │         - Inserta bloques en `inpage_blocks`                 │
 │         - Registra en `edit_history`                         │
 └──────────────────────┬───────────────────────────────────────┘
                        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ PASO 6: Verificar en Supabase y en la app                    │
 │         - SQL: SELECT count(*) FROM inpage_blocks ...        │
 │         - App: abrir el producto y revisar bloques           │
 └──────────────────────┬───────────────────────────────────────┘
                        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ PASO 7: Editar desde la app (reemplazar imágenes, textos)    │
 │         - Las ediciones se guardan directo en Supabase       │
 │         - Las imágenes nuevas se suben al bucket             │
 └──────────────────────────────────────────────────────────────┘
```

---

## 5. Crear el Producto en Supabase

### Opción A: Desde el SQL Editor de Supabase

Ir a https://supabase.com/dashboard → SQL Editor y ejecutar:

```sql
INSERT INTO products (id, name, sku, category, image_folder, is_template)
VALUES (
  'eos-r8',                    -- id: slug único (minúsculas, guiones)
  'EOS R8',                    -- name: nombre para mostrar
  '12345678',                  -- sku: SKU de Falabella
  'Photo',                     -- category: Photo, Video, Print, etc.
  'eos-r8',                    -- image_folder: carpeta en Storage
  false                        -- is_template
);
```

### Opción B: Desde un script Node.js

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bupnqihroawrvcvzpbqv.supabase.co',
  'SERVICE_ROLE_KEY'  // Usar la service role key (ver src/lib/supabase.js)
);

const { data, error } = await supabase.from('products').upsert({
  id: 'eos-r8',
  name: 'EOS R8',
  sku: '12345678',
  category: 'Photo',
  image_folder: 'eos-r8',
  is_template: false,
}).select().single();
```

### Convenciones para el `id`

| Producto | ID | Regla |
|----------|----|-------|
| EOS R8 | `eos-r8` | Nombre en minúsculas con guiones |
| EOS R6 Mark III | `eos-r6-mark-iii` | Incluir "mark" si aplica |
| PowerShot G7X Mark III | `g7x-iii` | Abreviación aceptable |
| EOS R10 + RF-S 18-45mm | `r10-18-45` | Incluir lente si es kit |
| PIXMA G4180 | `pixma-g4180` | Serie + modelo |

### Verificar que se creó

```sql
SELECT id, name, sku, category FROM products WHERE id = 'eos-r8';
```

---

## 6. Obtener Contenido (Scraping)

### Opción A: Scraping con Puppeteer (Canon Asia)

```bash
cd "/Users/javohv/Desktop/Apps/Javo Apps"
node scripts/scrape-canon-product.cjs \
  "https://asia.canon/en/consumer/eos-r8/body/product" \
  scraped-eos-r8
```

Esto genera `scripts/scraped-eos-r8.json` con:
- `productInfo.name` → nombre del producto
- `productInfo.sections[]` → secciones con título y descripción
- `images.hero[]` → imágenes principales
- `images.angles[]` → vistas del producto (frente, atrás, arriba, etc.)
- `images.features[]` → imágenes de features

### Opción B: Scraping con Scrapy (Canon UK/Europe)

```bash
cd scripts/scrapy-canon
pip3 install -r requirements.txt
python3 -m scrapy crawl canon_europe \
  -a url="https://www.canon.co.uk/cameras/eos-r8/" \
  -o ../scraped-eos-r8.json
```

### Opción C: Contenido manual

Si ya tienes las imágenes y textos (de un brief, PPT, etc.), puedes escribir los bloques directamente sin scrapear.

### Validar el JSON scrapeado

```bash
node -e "
const data = require('./scripts/scraped-eos-r8.json');
console.log('Nombre:', data[0]?.productInfo?.name || data.productInfo?.name);
console.log('Secciones:', (data[0]?.productInfo?.sections || data.productInfo?.sections)?.length);
console.log('Total imágenes:', data[0]?.totalImages || data.totalImages);
"
```

**Checklist de validación:**
- [ ] El nombre del producto es correcto
- [ ] Hay al menos 5 secciones de contenido
- [ ] Hay imágenes de ángulos del producto (frente, atrás, arriba, etc.)
- [ ] Las URLs de imágenes empiezan con `https://`
- [ ] No hay secciones duplicadas

---

## 7. Crear el Seed Script

### Estructura recomendada de un InPage

La mayoría de InPages de Canon siguen este patrón:

| Orden | Módulo | Descripción |
|-------|--------|-------------|
| 1 | **6** (Banner + Texto) | Hero del producto con título y descripción general |
| 2 | **3** (Img izq + Texto) | Primer feature destacado |
| 3 | **4** (Texto + Img der) | Segundo feature (alterna posición) |
| 4 | **3** (Img izq + Texto) | Tercer feature |
| 5 | **4** (Texto + Img der) | Cuarto feature |
| 6 | **7** (Dos imágenes) | Dos features lado a lado |
| 7 | **8** (Video) | Video oficial de YouTube |
| 8 | **5** (Lista) | Specs destacadas en 8 puntos |

### Plantilla base del seed script

Crear el archivo `scripts/seed-[product-id].mjs`:

```javascript
/**
 * Seed: [Nombre del Producto]
 * SKU: [SKU de Falabella]
 * Fecha: [YYYY-MM-DD]
 *
 * Ejecución: node scripts/seed-[product-id].mjs
 */

import { createClient } from '@supabase/supabase-js';

// ─── Supabase (service role key para bypass RLS) ─────────────
const supabase = createClient(
  'https://bupnqihroawrvcvzpbqv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo'
);

// ─── Configuración ───────────────────────────────────────────
const PRODUCT_ID = 'eos-r8';  // Debe existir en tabla products

// ─── Bloques del InPage ──────────────────────────────────────
const BLOCKS = [
  // Bloque 1: Banner Hero (Módulo 6)
  {
    moduleId: 6,
    data: {
      image: 'https://asia.canon/media/image/.../hero.png',
      altImage: 'Canon EOS R8 - Cámara mirrorless full frame',
      title: 'EOS R8: Full Frame Para Todos',
      description: 'Descripción general del producto...',
    },
  },

  // Bloque 2: Feature 1 (Módulo 3 - imagen izquierda)
  {
    moduleId: 3,
    data: {
      image: 'https://asia.canon/media/image/.../sensor.png',
      altImage: 'Sensor Full Frame 24.2 MP Canon EOS R8',
      title: 'Sensor Full Frame de 24,2 MP',
      description: 'Descripción del sensor...',
    },
  },

  // Bloque 3: Feature 2 (Módulo 4 - imagen derecha)
  {
    moduleId: 4,
    data: {
      title: 'Video 4K a 60p con Sobremuestreo 6K',
      description: 'Descripción del video...',
      image: 'https://asia.canon/media/image/.../video.png',
      altImage: 'Canon EOS R8 grabando video 4K',
    },
  },

  // Bloque 4: Feature 3 (Módulo 3 - imagen izquierda)
  {
    moduleId: 3,
    data: {
      image: 'https://asia.canon/media/image/.../af.png',
      altImage: 'Canon EOS R8 sistema autofocus',
      title: 'EOS iTR AF X con Detección de Sujetos',
      description: 'Descripción del autofocus...',
    },
  },

  // Bloque 5: Feature 4 (Módulo 4 - imagen derecha)
  {
    moduleId: 4,
    data: {
      title: 'Conectividad WiFi y USB-C Streaming',
      description: 'Descripción de conectividad...',
      image: 'https://asia.canon/media/image/.../connectivity.png',
      altImage: 'Canon EOS R8 conectividad USB-C WiFi',
    },
  },

  // Bloque 6: Dos features (Módulo 7)
  {
    moduleId: 7,
    data: {
      leftImage: 'https://asia.canon/media/image/.../left.png',
      leftAlt: 'Canon EOS R8 pantalla articulada',
      leftTitle: 'Pantalla Vari-angle Tactil',
      leftText: 'Descripción pantalla...',
      rightImage: 'https://asia.canon/media/image/.../right.png',
      rightAlt: 'Canon EOS R8 diseño compacto',
      rightTitle: 'Diseño Compacto y Ligero',
      rightText: 'Descripción diseño...',
    },
  },

  // Bloque 7: Video de YouTube (Módulo 8)
  {
    moduleId: 8,
    data: {
      youtubeCode: 'YOUTUBE_VIDEO_ID',  // Solo el ID, NO la URL completa
      title: 'Canon EOS R8 en Acción',
      description: 'Descubre todo lo que la EOS R8 ofrece...',
    },
  },

  // Bloque 8: Specs (Módulo 5)
  {
    moduleId: 5,
    data: {
      title: 'Especificaciones Destacadas',
      item1: 'Sensor Full Frame CMOS 24,2 MP',
      item2: 'Procesador DIGIC X',
      item3: 'Video 4K UHD 60p (6K oversampling)',
      item4: 'EOS iTR AF X + Dual Pixel CMOS AF II',
      item5: 'Pantalla articulada 3" touchscreen',
      item6: 'EVF integrado 2,36M puntos',
      item7: 'WiFi · Bluetooth · USB-C',
      item8: 'Peso 461 g · Batería LP-E17',
    },
  },
];

// ─── Ejecución ───────────────────────────────────────────────
async function main() {
  console.log(`🚀 Seeding ${PRODUCT_ID}...\n`);

  // 1. Verificar que el producto exista en la tabla products
  const { data: product, error: checkErr } = await supabase
    .from('products')
    .select('id, name')
    .eq('id', PRODUCT_ID)
    .single();

  if (checkErr) {
    console.error(`❌ Producto "${PRODUCT_ID}" NO existe en la tabla products.`);
    console.error('   Créalo primero (ver sección 5 de la guía).');
    process.exit(1);
  }
  console.log(`✓ Producto encontrado: ${product.name}`);

  // 2. Eliminar bloques anteriores (para poder re-ejecutar)
  const { error: delErr } = await supabase
    .from('inpage_blocks')
    .delete()
    .eq('product_id', PRODUCT_ID);

  if (delErr) {
    console.error('❌ Error eliminando bloques:', delErr.message);
    process.exit(1);
  }
  console.log('✓ Bloques anteriores eliminados');

  // 3. Insertar nuevos bloques
  const rows = BLOCKS.map((block, index) => ({
    product_id: PRODUCT_ID,
    block_order: index + 1,   // 1-based
    module_id: block.moduleId,
    block_data: block.data,
  }));

  const { error: insErr } = await supabase
    .from('inpage_blocks')
    .insert(rows);

  if (insErr) {
    console.error('❌ Error insertando bloques:', insErr.message);
    process.exit(1);
  }
  console.log(`✓ ${rows.length} bloques insertados`);

  // 4. Registrar en historial
  await supabase.from('edit_history').insert([{
    product_id: PRODUCT_ID,
    action: 'seed',
    details: {
      blocksCount: rows.length,
      timestamp: new Date().toISOString(),
      source: 'seed-script',
    },
  }]);

  // 5. Verificar
  const { count } = await supabase
    .from('inpage_blocks')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', PRODUCT_ID);

  console.log(`\n✅ Seed completado: ${count} bloques en Supabase para "${PRODUCT_ID}"`);
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
```

### Reglas para escribir el contenido

**Títulos:**
- Usar título caso (mayúscula en cada palabra importante)
- Máximo 60 caracteres
- Incluir el nombre del feature principal

**Descripciones:**
- 2-4 oraciones por bloque
- Incluir datos técnicos específicos (MP, fps, mm, etc.)
- Describir el beneficio para el usuario, no solo la spec
- Máximo ~300 caracteres por descripción

**Alt de imágenes:**
- Describir qué se ve en la imagen
- Incluir nombre del producto + feature
- Ejemplo: `"Canon EOS R8 sensor Full Frame 24.2 megapíxeles"`

**YouTube Code:**
- Solo el ID: `MtFleOwUBZU` ✅
- NO la URL: `https://www.youtube.com/watch?v=MtFleOwUBZU` ❌

---

## 8. Ejecutar el Seed Script

```bash
cd "/Users/javohv/Desktop/Apps/Javo Apps"
node scripts/seed-eos-r8.mjs
```

**Output esperado:**
```
🚀 Seeding eos-r8...

✓ Producto encontrado: EOS R8
✓ Bloques anteriores eliminados
✓ 8 bloques insertados

✅ Seed completado: 8 bloques en Supabase para "eos-r8"
```

**Si hay error:**
```
❌ Producto "eos-r8" NO existe en la tabla products.
   Créalo primero (ver sección 5 de la guía).
```
→ Ve a la sección 5 y crea el producto primero.

---

## 9. Verificación

### Verificar en Supabase (SQL Editor)

```sql
-- Ver los bloques del producto
SELECT product_id, module_id, block_order, 
       block_data->>'title' as title
FROM inpage_blocks 
WHERE product_id = 'eos-r8' 
ORDER BY block_order;

-- Contar bloques por producto
SELECT product_id, count(*) as bloques 
FROM inpage_blocks 
GROUP BY product_id 
ORDER BY product_id;
```

### Verificar desde la terminal

```bash
node -e "
import { createClient } from '@supabase/supabase-js';
const s = createClient('https://bupnqihroawrvcvzpbqv.supabase.co', 'SERVICE_ROLE_KEY');
const { count } = await s.from('inpage_blocks').select('*', { count: 'exact', head: true }).eq('product_id', 'eos-r8');
console.log('eos-r8:', count, 'bloques');
"
```

### Verificar en la app

1. Abrir la app (`npm run dev` o la URL de Netlify)
2. Buscar el producto en el Dashboard
3. Hacer click para editar
4. Verificar que aparecen todos los bloques con sus imágenes y textos

---

## 10. Editar InPages desde la App

Una vez que el producto tiene bloques en Supabase, se puede editar directamente desde la interfaz:

### Cómo funciona

1. El usuario abre un producto en el editor
2. `loadInPage()` carga los bloques desde `inpage_blocks` en Supabase
3. El usuario puede:
   - **Cambiar textos** directamente en los campos de cada bloque
   - **Subir imágenes nuevas** que reemplazan las existentes
   - **Reordenar bloques** arrastrándolos
   - **Agregar/eliminar bloques** con el selector de módulos
4. Al hacer click en **"Guardar"**, `saveInPage()` se encarga de:
   - Subir imágenes nuevas al bucket `inpage-images`
   - Eliminar los bloques viejos de Supabase
   - Insertar los bloques actualizados con las URLs nuevas
   - Invalidar el caché para que al recargar se vean los cambios

### Lo que sucede al subir una imagen nueva

```
Usuario sube imagen → File/Blob en memoria
                          │
    Click "Guardar" ──────┘
                          │
                          ▼
    saveImage() → Upload al bucket:
        inpage-images/[product-id]/block0_image_[timestamp]_[random].jpg
                          │
                          ▼
    URL pública de Supabase reemplaza el File/Blob en block_data:
        https://bupnqihroawrvcvzpbqv.supabase.co/storage/v1/object/public/inpage-images/...
                          │
                          ▼
    block_data guardado en inpage_blocks con la URL nueva
```

---

## 11. Flujo de Guardado (saveManager)

Archivo: `src/utils/saveManager.js`

### Diagrama detallado

```
saveInPage({ productId, sku, blocks, imagePath })
      │
      ├── Para cada bloque:
      │   ├── Para cada campo de imagen (image, leftImage, rightImage):
      │   │   │
      │   │   ├── ¿Es File o Blob? → SUBIR al bucket con supabaseAdmin
      │   │   ├── ¿Es blob: URL?   → Convertir a Blob → SUBIR
      │   │   ├── ¿Es URL de supabase.co? → No tocar (ya está subida)
      │   │   └── ¿Es otra URL http? → No tocar
      │   │
      │   └── Reemplazar File/Blob con la URL pública resultante
      │
      ├── Si hubo errores de upload → THROW error (no guarda parcial)
      │
      ├── DELETE FROM inpage_blocks WHERE product_id = ?  (usa supabaseAdmin)
      │
      ├── INSERT INTO inpage_blocks (usa supabaseAdmin)
      │   → product_id, block_order, module_id, block_data
      │
      ├── INSERT INTO edit_history (opcional, no falla si hay error)
      │
      └── invalidateCache(productId)  → limpia caché local
```

### Clientes de Supabase

| Cliente | Key | Uso | Permisos |
|---------|-----|-----|----------|
| `supabase` | Anon Key | Lectura de datos (SELECT) | RLS activo (solo lectura) |
| `supabaseAdmin` | Service Role Key | Escritura (INSERT/DELETE/UPDATE), uploads | Bypass RLS (permisos completos) |

> ⚠️ **Siempre usar `supabaseAdmin`** para operaciones de escritura (INSERT, DELETE, UPDATE, Upload). El cliente `supabase` con anon key puede ser bloqueado por RLS.

---

## 12. Flujo de Carga (loadInPage)

Archivo: `src/data/supabaseData.js`

### Diagrama

```
loadInPage(item)
      │
      ├── ¿Está en caché local? → SÍ → Retornar caché
      │
      ├── Consultar Supabase:
      │   SELECT * FROM inpage_blocks
      │   WHERE product_id = item.id
      │   ORDER BY block_order ASC
      │
      ├── ¿Hay bloques en Supabase?
      │   │
      │   ├── SÍ → Procesar bloques:
      │   │        - Resolver URLs de imágenes relativas
      │   │        - Convertir al formato del frontend
      │   │        - Guardar en caché
      │   │        - Retornar
      │   │
      │   └── NO → ¿Tiene staticData (producto de campaña)?
      │            │
      │            ├── SÍ → Retornar bloques del staticData (fallback)
      │            └── NO → Retornar bloques vacíos []
      │
      └── Error de red → ¿Tiene staticData?
                         ├── SÍ → Retornar staticData
                         └── NO → Retornar error
```

### Productos de campaña (staticData)

Hay 4 productos con datos estáticos en `src/data/canonInPages.js`:

| ID | Producto | SKU |
|----|----------|-----|
| `g7x-iii` | PowerShot G7X Mark III | 17507574 |
| `r10-18-45` | EOS R10 RF-S 18-45mm | 16765189 |
| `r50-18-45` | EOS R50 18-45 IS STM | 16765190 |
| `eos-rp` | EOS RP RF 24-105mm S | 16487747 |

**Estos productos TAMBIÉN tienen sus bloques en `inpage_blocks`.** El `staticData` solo sirve como fallback si Supabase falla o no tiene datos.

> **Regla:** Al crear un producto nuevo, NO se necesita agregarlo a `STATIC_CAMPAIGN_PRODUCTS` ni a `canonInPages.js`. Solo necesita existir en las tablas `products` + `inpage_blocks`.

---

## 13. Imágenes y Storage

### Bucket

- **Nombre:** `inpage-images`
- **Acceso:** Público (lectura libre, escritura requiere service role)
- **Cache:** 3600 segundos

### Estructura de carpetas

```
inpage-images/
├── eos-r8/
│   ├── block0_image_1704067200000_a1b2.jpg     ← subida desde la app
│   ├── block1_leftImage_1704067210000_c3d4.jpg
│   └── ...
├── g7x-iii/
│   └── block0_image_1774285229114_2i0q.jpg
├── eos-r50v/
│   └── hero_banner.jpg
└── ...
```

### URLs de imágenes

Las imágenes se pueden referenciar de 3 formas:

1. **URL completa de Supabase Storage** (lo ideal tras editar desde la app):
   ```
   https://bupnqihroawrvcvzpbqv.supabase.co/storage/v1/object/public/inpage-images/eos-r8/block0_image_xxx.jpg
   ```

2. **URL externa** (de Canon u otro CDN, usada en seeds iniciales):
   ```
   https://asia.canon/media/image/2022/05/23/xxx.png
   ```
   > ⚠️ Las URLs de `asia.canon` pueden tener problemas de **CORS** desde Netlify. Funcionan para mostrar pero no para cropear/editar en el canvas.

3. **Path relativo** (resuelta por `getImageUrl()`):
   ```
   eos-r8/hero.jpg → https://bupnqihroawrvcvzpbqv.supabase.co/storage/v1/object/public/inpage-images/eos-r8/hero.jpg
   ```

### Nomenclatura de archivos subidos desde la app

```
block[indice]_[campo]_[timestamp]_[random4chars].[ext]
```

Ejemplo: `block0_image_1774285229114_2i0q.jpg`

### Dimensiones recomendadas

| Módulo | Ancho × Alto | Formato |
|--------|-------------|---------|
| 1 (Banner sin texto) | 1160 × 480 px | JPG |
| 3 / 4 (Img + Texto) | 560 × 315 px | JPG o PNG |
| 6 (Banner + Texto) | 1160 × 360 px | JPG |
| 7 (Dos imágenes) | 560 × 315 px c/u | JPG o PNG |
| 9 (Banner clickeable) | 1160 × 480 px | JPG |

---

## 14. Reglas de Falabella

### Naming de imágenes para exportación

Al exportar el Excel + ZIP, las imágenes se renombran según la convención de Falabella:

```
[SKU]-img_[N]
```

Ejemplo para SKU `12345678`:
- `12345678-img_1` (primer bloque con imagen)
- `12345678-img_2` (segundo bloque con imagen)
- etc.

> La extensión (.jpg, .png) NO se incluye — Falabella la agrega automáticamente.

### Formato del Excel

El Excel exportado sigue la estructura del `InPage Builder_v8.xlsx`:
- **Hoja "Formulario":** Filas 4-13 = Bloques 1-10
  - Columna B: Selector del módulo
  - Columnas D, F, H, J, L, N, P, R, T: Campos del bloque
  - Columna U: HTML generado
- **Hoja "Data":** Templates HTML de cada módulo
- **Hoja "Código":** HTML final concatenado

### Límites

- Máximo **10 bloques** por InPage
- Máximo **50 MB** por imagen
- Las imágenes se exportan en carpeta `images/` dentro del ZIP
- El alt text es obligatorio para accesibilidad

---

## 15. Errores Comunes y Soluciones

### "La imagen se carga pero vuelve a la anterior"

**Causa:** El producto tenía `staticData` y `loadInPage` siempre retornaba los datos estáticos en vez de consultar Supabase.

**Solución:** Se corrigió `loadInPage` para que SIEMPRE consulte Supabase primero. El `staticData` es solo fallback.

**Verificación:** Revisar que el producto tenga bloques en `inpage_blocks`:
```sql
SELECT count(*) FROM inpage_blocks WHERE product_id = 'mi-producto';
```

---

### "Multiple GoTrueClient instances detected"

**Causa:** Los clientes `supabase` y `supabaseAdmin` compartían el mismo storage key de auth.

**Solución:** `supabaseAdmin` se configuró con `persistSession: false` y un storage key diferente.

---

### "Error de permisos al guardar" / Cambios no se persisten

**Causa:** Se usaba el cliente `supabase` (anon key) para INSERT/DELETE. RLS bloqueaba silenciosamente.

**Solución:** Todas las escrituras usan `supabaseAdmin` (service role key).

---

### "CORS error con imágenes de asia.canon"

**Causa:** Las imágenes de `https://asia.canon/...` no tienen headers CORS para `javoapps.netlify.app`.

**Solución:** Las imágenes se muestran pero no se pueden editar con el canvas. Al subir una nueva imagen desde la app, se guarda en Supabase Storage (que sí permite CORS). La imagen de `asia.canon` queda reemplazada por la de Supabase.

---

### "Product not found" al correr seed script

**Causa:** El producto no existe en la tabla `products`.

**Solución:** Crear el producto primero (ver sección 5).

---

### Producto no aparece en el Dashboard

**Causa:** El producto no está en la tabla `products` de Supabase.

**Solución:** Insertarlo en la tabla (ver sección 5). Si es un producto de campaña, verificar que también esté en `STATIC_CAMPAIGN_PRODUCTS` de `supabaseData.js`.

---

## 16. Checklist Final

### Al crear un producto nuevo

- [ ] **Producto creado en tabla `products`** con id, name, sku, category, image_folder
- [ ] **Seed script creado** en `scripts/seed-[product-id].mjs`
- [ ] **Seed ejecutado** sin errores
- [ ] **Bloques verificados** en `inpage_blocks` (SQL o terminal)
- [ ] **Producto visible** en el Dashboard de la app
- [ ] **Todos los bloques** aparecen correctamente en el editor
- [ ] **Las imágenes** cargan sin errores
- [ ] **Al guardar** desde la app, los cambios persisten al recargar
- [ ] **Al subir una imagen nueva**, reemplaza la anterior correctamente

### Scripts existentes de referencia

| Script | Producto | Bloques |
|--------|----------|---------|
| `seed-campaign-products.mjs` | g7x-iii, r10-18-45, r50-18-45 | 8 c/u |
| `seed-eos-rp.mjs` | eos-rp | 9 |
| `seed-eos-r1.mjs` | eos-r1 | ~12 |
| `seed-eos-r3.mjs` | eos-r3 | ~10 |
| `seed-powershot-pick.mjs` | powershot-pick | ~8 |

### Archivos clave del sistema

| Archivo | Responsabilidad |
|---------|----------------|
| `src/lib/supabase.js` | Clientes de Supabase y helpers de Storage |
| `src/data/supabaseData.js` | Carga de productos y bloques, caché |
| `src/utils/saveManager.js` | Guardado de cambios, upload de imágenes |
| `src/config/falabellaRules.js` | Definición de los 9 módulos |
| `src/data/canonInPages.js` | Datos fallback de 4 productos de campaña |

---

> **Última revisión:** Marzo 2026. Si algo no funciona, revisa primero que el producto exista en `products` y que tenga bloques en `inpage_blocks`.
