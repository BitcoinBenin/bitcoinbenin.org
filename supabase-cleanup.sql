-- Script de nettoyage pour Supabase Storage
-- Exécutez ce script pour nettoyer les anciennes configurations

-- 1. Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Les images sont publiques en lecture" ON storage.objects;
DROP POLICY IF EXISTS "Les utilisateurs authentifiés peuvent uploader des images" ON storage.objects;
DROP POLICY IF EXISTS "Le service role peut uploader des images" ON storage.objects;
DROP POLICY IF EXISTS "Le service role peut supprimer des images" ON storage.objects;
DROP POLICY IF EXISTS "Le service role peut mettre à jour des images" ON storage.objects;
DROP POLICY IF EXISTS "Images publiques en lecture" ON storage.objects;
DROP POLICY IF EXISTS "Service role peut gérer les images" ON storage.objects;

-- 2. Supprimer le bucket s'il existe (pour recréation propre)
DROP TABLE IF EXISTS storage.objects CASCADE;
DROP SCHEMA IF EXISTS storage CASCADE;

-- 3. Recréer le schéma storage
CREATE SCHEMA IF NOT EXISTS storage;

-- 4. Recréer le bucket proprement
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true);

-- 5. Créer les bonnes politiques
CREATE POLICY "Images publiques en lecture" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Service role peut gérer les images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'gallery' AND 
    (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  );

-- 6. Vérification
SELECT 'Configuration terminée' as status;
SELECT * FROM storage.buckets;
