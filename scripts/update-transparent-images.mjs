/**
 * Update Product Images Script
 * 
 * Updates the hero_header blocks to use local transparent images
 * 
 * Run: node scripts/update-transparent-images.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzczOTcsImV4cCI6MjA4NTMxMzM5N30.EKM3ZiTCiO3tUfbfeDs2Tc91ditpkbxQSsWOAF8baS0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Base URL for local images (when running locally)
const LOCAL_BASE = '/images/products-transparent';

// Updated transparent images for EOS 5D Mark IV
const EOS_5D_TRANSPARENT_IMAGES = {
    angles: [
        { src: `${LOCAL_BASE}/eos-5d-mark-iv-front.png`, alt: "EOS 5D Mark IV Front with EF 50mm" },
        { src: `${LOCAL_BASE}/eos-5d-mark-iv-top.png`, alt: "EOS 5D Mark IV Top with EF 24-70mm" },
        { src: `${LOCAL_BASE}/eos-5d-mark-iv-left.png`, alt: "EOS 5D Mark IV Side Left" },
        { src: `${LOCAL_BASE}/eos-5d-mark-iv-right.png`, alt: "EOS 5D Mark IV Side Right" }
    ],
    lifestyle: [
        // Keep lifestyle images from CDN (they have natural backgrounds)
        { src: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-beauty_1bd06bcadaee4833af6460c87898d249?$70-30-header-4by3-dt-jpg$", alt: "EOS 5D Mark IV Hero" },
        { src: "https://cdn.media.amplience.net/i/canon/eos_5d_mark_iv-side-right-02-beauty_805f768e84114b05902f3ef59575b68f?$hero-header-full-16by9-dt-jpg$", alt: "EOS 5D Mark IV Beauty Shot" }
    ]
};

async function updateTransparentImages() {
    console.log('🖼️  Updating product images to transparent versions...\n');

    try {
        // 1. Find EOS 5D Mark IV
        console.log('📋 Looking for EOS 5D Mark IV...');
        const { data: products, error: searchError } = await supabase
            .from('brochure_products')
            .select('id, name')
            .ilike('name', '%5d mark iv%');

        if (searchError) throw searchError;

        if (!products || products.length === 0) {
            console.log('❌ EOS 5D Mark IV not found!');
            return;
        }

        const productId = products[0].id;
        console.log(`✅ Found: ${products[0].name} (${productId})\n`);

        // 2. Get hero_header block
        console.log('📦 Fetching hero_header block...');
        const { data: heroBlock, error: blockError } = await supabase
            .from('brochure_product_blocks')
            .select('*')
            .eq('product_id', productId)
            .eq('block_type', 'hero_header')
            .single();

        if (blockError) throw blockError;

        // 3. Update with transparent images
        console.log('🔄 Updating images...');
        const updatedBlockData = {
            ...heroBlock.block_data,
            images: EOS_5D_TRANSPARENT_IMAGES
        };

        const { error: updateError } = await supabase
            .from('brochure_product_blocks')
            .update({ block_data: updatedBlockData })
            .eq('id', heroBlock.id);

        if (updateError) throw updateError;

        console.log('✅ Updated hero_header with transparent images:');
        console.log(`   - ${EOS_5D_TRANSPARENT_IMAGES.angles.length} angle images (transparent)`);
        console.log(`   - ${EOS_5D_TRANSPARENT_IMAGES.lifestyle.length} lifestyle images`);

        // Also update Rebel T100
        console.log('\n📋 Looking for EOS Rebel T100...');
        const { data: t100Products } = await supabase
            .from('brochure_products')
            .select('id, name')
            .ilike('name', '%rebel t100%')
            .limit(1);

        if (t100Products && t100Products.length > 0) {
            const t100Id = t100Products[0].id;
            console.log(`✅ Found: ${t100Products[0].name}`);

            const { data: t100Block } = await supabase
                .from('brochure_product_blocks')
                .select('*')
                .eq('product_id', t100Id)
                .eq('block_type', 'hero_header')
                .single();

            if (t100Block) {
                const T100_TRANSPARENT_IMAGES = {
                    angles: [
                        { src: `${LOCAL_BASE}/eos-rebel-t100-front-lens.png`, alt: "Vista Frontal con Lente" },
                        { src: `${LOCAL_BASE}/eos-rebel-t100-body.png`, alt: "Body Solo" },
                        // Keep remaining from CDN
                        { src: "https://s7d1.scene7.com/is/image/canon/2628C003_eos-rebel-t100-ef-s-18-55mm_back?wid=800", alt: "Vista Posterior" },
                        { src: "https://s7d1.scene7.com/is/image/canon/2628C003_eos-rebel-t100-ef-s-18-55mm_left?wid=800", alt: "Vista Lateral" },
                        { src: "https://s7d1.scene7.com/is/image/canon/2628C003_eos-rebel-t100-ef-s-18-55mm_top?wid=800", alt: "Vista Superior" }
                    ]
                };

                const t100BlockData = {
                    ...t100Block.block_data,
                    images: T100_TRANSPARENT_IMAGES
                };

                await supabase
                    .from('brochure_product_blocks')
                    .update({ block_data: t100BlockData })
                    .eq('id', t100Block.id);

                console.log('✅ Updated Rebel T100 with 2 transparent images');
            }
        }

        console.log('\n🎉 Update completed!');
        console.log('\n📍 View at: http://localhost:5175/product/eos-5d-mark-iv');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

updateTransparentImages();
