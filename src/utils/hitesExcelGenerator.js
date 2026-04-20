/**
 * Generador de Excel para Hites
 * Genera el formato de Excel específico de Hites con código HTML
 */

import ExcelJS from 'exceljs';

/**
 * Mapeo de módulos Falabella a bloques Hites
 */
const MODULE_TO_HITES = {
    'header_banner': 'BOX TÍTULO',
    'two_column_left': 'BOX TEXTO + IMAGEN',
    'two_column_right': 'BOX IMAGEN + TEXTO',
    'full_width_image': 'BOX IMAGEN HORIZONTAL',
    'feature_list': 'BOX BULLETS',
};

/**
 * Genera código HTML para un bloque Hites
 */
const generateBlockHtml = (block, sku, category, year, imageIndex) => {
    const moduleId = block.moduleId;
    const data = block.data || {};
    const imagePath = `images/inpages/${year}/${category}/${sku}`;
    
    switch (moduleId) {
        case 'header_banner':
            return generateTituloHtml(data, imagePath, imageIndex);
        case 'two_column_left':
            return generateTextoImagenHtml(data, imagePath, imageIndex);
        case 'two_column_right':
            return generateImagenTextoHtml(data, imagePath, imageIndex);
        case 'full_width_image':
            return generateImagenHorizontalHtml(data, imagePath, imageIndex);
        case 'feature_list':
            return generateBulletsHtml(data, imagePath, imageIndex);
        default:
            return generateGenericHtml(data, imagePath, imageIndex);
    }
};

const generateTituloHtml = (data, imagePath, idx) => {
    const { title, subtitle, description } = data;
    return `<div class="col-12 "><h3>${title || ''}</h3><img alt="${title || 'Producto'}" src="${imagePath}/${idx}.jpg"><p style="text-align: center">${description || ''}</p></div>`;
};

const generateTextoImagenHtml = (data, imagePath, idx) => {
    const { title, description } = data;
    return `<div class="row"><div class="col-md-6"><h3>${title || ''}</h3><p>${description || ''}</p></div><div class="col-md-6"><img alt="${title || ''}" src="${imagePath}/${idx}.jpg"></div></div>`;
};

const generateImagenTextoHtml = (data, imagePath, idx) => {
    const { title, description } = data;
    return `<div class="row"><div class="col-md-6"><img alt="${title || ''}" src="${imagePath}/${idx}.jpg"></div><div class="col-md-6"><h3>${title || ''}</h3><p>${description || ''}</p></div></div>`;
};

const generateImagenHorizontalHtml = (data, imagePath, idx) => {
    const { title, description } = data;
    return `<div class="col-12"><img alt="${title || ''}" src="${imagePath}/${idx}.jpg" style="width:100%"><p style="text-align:center">${description || ''}</p></div>`;
};

const generateBulletsHtml = (data, imagePath, idx) => {
    const { title, features } = data;
    const bulletList = Array.isArray(features) ? features.map(f => `<li>${f}</li>`).join('') : '';
    return `<div class="row"><div class="col-md-6"><h3>${title || ''}</h3><ul>${bulletList}</ul></div><div class="col-md-6"><img alt="${title || ''}" src="${imagePath}/${idx}.jpg"></div></div>`;
};

const generateGenericHtml = (data, imagePath, idx) => {
    const { title, description } = data;
    return `<div class="col-12"><h3>${title || ''}</h3><p>${description || ''}</p></div>`;
};

/**
 * Genera Excel en formato Hites
 * @param {string} sku - SKU del producto
 * @param {Array} blocks - Bloques del InPage
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<ArrayBuffer>} Buffer del archivo Excel
 */
