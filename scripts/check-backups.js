// Vérification des backups disponibles
const fs = require('fs');

console.log('🔍 VÉRIFICATION DES BACKUPS DISPONIBLES');
console.log('');

// 1. Vérifier les fichiers locaux
const backupFiles = [
  'backup-2025.sql',
  'bitcoin-school-backup.sql',
  'supabase-backup.sql',
  'participants-backup.csv',
  'abomey-calavi-data.csv'
];

console.log('📁 Fichiers de backup locaux:');
backupFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`✅ ${file} (${stats.size} bytes, modifié: ${stats.mtime.toLocaleDateString()})`);
  } else {
    console.log(`❌ ${file} (non trouvé)`);
  }
});

console.log('');
console.log('💾 BACKUP MANUEL RECOMMANDÉ:');
console.log('Créez immédiatement un backup des données restantes:');
console.log('1. Export CSV de toutes les villes (sauf Abomey-Calavi)');
console.log('2. Screenshot des statistiques actuelles');
console.log('3. Sauvegarde des questions d\'examen');
