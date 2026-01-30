-- Vérifier si le bucket gallery existe
SELECT * FROM storage.buckets WHERE name = 'gallery';

-- Si le bucket n'existe pas, créez-le :
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT DO NOTHING;
