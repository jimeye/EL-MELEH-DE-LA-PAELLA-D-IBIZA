// Script pour maintenir Supabase actif
// À lancer avec: node utils/keep_supabase_alive.js
// Ou en mode continu: node utils/keep_supabase_alive.js --continuous

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Vérification des variables d'environnement
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌');
  process.exit(1);
}

// Initialisation Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Fonction pour générer du trafic
async function generateTraffic() {
  try {
    console.log('🔄 Génération de trafic Supabase...');
    
    // 1. Test de connexion
    const { data: testData, error: testError } = await supabase
      .from('commandes')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('⚠️ Erreur de connexion:', testError.message);
      return false;
    }
    
    console.log('✅ Connexion Supabase établie');
    
    // 2. Lecture de données (simulation)
    const { data: readData, error: readError } = await supabase
      .from('commandes')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.log('⚠️ Erreur de lecture:', readError.message);
    } else {
      console.log('✅ Données lues:', readData?.length || 0, 'commandes');
    }
    
    // 3. Test d'écriture (optionnel - pour maintenir l'activité)
    const timestamp = new Date().toISOString();
    const testRecord = {
      test_maintenance: true,
      timestamp: timestamp,
      message: 'Maintenance automatique Supabase'
    };
    
    // Note: On ne fait pas d'écriture réelle pour éviter de polluer la DB
    console.log('✅ Test d\'écriture simulé');
    
    console.log('🎉 Trafic Supabase généré avec succès !');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération de trafic:', error.message);
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage du script de maintenance Supabase...');
  console.log('URL Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configuré' : '❌ Non configuré');
  
  // Test initial
  const success = await generateTraffic();
  
  if (!success) {
    console.error('❌ Échec du test initial');
    process.exit(1);
  }
  
  // Mode continu
  if (process.argv.includes('--continuous')) {
    console.log('🔄 Mode continu activé (6 heures par défaut)');
    
    const interval = process.argv.includes('--interval') 
      ? parseInt(process.argv[process.argv.indexOf('--interval') + 1]) 
      : 6 * 60 * 60 * 1000; // 6 heures par défaut
    
    console.log(`⏰ Intervalle: ${interval / (60 * 60 * 1000)} heures`);
    
    setInterval(async () => {
      console.log('\n🔄 Génération de trafic périodique...');
      console.log('⏰', new Date().toISOString());
      
      const success = await generateTraffic();
      if (!success) {
        console.log('⚠️ Échec de la génération de trafic');
      }
      
      console.log(`⏰ Prochaine génération dans ${interval / (60 * 60 * 1000)} heures`);
    }, interval);
    
    // Première exécution immédiate
    console.log('🚀 Première génération de trafic...');
    await generateTraffic();
    
  } else {
    console.log('✅ Test unique terminé');
  }
}

main().catch(console.error); 