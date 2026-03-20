// SCRIPT DE RECONSTRUCTION MANUELLE DES DONNÉES ABOMEY-CALAVI
const fs = require('fs');

console.log('🔧 RECONSTRUCTION MANUELLE - ABOMEY-CALAVI');
console.log('');

// Template pour reconstruire les données
const reconstructionTemplate = {
  timestamp: new Date().toISOString(),
  city: 'Abomey-Calavi',
  session_year: 2025,
  instructions: `
📋 INSTRUCTIONS POUR RECONSTRUCTION MANUELLE:

1. 🔍 CHERCHER LES DONNÉES:
   - Vérifiez votre email aujourd'hui
   - Vérifiez WhatsApp/Telegram
   - Demandez aux autres admins
   - Regardez dans Downloads/Documents

2. 📝 FORMAT POUR RÉIMPORTATION:
   Créez un fichier CSV avec ce format exact:
   nom,email,téléphone,ville
   
   Exemple:
   "Jean Dupont","jean.dupont@email.com","22912345678","Abomey-Calavi"
   "Marie Adegnon","marie.a@email.com","22987654321","Abomey-Calavi"

3. 🚀 IMPORTATION:
   - Allez dans Admin → Bitcoin School → 2025 → Abomey-Calavi
   - Cliquez "Importer un fichier CSV"
   - Sélectionnez votre fichier
   - Vérifiez que tout s'importe correctement

4. ✅ PRÉSENCE ET EXAMEN:
   Une fois importés, vous devrez:
   - Cocher manuellement les présences (si vous les connaissez)
   - Noter manuellement les résultats (si vous les avez)

🎯 QUESTIONS À VOUS POSER:
   - Avez-vous les noms des participants?
   - Avez-vous leurs emails?
   - Avez-vous leurs numéros?
   - Qui a ajouté ces participants?
   - Quand ont-ils été ajoutés?
   
💡 ASTUCE: Même une liste partielle est mieux que rien!
`,
  template: [
    {
      nom: "Nom du participant",
      email: "email@exemple.com", 
      telephone: "229XXXXXXXX",
      ville: "Abomey-Calavi"
    }
  ]
};

// Créer le fichier de reconstruction
const reconstructionFile = `reconstruction-abomey-calavi-${Date.now()}.json`;
fs.writeFileSync(reconstructionFile, JSON.stringify(reconstructionTemplate, null, 2));

console.log(`✅ Fichier de reconstruction créé: ${reconstructionFile}`);
console.log('');
console.log('🎯 ACTIONS IMMÉDIATES:');
console.log('1. Cherchez les données dans vos emails/messages');
console.log('2. Demandez aux autres administrateurs');
console.log('3. Vérifiez les fichiers récents sur votre ordinateur');
console.log('4. Utilisez le template ci-dessus pour reconstruire');
console.log('');
console.log('📞 CONTACTS À VÉRIFIER:');
console.log('- Autres admins Bitcoin School');
console.log('- Participants potentiels (si vous connaissez des noms)');
console.log('- Emails de confirmation envoyés aujourd\'hui');
console.log('');
console.log('⏰ RAPPEL: Même une reconstruction partielle est utile!');
