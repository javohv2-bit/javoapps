import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bupnqihroawrvcvzpbqv.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo'
);

const generateSlug = (name) => {
  if (!name) return null;
  const patterns = [
    /^(EOS\s+R\d+\s+MARK\s+[IVX]+)/i,
    /^(EOS\s+R\d+\s+V)\b/i,
    /^(EOS\s+R\d+)/i,
    /^(EOS\s+REBEL\s+T\d+)/i,
    /^(EOS\s+RP)\b/i,
    /^(POWERSHOT\s+[A-Z]\d+)/i,
  ];
  for (const pattern of patterns) {
    const match = name.toUpperCase().match(pattern);
    if (match) return match[1].toLowerCase().replace(/\s+/g, '-');
  }
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

async function main() {
  // Obtener todos los productos
  const { data: products } = await supabase.from('brochure_products').select('id, name');
  const { data: blocks } = await supabase.from('brochure_product_blocks').select('product_id');
  
  const productIdsWithBlocks = new Set(blocks.map(b => b.product_id));
  
  // Buscar productos que generan slug 'eos-r1'
  const r1Products = products.filter(p => generateSlug(p.name) === 'eos-r1');
  console.log('\nProductos que generan slug eos-r1:');
  r1Products.forEach(p => {
    const hasBlocks = productIdsWithBlocks.has(p.id);
    console.log(' -', p.id, '|', p.name, '| HAS BLOCKS:', hasBlocks);
  });
  
  // Ver los product_ids únicos en bloques que contienen 'r1'
  console.log('\n\nProduct IDs con bloques que son R1:');
  const r1Ids = ['3cec2a42-82ff-4b79-86a3-927017cf0ee3', '8bfe189e-0670-480c-8c41-25539bc26c11'];
  for (const id of r1Ids) {
    const product = products.find(p => p.id === id);
    const blockCount = blocks.filter(b => b.product_id === id).length;
    console.log(' -', id, '|', product?.name || 'NO ENCONTRADO EN brochure_products', '| Blocks:', blockCount);
  }
}

main();
