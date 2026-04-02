// Vérification si les données existent encore (soft delete?)
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkIfDataExists() {
  try {
    console.log('🔍 VÉRIFICATION RAPIDE DES DONNÉES...');
    
    // 1. Vérifier TOUS les participants (peut-être que le filtre ne marchait pas)
    const { data: allParticipants, error: allError } = await supabase
      .from('school_participants')
      .select('*')
      .eq('session_year', 2025);
    
    if (allError) throw allError;
    
    console.log(`📊 Total participants 2025: ${allParticipants.length}`);
    
    // 2. Chercher spécifiquement Abomey-Calavi (différentes orthographes)
    const cityVariations = ['Abomey-Calavi', 'Abomey Calavi', 'Abomey', 'Calavi'];
    
    for (const city of cityVariations) {
      const { data: cityData, error: cityError } = await supabase
        .from('school_participants')
        .select('*')
        .eq('city', city)
        .eq('session_year', 2025);
      
      if (!cityError && cityData.length > 0) {
        console.log(`✅ TROUVÉ! ${cityData.length} participants à "${city}"`);
        console.log('Noms:', cityData.map(p => p.full_name).slice(0, 3));
        return cityData;
      }
    }
    
    // 3. Vérifier s'il y a des noms similaires
    const { data: similarNames, error: similarError } = await supabase
      .from('school_participants')
      .select('*')
      .eq('session_year', 2025)
      .ilike('city', '%abomey%');
    
    if (!similarError && similarNames.length > 0) {
      console.log(`🔍 Noms similaires trouvés: ${similarNames.length}`);
      console.log('Villes:', [...new Set(similarNames.map(p => p.city))]);
    }
    
    console.log('❌ Aucune donnée trouvée pour Abomey-Calavi');
    
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

checkIfDataExists();
