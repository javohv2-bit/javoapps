/**
 * Seed Script: PowerShot Pick Product Blocks
 * 
 * Este script crea el producto PowerShot Pick en Supabase con todos sus bloques
 * basado en el diseño actual de BrochureProductPage.jsx
 * 
 * Ejecutar con: node scripts/seed-powershot-pick.mjs
 */

import { createClient } from '@supabase/supabase-js';

// Supabase credentials from supabase.js
const supabaseUrl = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzczOTcsImV4cCI6MjA4NTMxMzM5N30.EKM3ZiTCiO3tUfbfeDs2Tc91ditpkbxQSsWOAF8baS0';

const supabase = createClient(supabaseUrl, supabaseKey);

// PowerShot Pick data from products.json
const POWERSHOT_PICK_DATA = {
    name: "POWERSHOT PICK",
    category: "cameras",
    subcategory: "PowerShot",
    description: "Una cámara de concepto totalmente nuevo, la PowerShot PICK es tu fotógrafo personal inteligente siempre listo.",
    tagline: "Tu Fotógrafo Personal Inteligente",
    headline: "¡Hola PICK!",
    image: "https://asia.canon/media/image/2021/10/20/97da55fbed294f8882c3f01df4992eff_PICK-front-black.png"
};

// Bloques para PowerShot Pick
const POWERSHOT_PICK_BLOCKS = [
    // 1. Hero Header
    {
        block_type: 'hero_header',
        block_order: 0,
        block_data: {
            name: "POWERSHOT PICK",
            tagline: "Tu Fotógrafo Personal Inteligente",
            category: "PowerShot",
            description: "Una cámara de concepto totalmente nuevo, la PowerShot PICK es tu fotógrafo personal inteligente siempre listo. Solo di un simple comando de voz y ella compondrá, disparará y recomendará la mejor toma para ti.",
            images: {
                angles: [
                    { src: "https://asia.canon/media/image/2021/10/20/97da55fbed294f8882c3f01df4992eff_PICK-front-black.png", alt: "PowerShot Pick Front Black" },
                    { src: "https://asia.canon/media/image/2021/10/20/0fa11e8b4ca9403a80412e79cb9aa877_PICK-right-black.png", alt: "PowerShot Pick Right" },
                    { src: "https://asia.canon/media/image/2021/10/20/32a1b7c377264895b8cc285510d752bb_PICK-top.png", alt: "PowerShot Pick Top" },
                    { src: "https://asia.canon/media/image/2021/10/20/06a830ceb52d49908fbe5edc34a7c33b_PICK-rear.png", alt: "PowerShot Pick Rear" }
                ],
                white: [
                    { src: "https://asia.canon/media/image/2021/10/20/6a5b9c92a400405f8e335d7b70547b96_PICK-front.png", alt: "PowerShot Pick Front White" },
                    { src: "https://asia.canon/media/image/2021/10/20/ccfb37b3a2f742e28468796c6a736145_PICK-left.png", alt: "PowerShot Pick Left White" }
                ],
                lifestyle: [
                    { src: "https://asia.canon/media/image/2021/10/20/3c769085ca41470484606735bc867dce_mainheader.jpg", alt: "PowerShot Pick Lifestyle" }
                ]
            },
            keyFeatures: [
                { title: "11.7 MP", subtitle: "Sensor CMOS" },
                { title: "Zoom 3x", subtitle: "Óptico" },
                { title: "170g", subtitle: "Ultraliviana" },
                { title: "Voz", subtitle: "Control por voz" }
            ],
            colors: ["Negra", "Blanca"],
            externalLinks: {
                officialPage: "https://asia.canon/en/consumer/powershot-pick/product",
                support: ""
            }
        }
    },

    // 2. Hero Section - Intro
    {
        block_type: 'hero_section',
        block_order: 1,
        block_data: {
            title: "PowerShot",
            subtitle: "¡Hola PICK!",
            description: "Solo siéntate, relájate y deja que PowerShot PICK haga el trabajo por ti. Con tecnología de reconocimiento facial y comandos de voz, captura momentos perfectos sin esfuerzo.",
            gradient: "red"
        }
    },

    // 3. Feature Grid - Main features
    {
        block_type: 'feature_grid',
        block_order: 2,
        block_data: {
            columns: 3,
            features: [
                {
                    title: "Control por Voz",
                    description: "Una cámara que te escucha. La PowerShot PICK puede activarse automáticamente para capturar fotos, grabar video o buscar rostros en el área basándose en simples comandos de voz.",
                    icon: "stream",
                    image: "https://asia.canon/media/image/2024/05/28/afbbe93097864afa9b97e4b1a403e59d_PowerShot+PICK+Banner+01.jpg"
                },
                {
                    title: "Conecta con PICK",
                    description: "Desbloquea más funcionalidades conectando la PowerShot PICK a tu smartphone o tablet vía Wi-Fi o Bluetooth usando la app 'Connect app for Mini PTZ Cam'.",
                    icon: "wifi",
                    image: "https://asia.canon/media/image/2021/10/20/cd2c9ab2cd244ddb9c60339467ceca91_pan-tilt.jpg"
                },
                {
                    title: "Disparo Remoto",
                    description: "La captura manual de fotos y videos es posible usando tu smartphone o tablet conectado como control remoto para mover y ajustar el ángulo de visión.",
                    icon: "vertical",
                    image: "https://asia.canon/media/image/2024/05/28/1196019eec794f5da2d2bca252ef0f98_PowerShot+PICK+Banner+02.jpg"
                },
                {
                    title: "Ultraportátil",
                    description: "Con solo aproximadamente 170g de peso, la PowerShot PICK es lo suficientemente pequeña para caber en tu bolsillo, liviana y portátil para usar en cualquier momento y lugar.",
                    icon: "weight",
                    image: "https://asia.canon/media/image/2021/10/20/6a76f38c559b414898abb59973e002eb_portable.jpg"
                },
                {
                    title: "Sensor 11.7MP",
                    description: "Sensor de imagen de 1/2.3\" con 11.7 megapíxeles efectivos y procesador DIGIC 7 para imágenes de alta calidad.",
                    icon: "sensor"
                },
                {
                    title: "Zoom Óptico 3x",
                    description: "Lente con zoom óptico 3x (equivalente a 19-57mm en 35mm) con sistema Nano USM para enfoque rápido y preciso.",
                    icon: "zoom"
                }
            ]
        }
    },

    // 4. Image Banner
    {
        block_type: 'image_banner',
        block_order: 3,
        block_data: {
            image: "https://asia.canon/media/image/2021/10/20/3c769085ca41470484606735bc867dce_mainheader.jpg",
            alt: "PowerShot Pick en acción",
            height: "large",
            overlay: true
        }
    },

    // 5. Specifications
    {
        block_type: 'specifications',
        block_order: 4,
        block_data: {
            title: "Especificaciones Técnicas",
            categories: [
                {
                    name: "Sensor y Procesador",
                    specs: [
                        { key: "Sensor", value: "1/2.3\" CMOS" },
                        { key: "Megapíxeles Efectivos", value: "11.7 MP" },
                        { key: "Procesador", value: "DIGIC 7" }
                    ]
                },
                {
                    name: "Óptica",
                    specs: [
                        { key: "Distancia Focal (eq. 35mm)", value: "19-57mm" },
                        { key: "Zoom Óptico", value: "3x" },
                        { key: "Zoom Digital", value: "4x" },
                        { key: "Sistema de Enfoque", value: "Nano USM" },
                        { key: "Distancia Mínima de Enfoque", value: "30 cm" }
                    ]
                },
                {
                    name: "Imagen",
                    specs: [
                        { key: "Modos AF", value: "Face + Tracking AF" },
                        { key: "ISO", value: "100-6400 (auto)" },
                        { key: "Velocidad de Obturación", value: "1/8000 - 1/30 seg" },
                        { key: "Resolución de Imagen", value: "4000 x 3000 (4:3)" },
                        { key: "Formato de Imagen", value: "JPEG" }
                    ]
                },
                {
                    name: "Video",
                    specs: [
                        { key: "Formato de Video", value: "MP4" },
                        { key: "Estabilización Digital", value: "Movie Digital IS" }
                    ]
                },
                {
                    name: "Conectividad",
                    specs: [
                        { key: "USB", value: "Type-C (USB 2.0)" },
                        { key: "Wireless", value: "Wi-Fi, Bluetooth" },
                        { key: "Tarjeta de Memoria", value: "microSD / microSDHC / microSDXC" }
                    ]
                },
                {
                    name: "Físico",
                    specs: [
                        { key: "Batería", value: "Litio recargable integrada" },
                        { key: "Dimensiones", value: "56.4 x 81.9 mm" },
                        { key: "Peso", value: "Aprox. 170g" }
                    ]
                }
            ]
        }
    },

    // 6. Kits Section
    {
        block_type: 'kits_section',
        block_order: 5,
        block_data: {
            title: "Colores Disponibles",
            subtitle: "Elige tu estilo",
            layout: "grid",
            kits: [
                {
                    name: "POWERSHOT PICK NEGRA",
                    image: "https://s7d1.scene7.com/is/image/canon/4828C001-powershot-pick-negra_primary?wid=1600&fmt=png-alpha",
                    link: "https://www.canontiendaonline.cl/es_cl/p/powershot-pick-negra",
                    description: "Versión en negro elegante"
                },
                {
                    name: "POWERSHOT PICK BLANCA",
                    image: "https://s7d1.scene7.com/is/image/canon/4825C001-powershot-pick-blanca_primary?wid=1600&fmt=png-alpha",
                    link: "https://www.canontiendaonline.cl/es_cl/p/powershot-pick-blanca",
                    description: "Versión en blanco minimalista"
                }
            ]
        }
    }
];

