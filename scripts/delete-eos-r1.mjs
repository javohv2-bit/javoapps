// Script para eliminar EOS R1
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bupnqihroawrvcvzpbqv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzczOTcsImV4cCI6MjA4NTMxMzM5N30.EKM3ZiTCiO3tUfbfeDs2Tc91ditpkbxQSsWOAF8baS0'
);

async function deleteEOSR1() {
  const { data: product } = await supabase
    .from('brochure_products')
    .select('id')
    .eq('name', 'EOS R1')
    .single();
    
  if (!product) {
    console.log('No se encontró EOS R1');
    return;
  }
  
  console.log('Encontrado:', product.id);
  
  const { error: blocksError } = await supabase
    .from('brochure_product_blocks')
    .delete()
    .eq('product_id', product.id);
    
  if (blocksError) console.error('Error bloques:', blocksError);
  else console.log('Bloques eliminados');
  
  const { error: productError } = await supabase
    .from('brochure_products')
    .delete()
    .eq('id', product.id);
    
  if (productError) console.error('Error producto:', productError);
  else console.log('Producto eliminado');
}

deleteEOSR1();
