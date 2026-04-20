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

async function testSlugLookup(identifier) {
    console.log(`\n=== Buscando: "${identifier}" ===\n`);
    
    // Obtener TODOS los bloques para extraer product_ids únicos (sin limit)
    const { data: allBlocks } = await supabase
        .from('brochure_product_blocks')
        .select('product_id');
    
    const productIdsWithBlocks = new Set((allBlocks || []).map(b => b.product_id));
    console.log('IDs con bloques:', [...productIdsWithBlocks]);
    
    // Buscar todos los productos
    const { data: allProducts } = await supabase
        .from('brochure_products')
        .select('*');
    
    if (allProducts) {
        // Primero buscar entre productos CON bloques
        const productsWithBlocksFiltered = allProducts.filter(p => productIdsWithBlocks.has(p.id));
        console.log('\nProductos filtrados con bloques:', productsWithBlocksFiltered.length);
        
        console.log('\nBuscando coincidencia en productos con bloques:');
        productsWithBlocksFiltered.forEach(p => {
            const productSlug = generateSlug(p.name);
            const matches = productSlug === identifier.toLowerCase();
            if (matches) {
                console.log(`  ✓ MATCH: ${p.name} -> slug="${productSlug}"`);
            }
        });
        
        const matchedWithBlocks = productsWithBlocksFiltered.find(p => {
            const productSlug = generateSlug(p.name);
            return productSlug === identifier.toLowerCase();
        });
        
        if (matchedWithBlocks) {
            console.log('\n✓ ENCONTRADO con bloques:', matchedWithBlocks.name);
            return matchedWithBlocks;
        }
        
        console.log('\n✗ No hay coincidencia en productos con bloques');
        
        // Si no hay coincidencia con bloques, buscar en todos los productos
        console.log('\nBuscando en TODOS los productos:');
        allProducts.forEach(p => {
            const productSlug = generateSlug(p.name);
            const matches = productSlug === identifier.toLowerCase();
            if (matches) {
                const hasBlocks = productIdsWithBlocks.has(p.id);
                console.log(`  ${hasBlocks ? '✓' : '✗'} ${p.name} -> slug="${productSlug}" ${hasBlocks ? '(TIENE BLOQUES)' : '(sin bloques)'}`);
            }
        });
        
        const matchedProduct = allProducts.find(p => {
            const productSlug = generateSlug(p.name);
            return productSlug === identifier.toLowerCase();
        });
        
        if (matchedProduct) {
            console.log('\nEncontrado (sin priorizar bloques):', matchedProduct.name);
            return matchedProduct;
        }
    }
    
    return null;
}

async function main() {
    await testSlugLookup('eos-r5');
    await testSlugLookup('eos-r8');
    await testSlugLookup('eos-r10');
}

main().catch(console.error);
