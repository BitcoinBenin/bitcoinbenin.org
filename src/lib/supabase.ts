import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDatabase = any

// Client Supabase avec gestion d'erreurs
let supabaseClient: SupabaseClient<AnyDatabase> | null = null
let supabaseAdminClient: SupabaseClient<AnyDatabase> | null = null

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient<AnyDatabase>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  }
} catch (error) {
  console.error('Erreur initialisation Supabase client:', error)
}

try {
  if (supabaseUrl && supabaseServiceKey) {
    supabaseAdminClient = createClient<AnyDatabase>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  }
} catch (error) {
  console.error('Erreur initialisation Supabase admin:', error)
}

export const supabase = supabaseClient
export const supabaseAdmin = supabaseAdminClient || supabaseClient

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
