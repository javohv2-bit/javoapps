/**
 * PDF Generator for InPage Content
 * 
 * Genera un PDF del HTML del InPage para compartir con clientes
 */

import { generateBlockHtml } from '../config/falabellaHtmlTemplates';

/**
 * Generar y descargar el InPage como PDF
 * @param {Object} product - Producto con bloques
 */
export const generatePdfFromHtml = async (product) => {
    const { name, sku, blocks } = product;
    
    // Construir el HTML completo con estilos para PDF
    const htmlContent = buildPdfHtml(product);
    
    // Crear un iframe oculto para la impresión
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    document.body.appendChild(printFrame);
    
    // Escribir el contenido en el iframe
    const doc = printFrame.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();
    
    // Esperar a que las imágenes carguen
    await new Promise((resolve) => {
        const images = doc.querySelectorAll('img');
        if (images.length === 0) {
            resolve();
            return;
        }
        
        let loadedCount = 0;
        const checkDone = () => {
            loadedCount++;
            if (loadedCount >= images.length) {
                resolve();
            }
        };
        
        images.forEach(img => {
            if (img.complete) {
                checkDone();
            } else {
                img.onload = checkDone;
                img.onerror = checkDone;
            }
        });
        
        // Timeout de seguridad
        setTimeout(resolve, 5000);
    });
    
    // Pequeño delay adicional para renderizado
    await new Promise(r => setTimeout(r, 300));
    
    // Imprimir (el usuario puede guardar como PDF)
    printFrame.contentWindow.print();
    
    // Limpiar después de un momento
    setTimeout(() => {
        document.body.removeChild(printFrame);
    }, 1000);
};

/**
 * Construir el HTML optimizado para PDF
 */
function buildPdfHtml(product) {
    const { name, sku, blocks = [] } = product;
    
    // Generar HTML de cada bloque
    const blocksHtml = blocks.map((block, index) => {
        // Obtener URLs de imágenes del block.data
        const imageSources = {};
        if (block.data.image) {
            imageSources.image = block.data.image;
        }
        if (block.data.leftImage) {
            imageSources.leftImage = block.data.leftImage;
        }
        if (block.data.rightImage) {
            imageSources.rightImage = block.data.rightImage;
        }
        
        const blockHtml = generateBlockHtml(block.moduleId, block.data, imageSources);
        return `
            <div class="block-container">
                <div class="block-label">Bloque ${index + 1}: ${getModuleName(block.moduleId)}</div>
                <div class="block-content">
                    ${blockHtml}
                </div>
            </div>
        `;
    }).join('');
    
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InPage - ${name} (${sku})</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @page {
            size: A4;
            margin: 15mm;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: white;
            color: #333;
            font-size: 12px;
            line-height: 1.5;
        }
        
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            padding: 20px 25px;
            margin-bottom: 25px;
            border-radius: 12px;
            page-break-inside: avoid;
        }
        
        .header h1 {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 6px;
        }
        
        .header .meta {
            display: flex;
            gap: 20px;
            font-size: 11px;
            opacity: 0.9;
        }
        
        .header .meta span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .block-container {
            margin-bottom: 25px;
            page-break-inside: avoid;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .block-label {
            background: #f8fafc;
            padding: 10px 16px;
            font-size: 11px;
            font-weight: 600;
            color: #64748b;
            border-bottom: 1px solid #e5e7eb;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .block-content {
            padding: 0;
            background: white;
        }
        
        /* Override de estilos del HTML generado para mejor visualización en PDF */
        .block-content img {
            max-width: 100%;
            height: auto;
            display: block;
        }
        
        .block-content table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .block-content td {
            vertical-align: top;
            padding: 15px;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #94a3b8;
            font-size: 10px;
            page-break-inside: avoid;
        }
        
        .footer .brand {
            font-weight: 600;
            color: #64748b;
        }
        
        /* Estilos para la visualización HTML dentro del PDF */
        .block-content h2, .block-content h3 {
            color: #1e293b;
            margin-bottom: 10px;
        }
        
        .block-content p {
            color: #475569;
            margin-bottom: 8px;
        }
        
        /* Print-specific styles */
        @media print {
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .header {
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%) !important;
                -webkit-print-color-adjust: exact !important;
            }
            
            .block-container {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${name}</h1>
        <div class="meta">
            <span>📦 SKU: ${sku}</span>
            <span>📑 ${blocks.length} bloques</span>
            <span>📅 ${new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
    </div>
    
    ${blocksHtml}
    
    <div class="footer">
        <p class="brand">Canon Chile - InPage Content</p>
        <p>Generado con InPage Maker App • ${new Date().toLocaleString('es-CL')}</p>
    </div>
</body>
</html>
    `.trim();
}

/**
 * Obtener nombre legible del módulo
 */
function getModuleName(moduleId) {
    const names = {
        'header_banner': 'Banner Principal',
        'two_column_left': 'Texto + Imagen',
        'two_column_right': 'Imagen + Texto',
        'three_column': 'Tres Columnas',
        'feature_icons': 'Íconos de Características',
        'video_banner': 'Video Banner',
        'image_strip': 'Galería de Imágenes',
        'specs_table': 'Tabla de Especificaciones',
        'lifestyle_banner': 'Banner Lifestyle',
        'cta_banner': 'Call to Action'
    };
    return names[moduleId] || moduleId;
}
