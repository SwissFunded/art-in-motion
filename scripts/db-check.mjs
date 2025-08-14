import { createClient } from '@supabase/supabase-js';
import { config as loadEnv } from 'dotenv';

// Load local env pulled from Vercel
loadEnv({ path: '.env.local' });

const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const table = process.env.VITE_SUPABASE_TABLE || process.env.NEXT_PUBLIC_SUPABASE_TABLE || '';

if (!url || !key || !table) {
  console.error('Missing required env: ensure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY), and NEXT_PUBLIC_SUPABASE_TABLE are set.');
  process.exit(1);
}

const client = createClient(url, key);

async function main() {
  try {
    const { data, error } = await client
      .from(table)
      .select('id, nummer, artist_name, location_raw, location_normalized, exhibitions')
      .limit(5);
    if (error) {
      console.error('Supabase error:', error.message);
      process.exit(1);
    }
    console.log('Supabase connectivity OK. Sample rows:', data);
  } catch (e) {
    console.error('Connectivity test failed:', e);
    process.exit(1);
  }
}

main();


