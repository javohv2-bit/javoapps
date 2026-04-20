/**
 * Seed script: Inserta los bloques de los 4 productos de campaña
 * (que solo existían como staticData en canonInPages.js)
 * en la tabla inpage_blocks de Supabase.
 *
 * Productos:
 *   g7x-iii   → PowerShot G7X Mark III (SKU 17507574)
 *   r10-18-45 → EOS R10 RF-S 18-45mm   (SKU 16765189)
 *   r50-18-45 → EOS R50 18-45 IS STM    (SKU 16765190)
 *   eos-rp    → EOS RP RF 24-105mm S    (SKU 16487747)
 *
 * Uso: node scripts/seed-campaign-products.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo';

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Datos estáticos de los 4 productos ─────────────────────────────────────

const PRODUCTS = [
  {
    id: 'g7x-iii',
    blocks: [
      { moduleId: 6, data: { image: 'https://asia.canon/media/image/2019/07/08/0608c7cd539f49cab256b05348b33ab3_G7+X+mkIII+BK+Front+Slant.png', altImage: 'Canon PowerShot G7X Mark III - La cámara compacta premium para creadores de contenido', title: 'PowerShot G7X Mark III: El Siguiente Nivel', description: 'Sucesor de la popular G7X Mark II, esta cámara es el salto perfecto para quienes quieren más que simples fotografías. El procesador DIGIC 8 y el sensor CMOS apilado de 1,0 pulgada ofrecen una calidad de imagen excepcional. Con apertura f/1.8-2.8, la PowerShot G7X Mark III rinde de forma sobresaliente incluso en condiciones de poca luz.' } },
      { moduleId: 3, data: { image: 'https://asia.canon/media/image/2019/07/08/8d0db401031e4decbdf0d82dce54c796_G7+X+mkIII+BK+Front.png', altImage: 'Sensor CMOS apilado de 1.0 pulgada Canon PowerShot G7X Mark III', title: 'Sensor CMOS Apilado de 1,0 Pulgada', description: 'El sensor CMOS apilado de 1,0 pulgada junto al procesador DIGIC 8 captura imágenes de 20,1 megapíxeles con una nitidez y rango dinámico excepcionales. La apertura máxima f/1.8 a 24mm garantiza una magnífica captura de luz en entornos oscuros, produciendo fotografías nítidas con un suave bokeh artístico.' } },
      { moduleId: 4, data: { title: 'Video 4K sin Recorte y Full HD a 120p', description: 'Graba video 4K UHD sin ningún recorte de encuadre para aprovechar al máximo tu visión creativa. Captura ralentís cinematográficos en Full HD a 120 fps. Las tomas en movimiento quedan perfectamente estabilizadas gracias al sistema IS óptico de 5 ejes combinado con estabilización digital.', image: 'https://asia.canon/media/image/2019/07/08/2185c4ca4dde400c99335959ec6cb5f8_G7+X+mkIII+BK+Front+Slant+w+Screen.png', altImage: 'Canon PowerShot G7X Mark III con pantalla abatible para selfies y vlogging 4K' } },
      { moduleId: 3, data: { image: 'https://asia.canon/media/image/2019/07/08/4143b7600ac64ab198c2ea83e22bb86b_G7+X+mkIII+BK+Back.png', altImage: 'Canon PowerShot G7X Mark III pantalla táctil abatible 180° para selfies', title: 'Pantalla Táctil Abatible 180° para Selfies', description: 'La pantalla LCD táctil de 3,0 pulgadas se inclina hasta 180° hacia arriba, perfecta para selfies y vlogging. Encuadra con precisión en cualquier ángulo. El botón de selfie en la parte frontal permite disparar sin esfuerzo mientras te ves reflejado en pantalla.' } },
      { moduleId: 4, data: { title: 'Live Streaming Directo en YouTube', description: 'Transmite tus aventuras en tiempo real directamente a YouTube desde la cámara. Comparte cada momento al instante con tu comunidad gracias a la conectividad WiFi integrada. Activa el streaming con un solo botón y conéctate sin necesidad de un computador o capturadora adicional.', image: 'https://asia.canon/media/image/2019/07/08/ae4bf430e90c45959def7926bcb63cae_G7+X+mkIII+BK+Top.png', altImage: 'Canon PowerShot G7X Mark III vista superior con controles intuitivos' } },
      { moduleId: 7, data: { leftImage: 'https://asia.canon/media/image/2019/07/08/8d0db401031e4decbdf0d82dce54c796_G7+X+mkIII+BK+Front.png', leftAlt: 'Canon PowerShot G7X Mark III diseño compacto premium', leftTitle: 'Diseño Compacto Premium', leftText: 'Cuerpo compacto que cabe en cualquier bolsillo. Flash integrado para iluminación adicional en interiores y condiciones de contraluz. Construcción sólida y ergonómica para disparar durante horas sin fatiga.', rightImage: 'https://asia.canon/media/image/2019/07/08/2185c4ca4dde400c99335959ec6cb5f8_G7+X+mkIII+BK+Front+Slant+w+Screen.png', rightAlt: 'Canon PowerShot G7X Mark III conectividad WiFi Bluetooth', rightTitle: 'Conectividad Total', rightText: 'WiFi y Bluetooth integrados para transferir fotos y videos al smartphone al instante. Controla la cámara de forma remota desde la app Canon Camera Connect. Comparte tu contenido en redes sociales directamente desde la cámara.' } },
      { moduleId: 8, data: { youtubeCode: 'MtFleOwUBZU', title: 'PowerShot G7X Mark III en Acción', description: 'Descubre todo lo que la PowerShot G7X Mark III puede hacer por ti: video 4K sin recorte, live streaming a YouTube, sensor 1,0" de alto rendimiento y un diseño compacto perfecto para llevar a todas partes.' } },
      { moduleId: 5, data: { title: 'Características Destacadas', item1: 'Sensor CMOS apilado 1,0" · 20,1 MP', item2: 'Procesador DIGIC 8 de última generación', item3: 'Lente zoom 24-100mm f/1.8-2.8 IS', item4: 'Video 4K UHD sin recorte · Full HD 120p', item5: 'Live Streaming directo a YouTube', item6: 'Pantalla LCD táctil 3" abatible 180°', item7: 'WiFi · Bluetooth · NFC', item8: 'Flash integrado · Batería NB-13L' } },
    ]
  },
  {
    id: 'r10-18-45',
    blocks: [
      { moduleId: 6, data: { image: 'https://asia.canon/media/image/2022/05/23/8469771c95ec46a5b3058f82405eac53_EOS+R10+with+RF-S18-45mm+f4.5-6.3+IS+STM+Front+Slant.png', altImage: 'Canon EOS R10 con lente RF-S 18-45mm - Mirrorless APS-C ligera y potente', title: 'EOS R10: Explora Sin Límites', description: 'Explora posibilidades infinitas con la liviana EOS R10. Con el nuevo sensor APS-C en el revolucionario montaje RF, obtienes un efecto teleobjetivo de aproximadamente 1,6x mientras mantienes alta resolución. Esta cámara mirrorless dispara hasta 23 fotogramas por segundo y pesa solo 429 g.' } },
      { moduleId: 3, data: { image: 'https://asia.canon/media/image/2022/05/23/3ebfbc4a04ed4694b0da65548e11e5f4_EOS+R10+01+Superior+Image+Quality.png', altImage: 'Sensor APS-C 24.2 megapíxeles Canon EOS R10 calidad de imagen superior', title: 'Sensor APS-C 24,2 MP + DIGIC X', description: 'El nuevo sensor CMOS APS-C de 24,2 megapíxeles combinado con el procesador DIGIC X ofrece una lectura de alta velocidad y una calidad de imagen excepcional. El efecto de recorte 1,6x te aproxima más al sujeto conservando toda la resolución. Rango ISO 100–32.000 para imágenes limpias incluso en poca luz.' } },
      { moduleId: 4, data: { title: 'Hasta 23 fps con Seguimiento AF/AE', description: 'El Dual Pixel CMOS AF II cubre el 100% × 100% del encuadre con hasta 651 zonas de enfoque, rastreando sujetos hasta el borde del cuadro. Dispara en ráfaga hasta 23 fps con obturador electrónico silencioso, ideal para deportes, vida silvestre y cualquier acción rápida. RAW Burst a 30 fps con pre-disparo de 0,5 s.', image: 'https://asia.canon/media/image/2022/05/23/a4297453d2544afdba59c66c685bdcbe_EOS+R10+with+RF-S18-45mm+f4.5-6.3+IS+STM+Front.png', altImage: 'Canon EOS R10 velocidad de disparo 23fps Dual Pixel CMOS AF II' } },
      { moduleId: 8, data: { youtubeCode: '4bdXsvAjEeI', title: 'Canon EOS R10: Velocidad y Precisión en Acción', description: 'Conoce las capacidades de la EOS R10 de la mano de Canon: 23 fps, 4K UHD con sobremuestreo 6K, Dual Pixel CMOS AF II y un peso de solo 429 g. La mirrorless APS-C perfecta para explorar sin límites.' } },
      { moduleId: 3, data: { image: 'https://asia.canon/media/image/2022/05/23/c4c54342f7584b9a94bd977adde65d5b_EOS+R10+6K+Oversampling+to+4K.png', altImage: 'Canon EOS R10 video 4K UHD con sobremuestreo desde 6K', title: 'Video 4K UHD con Sobremuestreo 6K', description: 'Graba video 4K UHD sin recorte procesado desde datos 6K RGB para mayor calidad, menos moiré y mínima distorsión de color y ruido. Activa el modo 4K 60p Crop para escenas de acción. Graba en 4:2:2 10 bits HDR PQ para un rango dinámico ampliado y transición de colores perfecta en postproducción.' } },
      { moduleId: 4, data: { title: 'Detección Inteligente: Personas, Animales y Vehículos', description: 'El sistema de enfoque con IA reconoce y rastrea personas (incluso con mascarilla o gafas), animales (perros, gatos, aves) y vehículos (autos de carrera, motos). El Eye Detection AF mantiene los ojos del sujeto perfectamente enfocados aunque se muevan por todo el encuadre.', image: 'https://asia.canon/media/image/2022/05/23/584ad3cc52094851ac25b83781da9d42_EOS+R10+HDR+PQ+%26+Composite.png', altImage: 'Canon EOS R10 HDR PQ y composición de alto rango dinámico' } },
      { moduleId: 7, data: { leftImage: 'https://asia.canon/media/image/2022/05/23/28ecd4965587422c9abc45d6d894c958_EOS+R10+with+RF-S18-45mm+f4.5-6.3+IS+STM+Left.png', leftAlt: 'Canon EOS R10 con visor EVF electrónico y pantalla Vari-angle', leftTitle: 'Visor EVF + Pantalla Vari-angle', leftText: 'EVF electrónico de 2,36M puntos con vista OVF simulada para una experiencia natural. Pantalla táctil articulada de 3,0" y 1,04M puntos para disparar desde cualquier ángulo, horizontal o vertical.', rightImage: 'https://asia.canon/media/image/2022/05/23/e0db2685700e4b26800e5cc471da899e_EOS+R10+17+Panorama.png', rightAlt: 'Canon EOS R10 modo panorama en cámara y flash pop-up integrado', rightTitle: 'Flash Integrado + Panorama', rightText: 'Flash pop-up retráctil (GN 6) para iluminar en interiores o como relleno contra luz de fondo. Modo Panorama in-camera: captura hasta 200 fotos y la cámara las combina automáticamente en una panorámica de alta resolución.' } },
      { moduleId: 5, data: { title: 'Especificaciones Destacadas', item1: 'Sensor APS-C 24,2 MP · DIGIC X', item2: 'Hasta 23 fps electrónico · 15 fps mecánico', item3: '4K UHD sin crop (6K oversampling) · 4K 60p crop', item4: 'Dual Pixel CMOS AF II · 651 zonas · 100%×100%', item5: 'Detección IA: personas, animales, vehículos', item6: 'Pantalla articulada 3" touchscreen + EVF 2,36M puntos', item7: 'Flash pop-up · Montura Multi-función', item8: 'WiFi · Bluetooth · USB-C · Peso 429 g' } },
    ]
  },
  {
    id: 'r50-18-45',
    blocks: [
      { moduleId: 6, data: { image: 'https://asia.canon/media/image/2023/02/06/aa40086891434857aa3e5c6465f427a0_EOS+R50+Black+Front+Slant+Left.png', altImage: 'Canon EOS R50 - Mirrorless compacta ideal para vloggers y creadores de contenido', title: 'EOS R50: Entra a un Nuevo Universo', description: 'La EOS R50 es la nueva sucesora de la EOS M50 Mark II en el sistema de montura RF de Canon. Graba video en 4K 30p (sobremuestreo 6K) o Full HD a 120p con total libertad creativa. El enfoque EOS iTR AF X con Dual Pixel CMOS AF II hace que fotografiar y filmar sea siempre preciso y sin esfuerzo.' } },
      { moduleId: 3, data: { image: 'https://asia.canon/media/image/2023/02/06/f8f9e836feef45cbbf7a8741add6814c_Amazing+Vlogging+Capabilities.jpg', altImage: 'Canon EOS R50 capacidades de vlogging y video 4K con sobremuestreo 6K', title: 'Video 4K con Sobremuestreo 6K', description: 'El proceso de sobremuestreo 6K de la EOS R50 utiliza el mismo algoritmo de debayer del sistema CINEMA EOS de Canon. Obtén videos 4K con mayor claridad y menos ruido comparado con grabaciones 4K nativas. Además, graba Full HD a 120p para efectos de cámara lenta hasta 4x (reproducción a 30p).' } },
      { moduleId: 4, data: { title: 'EOS iTR AF X: Enfoque Inteligente con IA', description: 'El sistema EOS iTR AF X con Dual Pixel CMOS AF II detecta y sigue automáticamente a personas (ojos, cabeza o cuerpo), animales (perros, gatos y aves) y vehículos mientras tú te concentras en la composición. Dispara hasta 15 fps en modo electrónico silencioso con seguimiento AF/AE activo.', image: 'https://asia.canon/media/image/2023/02/06/1c97ba5a38db40e5a175a18f7def7937_EOS+R50+Black+Left.png', altImage: 'Canon EOS R50 autofocus EOS iTR AF X inteligente con detección de sujetos' } },
      { moduleId: 8, data: { youtubeCode: 'tO9ywWNfLYE', title: 'Canon EOS R50: Conoce Tu Nueva Cámara', description: 'Descubre todo lo que la EOS R50 tiene para ofrecer: video 4K (sobremuestreo 6K), Full HD 120p, grabación vertical nativa, EOS iTR AF X y un cuerpo compacto de solo 375 g. La compañera perfecta para creadores de contenido.' } },
      { moduleId: 3, data: { image: 'https://asia.canon/media/image/2023/02/06/f6a9c0d63bec4029aa20139851a32647_EOS+R50+Black+Right.png', altImage: 'Canon EOS R50 grabación vertical nativa para redes sociales', title: 'Grabación Vertical Nativa para Redes Sociales', description: 'Crea contenido vertical directamente para Instagram Reels, TikTok o YouTube Shorts sin recortes ni edición posterior. La EOS R50 graba verticalmente de forma nativa y reproduce el resultado en pantalla con la orientación correcta. El Marcador de Aspecto guía tu encuadre en tiempo real para distintos formatos.' } },
      { moduleId: 4, data: { title: 'Estabilización IS Coordinada de 5 Ejes', description: 'El Movie Digital IS de 5 ejes reduce el movimiento de la cámara incluso sin lente con estabilización óptica. Combinado con un lente RF IS, el control coordinado potencia aún más la estabilización para tomas a mano alzada perfectamente fluidas durante tus vlogs o transmisiones en vivo.', image: 'https://asia.canon/media/image/2023/02/06/6522b1a3cd514eea8bcaa204e9a478d9_EOS+R50+Black+Back.png', altImage: 'Canon EOS R50 pantalla articulada Vari-angle y controles intuitivos' } },
      { moduleId: 7, data: { leftImage: 'https://asia.canon/media/image/2023/02/06/5ac85b8dc2ce4861b8c2d4883084004e_EOS+R50+Black+Top.png', leftAlt: 'Canon EOS R50 pantalla articulada Vari-angle 3" y EVF integrado', leftTitle: 'Pantalla Vari-angle + EVF', leftText: 'Pantalla táctil articulada de 3,0" con 1,62M puntos para disparar desde cualquier ángulo. Visor electrónico integrado para composición precisa con luz directa. Interfaz táctil similar a la de un smartphone.', rightImage: 'https://asia.canon/media/image/2023/02/06/6e1bcdc4406c408dae862c4165ea5a45_EOS+R50+White+Front+Slant+Left.png', rightAlt: 'Canon EOS R50 blanca disponible en dos colores negro y blanco', rightTitle: 'Streaming USB-C + Dos Colores', rightText: 'Conéctala a tu PC con USB-C para usarla como webcam de alta calidad sin necesidad de capturadora. Disponible en Negro y Blanco. Compatible con accesorios Multi-Function Shoe como micrófonos DM-E1D.' } },
      { moduleId: 5, data: { title: 'Especificaciones Destacadas', item1: 'Sensor APS-C 24,2 MP · DIGIC X · ISO 100–51.200', item2: 'Video 4K 30p (6K oversampling) · Full HD 120p', item3: 'Hasta 15 fps electrónico · AF/AE tracking', item4: 'EOS iTR AF X + Dual Pixel CMOS AF II', item5: 'Grabación vertical nativa · Marcador de aspecto', item6: 'Pantalla articulada 3" 1,62M puntos + EVF', item7: 'Live Streaming USB-C · Flash integrado GN6', item8: 'WiFi · Bluetooth · Peso 375 g · Negro o Blanco' } },
    ]
  },
  {
    id: 'eos-rp',
    blocks: [
      { moduleId: 6, data: { image: 'https://asia.canon/media/image/2026/01/16/8e793fa0a9ac488dbf0e791c8010475b_EOS+RP+w+RF24-105mm+F4-7.1+IS+STM+Front+Slant+Ori_362x320.png', altImage: 'Canon EOS RP con lente RF 24-105mm - La mirrorless full frame más ligera de Canon', title: 'EOS RP: Fotografía Full Frame Para Todos', description: 'Da el salto a la fotografía Full Frame con una de las cámaras mirrorless más ligeras de Canon. La EOS RP integra un sensor CMOS de 26,2 MP y un autoenfoque ultrarrápido de 0,05 segundos en un cuerpo compacto hecho para creadores en movimiento. Con Dual Pixel CMOS AF y Eye Detection AF, cada retrato queda perfectamente enfocado.' } },
      { moduleId: 3, data: { image: 'https://asia.canon/media/image/2026/01/14/870cde46c4344796b8521c09a4e929e0_1_K433_FrontSlantDown_Body_362x320.png', altImage: 'Canon EOS RP sensor Full Frame 26.2 megapíxeles CMOS calidad profesional', title: 'Sensor Full Frame de 26,2 MP', description: 'El sensor Full Frame es 2,6 veces más grande que un sensor APS-C, lo que entrega una menor profundidad de campo y fondos desenfocados artísticamente (bokeh). La EOS RP captura cada detalle con 26,2 megapíxeles y un rango dinámico amplio, produciendo imágenes con una calidad que antes solo estaba al alcance de equipos profesionales de mayor tamaño.' } },
      { moduleId: 4, data: { title: 'Dual Pixel CMOS AF: 0,05 s hasta EV -5', description: 'El Dual Pixel CMOS AF es el sistema de autoenfoque más rápido de Canon, alcanzando el foco en tan solo 0,05 segundos. Cubre aproximadamente el 100% vertical × 88% horizontal con 4.779 puntos de enfoque seleccionables. Enfoca con precisión incluso en oscuridad casi total hasta EV -5, donde el ojo humano apenas distingue formas.', image: 'https://asia.canon/media/image/2026/01/14/e71d01bf7aa64023a5c852887b961078_2_K433_FrontSlantLeft_Body_362x320.png', altImage: 'Canon EOS RP Dual Pixel CMOS AF velocidad 0.05 segundos autoenfoque' } },
      { moduleId: 3, data: { image: 'https://asia.canon/media/image/2026/01/15/5391f2e343c84aec82ddd2f89aca1cf2_eosrp-prodes-feature-02.jpg', altImage: 'Canon EOS RP con montaje RF calidad óptica superior lentes profesionales', title: 'Montaje RF: Óptica de Nueva Generación', description: 'La montura RF de 54 mm de gran diámetro y la corta distancia de brida de 20 mm, combinadas con comunicación de datos de alta velocidad, liberan todo el potencial de los objetivos RF en un cuerpo compacto y ligero. Accede al ecosistema más avanzado de lentes full frame de Canon para fotografía y video de altísima calidad.' } },
      { moduleId: 4, data: { title: 'Eye Detection AF en Fotos y Video', description: 'El Eye Detection AF rastrea y mantiene el enfoque en el ojo del sujeto durante cualquier movimiento, tanto en fotografías como en video 4K UHD. Ideal para retratos, bodas, sesiones de moda y cualquier situación donde necesites que los ojos queden perfectamente nítidos sin esfuerzo.', image: 'https://asia.canon/media/image/2026/01/14/a25d5248c811470a83eff491568c3773_3_K433_The+Front_Body_362x320.png', altImage: 'Canon EOS RP Eye Detection AF enfoque en ojos retratos automático' } },
      { moduleId: 7, data: { leftImage: 'https://asia.canon/media/image/2026/01/14/7ede278fc52a4733ba7d86f00b3e436f_8_K433_Back_Body_362x320.png', leftAlt: 'Canon EOS RP pantalla Vari-angle articulada touchscreen EVF integrado', leftTitle: 'Pantalla Vari-angle Táctil + EVF', leftText: 'Pantalla LCD articulada Vari-angle de 3" con 1,04M puntos para composición desde cualquier ángulo. EVF integrado de 0,39" con 2,36M puntos y punto de ojo de 22 mm para mayor comodidad.', rightImage: 'https://asia.canon/media/image/2026/01/14/0eab6ceb7c57470fa3aae6e5d5407cdb_6_K433_TOP_Body_362x320.png', rightAlt: 'Canon EOS RP diseño compacto ligero 440g cuerpo full frame', rightTitle: 'Full Frame Liviana: Solo 440 g', rightText: 'Con apenas 440 g, la EOS RP es una cámara Full Frame ideal para viajar y fotografiar todo el día sin cansancio. El Modo Silencioso permite disparar sin ningún sonido del obturador, perfecto para ceremonias, teatros y entornos sensibles al ruido.' } },
      { moduleId: 3, data: { image: 'https://asia.canon/media/image/2026/01/14/3110a1929d314520b6c882bdb51467ba_4_K433_Right_Body_362x320.png', altImage: 'Canon EOS RP video 4K UHD conectividad WiFi Bluetooth USB', title: 'Video 4K UHD + Conectividad Completa', description: 'Captura video 4K UHD con la calidad óptica del sistema RF. Modos creativos accesibles gracias al Asistente Creativo integrado: aprende y experimenta mientras disparas. WiFi y Bluetooth para sincronización inmediata con smartphone vía Canon Camera Connect. USB para transferencia rápida de archivos.' } },
      { moduleId: 8, data: { youtubeCode: 'HU24kemhmms', title: 'Canon EOS RP: Full Frame Para Todos', description: 'Descubre por qué la EOS RP es la puerta de entrada perfecta a la fotografía Full Frame. Sensor de 26,2 MP, autoenfoque Dual Pixel a 0,05 s, Eye Detection AF y solo 440 g. El sistema RF de Canon en un cuerpo compacto e intuitivo.' } },
      { moduleId: 5, data: { title: 'Especificaciones Destacadas', item1: 'Sensor Full Frame CMOS 26,2 MP', item2: 'Dual Pixel CMOS AF · 0,05 s · EV -5 · 4.779 puntos', item3: 'Eye Detection AF en fotos y video', item4: 'Video 4K UHD · Modo Silencioso', item5: 'Pantalla Vari-angle 3" 1,04M puntos touchscreen', item6: 'EVF integrado 0,39" 2,36M puntos', item7: 'Montura RF · Asistente Creativo', item8: 'WiFi · Bluetooth · USB · Peso 440 g' } },
    ]
  },
];

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Seeding campaign products into inpage_blocks...\n');

  for (const product of PRODUCTS) {
    console.log(`📦 ${product.id}: ${product.blocks.length} blocks`);

    // 1. Verificar que el producto exista en la tabla products
    const { data: existing, error: checkErr } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', product.id)
      .single();

    if (checkErr) {
      console.log(`   ⚠️  Product "${product.id}" not found in products table, skipping.`);
      continue;
    }
    console.log(`   ✓ Found product: ${existing.name}`);

    // 2. Borrar bloques previos (por si se corre de nuevo)
    const { error: delErr } = await supabase
      .from('inpage_blocks')
      .delete()
      .eq('product_id', product.id);

    if (delErr) {
      console.error(`   ❌ Error deleting old blocks:`, delErr.message);
      continue;
    }

    // 3. Insertar bloques
    const rows = product.blocks.map((block, index) => ({
      product_id: product.id,
      block_order: index + 1,
      module_id: block.moduleId,
      block_data: block.data,
    }));

    const { error: insErr } = await supabase
      .from('inpage_blocks')
      .insert(rows);

    if (insErr) {
      console.error(`   ❌ Error inserting blocks:`, insErr.message);
      continue;
    }

    console.log(`   ✅ ${rows.length} blocks inserted`);
  }

  // 4. Verificar conteo final
  console.log('\n📊 Verification:');
  for (const product of PRODUCTS) {
    const { count } = await supabase
      .from('inpage_blocks')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', product.id);
    console.log(`   ${product.id}: ${count} blocks`);
  }

  console.log('\n✅ Done!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
