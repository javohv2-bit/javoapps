/**
 * Seed EOS RP: Creates product + inserts blocks
 */
import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://bupnqihroawrvcvzpbqv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo'
);

async function main() {
  // 1. Create product
  const { data, error } = await s.from('products').upsert({
    id: 'eos-rp',
    name: 'EOS RP RF 24-105mm S',
    sku: '16487747',
    category: 'Photo',
    image_folder: 'eos-rp',
    is_template: false,
  }).select().single();

  if (error) { console.error('Product error:', error.message); process.exit(1); }
  console.log('Product:', data.id, data.name);

  // 2. Delete old blocks
  await s.from('inpage_blocks').delete().eq('product_id', 'eos-rp');

  // 3. Insert blocks (full data from canonInPages.js)
  const blocks = [
    { moduleId: 6, data: { image: 'https://asia.canon/media/image/2026/01/16/8e793fa0a9ac488dbf0e791c8010475b_EOS+RP+w+RF24-105mm+F4-7.1+IS+STM+Front+Slant+Ori_362x320.png', altImage: 'Canon EOS RP con lente RF 24-105mm - La mirrorless full frame mas ligera de Canon', title: 'EOS RP: Fotografia Full Frame Para Todos', description: 'Da el salto a la fotografia Full Frame con una de las camaras mirrorless mas ligeras de Canon. La EOS RP integra un sensor CMOS de 26,2 MP y un autoenfoque ultrarapido de 0,05 segundos en un cuerpo compacto hecho para creadores en movimiento. Con Dual Pixel CMOS AF y Eye Detection AF, cada retrato queda perfectamente enfocado.' } },
    { moduleId: 3, data: { image: 'https://asia.canon/media/image/2026/01/14/870cde46c4344796b8521c09a4e929e0_1_K433_FrontSlantDown_Body_362x320.png', altImage: 'Canon EOS RP sensor Full Frame 26.2 megapixeles CMOS calidad profesional', title: 'Sensor Full Frame de 26,2 MP', description: 'El sensor Full Frame es 2,6 veces mas grande que un sensor APS-C, lo que entrega una menor profundidad de campo y fondos desenfocados artisticamente (bokeh). La EOS RP captura cada detalle con 26,2 megapixeles y un rango dinamico amplio.' } },
    { moduleId: 4, data: { title: 'Dual Pixel CMOS AF: 0,05 s hasta EV -5', description: 'El Dual Pixel CMOS AF es el sistema de autoenfoque mas rapido de Canon, alcanzando el foco en tan solo 0,05 segundos. Cubre aproximadamente el 100% vertical x 88% horizontal con 4.779 puntos de enfoque seleccionables.', image: 'https://asia.canon/media/image/2026/01/14/e71d01bf7aa64023a5c852887b961078_2_K433_FrontSlantLeft_Body_362x320.png', altImage: 'Canon EOS RP Dual Pixel CMOS AF velocidad 0.05 segundos autoenfoque' } },
    { moduleId: 3, data: { image: 'https://asia.canon/media/image/2026/01/15/5391f2e343c84aec82ddd2f89aca1cf2_eosrp-prodes-feature-02.jpg', altImage: 'Canon EOS RP con montaje RF calidad optica superior lentes profesionales', title: 'Montaje RF: Optica de Nueva Generacion', description: 'La montura RF de 54 mm de gran diametro y la corta distancia de brida de 20 mm, combinadas con comunicacion de datos de alta velocidad, liberan todo el potencial de los objetivos RF en un cuerpo compacto y ligero.' } },
    { moduleId: 4, data: { title: 'Eye Detection AF en Fotos y Video', description: 'El Eye Detection AF rastrea y mantiene el enfoque en el ojo del sujeto durante cualquier movimiento, tanto en fotografias como en video 4K UHD. Ideal para retratos, bodas, sesiones de moda.', image: 'https://asia.canon/media/image/2026/01/14/a25d5248c811470a83eff491568c3773_3_K433_The+Front_Body_362x320.png', altImage: 'Canon EOS RP Eye Detection AF enfoque en ojos retratos automatico' } },
    { moduleId: 7, data: { leftImage: 'https://asia.canon/media/image/2026/01/14/7ede278fc52a4733ba7d86f00b3e436f_8_K433_Back_Body_362x320.png', leftAlt: 'Canon EOS RP pantalla Vari-angle articulada touchscreen EVF integrado', leftTitle: 'Pantalla Vari-angle Tactil + EVF', leftText: 'Pantalla LCD articulada Vari-angle de 3 pulgadas con 1,04M puntos. EVF integrado de 0,39 pulgadas con 2,36M puntos.', rightImage: 'https://asia.canon/media/image/2026/01/14/0eab6ceb7c57470fa3aae6e5d5407cdb_6_K433_TOP_Body_362x320.png', rightAlt: 'Canon EOS RP ligero 440g full frame', rightTitle: 'Full Frame Liviana: Solo 440 g', rightText: 'Con apenas 440 g, la EOS RP ideal para viajar. Modo Silencioso para disparar sin sonido.' } },
    { moduleId: 3, data: { image: 'https://asia.canon/media/image/2026/01/14/3110a1929d314520b6c882bdb51467ba_4_K433_Right_Body_362x320.png', altImage: 'Canon EOS RP video 4K UHD conectividad WiFi Bluetooth USB', title: 'Video 4K UHD + Conectividad Completa', description: 'Captura video 4K UHD con la calidad optica del sistema RF. WiFi y Bluetooth para sincronizacion con smartphone via Canon Camera Connect.' } },
    { moduleId: 8, data: { youtubeCode: 'HU24kemhmms', title: 'Canon EOS RP: Full Frame Para Todos', description: 'Descubre por que la EOS RP es la puerta de entrada perfecta a la fotografia Full Frame.' } },
    { moduleId: 5, data: { title: 'Especificaciones Destacadas', item1: 'Sensor Full Frame CMOS 26,2 MP', item2: 'Dual Pixel CMOS AF - 0,05 s - EV -5 - 4.779 puntos', item3: 'Eye Detection AF en fotos y video', item4: 'Video 4K UHD - Modo Silencioso', item5: 'Pantalla Vari-angle 3 pulgadas 1,04M puntos touchscreen', item6: 'EVF integrado 0,39 pulgadas 2,36M puntos', item7: 'Montura RF - Asistente Creativo', item8: 'WiFi - Bluetooth - USB - Peso 440 g' } },
  ];

  const rows = blocks.map((b, i) => ({
    product_id: 'eos-rp',
    block_order: i + 1,
    module_id: b.moduleId,
    block_data: b.data,
  }));

  const { error: insErr } = await s.from('inpage_blocks').insert(rows);
  if (insErr) { console.error('Block insert error:', insErr.message); process.exit(1); }
  console.log(rows.length + ' blocks inserted for eos-rp');

  // Verify
  const { count } = await s.from('inpage_blocks').select('*', { count: 'exact', head: true }).eq('product_id', 'eos-rp');
  console.log('Verification: eos-rp has', count, 'blocks');
}

main().catch(e => { console.error(e); process.exit(1); });
