# Sistema Multi-Proveedor de InPages Canon

## 📌 Resumen

El Inpage Maker App ahora soporta **múltiples proveedores** de InPages:

| Proveedor | Formato | Imágenes | Estado |
|-----------|---------|----------|--------|
| **Falabella** | Excel v8 + Imágenes | 72dpi, varias dimensiones | ✅ Master |
| **Hites** | Excel + HTML embebido | 1000×1000px mínimo, 72dpi | ✅ Implementado |

---

## 🏗️ Arquitectura

```
                    ┌─────────────────────┐
                    │   InPage Content    │
                    │   (Bloques Master)  │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │  Falabella  │     │ Hites Excel │     │ Hites HTML  │
    │    v8 ZIP   │     │   + Imgs    │     │   + Imgs    │
    └─────────────┘     └─────────────┘     └─────────────┘
```

### Principio: Falabella como Master

- Los InPages se crean/editan usando el formato de bloques de Falabella
- Los exports a otros proveedores (Hites) se **derivan** del contenido master
- Esto permite mantener un solo catálogo centralizado

---

## 📦 Opciones de Export (Botón Pack)

### 1. Falabella v8 (Excel + Imágenes ZIP)
- **Formato**: Excel según plantilla v8 de Falabella
- **Imágenes**: Carpeta con imágenes originales
- **Archivo**: `[SKU]_Inpage.zip`

### 2. Hites Pack (Excel + Imágenes 1000px)
- **Formato**: Excel con HTML embebido para FlixMedia
- **Imágenes**: Redimensionadas a mínimo 1000×1000px
- **Archivo**: `[SKU]_Hites_Pack.zip`

### 3. Hites HTML (HTML listo + Imágenes 1000px)
- **Formato**: Archivo HTML listo para copiar a FlixMedia
- **Imágenes**: Redimensionadas a mínimo 1000×1000px
- **Archivo**: `[SKU]_Hites_HTML.zip`

### 4. Exportar PDF (Vista Previa para Compartir)
- **Formato**: PDF generado desde el HTML del InPage
- **Uso**: Enviar al cliente para visualizar el contenido de forma amigable
- **Flujo**: Abre diálogo de impresión del navegador → Guardar como PDF
- **Incluye**: Header con nombre y SKU, bloques con etiquetas, footer con fecha

---

## 🏷️ Badge HITES_ORIGIN

Los productos que fueron originalmente creados para Hites (importados del Drive de Hites) llevan el badge `HITES_ORIGIN` para identificarlos visualmente.

```jsx
import { BADGE_TYPES, ProductBadge } from './config/productBadges';

// Uso
<ProductBadge type={BADGE_TYPES.HITES_ORIGIN} />
```

**Estilo**: Fondo rosa (`rose-50`), texto rosa oscuro (`rose-600`), ícono Store

---

## 🔄 Mapeo de Módulos Falabella → Hites

| Módulo Falabella | Bloque Hites |
|------------------|--------------|
| `header_banner` | BOX TÍTULO |
| `two_column_left` | BOX TEXTO + IMAGEN |
| `two_column_right` | BOX IMAGEN + TEXTO |
| `three_column` | 3x BOX TEXTO + IMAGEN (pequeño) |
| `feature_icons` | BOX ÍCONOS |
| `video_banner` | BOX VIDEO |
| `image_strip` | BOX GALERÍA |
| `specs_table` | BOX ESPECIFICACIONES |

---

## 📁 Estructura de Archivos

```
src/
├── utils/
│   ├── excelGenerator.js      # Falabella Excel
│   ├── zipGenerator.js        # Falabella ZIP
│   ├── hitesExcelGenerator.js # Hites Excel con HTML
│   ├── hitesHtmlGenerator.js  # Generador HTML Hites
│   └── hitesZipGenerator.js   # Hites ZIP con resize
├── config/
│   └── productBadges.js       # Incluye HITES_ORIGIN
└── components/
    └── Dashboard.jsx          # Pack dropdown

scripts/
└── import-hites-inpages.js    # Importador Drive Hites
```

---

## 🔧 Requisitos de Imágenes por Proveedor

### Falabella
- Formatos: JPG, PNG
- Resolución: 72 dpi
- Dimensiones: Variables según módulo

