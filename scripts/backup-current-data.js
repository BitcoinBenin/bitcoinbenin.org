// SCRIPT DE SAUVEGARDE IMMÉDIATE DES DONNÉES RESTANTES
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function backupCurrentData() {
  try {
    console.log('🚨 SAUVEGARDE IMMÉDIATE DES DONNÉES RESTANTES...');
    
    // 1. Backup participants (toutes villes sauf Abomey-Calavi)
    const { data: participants, error: participantsError } = await supabase
      .from('school_participants')
      .select('*')
      .neq('city', 'Abomey-Calavi')
      .eq('session_year', 2025);
    
    if (participantsError) throw participantsError;
    
    console.log(`✅ ${participants.length} participants sauvegardés`);
    
    // 2. Backup attendance
    const { data: attendance, error: attendanceError } = await supabase
      .from('school_attendance')
      .select('*')
      .in('participant_id', participants.map(p => p.id));
    
    if (attendanceError) throw attendanceError;
    
    console.log(`✅ ${attendance.length} enregistrements de présence sauvegardés`);
    
    // 3. Backup exam results
    const { data: results, error: resultsError } = await supabase
      .from('school_exam_results')
      .select('*')
      .in('participant_id', participants.map(p => p.id));
    
    if (resultsError) throw resultsError;
    
    console.log(`✅ ${results.length} résultats d\'examen sauvegardés`);
    
    // 4. Sauvegarder dans des fichiers
    const backupData = {
      timestamp: new Date().toISOString(),
      participants,
      attendance,
      examResults: results,
      summary: {
        totalParticipants: participants.length,
        totalAttendance: attendance.length,
        totalResults: results.length,
        cities: [...new Set(participants.map(p => p.city))]
      }
    };
    
    fs.writeFileSync(`backup-${Date.now()}.json`, JSON.stringify(backupData, null, 2));
    
    console.log('\n📊 RÉSUMÉ DES DONNÉES SAUVEGARDÉES:');
    console.log(`- Participants: ${participants.length}`);
    console.log(`- Présences: ${attendance.length}`);
    console.log(`- Résultats: ${results.length}`);
    console.log(`- Villes: ${[...new Set(participants.map(p => p.city))].join(', ')}`);
    
    console.log('\n⚠️  DONNÉES PERDUES (Abomey-Calavi):');
    console.log('- Tous les participants de cette ville');
    console.log('- Toutes leurs données de présence');
    console.log('- Tous leurs résultats d\'examen');
    
  } catch (error) {
    console.error('❌ Erreur de backup:', error.message);
  }
}

backupCurrentData();
