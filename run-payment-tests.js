#!/usr/bin/env node

const PaymentTestBot = require('./test-payment-bot');

console.log('🤖 ROBOT DE TEST DE PAIEMENT STRIPE');
console.log('='.repeat(50));
console.log('');

// Vérifier que le serveur local est en cours d'exécution
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Serveur local détecté sur http://localhost:3000');
      return true;
    }
  } catch (error) {
    console.log('❌ Serveur local non détecté');
    console.log('💡 Assurez-vous que le serveur Next.js est en cours d\'exécution:');
    console.log('   npm run dev');
    return false;
  }
}

// Configuration des tests
const testConfig = {
  // Cartes de test Stripe
  testCards: [
    {
      name: 'Carte de succès',
      number: '4242424242424242',
      exp: '12/25',
      cvc: '123'
    },
    {
      name: 'Carte de déclin',
      number: '4000000000000002',
      exp: '12/25',
      cvc: '123'
    }
  ],
  
  // Scénarios de test
  scenarios: [
    {
      name: 'Test de paiement complet',
      description: 'Navigation complète du processus de commande'
    },
    {
      name: 'Test de validation en espèces',
      description: 'Test du mode validation sans paiement'
    }
  ]
};

// Fonction principale
async function main() {
  console.log('🔍 Vérification de l\'environnement...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('');
    console.log('🚀 Pour démarrer le serveur:');
    console.log('   npm run dev');
    console.log('');
    console.log('⏳ Attendez que le serveur soit prêt, puis relancez ce script.');
    process.exit(1);
  }
  
  console.log('');
  console.log('📋 Configuration des tests:');
  console.log(`   - ${testConfig.testCards.length} cartes de test`);
  console.log(`   - ${testConfig.scenarios.length} scénarios`);
  console.log('');
  
  // Lancer les tests
  const bot = new PaymentTestBot();
  
  try {
    await bot.init();
    await bot.testPaymentFlow();
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

// Gestion des signaux pour arrêter proprement
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du robot...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du robot...');
  process.exit(0);
});

// Lancer le programme
if (require.main === module) {
  main().catch(console.error);
}
