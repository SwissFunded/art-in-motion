import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const VITE_SUPABASE_URL = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '';
  const VITE_SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const VITE_SUPABASE_SCHEMA = env.VITE_SUPABASE_SCHEMA || env.NEXT_PUBLIC_SUPABASE_SCHEMA || 'public';
  const VITE_SUPABASE_TABLE = env.VITE_SUPABASE_TABLE || env.NEXT_PUBLIC_SUPABASE_TABLE || 'Data Artworks';

  return ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(VITE_SUPABASE_ANON_KEY),
    'import.meta.env.VITE_SUPABASE_SCHEMA': JSON.stringify(VITE_SUPABASE_SCHEMA),
    'import.meta.env.VITE_SUPABASE_TABLE': JSON.stringify(VITE_SUPABASE_TABLE),
    'import.meta.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || VITE_SUPABASE_URL),
    'import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || VITE_SUPABASE_ANON_KEY),
    'import.meta.env.NEXT_PUBLIC_SUPABASE_SCHEMA': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_SCHEMA || VITE_SUPABASE_SCHEMA),
    'import.meta.env.NEXT_PUBLIC_SUPABASE_TABLE': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_TABLE || VITE_SUPABASE_TABLE),
  },
  });
});
