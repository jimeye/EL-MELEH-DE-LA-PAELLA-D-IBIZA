// Script pour maintenir Upstash actif via les API du site
// À lancer avec: node utils/keep_upstash_alive_simple.js
// Ou en mode continu: node utils/keep_upstash_alive_simple.js --continuous
// Ou avec intervalle personnalisé: node utils/keep_upstash_alive_simple.js --interval 3600000 (1 heure)

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3002'; // URL de votre serveur local

console.log('🚀 Script de maintenance Upstash via API...');

// Fonction pour faire une requête HTTP
function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'User-Agent': 'Upstash-Keep-Alive-Script'
      }
    };

    const req = (urlObj.protocol === 'https:' ? https : http).request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Fonction pour générer du trafic
async function generateTraffic() {
  try {
    const timestamp = new Date().toLocaleString('fr-FR');
    console.log(`🔄 [${timestamp}] Génération de trafic via les API...`);
    
    // 1. Test de l'API check-counter
    console.log('📊 Test API check-counter...');
    const counterResponse = await makeRequest(`${BASE_URL}/api/check-counter`);
    console.log('✅ Check-counter:', counterResponse.statusCode);
    
    // 2. Test de l'API generate-order-number
    console.log('🔢 Test API generate-order-number...');
    const orderResponse = await makeRequest(`${BASE_URL}/api/generate-order-number`);
    console.log('✅ Generate-order-number:', orderResponse.statusCode);
    
    // 3. Test de l'API get-commandes
    console.log('📋 Test API get-commandes...');
    const commandesResponse = await makeRequest(`${BASE_URL}/api/get-commandes`);
    console.log('✅ Get-commandes:', commandesResponse.statusCode);
    
    // 4. Test de l'API admin-commandes
    console.log('👨‍💼 Test API admin-commandes...');
    const adminResponse = await makeRequest(`${BASE_URL}/api/admin-commandes`);
    console.log('✅ Admin-commandes:', adminResponse.statusCode);
    
    console.log('🎉 Trafic généré avec succès !');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération de trafic:', error.message);
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Démarrage du script de maintenance...');
  console.log('URL cible:', BASE_URL);
  
  // Déterminer l'intervalle
  let interval = 6 * 60 * 60 * 1000; // 6 heures par défaut
  const intervalArg = process.argv.find(arg => arg.startsWith('--interval='));
  if (intervalArg) {
    interval = parseInt(intervalArg.split('=')[1]);
  }
  
  const isContinuous = process.argv.includes('--continuous') || process.argv.includes('--cont');
  
  // Test initial
  const success = await generateTraffic();
  
  if (!success) {
    console.error('❌ Échec du test initial');
    process.exit(1);
  }
  
  // Mode continu si demandé
  if (isContinuous) {
    const hours = interval / (60 * 60 * 1000);
    console.log(`🔄 Mode continu activé - Génération de trafic toutes les ${hours} heures...`);
    
    // Générer du trafic à l'intervalle spécifié
    setInterval(async () => {
      await generateTraffic();
    }, interval);
    
    console.log(`⏰ Prochaine génération dans ${hours} heures...`);
    console.log('💡 Appuyez sur Ctrl+C pour arrêter le script');
    
    // Garder le script en vie
    process.stdin.resume();
  } else {
    console.log('✅ Script terminé avec succès');
    console.log('💡 Pour le mode continu, utilisez: node utils/keep_upstash_alive_simple.js --continuous');
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