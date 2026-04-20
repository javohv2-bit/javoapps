/**
 * Generador de ZIP para Hites
 * Crea paquetes ZIP con Excel/HTML y carpeta de imágenes para Hites
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateHitesExcel } from './hitesExcelGenerator';
import { generateHitesHtml, generateHitesHtmlForZip, getHitesImageList } from './hitesHtmlGenerator';
import { getImageUrl as getSupabaseImageUrl, SUPABASE_URL, STORAGE_BUCKET } from '../lib/supabase';

// URL base pública de Supabase Storage
const SUPABASE_STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`;

/**
 * Redimensiona una imagen a 1000x1000 para Hites
 * @param {string} imageUrl - URL de la imagen
 * @param {number} targetSize - Tamaño objetivo (default 1000)
 * @returns {Promise<Blob>} Blob de la imagen redimensionada
 */
const resizeImageForHites = async (imageUrl, targetSize = 1000) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calcular dimensiones manteniendo aspect ratio
            let width = img.width;
            let height = img.height;
            
            // Escalar al mínimo de 1000px en el lado más pequeño
            if (width < targetSize || height < targetSize) {
                const scale = targetSize / Math.min(width, height);
                width = Math.round(width * scale);
                height = Math.round(height * scale);
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Dibujar imagen redimensionada
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convertir a blob con calidad alta
            canvas.toBlob(
                blob => resolve(blob),
                'image/jpeg',
                0.92
            );
        };
        
        img.onerror = () => reject(new Error(`Error cargando imagen: ${imageUrl}`));
        img.src = imageUrl;
    });
};

/**
 * Construye la URL completa de una imagen desde Supabase
 */
const buildImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Si ya es una URL completa
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Si es un path relativo a Supabase
    return `${SUPABASE_STORAGE_URL}/${imagePath}`;
};

/**
 * Obtiene la URL de una imagen del bloque
 */
const getImageUrl = (block) => {
    const data = block.data || {};
    
    // Buscar en diferentes campos posibles
    const imageFields = ['image', 'main_image', 'background_image', 'product_image'];
    
    for (const field of imageFields) {
        if (data[field] && !field.startsWith('_')) {
            return buildImageUrl(data[field]);
        }
    }
    
    return null;
};

/**
 * Genera ZIP con Excel Hites + imágenes
 * @param {string} sku - SKU del producto
 * @param {Array} blocks - Bloques del InPage
 * @param {Object} options - Opciones adicionales
 */
export const generateHitesPackZip = async (sku, blocks, options = {}) => {
    const {
        productName = sku,
        category = 'tecnologia',
        year = new Date().getFullYear()
    } = options;
    
    const zip = new JSZip();
    const folderName = `${sku}_Hites`;
    const mainFolder = zip.folder(folderName);
    const imagesFolder = mainFolder.folder(sku);
    
    // Generar Excel Hites
    console.log('Generando Excel Hites...');
    const excelBuffer = await generateHitesExcel(sku, blocks, {
        year,
        category,
        productName
    });
    mainFolder.file(`${sku}_Hites.xlsx`, excelBuffer);
    
    // Procesar imágenes
    console.log('Procesando imágenes para Hites...');
    let imageIndex = 1;
    
    for (const block of blocks) {
        const imageUrl = getImageUrl(block);
        
        if (imageUrl) {
            try {
                // Redimensionar imagen para cumplir requisitos Hites
                const resizedBlob = await resizeImageForHites(imageUrl);
                const imageName = `${sku}-${imageIndex}.jpg`;
                imagesFolder.file(imageName, resizedBlob);
                console.log(`  ✓ Imagen ${imageName} procesada`);
            } catch (error) {
                console.error(`  ✗ Error con imagen ${imageIndex}:`, error);
            }
        }
        
        imageIndex++;
    }
    
    // Agregar archivo README
    const readme = `InPage Hites - ${productName}
=====================================

SKU: ${sku}
Categoría: ${category}
Año: ${year}
Fecha generación: ${new Date().toLocaleDateString('es-CL')}

CONTENIDO:
- ${sku}_Hites.xlsx: Excel con datos y código HTML
- ${sku}/: Carpeta con imágenes optimizadas (1000x1000px, 72dpi)

INSTRUCCIONES:
1. Subir las imágenes de la carpeta ${sku}/ al servidor de Hites
2. Copiar el código HTML de la hoja "HTML_COMPLETO" del Excel
3. Verificar que las rutas de imágenes coincidan con la ubicación en el servidor

FORMATO IMÁGENES:
- Tamaño: Mínimo 1000x1000px
- Resolución: 72dpi
- Formato: JPG o PNG

Generado por InPage Maker - Canon Chile / Atlas
`;
    
    mainFolder.file('README.txt', readme);
    
    // Generar y descargar ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${folderName}.zip`);
    
    console.log(`✓ Pack Hites generado: ${folderName}.zip`);
    return true;
};

/**
 * Genera ZIP con HTML Hites + imágenes
 * @param {string} sku - SKU del producto
 * @param {Array} blocks - Bloques del InPage
 * @param {Object} options - Opciones adicionales
 */
export const generateHitesHtmlZip = async (sku, blocks, options = {}) => {
    const {
        productName = sku,
        category = 'tecnologia',
        year = new Date().getFullYear()
    } = options;
    
    const zip = new JSZip();
    const folderName = `${sku}_Hites_HTML`;
    const mainFolder = zip.folder(folderName);
    const imagesFolder = mainFolder.folder('images');
    
    // Generar HTML
    console.log('Generando HTML Hites...');
    const htmlContent = generateHitesHtml(sku, blocks, {
        year,
        category,
        productName,
        includeStyles: true,
        imageBasePath: 'images'
    });
    
    // HTML completo con estructura de página
    const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName} - InPage Canon</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
${htmlContent}
</body>
</html>`;
    
    mainFolder.file(`${sku}_inpage.html`, fullHtml);
    
    // HTML solo contenido (para copiar en CMS)
    mainFolder.file(`${sku}_contenido.html`, htmlContent);
    
    // Procesar imágenes
    console.log('Procesando imágenes...');
    let imageIndex = 1;
    
    for (const block of blocks) {
        const imageUrl = getImageUrl(block);
        
        if (imageUrl) {
            try {
                const resizedBlob = await resizeImageForHites(imageUrl);
                const imageName = `${imageIndex}.jpg`;
                imagesFolder.file(imageName, resizedBlob);
                console.log(`  ✓ Imagen ${imageName} procesada`);
            } catch (error) {
                console.error(`  ✗ Error con imagen ${imageIndex}:`, error);
            }
        }
        
        imageIndex++;
    }
    
    // Agregar README
    const readme = `InPage Hites (HTML) - ${productName}
=====================================

SKU: ${sku}
Fecha: ${new Date().toLocaleDateString('es-CL')}

ARCHIVOS:
- ${sku}_inpage.html: Página HTML completa con estilos
- ${sku}_contenido.html: Solo contenido HTML (para copiar en CMS)
- images/: Carpeta con imágenes optimizadas

INSTRUCCIONES:
1. Subir la carpeta 'images' al servidor
2. Copiar el contenido de ${sku}_contenido.html al CMS de Hites
3. Ajustar las rutas de imágenes según la ubicación en el servidor

Generado por InPage Maker - Canon Chile / Atlas
`;
    
    mainFolder.file('README.txt', readme);
    
    // Generar y descargar ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `${folderName}.zip`);
    
    console.log(`✓ Pack HTML Hites generado: ${folderName}.zip`);
    return true;
};

export default {
    generateHitesPackZip,
    generateHitesHtmlZip,
    resizeImageForHites
};
