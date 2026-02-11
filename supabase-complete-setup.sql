-- Script complet de diagnostic et configuration pour Supabase Storage

-- 1. Vérifier si le bucket gallery existe
SELECT 'Vérification bucket gallery:' as info;
SELECT * FROM storage.buckets WHERE name = 'gallery';

-- 2. Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  public = EXCLUDED.public;

-- 3. Supprimer anciennes politiques (pour éviter les conflits)
DROP POLICY IF EXISTS "Les images sont publiques en lecture" ON storage.objects;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent uploader des images" ON storage.objects;
DROP POLICY IF EXISTS "Le service role peut uploader des images" ON storage.objects;
DROP POLICY IF EXISTS "Le service role peut supprimer des images" ON storage.objects;
DROP POLICY IF EXISTS "Le service role peut mettre à jour des images" ON storage.objects;

-- 4. Créer nouvelles politiques complètes
CREATE POLICY "Images publiques en lecture" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Service role peut gérer les images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'gallery' AND 
    (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  );

-- 5. Vérifier les politiques créées
SELECT 'Politiques créées:' as info;
SELECT * FROM pg_policies WHERE tablename = 'storage.objects';

-- 6. Test d'upload (à exécuter manuellement si nécessaire)
-- SELECT 'Test upload bucket:' as info;
-- SELECT * FROM storage.objects WHERE bucket_id = 'gallery' LIMIT 1;
