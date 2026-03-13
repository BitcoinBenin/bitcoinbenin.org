'use server';

import { supabaseAdmin as supabase } from '@/lib/supabase';

export interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
}

/**
 * Vérifier si un participant peut passer l'examen
 */
export async function validateParticipantForExam(email: string) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    const { data: participant, error } = await supabase
      .from('school_participants')
      .select('*, attendance:school_attendance(*)')
      .eq('email', email)
      .single();

    if (error || !participant) {
      return { success: false, error: 'Email non trouvé dans la liste des participants.' };
    }

    // Optionnel: Vérifier si déjà passé
    const { data: result } = await supabase
      .from('school_exam_results')
      .select('id')
      .eq('participant_id', participant.id)
      .single();

    if (result) {
      return { success: false, error: 'Vous avez déjà passé cet examen.' };
    }

    // Optionnel: Vérifier la présence (par exemple au moins 2 jours sur 3)
    const att = participant.attendance?.[0];
    const presenceCount = [att?.day_1, att?.day_2, att?.day_3].filter(Boolean).length;
    
    if (presenceCount < 2) {
      return { success: false, error: 'Votre taux de présence est insuffisant pour passer l\'examen (min 2/3 jours).' };
    }

    return { success: true, participantId: participant.id };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Récupérer les 21 questions
 */
export async function getExamQuestions() {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    const { data, error } = await supabase
      .from('school_exam_questions')
      .select('*')
      .limit(21);

    if (error) throw error;
    
    // Mélanger les questions
    const shuffled = data.sort(() => 0.5 - Math.random());
    
    return { success: true, questions: shuffled };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Enregistrer le résultat de l'examen
 */
export async function submitExamResult(participantId: string, questionsCorrect: number, durationSeconds: number) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    // 1. Récupérer la présence pour calculer les points
    const { data: attendance } = await supabase
      .from('school_attendance')
      .select('*')
      .eq('participant_id', participantId)
      .single();

    let attendancePoints = 0;
    if (attendance) {
      if (attendance.day_1) attendancePoints += 4;
      if (attendance.day_2) attendancePoints += 6;
      if (attendance.day_3) attendancePoints += 6;
    }

    // 2. Calculer le score final (QCM: 4 points par question correcte)
    const examPoints = questionsCorrect * 4;
    const totalScore = attendancePoints + examPoints;

    const { error } = await supabase
      .from('school_exam_results')
      .insert([{
        participant_id: participantId,
        score: totalScore,
        total_questions: 21,
        completed_at: new Date().toISOString(),
        duration_seconds: durationSeconds
      }]);

    if (error) throw error;
    return { success: true, totalScore };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}
