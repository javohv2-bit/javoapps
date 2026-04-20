import { createClient } from '@supabase/supabase-js';
const s = createClient('https://bupnqihroawrvcvzpbqv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTczNzM5NywiZXhwIjoyMDg1MzEzMzk3fQ.Igo0XyzBJ5rWDCSCOP3T0kvV2_dILE1PAUdiQLZGYPo');

const { count: total } = await s.from('inpage_blocks').select('*', { count: 'exact', head: true });
console.log('Total rows in inpage_blocks:', total);

for (const id of ['g7x-iii', 'r10-18-45', 'r50-18-45', 'eos-rp']) {
  const { count } = await s.from('inpage_blocks').select('*', { count: 'exact', head: true }).eq('product_id', id);
  console.log('  ' + id + ':', count, 'blocks');
}

const { data } = await s.from('inpage_blocks').select('product_id');
const ids = [...new Set(data.map(r => r.product_id))].sort();
console.log('\nAll product_ids (' + ids.length + '):', ids.join(', '));
