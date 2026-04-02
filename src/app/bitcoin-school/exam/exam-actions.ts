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
export async function validateParticipantForExam(email: string, city: string, sessionYear: number) {
  if (!supabase) return { success: false, error: 'Supabase non configuré' };

  try {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Récupérer le participant (unique par ville + année)
    const { data: participant, error: pError } = await supabase
      .from('school_participants')
      .select('id, full_name')
      .ilike('email', cleanEmail)
      .eq('city', city)
      .eq('session_year', sessionYear)
      .single();

    if (pError || !participant) {
      return { success: false, error: 'Email non trouvé dans cette ville pour cette session. Vérifiez votre ville et votre email.' };
    }

    // 2. Vérifier si l'examen a déjà été passé
    const { data: result } = await supabase
      .from('school_exam_results')
      .select('*')
      .eq('participant_id', participant.id)
      .maybeSingle();

    if (result) {
      return { 
        success: true, 
        alreadyFinished: true, 
        participantId: participant.id,
        existingResult: result 
      };
    }

    // 3. Récupérer la présence
    const { data: att, error: aError } = await supabase
      .from('school_attendance')
      .select('day_1, day_2, day_3')
      .eq('participant_id', participant.id)
      .maybeSingle();

    if (aError || !att) {
      return { success: false, error: 'Données de présence non trouvées. Veuillez contacter un organisateur.' };
    }

    // 4. Validation des conditions de présence
    // Seule la présence au Jour 3 est obligatoire
    if (!att.day_3) {
      return { success: false, error: 'La présence au Jour 3 (aujourd\'hui) est obligatoire pour passer l\'examen.' };
    }

    return { success: true, alreadyFinished: false, participantId: participant.id };
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
export async function submitExamResult(participantId: string, questionsCorrect: number, durationSeconds: number, answers: Record<number, number>) {
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

    // 2. Calculer le score final
    const examPoints = questionsCorrect * 4;
    const totalScore = attendancePoints + examPoints;

    const { error } = await supabase
      .from('school_exam_results')
      .insert([{
        participant_id: participantId,
        score: totalScore,
        total_questions: 21,
        completed_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
        answers: answers
      }]);

    if (error) throw error;
    return { success: true, totalScore, attendancePoints, examPoints };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}
