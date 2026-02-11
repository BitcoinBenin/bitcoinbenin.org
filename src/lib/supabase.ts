import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Vérification que les variables d'environnement sont disponibles
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  : null

// Client admin pour les opérations serveur
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  : null

// Fonction pour nettoyer les sessions corrompues
export const clearSupabaseSession = async () => {
  if (supabase) {
    await supabase.auth.signOut()
    // Nettoyer le localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('supabase.auth.refreshToken')
    }
  }
}

// Types pour la gallery
export interface GalleryImage {
  id: string
  title: string
  description?: string
  file_path: string
  file_size: number
  content_type: string
  album_id?: string
  event_date?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface Album {
  id: string
  name: string
  description?: string
  cover_image?: string
  created_at: string
  updated_at: string
}
