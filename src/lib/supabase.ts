import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Vérification que les variables d'environnement sont disponibles
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

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
