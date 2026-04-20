/**
 * Supabase Keep-Alive Ping
 *
 * Ejecuta una consulta ligera contra Supabase para registrar actividad
 * y evitar que el proyecto se pause por inactividad (los proyectos
 * gratuitos de Supabase se pausan luego de ~7 dias sin actividad).
 *
 * Uso local:
 *   node scripts/supabase-keepalive.mjs
 *
 * Uso en CI (GitHub Actions):
 *   Se ejecuta automaticamente cada 3 dias desde
 *   .github/workflows/supabase-keepalive.yml
 *
 * Variables de entorno opcionales:
 *   SUPABASE_URL       (default: URL del proyecto actual)
 *   SUPABASE_ANON_KEY  (default: anon key del cliente)
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.SUPABASE_URL || 'https://bupnqihroawrvcvzpbqv.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cG5xaWhyb2F3cnZjdnpwYnF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MzczOTcsImV4cCI6MjA4NTMxMzM5N30.EKM3ZiTCiO3tUfbfeDs2Tc91ditpkbxQSsWOAF8baS0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function ping() {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Consulta ligera HEAD contra la tabla products: solo cuenta filas,
  // no trae datos. Suficiente para registrar actividad en Supabase.
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  const ms = Date.now() - start;

  if (error) {
    console.error('[keepalive] ERROR:', timestamp, error.message);
    process.exit(1);
  }

  console.log('[keepalive] OK', timestamp, '- products:', count, '- ' + ms + 'ms');
}

ping().catch((e) => {
  console.error('[keepalive] Unexpected error:', e);
  process.exit(1);
});
