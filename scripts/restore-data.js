const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndRestoreData() {
  try {
    console.log('🔍 Vérification des backups Supabase...');
    
    // 1. Vérifier s'il y a des points de récupération (time travel)
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'school_participants');
    
    if (tablesError) {
      console.error('Erreur vérification tables:', tablesError);
      return;
    }
    
    console.log('✅ Tables trouvées:', tables?.length || 0);
    
    // 2. Vérifier les données actuelles
    const { data: currentData, error: dataError } = await supabase
      .from('school_participants')
      .select('*')
      .eq('city', 'Abomey-Calavi');
    
    if (dataError) {
      console.error('Erreur vérification données:', dataError);
      return;
    }
    
    console.log(`📊 Participants actuels à Abomey-Calavi: ${currentData?.length || 0}`);
    
    // 3. Essayer de récupérer depuis le backup si disponible
    // Note: Ceci dépend de votre plan Supabase et configuration
    
    console.log('\n📋 Options de récupération:');
    console.log('1. Si vous avez un backup manuel (CSV/Excel), utilisez la fonction d\'import');
    console.log('2. Si Supabase a des backups automatiques, contactez le support Supabase');
    console.log('3. Si vous avez les données dans un autre système, nous pouvons les importer');
    
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

checkAndRestoreData();
