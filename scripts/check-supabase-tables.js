/**
 * Script para revisar las tablas existentes en Supabase
 * antes de hacer cambios en el schema
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bupnqihroawrvcvzpbqv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    console.log('🔍 Revisando tablas en Supabase...\n');

    // 1. Revisar si existe brochure_products
    console.log('📋 === brochure_products ===');
    try {
        const { data: products, error: prodError } = await supabase
            .from('brochure_products')
            .select('*');
        
        if (prodError) {
            console.log('❌ Error o tabla no existe:', prodError.message);
        } else {
            console.log(`✅ Encontrados ${products?.length || 0} registros:`);
            if (products && products.length > 0) {
                products.forEach(p => {
                    console.log(`   - ID: ${p.id}, Name: ${p.name}, Slug: ${p.slug}`);
                });
            }
        }
    } catch (e) {
        console.log('❌ Tabla no existe');
    }

    // 2. Revisar si existe brochure_product_blocks
    console.log('\n📋 === brochure_product_blocks ===');
    try {
        const { data: blocks, error: blockError } = await supabase
            .from('brochure_product_blocks')
            .select('*');
        
        if (blockError) {
            console.log('❌ Error o tabla no existe:', blockError.message);
        } else {
            console.log(`✅ Encontrados ${blocks?.length || 0} registros:`);
            if (blocks && blocks.length > 0) {
                blocks.forEach(b => {
                    console.log(`   - ID: ${b.id}, Product: ${b.product_id}, Type: ${b.block_type}, Order: ${b.block_order}`);
                });
            }
        }
    } catch (e) {
        console.log('❌ Tabla no existe');
    }

    // 3. Revisar otras tablas que puedan existir relacionadas
    console.log('\n📋 === Otras tablas posibles ===');
    
    const tablesToCheck = [
        'products',
        'product_blocks', 
        'inpage_products',
        'digital_brochure',
        'canon_products'
    ];

    for (const table of tablesToCheck) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .limit(5);
            
            if (!error && data) {
                console.log(`\n✅ ${table}: ${data.length} registros (mostrando máx 5)`);
                if (data.length > 0) {
                    console.log('   Columnas:', Object.keys(data[0]).join(', '));
                    data.forEach((row, i) => {
                        const preview = JSON.stringify(row).substring(0, 150);
                        console.log(`   [${i}] ${preview}...`);
                    });
                }
            }
        } catch (e) {
            // Tabla no existe, ignorar
        }
    }

    // 4. Listar todas las tablas públicas (usando información del schema)
    console.log('\n📋 === Consultando schema de tablas ===');
    try {
        const { data, error } = await supabase.rpc('get_tables_info');
        if (!error && data) {
            console.log('Tablas encontradas:', data);
        }
    } catch (e) {
        console.log('No se pudo obtener info del schema via RPC');
    }

    console.log('\n✅ Revisión completada');
}

checkTables();
