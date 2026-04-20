/**
 * Generador de HTML para Hites
 * Convierte bloques de InPage Falabella a HTML compatible con Hites
 */

import { modules } from '../config/falabellaRules';
import { getImageUrl, SUPABASE_URL, STORAGE_BUCKET } from '../lib/supabase';

// URL base pública de Supabase Storage
const SUPABASE_STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`;

/**
 * Mapeo de módulos Falabella a bloques Hites
 */
const MODULE_TO_HITES_BLOCK = {
    'header_banner': 'BOX_TITULO',
    'two_column_left': 'BOX_TEXTO_IMAGEN',
    'two_column_right': 'BOX_IMAGEN_TEXTO',
    'full_width_image': 'BOX_IMAGEN_HORIZONTAL',
    'feature_list': 'BOX_BULLETS',
    'specs_comparison': 'BOX_SPECS',
    'video_block': 'BOX_VIDEO',
};

/**
 * Genera CSS base para el InPage Hites
 */
const generateBaseStyles = () => `
<style>
    .hites-inpage {
        font-family: 'Roboto', Arial, sans-serif;
        max-width: 100%;
        margin: 0 auto;
        color: #333;
    }
    .hites-inpage h2 {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 16px;
        color: #1a1a1a;
    }
    .hites-inpage h3 {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #333;
    }
    .hites-inpage p {
        font-size: 14px;
        line-height: 1.6;
        color: #666;
        margin-bottom: 16px;
    }
    .hites-inpage img {
        max-width: 100%;
        height: auto;
        display: block;
    }
    .hites-box {
        margin-bottom: 32px;
        overflow: hidden;
    }
    .hites-box-titulo {
        text-align: center;
        padding: 24px;
    }
    .hites-box-titulo img {
        margin: 0 auto 20px;
    }
    .hites-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 24px;
    }
    .hites-col-6 {
        flex: 1;
        min-width: 280px;
    }
    .hites-box-full img {
        width: 100%;
    }
    .hites-bullets ul {
        list-style: none;
        padding: 0;
    }
    .hites-bullets li {
        padding: 8px 0;
        padding-left: 24px;
        position: relative;
    }
    .hites-bullets li::before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #c41230;
        font-weight: bold;
    }
    @media (max-width: 768px) {
        .hites-row {
            flex-direction: column;
        }
        .hites-col-6 {
            width: 100%;
        }
    }
</style>
`;

/**
 * Genera bloque BOX TÍTULO
 */
const generateBoxTitulo = (block, imageBasePath, useSupabaseUrl) => {
    const { title, subtitle, description } = block.data;
    const mainImage = block.data.main_image || block.data.image;
    const imgSrc = mainImage ? getFullImageUrl(mainImage, imageBasePath, useSupabaseUrl) : '';
    
    return `
<div class="hites-box hites-box-titulo">
    <h2>${title || 'Título del Producto'}</h2>
    ${imgSrc ? `<img src="${imgSrc}" alt="${title || 'Producto Canon'}">` : ''}
    ${subtitle ? `<h3>${subtitle}</h3>` : ''}
    ${description ? `<p>${description}</p>` : ''}
</div>
`;
};

/**
 * Genera bloque BOX TEXTO + IMAGEN (texto izquierda, imagen derecha)
 */
const generateBoxTextoImagen = (block, imageBasePath, useSupabaseUrl) => {
    const { title, description, image } = block.data;
    const imgSrc = image ? getFullImageUrl(image, imageBasePath, useSupabaseUrl) : '';
    
    return `
<div class="hites-box">
    <div class="hites-row">
        <div class="hites-col-6">
            ${title ? `<h3>${title}</h3>` : ''}
            ${description ? `<p>${description}</p>` : ''}
        </div>
        <div class="hites-col-6">
            ${imgSrc ? `<img src="${imgSrc}" alt="${title || 'Imagen producto'}">` : ''}
        </div>
    </div>