async function seedPowershotPick() {
    console.log('🚀 Starting PowerShot Pick seed...\n');

    try {
        // 1. Check if product exists in brochure_products
        console.log('📋 Checking for existing product...');
        const { data: existingProducts, error: searchError } = await supabase
            .from('brochure_products')
            .select('id, name')
            .ilike('name', '%powershot pick%');

        if (searchError) throw searchError;

        let productId;

        if (existingProducts && existingProducts.length > 0) {
            productId = existingProducts[0].id;
            console.log(`✅ Found existing product: ${existingProducts[0].name} (${productId})`);
        } else {
            // Create new product
            console.log('📝 Creating new product entry...');
            const { data: newProduct, error: createError } = await supabase
                .from('brochure_products')
                .insert({
                    name: POWERSHOT_PICK_DATA.name,
                    category: POWERSHOT_PICK_DATA.category,
                    description: POWERSHOT_PICK_DATA.description,
                    image: POWERSHOT_PICK_DATA.image
                })
                .select()
                .single();

            if (createError) throw createError;
            productId = newProduct.id;
            console.log(`✅ Created product with ID: ${productId}`);
        }

        // 2. Delete existing blocks for this product
        console.log('\n🗑️  Cleaning up existing blocks...');
        const { error: deleteError } = await supabase
            .from('brochure_product_blocks')
            .delete()
            .eq('product_id', productId);

        if (deleteError) throw deleteError;
        console.log('✅ Existing blocks removed');

        // 3. Insert new blocks
        console.log('\n📦 Inserting blocks...');
        const blocksToInsert = POWERSHOT_PICK_BLOCKS.map(block => ({
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

        // 4. Verify the product can be loaded
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
        console.log(`\n📍 View the product at: http://localhost:5174/product/powershot-pick`);

    } catch (error) {
        console.error('\n❌ Seed failed:', error.message);
        process.exit(1);
    }
}

seedPowershotPick();
