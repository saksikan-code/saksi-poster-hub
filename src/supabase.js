/**
 * Standalone Supabase client for Saksi Poster Hub
 *
 * In this TanStack Start project, the Supabase client is used via
 * src/lib/supabase.ts (TypeScript). This file is provided as a
 * reference for how to initialize the client in plain JavaScript.
 *
 * Usage in a plain HTML/JS page:
 *   <script src="supabase.js"></script>
 *   <script>
 *     const { data } = await SUPABASE.from('posters').select('*');
 *   </script>
 */

// If using a module bundler (Vite, webpack, etc.):
// import { createClient } from '@supabase/supabase-js'

// For plain <script> tag usage, unpkg the UMD build:
// <script src="https://unpkg.com/@supabase/supabase-js@2/umd/supabase.js"></script>

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
  )
}

// Using the global supabase object from the UMD script
// If using ES modules, uncomment the import and remove the global reference
const SUPABASE = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

export { SUPABASE, SUPABASE_URL, SUPABASE_ANON_KEY }