</div>
`;
};

/**
 * Genera bloque BOX IMAGEN + TEXTO (imagen izquierda, texto derecha)
 */
const generateBoxImagenTexto = (block, imageBasePath, useSupabaseUrl) => {
    const { title, description, image } = block.data;
    const imgSrc = image ? getFullImageUrl(image, imageBasePath, useSupabaseUrl) : '';
    
    return `
<div class="hites-box">
    <div class="hites-row">
        <div class="hites-col-6">
            ${imgSrc ? `<img src="${imgSrc}" alt="${title || 'Imagen producto'}">` : ''}
        </div>
        <div class="hites-col-6">
            ${title ? `<h3>${title}</h3>` : ''}
            ${description ? `<p>${description}</p>` : ''}
        </div>
    </div>
</div>
`;
};

/**
 * Genera bloque BOX IMAGEN HORIZONTAL (imagen full width)
 */
const generateBoxImagenHorizontal = (block, imageBasePath, useSupabaseUrl) => {
    const { title, description, image } = block.data;
    const imgSrc = image ? getFullImageUrl(image, imageBasePath, useSupabaseUrl) : '';
    
    return `
<div class="hites-box hites-box-full">
    ${imgSrc ? `<img src="${imgSrc}" alt="${title || 'Imagen producto'}">` : ''}
    ${title ? `<h3 style="text-align:center; margin-top:16px;">${title}</h3>` : ''}
    ${description ? `<p style="text-align:center;">${description}</p>` : ''}
</div>
`;
};

/**
 * Genera bloque BOX BULLETS (lista de características)
 */
const generateBoxBullets = (block, imageBasePath, useSupabaseUrl) => {
    const { title, features, image } = block.data;
    const featureList = features || block.data.bullet_points || [];
    const imgSrc = image ? getFullImageUrl(image, imageBasePath, useSupabaseUrl) : '';
    
    return `
<div class="hites-box">
    <div class="hites-row">
        <div class="hites-col-6 hites-bullets">
            ${title ? `<h3>${title}</h3>` : ''}
            <ul>
                ${Array.isArray(featureList) ? featureList.map(f => `<li>${f}</li>`).join('\n                ') : ''}
            </ul>
        </div>
        <div class="hites-col-6">
            ${imgSrc ? `<img src="${imgSrc}" alt="${title || 'Características'}">` : ''}
        </div>
    </div>
</div>
`;
};

/**
 * Genera un bloque genérico para módulos no mapeados
 */
const generateGenericBlock = (block, imageBasePath, useSupabaseUrl) => {
    const { title, description, image } = block.data;
    const imgSrc = image ? getFullImageUrl(image, imageBasePath, useSupabaseUrl) : '';
    
    if (!title && !description && !imgSrc) return '';
    
    return `
<div class="hites-box">
    ${title ? `<h3>${title}</h3>` : ''}
    ${description ? `<p>${description}</p>` : ''}
    ${imgSrc ? `<img src="${imgSrc}" alt="${title || 'Imagen'}">` : ''}
