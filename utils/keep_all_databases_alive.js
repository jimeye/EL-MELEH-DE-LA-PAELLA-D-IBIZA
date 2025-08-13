// Script combiné pour maintenir Upstash ET Supabase actifs
// À lancer avec: node utils/keep_all_databases_alive.js
// Ou en mode continu: node utils/keep_all_databases_alive.js --continuous

const { Redis } = require('@upstash/redis');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🚀 Script de maintenance combiné (Upstash + Supabase)...');
console.log('⏰', new Date().toISOString());

// Initialisation Upstash
let redis = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  console.log('✅ Upstash configuré');
} else {
  console.log('⚠️ Upstash non configuré');
}

// Initialisation Supabase
let supabase = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  console.log('✅ Supabase configuré');
} else {
  console.log('⚠️ Supabase non configuré');
}

// Fonction pour générer du trafic Upstash
async function generateUpstashTraffic() {
  if (!redis) {
    console.log('⚠️ Upstash non disponible');
    return false;
  }

  try {
    console.log('📊 Génération trafic Upstash...');
    
    // Générer du trafic
    const timestamp = new Date().toISOString();
    await redis.set('combined_maintenance_timestamp', timestamp);
    await redis.incr('combined_maintenance_counter');
    
    console.log('✅ Upstash maintenu actif');
    return true;
    
  } catch (error) {
    console.log('❌ Erreur Upstash:', error.message);
    return false;
  }
}

// Fonction pour générer du trafic Supabase
async function generateSupabaseTraffic() {
  if (!supabase) {
    console.log('⚠️ Supabase non disponible');
    return false;
  }

  try {
    console.log('📊 Génération trafic Supabase...');
    
    // Test de connexion
    const { data, error } = await supabase
      .from('commandes')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Erreur Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Supabase maintenu actif');
    return true;
    
  } catch (error) {
    console.log('❌ Erreur Supabase:', error.message);
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage de la maintenance combinée...');
  
  // Générer trafic Upstash
  const upstashSuccess = await generateUpstashTraffic();
  
  // Générer trafic Supabase
  const supabaseSuccess = await generateSupabaseTraffic();
  
  // Résultats
  console.log('\n📊 Résultats:');
  console.log('   Upstash:', upstashSuccess ? '✅' : '❌');
  console.log('   Supabase:', supabaseSuccess ? '✅' : '❌');
  
  if (upstashSuccess && supabaseSuccess) {
    console.log('🎉 Maintenance combinée réussie !');
  } else if (upstashSuccess || supabaseSuccess) {
    console.log('⚠️ Maintenance partielle réussie');
  } else {
    console.log('❌ Aucune base maintenue');
  }
  
  // Mode continu
  if (process.argv.includes('--continuous')) {
    console.log('\n🔄 Mode continu activé (6 heures par défaut)');
    
    const interval = process.argv.includes('--interval') 
      ? parseInt(process.argv[process.argv.indexOf('--interval') + 1]) 
      : 6 * 60 * 60 * 1000; // 6 heures par défaut
    
    console.log(`⏰ Intervalle: ${interval / (60 * 60 * 1000)} heures`);
    
    setInterval(async () => {
      console.log('\n🔄 Génération de trafic périodique...');
      console.log('⏰', new Date().toISOString());
      
      const upstashSuccess = await generateUpstashTraffic();
      const supabaseSuccess = await generateSupabaseTraffic();
      
      console.log('📊 Résultats périodiques:');
      console.log('   Upstash:', upstashSuccess ? '✅' : '❌');
      console.log('   Supabase:', supabaseSuccess ? '✅' : '❌');
      
      console.log(`⏰ Prochaine génération dans ${interval / (60 * 60 * 1000)} heures`);
    }, interval);
    
    // Première exécution immédiate
    console.log('🚀 Première génération de trafic...');
    await main();
    
  } else {
    console.log('✅ Test unique terminé');
  }
}

main().catch(console.error); 