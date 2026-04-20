/**
 * Canon EOS R1 - Seed Script
 * Fuente: https://www.canon.co.uk/cameras/eos-r1/
 * 
 * TIPOS DE BLOQUE VÁLIDOS (de BlockRenderers.jsx):
 * - hero_header: Galería + info del producto
 * - hero_section: Banner con gradiente (title, subtitle, description)
 * - image_text: Imagen + texto (image, title, description, layout)
 * - feature_grid: Cuadrícula de features (features[{title, description, icon, image}])
 * - gallery: Galería de imágenes (images[{src, caption}])
 * - specifications: Specs acordeón (categories[{name, specs[{label, value}]}])
 * - cta_buttons: Botones (buttons[{label, url, style}])
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo';

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// IMÁGENES (Canon UK)
// ============================================================================

const IMG = {
  hero: 'https://s7d1.scene7.com/is/image/canon/6577C002_Primary',
  
  hotspots: [
    'https://cdn.media.amplience.net/i/canon/eos-r1_hotspot-module_01_ae687313615b48c9bfee528353f6d084',
    'https://cdn.media.amplience.net/i/canon/eos-r5-mark-ii_digic-x_digic-accelerator_cinc_7554b37623464006858db03478c1fe43',
    'https://cdn.media.amplience.net/i/canon/eos-r1_hotspot-module_03_777a0efd70c041a78b6115a1a4210bd7',
    'https://cdn.media.amplience.net/i/canon/eos-r1_hotspot-module_04_1e38dcdb9f864851b1467cce90d31d39',
    'https://cdn.media.amplience.net/i/canon/eos-r1_hotspot-module_05_ef3cc885fc0b4c0cbfdba40dcbb87478',
    'https://cdn.media.amplience.net/i/canon/eos-r1_hotspot-module_06_2a45c806fbcf4dc2ab82a2008b7931d3',
  ],
  
  sports: [
    { src: 'https://cdn.media.amplience.net/i/canon/eos-r1_sample_hero_alisha_lovrich_tennis_burst_032a1588_pro_editorial_2_ed670062522d40b7a0bc1be0c01f2416', caption: 'Tennis - RF 70-200mm F2.8L IS USM | f/2.8 | 1/6400 | ISO 250' },
    { src: 'https://cdn.media.amplience.net/i/canon/eos-r1_sample_chloe_knott_oof_ball_010a0345_9e9f5f046e9e4290b46b2e9bb6b59b23', caption: 'Football - RF 50mm F1.2L USM | f/1.2 | 1/64000 | ISO 200' },
    { src: 'https://cdn.media.amplience.net/i/canon/eos-r1_sample_chloe_knott_action_shot_010a6118_2c26880aedfb4baaa8115fd7e307b7c9', caption: 'Football Action - RF 50mm F1.2L USM | f/1.2 | 1/64000 | ISO 250' },
    { src: 'https://cdn.media.amplience.net/i/canon/eos-r1_sample_atiba_jefferson_sunset_dunk_032a0076_43ab7352248d4177a8aa4b7eab581736', caption: 'Basketball Sunset - RF 10-20mm F4L IS STM | f/4.0 | 1/2500 | ISO 1600' },
    { src: 'https://cdn.media.amplience.net/i/canon/eos-r1_sample_atiba_jefferson_evening_dunk_016a9094_53280a5477b44e878e87e06a4679ab62', caption: 'Basketball Evening - RF 50mm F1.2L USM | f/1.2 | 1/2000 | ISO 6400' },
    { src: 'https://cdn.media.amplience.net/i/canon/eos-r1_sample_atiba_jefferson_dunk_016a1392_aca6205e4f174189adb69f3e517c5d6d', caption: 'Basketball Dunk - RF 24-70mm F2.8L IS USM | f/2.8 | 1/8000 | ISO 400' },
    { src: 'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_wide_sunset_032a9674_8ab8310fea634a24aa5bb340df7ed902', caption: 'Wide Sunset - RF 24-70mm F2.8L IS USM | f/2.8 | 1/4000 | ISO 500' },
    { src: 'https://cdn.media.amplience.net/i/canon/eos-r1_sample_alexandros_grymanisr_mountain_kick_010a8768_8861e7248a334a9fa6ebfe9c87901f67', caption: 'Mountain Kick - RF 100-300mm F2.8L IS USM | f/2.8 | 1/6400 | ISO 250' },
    { src: 'https://cdn.media.amplience.net/i/canon/eos-r1_sample_alexandros_grymanisr_mid_kick_010a2549_92ccd839539144ef9d6e3746e5c9560d', caption: 'Mid Kick - RF 70-200mm F2.8L IS USM | f/2.8 | 1/8000 | ISO 500' },
    { src: 'https://cdn.media.amplience.net/i/canon/eos-r1_sample_alexandros_grymanisr_sunset_tackle_010a7418_54b4e2b64a86487fbdbb2869fb6738a9', caption: 'Sunset Tackle - RF 100-300mm F2.8L IS USM | f/2.8 | 1/8000 | ISO 250' },
  ],

  burst: [
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9513_b7ef21e435274ac38b120d52069e7f71',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9514_44b5395599b54169b3784d636975d3cd',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9515_6a8a0e2799d441bca9d693f91c88889a',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9516_b13f69382e834d98859c20428b819658',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9517_b9bafd1fab424da1bdef426612121325',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9518_fe0f97bdfa8f4f0c8ec78516ca50eceb',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9519_7460f28d8365458792f72e562ac0ae09',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9520_c4b4adf1762b4483a5687ce99215c285',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9521_3b2a2bd1aff74efcbb6e39c505bb61d5',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9522_d88d9fa3e4d0487481c22b2acdda101a',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9523_3d3da2d0a1e04ddb8789dd7640c7b217',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9524_0ad86bd68a214cd9bba45deec92cff69',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9525_3a0c779f8c064702b1b56bf7533b6764',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9526_71551a67596941eebe437cbb5fe8ad68',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9527_422168fc33a14cd497396a689824e06e',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9528_08b65661771c49519df60de4f45388da',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9529_e0d162dc27fa47a6a06ab42dcbb55d0d',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9530_f65269f139b84330a84a9d5d78dfd837',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9531_d25e1962e18f4176a3cdcc62b30997c0',
    'https://cdn.media.amplience.net/i/canon/eos-r1_sample_kishan_mistry_bball_burst_016a9532_97712285047a4ff19e49a892579627b2',
  ],
};

// ============================================================================
// BLOQUES CON TIPOS CORRECTOS
// ============================================================================

const BLOCKS = [
  // 1. HERO HEADER - Galería principal del producto
  {
    block_type: 'hero_header',
    block_order: 0,
    block_data: {
      name: 'Canon EOS R1',
      tagline: 'When speed is everything, the EOS R1 ensures you\'ll finish in first place.',
      category: 'FLAGSHIP',
      colors: ['Negra'],
      images: {
        angles: [
          { src: IMG.hero, alt: 'EOS R1 Front' },
          { src: IMG.hotspots[0], alt: 'EOS R1 Detail 1' },
          { src: IMG.hotspots[2], alt: 'EOS R1 Detail 2' },
          { src: IMG.hotspots[3], alt: 'EOS R1 Detail 3' },
          { src: IMG.hotspots[4], alt: 'EOS R1 Detail 4' },
          { src: IMG.hotspots[5], alt: 'EOS R1 Detail 5' },
        ],
        white: [],
        lifestyle: IMG.sports.slice(0, 3).map(s => ({ src: s.src, alt: s.caption })),
      },
      keyFeatures: [
        { title: '24.2MP', subtitle: 'Stacked Sensor', icon: 'sensor' },
        { title: '40fps', subtitle: 'Continuous', icon: 'speed' },
        { title: '6K RAW', subtitle: '60p Video', icon: 'video' },
        { title: '-7.5 EV', subtitle: 'AF Sensitivity', icon: 'focus' },
        { title: 'Wi-Fi 6E', subtitle: 'Connectivity', icon: 'wifi' },
        { title: 'DIGIC X', subtitle: '+ Accelerator', icon: 'quality' },
      ],
      externalLinks: {
        officialPage: 'https://www.canon.co.uk/cameras/eos-r1/',
        support: 'https://www.canon.co.uk/support/consumer/products/cameras/eos-r/eos-r1.html',
      },
    },
  },

  // 2. AHEAD OF THE GAME - Hero Section
  {
    block_type: 'hero_section',
    block_order: 1,
    block_data: {
      title: 'AHEAD OF THE GAME',
      subtitle: 'Sports photography can be almost as competitive as the action on the pitch.',
      description: 'That\'s why we developed the EOS R1 – a camera that lets you shoot faster, capture defining moments, and get images and video back to your client first – winning the top spot on the page.',
      gradient: 'red',
    },
  },

  // 3. SAMPLE GALLERY - Sports Photography
  {
    block_type: 'gallery',
    block_order: 2,
    block_data: {
      title: 'Sample Images - Sports Photography',
      columns: 3,
      images: IMG.sports,
    },
  },

  // 4. THE ULTIMATE ASSISTANT
  {
    block_type: 'hero_section',
    block_order: 3,
    block_data: {
      title: 'THE ULTIMATE ASSISTANT',
      subtitle: 'At your side, helping you shoot the best work of your creative career',
      description: 'Since 1989, Canon EOS-1 series cameras have led the way for professional sports, news and action photographers. As the result of 35 years of evolution the EOS R1 looks to the future as our flagship EOS camera.',
      gradient: 'amber',
    },
  },

  // 5. KEY FEATURES - Feature Grid
  {
    block_type: 'feature_grid',
    block_order: 4,
    block_data: {
      columns: 3,
      features: [
        { title: 'Dual Pixel Intelligent AF', description: 'With Action Priority mode that automatically determines the subject in football, volleyball and basketball.', icon: 'focus', image: IMG.sports[0].src },
        { title: 'Cross-type AF', description: 'Our Dual Pixel Intelligent AF is sensitive to horizontal and vertical lines for greater precision.', icon: 'focus', image: IMG.sports[1].src },
        { title: '24.2 megapixel stacked sensor', description: 'Truly incredible low-light performance, with enough speed to virtually eliminate rolling shutter.', icon: 'sensor', image: IMG.hotspots[0] },
        { title: 'Capture stills and video concurrently', description: 'Press the shutter release while shooting Full HD video to capture a burst of jpeg images at the same time.', icon: 'video', image: IMG.hotspots[2] },
        { title: 'In-camera upscaling', description: 'Canon\'s deep-learning technology allows images to be enlarged by up to four times, up to 96 megapixels.', icon: 'quality', image: IMG.sports[7].src },
        { title: '40fps shooting with AF and AE', description: 'With Pre-continuous shooting to capture moments that happened before you pressed the button.', icon: 'speed', image: IMG.burst[0] },
      ],
    },
  },

  // 6. AUTOFOCUS - Image + Text
  {
    block_type: 'image_text',
    block_order: 5,
    block_data: {
      title: 'AUTOFOCUS POWERED BY DEEP LEARNING',
      description: 'The EOS R1 harnesses the power of deep-learning to identify subjects, while its DIGIC Accelerator processor tracks and captures them more accurately than ever. Action Priority mode can even identify the subject based on the action, helping you predict what is coming next.\n\n"The autofocus capabilities… the speed of it is amazing." — Atiba Jefferson, Canon USA Explorer of Light',
      image: IMG.sports[3].src,
      imageAlt: 'Basketball action shot',
      layout: 'image_left',
    },
  },

  // 7. SUBJECT DETECTION - Feature Grid
  {
    block_type: 'feature_grid',
    block_order: 6,
    block_data: {
      columns: 5,
      features: [
        { title: 'Faces', description: 'Recognises faces and heads, even when wearing a helmet or mask.', icon: 'human' },
        { title: 'Eyes', description: 'Instantly locks onto a subjects\' eyes if they are visible.', icon: 'focus' },
        { title: 'Bodies', description: 'People tracked by their whole body, or just the upper portion.', icon: 'human' },
        { title: 'Sports', description: 'Action Priority for football, volleyball and basketball.', icon: 'speed' },
        { title: 'Animals & Vehicles', description: 'Recognises animals, cars and aircraft for pin-sharp results.', icon: 'vehicle' },
      ],
    },
  },

  // 8. IMAGE QUALITY - Image + Text
  {
    block_type: 'image_text',
    block_order: 7,
    block_data: {
      title: 'Jaw-dropping image quality',
      description: 'A new 24-megapixel sensor delivers incredible results. A lightning-fast, stacked CMOS design is sensitive in low light. A low-pass filter with 16 point separation reduces moiré and false colour while still capturing very detailed resolution.',
      image: IMG.sports[4].src,
      imageAlt: 'Evening basketball shot ISO 6400',
      layout: 'image_right',
    },
  },

  // 9. EXTRAORDINARY PERFORMANCE - Hero Section
  {
    block_type: 'hero_section',
    block_order: 8,
    block_data: {
      title: 'EXTRAORDINARY PERFORMANCE',
      subtitle: 'Freeze fleeting moments in time like never before',
      description: '40 frames per second continuous shooting pairs with a lightning-fast 1/64,000 sec electronic shutter and minimal rolling shutter distortion for incredible results.',
      gradient: 'red',
    },
  },

  // 10. 40FPS BURST - Gallery
  {
    block_type: 'gallery',
    block_order: 9,
    block_data: {
      title: '40fps Burst Sequence - Basketball Action',
      columns: 4,
      images: IMG.burst.map((src, i) => ({ src, caption: `Frame ${i + 1} of 40` })),
    },
  },

  // 11. PRE-CONTINUOUS SHOOTING - Image + Text
  {
    block_type: 'image_text',
    block_order: 10,
    block_data: {
      title: 'GO BACK IN TIME WITH PRE-CONTINUOUS SHOOTING',
      description: 'Half press the shutter release button to begin continuously buffering up to 20 frames. At the moment you take the shot, these \'pre-captured\' frames are stored too. At EOS R1\'s maximum 40fps shooting speed, this means you\'ll record the half-second before you pressed the shutter release.\n\n"It allows you once you half press the shutter to roll and not miss those late moments. Just saves the day." — Atiba Jefferson',
      image: IMG.burst[5],
      imageAlt: 'Basketball burst sequence',
      layout: 'image_left',
    },
  },

  // 12. IMAGE UPSCALING - Image + Text
  {
    block_type: 'image_text',
    block_order: 11,
    block_data: {
      title: 'GO LARGE! IMAGE UPSCALING, POWERED BY DEEP-LEARNING',
      description: 'Find exquisite detail in the closest of crops. Enlarge images by up to four times in-camera, producing gallery-ready photos at up to 96-megapixels, which look sensational.',
      image: IMG.sports[7].src,
      imageAlt: 'Mountain kick shot',
      layout: 'image_right',
    },
  },

  // 13. CONNECTIVITY - Hero Section
  {
    block_type: 'hero_section',
    block_order: 12,
    block_data: {
      title: 'FORGING MULTIPLE STRONG CONNECTIONS',
      subtitle: 'Be the first to get your images back to the client',
      description: 'The EOS R1 boasts more ways to get connected and the speed you need to hit your goal of the top spot on the page. Wi-Fi 6E (802.11ax) with MIMO antennas and 2.5G BASE-T ethernet ensure your images reach your client first.',
      gradient: 'blue',
    },
  },

  // 14. VIDEO - Image + Text
  {
    block_type: 'image_text',
    block_order: 13,
    block_data: {
      title: 'One camera, lots of options',
      description: 'The professional video features of the EOS R1 make this a superb option for hybrid shooters and filmmakers. Tackle interviews, run-and-gun documentaries and short films, capturing exquisite 6K RAW footage up to 60p, 4K up to 120p, and 2K up to 240p using the full width of the camera\'s sensor.',
      image: IMG.hotspots[2],
      imageAlt: 'EOS R1 video capabilities',
      layout: 'image_left',
    },
  },

  // 15. SPECIFICATIONS
  {
    block_type: 'specifications',
    block_order: 14,
    block_data: {
      categories: [
        {
          name: 'Sensor',
          specs: [
            { label: 'Type', value: '24.2 megapixel back-illuminated stacked CMOS' },
            { label: 'Low-pass filter', value: '16 point separation' },
            { label: 'Rolling shutter', value: 'Virtually eliminated' },
          ],
        },
        {
          name: 'Performance',
          specs: [
            { label: 'Max shooting speed', value: 'Up to 40 fps with AF/AE' },
            { label: 'Electronic shutter', value: '1/64,000 sec' },
            { label: 'Pre-continuous shooting', value: 'Up to 20 frames buffer' },
            { label: 'Image upscaling', value: 'Up to 96MP (4x)' },
          ],
        },
        {
          name: 'Autofocus',
          specs: [
            { label: 'System', value: 'Dual Pixel Intelligent AF with Cross-type AF' },
            { label: 'Low light sensitivity', value: '-7.5 EV' },
            { label: 'Subject detection', value: 'Faces, Eyes, Bodies, Sports, Animals, Vehicles, Aircraft' },
            { label: 'Action Priority', value: 'Football, Volleyball, Basketball' },
          ],
        },
        {
          name: 'Video',
          specs: [
            { label: '6K RAW', value: 'Up to 60p' },
            { label: '4K', value: 'Up to 120p' },
            { label: '2K', value: 'Up to 240p' },
            { label: 'Dual Shooting', value: '17MP JPGs at 10fps while recording video' },
          ],
        },
        {
          name: 'Processing',
          specs: [
            { label: 'Processor', value: 'DIGIC Accelerator + DIGIC X' },
            { label: 'Deep learning', value: 'Subject recognition and image upscaling' },
          ],
        },
        {
          name: 'Connectivity',
          specs: [
            { label: 'Wi-Fi', value: 'Wi-Fi 6E (802.11ax) with MIMO' },
            { label: 'Ethernet', value: '2.5G BASE-T' },
            { label: 'App', value: 'Canon Camera Connect' },
          ],
        },
      ],
    },
  },

  // 16. CTA BUTTONS
  {
    block_type: 'cta_buttons',
    block_order: 15,
    block_data: {
      title: 'Learn More',
      buttons: [
        { label: 'See Full Specifications', url: 'https://www.canon.co.uk/cameras/eos-r1/specifications/', style: 'primary' },
        { label: 'View Gallery', url: 'https://www.canon.co.uk/cameras/eos-r1/#gallery', style: 'secondary' },
        { label: 'Get Support', url: 'https://www.canon.co.uk/support/consumer/products/cameras/eos-r/eos-r1.html', style: 'outline' },
      ],
    },
  },
];

// ============================================================================
// MAIN
// ============================================================================

// EOS R1 BODY es el producto que genera slug 'eos-r1' correctamente
const TARGET_PRODUCT_ID = '8bfe189e-0670-480c-8c41-25539bc26c11';

async function seedEosR1() {
  console.log('🚀 Starting Canon EOS R1 seed (correct block types)...\n');
  
  // Usar directamente el ID del producto "EOS R1 BODY"
  const { data: product, error: searchError } = await supabase
    .from('brochure_products')
    .select('*')
    .eq('id', TARGET_PRODUCT_ID)
    .single();
  
  if (searchError) {
    console.error('❌ Error finding product:', searchError);
    return;
  }
  
  if (!product) {
    console.error('❌ Product not found with ID:', TARGET_PRODUCT_ID);
    return;
  }
  
  let productId = product.id;
  console.log(`✅ Found target product: ${product.name} (${productId})`);
  
  // Eliminar bloques existentes
  const { error: deleteError } = await supabase
    .from('brochure_product_blocks')
    .delete()
    .eq('product_id', productId);
  
  if (deleteError) {
    console.error('❌ Error deleting existing blocks:', deleteError);
    return;
  }
  console.log('🗑️  Deleted existing blocks');
  
  const blocksToInsert = BLOCKS.map(block => ({
    product_id: productId,
    block_type: block.block_type,
    block_order: block.block_order,
    block_data: block.block_data,
  }));
  
  const { data: insertedBlocks, error: insertError } = await supabase
    .from('brochure_product_blocks')
    .insert(blocksToInsert)
    .select();
  
  if (insertError) {
    console.error('❌ Error inserting blocks:', insertError);
    return;
  }
  
  console.log(`\n✅ Inserted ${insertedBlocks.length} blocks\n`);
  
  console.log('📋 Blocks Summary:');
  console.log('─'.repeat(60));
  insertedBlocks.forEach((block, index) => {
    const title = block.block_data?.title || block.block_data?.name || block.block_type;
    console.log(`${index + 1}. [${block.block_type}] ${title}`);
  });
  
  console.log('\n🎉 Seed completed successfully!');
  console.log(`📍 View the product at: /product/eos-r1`);
}

seedEosR1().catch(console.error);
