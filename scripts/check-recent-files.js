// VÉRIFICATION DES FICHIERS RÉCENTS POUR TROUVER LES DONNÉES
const fs = require('fs');
const path = require('path');

console.log('🔍 RECHERCHE DE FICHIERS RÉCENTS POUR ABOMEY-CALAVI');
console.log('');

// Dossiers à vérifier
const foldersToCheck = [
  './',
  './Downloads',
  './Documents',
  './Desktop',
  './backup',
  './data'
];

// Extensions de fichiers à chercher
const fileExtensions = ['.csv', '.xlsx', '.xls', '.json', '.txt', '.sql'];

// Fonction pour vérifier si un fichier est récent (aujourd'hui)
function isRecent(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const fileDate = new Date(stats.mtime);
    const today = new Date();
    return fileDate.toDateString() === today.toDateString();
  } catch {
    return false;
  }
}

console.log('📁 RECHERCHE DE FICHIERS RÉCENTS...');
let foundFiles = [];

foldersToCheck.forEach(folder => {
  if (fs.existsSync(folder)) {
    try {
      const files = fs.readdirSync(folder);
      files.forEach(file => {
        const filePath = path.join(folder, file);
        const ext = path.extname(file).toLowerCase();
        
        if (fileExtensions.includes(ext) && isRecent(filePath)) {
          foundFiles.push({
            file: filePath,
            size: fs.statSync(filePath).size,
            modified: fs.statSync(filePath).mtime
          });
        }
      });
    } catch (error) {
      console.log(`Erreur lecture ${folder}: ${error.message}`);
    }
  }
});

if (foundFiles.length > 0) {
  console.log('\n✅ FICHIERS RÉCENTS TROUVÉS:');
  foundFiles.forEach(item => {
    console.log(`📄 ${item.file}`);
    console.log(`   Taille: ${item.size} bytes`);
    console.log(`   Modifié: ${item.modified.toLocaleString()}`);
    console.log('');
  });
  
  console.log('🎯 ACTION RECOMMANDÉE:');
  console.log('1. Ouvrez ces fichiers un par un');
  console.log('2. Cherchez "Abomey-Calavi" ou "Calavi"');
  console.log('3. Si trouvé, préparez pour réimportation');
} else {
  console.log('\n❌ Aucun fichier récent trouvé');
  console.log('\n🔄 AUTRES OPTIONS:');
  console.log('1. Vérifiez votre email (fichiers joints)');
  console.log('2. Vérifiez la corbeille de votre ordinateur');
  console.log('3. Demandez aux autres admins s\'ils ont les données');
  console.log('4. Vérifiez WhatsApp/Telegram pour les partages');
}

console.log('\n📋 INSTRUCTIONS SI VOUS TROUVEZ DES DONNÉES:');
console.log('1. Nettoyez le fichier (gardez seulement Abomey-Calavi)');
console.log('2. Format CSV: nom,email,téléphone,ville');
console.log('3. Utilisez "Importer CSV" dans l\'admin');
console.log('4. Vérifiez que tout est bien importé');
