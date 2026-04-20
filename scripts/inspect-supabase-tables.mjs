import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzczOTcsImV4cCI6MjA4NTMxMzM5N30.EKM3ZiTCiO3tUfbfeDs2Tc91ditpkbxQSsWOAF8baS0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTables() {
    console.log('\n========================================');
    console.log('🔍 INSPECCIÓN DE TABLAS DE SUPABASE');
    console.log('========================================\n');

    // 1. Verificar marcajes_products
    console.log('📋 1. TABLA: marcajes_products');
    console.log('----------------------------------------');
    const { data: marcajesData, error: marcajesError } = await supabase
        .from('marcajes_products')
        .select('*')
        .limit(1);
    
    if (marcajesError) {
        console.log('❌ Error:', marcajesError.message);
    } else if (marcajesData && marcajesData.length > 0) {
        console.log('✅ Columnas existentes:', Object.keys(marcajesData[0]));
        console.log('📄 Ejemplo de registro:', JSON.stringify(marcajesData[0], null, 2));
    } else {
        // Tabla existe pero vacía - intentar obtener estructura
        const { data: emptyCheck } = await supabase
            .from('marcajes_products')
            .select('*')
            .limit(0);
        console.log('⚠️ Tabla existe pero está vacía');
    }

    // Contar registros
    const { data: marcajesAll } = await supabase.from('marcajes_products').select('*');
    console.log('📊 Total registros:', marcajesAll?.length || 0);

    // 2. Verificar products
    console.log('\n📋 2. TABLA: products');
    console.log('----------------------------------------');
    const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(1);
    
    if (productsError) {
        console.log('❌ Error:', productsError.message);
    } else if (productsData && productsData.length > 0) {
        console.log('✅ Columnas existentes:', Object.keys(productsData[0]));
        console.log('📄 Ejemplo de registro:', JSON.stringify(productsData[0], null, 2));
    } else {
        console.log('⚠️ Tabla existe pero está vacía o no existe');
    }

    const { data: productsAll } = await supabase.from('products').select('*');
    console.log('📊 Total registros:', productsAll?.length || 0);

    // 3. Verificar mailing_products
    console.log('\n📋 3. TABLA: mailing_products');
    console.log('----------------------------------------');
    const { data: mailingData, error: mailingError } = await supabase
        .from('mailing_products')
        .select('*')
        .limit(1);
    
    if (mailingError) {
        console.log('❌ Error:', mailingError.message);
    } else if (mailingData && mailingData.length > 0) {
        console.log('✅ Columnas existentes:', Object.keys(mailingData[0]));
        console.log('📄 Ejemplo de registro:', JSON.stringify(mailingData[0], null, 2));
    } else {
        console.log('⚠️ Tabla existe pero está vacía o no existe');
    }

    const { data: mailingAll } = await supabase.from('mailing_products').select('*');
    console.log('📊 Total registros:', mailingAll?.length || 0);

    // 4. Verificar mailing_assets
    console.log('\n📋 4. TABLA: mailing_assets');
    console.log('----------------------------------------');
    const { data: assetsData, error: assetsError } = await supabase
        .from('mailing_assets')
        .select('*')
        .limit(1);
    
    if (assetsError) {
        console.log('❌ Error:', assetsError.message);
    } else if (assetsData && assetsData.length > 0) {
        console.log('✅ Columnas existentes:', Object.keys(assetsData[0]));
    } else {
        console.log('⚠️ Tabla existe pero está vacía o no existe');
    }

    // Resumen final
    console.log('\n========================================');
    console.log('📊 RESUMEN DE TABLAS');
    console.log('========================================');
    console.log(`marcajes_products: ${marcajesAll?.length || 0} registros`);
    console.log(`products: ${productsAll?.length || 0} registros`);
    console.log(`mailing_products: ${mailingAll?.length || 0} registros`);
}

inspectTables();
