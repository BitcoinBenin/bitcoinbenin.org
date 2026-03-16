'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase';

/**
 * Générer un nouveau code secret de présence pour une ville et un jour donnés
 * Ce code est stocké dans une table de configuration (à créer) ou via les métadonnées
 */
export async function generateAttendanceCode(city: string, day: number, year: number) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    // On génère un code court de 6 caractères
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 4); // Expire dans 4 heures

    const { error } = await supabase
      .from('school_attendance_codes')
      .upsert([{ 
        city, 
        day_number: day, 
        session_year: year, 
        code, 
        expires_at: expiresAt.toISOString() 
      }], { onConflict: 'city,day_number,session_year' });

    if (error) throw error;
    
    return { success: true, code };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Récupérer le code de présence actuel pour une ville
 */
export async function getActiveAttendanceCode(city: string, day: number, year: number) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('school_attendance_codes')
      .select('code, expires_at')
      .eq('city', city)
      .eq('day_number', day)
      .eq('session_year', year)
      .single();

    if (error || !data) return null;

    // Vérifier l'expiration
    if (new Date(data.expires_at) < new Date()) return null;

    return data.code as string;
  } catch {
    return null;
  }
}

/**
 * Valider la présence d'un participant via son email et le code secret
 */
export async function validateSelfAttendance(email: string, code: string) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    // 1. Trouver le code actif correspondant
    const { data: codeData, error: codeError } = await supabase
      .from('school_attendance_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (codeError || !codeData) {
      return { success: false, error: 'Code invalide' };
    }

    if (new Date(codeData.expires_at) < new Date()) {
      return { success: false, error: 'Code expiré' };
    }

    // 2. Trouver le participant par son email et la ville/année du code
    const { data: participant, error: pError } = await supabase
      .from('school_participants')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .eq('city', codeData.city)
      .eq('session_year', codeData.session_year)
      .single();

    if (pError || !participant) {
      return { success: false, error: 'Participant non trouvé pour cette session/ville' };
    }

    // 3. Mettre à jour la présence
    const updateObj: Record<string, boolean> = {};
    updateObj[`day_${codeData.day_number}`] = true;

    const { error: uError } = await supabase
      .from('school_attendance')
      .update(updateObj)
      .eq('participant_id', participant.id);

    if (uError) throw uError;

    return { success: true, message: 'Présence validée avec succès !' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}
