/**
 * Utilidad para encontrar el product_id correcto
 * 
 * Uso:
 *   node scripts/find-product.mjs [slug]
 * 
 * Ejemplos:
 *   node scripts/find-product.mjs eos-r1
 *   node scripts/find-product.mjs eos-r6-mark-ii
 *   node scripts/find-product.mjs powershot-pick
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bupnqihroawrvcvzpbqv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo'
);

/**
 * Genera slug desde el nombre del producto
 * IMPORTANTE: Esta función debe coincidir EXACTAMENTE con la de productDetailDB.js
 */
const generateSlug = (name) => {
  if (!name) return null;
  
  const patterns = [
    /^(EOS\s+R\d+\s+MARK\s+[IVX]+)/i,  // EOS R6 MARK II
    /^(EOS\s+R\d+\s+V)\b/i,             // EOS R5 V
    /^(EOS\s+R\d+)/i,                   // EOS R1, EOS R5, EOS R50
    /^(EOS\s+REBEL\s+T\d+)/i,           // EOS REBEL T100
    /^(EOS\s+RP)\b/i,                   // EOS RP
    /^(POWERSHOT\s+[A-Z]+)/i,           // POWERSHOT PICK
  ];
  
  for (const pattern of patterns) {
    const match = name.toUpperCase().match(pattern);
    if (match) {
      return match[1].toLowerCase().replace(/\s+/g, '-');
    }
  }
  
  // Fallback: nombre completo como slug
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

async function findProduct() {
  const targetSlug = process.argv[2];
  
  console.log('\n🔍 Canon Product Finder\n');
  console.log('─'.repeat(60));
  
  // Obtener productos y bloques
  const { data: products, error: prodError } = await supabase
    .from('brochure_products')
    .select('id, name');
  
  if (prodError) {
    console.error('❌ Error fetching products:', prodError);
    return;
  }
  
  const { data: blocks } = await supabase
    .from('brochure_product_blocks')
    .select('product_id');
  
  const productIdsWithBlocks = new Set((blocks || []).map(b => b.product_id));
  
  // Si se especificó un slug, buscar solo ese
  if (targetSlug) {
    console.log(`\n🎯 Buscando producto para slug: "${targetSlug}"\n`);
    
    const matches = products.filter(p => generateSlug(p.name) === targetSlug);
    
    if (matches.length === 0) {
      console.log('❌ No se encontró ningún producto que genere ese slug.\n');
      console.log('Slugs disponibles:');
      const uniqueSlugs = [...new Set(products.map(p => generateSlug(p.name)))].sort();
      uniqueSlugs.slice(0, 20).forEach(s => console.log('  -', s));
      if (uniqueSlugs.length > 20) console.log(`  ... y ${uniqueSlugs.length - 20} más`);
    } else {
      matches.forEach(p => {
        const hasBlocks = productIdsWithBlocks.has(p.id);
        const blockCount = blocks?.filter(b => b.product_id === p.id).length || 0;
        
        console.log(`✅ ENCONTRADO: ${p.name}`);
        console.log(`   ID: ${p.id}`);
        console.log(`   Has Blocks: ${hasBlocks ? `Sí (${blockCount})` : 'No'}`);
        console.log('');
        console.log('   👆 Copia este ID para tu seed script:');
        console.log(`   const TARGET_PRODUCT_ID = '${p.id}';`);
        console.log('');
      });
      
      if (matches.length > 1) {
        console.log('⚠️  ATENCIÓN: Hay múltiples productos que generan este slug.');
        console.log('   El sistema prioriza productos CON bloques.');
        const withBlocks = matches.filter(p => productIdsWithBlocks.has(p.id));
        if (withBlocks.length > 0) {
          console.log(`   → Usa: ${withBlocks[0].id} (${withBlocks[0].name})`);
        }
      }
    }
  } else {
    // Sin slug especificado, mostrar todos los productos con bloques
    console.log('\n📋 Productos con bloques:\n');
    
    const productsWithBlocks = products.filter(p => productIdsWithBlocks.has(p.id));
    
    if (productsWithBlocks.length === 0) {
      console.log('   No hay productos con bloques.');
    } else {
      productsWithBlocks.forEach(p => {
        const slug = generateSlug(p.name);
        const blockCount = blocks?.filter(b => b.product_id === p.id).length || 0;
        console.log(`   ${slug.padEnd(25)} → ${p.name} (${blockCount} blocks)`);
        console.log(`   ${''.padEnd(25)}   ID: ${p.id}`);
        console.log('');
      });
    }
    
    console.log('\n💡 Uso: node scripts/find-product.mjs [slug]');
    console.log('   Ejemplo: node scripts/find-product.mjs eos-r1\n');
  }
  
  console.log('─'.repeat(60));
}

findProduct().catch(console.error);
