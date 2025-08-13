import { createClient } from '@supabase/supabase-js'

// Évite les erreurs à la build si les variables ne sont pas définies
// et ne crée le client que côté navigateur avec des clés présentes.
let supabase = null;
if (typeof window !== 'undefined') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
}

export { supabase }