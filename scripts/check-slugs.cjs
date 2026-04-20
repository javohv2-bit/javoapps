const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://bupnqihroawrvcvzpbqv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo'
);

function generateSlug(name) {
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
}

async function check() {
    // Obtener productos con bloques
    const { data: blocks } = await supabase.from('brochure_product_blocks').select('product_id');
    const productIdsWithBlocks = [...new Set(blocks.map(b => b.product_id))];
    
    console.log('Product IDs con bloques:', productIdsWithBlocks);
    console.log('\n');
    
    // Obtener info de esos productos
    const { data: products } = await supabase.from('brochure_products').select('id, name').in('id', productIdsWithBlocks);
    
    console.log('Productos con bloques:');
    products.forEach(p => {
        const slug = generateSlug(p.name);
        console.log(`  ${slug} -> ${p.name} (${p.id})`);
    });
    
    // Verificar qué productos existen con eos-r5 y eos-r8
    console.log('\n\nProductos que matchean "eos-r5":');
    const { data: allProducts } = await supabase.from('brochure_products').select('id, name');
    allProducts.filter(p => generateSlug(p.name) === 'eos-r5').forEach(p => {
        const hasBlocks = productIdsWithBlocks.includes(p.id);
        console.log(`  ${p.name} (${p.id}) - ${hasBlocks ? 'TIENE BLOQUES' : 'SIN bloques'}`);
    });
    
    console.log('\nProductos que matchean "eos-r8":');
    allProducts.filter(p => generateSlug(p.name) === 'eos-r8').forEach(p => {
        const hasBlocks = productIdsWithBlocks.includes(p.id);
        console.log(`  ${p.name} (${p.id}) - ${hasBlocks ? 'TIENE BLOQUES' : 'SIN bloques'}`);
    });
}

check().catch(console.error);
