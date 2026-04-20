/**
 * PLANTILLA: Script para crear InPages correctamente
 * 
 * Este script debe usarse como base para crear nuevos productos.
 * Pasos que realiza:
 * 1. Crea el producto en la tabla `products` CON image_folder
 * 2. Crea la carpeta en Storage (si no existe)
 * 3. Crea los bloques en `inpage_blocks`
 * 
 * Así el producto queda listo para editar y guardar en la web.
 */

const SUPABASE_URL = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo';
const STORAGE_BUCKET = 'inpage-images';

/**
 * Crear un InPage completo con estructura correcta
 * @param {Object} config - Configuración del producto
 */
async function createInPage(config) {
    const { product, blocks } = config;
    
    console.log('🚀 Creando InPage completo...\n');
    
    try {
        // =============================================
        // PASO 1: Crear/Actualizar el producto
        // =============================================
        console.log('📦 Paso 1: Creando producto en base de datos...');
        
        // Verificar si ya existe
        const checkResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/products?id=eq.${product.id}&select=id`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );
        const existing = await checkResponse.json();
        
        const productPayload = {
            id: product.id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            image_folder: product.id,  // ⚠️ IMPORTANTE: Siempre asignar image_folder
            is_template: false
        };
        
        if (existing.length > 0) {
            // Actualizar producto existente
            console.log('   ℹ️  Producto ya existe, actualizando...');
            await fetch(
                `${SUPABASE_URL}/rest/v1/products?id=eq.${product.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productPayload)
                }
            );
        } else {
            // Crear nuevo producto
            await fetch(
                `${SUPABASE_URL}/rest/v1/products`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(productPayload)
                }
            );
        }
        console.log('   ✅ Producto creado/actualizado');
        console.log(`   📁 image_folder: ${product.id}`);
        
        // =============================================
        // PASO 2: Crear carpeta en Storage
        // =============================================
        console.log('\n📁 Paso 2: Creando carpeta en Storage...');
        
        // Crear un archivo placeholder para asegurar que la carpeta existe
        const placeholderPath = `${product.id}/.gitkeep`;
        const placeholderResponse = await fetch(
            `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${placeholderPath}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'text/plain',
                    'x-upsert': 'true'
                },
                body: '# Placeholder for folder creation'
            }
        );
        
        if (placeholderResponse.ok) {
            console.log(`   ✅ Carpeta '${product.id}/' creada en Storage`);
        } else {
            console.log(`   ℹ️  Carpeta ya existe o creada previamente`);
        }
        
        // =============================================
        // PASO 3: Eliminar bloques existentes y crear nuevos
        // =============================================
        console.log('\n📄 Paso 3: Creando bloques del InPage...');
        
        // Eliminar bloques existentes
        await fetch(
            `${SUPABASE_URL}/rest/v1/inpage_blocks?product_id=eq.${product.id}`,
            {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );
        console.log('   🗑️  Bloques anteriores eliminados');
        
        // Crear nuevos bloques
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
                body: JSON.stringify(blocks)
            }
        );
        
        if (!blocksResponse.ok) {
            const error = await blocksResponse.text();
            throw new Error(`Error creando bloques: ${error}`);
        }
        
        const createdBlocks = await blocksResponse.json();
        console.log(`   ✅ ${createdBlocks.length} bloques creados`);
        
        // =============================================
        // RESUMEN FINAL
        // =============================================
        console.log('\n' + '═'.repeat(50));
        console.log('🎉 InPage creado exitosamente!');
        console.log('═'.repeat(50));
        console.log(`\n📦 Producto: ${product.name}`);
        console.log(`📄 SKU: ${product.sku}`);
        console.log(`📁 Carpeta: inpage-images/${product.id}/`);
        console.log(`🔢 Bloques: ${createdBlocks.length}`);
        console.log('\n✅ El producto está listo para editar en la web.');
        console.log('   El botón "Guardar" ahora aparecerá en el editor.');
        
        return { success: true, product, blocksCount: createdBlocks.length };
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

/**
 * Subir una imagen al Storage
 * @param {string} productId - ID del producto
 * @param {string} fileName - Nombre del archivo
 * @param {Buffer|Blob} fileData - Datos del archivo
 * @param {string} contentType - Tipo MIME
 */
async function uploadImage(productId, fileName, fileData, contentType = 'image/jpeg') {
    const path = `${productId}/${fileName}`;
    
    const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': contentType,
                'x-upsert': 'true'
            },
            body: fileData
        }
    );
    
    if (!response.ok) {
        throw new Error(`Error subiendo imagen: ${response.statusText}`);
    }
    
    // Retornar URL pública
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

/**
 * Obtener URL pública de una imagen
 * @param {string} path - Ruta en Storage
 */
function getImageUrl(path) {
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

// Exportar funciones para uso en otros scripts
module.exports = {
    createInPage,
    uploadImage,
    getImageUrl,
    SUPABASE_URL,
    SUPABASE_KEY,
    STORAGE_BUCKET
};

// =============================================
// EJEMPLO DE USO
// =============================================
/*
const { createInPage, getImageUrl } = require('./inpage-template.js');

// Definir producto
const product = {
    id: 'g3190',
    name: 'PIXMA G3190',
    sku: '6706C004',
    category: 'Printers'
};

// Definir bloques
const blocks = [
    {
        product_id: product.id,
        module_id: 1,
        block_order: 0,
        block_data: {
            image: 'https://s7d1.scene7.com/is/image/canon/...',
            altImage: 'Descripción de la imagen'
        }
    },
    // ... más bloques
];

// Crear InPage
createInPage({ product, blocks });
*/
