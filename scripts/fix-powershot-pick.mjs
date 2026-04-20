/**
 * Fix PowerShot Pick Product in Supabase
 * 
 * 1. Rename product from "POWERSHOT PICK BLANCA" to "POWERSHOT PICK"
 * 2. Update hero_header block with complete Canon Asia images
 * 
 * Run: node scripts/fix-powershot-pick.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzczOTcsImV4cCI6MjA4NTMxMzM5N30.EKM3ZiTCiO3tUfbfeDs2Tc91ditpkbxQSsWOAF8baS0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Complete Canon Asia images for PowerShot Pick
const COMPLETE_IMAGES = {
    angles: [
        { src: "https://asia.canon/media/image/2021/10/20/97da55fbed294f8882c3f01df4992eff_PICK-front-black.png", alt: "PowerShot Pick Front Black" },
        { src: "https://asia.canon/media/image/2021/10/20/0fa11e8b4ca9403a80412e79cb9aa877_PICK-right-black.png", alt: "PowerShot Pick Right Black" },
        { src: "https://asia.canon/media/image/2021/10/20/32a1b7c377264895b8cc285510d752bb_PICK-top.png", alt: "PowerShot Pick Top" },
        { src: "https://asia.canon/media/image/2021/10/20/06a830ceb52d49908fbe5edc34a7c33b_PICK-rear.png", alt: "PowerShot Pick Rear" }
    ],
    white: [
        { src: "https://asia.canon/media/image/2021/10/20/6a5b9c92a400405f8e335d7b70547b96_PICK-front.png", alt: "PowerShot Pick Front White" },
        { src: "https://asia.canon/media/image/2021/10/20/ccfb37b3a2f742e28468796c6a736145_PICK-left.png", alt: "PowerShot Pick Left White" }
    ],
    lifestyle: [
        { src: "https://asia.canon/media/image/2021/10/20/3c769085ca41470484606735bc867dce_mainheader.jpg", alt: "PowerShot Pick Lifestyle" },
        { src: "https://asia.canon/media/image/2024/05/28/afbbe93097864afa9b97e4b1a403e59d_PowerShot+PICK+Banner+01.jpg", alt: "PowerShot Pick Banner 1" },
        { src: "https://asia.canon/media/image/2024/05/28/1196019eec794f5da2d2bca252ef0f98_PowerShot+PICK+Banner+02.jpg", alt: "PowerShot Pick Banner 2" },
        { src: "https://asia.canon/media/image/2021/10/20/cd2c9ab2cd244ddb9c60339467ceca91_pan-tilt.jpg", alt: "PowerShot Pick Pan Tilt" },
        { src: "https://asia.canon/media/image/2021/10/20/6a76f38c559b414898abb59973e002eb_portable.jpg", alt: "PowerShot Pick Portable" }
    ]
};

async function fixPowershotPick() {
    console.log('🔧 Fixing PowerShot Pick in Supabase...\n');

    try {
        // 1. Find and rename the product
        console.log('📋 Step 1: Renaming product...');
        const { data: products, error: findError } = await supabase
            .from('brochure_products')
            .select('id, name')
            .ilike('name', '%powershot pick%');

        if (findError) throw findError;

        if (!products || products.length === 0) {
            console.log('❌ No PowerShot Pick product found!');
            process.exit(1);
        }

        console.log(`   Found ${products.length} product(s):`);
        products.forEach(p => console.log(`   - ${p.name} (${p.id})`));

        // Use the first one and rename it
        const productId = products[0].id;
        const oldName = products[0].name;

        if (oldName !== 'POWERSHOT PICK') {
            const { error: updateError } = await supabase
                .from('brochure_products')
                .update({ name: 'POWERSHOT PICK' })
                .eq('id', productId);

            if (updateError) throw updateError;
            console.log(`✅ Renamed "${oldName}" → "POWERSHOT PICK"`);
        } else {
            console.log(`✅ Name is already correct: "POWERSHOT PICK"`);
        }

        // 2. Update hero_header block with complete images
        console.log('\n📸 Step 2: Updating hero_header with complete images...');

        const { data: heroBlock, error: blockError } = await supabase
            .from('brochure_product_blocks')
            .select('*')
            .eq('product_id', productId)
            .eq('block_type', 'hero_header')
            .single();

        if (blockError && blockError.code !== 'PGRST116') throw blockError;

        if (heroBlock) {
            // Update existing block data with complete images
            const updatedData = {
                ...heroBlock.block_data,
                images: COMPLETE_IMAGES
            };

            const { error: updateBlockError } = await supabase
                .from('brochure_product_blocks')
                .update({ block_data: updatedData })
                .eq('id', heroBlock.id);

            if (updateBlockError) throw updateBlockError;
            console.log(`✅ Updated hero_header with ${COMPLETE_IMAGES.angles.length} angles, ${COMPLETE_IMAGES.white.length} white, ${COMPLETE_IMAGES.lifestyle.length} lifestyle images`);
        } else {
            console.log('⚠️  No hero_header block found - run seed script first');
        }

        // 3. Verify the changes
        console.log('\n🔍 Step 3: Verifying...');

        const { data: verifyProduct } = await supabase
            .from('brochure_products')
            .select('*')
            .eq('id', productId)
            .single();

        const { data: verifyBlocks } = await supabase
            .from('brochure_product_blocks')
            .select('block_type')
            .eq('product_id', productId);

        console.log(`   Product: "${verifyProduct.name}"`);
        console.log(`   Blocks: ${verifyBlocks.map(b => b.block_type).join(', ')}`);

        console.log('\n🎉 Fix completed successfully!');
        console.log(`\n📍 The product should now be accessible at: /product/powershot-pick`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

fixPowershotPick();
