-- Création de la table des albums
CREATE TABLE albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des images de gallery
CREATE TABLE gallery_images (
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
CREATE TABLE events (
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
VALUES ('gallery', 'gallery', true);

-- Politiques RLS (Row Level Security)
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des albums
CREATE POLICY "Les albums sont publics en lecture" ON albums
  FOR SELECT USING (true);

-- Politique pour permettre l'insertion d'albums (authentifié)
CREATE POLICY "Les utilisateurs authentifiés peuvent créer des albums" ON albums
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politique pour permettre la mise à jour des albums (authentifié)
CREATE POLICY "Les utilisateurs authentifiés peuvent modifier les albums" ON albums
  FOR UPDATE USING (auth.role() = 'authenticated');Création album: 
Object { name: "Spécial Bitdev ", description: "" }
page.tsx:82:17
Supabase client: true page.tsx:83:17
XHRPOST
https://hgnwadiljauqbhsbtxkk.supabase.co/rest/v1/albums?select=*
[HTTP/2 403  524ms]

Réponse Supabase création album: 
Object { data: null, error: {…} }
page.tsx:89:21
Erreur lors de la création de l'album: 
Object { code: "42501", details: null, hint: null, message: 'new row violates row-level security policy for table "albums"' }
intercept-console-error.js:57:32
Download the React DevTools for a better development experience: https://react.dev/link/react-devtools react-dom-client.development.js:25631:17
The resource at “http://localhost:3000/_next/static/media/9a4ee768fed045da-s.p.woff2” preloaded with link preload was not used within a few seconds. Make sure all attributes of the preload tag are set correctly. gallery
The resource at “http://localhost:3000/_next/static/media/bb3ef058b751a6ad-s.p.woff2” preloaded with link preload was not used within a few seconds. Make sure all attributes of the preload tag are set correctly. gallery
The resource at “http://localhost:3000/_next/static/media/e4af272ccee01ff0-s.p.woff2” preloaded with link preload was not used within a few seconds. Make sure all attributes of the preload tag are set correctly. gallery


-- Politique pour permettre la suppression d'albums (authentifié)
CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer les albums" ON albums
  FOR DELETE USING (auth.role() = 'authenticated');

-- Politique pour permettre la lecture publique des images
CREATE POLICY "Les images sont publiques en lecture" ON gallery_images
  FOR SELECT USING (true);

-- Politique pour permettre la lecture publique des événements
CREATE POLICY "Les événements sont publics en lecture" ON events
  FOR SELECT USING (true);

-- Politique pour permettre l'insertion d'images (authentifié)
CREATE POLICY "Les utilisateurs authentifiés peuvent uploader des images" ON gallery_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politique pour permettre la mise à jour des images (authentifié)
CREATE POLICY "Les utilisateurs authentifiés peuvent modifier leurs images" ON gallery_images
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Politique pour permettre la suppression d'images (authentifié)
CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer leurs images" ON gallery_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- Politique pour permettre l'insertion d'événements (authentifié)
CREATE POLICY "Les utilisateurs authentifiés peuvent créer des événements" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politique pour permettre la mise à jour des événements (authentifié)
CREATE POLICY "Les utilisateurs authentifiés peuvent modifier les événements" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Politique pour permettre la suppression d'événements (authentifié)
CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer les événements" ON events
  FOR DELETE USING (auth.role() = 'authenticated');

-- Politique pour le storage bucket
CREATE POLICY "Les images sont publiques en lecture" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Les utilisateurs authentifiés peuvent uploader des images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery' AND 
    auth.role() = 'authenticated'
  );

-- Index pour optimiser les performances
CREATE INDEX idx_gallery_images_album_id ON gallery_images(album_id);
CREATE INDEX idx_gallery_images_event_date ON gallery_images(event_date);
CREATE INDEX idx_gallery_images_tags ON gallery_images USING GIN(tags);
CREATE INDEX idx_events_date ON events(date);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
