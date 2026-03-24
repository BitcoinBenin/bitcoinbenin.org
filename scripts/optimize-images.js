// Script d'optimisation des images existantes
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function optimizeExistingImages() {
  console.log('🚀 Début de l\'optimisation des images...');
  
  try {
    // Récupérer toutes les images
    const { data: images, error } = await supabase
      .from('gallery_images')
      .select('*');
    
    if (error) throw error;
    
    console.log(`📊 ${images.length} images trouvées`);
    
    for (const image of images) {
      try {
        // Télécharger l'image originale
        const { data, error: downloadError } = await supabase.storage
          .from('gallery')
          .download(image.file_path);
        
        if (downloadError) throw downloadError;
        
        // Créer différentes tailles
        const buffer = Buffer.from(data);
        
        // Thumbnail (200x200)
        const thumbnail = await sharp(buffer)
          .resize(200, 200, { fit: 'cover' })
          .webp({ quality: 60 })
          .toBuffer();
        
        // Medium (800x600)
        const medium = await sharp(buffer)
          .resize(800, 600, { fit: 'cover' })
          .webp({ quality: 75 })
          .toBuffer();
        
        // Large (1920x1080)
        const large = await sharp(buffer)
          .resize(1920, 1080, { fit: 'cover' })
          .webp({ quality: 85 })
          .toBuffer();
        
        // Uploader les versions optimisées
        const thumbPath = image.file_path.replace(/\.[^/.]+$/, '_thumb.webp');
        const mediumPath = image.file_path.replace(/\.[^/.]+$/, '_medium.webp');
        const largePath = image.file_path.replace(/\.[^/.]+$/, '_large.webp');
        
        await Promise.all([
          supabase.storage
            .from('gallery')
            .upload(thumbPath, thumbnail, { contentType: 'image/webp', upsert: true }),
          supabase.storage
            .from('gallery')
            .upload(mediumPath, medium, { contentType: 'image/webp', upsert: true }),
          supabase.storage
            .from('gallery')
            .upload(largePath, large, { contentType: 'image/webp', upsert: true })
        ]);
        
        console.log(`✅ ${image.title} optimisée`);
        
      } catch (error) {
        console.error(`❌ Erreur pour ${image.title}:`, error);
      }
    }
    
    console.log('🎉 Optimisation terminée !');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le script
if (require.main === module) {
  optimizeExistingImages();
}

module.exports = { optimizeExistingImages };
