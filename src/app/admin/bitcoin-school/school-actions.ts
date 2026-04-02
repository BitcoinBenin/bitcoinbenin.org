'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Interface pour un participant
export interface Participant {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  session_year: number;
  created_at: string;
  attendance?: Attendance | Attendance[];
}

// Interface pour les présences
export interface Attendance {
  participant_id: string;
  day_1: boolean;
  day_2: boolean;
  day_3: boolean;
}

/**
 * Récupérer les années disponibles dans la base de données
 */
export async function getAvailableYears() {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    const { data, error } = await supabase
      .from('school_participants')
      .select('session_year')
      .order('session_year', { ascending: false });

    if (error) throw error;
    
    const uniqueYears = Array.from(new Set(data?.map(d => d.session_year) || []));

    const currentYear = new Date().getFullYear();

    // Si aucune année n'existe encore, on propose l'année en cours
    if (uniqueYears.length === 0) {
      return { success: true, data: [currentYear] };
    }

    // Ajouter l'année en cours si pas encore présente
    if (!uniqueYears.includes(currentYear)) {
      uniqueYears.push(currentYear);
    }

    // Trier par ordre décroissant
    uniqueYears.sort((a, b) => b - a);

    return { success: true, data: uniqueYears };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Calculer les points de présence d'un participant
 */
export async function calculateAttendancePoints(attendance?: Attendance) {
  if (!attendance) return 0;
  let points = 0;
  if (attendance.day_1) points += 4;
  if (attendance.day_2) points += 6;
  if (attendance.day_3) points += 6;
  return points;
}

/**
 * Récupérer tous les participants avec leurs présences
 */
export async function getParticipants(year?: number, city?: string) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    let query = supabase
      .from('school_participants')
      .select('*, attendance:school_attendance(*)')
      .order('created_at', { ascending: false });

    if (year) {
      query = query.eq('session_year', year);
    }
    
    if (city && city !== 'Toutes') {
      query = query.eq('city', city);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Ajouter un nouveau participant
 */
export async function addParticipant(name: string, email: string, phone: string, city: string, year: number) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    console.log('🔍 Tentative d\'ajout participant:', { name, email, phone, city, year });
    
    // 1. Vérifier si le participant existe déjà dans cette ville et cette année
    const { data: existing, error: checkError } = await supabase
      .from('school_participants')
      .select('*')
      .eq('email', email)
      .eq('city', city)
      .eq('session_year', year)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('❌ Erreur vérification existant:', checkError);
      throw checkError;
    }
    
    // Si le participant existe déjà dans cette ville/année
    if (existing) {
      console.log('ℹ️  Participant existe déjà dans cette ville/année');
      return { 
        success: false, 
        error: `${existing.full_name || name} est déjà enregistré à ${city} pour la session ${year}.`,
        existing: true 
      };
    }
    
    // 2. Ajouter le participant (même si l'email existe dans une autre ville)
    const { data: participant, error: pError } = await supabase
      .from('school_participants')
      .insert([{ full_name: name, email, phone, city, session_year: year }])
      .select()
      .single();

    console.log('📊 Résultat insertion participant:', { participant, pError });

    if (pError) {
      console.error('❌ Erreur insertion participant:', pError);
      throw pError;
    }

    // 2. Créer son entrée de présence par défaut
    console.log('📝 Création entrée de présence pour participant ID:', participant.id);
    
    const { error: aError } = await supabase
      .from('school_attendance')
      .insert([{ participant_id: participant.id, day_1: false, day_2: false, day_3: false }]);

    console.log('📊 Résultat insertion présence:', { aError });

    if (aError) {
      console.error('❌ Erreur insertion présence:', aError);
      throw aError;
    }

    console.log('✅ Participant ajouté avec succès');
    revalidatePath('/admin/bitcoin-school');
    return { success: true, data: participant };
  } catch (error: unknown) {
    console.error('🚨 Erreur complète dans addParticipant:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      const errObj = error as { code?: string; details?: string; message?: string };
      if (errObj.code === '23505' && errObj.details?.includes('email')) {
        errorMessage = `${name} est déjà enregistré à ${city} pour la session ${year}.`;
      } else if (typeof errObj.message === 'string') {
        errorMessage = errObj.message;
      }
    }
    
    console.error('🔍 Message d\'erreur final:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Mettre à jour la présence d'un participant
 */
export async function updateAttendance(participantId: string, day: 1 | 2 | 3, status: boolean) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    const updateObj: Record<string, boolean> = {};
    updateObj[`day_${day}`] = status;

    const { error } = await supabase
      .from('school_attendance')
      .update(updateObj)
      .eq('participant_id', participantId);

    if (error) throw error;
    
    revalidatePath('/admin/bitcoin-school');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

// Interface pour une question
export interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  points: number;
}

/**
 * Récupérer toutes les questions
 */
export async function getQuestions() {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    const { data, error } = await supabase
      .from('school_exam_questions')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Ajouter ou mettre à jour une question
 */
export async function saveQuestion(question: Partial<Question>) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    const { data, error } = await supabase
      .from('school_exam_questions')
      .upsert([question])
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/admin/bitcoin-school/questions');
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Supprimer un participant
 */
export async function deleteParticipant(id: string) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    const { error } = await supabase
      .from('school_participants')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    revalidatePath('/admin/bitcoin-school');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Supprimer une question
 */
export async function deleteQuestion(id: string) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    const { error } = await supabase
      .from('school_exam_questions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    revalidatePath('/admin/bitcoin-school/questions');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Importer plusieurs participants d'un coup (depuis Luma CSV par exemple)
 */
export async function bulkAddParticipants(participants: { name: string, email: string, phone?: string, city: string, session_year: number }[]) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    const results = [];
    
    for (const p of participants) {
      // 1. Insérer le participant (ou ignorer si l'email existe déjà)
      // Note: l'email devrait être unique par année idéalement, mais ici on garde l'email unique global par simplicité SQL
      const { data: participant, error: pError } = await supabase
        .from('school_participants')
        .upsert([{ full_name: p.name, email: p.email, phone: p.phone, city: p.city, session_year: p.session_year }], { onConflict: 'email' })
        .select()
        .single();

      if (pError) {
        console.error(`Erreur pour ${p.email}:`, pError.message);
        continue;
      }

      // 2. Créer l'entrée de présence par défaut (si elle n'existe pas)
      try {
        await supabase
          .from('school_attendance')
          .insert([{ participant_id: participant.id, day_1: false, day_2: false, day_3: false }])
          .throwOnError();
      } catch {
        // Ignorer si l'entrée existe déjà pour ce participant
      }

      results.push(participant);
    }

    revalidatePath('/admin/bitcoin-school');
    return { success: true, count: results.length };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Vider complètement la table des participants pour une année donnée
 */
export async function clearAllParticipants(year?: number) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    let query = supabase.from('school_participants').delete();
    
    if (year) {
      query = query.eq('session_year', year);
    } else {
      query = query.neq('id', '00000000-0000-0000-0000-000000000000'); // Supprime tout
    }

    const { error } = await query;

    if (error) throw error;
    
    revalidatePath('/admin/bitcoin-school');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Récupérer les statistiques globales par ville pour une année donnée
 */
export async function getSchoolStatsByCity(year?: number) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    // 1. Récupérer tous les participants avec leurs présences filtrés par année
    let pQuery = supabase
      .from('school_participants')
      .select('city, session_year, attendance:school_attendance(day_1, day_2, day_3)');
    
    if (year) {
      pQuery = pQuery.eq('session_year', year);
    }

    const { data: participants, error: pError } = await pQuery;

    if (pError) throw pError;

    // 2. Récupérer tous les résultats d'examen avec la ville du participant filtrés par année
    const rQuery = supabase
      .from('school_exam_results')
      .select('score, participant:school_participants(city, session_year)');
    
    const { data: results, error: rError } = await rQuery;

    if (rError) throw rError;

    // Filtrer les résultats par année si spécifié
    const filteredResults = year 
      ? results?.filter(r => {
          const p = Array.isArray(r.participant) ? r.participant[0] : r.participant;
          return (p as { session_year: number })?.session_year === year;
        })
      : results;

    // 3. Aggréger les données par ville
    const statsByCity: Record<string, {
      name: string;
      participants: number;
      attendance_d1: number;
      attendance_d2: number;
      attendance_d3: number;
      total_exam_score: number;
      exam_count: number;
    }> = {};

    participants?.forEach(p => {
      const city = p.city || 'Inconnue';
      if (!statsByCity[city]) {
        statsByCity[city] = { 
          name: city, 
          participants: 0, 
          attendance_d1: 0, 
          attendance_d2: 0, 
          attendance_d3: 0,
          total_exam_score: 0,
          exam_count: 0
        };
      }
      
      statsByCity[city].participants++;
      
      let attendance: Attendance | undefined;
      
      if (p.attendance) {
        if (Array.isArray(p.attendance)) {
          attendance = p.attendance[0] as Attendance;
        } else {
          attendance = p.attendance as Attendance;
        }
      }

      if (attendance) {
          if (attendance.day_1) statsByCity[city].attendance_d1++;
          if (attendance.day_2) statsByCity[city].attendance_d2++;
          if (attendance.day_3) statsByCity[city].attendance_d3++;
      }
    });

    filteredResults?.forEach(r => {
      let participant: { city?: string } | undefined;
      
      if (r.participant) {
        if (Array.isArray(r.participant)) {
          participant = r.participant[0] as { city?: string };
        } else {
          participant = r.participant as { city?: string };
        }
      }

      const city = participant?.city || 'Inconnue';
      if (statsByCity[city]) {
        statsByCity[city].total_exam_score += r.score;
        statsByCity[city].exam_count++;
      }
    });

    return { 
      success: true, 
      data: Object.values(statsByCity).sort((a, b) => b.participants - a.participants) 
    };
  } catch (error: unknown) {
    console.error('Erreur stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Vider uniquement les participants d'une ville spécifique pour une année donnée
 */
export async function clearCityParticipants(city: string, year: number) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    // 1. Supprimer les participants de cette ville
    const { error: deleteError } = await supabase
      .from('school_participants')
      .delete()
      .eq('city', city)
      .eq('session_year', year);

    if (deleteError) throw deleteError;

    // 2. Supprimer les entrées de présence correspondantes
    const { data: participants } = await supabase
      .from('school_participants')
      .select('id')
      .eq('city', city)
      .eq('session_year', year);

    if (participants && participants.length > 0) {
      const participantIds = participants.map(p => p.id);
      const { error: attendanceError } = await supabase
        .from('school_attendance')
        .delete()
        .in('participant_id', participantIds);

      if (attendanceError) throw attendanceError;
    }

    revalidatePath('/admin/bitcoin-school');
    return { success: true, count: participants?.length || 0 };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Erreur suppression ville:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
