import { createClient } from '@supabase/supabase-js';

// Prefer environment variables set on Vercel; fallback to provided values for local dev
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kxavyfrilkifmrybrgkw.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4YXZ5ZnJpbGtpZm1yeWJyZ2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjYwNzcsImV4cCI6MjA3MDMwMjA3N30.3lOl7Noc00CEHszO1AqZ4K7s1tJzDD5Et1Nt1bOOkYw';
export const SUPABASE_TABLE = import.meta.env.VITE_SUPABASE_TABLE || 'artworks';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


