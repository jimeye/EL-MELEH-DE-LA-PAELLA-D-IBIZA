// Script simple pour tester Upstash Redis
// À lancer avec: node utils/test_upstash.js

const { Redis } = require('@upstash/redis');

console.log('🧪 Test rapide Upstash Redis...');

// Vérification des variables d'environnement
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.error('❌ Variables d\'environnement Upstash manquantes');
  console.error('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? '✅' : '❌');
  console.error('UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? '✅' : '❌');
  console.log('\n💡 Pour configurer les variables, créez un fichier .env.local avec :');
  console.log('UPSTASH_REDIS_REST_URL=votre_url_upstash');
  console.log('UPSTASH_REDIS_REST_TOKEN=votre_token_upstash');
  process.exit(1);
}

// Initialisation Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function testUpstash() {
  try {
    console.log('🔄 Test de connexion...');
    
    // Test simple : écrire et lire une valeur
    const testValue = `test_${Date.now()}`;
    await redis.set('test_key', testValue);
    console.log('✅ Écriture réussie');
    
    const readValue = await redis.get('test_key');
    console.log('✅ Lecture réussie:', readValue);
    
    // Nettoyer
    await redis.del('test_key');
    console.log('✅ Nettoyage réussi');
    
    console.log('🎉 Test Upstash réussi ! Base de données active.');
    
  } catch (error) {
    console.error('❌ Erreur Upstash:', error.message);
    process.exit(1);
  }
}

testUpstash(); 