### Hites
- Formatos: JPG, PNG
- Resolución: 72 dpi
- **Dimensiones mínimas**: 1000 × 1000 px
- Las imágenes se redimensionan automáticamente al exportar

---

## 📥 Importación de InPages Hites Existentes

El script `import-hites-inpages.js` importa InPages del Drive de Hites:

```bash
cd scripts
node import-hites-inpages.js
```

### 📂 Ruta Google Drive (IMPORTANTE - USAR SIEMPRE ESTA RUTA)

**Finder Path:**
```
Google Drive - javier@atlasdigital.cl > Mi unidad > Canon Atlas Drive > B2C > Trade Marketing > Inpages > InPages Hites
```

**Ruta absoluta macOS:**
```
/Users/javohv/Library/CloudStorage/GoogleDrive-javier@atlasdigital.cl/Mi unidad/Canon Atlas Drive/B2C/Trade Marketing/Inpages/InPages Hites/
```

### Estructura del Drive Hites:
```
InPages Hites/
├── Printers/
│   ├── Maxify GX3010/
│   ├── Pixma G3170 Black/
│   └── ...
├── Photo/
│   ├── EOS R100 18-45 IS STM/
│   └── EOS R50 18-45 IS STM/
└── Tintas/
    ├── GI-190 Cyan/
    └── ...
```

### Comportamiento:
- **Productos únicos de Hites**: Se importan con badge HITES_ORIGIN
- **Productos que ya existen en Falabella**: Se omiten (sin duplicar)
- **Bloques generados**: Se crean bloques básicos a partir de las imágenes

---

## 🗄️ Almacenamiento de Imágenes (Supabase Storage)

Todas las imágenes de productos se almacenan en **Supabase Storage** para acceso remoto:

### Bucket: `inpage-images`
```
inpage-images/
├── [producto-falabella]/      # Imágenes productos Falabella
│   ├── banner.jpg
│   └── ...
└── hites/                     # Imágenes productos Hites
    ├── g2110-black-hites/
    │   ├── 932468001-1.jpg
    │   └── ...
    ├── tinta-gi-190-cyan-hites/
    │   └── ...
    └── [producto-id]/
```

### URLs de Imágenes
```
Base URL: https://bupnqihroawrvcvzpbqv.supabase.co/storage/v1/object/public/inpage-images/
Ejemplo:  https://bupnqihroawrvcvzpbqv.supabase.co/storage/v1/object/public/inpage-images/hites/g2110-black-hites/932468001-1.jpg
```

### Script de Upload Hites a Supabase
```bash
cd scripts
node upload-hites-images.js
```

Este script:
1. Lee productos Hites de Supabase
2. Busca imágenes en el Drive local (ruta Hites)
3. Sube las imágenes a Supabase Storage
4. Actualiza los block_data con las rutas correctas

### Formato de rutas en block_data
- **Almacenado**: `hites/[producto-id]/[sku]-[numero].jpg`
- **Resuelto a URL**: Automático via `getImageUrl()` en `supabaseData.js`

---

## 🎨 UI del Dropdown Pack

El botón "Pack" ahora muestra un menú desplegable con las 3 opciones:

```jsx
// Dashboard.jsx
const handleGeneratePack = (type) => {
    switch(type) {
        case 'falabella':
            generateFalabellaZip(product);
            break;
        case 'hites-excel':
            generateHitesPackZip(product);
            break;
        case 'hites-html':
            generateHitesHtmlZip(product);
            break;
    }
};
```

---

## 📊 Flujo de Trabajo Recomendado

1. **Crear InPage** usando el editor (formato Falabella master)
2. **Previsualizar** con el preview en tiempo real
3. **Exportar** según destino:
   - Para Falabella → "Falabella v8"
   - Para Hites → "Hites Pack" o "Hites HTML"

---

## 🚀 Extensión Futura

El sistema está diseñado para agregar más proveedores fácilmente:

1. Crear `[proveedor]Generator.js` para el formato específico
2. Crear `[proveedor]ZipGenerator.js` para el empaquetado
3. Agregar opción al dropdown en `Dashboard.jsx`
4. (Opcional) Agregar badge `[PROVEEDOR]_ORIGIN`

### Posibles proveedores futuros:
- Ripley
- Paris
- Mercado Libre
- Amazon

---

## 📞 Contacto

Para dudas sobre el sistema multi-proveedor, contactar al equipo de desarrollo Atlas Digital.
