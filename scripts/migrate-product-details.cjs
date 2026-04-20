/**
 * Script de Migración - Product Details a Bloques Editables
 * 
 * Este script migra los datos de productos detallados desde los archivos JS locales
 * (src/data/products/*.js) al nuevo sistema de bloques editables en Supabase.
 * 
 * Uso: node scripts/migrate-product-details.js
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Supabase client
const supabase = createClient(
    'https://bupnqihroawrvcvzpbqv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo'
);

// Mapeo de productos locales a UUIDs de Supabase (producto base por modelo)
const PRODUCT_MAPPING = {
    'eos-r50': '1abb1bd5-9915-4ee5-bc02-1f3f3a45bde6',    // EOS R50 RF-S 18-45MM (base)
    'eos-r10': '52dbc0d5-3eef-4619-9685-4ec11381c54e',    // EOS R10 BODY
    'eos-rp': '3a9b2136-8cfa-4f83-8325-15d19bcd5314',     // EOS RP BODY
    'eos-r8': 'f1111f81-e16a-402d-9e0e-ea7414d4fa57',     // EOS R8 BODY
    'eos-r100': 'c4938aba-53e9-43c8-bb69-56de3dd913bc',   // EOS R100 RF-S 18-45MM
    'eos-r5': 'c91482d6-e787-4463-a584-d167803ee3e9',     // EOS R5 BODY
    'eos-r6-mark-ii': '271319c8-452f-47bb-af7d-8a5c898afa22', // EOS R6 MARK II BODY
    'eos-r6-mark-iii': '5c220ca2-88e1-4f98-a94f-a861ac0b08d7', // EOS R6 MARK III BODY
    'eos-r7': 'a58e689c-3c83-4ad9-b56b-9cb501c4b8c7',     // EOS R7 BODY
    'eos-rebel-t100': 'c8d56b14-d58a-4436-b74c-03fdee145f6a', // EOS REBEL T100
};

/**
 * Convierte los datos de producto antiguo a bloques editables
 */
function convertToBlocks(productData) {
    const blocks = [];
    let order = 0;

    // 1. HERO HEADER - Siempre primero
    blocks.push({
        type: 'hero_header',
        order: order++,
        data: {
            name: productData.name || 'Producto',
            category: productData.subcategory || productData.category || 'EOS',
            tagline: productData.tagline || '',
            colors: detectColors(productData.images),
            images: {
                angles: normalizeImages(productData.images?.angles),
                white: normalizeImages(productData.images?.white)
            },
            keyFeatures: normalizeKeyFeatures(productData.keyFeatures)
        }
    });

    // 2. Procesar secciones del producto
    if (productData.sections && productData.sections.length > 0) {
        for (const section of productData.sections) {
            const block = convertSection(section, order);
            if (block) {
                blocks.push(block);
                order++;
            }
        }
    }

    // 3. SPECIFICATIONS - Si hay especificaciones
    if (productData.specifications && Object.keys(productData.specifications).length > 0) {
        blocks.push({
            type: 'specifications',
            order: order++,
            data: {
                title: 'Especificaciones Técnicas',
                groups: convertSpecifications(productData.specifications)
            }
        });
    }

    // 4. CTA BUTTONS - Al final si hay links
    if (productData.variants || productData.externalLinks) {
        blocks.push({
            type: 'cta_buttons',
            order: order++,
            data: {
                title: 'Opciones de Compra',
                buttons: generateCTAButtons(productData)
            }
        });
    }

    return blocks;
}

/**
 * Detecta colores disponibles basándose en las imágenes
 */
function detectColors(images) {
    const colors = ['Negra'];
    if (images?.white && images.white.length > 0) {
        colors.push('Blanca');
    }
    return colors;
}

/**
 * Normaliza array de imágenes al formato esperado
 */
function normalizeImages(images) {
    if (!images) return [];
    
    return images.map((img, i) => {
        if (typeof img === 'string') {
            return { src: img, alt: `Vista ${i + 1}` };
        }
        return {
            src: img.src || img,
            alt: img.alt || img.label || `Vista ${i + 1}`
        };
    }).filter(img => img.src);
}

/**
 * Normaliza key features
 */
function normalizeKeyFeatures(features) {
    if (!features) return [];
    
    return features.map(f => {
        if (typeof f === 'string') {
            return { title: f, subtitle: '', icon: 'star' };
        }
        return {
            title: f.title || '',
            subtitle: f.subtitle || '',
            icon: f.icon || 'star'
        };
    });
}

/**
 * Convierte una sección al tipo de bloque correspondiente
 */