</div>
`;
};

/**
 * Extrae nombre de imagen de una URL o path
 */
const getImageName = (imagePath) => {
    if (!imagePath) return '';
    
    // Si es una URL de Supabase, extraer el nombre del archivo
    if (imagePath.includes('supabase')) {
        const parts = imagePath.split('/');
        return parts[parts.length - 1];
    }
    
    // Si es un path local
    if (imagePath.includes('/')) {
        const parts = imagePath.split('/');
        return parts[parts.length - 1];
    }
    
    return imagePath;
};

/**
 * Genera la URL completa de una imagen
 * @param {string} imagePath - Path de la imagen
 * @param {string} imageBasePath - Base path para las imágenes
 * @param {boolean} useSupabaseUrl - Si true, usa URL de Supabase; si false, usa path relativo
 */
const getFullImageUrl = (imagePath, imageBasePath, useSupabaseUrl = true) => {
    if (!imagePath) return '';
    
    const imageName = getImageName(imagePath);
    
    if (useSupabaseUrl) {
        // URL pública de Supabase
        // imagePath puede ser "hites/product-id/image.jpg"
        if (imagePath.startsWith('hites/')) {
            return `${SUPABASE_STORAGE_URL}/${imagePath}`;
        }
        return `${SUPABASE_STORAGE_URL}/${imageBasePath}/${imageName}`;
    } else {
        // Path relativo para el ZIP
        return `images/${imageName}`;
    }
};

/**
 * Genera HTML completo para un InPage Hites
 * @param {string} sku - SKU del producto
 * @param {Array} blocks - Bloques del InPage
 * @param {Object} options - Opciones adicionales
 * @returns {string} HTML completo
 */
export const generateHitesHtml = (sku, blocks, options = {}) => {
    const {
        year = new Date().getFullYear(),
        category = 'tecnologia',
        productName = '',
        includeStyles = true,
        imageBasePath = `hites/${sku}`,
        useSupabaseUrl = true // true para URLs de Supabase, false para paths relativos en ZIP
    } = options;
    
    let html = '';
    
    // Agregar estilos base si se requiere
    if (includeStyles) {
        html += generateBaseStyles();
    }
    
    html += `<div class="hites-inpage">\n`;
    
    // Procesar cada bloque
    blocks.forEach((block, index) => {
        const moduleId = block.moduleId;
        const hitesBlockType = MODULE_TO_HITES_BLOCK[moduleId];
        
        switch (hitesBlockType || moduleId) {
            case 'BOX_TITULO':
            case 'header_banner':
            case 1: // module_id numérico
                html += generateBoxTitulo(block, imageBasePath, useSupabaseUrl);
                break;
            case 'BOX_TEXTO_IMAGEN':
            case 'two_column_left':
            case 3:
                html += generateBoxTextoImagen(block, imageBasePath, useSupabaseUrl);
                break;
            case 'BOX_IMAGEN_TEXTO':
            case 'two_column_right':
            case 4:
                html += generateBoxImagenTexto(block, imageBasePath, useSupabaseUrl);
                break;
            case 'BOX_IMAGEN_HORIZONTAL':
            case 'full_width_image':
                html += generateBoxImagenHorizontal(block, imageBasePath, useSupabaseUrl);
                break;
            case 'BOX_BULLETS':
            case 'feature_list':
                html += generateBoxBullets(block, imageBasePath, useSupabaseUrl);
                break;
            default:
                // Bloque genérico para módulos no mapeados
                html += generateGenericBlock(block, imageBasePath, useSupabaseUrl);
        }
    });
    
    html += `</div>`;
    
    return html;
};

/**
 * Genera HTML simplificado (sin estilos) para copiar en CMS
 */
export const generateHitesHtmlSimple = (sku, blocks, options = {}) => {
    return generateHitesHtml(sku, blocks, { ...options, includeStyles: false });
};

/**
 * Genera HTML con rutas relativas para incluir en ZIP
 */
export const generateHitesHtmlForZip = (sku, blocks, options = {}) => {
    return generateHitesHtml(sku, blocks, { ...options, useSupabaseUrl: false });
};

/**
 * Obtiene la lista de imágenes utilizadas en el InPage
 * @param {Array} blocks - Bloques del InPage
 * @returns {Array} Lista de nombres de imágenes
 */
export const getHitesImageList = (blocks) => {
    const images = [];
    
    blocks.forEach((block, index) => {
        const data = block.data || {};
        
        // Buscar todas las propiedades que puedan contener imágenes
        Object.entries(data).forEach(([key, value]) => {
            if (key.includes('image') && value && !key.startsWith('_')) {
                images.push({
                    originalPath: value,
                    hitesName: getImageName(value),
                    originalName: getImageName(value)
                });
            }
        });
    });
    
    // Eliminar duplicados
    const uniqueImages = images.filter((img, idx, arr) => 
        arr.findIndex(i => i.originalName === img.originalName) === idx
    );
    
    return uniqueImages;
};

export default {
    generateHitesHtml,
    generateHitesHtmlSimple,
    generateHitesHtmlForZip,
    getHitesImageList,
    MODULE_TO_HITES_BLOCK
};
