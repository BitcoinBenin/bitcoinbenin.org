-- ============================================
-- Configuration Supabase pour Bitcoin Bénin
-- ============================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création de la table des albums
CREATE TABLE IF NOT EXISTS albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des images de gallery
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  content_type TEXT NOT NULL,
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  event_date DATE,
  tags TEXT[], -- Array de tags pour les événements
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des événements
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  location_link TEXT,
  image TEXT,
  registration_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'un bucket pour les images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT DO NOTHING;

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_gallery_images_album_id ON gallery_images(album_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_event_date ON gallery_images(event_date);
CREATE INDEX IF NOT EXISTS idx_gallery_images_tags ON gallery_images USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer les triggers existants avant de les recréer
DROP TRIGGER IF EXISTS update_albums_updated_at ON albums;
DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON gallery_images;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;

-- Créer les triggers
CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Politiques RLS (Row Level Security)
-- ============================================

-- Activation RLS
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table albums
CREATE POLICY "Les albums sont publics en lecture" ON albums
  FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent créer des albums" ON albums
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent modifier les albums" ON albums
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer les albums" ON albums
  FOR DELETE USING (auth.role() = 'authenticated');

-- Politiques pour la table gallery_images
CREATE POLICY "Les images sont publiques en lecture" ON gallery_images
  FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent uploader des images" ON gallery_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent modifier leurs images" ON gallery_images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer leurs images" ON gallery_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- Politiques pour la table events
CREATE POLICY "Les événements sont publics en lecture" ON events
  FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs authentifiés peuvent créer des événements" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent modifier les événements" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer les événements" ON events
  FOR DELETE USING (auth.role() = 'authenticated');

-- Politiques pour le storage bucket
CREATE POLICY "Les images sont publiques en lecture" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Les utilisateurs authentifiés peuvent uploader des images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery' AND 
    auth.role() = 'authenticated'
  );

-- ============================================
-- Fin du script
-- ============================================
