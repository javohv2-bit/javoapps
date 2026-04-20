/**
 * Seed MAXIFY GX7110 - Crea el producto e inserta todos los bloques del InPage
 *
 * Fuente: https://www.cla.canon.com/en/p/maxify-gx7110
 * Video:  https://www.youtube.com/watch?v=KXUWOYAdkl0
 *
 * Ejecutar con:
 *   node scripts/seed-maxify-gx7110.mjs
 *
 * Nota: el SKU usado es el código Canon US (6880C002). Si se requiere el SKU
 * de Falabella, actualizarlo desde el editor o re-ejecutar el script con el
 * valor correcto.
 */
import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://bupnqihroawrvcvzpbqv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo'
);

const PRODUCT_ID = 'maxify-gx7110';
const PRODUCT_SKU = '6880C002';

// Imágenes oficiales Canon (Scene7 CDN - mismas fotos que usa canon.com)
const IMG = {
  hero:       'https://s7d1.scene7.com/is/image/canon/6880C002AA_GX7120_3?wid=1160',
  front:      'https://s7d1.scene7.com/is/image/canon/6880C002AA_GX7120_3?wid=560',
  threeQtr:   'https://s7d1.scene7.com/is/image/canon/6880C002AA_GX7120_4?wid=560',
  rear:       'https://s7d1.scene7.com/is/image/canon/6880C002AA_GX7120_5?wid=560',
  detail:     'https://s7d1.scene7.com/is/image/canon/6880C002AA_GX7120_6?wid=560',
  banner:     'https://s7d1.scene7.com/is/image/canon/6880C002AA_GX7120_3?wid=1160&hei=360',
};

