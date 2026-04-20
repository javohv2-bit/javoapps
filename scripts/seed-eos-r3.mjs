/**
 * Canon EOS R3 - Seed Script
 * Fuentes:
 *  - https://asia.canon/en/consumer/eos-r3-body/product
 *  - https://www.canon.es/cameras/eos-r3/
 *  - https://www.canon-europe.com/cameras/eos-r3/
 *
 * TIPOS DE BLOQUE VÁLIDOS (BlockRenderers.jsx):
 * hero_header, hero_section, image_text, feature_grid, gallery,
 * specifications, cta_buttons
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo';

const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================================================
// PRODUCTO DESTINO (slug: eos-r3)
// ==========================================================================
const TARGET_PRODUCT_ID = 'b7bac5d6-27d7-4e77-b8b7-3f843863a80c';

// ==========================================================================
// IMÁGENES (seleccionadas del scrape asia.canon)
// ==========================================================================
const IMG = {
  angles: [
    'https://asia.canon/media/image/2021/09/15/c33164bb058049c787b388dae791d500_R3_Front.jpg',
    'https://asia.canon/media/image/2021/09/15/b1807b2ed1bc40a48821a8981b2dc419_R3_Front_wlens.jpg',
    'https://asia.canon/media/image/2021/09/15/6dd2b50bbcef46fe85c4e842f125c826_R3_top.jpg',
    'https://asia.canon/media/image/2021/09/11/823a0335bb8145a290e83be4e6a19600_R3_Rear.png',
    'https://asia.canon/media/image/2021/09/15/94866b836e374d53a3fad6506abece76_R3_right.jpg',
    'https://asia.canon/media/image/2021/09/15/a42f86cf5b8f447497fd32422eb0a7b4_R3_left.jpg',
    'https://asia.canon/media/image/2021/09/13/79adce3249aa4222b2d7f3c4d3d33ec3_R3_bottom.png',
    'https://asia.canon/media/image/2021/09/11/396760f4b5bc4d67afcbc2eb0ff11638_R3_frontSlant_lens.png',
  ],
  lifestyle: [
    'https://asia.canon/media/image/2021/09/11/0257b976531541679a3ca9dcb4a8856b_R3-Gallery-01.jpg',
    'https://asia.canon/media/image/2021/09/11/674f1e3b2cf14b8888a9baf6e90caa4f_R3-Gallery-03.jpg',
    'https://asia.canon/media/image/2021/09/11/f65840f4e7bf4069bc68a354f1085e2f_R3-Gallery-04.jpg',
    'https://asia.canon/media/image/2021/09/11/8da38cf70d554410a1e4b2d24c362c8a_R3-Gallery-05.jpg',
    'https://asia.canon/media/image/2021/09/11/869ba1a1422f42fdb986c82f3aa74c50_R3-Gallery-06.jpg',
    'https://asia.canon/media/image/2021/09/11/8a7241ad1c7d46a9acaecb955128f9c3_R3-Gallery-02.jpg',
  ],
  features: {
    sensor: 'https://asia.canon/media/image/2021/09/10/edd301b8ac7a475cad4ec2ba896ac19d_R3-ISO.jpg',
    burst: 'https://asia.canon/media/image/2021/09/11/afa7c503ebec4032b5439e243cb46540_R3-FPS-362320.jpg',
    eyeAf: 'https://asia.canon/media/image/2021/09/13/340dc5cef43344b9a62898bfa53d4883_vehicle-detection-pngv2.png',
    video: 'https://asia.canon/media/image/2021/09/10/b64ab61442634bd1adeef0778532eb91_R3-video.jpg',
    connectivity: 'https://asia.canon/media/image/2021/09/13/32f84c415cfa4e6aa41b75108cc96d67_R3-connect-v3.jpg',
    durability: 'https://asia.canon/media/image/2021/09/13/e707082148934c4b84b152b2d187bd45_R3-strength-rear.png',
  }
};

// ==========================================================================
// BLOQUES
// ==========================================================================
const BLOCKS = [
  // 0. HERO HEADER
  {
    block_type: 'hero_header',
    block_order: 0,
    block_data: {
      name: 'EOS R3',
      tagline: 'Pro speed. Pro vision. Eye Control AF.',
      category: 'FLAGSHIP MIRRORLESS',
      colors: ['Negra'],
      images: {
        angles: IMG.angles.map((src, idx) => ({ src, alt: `EOS R3 vista ${idx + 1}` })),
        white: [],
        lifestyle: IMG.lifestyle.map((src, idx) => ({ src, alt: `EOS R3 lifestyle ${idx + 1}` })),
      },
      keyFeatures: [
        { title: '24.1MP', subtitle: 'BSI Stacked CMOS', icon: 'sensor' },
        { title: '30 fps', subtitle: 'Electronic shutter', icon: 'speed' },
        { title: '6K/60 RAW', subtitle: '4K/120p', icon: 'video' },
        { title: 'Eye Control AF', subtitle: 'Deep Learning', icon: 'focus' },
        { title: '8-stop IBIS', subtitle: 'In-body stabilizer', icon: 'stabilization' },
        { title: 'Wi‑Fi 5GHz', subtitle: 'Ethernet | BT LE', icon: 'wifi' },
      ],
      externalLinks: {
        officialPage: 'https://www.canon-europe.com/cameras/eos-r3/',
        support: 'https://www.canon.es/support/consumer/products/cameras/eos-r/eos-r3.html'
      },
    },
  },

  // 1. HERO SECTION
  {
    block_type: 'hero_section',
    block_order: 1,
    block_data: {
      title: 'MADE FOR RELENTLESS SPEED',
      subtitle: 'Captura deportes, acción y noticias con ráfagas de 30 fps y AF que sigue tu mirada.',
      description: 'El sensor BSI apilado de 24.1 MP con DIGIC X reduce rolling shutter y entrega alto rango dinámico. El obturador electrónico silencioso permite sincronía de flash y hasta 30 fps con seguimiento completo.',
      gradient: 'red',
    },
  },

  // 2. IMAGE + TEXT — Sensor
  {
    block_type: 'image_text',
    block_order: 2,
    block_data: {
      image: IMG.features.sensor,
      title: 'Sensor BSI apilado de 24.1 MP',
      description: 'Diseñado para alta velocidad y bajo ruido. Lectura rápida para minimizar rolling shutter y conservar detalle en luces y sombras.',
      layout: 'image_left',
    },
  },

  // 3. IMAGE + TEXT — Ráfagas
  {
    block_type: 'image_text',
    block_order: 3,
    block_data: {
      image: IMG.features.burst,
      title: '30 fps electrónicos + 12 fps mecánicos',
      description: 'Seguimiento AF/AE completo, blackout-free, obturador electrónico silencioso y durabilidad de 500k ciclos en obturador mecánico.',
      layout: 'image_right',
    },
  },

  // 4. IMAGE + TEXT — Eye Control AF
  {
    block_type: 'image_text',
    block_order: 4,
    block_data: {
      image: IMG.features.eyeAf,
      title: 'Eye Control AF + Deep Learning',
      description: 'Selecciona sujetos con tu mirada y deja que el sistema Dual Pixel CMOS AF II con EOS iTR X los siga incluso con casco, gafas o en movimiento errático.',
      layout: 'image_left',
    },
  },

  // 5. HERO SECTION — Video
  {
    block_type: 'hero_section',
    block_order: 5,
    block_data: {
      title: '6K RAW INTERNO + 4K 120p',
      subtitle: 'Listo para cine y broadcast',
      description: 'Graba 6K 60p RAW de 12 bits, 4K 120p para cámara lenta y 4K sobremuestreado desde 6K. Canon Log 3 y HDR PQ para máximo rango dinámico.',
      gradient: 'amber',
    },
  },

  // 6. IMAGE + TEXT — Video
  {
    block_type: 'image_text',
    block_order: 6,
    block_data: {
      image: IMG.features.video,
      title: 'Controles de video profesionales',
      description: 'Zebra, peaking, false color, oversampling 6K→4K, salida limpia por micro-HDMI, timecode y compatibilidad con grabadores externos.',
      layout: 'image_right',
    },
  },

  // 7. FEATURE GRID — Conectividad y flujo
  {
    block_type: 'feature_grid',
    block_order: 7,
    block_data: {
      title: 'Flujo de trabajo veloz',
      features: [
        {
          title: 'Wi‑Fi 5GHz + Ethernet',
          description: 'Transferencia FTP/SFTP segura; Bluetooth LE siempre conectado.',
          image: IMG.features.connectivity,
        },
        {
          title: 'Dual slot',
          description: 'CFexpress Type B para 6K RAW + SD UHS-II para flujo proxy/backup.',
          image: 'https://asia.canon/media/image/2021/09/10/2fc3dea492e34315a732757dec41403d_R3-card-slots.jpg',
        },
        {
          title: 'Multi-Function Shoe',
          description: 'Alimenta micrófonos digitales, transmisores y flashes sin cables adicionales.',
          image: 'https://asia.canon/media/image/2021/09/11/d2199559e23f4a6e927fc755c5b725c3_R3-shoe-v2.jpg',
        },
      ],
    },
  },

  // 8. IMAGE + TEXT — Robustez
  {
    block_type: 'image_text',
    block_order: 8,
    block_data: {
      image: IMG.features.durability,
      title: 'Cuerpo sellado y equilibrado',
      description: 'Construcción en aleación de magnesio con sellado contra polvo y humedad, grip integrado y ergonomía heredada de la serie 1D.',
      layout: 'image_left',
    },
  },

  // 9. GALLERY — Imágenes de muestra
  {
    block_type: 'gallery',
    block_order: 9,
    block_data: {
      title: 'Galería EOS R3',
      columns: 3,
      images: IMG.lifestyle.map(src => ({ src })),
    },
  },

  // 10. SPECIFICATIONS
  {
    block_type: 'specifications',
    block_order: 10,
    block_data: {
      categories: [
        {
          name: 'Sensor e Imagen',
          specs: [
            { label: 'Tipo', value: '24.1 MP Full Frame BSI Stacked CMOS' },
            { label: 'Procesador', value: 'DIGIC X' },
            { label: 'IS', value: 'IBIS de hasta 8 pasos (coordinado)' },
            { label: 'Montura', value: 'RF' },
          ],
        },
        {
          name: 'Autofoco',
          specs: [
            { label: 'Sistema', value: 'Dual Pixel CMOS AF II con EOS iTR X' },
            { label: 'Eye Control AF', value: 'Sí, selección por mirada' },
            { label: 'Detección', value: 'Humanos, animales, vehículos; Deep Learning' },
            { label: 'Rango AF', value: 'hasta -7.5 EV (con RF f/1.2)' },
          ],
        },
        {
          name: 'Ráfaga y obturador',
          specs: [
            { label: 'Electronic', value: 'Hasta 30 fps con AF/AE' },
            { label: 'Mecánico', value: 'Hasta 12 fps' },
            { label: 'Velocidad máx.', value: '1/64000 e-shutter, 1/8000 mecánico' },
            { label: 'Durabilidad', value: '500k ciclos (mecánico)' },
          ],
        },
        {
          name: 'Video',
          specs: [
            { label: '6K RAW', value: 'Interno 12-bit hasta 60p' },
            { label: '4K', value: 'Hasta 120p; 4K sobremuestreado desde 6K' },
            { label: 'Perfil', value: 'Canon Log 3, HDR PQ' },
            { label: 'Estabilización', value: 'IBIS + IS óptico + IS digital' },
          ],
        },
        {
          name: 'Visor y pantalla',
          specs: [
            { label: 'EVF', value: '0.5" OLED, 5.76M puntos, 120 fps, blackout-free' },
            { label: 'LCD', value: '3.2" abatible táctil, 4.15M puntos' },
          ],
        },
        {
          name: 'Conectividad',
          specs: [
            { label: 'Inalámbrico', value: 'Wi‑Fi 5GHz, Bluetooth LE' },
            { label: 'Físico', value: 'USB-C, Ethernet, micro-HDMI, puerto remoto' },
            { label: 'Slots', value: '1× CFexpress Type B + 1× SD UHS-II' },
          ],
        },
        {
          name: 'Energía y construcción',
          specs: [
            { label: 'Batería', value: 'LP-E19' },
            { label: 'Cuerpo', value: 'Aleación de magnesio, sellado contra clima' },
            { label: 'Peso', value: 'Aprox. 1015 g (sólo cuerpo)' },
          ],
        },
      ],
    },
  },

  // 11. CTA BUTTONS
  {
    block_type: 'cta_buttons',
    block_order: 11,
    block_data: {
      buttons: [
        { label: 'Ver en Canon Europe', url: 'https://www.canon-europe.com/cameras/eos-r3/', style: 'primary' },
        { label: 'Ver en Canon España', url: 'https://www.canon.es/cameras/eos-r3/', style: 'secondary' },
        { label: 'Ficha Asia', url: 'https://asia.canon/en/consumer/eos-r3-body/product', style: 'outline' },
      ],
    },
  },
];

// ==========================================================================
// MAIN
// ==========================================================================
async function seed() {
  console.log('🚀 Starting Canon EOS R3 seed...\n');

  const { data: product, error: searchError } = await supabase
    .from('brochure_products')
    .select('*')
    .eq('id', TARGET_PRODUCT_ID)
    .single();

  if (searchError || !product) {
    console.error('❌ Product not found:', TARGET_PRODUCT_ID);
    return;
  }

  console.log(`✅ Found: ${product.name} (${product.id})`);

  const { error: deleteError } = await supabase
    .from('brochure_product_blocks')
    .delete()
    .eq('product_id', TARGET_PRODUCT_ID);

  if (deleteError) {
    console.error('❌ Error deleting existing blocks:', deleteError);
    return;
  }
  console.log('🗑️  Deleted existing blocks');

  const blocksToInsert = BLOCKS.map(block => ({
    product_id: TARGET_PRODUCT_ID,
    block_type: block.block_type,
    block_order: block.block_order,
    block_data: block.block_data,
  }));

  const { data: inserted, error: insertError } = await supabase
    .from('brochure_product_blocks')
    .insert(blocksToInsert)
    .select();

  if (insertError) {
    console.error('❌ Error inserting:', insertError);
    return;
  }

  console.log(`\n✅ Inserted ${inserted.length} blocks`);
  console.log('\n📋 Blocks:');
  inserted.forEach((b, i) => {
    const title = b.block_data?.title || b.block_data?.name || b.block_type;
    console.log(`${i + 1}. [${b.block_type}] ${title}`);
  });

  console.log('\n🎉 Done! View at: /product/eos-r3');
}

seed().catch(console.error);
