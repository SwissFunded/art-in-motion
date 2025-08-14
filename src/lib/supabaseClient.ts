import { createClient } from '@supabase/supabase-js';

// Prefer environment variables set on Vercel; fallback to provided values for local dev
const _env = (k: string) => (import.meta as any).env?.[k];
export const SUPABASE_URL = _env('VITE_SUPABASE_URL') || _env('NEXT_PUBLIC_SUPABASE_URL') || '';
export const SUPABASE_ANON_KEY = _env('VITE_SUPABASE_ANON_KEY') || _env('NEXT_PUBLIC_SUPABASE_ANON_KEY') || '';
export const SUPABASE_TABLE = _env('VITE_SUPABASE_TABLE') || _env('NEXT_PUBLIC_SUPABASE_TABLE') || 'artworks';
export const SUPABASE_SCHEMA = _env('VITE_SUPABASE_SCHEMA') || _env('NEXT_PUBLIC_SUPABASE_SCHEMA') || 'public';

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { db: { schema: SUPABASE_SCHEMA } })
  : null;


