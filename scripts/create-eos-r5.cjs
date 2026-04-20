/**
 * Script para crear el producto EOS R5 con bloques editables en Supabase
 * Datos scrapeados de Canon Asia
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://bupnqihroawrvcvzpbqv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo'
);

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    red: '\x1b[31m'
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

// ID del producto EOS R5 existente en brochure_products
// Usamos el EOS R5 BODY como producto base del modelo
const EOS_R5_ID = 'c91482d6-e787-4463-a584-d167803ee3e9';

// Datos del producto EOS R5
const productData = {
    name: 'EOS R5',
    category: 'cameras',
    tagline: 'Born to Rule',
    headline: 'Make way for the new king. The EOS R5 is here with groundbreaking 8K resolution video recording.',
    description: 'The EOS R5 is here with groundbreaking 8K resolution video recording, included for the first time ever in a Canon camera. With all-new Animal Detection AF and powerful In-Body Image Stabilization that goes up to 8 stops for edge-to-edge high quality images and video made possible by the RF mount, experience the best of Canon\'s full-frame mirrorless series with this flagship model.',
    
    // Imágenes del producto - La primera DEBE ser con lente
    images: {
        angles: [
            { src: 'https://asia.canon/media/image/2020/07/07/1ca31541100945f89f12def69b85aeda_R5_FrontSlantLeft_RF24-105mmF4LISUSM.png', alt: 'EOS R5 con RF24-105mm - Vista frontal' },
            { src: 'https://asia.canon/media/image/2020/07/07/b1f066612d914ae09920b409c3a162d1_R5_Front_RF24-105mmF4LISUSM.png', alt: 'EOS R5 con RF24-105mm - Frontal' },
            { src: 'https://asia.canon/media/image/2020/07/07/1d2de86b8efd4de6b7ce5acaa14f7be1_R5_Left_RF24-105mmF4LISUSM.png', alt: 'EOS R5 con RF24-105mm - Vista lateral' },
            { src: 'https://asia.canon/media/image/2020/07/04/862a1f43feed4fab85897aee45b6324c_R5_Front_BODY.png', alt: 'EOS R5 Body - Frontal' },
            { src: 'https://asia.canon/media/image/2020/07/07/e109d33424084a40a4cede4d8444dc7b_R5_Back_BODY.png', alt: 'EOS R5 Body - Trasera' },
            { src: 'https://asia.canon/media/image/2020/07/04/4317bcd14f784a258f3908212608d6da_R5_Top_BODY.png', alt: 'EOS R5 Body - Superior' },
            { src: 'https://asia.canon/media/image/2020/07/07/83d56f5ec21d4e22a7194fad62a86c1c_R5_FrontSlantLeft_BODY_Cardslot.png', alt: 'EOS R5 - Slot de tarjetas' },
            { src: 'https://asia.canon/media/image/2020/07/07/73c1ee8f4b1d430db2669d0fdce64d66_R5_FrontSlantLeft_BODYCableprotector.png', alt: 'EOS R5 - Protector de cables' }
        ]
    },
    
    keyFeatures: [
        { icon: 'sensor', text: 'Sensor CMOS Full-Frame de 45MP' },
        { icon: 'stabilization', text: 'Estabilización IBIS hasta 8 pasos' },
        { icon: 'speed', text: 'Disparo continuo hasta 20 FPS' },
        { icon: 'video', text: 'Video 8K DCI + 4K 120fps' }
    ]
};

// Bloques del producto
const blocks = [
    // 1. HERO HEADER
    {
        block_type: 'hero_header',
        block_order: 0,
        block_data: {
            name: productData.name,
            category: 'EOS R System',
            tagline: productData.tagline,
            colors: ['black'],
            images: productData.images,
            keyFeatures: productData.keyFeatures
        }
    },
    
    // 2. HERO SECTION - Introducción
    {
        block_type: 'hero_section',
        block_order: 1,
        block_data: {
            title: 'Born to Rule',
            subtitle: 'La Nueva Referencia Full-Frame',
            description: productData.description,
            backgroundType: 'gradient',
            backgroundValue: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        }
    },
    
    // 3. IMAGE TEXT - Alto Rendimiento y Velocidad
    {
        block_type: 'image_text',
        block_order: 2,
        block_data: {
            title: 'Alto Rendimiento y Velocidad',
            subtitle: 'Captura cada momento decisivo',
            description: 'Captura momentos deseados e inesperados con la capacidad de disparo en ráfaga ultra rápido y casi silencioso de hasta 20 fps. El seguimiento AF/AE garantiza que tus fotos estén nítidas y enfocadas. El obturador silencioso será especialmente útil en bodas, eventos deportivos y fotografía de vida silvestre.',
            layout: 'image-left',
            images: [
                { src: 'https://asia.canon/media/image/2020/07/04/76ff365354bf4774a289e505afa94486_gallery-1.jpg', alt: 'Disparo de alta velocidad EOS R5' }
            ]
        }
    },
    
    // 4. FEATURE GRID - Sensor y Procesador
    {
        block_type: 'feature_grid',
        block_order: 3,
        block_data: {
            title: 'Sensor CMOS de 45MP y DIGIC X',
            subtitle: 'Potencia de procesamiento sin precedentes',
            columns: 2,
            features: [
                {
                    icon: 'sensor',
                    title: 'Sensor Full-Frame 45MP',
                    description: 'Equipado con un sensor CMOS full-frame de aproximadamente 45 megapíxeles compatible con todos los lentes RF, la EOS R5 hará maravillas con tu fotografía con imágenes de alta calidad.'
                },
                {
                    icon: 'cpu',
                    title: 'Procesador DIGIC X',
                    description: 'Impulsada por el último procesador de imagen DIGIC X, la EOS R5 puede procesar rápidamente grandes cantidades de datos para manejar disparos de alta velocidad, video 8K y otros logros destacados.'
                },
                {
                    icon: 'hdr',
                    title: 'HDR PQ HEIF 10-Bit',
                    description: 'Obtén imágenes con más detalle de color y tono que el JPEG convencional, sin necesidad de postprocesamiento. Los archivos HEIF pueden verse en pantallas compatibles e imprimirse en impresoras HDR.'
                },
                {
                    icon: 'iso',
                    title: 'Rango ISO Nativo',
                    description: 'ISO nativo de 100 a 51200, expandible a ISO 50 - 102,400 para un rendimiento excepcional en condiciones de poca luz.'
                }
            ]
        }
    },
    
    // 5. IMAGE TEXT - Autofocus
    {
        block_type: 'image_text',
        block_order: 4,
        block_data: {
            title: 'Autofocus Rápido y Preciso',
            subtitle: 'Dual Pixel CMOS AF II',
            description: 'El rendimiento del autofocus se ha mejorado con el nuevo Dual Pixel CMOS AF II que enfoca rápida y precisamente. La cobertura AF se ha expandido a aproximadamente 100% × 100% del área de la imagen. Con hasta 5,940 posiciones AF seleccionables manualmente y hasta 1,053 segmentos de marco AF en los modos de selección automática, esto significa mayor flexibilidad en la composición de la imagen.',
            layout: 'image-right',
            images: [
                { src: 'https://asia.canon/media/image/2020/07/03/e6279d69c3ed407daa12c18e0711df62_animalAF-body.jpg', alt: 'Animal Detection AF' }
            ]
        }
    },
    
    // 6. ICON LIST - Detección de Sujetos
    {
        block_type: 'icon_list',
        block_order: 5,
        block_data: {
            title: 'Detección Inteligente de Sujetos',
            subtitle: 'Seguimiento avanzado con IA',
            layout: 'grid',
            items: [
                {
                    icon: 'eye',
                    title: 'Detección de Ojos, Rostro y Cabeza',
                    description: 'Algoritmos avanzados permiten detectar y seguir el ojo, rostro o cabeza del sujeto incluso cuando está lejos o de espaldas a la cámara.'
                },
                {
                    icon: 'pet',
                    title: 'Animal Detection AF',
                    description: 'Fotografiar vida silvestre o tu mascota es ahora más fácil con la capacidad de detectar y seguir los ojos, rostros y cuerpos de gatos, perros e incluso aves.'
                },
                {
                    icon: 'lowlight',
                    title: 'Rendimiento en Baja Luz',
                    description: 'Sensibilidad AF de baja luminancia de hasta EV -6 para enfoque confiable en condiciones de iluminación extremadamente bajas.'
                }
            ]
        }
    },
    
    // 7. IMAGE TEXT - Video 8K
    {
        block_type: 'image_text',
        block_order: 6,
        block_data: {
            title: 'Grabación de Video Sin Precedentes',
            subtitle: 'Video 8K RAW por primera vez',
            description: 'Por primera vez, ahora puedes grabar videos en impresionante resolución 8K RAW/DCI sin recorte usando todo el ancho del sensor. Con 4 veces más píxeles que los videos 4K, no solo obtienes metraje más detallado y realista, también disfrutas de mayor flexibilidad creativa en paneo, zoom y recorte sin pérdida de resolución.',
            layout: 'image-left',
            images: [
                { src: 'https://asia.canon/media/image/2020/07/04/7b209da79f614ebdbb2b8f3a85bb51c3_gallery-5.jpg', alt: 'Video 8K EOS R5' }
            ]
        }
    },
    
    // 8. FEATURE GRID - Características de Video
    {
        block_type: 'feature_grid',
        block_order: 7,
        block_data: {
            title: 'Capacidades de Video Profesional',
            subtitle: 'Todo lo que necesitas para producción cinematográfica',
            columns: 3,
            features: [
                {
                    icon: '8k',
                    title: '8K Frame Grab',
                    description: 'Captura imágenes fijas de alta resolución de aproximadamente 35.4MP de un video 8K DCI grabado a 30p, equivalente a disparo continuo a 30 fps.'
                },
                {
                    icon: '4k',
                    title: '4K High Frame Rate',
                    description: 'Revive cada momento sensacional en cámara lenta con videos de alta velocidad 120p/100p en impresionante resolución 4K DCI/UHD.'
                },
                {
                    icon: 'log',
                    title: 'Canon Log',
                    description: 'Logra hasta 12 pasos de rango dinámico en tu metraje con Canon Log, originalmente un elemento clave del Cinema EOS System.'
                },
                {
                    icon: 'hdr',
                    title: 'HDR PQ Video',
                    description: 'Graba videos con brillo superior y un rango más amplio de color y gradación de contraste, logrando imágenes realistas sin necesidad de corrección de color.'
                },
                {
                    icon: 'zebra',
                    title: 'Zebra Display',
                    description: 'Mayor control sobre la exposición y los puntos destacados al grabar videos con Zebra Display, un patrón de rayas sobre áreas sobreexpuestas.'
                },
                {
                    icon: 'card',
                    title: 'CFexpress Compatible',
                    description: 'Compatible con tarjetas CFexpress Tipo B para grabación 8K de alta velocidad y transferencia de datos ultrarrápida.'
                }
            ]
        }
    },
    
    // 9. IMAGE TEXT - Estabilización
    {
        block_type: 'image_text',
        block_order: 8,
        block_data: {
            title: 'Estabilización de Imagen Potente',
            subtitle: 'IBIS + OIS coordinados',
            description: 'Un nuevo estabilizador de imagen en el cuerpo (IBIS) de 5 ejes en la EOS R5 corrige el desenfoque de imagen causado por el movimiento de la cámara, permitiendo capturas más nítidas a pulso, incluso con velocidades de obturación más lentas. Esto funciona en conjunto con el estabilizador óptico de imagen del lente, ofreciendo estabilidad equivalente a disparar con una velocidad de obturación hasta 8 pasos más rápida.',
            layout: 'image-right',
            images: [
                { src: 'https://asia.canon/media/image/2020/07/03/4b01a4e39ad3405788bcdeb2ad307d95_IS-handheld.jpg', alt: 'Estabilización IBIS EOS R5' }
            ]
        }
    },
    
    // 10. ICON LIST - Estabilización Detallada
    {
        block_type: 'icon_list',
        block_order: 9,
        block_data: {
            title: 'Posibilidades de Estabilización',
            subtitle: 'Nuevas oportunidades fotográficas',
            layout: 'horizontal',
            items: [
                {
                    icon: 'handheld',
                    title: 'Fotografía a Pulso',
                    description: 'Captura imágenes nítidas sin trípode en condiciones de poca luz.'
                },
                {
                    icon: 'telephoto',
                    title: 'Super Teleobjetivo',
                    description: 'Estabilización mejorada para lentes de largo alcance.'
                },
                {
                    icon: 'longexposure',
                    title: 'Larga Exposición',
                    description: 'Exposiciones más largas a pulso para efectos creativos.'
                },
                {
                    icon: 'video',
                    title: 'Movie Digital IS',
                    description: 'Estabilización adicional para video suave incluso caminando.'
                }
            ]
        }
    },
    
    // 11. FEATURE GRID - Conectividad
    {
        block_type: 'feature_grid',
        block_order: 10,
        block_data: {
            title: 'Conectividad Inalámbrica',
            subtitle: 'Comparte y transfiere sin cables',
            columns: 3,
            features: [
                {
                    icon: 'cloud',
                    title: 'image.canon Cloud',
                    description: 'Sube automáticamente imágenes y archivos de video en su calidad original a la plataforma de almacenamiento en la nube image.canon para acceso fácil en cualquier momento.'
                },
                {
                    icon: 'wifi',
                    title: 'Wi-Fi 5GHz Integrado',
                    description: 'La EOS R5 está equipada con soporte integrado para Wi-Fi de 5GHz y 2.4GHz, permitiendo transferencia de datos de alta velocidad a tu PC o dispositivo móvil.'
                },
                {
                    icon: 'bluetooth',
                    title: 'Bluetooth',
                    description: 'La tecnología Bluetooth Low Energy permite una conexión constante de bajo consumo entre la cámara y un dispositivo móvil compatible para geoetiquetado y control remoto.'
                }
            ]
        }
    },
    
    // 12. IMAGE TEXT - Diseño
    {
        block_type: 'image_text',
        block_order: 11,
        block_data: {
            title: 'Diseño y Operabilidad Mejorados',
            subtitle: 'Construido para profesionales',
            description: 'Un robusto cuerpo de aleación de magnesio asegura dureza y durabilidad mientras permanece relativamente ligero, mientras que los sellados contra el clima en áreas críticas ayudan a prevenir que el polvo y la humedad penetren el cuerpo. El nuevo mecanismo de obturador tiene una resistencia excepcional de aproximadamente 500,000 ciclos.',
            layout: 'image-left',
            images: [
                { src: 'https://asia.canon/media/image/2020/07/04/0d93605c8d584771be415578f0bf1d88_magnesiumbody.jpg', alt: 'Cuerpo de magnesio EOS R5' }
            ]
        }
    },
    
    // 13. ICON LIST - Características de Diseño
    {
        block_type: 'icon_list',
        block_order: 12,
        block_data: {
            title: 'Características Profesionales',
            subtitle: 'Detalles que marcan la diferencia',
            layout: 'grid',
            items: [
                {
                    icon: 'cards',
                    title: 'Doble Ranura de Tarjetas',
                    description: 'Duplica tu capacidad de memoria con ranuras dobles para una tarjeta SD (UHS-II) y una CFexpress (Tipo B, hasta 2TB).'
                },
                {
                    icon: 'battery',
                    title: 'Batería de Alta Capacidad',
                    description: 'La nueva batería LP-E6NH de alta capacidad cuenta con 2130mAh aumentados para disparar más y hacer más.'
                },
                {
                    icon: 'evf',
                    title: 'EVF de Alta Precisión',
                    description: 'Visor electrónico de alta resolución de aproximadamente 5.76 millones de puntos con tasa de actualización de 119.88 fps.'
                },
                {
                    icon: 'dials',
                    title: 'Ergonomía Mejorada',
                    description: 'Hereda los 3 diales de la serie EOS 5D para operación rápida y conveniente, más multicontrolador con 3 niveles de sensibilidad.'
                }
            ]
        }
    },
    
    // 14. IMAGE GALLERY - Shot on EOS R5
    {
        block_type: 'image_gallery',
        block_order: 13,
        block_data: {
            title: 'Shot On EOS R5',
            subtitle: 'Galería de imágenes capturadas',
            layout: 'masonry',
            images: [
                { 
                    src: 'https://asia.canon/media/image/2020/07/04/76ff365354bf4774a289e505afa94486_gallery-1.jpg', 
                    alt: 'Foto tomada con EOS R5',
                    caption: 'RF70-200mm F2.8 L IS USM | f/3.2 | 1/400s | ISO 200'
                },
                { 
                    src: 'https://asia.canon/media/image/2020/07/06/9369e6c7956342dbba0e16e13e6448e5_gallery-8.jpg', 
                    alt: 'Foto tomada con EOS R5',
                    caption: 'RF100-500mm F4.5-7.1 L IS USM | f/7.1 | 1/3200s | ISO 1600'
                },
                { 
                    src: 'https://asia.canon/media/image/2020/07/04/7b209da79f614ebdbb2b8f3a85bb51c3_gallery-5.jpg', 
                    alt: 'Foto tomada con EOS R5',
                    caption: 'RF24-105mm F4 L IS USM | f/5.6 | 1/640s | ISO 100'
                },
                { 
                    src: 'https://asia.canon/media/image/2020/07/04/c27260644a3442c68b67b525f4fd80b3_gallery-7.jpg', 
                    alt: 'Foto tomada con EOS R5',
                    caption: 'RF15-35mm F2.8 L IS USM | f/2.8 | 3.2s | ISO 100'
                }
            ]
        }
    },
    
    // 15. CTA BUTTONS - Acciones finales
    {
        block_type: 'cta_buttons',
        block_order: 14,
        block_data: {
            title: '¿Listo para dominar?',
            subtitle: 'Descubre la EOS R5',
            buttons: [
                {
                    text: 'Ver en Canon Chile',
                    url: 'https://store.canon.cl/camaras/eos-r-system/camara-eos-r5-body',
                    style: 'primary'
                },
                {
                    text: 'Especificaciones Completas',
                    url: 'https://asia.canon/en/consumer/eos-r5/specifications',
                    style: 'secondary'
                }
            ]
        }
    }
];

async function main() {
    log.title('🎯 Creando EOS R5 con Bloques Editables');
    
    try {
        // 1. Verificar si el producto existe
        log.info('Verificando producto EOS R5...');
        const { data: existingProduct, error: productError } = await supabase
            .from('brochure_products')
            .select('id, name')
            .eq('id', EOS_R5_ID)
            .single();
        
        if (productError || !existingProduct) {
            log.error(`Producto EOS R5 no encontrado con ID: ${EOS_R5_ID}`);
            log.info('Creando producto en brochure_products...');
            
            // Crear el producto
            const { data: newProduct, error: createError } = await supabase
                .from('brochure_products')
                .insert({
                    id: EOS_R5_ID,
                    name: productData.name,
                    slug: 'eos-r5',
                    category: productData.category,
                    description: productData.description,
                    tagline: productData.tagline,
                    headline: productData.headline
                })
                .select()
                .single();
            
            if (createError) {
                throw new Error(`Error creando producto: ${createError.message}`);
            }
            log.success('Producto creado correctamente');
        } else {
            log.success(`Producto encontrado: ${existingProduct.name}`);
            
            // Actualizar datos del producto
            await supabase
                .from('brochure_products')
                .update({
                    description: productData.description,
                    tagline: productData.tagline,
                    headline: productData.headline,
                    updated_at: new Date().toISOString()
                })
                .eq('id', EOS_R5_ID);
            log.success('Datos del producto actualizados');
        }
        
        // 2. Eliminar bloques existentes
        log.info('Eliminando bloques existentes...');
        const { error: deleteError } = await supabase
            .from('brochure_product_blocks')
            .delete()
            .eq('product_id', EOS_R5_ID);
        
        if (deleteError) {
            log.warn(`Error eliminando bloques: ${deleteError.message}`);
        } else {
            log.success('Bloques anteriores eliminados');
        }
        
        // 3. Insertar nuevos bloques
        log.info(`Insertando ${blocks.length} bloques nuevos...`);
        
        const blocksToInsert = blocks.map(block => ({
            product_id: EOS_R5_ID,
            block_type: block.block_type,
            block_order: block.block_order,
            block_data: block.block_data
        }));
        
        const { data: insertedBlocks, error: insertError } = await supabase
            .from('brochure_product_blocks')
            .insert(blocksToInsert)
            .select();
        
        if (insertError) {
            throw new Error(`Error insertando bloques: ${insertError.message}`);
        }
        
        log.success(`${insertedBlocks.length} bloques insertados correctamente`);
        
        // 4. Mostrar resumen
        console.log('\n📊 Resumen de bloques creados:');
        blocks.forEach((block, i) => {
            console.log(`   ${i + 1}. ${block.block_type}: ${block.block_data.title || block.block_data.name || '-'}`);
        });
        
        console.log(`\n${colors.green}${colors.bright}✅ EOS R5 creado exitosamente!${colors.reset}`);
        console.log(`   URL: http://localhost:5173/product/${EOS_R5_ID}`);
        
    } catch (error) {
        log.error(`Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
}

main();
