'use server';

import { supabaseAdmin } from '@/lib/supabase';

export interface Album {
  id: string;
  name: string;
  description?: string;
  cover_image?: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  file_size: number;
  content_type: string;
  album_id?: string;
  event_date?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export async function createAlbum(name: string, description?: string, coverImage?: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  const { data, error } = await supabaseAdmin
    .from('albums')
    .insert({
      name,
      description: description || null,
      cover_image: coverImage || null
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la création de l'album: ${error.message}`);
  }

  return data;
}

export async function updateAlbumCover(albumId: string, coverImagePath: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  const { data, error } = await supabaseAdmin
    .from('albums')
    .update({
      cover_image: coverImagePath,
      updated_at: new Date().toISOString()
    })
    .eq('id', albumId)
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur lors de la mise à jour de la couverture: ${error.message}`);
  }

  return data;
}

export async function setFirstImageAsCover(albumId: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  // Récupérer la première image de l'album
  const { data: firstImage, error: imageError } = await supabaseAdmin
    .from('gallery_images')
    .select('file_path')
    .eq('album_id', albumId)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (imageError || !firstImage) {
    throw new Error('Aucune image trouvée dans cet album');
  }

  // Mettre à jour la couverture de l'album
  return await updateAlbumCover(albumId, firstImage.file_path);
}

export async function deleteAlbum(albumId: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  // Récupérer les images de l'album pour les supprimer
  const { data: images } = await supabaseAdmin
    .from('gallery_images')
    .select('file_path')
    .eq('album_id', albumId);

  // Supprimer les fichiers du storage
  if (images && images.length > 0) {
    const filePaths = images.map(img => img.file_path);
    await supabaseAdmin.storage
      .from('gallery')
      .remove(filePaths);
  }

  // Supprimer les images de la base
  await supabaseAdmin
    .from('gallery_images')
    .delete()
    .eq('album_id', albumId);

  // Supprimer l'album
  const { error } = await supabaseAdmin
    .from('albums')
    .delete()
    .eq('id', albumId);

  if (error) {
    throw new Error(`Erreur lors de la suppression de l'album: ${error.message}`);
  }
}

export async function uploadImage(file: File, albumId?: string) {
  console.log('=== DÉBUT uploadImage SERVEUR ===');
  console.log('Fichier:', file.name, 'Taille:', file.size, 'Type:', file.type);
  
  if (!supabaseAdmin) {
    console.error('❌ Supabase admin n\'est pas configuré');
    throw new Error('Supabase admin n\'est pas configuré');
  }

  console.log('✅ Supabase admin client OK');

  try {
    // Test de connexion simple
    console.log('🔍 Test de connexion Supabase...');
    const { data: buckets, error: bucketError } = await supabaseAdmin.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Erreur connexion buckets:', bucketError);
      throw new Error(`Erreur connexion Supabase: ${bucketError.message}`);
    }
    
    console.log('✅ Buckets disponibles:', buckets?.map(b => b.name));

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    console.log('📤 Tentative upload vers:', filePath);

    // Upload du fichier avec plus d'options
    console.log('⬆️ Début upload...');
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('gallery')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    console.log('📊 Résultat upload:', { 
      uploadData: uploadData ? '✅ Succès' : '❌ Null', 
      uploadError: uploadError ? uploadError.message : '✅ Aucune erreur'
    });

    if (uploadError) {
      console.error('❌ Erreur upload détaillée:', uploadError);
      
      if (uploadError.message.includes('bucket not found')) {
        throw new Error('❌ Le bucket "gallery" n\'existe pas. Exécutez le SQL de configuration.');
      } else if (uploadError.message.includes('permission')) {
        throw new Error('❌ Permission refusée. Vérifiez les politiques RLS.');
      } else if (uploadError.message.includes('network') || uploadError.message.includes('fetch')) {
        throw new Error('❌ Erreur réseau. Vérifiez CORS et connexion.');
      }
      
      throw new Error(`❌ Erreur upload: ${uploadError.message}`);
    }

    console.log('✅ Upload réussi!');

    // Insertion dans la base de données
    const { data: imageData, error: insertError } = await supabaseAdmin
      .from('gallery_images')
      .insert({
        title: file.name,
        file_path: filePath,
        file_size: file.size,
        content_type: file.type,
        album_id: albumId,
        event_date: new Date().toISOString().split('T')[0],
        tags: ['bitcoin-benin', 'event']
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Erreur insertion: ${insertError.message}`);
    }

    return imageData;

  } catch (error) {
    console.error('Erreur générale uploadImage:', error);
    throw error;
  }
}

export async function deleteImage(imageId: string, filePath: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  // Suppression du fichier
  await supabaseAdmin.storage
    .from('gallery')
    .remove([filePath]);

  // Suppression de l'entrée dans la base
  const { error } = await supabaseAdmin
    .from('gallery_images')
    .delete()
    .eq('id', imageId);

  if (error) {
    throw new Error(`Erreur lors de la suppression: ${error.message}`);
  }
}
