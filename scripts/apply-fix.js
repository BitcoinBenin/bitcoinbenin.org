// SCRIPT POUR APPLIQUER LA CORRECTION DE CONTRAINTE
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixUniqueConstraint() {
  try {
    console.log('🔧 Correction de la contrainte unique...');
    
    // 1. Ajouter session_year si manquant
    console.log('📝 Vérification/Ajout de session_year...');
    const { error: addYearError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE school_participants ADD COLUMN IF NOT EXISTS session_year INTEGER NOT NULL DEFAULT 2026;'
    });
    
    if (addYearError) {
      console.log('⚠️  Erreur ajout session_year (déjà existant?):', addYearError.message);
    }
    
    // 2. Supprimer l'ancienne contrainte
    console.log('🗑️  Suppression de l\'ancienne contrainte...');
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE school_participants DROP CONSTRAINT IF EXISTS school_participants_email_key;'
    });
    
    if (dropError) {
      console.log('⚠️  Erreur suppression contrainte:', dropError.message);
    }
    
    // 3. Créer la nouvelle contrainte
    console.log('✨ Création de la nouvelle contrainte...');
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE school_participants ADD CONSTRAINT school_participants_email_city_year_unique UNIQUE (email, city, session_year);'
    });
    
    if (createError) {
      console.error('❌ Erreur création contrainte:', createError);
      return;
    }
    
    console.log('✅ Contrainte corrigée avec succès !');
    console.log('');
    console.log('🎯 Maintenant vous pouvez:');
    console.log('- Ajouter Wilfried dans plusieurs villes');
    console.log('- Le même email peut exister dans différentes villes');
    console.log('- La contrainte est: UNIQUE(email, city, session_year)');
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  }
}

fixUniqueConstraint();
