// Script de maintenance pour GitHub Actions
// Optimisé pour l'exécution automatique

console.log('🚀 GitHub Actions - Maintenance des bases de données');
console.log('⏰', new Date().toISOString());

// Test Upstash
async function testUpstash() {
  try {
    console.log('📊 Test Upstash...');
    
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.log('⚠️ Variables Upstash non configurées');
      console.log('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? '✅' : '❌');
      console.log('UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? '✅' : '❌');
      return false;
    }

    console.log('📦 Import Redis...');
    const { Redis } = require('@upstash/redis');

    console.log('🔗 Connexion Redis...');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Générer du trafic
    const timestamp = new Date().toISOString();
    console.log('📝 Écriture données...');
    await redis.set('github_actions_maintenance', timestamp);
    await redis.incr('maintenance_counter');
    
    console.log('✅ Upstash maintenu actif');
    return true;
    
  } catch (error) {
    console.log('❌ Erreur Upstash:', error.message);
    console.log('❌ Stack trace:', error.stack);
    return false;
  }
}

// Test Supabase
async function testSupabase() {
  try {
    console.log('📊 Test Supabase...');
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('⚠️ Variables Supabase non configurées');
      console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌');
      console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌');
      return false;
    }

    console.log('📦 Import Supabase...');
    const { createClient } = require('@supabase/supabase-js');
    
    console.log('🔗 Connexion Supabase...');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Test de connexion
    console.log('📝 Test requête...');
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
    console.log('❌ Stack trace:', error.stack);
    return false;
  }
}

// Exécution
async function main() {
  try {
    console.log('🚀 Démarrage de la maintenance...');
    
    const upstashSuccess = await testUpstash();
    const supabaseSuccess = await testSupabase();
    
    console.log('📊 Résultats:');
    console.log('   Upstash:', upstashSuccess ? '✅' : '❌');
    console.log('   Supabase:', supabaseSuccess ? '✅' : '❌');
    
    if (upstashSuccess || supabaseSuccess) {
      console.log('🎉 Maintenance réussie !');
      process.exit(0);
    } else {
      console.log('⚠️ Aucune base maintenue');
      process.exit(1);
    }
  } catch (error) {
    console.log('💥 Erreur fatale:', error.message);
    console.log('💥 Stack trace:', error.stack);
    process.exit(1);
  }
}

main(); 