async function main() {
  // 1. Crear / actualizar producto
  const { data, error } = await s.from('products').upsert({
    id: PRODUCT_ID,
    name: 'MAXIFY GX7110',
    sku: PRODUCT_SKU,
    category: 'Printers',
    image_folder: PRODUCT_ID,
    is_template: false,
  }).select().single();

  if (error) { console.error('Product error:', error.message); process.exit(1); }
  console.log('Product upserted:', data.id, '-', data.name);

  // 2. Limpiar bloques previos
  await s.from('inpage_blocks').delete().eq('product_id', PRODUCT_ID);

  // 3. Definir bloques (formato Falabella v8 - variado)
  const blocks = [
    // 0. Banner grande + texto (hero)
    {
      moduleId: 6,
      data: {
        image: IMG.hero,
        altImage: 'Canon MAXIFY GX7110 MegaTank - Impresora multifuncional inalambrica para oficina',
        title: 'MAXIFY GX7110: Productividad Sin Limites Para Tu Oficina',
        description: 'Disenada para pequenas oficinas que buscan impresion de alta calidad a bajo costo. La MAXIFY GX7110 entrega hasta 6.000 paginas en blanco y negro y 14.000 en color con un solo juego de tintas GI-26, gracias a su sistema MegaTank recargable. Imprime, copia, escanea y envia fax con conectividad inalambrica completa y una capacidad combinada de 600 hojas.'
      }
    },

    // 1. Imagen izquierda + texto - Rendimiento de tintas
    {
      moduleId: 3,
      data: {
        image: IMG.front,
        altImage: 'Canon MAXIFY GX7110 sistema MegaTank 6000 paginas negro 14000 color GI-26',
        title: 'Sistema MegaTank Recargable GI-26',
        description: 'Imprime hasta 6.000 paginas en blanco y negro y 14.000 en color con un solo set de botellas de tinta. El sistema de 4 tintas pigmentadas entrega texto nitido, resistente al marcador fluorescente y al agua, ideal para documentos de oficina que deben durar.'
      }
    },

    // 2. Texto + imagen derecha - Velocidad
    {
      moduleId: 4,
      data: {
        title: 'Velocidad Profesional: 15,5 ipm B/N y 10,5 ipm Color',
        description: 'Obten impresiones rapidas sin sacrificar calidad. La MAXIFY GX7110 alcanza hasta 15,5 imagenes por minuto en blanco y negro y 10,5 en color con impresion automatica a doble cara (duplex) para ahorrar papel y tiempo en tareas largas.',
        image: IMG.threeQtr,
        altImage: 'Canon MAXIFY GX7110 velocidad 15.5 ipm impresion duplex automatica'
      }
    },

    // 3. Imagen izquierda + texto - ADF y funciones
    {
      moduleId: 3,
      data: {
        image: IMG.rear,
        altImage: 'Canon MAXIFY GX7110 alimentador automatico 50 hojas ADF copia fax escaneo',
        title: 'ADF de 50 Hojas: Imprime, Copia, Escanea y Envia Fax',
        description: 'El alimentador automatico de documentos (ADF) de 50 hojas agiliza la copia y el escaneo de documentos multipagina. Suma funciones completas de fax y escaneo en color para convertir cualquier oficina en un centro de produccion documental sin perder espacio.'
      }
    },

    // 4. Texto + imagen derecha - Doble cassette
    {
      moduleId: 4,
      data: {
        title: 'Dos Cassettes de 250 Hojas + Bandeja Trasera',
        description: 'La GX7110 incluye dos cassettes inferiores de 250 hojas cada uno, sumando 500 hojas de papel comun, mas una bandeja trasera multiproposito para sobres, tarjetas de presentacion, papel de alta resolucion y banners. Menos recargas, mas produccion.',
        image: IMG.detail,
        altImage: 'Canon MAXIFY GX7110 doble cassette 250 hojas capacidad 600 hojas papel'
      }
    },

    // 5. Dos imagenes con texto - Pantalla touch + conectividad
    {
      moduleId: 7,
      data: {
        leftImage: IMG.threeQtr,
        leftAlt: 'Canon MAXIFY GX7110 pantalla tactil LCD 2.7 pulgadas intuitiva',
        leftTitle: 'Pantalla Tactil LCD de 2,7"',
        leftText: 'Pantalla tactil a color de 2,7 pulgadas con menus intuitivos para operar todas las funciones de manera rapida y simple, sin necesidad de un computador.',
        rightImage: IMG.rear,
        rightAlt: 'Canon MAXIFY GX7110 WiFi Ethernet impresion movil Canon PRINT AirPrint Mopria',
        rightTitle: 'Conectividad Wi-Fi, Ethernet y Movil',
        rightText: 'Imprime y escanea desde tu celular o tablet con la app Canon PRINT, Apple AirPrint y Mopria Print Service. Soporta Wi-Fi (2,4 y 5 GHz), Ethernet y USB para integrar la impresora a cualquier flujo de trabajo.'
      }
    },

    // 6. Video + texto
    {
      moduleId: 8,
      data: {
        youtubeCode: 'KXUWOYAdkl0',
        title: 'Conoce la Serie MAXIFY GX en Accion',
        description: 'Descubre como la MAXIFY GX7110 transforma la productividad de tu oficina con alto rendimiento, bajo costo por pagina y conectividad completa.'
      }
    },

    // 7. Texto en dos columnas - Incluye + compatibilidad tintas
    {
      moduleId: 2,
      data: {
        title: 'Que Incluye y Compatibilidad',
        col1Text: 'En la caja\n\n• Impresora MAXIFY GX7110\n• Set completo de botellas GI-26 (C/M/Y/BK)\n• Cable de alimentacion\n• Cable telefonico para fax\n• Guia rapida de instalacion\n• CD-ROM / Acceso a drivers online',
        col2Text: 'Compatibilidad de tintas\n\n• GI-26 PGBK (Negro pigmentado)\n• GI-26 C (Cyan)\n• GI-26 M (Magenta)\n• GI-26 Y (Amarillo)\n\nCompatible con toda la serie MAXIFY GX (GX6110, GX7110)'
      }
    },

    // 8. Lista en dos columnas - Especificaciones destacadas
    {
      moduleId: 5,
      data: {
        title: 'Especificaciones Destacadas',
        item1: 'Sistema MegaTank - 4 tintas pigmentadas GI-26',
        item2: 'Rendimiento: 6.000 pag B/N - 14.000 pag Color',
        item3: 'Velocidad: 15,5 ipm B/N - 10,5 ipm Color',
        item4: 'Impresion automatica a doble cara (duplex)',
        item5: 'ADF 50 hojas - Copia, Escanea, Fax',
        item6: 'Capacidad 600 hojas (2x 250 + bandeja trasera)',
        item7: 'Pantalla tactil LCD 2,7 pulgadas a color',
        item8: 'Wi-Fi 2.4/5 GHz - Ethernet - USB - AirPrint - Mopria'
      }
    },

    // 9. Banner principal sin texto - cierre
    {
      moduleId: 1,
      data: {
        image: IMG.hero,
        altImage: 'Canon MAXIFY GX7110 MegaTank impresora oficina alta productividad bajo costo'
      }
    },
  ];

  // 4. Insertar bloques
  const rows = blocks.map((b, i) => ({
    product_id: PRODUCT_ID,
    block_order: i + 1,
    module_id: b.moduleId,
    block_data: b.data,
  }));

  const { error: insErr } = await s.from('inpage_blocks').insert(rows);
  if (insErr) { console.error('Block insert error:', insErr.message); process.exit(1); }
  console.log(rows.length + ' bloques insertados para ' + PRODUCT_ID);

  // 5. Verificacion
  const { count } = await s.from('inpage_blocks').select('*', { count: 'exact', head: true }).eq('product_id', PRODUCT_ID);
  console.log('Verificacion: ' + PRODUCT_ID + ' tiene ' + count + ' bloques');
  console.log('Ver en: http://localhost:5173/inpage-maker');
}

main().catch(e => { console.error(e); process.exit(1); });