function convertSection(section, order) {
    switch (section.type) {
        case 'hero_section':
            return {
                type: 'hero_section',
                order,
                data: {
                    title: section.title || '',
                    subtitle: section.subtitle || '',
                    description: section.description || section.content || '',
                    image: section.image || '',
                    gradient: section.gradient || 'from-red-600 to-rose-800',
                    centerText: section.centerText ?? true,
                    layout: 'centered'
                }
            };

        case 'image_text':
            return {
                type: 'image_text',
                order,
                data: {
                    title: section.title || '',
                    description: section.description || '',
                    image: section.image || '',
                    layout: section.layout || 'image_left',
                    ctaText: section.ctaText || '',
                    ctaLink: section.ctaLink || ''
                }
            };

        case 'feature_grid':
            return {
                type: 'feature_grid',
                order,
                data: {
                    title: section.title || '',
                    columns: section.columns || 2,
                    features: (section.features || []).map(f => ({
                        title: f.title || '',
                        description: f.description || '',
                        icon: f.icon || 'star',
                        image: f.image || ''
                    }))
                }
            };

        case 'icon_list':
            return {
                type: 'icon_list',
                order,
                data: {
                    title: section.title || 'Conectividad',
                    layout: section.layout || 'horizontal',
                    items: (section.items || []).map(item => ({
                        icon: item.icon || 'check',
                        name: item.name || item.title || ''
                    }))
                }
            };

        case 'video':
            return {
                type: 'video',
                order,
                data: {
                    title: section.title || '',
                    description: section.description || '',
                    videoUrl: section.videoUrl || section.url || '',
                    thumbnail: section.thumbnail || '',
                    autoplay: false
                }
            };

        case 'gallery':
            return {
                type: 'gallery',
                order,
                data: {
                    title: section.title || 'Galería',
                    layout: section.layout || 'grid',
                    images: normalizeImages(section.images)
                }
            };

        case 'text_only':
            return {
                type: 'text_only',
                order,
                data: {
                    title: section.title || '',
                    content: section.content || section.description || '',
                    alignment: section.alignment || 'center'
                }
            };

        default:
            console.log(`  ⚠️ Tipo de sección desconocido: ${section.type}`);
            return null;
    }
}

/**
 * Convierte especificaciones al formato de grupos
 */
function convertSpecifications(specs) {
    return Object.entries(specs).map(([groupName, items]) => ({
        name: groupName,
        specs: Object.entries(items).map(([key, value]) => ({
            label: key,
            value: String(value)
        }))
    }));
}

/**
 * Genera botones CTA basándose en los datos del producto
 */
function generateCTAButtons(productData) {
    const buttons = [];

    if (productData.externalLinks?.officialPage) {
        buttons.push({
            label: 'Ver en Canon',
            url: productData.externalLinks.officialPage,
            style: 'primary'
        });
    }

    if (productData.downloads?.photoLibrary) {
        buttons.push({
            label: 'Fotos de Muestra',
            url: productData.downloads.photoLibrary,
            style: 'secondary'
        });
    }

    return buttons;
}

/**
 * Guarda los bloques en Supabase
 */
async function saveBlocks(productId, blocks) {
    // Eliminar bloques existentes
    const { error: deleteError } = await supabase
        .from('brochure_product_blocks')
        .delete()
        .eq('product_id', productId);

    if (deleteError) {
        throw new Error(`Error eliminando bloques existentes: ${deleteError.message}`);
    }

    // Insertar nuevos bloques
    const blocksToInsert = blocks.map(block => ({
        product_id: productId,
        block_type: block.type,
        block_order: block.order,
        block_data: block.data
    }));

    const { data, error: insertError } = await supabase
        .from('brochure_product_blocks')
        .insert(blocksToInsert)
        .select();

    if (insertError) {
        throw new Error(`Error insertando bloques: ${insertError.message}`);
    }

    return data;
}

/**
 * Actualiza el producto en Supabase con datos adicionales
 */
async function updateProduct(productId, productData) {
    const updateData = {
        updated_at: new Date().toISOString()
    };

    if (productData.tagline) updateData.tagline = productData.tagline;
    if (productData.description) updateData.description = productData.description;
    if (productData.headline) updateData.headline = productData.headline;

    const { error } = await supabase
        .from('brochure_products')
        .update(updateData)
        .eq('id', productId);

    if (error) {
        console.log(`  ⚠️ Error actualizando producto: ${error.message}`);
    }
}

/**
 * Función principal de migración
 */
async function migrate() {
    console.log('🚀 Iniciando migración de detalles de producto a bloques...\n');

    // Importar productos locales dinámicamente
    const productsToMigrate = [
        { file: 'eos-r50', key: 'eos-r50' },
        { file: 'eos-r10', key: 'eos-r10' },
        { file: 'eos-rp', key: 'eos-rp' },
        { file: 'eos-r8', key: 'eos-r8' },
        { file: 'eos-r100', key: 'eos-r100' },
        { file: 'eos-r5', key: 'eos-r5' },
        { file: 'eos-r6-mark-ii', key: 'eos-r6-mark-ii' },
        { file: 'eos-r6-mark-iii', key: 'eos-r6-mark-iii' },
        { file: 'eos-r7', key: 'eos-r7' },
        { file: 'eos-rebel-t100', key: 'eos-rebel-t100' },
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const { file, key } of productsToMigrate) {
        const productId = PRODUCT_MAPPING[key];
        
        if (!productId) {
            console.log(`❌ ${key}: No se encontró mapeo a Supabase UUID`);
            errorCount++;
            continue;
        }

        try {
            console.log(`📦 Procesando: ${key}`);
            
            // Cargar el archivo de producto
            const productModule = require(`../src/data/products/${file}.js`);
            const productData = productModule.default || productModule[Object.keys(productModule)[0]];

            if (!productData) {
                console.log(`  ❌ No se pudo cargar los datos del producto`);
                errorCount++;
                continue;
            }

            // Convertir a bloques
            const blocks = convertToBlocks(productData);
            console.log(`  📝 Generados ${blocks.length} bloques`);

            // Guardar en Supabase
            await saveBlocks(productId, blocks);
            console.log(`  💾 Bloques guardados`);

            // Actualizar datos del producto
            await updateProduct(productId, productData);
            console.log(`  ✅ Migración completa`);

            successCount++;

        } catch (error) {
            console.log(`  ❌ Error: ${error.message}`);
            errorCount++;
        }

        console.log('');
    }

    console.log('═'.repeat(50));
    console.log(`✅ Migrados: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log('═'.repeat(50));
}

// Ejecutar
migrate().then(() => process.exit(0)).catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
});
