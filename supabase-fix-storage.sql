-- Politiques supplémentaires pour le storage bucket avec service role

-- Politique pour permettre le service role d'uploader des images
CREATE POLICY "Le service role peut uploader des images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery' AND 
    auth.role() = 'service_role'
  );

-- Politique pour permettre le service role de supprimer des images
CREATE POLICY "Le service role peut supprimer des images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gallery' AND 
    auth.role() = 'service_role'
  );

-- Politique pour permettre le service role de mettre à jour des images
CREATE POLICY "Le service role peut mettre à jour des images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'gallery' AND 
    auth.role() = 'service_role'
  );
