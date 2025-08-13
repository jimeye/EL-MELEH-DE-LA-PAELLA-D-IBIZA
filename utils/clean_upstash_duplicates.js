// Script pour ne garder que la dernière commande dans Upstash Redis
// À lancer avec: node utils/clean_upstash_duplicates.js

const { Redis } = require('@upstash/redis');

// Vérification des variables d'environnement
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? '✅' : '❌');
  console.error('UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? '✅' : '❌');
  process.exit(1);
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function keepLastOne() {
  try {
    const keyList = 'commandes';
    const commandeIds = await redis.lrange(keyList, 0, -1);
    
    console.log(`📋 Commandes trouvées: ${commandeIds.length}`);
    console.log(`📝 IDs: ${commandeIds.join(', ')}`);
    
    if (commandeIds.length <= 1) {
      console.log('✅ Il y a déjà 1 commande ou moins, rien à faire.');
      return;
    }
    
    // On garde seulement la première (la plus récente)
    const toKeep = commandeIds.slice(0, 1);
    const toDelete = commandeIds.slice(1);

    // Remplace la liste par la dernière
    await redis.del(keyList);
    await redis.lpush(keyList, toKeep[0]);
    
    console.log(`✅ Commande conservée: ${toKeep[0]}`);
    console.log(`🗑️ Commandes supprimées: ${toDelete.join(', ')}`);

    // Supprime les clés orphelines (commande:...) des commandes supprimées
    for (const id of toDelete) {
      const key = `commande:${id}`;
      await redis.del(key);
      console.log(`🗑️ Clé supprimée: ${key}`);
    }
    
    console.log('✅ Nettoyage terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

keepLastOne().then(() => process.exit(0)); 