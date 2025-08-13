// Script pour maintenir Upstash Redis actif
// À lancer avec: node utils/keep_upstash_alive.js
// Ou en mode continu: node utils/keep_upstash_alive.js --continuous

const { Redis } = require('@upstash/redis');
require('dotenv').config();

// Vérification des variables d'environnement
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.error('❌ Variables d\'environnement Upstash manquantes');
  console.error('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? '✅' : '❌');
  console.error('UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? '✅' : '❌');
  process.exit(1);
}

// Initialisation Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Fonction pour générer du trafic
async function generateTraffic() {
  try {
    console.log('🔄 Génération de trafic Upstash...');
    
    // 1. Écrire une clé de test
    const timestamp = new Date().toISOString();
    await redis.set('keep_alive_timestamp', timestamp);
    console.log('✅ Timestamp écrit:', timestamp);
    
    // 2. Lire la clé
    const readTimestamp = await redis.get('keep_alive_timestamp');
    console.log('✅ Timestamp lu:', readTimestamp);
    
    // 3. Incrémenter un compteur
    const counter = await redis.incr('keep_alive_counter');
    console.log('✅ Compteur incrémenté:', counter);
    
    // 4. Écrire des données de test
    const testData = {
      type: 'keep_alive',
      timestamp: timestamp,
      counter: counter,
      message: 'Base de données maintenue active'
    };
    await redis.set('keep_alive_data', JSON.stringify(testData));
    console.log('✅ Données de test écrites');
    
    // 5. Lire les données
    const readData = await redis.get('keep_alive_data');
    console.log('✅ Données lues:', readData);
    
    // 6. Lister quelques clés
    const keys = await redis.keys('keep_alive_*');
    console.log('✅ Clés trouvées:', keys.length, 'clés');
    
    console.log('🎉 Trafic généré avec succès !');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération de trafic:', error.message);
    return false;
  }
}

// Fonction pour nettoyer les anciennes données de test
async function cleanupTestData() {
  try {
    console.log('🧹 Nettoyage des anciennes données de test...');
    
    const keys = await redis.keys('keep_alive_*');
    if (keys.length > 0) {
      // Garder seulement les 5 dernières entrées
      const keysToDelete = keys.slice(0, -5);
      if (keysToDelete.length > 0) {
        await redis.del(...keysToDelete);
        console.log(`✅ ${keysToDelete.length} anciennes clés supprimées`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error.message);
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage du script de maintenance Upstash...');
  console.log('URL Upstash:', process.env.UPSTASH_REDIS_REST_URL ? '✅ Configuré' : '❌ Non configuré');
  
  // Test initial
  const success = await generateTraffic();
  
  if (!success) {
    console.error('❌ Échec du test initial');
    process.exit(1);
  }
  
  // Nettoyage
  await cleanupTestData();
  
  // Mode continu si demandé
  if (process.argv.includes('--continuous')) {
    console.log('🔄 Mode continu activé - Génération de trafic toutes les 6 heures...');
    
    // Générer du trafic toutes les 6 heures
    setInterval(async () => {
      await generateTraffic();
      await cleanupTestData();
    }, 6 * 60 * 60 * 1000); // 6 heures
    
    console.log('⏰ Prochaine génération dans 6 heures...');
  } else {
    console.log('✅ Script terminé avec succès');
    process.exit(0);
  }
}

// Gestion des erreurs
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du script...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du script...');
  process.exit(0);
});

// Lancement
main().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
}); 