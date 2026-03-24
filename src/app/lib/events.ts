import { supabase } from '@/lib/supabase';
import { FeaturedEvent } from '@/app/types/events';

export async function getAllFeaturedEvents(): Promise<FeaturedEvent[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('featured_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération événements vedettes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
}

export async function getFeaturedEvent(): Promise<FeaturedEvent | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('featured_events')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // Pas d'événement vedette actif, ce n'est pas une erreur
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

export async function createFeaturedEvent(event: Omit<FeaturedEvent, 'id' | 'created_at' | 'updated_at'>): Promise<FeaturedEvent | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('featured_events')
      .insert({
        ...event,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur création événement vedette:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
}

export async function updateFeaturedEvent(id: string, updates: Partial<FeaturedEvent>): Promise<FeaturedEvent | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('featured_events')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur mise à jour événement vedette:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
}
