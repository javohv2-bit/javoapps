import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials (from .env)
const supabaseUrl = 'https://vqvfmdhjqgrbwgxsswmj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxdmZtZGhqcWdyYndneHNzd21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMDA1NDcsImV4cCI6MjA1MTY3NjU0N30.9kM3kYo-VVfaYWiZdFWgV7L8_pUIEW93Pq2LhNBJ4vY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
    // Get all marcajes_products
    const { data: marcajesData, error: error1 } = await supabase
        .from('marcajes_products')
        .select('*');

    // Get all products
    const { data: productsData, error: error2 } = await supabase
        .from('products')
        .select('*');

    console.log('\n📊 Product Database Comparison:');
    console.log('================================');
    console.log(`marcajes_products: ${marcajesData?.length || 0} productos`);
    console.log(`products table:    ${productsData?.length || 0} productos`);
    console.log(`Diferencia:        ${Math.abs((marcajesData?.length || 0) - (productsData?.length || 0))} productos`);
    
    if ((marcajesData?.length || 0) > (productsData?.length || 0)) {
        console.log('\n⚠️  marcajes_products tiene MÁS productos');
    } else if ((productsData?.length || 0) > (marcajesData?.length || 0)) {
        console.log('\n✅ products tiene MÁS productos');
    } else {
        console.log('\n✅ Ambas tablas tienen la misma cantidad de productos');
    }

    // Sample from each
    console.log('\n📝 Sample from marcajes_products:');
    marcajesData?.slice(0, 5).forEach(p => console.log(`  - ${p.name}`));

    console.log('\n📝 Sample from products:');
    productsData?.slice(0, 5).forEach(p => console.log(`  - ${p.name}`));
    
    // Check columns
    if (marcajesData && marcajesData.length > 0) {
        console.log('\n🔧 marcajes_products columns:', Object.keys(marcajesData[0]));
    }
    if (productsData && productsData.length > 0) {
        console.log('🔧 products columns:', Object.keys(productsData[0]));
    }
}

checkCounts();