export const generateHitesExcel = async (sku, blocks, options = {}) => {
    const {
        year = new Date().getFullYear(),
        category = 'tecnologia',
        productName = sku
    } = options;
    
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'InPage Maker - Canon Chile';
    workbook.created = new Date();
    
    // Hoja principal con datos
    const mainSheet = workbook.addWorksheet('DATOS');
    
    // Configurar anchos de columna
    mainSheet.columns = [
        { header: 'BOX', key: 'box', width: 20 },
        { header: 'Texto', key: 'texto', width: 40 },
        { header: 'Año', key: 'year', width: 8 },
        { header: 'Categoría', key: 'category', width: 15 },
        { header: 'SKU', key: 'sku', width: 15 },
        { header: 'Imagen', key: 'imagen', width: 20 },
        { header: 'Alt', key: 'alt', width: 30 },
        { header: 'HTML Generado', key: 'html', width: 80 },
    ];
    
    // Estilo de encabezados
    mainSheet.getRow(1).font = { bold: true };
    mainSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC000' }
    };
    
    // Agregar filas para cada bloque
    let imageIndex = 1;
    blocks.forEach((block, idx) => {
        const blockType = MODULE_TO_HITES[block.moduleId] || 'BOX GENÉRICO';
        const data = block.data || {};
        
        // Fila de título del bloque
        const row = mainSheet.addRow({
            box: blockType,
            texto: data.title || '',
            year: year,
            category: category,
            sku: sku,
            imagen: `${sku}-${imageIndex}.jpg`,
            alt: data.title || productName,
            html: generateBlockHtml(block, sku, category, year, imageIndex)
        });
        
        // Fila de descripción si existe
        if (data.description) {
            mainSheet.addRow({
                box: '',
                texto: data.description,
                year: '',
                category: '',
                sku: '',
                imagen: '',
                alt: '',
                html: ''
            });
        }
        
        // Fila para features/bullets si existen
        if (data.features && Array.isArray(data.features)) {
            data.features.forEach(feature => {
                mainSheet.addRow({
                    box: '',
                    texto: `• ${feature}`,
                    year: '',
                    category: '',
                    sku: '',
                    imagen: '',
                    alt: '',
                    html: ''
                });
            });
        }
        
        // Línea vacía entre bloques
        mainSheet.addRow({});
        
        imageIndex++;
    });
    
    // Hoja de instrucciones
    const instructionsSheet = workbook.addWorksheet('INSTRUCCIONES');
    instructionsSheet.addRow(['INSTRUCCIONES PARA HITES']);
    instructionsSheet.addRow([]);
    instructionsSheet.addRow(['1. Copiar el código HTML de la columna H']);
    instructionsSheet.addRow(['2. Las imágenes deben nombrarse: SKU-1.jpg, SKU-2.jpg, etc.']);
    instructionsSheet.addRow(['3. Tamaño mínimo de imágenes: 1000x1000px a 72dpi']);
    instructionsSheet.addRow(['4. Formatos permitidos: JPG o PNG']);
    instructionsSheet.addRow([]);
    instructionsSheet.addRow(['SKU:', sku]);
    instructionsSheet.addRow(['Categoría:', category]);
    instructionsSheet.addRow(['Año:', year]);
    instructionsSheet.addRow(['Total bloques:', blocks.length]);
    
    instructionsSheet.getRow(1).font = { bold: true, size: 14 };
    instructionsSheet.getColumn(1).width = 50;
    
    // Hoja de HTML completo
    const htmlSheet = workbook.addWorksheet('HTML_COMPLETO');
    
    // Generar HTML completo
    let fullHtml = `<!-- InPage Hites - ${productName || sku} -->\n`;
    fullHtml += `<!-- Generado por InPage Maker - Canon Chile -->\n`;
    fullHtml += `<!-- SKU: ${sku} | Categoría: ${category} | Año: ${year} -->\n\n`;
    
    let htmlImageIndex = 1;
    blocks.forEach(block => {
        fullHtml += generateBlockHtml(block, sku, category, year, htmlImageIndex) + '\n\n';
        htmlImageIndex++;
    });
    
    htmlSheet.addRow(['HTML COMPLETO PARA COPIAR']);
    htmlSheet.addRow([]);
    htmlSheet.addRow([fullHtml]);
    
    htmlSheet.getRow(1).font = { bold: true };
    htmlSheet.getColumn(1).width = 150;
    htmlSheet.getRow(3).alignment = { wrapText: true };
    
    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

/**
 * Obtiene lista de imágenes requeridas para Hites
 */
export const getHitesImageRequirements = (sku, blocks) => {
    return blocks.map((block, idx) => ({
        name: `${sku}-${idx + 1}.jpg`,
        blockType: MODULE_TO_HITES[block.moduleId] || 'GENÉRICO',
        title: block.data?.title || '',
        requirements: 'Mínimo 1000x1000px, 72dpi, JPG o PNG'
    }));
};

export default {
    generateHitesExcel,
    getHitesImageRequirements
};
