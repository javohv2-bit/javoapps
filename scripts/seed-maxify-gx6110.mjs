/**
 * Seed MAXIFY GX6110 - Crea el producto e inserta todos los bloques del InPage
 *
 * Fuente: https://www.cla.canon.com/en/p/maxify-gx6110
 * Video:  https://www.youtube.com/watch?v=et9SAJSnmhU
 *
 * Ejecutar con:
 *   node scripts/seed-maxify-gx6110.mjs
 *
 * Nota: el SKU usado es el código Canon US (6882C002). Si se requiere el SKU
 * de Falabella, actualizarlo desde el editor o re-ejecutar el script con el
 * valor correcto.
 */
import { createClient } from '@supabase/supabase-js';

const s = createClient(
  'https://bupnqihroawrvcvzpbqv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo'
);

const PRODUCT_ID = 'maxify-gx6110';
const PRODUCT_SKU = '6882C002';

// Imágenes oficiales Canon (Scene7 CDN)
const IMG = {
  hero:       'https://s7d1.scene7.com/is/image/canon/6882C002AA_GX6120_3?wid=1160',
  front:      'https://s7d1.scene7.com/is/image/canon/6882C002AA_GX6120_3?wid=560',
  threeQtr:   'https://s7d1.scene7.com/is/image/canon/6882C002AA_GX6120_4?wid=560',
  rear:       'https://s7d1.scene7.com/is/image/canon/6882C002AA_GX6120_5?wid=560',
  detail:     'https://s7d1.scene7.com/is/image/canon/6882C002AA_GX6120_6?wid=560',
  banner:     'https://s7d1.scene7.com/is/image/canon/6882C002AA_GX6120_3?wid=1160&hei=360',
};

async function main() {
  // 1. Crear / actualizar producto
  const { data, error } = await s.from('products').upsert({
    id: PRODUCT_ID,
    name: 'MAXIFY GX6110',
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
        altImage: 'Canon MAXIFY GX6110 MegaTank - Impresora multifuncional inalambrica para oficina',
        title: 'MAXIFY GX6110: Alta Productividad En Un Diseno Compacto',
        description: 'La MAXIFY GX6110 es la multifuncional ideal para oficinas pequenas que necesitan alto volumen de impresion a bajo costo. Imprime hasta 6.000 paginas en blanco y negro y 14.000 en color con un unico set de tintas GI-26, con impresion, copia y escaneo a color, conectividad inalambrica y una capacidad combinada de 350 hojas en un gabinete compacto.'
      }
    },

    // 1. Imagen izquierda + texto - MegaTank
    {
      moduleId: 3,
      data: {
        image: IMG.front,
        altImage: 'Canon MAXIFY GX6110 sistema MegaTank tintas pigmentadas GI-26 bajo costo pagina',
        title: 'MegaTank: Hasta 14.000 Paginas A Color',
        description: 'El sistema MegaTank con 4 tintas pigmentadas GI-26 entrega hasta 6.000 paginas en blanco y negro y 14.000 a color con un solo juego de botellas. Las botellas tienen un diseno con boquilla "keyed" que solo encaja en el tanque del color correcto, evitando errores al recargar.'
      }
    },

    // 2. Texto + imagen derecha - Velocidad y duplex
    {
      moduleId: 4,
      data: {
        title: 'Velocidad: 15,5 ipm B/N - 10,5 ipm Color + Duplex Automatico',
        description: 'Alcanza hasta 15,5 imagenes por minuto en blanco y negro y 10,5 en color. Incluye impresion automatica a doble cara (duplex) para reducir el consumo de papel y acelerar proyectos largos. Ciclo de trabajo mensual de hasta 45.000 paginas.',
        image: IMG.threeQtr,
        altImage: 'Canon MAXIFY GX6110 impresion duplex automatica 15.5 ipm ciclo 45000 paginas'
      }
    },

    // 3. Imagen izquierda + texto - ADF
    {
      moduleId: 3,
      data: {
        image: IMG.rear,
        altImage: 'Canon MAXIFY GX6110 alimentador automatico ADF 50 hojas copia escaneo',
        title: 'ADF de 50 Hojas: Imprime, Copia y Escanea',
        description: 'Copia y escanea documentos multipagina sin esfuerzo con el alimentador automatico de 50 hojas. Perfecto para oficinas que digitalizan contratos, facturas o informes de manera regular.'
      }
    },

    // 4. Texto + imagen derecha - Capacidad papel
    {
      moduleId: 4,
      data: {
        title: 'Cassette Inferior de 250 Hojas + Bandeja Trasera',
        description: 'Carga hasta 250 hojas de papel comun en el cassette inferior, mas una bandeja trasera multiproposito de 100 hojas para sobres, tarjetas de presentacion, papel de alta resolucion y banners. Disenada para ocupar poco espacio en tu escritorio.',
        image: IMG.detail,
        altImage: 'Canon MAXIFY GX6110 cassette 250 hojas bandeja trasera capacidad 350 hojas'
      }
    },

    // 5. Dos imagenes con texto - Pantalla touch + conectividad
    {
      moduleId: 7,
      data: {
        leftImage: IMG.threeQtr,
        leftAlt: 'Canon MAXIFY GX6110 pantalla tactil LCD 2.7 pulgadas color menus intuitivos',
        leftTitle: 'Pantalla Tactil LCD de 2,7"',
        leftText: 'Opera todas las funciones de impresion, copia y escaneo con una pantalla tactil a color de 2,7 pulgadas. Menus intuitivos, sin necesidad de computadora para la configuracion inicial.',
        rightImage: IMG.rear,
        rightAlt: 'Canon MAXIFY GX6110 WiFi impresion movil Canon PRINT AirPrint Mopria nube',
        rightTitle: 'Wi-Fi + Impresion Movil y en la Nube',
        rightText: 'Imprime desde tu celular o tablet con Canon PRINT, Apple AirPrint y Mopria Print Service. Wi-Fi (2,4 y 5 GHz), Ethernet y USB para integrarse a cualquier red de oficina.'
      }
    },

    // 6. Video + texto
    {
      moduleId: 8,
      data: {
        youtubeCode: 'et9SAJSnmhU',
        title: 'MAXIFY GX6110: Potencia Tu Oficina',
        description: 'Descubre como la MAXIFY GX6110 combina alto rendimiento, bajo costo por pagina y un diseno compacto ideal para oficinas modernas.'
      }
    },

    // 7. Texto en dos columnas - Que incluye + compatibilidad
    {
      moduleId: 2,
      data: {
        title: 'Que Incluye y Compatibilidad',
        col1Text: 'En la caja\n\n• Impresora MAXIFY GX6110\n• Set completo de botellas GI-26 (C/M/Y/BK)\n• Cable de alimentacion\n• Guia rapida de instalacion\n• Acceso a drivers Windows / macOS',
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
        item5: 'ADF 50 hojas - Copia y Escaneo a color',
        item6: 'Capacidad 350 hojas (250 cassette + 100 trasera)',
        item7: 'Pantalla tactil LCD 2,7 pulgadas a color',
        item8: 'Wi-Fi 2.4/5 GHz - Ethernet - USB - AirPrint - Mopria'
      }
    },

    // 9. Banner principal sin texto - cierre
    {
      moduleId: 1,
      data: {
        image: IMG.hero,
        altImage: 'Canon MAXIFY GX6110 MegaTank impresora compacta oficina alto rendimiento'
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
