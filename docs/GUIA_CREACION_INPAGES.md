# 📚 Guía Completa para Crear InPages - Canon InPage Maker

## Índice

1. [Visión General del Sistema](#1-visión-general-del-sistema)
2. [Estructura de la Base de Datos](#2-estructura-de-la-base-de-datos)
3. [Módulos Disponibles](#3-módulos-disponibles)
4. [Proceso de Creación de InPages](#4-proceso-de-creación-de-inpages)
5. [Requisitos de Imágenes](#5-requisitos-de-imágenes)
6. [Exportación: Excel y ZIP](#6-exportación-excel-y-zip)
7. [Reglas de Falabella](#7-reglas-de-falabella)
8. [Scripts de Creación](#8-scripts-de-creación)
9. [Ejemplos Completos](#9-ejemplos-completos)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Visión General del Sistema

### Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   products   │  │inpage_blocks │  │ edit_history │      │
│  │              │──│              │  │              │      │
│  │ id, sku,     │  │ product_id,  │  │ product_id,  │      │
│  │ name,        │  │ module_id,   │  │ timestamp,   │      │
│  │ category     │  │ block_order, │  │ user, blocks │      │
│  │              │  │ block_data   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │              STORAGE: inpage-images              │      │
│  │         (bucket público para imágenes)           │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                           │
├─────────────────────────────────────────────────────────────┤
│  Dashboard → Editor → Preview → Export (Excel + ZIP)        │
└─────────────────────────────────────────────────────────────┘
```

### Conexión a Supabase

```javascript
const SUPABASE_URL = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Service Role Key
const BUCKET = 'inpage-images';
const BASE_IMAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;
```

---

## 2. Estructura de la Base de Datos

### Tabla: `products`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `text` (PK) | Identificador único (ej: `g7010`, `r50-18-45`) |
| `sku` | `text` | SKU Padre de Falabella (ej: `3114C004`, `17514855`) |
| `name` | `text` | Nombre del producto (ej: `PIXMA G7010`) |
| `category` | `text` | Categoría (`Printers`, `Cameras`, `Lenses`, `Ink`) |
| `created_at` | `timestamptz` | Fecha de creación |
| `updated_at` | `timestamptz` | Última actualización |

### Tabla: `inpage_blocks`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `serial` (PK) | ID auto-generado |
| `product_id` | `text` (FK) | Referencia a `products.id` |
| `module_id` | `integer` | Número de módulo (1-9) |
| `block_order` | `integer` | Posición del bloque (0, 1, 2...) |
| `block_data` | `jsonb` | Datos del bloque en JSON |
| `created_at` | `timestamptz` | Fecha de creación |
| `updated_at` | `timestamptz` | Última actualización |

### Tabla: `edit_history`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `serial` (PK) | ID auto-generado |
| `product_id` | `text` (FK) | Referencia a `products.id` |
| `timestamp` | `timestamptz` | Momento del cambio |
| `user` | `text` | Usuario que hizo el cambio |
| `blocks_snapshot` | `jsonb` | Snapshot completo de los bloques |

---

## 3. Módulos Disponibles

### Módulo 1: Banner Principal sin Texto
**ID:** `1`  
**Excel Name:** `"Banner principal sin texto (Modulo 1)"`  
**Dimensiones imagen:** `1160 x 480 px`

```javascript
{
    module_id: 1,
    block_data: {
        image: "URL_DE_IMAGEN",    // Requerido
        altImage: "Texto alt"      // Opcional
    }
}
```

**Uso:** Banner hero del producto, primera impresión visual.

---

### Módulo 2: Texto en Dos Columnas
**ID:** `2`  
**Excel Name:** `"Texto en dos columnas (Modulo 2)"`  
**Dimensiones imagen:** Sin imagen

```javascript
{
    module_id: 2,
    block_data: {
        title: "Título de la Sección",      // Requerido
        col1Text: "Texto columna 1...",     // Requerido
        col2Text: "Texto columna 2..."      // Requerido
    }
}
```

**Uso:** Comparativas, características lado a lado, especificaciones.

**Nota sobre formato de texto:**
- Usar `\n\n` para separar párrafos
- Usar `• ` para listas con bullets
- Ejemplo:
```javascript
col1Text: 'Alto Rendimiento\n\n• Hasta 8,300 páginas\n• Impresión dúplex\n• WiFi integrado'
```

---

### Módulo 3: Imagen y Texto (Imagen Izquierda)
**ID:** `3`  
**Excel Name:** `"Imagen y texto (Modulo 3)"`  
**Dimensiones imagen:** `560 x 315 px`

```javascript
{
    module_id: 3,
    block_data: {
        image: "URL_DE_IMAGEN",        // Requerido
        altImage: "Texto alt",         // Opcional
        title: "Título",               // Requerido
        description: "Descripción..."  // Requerido
    }
}
```

**Uso:** Destacar características con imagen a la izquierda.

---

### Módulo 4: Texto e Imagen (Imagen Derecha)
**ID:** `4`  
**Excel Name:** `"Texto e Imagen (Modulo 4)"`  
**Dimensiones imagen:** `560 x 315 px`

```javascript
{
    module_id: 4,
    block_data: {
        title: "Título",               // Requerido
        description: "Descripción...", // Requerido (en Excel usa "F")
        image: "URL_DE_IMAGEN",        // Requerido
        altImage: "Texto alt"          // Opcional
    }
}
```

**⚠️ IMPORTANTE - Diferencia con Módulo 3:**
En el Módulo 4, el campo de texto para la descripción se llama `description` en el código, pero en la app a veces se usa `text`. Asegúrate de usar el campo correcto para la exportación Excel.

**Uso:** Alternar con Módulo 3 para crear ritmo visual.

---

### Módulo 5: Lista en Dos Columnas
**ID:** `5`  
**Excel Name:** `"Lista en dos columnas (Modulo 5)"`  
**Dimensiones imagen:** Sin imagen

```javascript
{
    module_id: 5,
    block_data: {
        title: "Título de la Lista",
        item1: "Item 1",  // Columna 1
        item2: "Item 2",
        item3: "Item 3",
        item4: "Item 4",
        item5: "Item 5",  // Columna 2
        item6: "Item 6",
        item7: "Item 7",
        item8: "Item 8"
    }
}
```

**Uso:** Listas de características, especificaciones, contenido de caja.

---

### Módulo 6: Banner Grande y Texto
**ID:** `6`  
**Excel Name:** `"Banner grande y texto (Modulo 6)"`  
**Dimensiones imagen:** `1160 x 360 px`

```javascript
{
    module_id: 6,
    block_data: {
        image: "URL_DE_IMAGEN",
        altImage: "Texto alt",
        title: "Título",
        description: "Descripción detallada..."
    }
}
```

**Uso:** Secciones destacadas con imagen grande seguida de texto.

---

### Módulo 7: Dos Imágenes con Texto
**ID:** `7`  
**Excel Name:** `"Dos imágenes con texto abajo (Modulo 7)"`  
**Dimensiones imagen:** `560 x 315 px` (ambas)

```javascript
{
    module_id: 7,
    block_data: {
        leftImage: "URL_IMAGEN_IZQ",
        leftAlt: "Alt izquierda",
        leftTitle: "Título izquierda",
        leftText: "Texto izquierda",
        rightImage: "URL_IMAGEN_DER",
        rightAlt: "Alt derecha",
        rightTitle: "Título derecha",
        rightText: "Texto derecha"
    }
}
```

**Uso:** Comparativas de dos productos, antes/después, dos características.

---

### Módulo 8: Video y Texto
**ID:** `8`  
**Excel Name:** `"Video y texto (Modulo 8)"`  
**Dimensiones imagen:** Sin imagen (video)

```javascript
{
    module_id: 8,
    block_data: {
        youtubeCode: "VIDEO_ID",  // Solo el ID, NO la URL completa
        title: "Título del video",
        description: "Descripción..."
    }
}
```

**⚠️ IMPORTANTE:** Solo usar el ID del video de YouTube.
- ✅ Correcto: `"dQw4w9WgXcQ"`
- ❌ Incorrecto: `"https://www.youtube.com/watch?v=dQw4w9WgXcQ"`

---

### Módulo 9: Banner Clickeable
**ID:** `9`  
**Excel Name:** `"Banner clicleable (Modulo 9)"`  
**Dimensiones imagen:** `1160 x 480 px`

```javascript
{
    module_id: 9,
    block_data: {
        url: "https://destino.com/pagina",
        image: "URL_DE_IMAGEN",
        altImage: "Texto alt"
    }
}
```

**Uso:** Banners promocionales que llevan a otras páginas.

---

## 4. Proceso de Creación de InPages

### ⚠️ Principios de Redacción Publicitaria

**Antes de escribir cualquier texto, considera:**

#### 1. Conoce a tu Audiencia
- **Impresoras MegaTank:** Pequeñas empresas, emprendedores, hogares con alto volumen
- **Cámaras EOS:** Fotógrafos, videógrafos, creadores de contenido
- **Lentes RF:** Profesionales y entusiastas que buscan calidad

#### 2. Estructura de un Buen Texto de Descripción

```
[Gancho emotivo] + [Beneficio principal] + [Características que lo respaldan] + [Caso de uso]
```

**Ejemplo:**
> "El innovador sistema de tanques de tinta integrado MegaTank **elimina la necesidad de costosos cartuchos**. Con las botellas de tinta GI-10 de fácil recarga, **imprime hasta 8,300 páginas** de texto negro o hasta 7,700 páginas a color vibrantes por juego completo. La tinta pigmentada negra produce textos ultra nítidos y resistentes al agua, mientras que las tintas de colores basadas en colorante garantizan fotos e imágenes con colores vivos y duraderos. **Perfecto para oficinas con alto volumen de impresión**."

#### 3. Longitud Recomendada por Campo

| Campo | Longitud Mínima | Óptima |
|-------|-----------------|--------|
| `title` | 5-8 palabras | Claro y descriptivo |
| `description` | 50 palabras | 80-120 palabras |
| `col1Text` / `col2Text` | 40 palabras | 60-80 palabras |
| `altImage` | 10 palabras | Descriptivo para SEO |
| Items de lista | 6-10 palabras | Específico y útil |

#### 4. Palabras Clave que Venden

**Para Impresoras:**
- "alto rendimiento", "bajo costo por página"
- "sin complicaciones", "fácil recarga"
- "productividad", "eficiencia"
- "sin derrames", "sin apretar"
- "automático", "sin intervención"

**Para Cámaras:**
- "cinematográfico", "profesional"
- "enfoque inteligente", "tracking"
- "colores vibrantes", "detalle"
- "creadores de contenido"
- "rango dinámico", "10 bits"

#### 5. Evitar

❌ Textos muy cortos: "Imprime muchas páginas"  
❌ Solo datos técnicos: "13 ipm, 4800 dpi"  
❌ Lenguaje genérico: "Buena calidad"  
❌ Repetición de títulos en la descripción  
❌ Alt de imagen vacío o genérico: "imagen1"

---

### Flujo de Trabajo Recomendado

```
1. PREPARACIÓN
   │
   ├── Recopilar información del producto
   │   └── Especificaciones, características, beneficios
   │
   ├── Obtener imágenes
   │   ├── Fuente primaria: cla.canon.com/en/p/[producto]
   │   └── URLs de Scene7: s7d1.scene7.com/is/image/canon/...
   │
   └── Definir estructura del InPage
       └── Qué módulos usar y en qué orden

2. CREACIÓN DEL SCRIPT
   │
   └── Crear archivo: scripts/create-[producto]-inpage.js

3. EJECUCIÓN
   │
   └── node scripts/create-[producto]-inpage.js

4. VERIFICACIÓN
   │
   ├── Revisar en la app (Dashboard)
   ├── Comprobar preview
   └── Exportar y validar Excel

5. AJUSTES
   │
   └── Editar desde la app si es necesario
```

### Estructura de un Script de Creación

```javascript
/**
 * Script para crear InPage de [NOMBRE PRODUCTO]
 */

const SUPABASE_URL = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const SUPABASE_KEY = '[SERVICE_ROLE_KEY]';

// 1. Definir datos del producto
const productData = {
    id: 'producto-id',        // Único, minúsculas, guiones
    sku: 'SKU_FALABELLA',     // SKU Padre
    name: 'Nombre Producto',
    category: 'Printers'      // Printers, Cameras, Lenses, Ink
};

// 2. Definir URLs de imágenes
const IMAGES = {
    primary: 'https://...',
    feature1: 'https://...',
    feature2: 'https://...'
};

// 3. Definir bloques del InPage
const inpageBlocks = [
    {
        product_id: productData.id,
        module_id: 1,
        block_order: 0,
        block_data: {
            image: IMAGES.primary,
            altImage: productData.name
        }
    },
    // ... más bloques
];

// 4. Función de creación
async function createInPage() {
    // Verificar/crear producto
    // Eliminar bloques existentes
    // Crear nuevos bloques
}

createInPage();
```

---

## 5. Requisitos de Imágenes

### Dimensiones por Módulo

| Módulo | Dimensiones | Proporción |
|--------|-------------|------------|
| 1 - Banner Principal | 1160 x 480 px | 2.42:1 |
| 3 - Imagen y Texto | 560 x 315 px | 16:9 |
| 4 - Texto e Imagen | 560 x 315 px | 16:9 |
| 6 - Banner Grande | 1160 x 360 px | 3.22:1 |
| 7 - Dos Imágenes | 560 x 315 px | 16:9 |
| 9 - Banner Clickeable | 1160 x 480 px | 2.42:1 |

### Fuentes de Imágenes Canon

#### 1. Imágenes de Producto (Scene7)
```
https://s7d1.scene7.com/is/image/canon/[SKU]-[producto]-[tipo]?wid=[ancho]
```

Ejemplos:
```
# Imagen principal
https://s7d1.scene7.com/is/image/canon/3114C004-pixma-g7010-primary?wid=800

# Galería (vistas adicionales)
https://s7d1.scene7.com/is/image/canon/3114C004-pixma-g7010-1?wid=800
https://s7d1.scene7.com/is/image/canon/3114C004-pixma-g7010-2?wid=800
```

#### 2. Imágenes de Overview (CLA Canon)
```
https://www.cla.canon.com/content/dam/cla-assets/product-assets/[categoria]/[subcategoria]/[producto]/overview-images/en/[producto]-overview-[N].jpg
```

Ejemplo:
```
https://www.cla.canon.com/content/dam/cla-assets/product-assets/printers/megatank-and-home-printers/pixma-g7010/overview-images/en/pixma-g7010-overview-1.jpg
```

#### 3. Imágenes de Tintas/Consumibles
```
https://www.cla.canon.com/content/dam/cla-assets/product-assets/inks-paper/megatank-ink-bottles/[producto]/primary-images/[producto]-primary.jpg
```

### Formato de Nombrado al Exportar

```
SKU-img_N.jpg
```

- `SKU` = SKU Padre de Falabella
- `N` = Número secuencial (1, 2, 3...)
- Siempre `.jpg`

Ejemplo: `3114C004-img_1.jpg`, `3114C004-img_2.jpg`

---

## 6. Exportación: Excel y ZIP

### Estructura del Excel (InPage Builder_v8.xlsx)

#### Hoja "Formulario"

| Fila | Contenido |
|------|-----------|
| 1 | Headers + **SKU en celda B1** |
| 2-3 | Configuración |
| 4-13 | Bloques 1-10 |

#### Columnas de Datos

| Columna | Uso |
|---------|-----|
| B | Selector de módulo (dropdown) |
| D | Campo 1 (imagen/título/url) |
| F | Campo 2 (alt/texto) |
| H | Campo 3 |
| J | Campo 4 |
| L-T | Campos adicionales (módulo 7) |
| U | HTML generado (fórmula) |

#### Hoja "Código (No llenar)"

| Celda | Contenido |
|-------|-----------|
| B1 | HTML final concatenado |

### Contenido del ZIP Exportado

```
InPage_[SKU].zip
├── InPage_[SKU].xlsx    # Excel con datos
└── Images/
    ├── [SKU]-img_1.jpg  # Primera imagen
    ├── [SKU]-img_2.jpg  # Segunda imagen
    └── ...
```

### Proceso de Exportación

1. **Generar Excel:**
   - Cargar template `InPage Builder_v8.xlsx`
   - Escribir SKU en celda B1
   - Para cada bloque:
     - Escribir nombre del módulo en columna B
     - Mapear campos a columnas según `excelMapping`
     - Imágenes: escribir nombre sin extensión (`SKU-img_N`)

2. **Generar ZIP:**
   - Agregar Excel al ZIP
   - Para cada imagen:
     - Descargar de URL
     - Redimensionar a dimensiones del módulo
     - Guardar como `SKU-img_N.jpg`

---

## 7. Reglas de Falabella

### Convención de Nombres de Imágenes

```javascript
// Formato: SKU-img_N (sin extensión en Excel)
const imageName = `${sku}-img_${index}`;

// El exportador agrega .jpg al crear el archivo
const fileName = `${sku}-img_${index}.jpg`;
```

### Mapeo de Campos por Módulo

```javascript
// Módulo 1: Banner sin texto
{ image: "D", altImage: "F" }

// Módulo 2: Texto dos columnas
{ title: "D", col1Text: "F", col2Text: "H" }

// Módulo 3: Imagen + Texto
{ image: "D", altImage: "F", title: "H", description: "J" }

// Módulo 4: Texto + Imagen
{ title: "D", description: "F", image: "H", altImage: "J" }

// Módulo 5: Lista
{ title: "D", item1: "F", item2: "H", item3: "J", item4: "L",
  item5: "N", item6: "P", item7: "R", item8: "T" }

// Módulo 6: Banner grande + texto
{ image: "D", altImage: "F", title: "H", description: "J" }

// Módulo 7: Dos imágenes
{ leftImage: "D", leftAlt: "F", leftTitle: "H", leftText: "J",
  rightImage: "L", rightAlt: "N", rightTitle: "P", rightText: "R" }

// Módulo 8: Video
{ youtubeCode: "D", title: "F", description: "H" }

// Módulo 9: Banner clickeable
{ url: "D", image: "F", altImage: "H" }
```

### Límites y Restricciones

- **Máximo 10 bloques** por InPage
- **Imágenes siempre .jpg** al exportar
- **SKU obligatorio** en celda B1
- **Nombres de módulo exactos** (usar `excelName` del config)

---

## 8. Scripts de Creación

### Template Completo

```javascript
/**
 * Script para crear InPage de [PRODUCTO]
 * 
 * Información del producto:
 * - [Característica 1]
 * - [Característica 2]
 * - [etc.]
 */

const SUPABASE_URL = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo';

// URLs de imágenes
const IMAGES = {
    primary: 'https://s7d1.scene7.com/is/image/canon/...',
    overview1: 'https://www.cla.canon.com/content/dam/...',
    overview2: 'https://www.cla.canon.com/content/dam/...'
};

// Datos del producto
const productData = {
    id: 'producto-id',
    sku: 'SKU_PADRE',
    name: 'Nombre del Producto',
    category: 'Printers' // Printers, Cameras, Lenses, Ink
};

// Bloques del InPage
const inpageBlocks = [
    // Bloque 1: Banner Principal
    {
        product_id: productData.id,
        module_id: 1,
        block_order: 0,
        block_data: {
            image: IMAGES.primary,
            altImage: productData.name
        }
    },
    
    // Bloque 2: Característica principal
    {
        product_id: productData.id,
        module_id: 4,
        block_order: 1,
        block_data: {
            title: 'Título de la Característica',
            description: 'Descripción detallada de la característica...',
            image: IMAGES.overview1,
            altImage: 'Descripción de imagen'
        }
    },
    
    // Bloque 3: Especificaciones
    {
        product_id: productData.id,
        module_id: 2,
        block_order: 2,
        block_data: {
            title: 'Especificaciones',
            col1Text: 'Columna 1\n\n• Item 1\n• Item 2\n• Item 3',
            col2Text: 'Columna 2\n\n• Item A\n• Item B\n• Item C'
        }
    }
    
    // ... más bloques según necesidad
];

async function createInPage() {
    console.log('🚀 Creando InPage para ' + productData.name + '...\n');
    
    try {
        // 1. Verificar si el producto existe
        console.log('📋 Verificando producto en base de datos...');
        const productResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/products?id=eq.${productData.id}`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );
        
        const existingProduct = await productResponse.json();
        
        if (existingProduct.length === 0) {
            // Crear el producto
            console.log('➕ Creando producto nuevo...');
            const createProductResponse = await fetch(
                `${SUPABASE_URL}/rest/v1/products`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        id: productData.id,
                        sku: productData.sku,
                        name: productData.name,
                        category: productData.category
                    })
                }
            );
            
            if (!createProductResponse.ok) {
                const error = await createProductResponse.text();
                throw new Error(`Error creando producto: ${error}`);
            }
            
            console.log('✅ Producto creado exitosamente');
        } else {
            console.log('✅ Producto ya existe en la base de datos');
        }
        
        // 2. Eliminar bloques existentes (si los hay)
        console.log('\n🗑️ Eliminando bloques existentes...');
        await fetch(
            `${SUPABASE_URL}/rest/v1/inpage_blocks?product_id=eq.${productData.id}`,
            {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );
        
        // 3. Crear los bloques del InPage
        console.log('📝 Creando bloques del InPage...');
        const blocksResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/inpage_blocks`,
            {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(inpageBlocks)
            }
        );
        
        if (!blocksResponse.ok) {
            const error = await blocksResponse.text();
            throw new Error(`Error creando bloques: ${error}`);
        }
        
        const createdBlocks = await blocksResponse.json();
        console.log(`✅ ${createdBlocks.length} bloques creados exitosamente`);
        
        // 4. Resumen
        console.log('\n' + '='.repeat(50));
        console.log('🎉 InPage creado exitosamente!');
        console.log('='.repeat(50));
        console.log(`\n📦 Producto: ${productData.name}`);
        console.log(`📄 SKU: ${productData.sku}`);
        console.log(`🔢 Bloques: ${createdBlocks.length}`);
        
        const moduleNames = {
            1: 'Banner Principal',
            2: 'Dos Columnas',
            3: 'Imagen + Texto (izq)',
            4: 'Texto + Imagen (der)',
            5: 'Lista',
            6: 'Banner Grande + Texto',
            7: 'Dos Imágenes',
            8: 'Video',
            9: 'Banner Clickeable'
        };
        
        console.log('\n📋 Estructura del InPage:');
        inpageBlocks.forEach((block, index) => {
            console.log(`   ${index + 1}. ${moduleNames[block.module_id]} - ${block.block_data.title || 'Sin título'}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Ejecutar
createInPage();
```

### Cómo Ejecutar

```bash
# Desde la raíz del proyecto
node scripts/create-[producto]-inpage.js
```

---

## 9. Ejemplos Completos

### 🔥 Mejores Prácticas para Textos Publicitarios

**IMPORTANTE:** Los textos de un InPage deben ser **descriptivos, informativos y persuasivos**. No basta con poner datos técnicos secos. Cada bloque debe contar una historia que conecte el producto con las necesidades del cliente.

#### ❌ Texto POBRE (evitar):
```
"La PIXMA G7010 imprime 8,300 páginas."
```

#### ✅ Texto COMPLETO (usar):
```
"El innovador sistema de tanques de tinta integrado MegaTank elimina la necesidad 
de costosos cartuchos. Con las botellas de tinta GI-10 de fácil recarga, imprime 
hasta 8,300 páginas de texto negro o hasta 7,700 páginas a color vibrantes por 
juego completo. La tinta pigmentada negra produce textos ultra nítidos y resistentes 
al agua, mientras que las tintas de colores basadas en colorante garantizan fotos 
e imágenes con colores vivos y duraderos."
```

#### Reglas de Escritura:

1. **Longitud mínima por descripción:** 50-100 palabras
2. **Incluir beneficios**, no solo características
3. **Usar lenguaje emotivo** que conecte con el usuario
4. **Mencionar casos de uso** concretos
5. **Comparar con alternativas** cuando sea relevante

---

### Ejemplo 1: Impresora PIXMA G7010 (Completo)

```javascript
const inpageBlocks = [
    // Bloque 1: Banner Principal
    {
        product_id: 'g7010',
        module_id: 1,
        block_order: 0,
        block_data: {
            image: 'https://s7d1.scene7.com/is/image/canon/3114C004-pixma-g7010-primary?wid=800',
            altImage: 'Canon PIXMA G7010 - Multifuncional MegaTank Wireless 4-en-1 con ADF y Fax para Alto Volumen de Impresión'
        }
    },
    
    // Bloque 2: Introducción en Dos Columnas
    {
        product_id: 'g7010',
        module_id: 2,
        block_order: 1,
        block_data: {
            title: 'PIXMA G7010: La Multifuncional MegaTank Diseñada para Alto Rendimiento',
            col1Text: 'La Canon PIXMA G7010 es una impresora multifuncional inalámbrica 4-en-1 diseñada para una productividad seria. Con su sistema de tanques de tinta MegaTank de alto rendimiento, imprime hasta 8,300 páginas de texto negro o 7,700 páginas a color vibrantes con un solo juego de botellas de tinta GI-10. Ideal para oficinas pequeñas, emprendedores y hogares con alto volumen de impresión.',
            col2Text: 'Imprime, copia, escanea y envía fax con un solo equipo versátil. El alimentador automático de documentos (ADF) de 35 hojas acelera tu flujo de trabajo. La impresión automática a doble cara ahorra papel. Y con una capacidad combinada de 350 hojas, podrás imprimir proyectos grandes sin parar a recargar. Conectividad WiFi y Ethernet para toda tu oficina.'
        }
    },
    
    // Bloque 3: Sistema MegaTank (Módulo 3 - Imagen izquierda)
    {
        product_id: 'g7010',
        module_id: 3,
        block_order: 2,
        block_data: {
            image: 'https://www.cla.canon.com/.../pixma-g7010-overview-1.jpg',
            altImage: 'Canon PIXMA G7010 - Sistema de tanques de tinta MegaTank de alto rendimiento',
            title: 'Sistema MegaTank: Hasta 8,300 Páginas en Negro',
            description: 'El innovador sistema de tanques de tinta integrado MegaTank elimina la necesidad de costosos cartuchos. Con las botellas de tinta GI-10 de fácil recarga, imprime hasta 8,300 páginas de texto negro o hasta 7,700 páginas a color vibrantes por juego completo. La tinta pigmentada negra produce textos ultra nítidos y resistentes al agua, mientras que las tintas de colores basadas en colorante garantizan fotos e imágenes con colores vivos y duraderos. Los niveles de tinta son visibles en todo momento desde el frente del equipo.'
        }
    },
    
    // Bloque 4: Funciones 4-en-1 (Módulo 4 - Imagen derecha)
    {
        product_id: 'g7010',
        module_id: 4,
        block_order: 3,
        block_data: {
            title: '4-en-1 Completo: Imprime, Copia, Escanea y Fax',
            description: 'La PIXMA G7010 no solo imprime a gran escala, también es una potente estación de trabajo todo-en-uno. Copia documentos rápidamente con la función de reducción/ampliación automática. Escanea a tu computadora, a la nube o directamente a memoria USB. Y para comunicaciones de negocio tradicionales, el fax integrado Super G3 te conecta al instante. El alimentador automático de documentos (ADF) de 35 hojas permite procesar múltiples páginas de forma continua sin supervisión. Perfecto para contratos, facturas, reportes y documentos del día a día.',
            image: 'https://www.cla.canon.com/.../pixma-g7010-overview-2.jpg',
            altImage: 'Canon PIXMA G7010 - Multifuncional 4-en-1 con ADF de 35 hojas'
        }
    },
    
    // Bloque 5: Productividad (Módulo 7 - Dos imágenes)
    {
        product_id: 'g7010',
        module_id: 7,
        block_order: 4,
        block_data: {
            leftImage: 'https://s7d1.scene7.com/.../pixma-g7010-1?wid=800',
            leftAlt: 'Canon PIXMA G7010 - Capacidad de 350 hojas con cassette frontal',
            leftTitle: 'Capacidad de 350 Hojas',
            leftText: 'Con una capacidad combinada de 350 hojas de papel estándar (150 en cassette frontal + 200 en alimentador posterior), la G7010 maneja proyectos de impresión grandes sin interrupciones. El cassette frontal tiene ventana transparente para ver el nivel de papel fácilmente. Imprimir 100, 200 o más páginas sin parar a recargar es posible.',
            rightImage: 'https://s7d1.scene7.com/.../pixma-g7010-2?wid=800',
            rightAlt: 'Canon PIXMA G7010 - Impresión automática a doble cara dúplex',
            rightTitle: 'Impresión Dúplex Automática',
            rightText: 'La impresión automática a doble cara te permite crear documentos profesionales de dos caras sin voltear el papel manualmente. Reduce tu consumo de papel hasta en un 50%. Ideal para reportes, manuales, folletos y presentaciones. Ahorra papel, ahorra dinero, ayuda al medio ambiente.'
        }
    },
    
    // Bloque 6: Conectividad (Módulo 3)
    {
        product_id: 'g7010',
        module_id: 3,
        block_order: 5,
        block_data: {
            image: 'https://www.cla.canon.com/.../pixma-g7010-overview-3.jpg',
            altImage: 'Canon PIXMA G7010 - Conectividad WiFi y Ethernet para oficina',
            title: 'Conectividad WiFi y Ethernet para Toda tu Oficina',
            description: 'La PIXMA G7010 se integra perfectamente en cualquier red. Conexión WiFi 802.11b/g/n para imprimir sin cables desde laptops, computadoras de escritorio, smartphones y tablets. Puerto Ethernet para conexión cableada de alta velocidad en redes empresariales. Compatible con Apple AirPrint para iOS y macOS sin instalar drivers. Mopria Print Service para Android. Canon PRINT App para control total desde tu smartphone: monitorea niveles de tinta, configura opciones y envía trabajos de impresión desde cualquier lugar de tu casa u oficina.'
        }
    },
    
    // Bloque 7: Sistema CISS (Módulo 4)
    {
        product_id: 'g7010',
        module_id: 4,
        block_order: 6,
        block_data: {
            title: 'Sistema de Suministro Continuo de Tinta (CISS)',
            description: 'La tecnología CISS (Continuous Ink Supply System) de Canon utiliza grandes tanques de tinta recargables con tubos herméticos que entregan un flujo continuo y constante de tinta al cabezal de impresión. Esto significa impresión de alto volumen sin interrupciones. Las botellas de tinta GI-10 tienen diseño "sin apretar": simplemente coloca la botella en la entrada del tanque y la tinta fluye por gravedad. Sin presionar, sin derrames, sin complicaciones. Cada color tiene su propia forma de entrada para evitar errores.',
            image: 'https://www.cla.canon.com/.../pixma-g7010-overview-4.jpg',
            altImage: 'Canon PIXMA G7010 - Sistema CISS de suministro continuo de tinta'
        }
    },
    
    // Bloque 8: Especificaciones Técnicas (Módulo 2)
    {
        product_id: 'g7010',
        module_id: 2,
        block_order: 7,
        block_data: {
            title: 'Especificaciones Técnicas de la PIXMA G7010',
            col1Text: 'Impresión de Alto Rendimiento\n\n• Velocidad: 13 ipm negro / 6.8 ipm color\n• Resolución: hasta 4800 x 1200 dpi\n• Primera página en solo 22 segundos\n• Foto 4x6" sin bordes en 45 segundos\n• Impresión sin bordes hasta 8.5"x11"\n• Tamaños: carta, legal, sobres, 3.5x3.5"',
            col2Text: 'Escaneo, Copia y Fax\n\n• Resolución óptica: 1200 x 2400 dpi\n• ADF de 35 hojas\n• Copia: 99 copias múltiples\n• Reducción/ampliación: 25%-400%\n• Fax Super G3 (33.6 Kbps)\n• Memoria de fax: 50 páginas\n• LCD de 2 líneas retroiluminado'
        }
    },
    
    // Bloque 9: Lista de Características (Módulo 5)
    {
        product_id: 'g7010',
        module_id: 5,
        block_order: 8,
        block_data: {
            title: 'Características Destacadas de la PIXMA G7010',
            item1: 'Sistema MegaTank: 8,300 páginas negro / 7,700 color',
            item2: 'Multifuncional 4-en-1: imprime, copia, escanea, fax',
            item3: 'ADF de 35 hojas para escaneo/copia automático',
            item4: 'Impresión dúplex automática (doble cara)',
            item5: 'WiFi 802.11b/g/n + Ethernet + USB',
            item6: 'Capacidad combinada de 350 hojas',
            item7: 'Botellas de tinta GI-10 sin apretar',
            item8: 'Compatible: Windows, macOS, iOS, Android'
        }
    },
    
    // Bloque 10: Tintas Compatibles (Módulo 4)
    {
        product_id: 'g7010',
        module_id: 4,
        block_order: 9,
        block_data: {
            title: 'Botellas de Tinta Canon GI-10: Recarga Fácil y Económica',
            description: 'Las botellas de tinta genuinas Canon GI-10 están diseñadas específicamente para el sistema MegaTank de la G7010. La tinta negra es pigmentada para textos ultra nítidos, resistentes al agua y con secado rápido, perfecta para documentos de oficina. Las tintas de colores (cian, magenta y amarillo) son a base de colorante para producir imágenes vibrantes y fotos con colores intensos. El sistema de recarga "sin apretar" con válvulas de embocadura única garantiza un llenado limpio: simplemente coloca la botella y la tinta fluye sola. Sin derrames, sin manchas, sin complicaciones.',
            image: 'https://s7d1.scene7.com/.../pixma-g7010-3?wid=800',
            altImage: 'Canon PIXMA G7010 - Sistema de tinta con botellas GI-10 de fácil recarga'
        }
    }
];
```

---

### Ejemplo 2: Cámara EOS R50 V (Contenido Completo)

```javascript
const inpageBlocks = [
    // Banner
    { 
        module_id: 1, 
        block_order: 0, 
        block_data: {
            image: 'https://.../eos-r50v-primary.jpg',
            altImage: 'Canon EOS R50 V + RF-S 14-30mm f/4-6.3 IS STM PZ - Tu Vlog, Tu Estilo - Cámara mirrorless para creadores de contenido'
        }
    },
    
    // Introducción (Módulo 2)
    { 
        module_id: 2, 
        block_order: 1, 
        block_data: {
            title: 'EOS R50 V + RF-S 14-30mm f/4-6.3 IS STM PZ: Tu Vlog, Tu Estilo',
            col1Text: 'La primera cámara enfocada en video con lentes intercambiables de la serie EOS V de Canon. Este kit incluye el lente RF-S 14-30mm f/4-6.3 IS STM PZ, un zoom ultra gran angular compacto con control de zoom electrónico (Power Zoom) ideal para vlogs y video. Diseñada desde cero pensando en creadores de contenido.',
            col2Text: 'El lente RF-S 14-30mm PZ ofrece estabilización óptica IS, control de zoom suave y silencioso perfecto para video, y un rango focal versátil desde ultra gran angular 14mm hasta 30mm. La cámara captura 4K 60p en 10 bits con Canon Log 3. Todo el kit pesa solo 570 gramos.'
        }
    },
    
    // Video 4K (Módulo 3 - Imagen izquierda)
    { 
        module_id: 3, 
        block_order: 2, 
        block_data: {
            image: 'https://.../r50v-kit-front-slant.png',
            altImage: 'Canon EOS R50 V + lente RF-S 14-30mm - Grabación 4K profesional',
            title: 'Video 4K Cinematográfico con Sobremuestreo 6K',
            description: 'Captura video 4K 30p con increíble detalle y color vibrante gracias al sobremuestreo desde 6K y el algoritmo de debayer avanzado heredado de la serie CINEMA EOS. El lente RF-S 14-30mm PZ incluido es perfecto para vlogs con su zoom motorizado y ángulo ultra amplio de 14mm. Para escenas de acción rápida, activa el modo 4K 60p Crop. ISO nativo hasta 12,800, expandible a 25,600.'
        }
    },
    
    // Canon Log 3 (Módulo 4 - Imagen derecha)
    { 
        module_id: 4, 
        block_order: 3, 
        block_data: {
            title: 'Canon Log 3: Coloriza Como un Profesional',
            description: 'Canon Log 3 captura un amplio rango dinámico con detalles limpios en sombras y luces, dándote flexibilidad total en postproducción. Graba en formatos profesionales XF-HEVC S (H.265) o XF-AVC S (H.264). Cinema Gamut expande tu espacio de color para crear tu estilo visual único.',
            image: 'https://.../r50v-kit-front.png',
            altImage: 'Canon EOS R50 V - Canon Log 3 y Cinema Gamut para colorización profesional'
        }
    },
    
    // Video YouTube (Módulo 8)
    { 
        module_id: 8, 
        block_order: 4, 
        block_data: {
            youtubeCode: 'atg7bhp_ssU',  // Solo el ID, NO la URL completa
            title: 'Canon EOS R50 V | Diseñada para creadores. Creada para video.',
            description: 'La Canon EOS R50 V fue diseñada para creadores que se mueven con rapidez y quieren que su metraje siga el ritmo. Montura vertical dedicada para grabar video vertical. Captura en Canon Log de 10 bits. Conecta tu micrófono. Cambia de lentes. Presiona grabar con un botón frontal diseñado para creadores que graban en solitario.'
        }
    },
    
    // Comparativa de características (Módulo 7)
    { 
        module_id: 7, 
        block_order: 5, 
        block_data: {
            leftImage: 'https://.../r50v-kit-screen.png',
            leftAlt: 'Canon EOS R50 V con pantalla táctil articulada abierta',
            leftTitle: 'Pantalla Vari-angle',
            leftText: 'Pantalla táctil de 3" totalmente articulada para selfies, vlogs y ángulos creativos. Interfaz auto-rotativa para grabación vertical.',
            rightImage: 'https://.../r50v-magnesium-body.png',
            rightAlt: 'Canon EOS R50 V cuerpo de aleación de magnesio',
            rightTitle: 'Construcción Premium',
            rightText: 'Cuerpo interno de aleación de magnesio para máxima durabilidad y disipación térmica. Grabación continua hasta 2 horas en 4K.'
        }
    },
    
    // Lista de características (Módulo 5)
    { 
        module_id: 5, 
        block_order: 6, 
        block_data: {
            title: 'Características del Kit EOS R50 V + RF-S 14-30mm PZ',
            item1: 'Kit incluye lente RF-S 14-30mm f/4-6.3 IS STM PZ',
            item2: 'Power Zoom: control de zoom electrónico suave para video',
            item3: 'Ultra gran angular 14mm ideal para vlogs y espacios reducidos',
            item4: 'Estabilización óptica IS en el lente + Movie Digital IS',
            item5: '14 filtros creativos: StoryMagenta, RetroGreen, Accent Red',
            item6: 'Cinema View: aspecto 2.35:1 + 23.98fps cinematográfico',
            item7: 'Audio 4 canales LPCM con 3 micrófonos integrados',
            item8: 'Sensor APS-C 24.2MP + DIGIC X: 15 FPS con tracking'
        }
    }
];
```

---

## 10. Troubleshooting

### Error: "Could not find the 'X' column"

**Causa:** Los nombres de campos no coinciden con el esquema de la DB.

**Solución:** Usar `block_order` y `block_data` (no `position` y `data`).

```javascript
// ❌ Incorrecto
{ position: 0, data: { ... } }

// ✅ Correcto
{ block_order: 0, block_data: { ... } }
```

### Error: Imágenes no aparecen en el preview

**Causas posibles:**
1. URL de imagen incorrecta o inaccesible
2. CORS bloqueando la imagen

**Solución:** Verificar que la URL sea accesible directamente en el navegador.

### Error: Excel no tiene los datos correctos

**Causa:** Campo no mapeado correctamente.

**Solución:** Verificar que el nombre del campo en `block_data` coincida con los campos esperados por el módulo en `falabellaRules.js`.

### Error: SKU no aparece en el Excel

**Causa:** El SKU se debe escribir en celda B1.

**Verificación:** El `excelGenerator.js` debe incluir:
```javascript
sheet.getCell('B1').value = sku;
```

### Error: Producto no aparece en el Dashboard

**Causas:**
1. Cache del frontend
2. Producto sin bloques

**Solución:**
```javascript
// Verificar en Supabase
curl "https://bupnqihroawrvcvzpbqv.supabase.co/rest/v1/products?id=eq.[ID]" \
  -H "apikey: [KEY]"

// Verificar bloques
curl "https://bupnqihroawrvcvzpbqv.supabase.co/rest/v1/inpage_blocks?product_id=eq.[ID]" \
  -H "apikey: [KEY]"
```

---

## Checklist de Creación de InPage

### 📋 Preparación
- [ ] **Información recopilada**
  - [ ] Nombre del producto
  - [ ] SKU Padre de Falabella
  - [ ] Categoría (Printers, Cameras, Lenses, Ink)
  - [ ] Características principales (mínimo 5)
  - [ ] Especificaciones técnicas completas
  - [ ] Beneficios para el usuario
  - [ ] Casos de uso típicos

### 🖼️ Imágenes
- [ ] **Imágenes preparadas**
  - [ ] Imagen principal del producto (Scene7 o Storage)
  - [ ] Mínimo 3-4 imágenes de características (overview)
  - [ ] Verificar que las URLs son accesibles
  - [ ] Alt text descriptivo para cada imagen (10+ palabras)

### ✍️ Contenido (MUY IMPORTANTE)
- [ ] **Textos publicitarios de calidad**
  - [ ] Título principal descriptivo y atractivo
  - [ ] Introducción en dos columnas (80+ palabras por columna)
  - [ ] Cada descripción tiene 50-100 palabras mínimo
  - [ ] Textos incluyen beneficios, no solo características
  - [ ] Menciona casos de uso concretos
  - [ ] Lenguaje persuasivo y emotivo
  - [ ] Sin repeticiones entre bloques
  - [ ] Especificaciones técnicas completas

### 💻 Script
- [ ] **Script creado correctamente**
  - [ ] ID único del producto (minúsculas, guiones)
  - [ ] SKU correcto de Falabella
  - [ ] Usa `block_order` y `block_data` (no `position` y `data`)
  - [ ] Módulos variados (no repetir mucho el mismo)
  - [ ] Alternancia visual (Módulo 3 → 4 → 3 → 4)
  - [ ] Mínimo 8-10 bloques para contenido completo

### ✅ Verificación Post-Creación
- [ ] **Funcionalidad**
  - [ ] Producto aparece en Dashboard
  - [ ] Preview muestra todos los bloques
  - [ ] Imágenes se cargan correctamente
  - [ ] Textos se ven completos en la preview

- [ ] **Exportación**
  - [ ] Excel genera con SKU en B1
  - [ ] Nombres de módulo correctos en columna B
  - [ ] ZIP contiene todas las imágenes
  - [ ] Imágenes redimensionadas correctamente

### 📊 Calidad del Contenido (Autoevaluación)

| Criterio | ❌ Malo | ⚠️ Regular | ✅ Bueno |
|----------|---------|------------|---------|
| Longitud descripción | <30 palabras | 30-50 palabras | 50+ palabras |
| Beneficios mencionados | 0 | 1-2 | 3+ |
| Casos de uso | Ninguno | Genéricos | Específicos |
| Alt de imágenes | Vacío | Genérico | Descriptivo |
| Variedad de módulos | Solo 1-2 tipos | 3-4 tipos | 5+ tipos |
| Total de bloques | <5 | 5-7 | 8-10 |

---

## Recursos Adicionales

- **Template Excel:** `/public/assets/InPage Builder_v8.xlsx`
- **Configuración Módulos:** `/src/config/falabellaRules.js`
- **Generador Excel:** `/src/utils/excelGenerator.js`
- **Generador ZIP:** `/src/utils/zipGenerator.js`
- **Scripts existentes:** `/scripts/create-*.js`

---

## 11. Crear InPages con Fuentes Limitadas

### Situación
A veces Canon lanza productos nuevos y la única información disponible es una página web básica de una tienda regional (Canon Chile, México, etc.) sin la información completa que tendría el sitio oficial de USA o Latinoamérica.

### Proceso Recomendado

#### Paso 1: Extraer Información Disponible

De la página del producto, extraer:
- **SKU Canon** (buscar en URL o código del producto)
- **Especificaciones técnicas** (tabla de specs)
- **Descripción general** (texto introductorio)
- **Funciones destacadas** (bullets o lista)
- **Tintas/consumibles compatibles**

#### Paso 2: Buscar Imágenes en Scene7

Canon almacena todas sus imágenes de producto en Scene7. El patrón de URL es:
```
https://s7d1.scene7.com/is/image/canon/[SKU]_[producto]-[tipo]?wid=[ancho]
```

**Cómo encontrar imágenes:**
1. Inspeccionar la página web del producto (F12 > Network > Img)
2. Buscar URLs que contengan `s7d1.scene7.com`
3. Notar el patrón del SKU (ej: `6706C004_pixma-g3190`)

**Variaciones comunes:**
```
[SKU]_[producto]_primary    → Imagen principal
[SKU]_[producto]_2          → Vista lateral 1
[SKU]_[producto]_3          → Vista lateral 2
[SKU]_[producto]_4          → Vista superior/detalle
```

**Ejemplo PIXMA G3190:**
```javascript
const IMAGES = {
    primary: 'https://s7d1.scene7.com/is/image/canon/6706C004_pixma-g3190_primary?wid=800',
    angle2: 'https://s7d1.scene7.com/is/image/canon/6706C004_pixma-g3190_2?wid=800',
    angle3: 'https://s7d1.scene7.com/is/image/canon/6706C004_pixma-g3190_3?wid=800',
    angle4: 'https://s7d1.scene7.com/is/image/canon/6706C004_pixma-g3190_4?wid=800'
};
```

#### Paso 3: Complementar Información con Productos Similares

Si el producto es similar a otros existentes, usar esos InPages como referencia:
- **G3190** es similar a **G3170/G3180** → Revisar esos InPages
- **Nueva cámara RF** → Revisar InPages de EOS R50, R50V
- **Nuevo lente** → Revisar InPages de lentes similares

**Buscar InPages similares:**
```bash
curl -s "https://bupnqihroawrvcvzpbqv.supabase.co/rest/v1/inpage_blocks?product_id=eq.g3170" \
  -H "apikey: [KEY]"
```

#### Paso 4: Reutilizar Assets Existentes

Para imágenes de tintas/consumibles, usar los assets locales:
```javascript
// Tintas GI-10 (para G5010, G6010, G7010)
'/assets/inpages/tintas/gi10_kit.jpg'

// Tintas GI-11 (para G3170, G3180, G3190, G4170)
'/assets/inpages/tintas/gi11_kit.jpg'

// Tintas GI-190 (para G3100, G3110, G4100, G4110)
'/assets/inpages/tintas/gi190_kit.jpg'
```

#### Paso 5: Expandir Textos con Conocimiento del Producto

Aunque la fuente tenga poca información, el redactor debe:
1. **Conocer la línea de productos** Canon MegaTank
2. **Entender los beneficios** de cada característica
3. **Escribir textos persuasivos** que conecten con el usuario

**Ejemplo de expansión:**

❌ **Fuente original (pobre):**
> "Sistema MegaTank de 4 tintas recargables permite imprimir hasta 6,000 páginas en negro"

✅ **Texto expandido (rico):**
> "El revolucionario sistema de tanques de tinta integrado MegaTank de la PIXMA G3190 utiliza 4 tintas de alta capacidad: negro pigmentado para textos ultra nítidos y resistentes al agua, más cian, magenta y amarillo a base de colorante para imágenes vibrantes y fotos de calidad fotográfica. Los niveles de tinta son claramente visibles desde el exterior del equipo, permitiéndote saber siempre cuándo es momento de recargar. Las botellas GI-11 tienen un diseño de fácil recarga que evita derrames y errores."

#### Paso 6: Documentar las Fuentes

En el script, siempre incluir un comentario con las fuentes utilizadas:

```javascript
/**
 * Script para crear InPage de [PRODUCTO]
 * 
 * NOTA: Modelo nuevo con información limitada.
 * 
 * Fuentes utilizadas:
 * - Principal: https://www.canontiendaonline.cl/es_cl/p/pixma-g3190
 * - Imágenes: Scene7 (6706C004_pixma-g3190_*)
 * - Referencia: InPage de PIXMA G3170 (producto similar)
 * - Tintas: Asset local (/assets/inpages/tintas/gi11_kit.jpg)
 */
```

### Checklist para Productos con Fuentes Limitadas

- [ ] SKU del producto identificado
- [ ] Imágenes encontradas en Scene7 (mínimo 4)
- [ ] Especificaciones técnicas extraídas
- [ ] InPage de producto similar consultado como referencia
- [ ] Textos expandidos con beneficios y casos de uso
- [ ] Asset de tintas/consumibles reutilizado
- [ ] Fuentes documentadas en el script
- [ ] Producto marcado para revisión futura cuando haya más info

### Tabla de Compatibilidad de Tintas

| Modelo | Serie Tinta | Asset Local |
|--------|-------------|-------------|
| G5010, G5011, G6010, G6011, G7010 | GI-10 | `/assets/inpages/tintas/gi10_kit.jpg` |
| G1130, G2160, G2170, G3160, G3170, G3180, G3190, G4170, G4180 | GI-11 | `/assets/inpages/tintas/gi11_kit.jpg` |
| G2100, G2110, G3100, G3110, G4100, G4110 | GI-190 | `/assets/inpages/tintas/gi190_kit.jpg` |

---

## 12. Equivalencias de Modelos entre Mercados Regionales

### El Problema de la Nomenclatura Regional

Canon utiliza **números de modelo diferentes** para el mismo producto (o productos muy similares) según el mercado geográfico. Esto afecta directamente la búsqueda de imágenes y recursos.

### Patrón de Nomenclatura por Región

| Región | Sufijo Típico | Ejemplo |
|--------|---------------|---------|
| **Latinoamérica (CLA)** | x0, x90 | G3170, G3190, G4180 |
| **USA/Canadá** | x0, x70 | G3270, G4570 |
| **Europa (EMEA)** | x0, x60, x70 | G3560, G3570, G4570 |
| **Asia/Oceanía** | x0, x60 | G3360, G3660, G4670 |
| **Japón** | x0, x60 | G3360 (serie PIXUS) |

### Tabla de Equivalencias Conocidas

| CLA (Chile) | USA | Europa | Asia | SKU Scene7 | Diferencia Clave |
|-------------|-----|--------|------|-------------|------------------|
| G3170 | G3270 | G3570 | G3660 | 5805C002 | LCD monocromo |
| **G3190** | ¿? | ¿? | ¿? | 6706C004 | **LCD COLOR 6.9cm** |
| G4170 | G4570 | G4570 | G4670 | - | Con ADF |
| G4180 | ¿? | ¿? | ¿? | - | LCD color + ADF |

### Cómo Identificar el Modelo Equivalente

#### 1. Por Características Distintivas
La G3190 tiene **LCD a color de 6.9cm**, mientras que la G3170/G3270/G3570 tienen LCD monocromo. Buscar modelos con esa característica específica.

#### 2. Por SKU en Scene7
```bash
# Verificar qué imágenes existen para un SKU
curl -s -o /dev/null -w "%{http_code}" \
  "https://s7d1.scene7.com/is/image/canon/[SKU]_[modelo]_primary?wid=100"
```

#### 3. Por Tintas Compatibles
- Si usa **GI-11** → Serie G3170/G3180/G3190/G4170/G4180
- Si usa **GI-51** → Serie G3570/G4570 (Europa)
- Si usa **GI-21** → Serie G3270 (USA)

### Imágenes Disponibles por Modelo Equivalente

#### G3270 (USA) - SKU 5805C002
```
https://s7d1.scene7.com/is/image/canon/5805C002_G3270_primary_2
https://s7d1.scene7.com/is/image/canon/5805C002_G3270_2
https://s7d1.scene7.com/is/image/canon/5805C002_G3270_3
https://s7d1.scene7.com/is/image/canon/5805C002_G3270_4
https://s7d1.scene7.com/is/image/canon/5805C002_G3270_5
https://s7d1.scene7.com/is/image/canon/5805C002_G3270_6
https://s7d1.scene7.com/is/image/canon/5805C002_G3270_7
https://s7d1.scene7.com/is/image/canon/5805C002_G3270_8
https://s7d1.scene7.com/is/image/canon/5805C002_G3270_10
https://s7d1.scene7.com/is/image/canon/5805C002_G3270_megatank
```

#### G3570 (Europa) - Imágenes Amplience
```
https://cdn.media.amplience.net/i/canon/pixma-g3570_blk_as_fr_op1_en_megatanklogo_[hash]
https://cdn.media.amplience.net/i/canon/pixma-g3570-series-bk-fra_range_[hash]
https://cdn.media.amplience.net/i/canon/pixma-g3570-series-bk-paper-try-out-fra_gallery_[hash]
```

### Estrategia para Encontrar Imágenes de Modelos con LCD Color

Como la **G3190 tiene LCD color** (característica premium), buscar:

1. **Modelos "premium" de la serie** en otros mercados
2. **Modelos con sufijo 80/90** que suelen ser versiones mejoradas
3. **Buscar en páginas de producto** la especificación "Color LCD" o "LCD a color"

#### Modelos Candidatos a ser Equivalentes de G3190
- G3280 (si existe en USA)
- G3580 (si existe en Europa)  
- G3680 (si existe en Asia)
- Modelos con "color display" en especificaciones

### Proceso para Actualizar Imágenes de un Modelo Regional

1. **Identificar la característica distintiva** (ej: LCD color)
2. **Buscar el modelo equivalente** en USA/Europa con esa característica
3. **Verificar que las imágenes existan** en Scene7 o Amplience
4. **Descargar y subir a Supabase** con nombre descriptivo
5. **Actualizar los bloques** del InPage

```javascript
// Ejemplo: Actualizar G3190 con imágenes de modelo equivalente
const EQUIVALENT_IMAGES = {
  // Si encontramos que G3280 (USA) es equivalente a G3190 (CLA)
  primary: 'https://s7d1.scene7.com/is/image/canon/XXXXX_G3280_primary?wid=800',
  detail: 'https://s7d1.scene7.com/is/image/canon/XXXXX_G3280_lcd_detail?wid=800',
  // etc.
};
```

### Nota Importante

⚠️ **La G3190 parece ser un modelo exclusivo o muy nuevo para Latinoamérica** con LCD a color. Si no se encuentra un equivalente exacto con LCD color en otros mercados, las opciones son:

1. Usar imágenes genéricas de la serie G3xxx (aunque el LCD sea diferente)
2. Crear imágenes propias del producto físico
3. Usar renders/mockups del producto
4. Esperar a que Canon publique más recursos para este modelo

---

## 13. Actualización de Imágenes en InPages Existentes

### Problema: Imágenes Genéricas de Producto

Cuando un InPage tiene demasiadas fotos del producto (solo vistas frontales/laterales), falta contexto visual que apoye el contenido de cada bloque.

### Solución: Usar Imágenes Contextuales

#### Tipos de Imágenes Necesarias

| Tipo | Uso | Fuentes |
|------|-----|---------|
| **Producto principal** | Bloque de presentación | Scene7 `_primary` |
| **Rendimiento/Yield** | Bloques de MegaTank/ahorro | Storage: `g4180-yield.jpg` |
| **Detalle LCD/Panel** | Bloques de interfaz | Storage: `g4180-detail.png` |
| **Móvil/App** | Bloques de conectividad | Storage: `g4180-mobile-print.png` |
| **Escaneo/Copia** | Bloques multifunción | Storage: `g4180-adf-scan.jpg` |
| **Mantenimiento** | Bloques de servicio | Storage: `g4180-maintenance.jpg` |
| **Tintas/Botellas** | Bloques de consumibles | Storage: `g4180-bottles.png` |
| **Kit de tintas** | Bloque final | Storage: `kit-gi11/gi11_kit.jpg` |

#### Imágenes Reutilizables en Supabase Storage

```
inpage-images/
├── pixma-g4180/
│   ├── g4180-yield.jpg        # Rendimiento de páginas
│   ├── g4180-bottles.png      # Botellas de tinta
│   ├── g4180-detail.png       # Detalle del panel
│   ├── g4180-mobile-print.png # Impresión móvil
│   ├── g4180-adf-scan.jpg     # Escáner/ADF
│   ├── g4180-maintenance.jpg  # Mantenimiento
│   ├── g4180-angle.png        # Vista angular
│   └── g4180-side.png         # Vista lateral
├── kit-gi10/
│   └── gi10_kit.jpg
├── kit-gi11/
│   └── gi11_kit.jpg
└── kit-gi190/
    └── gi190_kit.jpg
```

### Script para Actualizar Imágenes

```javascript
// fix-[modelo]-images.js
const SUPABASE_URL = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/inpage-images`;

// Mapeo de bloques a imágenes contextuales
const BLOCK_UPDATES = {
  0: { field: 'image', value: '[URL imagen principal]' },
  2: { field: 'image', value: `${STORAGE_BASE}/pixma-g4180/g4180-yield.jpg` },
  3: { field: 'image', value: `${STORAGE_BASE}/pixma-g4180/g4180-adf-scan.jpg` },
  // ... etc
};
```

### Criterios para Seleccionar Imágenes

1. **Relevancia**: La imagen debe ilustrar el texto del bloque
2. **Consistencia visual**: Mantener estilo similar en todo el InPage
3. **Calidad**: Mínimo 800px de ancho
4. **Producto correcto**: Idealmente del mismo modelo, o familia similar

---

*Documentación creada el 30 de enero de 2026*  
*Última actualización: 30 de enero de 2026*  
*Para el proyecto Canon InPage Maker App*
