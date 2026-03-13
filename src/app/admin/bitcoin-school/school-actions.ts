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
  created_at: string;
  attendance?: Attendance;
}

// Interface pour les présences
export interface Attendance {
  participant_id: string;
  day_1: boolean;
  day_2: boolean;
  day_3: boolean;
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
export async function getParticipants() {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    const { data, error } = await supabase
      .from('school_participants')
      .select('*, attendance:school_attendance(*)')
      .order('created_at', { ascending: false });

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
export async function addParticipant(name: string, email: string, phone: string, city: string) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    // 1. Ajouter le participant
    const { data: participant, error: pError } = await supabase
      .from('school_participants')
      .insert([{ full_name: name, email, phone, city }])
      .select()
      .single();

    if (pError) throw pError;

    // 2. Créer son entrée de présence par défaut
    const { error: aError } = await supabase
      .from('school_attendance')
      .insert([{ participant_id: participant.id, day_1: false, day_2: false, day_3: false }]);

    if (aError) throw aError;

    revalidatePath('/admin/bitcoin-school');
    return { success: true, data: participant };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
export async function bulkAddParticipants(participants: { name: string, email: string, phone?: string, city: string }[]) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    const results = [];
    
    for (const p of participants) {
      // 1. Insérer le participant (ou ignorer si l'email existe déjà)
      const { data: participant, error: pError } = await supabase
        .from('school_participants')
        .upsert([{ full_name: p.name, email: p.email, phone: p.phone, city: p.city }], { onConflict: 'email' })
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
 * Vider complètement la table des participants
 */
export async function clearAllParticipants() {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    // La suppression en cascade s'occupera des présences et résultats
    const { error } = await supabase
      .from('school_participants')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Supprime tout

    if (error) throw error;
    
    revalidatePath('/admin/bitcoin-school');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Récupérer les statistiques globales par ville
 */
export async function getSchoolStatsByCity() {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    // 1. Récupérer tous les participants avec leurs présences
    const { data: participants, error: pError } = await supabase
      .from('school_participants')
      .select('city, attendance:school_attendance(day_1, day_2, day_3)');

    if (pError) throw pError;

    // 2. Récupérer tous les résultats d'examen avec la ville du participant
    const { data: results, error: rError } = await supabase
      .from('school_exam_results')
      .select('score, participant:school_participants(city)');

    if (rError) throw rError;

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

    results?.forEach(r => {
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
