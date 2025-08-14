import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const schema = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || process.env.VITE_SUPABASE_SCHEMA || 'public';
  const table = process.env.NEXT_PUBLIC_SUPABASE_TABLE || process.env.VITE_SUPABASE_TABLE || 'artworks';

  if (!url || (!serviceKey && !anonKey)) {
    res.status(500).json({ error: 'Supabase URL or API key missing' });
    return;
  }

  try {
    // Prefer service role key if available (bypasses RLS); otherwise use anon key and rely on RLS policies
    const client = createClient(url, serviceKey || anonKey!, { db: { schema } });
    const { data, error } = await client
      .from(table)
      .select('id, nummer, artist_name, location_raw, location_normalized, exhibitions');

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.setHeader('cache-control', 's-maxage=60, stale-while-revalidate=600');
    res.status(200).json({ rows: data });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Unknown error' });
  }
}


