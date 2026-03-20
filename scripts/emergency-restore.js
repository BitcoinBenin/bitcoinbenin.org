// SCRIPT D'URGENCE POUR RESTAURATION
// À exécuter rapidement pour maximiser les chances de récupération

console.log('🚨 PLAN D\'ACTION IMMÉDIAT 🚨');
console.log('');
console.log('1. CONTACTER SUPABASE SUPPORT (URGENT):');
console.log('   - Email: support@supabase.com');
console.log('   - Dashboard: dashboard.supabase.com → Support');
console.log('   - Mentionner: "Restauration de données supprimées accidentellement"');
console.log('');
console.log('2. FOURNIR CES INFORMATIONS:');
console.log('   - Projet ID: ' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]);
console.log('   - Tables affectées: school_participants, school_attendance, school_exam_results');
console.log('   - Ville concernée: Abomey-Calavi');
console.log('   - Période: Session 2025');
console.log('   - Heure de suppression: ' + new Date().toLocaleString());
console.log('');
console.log('3. DEMANDER RESTAURATION:');
console.log('   - Point dans le temps (time travel) avant la suppression');
console.log('   - Ou backup le plus récent');
console.log('');
console.log('⏰ AGISSEZ RAPIDEMENT - Plus vite vous contactez, plus de chances de récupération!');
