'use server';

import { supabaseAdmin } from '@/lib/supabase';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  location_link?: string;
  image?: string;
  registration_link?: string;
  created_at: string;
  updated_at: string;
}

export async function createEvent(
  title: string,
  description: string,
  date: string,
  time: string,
  location: string,
  location_link?: string,
  image?: string,
  registration_link?: string,
  posterFile?: File
) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  // Validation des champs requis
  console.log('🔍 Validation champs reçus:', { title, date, location });
  
  if (!title || title === '') {
    throw new Error('Le titre est requis');
  }
  if (!date || date === '') {
    console.log('❌ Date invalide:', JSON.stringify(date));
    throw new Error('La date est requise');
  }
  if (!location || location === '') {
    throw new Error('Le lieu est requis');
  }

  console.log('🎯 Création événement avec:', { title, date, location });

  try {
    let imageUrl: string | undefined = undefined;
    
    // S'assurer que image est une chaîne simple
    if (image && typeof image === 'string') {
      imageUrl = image;
    }

    // Upload de l'affiche si un fichier est sélectionné
    if (posterFile) {
      const fileExt = posterFile.name.split('.').pop();
      const fileName = `event-poster-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('gallery')
        .upload(`events/${fileName}`, posterFile);

      if (uploadError) {
        throw new Error(`Erreur upload poster: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('gallery')
        .getPublicUrl(uploadData.path);
      
      imageUrl = publicUrl;
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .insert({
        title,
        description,
        date,
        time,
        location,
        location_link,
        image: imageUrl,
        registration_link
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur création événement: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur dans createEvent:', error);
    throw error;
  }
}

export async function updateEvent(
  id: string,
  title: string,
  description: string,
  date: string,
  time: string,
  location: string,
  location_link?: string,
  image?: string,
  registration_link?: string,
  posterFile?: File
) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  try {
    let imageUrl: string | undefined = undefined;
    
    // S'assurer que image est une chaîne simple
    if (image && typeof image === 'string') {
      imageUrl = image;
    }

    // Upload de l'affiche si un fichier est sélectionné
    if (posterFile) {
      const fileExt = posterFile.name.split('.').pop();
      const fileName = `event-poster-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('gallery')
        .upload(`events/${fileName}`, posterFile);

      if (uploadError) {
        throw new Error(`Erreur upload poster: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('gallery')
        .getPublicUrl(uploadData.path);
      
      imageUrl = publicUrl;
    }

    const { data, error } = await supabaseAdmin
      .from('events')
      .update({
        title,
        description,
        date,
        time,
        location,
        location_link,
        image: imageUrl,
        registration_link
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur mise à jour événement: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur dans updateEvent:', error);
    throw error;
  }
}

export async function deleteEvent(id: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin n\'est pas configuré');
  }

  try {
    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Erreur suppression événement: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur dans deleteEvent:', error);
    throw error;
  }
}
