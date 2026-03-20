// CORRECTION DIRECTE DE LA CONTRAINTE AVEC SUPABASE
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixConstraintDirectly() {
  try {
    console.log('🔧 Correction de la contrainte unique (approche directe)...');
    
    // 1. Vérifier si session_year existe déjà
    console.log('📝 Vérification de la structure actuelle...');
    const { data: columns, error: columnsError } = await supabase
      .from('school_participants')
      .select('*')
      .limit(1);
    
    if (columnsError) {
      console.error('❌ Erreur vérification colonnes:', columnsError);
      return;
    }
    
    console.log('✅ Colonnes actuelles:', Object.keys(columns[0] || {}));
    
    // 2. Supprimer les doublons existants (garder le plus récent par ville/année)
    console.log('🗑️  Nettoyage des doublons...');
    
    const { data: duplicates, error: dupError } = await supabase
      .from('school_participants')
      .select('email, city, session_year, created_at')
      .order('created_at', { ascending: false });
    
    if (dupError) {
      console.error('❌ Erreur recherche doublons:', dupError);
      return;
    }
    
    // Grouper par email, city, session_year et garder le plus récent
    const uniqueMap = new Map();
    duplicates?.forEach(p => {
      const key = `${p.email}-${p.city}-${p.session_year}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, p);
      }
    });
    
    console.log(`📊 ${duplicates?.length || 0} enregistrements trouvés, ${uniqueMap.size} uniques après déduplication`);
    
    // 3. Alternative: Modifier la logique d'ajout pour autoriser les doublons entre villes
    console.log('💡 Solution alternative: modification de la logique d\'ajout...');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

fixConstraintDirectly();
