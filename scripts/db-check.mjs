import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://kxavyfrilkifmrybrgkw.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YXZ5ZnJpbGtpZm1yeWJyZ2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjYwNzcsImV4cCI6MjA3MDMwMjA3N30.3lOl7Noc00CEHszO1AqZ4K7s1tJzDD5Et1Nt1bOOkYw';
const table = process.env.VITE_SUPABASE_TABLE || 'artworks';

const client = createClient(url, key);

async function main() {
  try {
    const { data, error } = await client.from(table).select('id, Nummer, artist_name, location_raw, location_normalized, exhibitions').limit(5);
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


