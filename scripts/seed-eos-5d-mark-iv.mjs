/**
 * Seed Script: EOS 5D Mark IV Product Blocks
 * 
 * Creates the EOS 5D Mark IV product in Supabase with all blocks
 * Data extracted from Canon Europe website
 * 
 * Run: node scripts/seed-eos-5d-mark-iv.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzczOTcsImV4cCI6MjA4NTMxMzM5N30.EKM3ZiTCiO3tUfbfeDs2Tc91ditpkbxQSsWOAF8baS0';

const supabase = createClient(supabaseUrl, supabaseKey);

// EOS 5D Mark IV data extracted from Canon Europe
const EOS_5D_MARK_IV_DATA = {
    name: "EOS 5D MARK IV",
    category: "cameras",
    subcategory: "EOS",
    description: "La cámara réflex digital full-frame de grado profesional EOS 5D Mark IV ofrece una calidad de imagen y rendimiento sin compromisos para capturar momentos extraordinarios en cualquier situación.",
    tagline: "Sin Compromiso en Ninguna Situación",
    headline: "Calidad de Imagen Profesional",
    image: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-beauty_1bd06bcadaee4833af6460c87898d249?$70-30-header-4by3-dt-jpg$"
};

// Complete Canon Europe images
const COMPLETE_IMAGES = {
    angles: [
        { src: "https://cdn.media.amplience.net/i/canon/eos-5d-mark-iv-frt-w-ef-50mm_b288dcb709074c41b73639ce141b7c5d?$prod-gallery-1by1-jpg$", alt: "EOS 5D Mark IV Front with EF 50mm" },
        { src: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-top-w-ef-24-70mm_810a57fdee3e4cc48aff7b5cc1f34b1b?$prod-gallery-1by1-jpg$", alt: "EOS 5D Mark IV Top with EF 24-70mm" },
        { src: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-side-left_a8be5a8bcdba44c795efeaeb9adcc481?$prod-gallery-1by1-jpg$", alt: "EOS 5D Mark IV Side Left" },
        { src: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-side-right_e530e1006fcc4b58b7b63b7df825e1ed?$prod-gallery-1by1-jpg$", alt: "EOS 5D Mark IV Side Right" }
    ],
    lifestyle: [
        { src: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-beauty_1bd06bcadaee4833af6460c87898d249?$70-30-header-4by3-dt-jpg$", alt: "EOS 5D Mark IV Hero" },
        { src: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-side-right-02-beauty_805f768e84114b05902f3ef59575b68f?$hero-header-full-16by9-dt-jpg$", alt: "EOS 5D Mark IV Beauty Shot" }
    ]
};

// Blocks for EOS 5D Mark IV
const EOS_5D_MARK_IV_BLOCKS = [
    // 1. Hero Header
    {
        block_type: 'hero_header',
        block_order: 0,
        block_data: {
            name: "EOS 5D MARK IV",
            tagline: "Sin Compromiso en Ninguna Situación",
            category: "EOS Full-Frame",
            description: "La cámara réflex digital full-frame de grado profesional EOS 5D Mark IV ofrece una calidad de imagen y rendimiento sin compromisos. Equipada con un sensor CMOS de 30.4 megapíxeles, procesador DIGIC 6+, y un sistema de enfoque de 61 puntos, es la herramienta definitiva para fotógrafos y videógrafos profesionales.",
            images: COMPLETE_IMAGES,
            keyFeatures: [
                { title: "30.4 MP", subtitle: "Full-Frame CMOS" },
                { title: "61 Puntos", subtitle: "Sistema AF" },
                { title: "4K Video", subtitle: "EOS Movie" },
                { title: "7 fps", subtitle: "Disparo Continuo" }
            ],
            externalLinks: {
                officialPage: "https://www.canon-europe.com/cameras/eos-5d-mark-iv/",
                support: "https://www.canon-europe.com/support/consumer_products/products/cameras/digital_slr/eos_5d_mark_iv.html"
            }
        }
    },

    // 2. Hero Section - Intro
    {
        block_type: 'hero_section',
        block_order: 1,
        block_data: {
            title: "EOS 5D",
            subtitle: "La Leyenda Continúa",
            description: "La serie EOS 5D ha sido durante décadas la elección de fotógrafos profesionales en todo el mundo. El Mark IV eleva el estándar con tecnología de vanguardia que satisface las demandas más exigentes de fotografía y video.",
            gradient: "red"
        }
    },

    // 3. Feature Grid - Image Quality
    {
        block_type: 'feature_grid',
        block_order: 2,
        block_data: {
            columns: 3,
            features: [
                {
                    title: "Sensor Full-Frame 30.4MP",
                    description: "El sensor CMOS full-frame de 30.4 megapíxeles captura imágenes con un rango dinámico excepcional y detalle extraordinario, incluso en condiciones de luz desafiantes.",
                    icon: "sensor",
                    image: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-beauty_1bd06bcadaee4833af6460c87898d249?$70-30-header-4by3-dt-jpg$"
                },
                {
                    title: "Procesador DIGIC 6+",
                    description: "El avanzado procesador DIGIC 6+ permite un procesamiento de imagen más rápido, mejor reducción de ruido y colores más precisos en cada disparo.",
                    icon: "speed",
                    image: "https://cdn.media.amplience.net/i/canon/eos-5d-mark-iv-frt-w-ef-50mm_b288dcb709074c41b73639ce141b7c5d?$prod-gallery-1by1-jpg$"
                },
                {
                    title: "ISO 100-32000",
                    description: "Rango ISO nativo de 100-32000, expandible a 50-102400, para capturar imágenes brillantes en casi cualquier condición de iluminación.",
                    icon: "moon",
                    image: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-top-w-ef-24-70mm_810a57fdee3e4cc48aff7b5cc1f34b1b?$prod-gallery-1by1-jpg$"
                }
            ]
        }
    },

    // 4. Feature Grid - Autofocus & Speed
    {
        block_type: 'feature_grid',
        block_order: 3,
        block_data: {
            columns: 2,
            features: [
                {
                    title: "Sistema AF de 61 Puntos",
                    description: "El avanzado sistema de enfoque automático de 61 puntos incluye 41 puntos tipo cruz y 5 puntos centrales de doble cruz para un seguimiento preciso de sujetos en movimiento.",
                    icon: "target",
                    image: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-side-right_e530e1006fcc4b58b7b63b7df825e1ed?$prod-gallery-1by1-jpg$"
                },
                {
                    title: "Dual Pixel CMOS AF",
                    description: "Enfoque automático suave y preciso durante la grabación de video y Live View, con cobertura del 80% del área de imagen para un seguimiento confiable.",
                    icon: "focus",
                    image: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-side-left_a8be5a8bcdba44c795efeaeb9adcc481?$prod-gallery-1by1-jpg$"
                },
                {
                    title: "7 fps Continuo",
                    description: "Captura hasta 7 cuadros por segundo con seguimiento AF/AE completo, perfecto para fotografía de acción y deportes.",
                    icon: "speed"
                },
                {
                    title: "Obturador de 150,000 ciclos",
                    description: "Unidad de obturador de alta durabilidad probada para 150,000 ciclos, construida para uso profesional intensivo.",
                    icon: "settings"
                }
            ]
        }
    },

    // 5. Image Banner
    {
        block_type: 'image_banner',
        block_order: 4,
        block_data: {
            image: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-side-right-02-beauty_805f768e84114b05902f3ef59575b68f?$hero-header-full-16by9-dt-jpg$",
            alt: "EOS 5D Mark IV Beauty Shot",
            height: "large",
            overlay: true
        }
    },

    // 6. Feature Grid - Video
    {
        block_type: 'feature_grid',
        block_order: 5,
        block_data: {
            columns: 3,
            features: [
                {
                    title: "Video 4K DCI",
                    description: "Graba video 4K DCI (4096 x 2160) a 30p con calidad cinematográfica utilizando el formato Motion JPEG.",
                    icon: "video"
                },
                {
                    title: "Full HD 60p",
                    description: "Captura video Full HD fluido a 60fps para cámara lenta suave o acción de alta velocidad.",
                    icon: "slowmo"
                },
                {
                    title: "HD 120p Slow Motion",
                    description: "Modo de cámara lenta HD a 120fps para efectos dramáticos de slow motion 4x en postproducción.",
                    icon: "video"
                }
            ]
        }
    },

    // 7. Specifications
    {
        block_type: 'specifications',
        block_order: 6,
        block_data: {
            title: "Especificaciones Técnicas",
            categories: [
                {
                    name: "Sensor y Procesador",
                    specs: [
                        { key: "Tipo de Sensor", value: "CMOS Full-Frame" },
                        { key: "Tamaño del Sensor", value: "36 x 24 mm" },
                        { key: "Megapíxeles Efectivos", value: "30.4 MP" },
                        { key: "Procesador", value: "DIGIC 6+" },
                        { key: "Formato de Imagen", value: "JPEG, RAW (14-bit)" }
                    ]
                },
                {
                    name: "Enfoque",
                    specs: [
                        { key: "Puntos AF", value: "61 puntos (41 tipo cruz)" },
                        { key: "AF con poca luz", value: "-3 EV (punto central)" },
                        { key: "Dual Pixel CMOS AF", value: "Sí, 80% cobertura horizontal" },
                        { key: "Modos AF", value: "One-Shot, AI Servo, AI Focus" }
                    ]
                },
                {
                    name: "Rendimiento",
                    specs: [
                        { key: "Rango ISO", value: "100-32000 (exp. 50-102400)" },
                        { key: "Velocidad de Obturación", value: "1/8000 - 30 seg, Bulb" },
                        { key: "Disparo Continuo", value: "7 fps" },
                        { key: "Durabilidad Obturador", value: "150,000 ciclos" }
                    ]
                },
                {
                    name: "Video",
                    specs: [
                        { key: "4K", value: "4096 x 2160 @ 30p (Motion JPEG)" },
                        { key: "Full HD", value: "1920 x 1080 @ 60p/30p/24p" },
                        { key: "HD Slow Motion", value: "1280 x 720 @ 120p" },
                        { key: "Formato", value: "MOV, MP4" }
                    ]
                },
                {
                    name: "Conectividad",
                    specs: [
                        { key: "Wi-Fi", value: "Integrado (802.11 b/g/n)" },
                        { key: "NFC", value: "Sí" },
                        { key: "GPS", value: "Integrado con brújula" },
                        { key: "USB", value: "USB 3.0" },
                        { key: "HDMI", value: "Mini HDMI (Tipo C)" }
                    ]
                },
                {
                    name: "Construcción",
                    specs: [
                        { key: "Material", value: "Aleación de Magnesio" },
                        { key: "Sellado", value: "Resistente al polvo y humedad" },
                        { key: "Visor", value: "Pentaprisma, 100% cobertura" },
                        { key: "Pantalla", value: "3.2\" LCD táctil, 1.62M puntos" },
                        { key: "Dimensiones", value: "150.7 x 116.4 x 75.9 mm" },
                        { key: "Peso", value: "Aprox. 890g (solo cuerpo)" }
                    ]
                }
            ]
        }
    },

    // 8. CTA Buttons
    {
        block_type: 'cta_buttons',
        block_order: 7,
        block_data: {
            title: "Opciones de Compra",
            buttons: [
                {
                    label: "Ver en Canon Europa",
                    url: "https://www.canon-europe.com/cameras/eos-5d-mark-iv/",
                    style: "primary"
                },
                {
                    label: "Descargar Especificaciones",
                    url: "https://www.canon-europe.com/cameras/eos-5d-mark-iv/specifications/",
                    style: "secondary"
                }
            ]
        }
    }
];

async function seedEOS5DMark4() {
    console.log('🚀 Starting EOS 5D Mark IV seed...\n');

    try {
        // 1. Check if product exists
        console.log('📋 Checking for existing product...');
        const { data: existingProducts, error: searchError } = await supabase
            .from('brochure_products')
            .select('id, name')
            .ilike('name', '%5d mark iv%');

        if (searchError) throw searchError;

        let productId;

        if (existingProducts && existingProducts.length > 0) {
            productId = existingProducts[0].id;
            console.log(`✅ Found existing product: ${existingProducts[0].name} (${productId})`);

            // Update the name to be consistent
            await supabase
                .from('brochure_products')
                .update({ name: EOS_5D_MARK_IV_DATA.name })
                .eq('id', productId);
        } else {
            // Create new product
            console.log('📝 Creating new product entry...');
            const { data: newProduct, error: createError } = await supabase
                .from('brochure_products')
                .insert({
                    name: EOS_5D_MARK_IV_DATA.name,
                    category: EOS_5D_MARK_IV_DATA.category,
                    description: EOS_5D_MARK_IV_DATA.description,
                    image: EOS_5D_MARK_IV_DATA.image
                })
                .select()
                .single();

            if (createError) throw createError;
            productId = newProduct.id;
            console.log(`✅ Created product with ID: ${productId}`);
        }

        // 2. Delete existing blocks
        console.log('\n🗑️  Cleaning up existing blocks...');
        const { error: deleteError } = await supabase
            .from('brochure_product_blocks')
            .delete()
            .eq('product_id', productId);

        if (deleteError) throw deleteError;
        console.log('✅ Existing blocks removed');

        // 3. Insert new blocks
        console.log('\n📦 Inserting blocks...');
        const blocksToInsert = EOS_5D_MARK_IV_BLOCKS.map(block => ({
            product_id: productId,
            ...block
        }));

        const { data: insertedBlocks, error: insertError } = await supabase
            .from('brochure_product_blocks')
            .insert(blocksToInsert)
            .select();

        if (insertError) throw insertError;

        console.log(`✅ Inserted ${insertedBlocks.length} blocks:`);
        insertedBlocks.forEach((block, i) => {
            console.log(`   ${i + 1}. ${block.block_type} (order: ${block.block_order})`);
        });

        // 4. Verify
        console.log('\n🔍 Verifying product load...');
        const { data: verifyProduct } = await supabase
            .from('brochure_products')
            .select('*')
            .eq('id', productId)
            .single();

        const { data: verifyBlocks } = await supabase
            .from('brochure_product_blocks')
            .select('*')
            .eq('product_id', productId)
            .order('block_order');

        console.log(`✅ Product "${verifyProduct.name}" loaded with ${verifyBlocks.length} blocks`);

        console.log('\n🎉 Seed completed successfully!');
        console.log(`\n📍 View the product at: http://localhost:5175/product/eos-5d-mark-iv`);

    } catch (error) {
        console.error('\n❌ Seed failed:', error.message);
        process.exit(1);
    }
}

seedEOS5DMark4();
