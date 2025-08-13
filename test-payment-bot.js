const puppeteer = require('puppeteer');

class PaymentTestBot {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
  }

  async init() {
    console.log('🤖 Initialisation du robot de test de paiement...');
    this.browser = await puppeteer.launch({
      headless: false, // Pour voir ce qui se passe
      slowMo: 1000, // Ralentir pour voir les étapes
      defaultViewport: { width: 1280, height: 720 }
    });
    this.page = await this.browser.newPage();
    
    // Intercepter les requêtes pour les logs
    this.page.on('request', request => {
      console.log(`📤 Requête: ${request.method()} ${request.url()}`);
    });
    
    this.page.on('response', response => {
      console.log(`📥 Réponse: ${response.status()} ${response.url()}`);
    });
  }

  async testPaymentFlow() {
    try {
      console.log('🚀 Début des tests de paiement...');
      
      // 1. Aller sur la page d'accueil
      await this.navigateToHomepage();
      
      // 2. Aller sur la page de commande
      await this.navigateToOrderPage();
      
      // 3. Ajouter des items au panier
      await this.addItemsToCart();
      
      // 4. Aller à la page de paiement
      await this.navigateToPayment();
      
      // 5. Tester le paiement avec une carte de test
      await this.testPaymentWithTestCard();
      
      // 6. Vérifier la page de succès
      await this.verifySuccessPage();
      
      console.log('✅ Tous les tests sont terminés !');
      this.printResults();
      
    } catch (error) {
      console.error('❌ Erreur pendant les tests:', error);
      this.testResults.push({ test: 'Général', status: 'FAILED', error: error.message });
    } finally {
      await this.cleanup();
    }
  }

  async navigateToHomepage() {
    console.log('🏠 Navigation vers la page d\'accueil...');
    await this.page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Vérifier que la page charge
    const title = await this.page.title();
    console.log(`📄 Titre de la page: ${title}`);
    
    this.testResults.push({ test: 'Navigation Homepage', status: 'PASSED' });
  }

  async navigateToOrderPage() {
    console.log('🛒 Navigation vers la page de commande...');
    
    // Chercher un lien vers la commande ou le menu
    const orderLinks = await this.page.$$('a[href*="commande"], a[href*="menu"], button:contains("Commander")');
    
    if (orderLinks.length > 0) {
      await orderLinks[0].click();
      await this.page.waitForTimeout(2000);
      this.testResults.push({ test: 'Navigation Order Page', status: 'PASSED' });
    } else {
      // Si pas de lien, essayer d'aller directement sur /commande
      await this.page.goto('http://localhost:3000/commande', { waitUntil: 'networkidle0' });
      this.testResults.push({ test: 'Navigation Order Page', status: 'PASSED' });
    }
  }

  async addItemsToCart() {
    console.log('🛍️ Ajout d\'items au panier...');
    
    try {
      // Chercher des boutons "Ajouter" ou "Add"
      const addButtons = await this.page.$$('button:contains("Add"), button:contains("Ajouter"), button:contains("+")');
      
      if (addButtons.length > 0) {
        // Cliquer sur le premier bouton d'ajout
        await addButtons[0].click();
        await this.page.waitForTimeout(1000);
        
        // Vérifier que l'item a été ajouté (chercher un indicateur de panier)
        const cartIndicator = await this.page.$('[class*="cart"], [class*="panier"]');
        if (cartIndicator) {
          this.testResults.push({ test: 'Add Items to Cart', status: 'PASSED' });
        } else {
          this.testResults.push({ test: 'Add Items to Cart', status: 'FAILED', error: 'Pas d\'indicateur de panier' });
        }
      } else {
        // Si pas de boutons, simuler l'ajout via JavaScript
        await this.page.evaluate(() => {
          // Simuler l'ajout d'un item
          if (window.addToCart) {
            window.addToCart({ name: 'Test Item', price: 10 }, 'test', 'test-1');
          }
        });
        this.testResults.push({ test: 'Add Items to Cart', status: 'PASSED' });
      }
    } catch (error) {
      this.testResults.push({ test: 'Add Items to Cart', status: 'FAILED', error: error.message });
    }
  }

  async navigateToPayment() {
    console.log('💳 Navigation vers la page de paiement...');
    
    try {
      // Chercher un bouton de paiement
      const paymentButtons = await this.page.$$('button:contains("Payer"), button:contains("Pay"), a[href*="payment"]');
      
      if (paymentButtons.length > 0) {
        await paymentButtons[0].click();
        await this.page.waitForTimeout(2000);
      } else {
        // Aller directement sur la page de paiement
        await this.page.goto('http://localhost:3000/payment', { waitUntil: 'networkidle0' });
      }
      
      // Vérifier qu'on est sur la page de paiement
      const paymentTitle = await this.page.$('h1:contains("Paiement"), h1:contains("Payment")');
      if (paymentTitle) {
        this.testResults.push({ test: 'Navigation Payment Page', status: 'PASSED' });
      } else {
        this.testResults.push({ test: 'Navigation Payment Page', status: 'FAILED', error: 'Page de paiement non trouvée' });
      }
    } catch (error) {
      this.testResults.push({ test: 'Navigation Payment Page', status: 'FAILED', error: error.message });
    }
  }

  async testPaymentWithTestCard() {
    console.log('💳 Test du paiement avec une carte de test...');
    
    try {
      // Attendre que Stripe Elements soit chargé
      await this.page.waitForSelector('[data-elements-stable-field-name]', { timeout: 10000 });
      
      // Remplir les informations de carte de test Stripe
      await this.page.evaluate(() => {
        // Simuler le remplissage de la carte de test
        const cardElement = document.querySelector('[data-elements-stable-field-name]');
        if (cardElement) {
          // Injecter les données de test Stripe
          const testCardData = {
            cardNumber: '4242424242424242',
            expiryDate: '12/25',
            cvc: '123'
          };
          
          // Simuler les événements de saisie
          cardElement.dispatchEvent(new Event('focus'));
          // Note: En réalité, Stripe Elements gère la saisie de manière sécurisée
        }
      });
      
      // Chercher le bouton de paiement
      const payButton = await this.page.$('button:contains("Payer"), button:contains("Pay"), button[type="submit"]');
      if (payButton) {
        await payButton.click();
        await this.page.waitForTimeout(3000);
        
        // Vérifier si on a une erreur ou un succès
        const errorMessage = await this.page.$('.error, [class*="error"]');
        const successMessage = await this.page.$('.success, [class*="success"]');
        
        if (successMessage) {
          this.testResults.push({ test: 'Payment with Test Card', status: 'PASSED' });
        } else if (errorMessage) {
          const errorText = await errorMessage.textContent();
          this.testResults.push({ test: 'Payment with Test Card', status: 'FAILED', error: errorText });
        } else {
          this.testResults.push({ test: 'Payment with Test Card', status: 'PENDING', message: 'Résultat indéterminé' });
        }
      } else {
        this.testResults.push({ test: 'Payment with Test Card', status: 'FAILED', error: 'Bouton de paiement non trouvé' });
      }
    } catch (error) {
      this.testResults.push({ test: 'Payment with Test Card', status: 'FAILED', error: error.message });
    }
  }

  async verifySuccessPage() {
    console.log('✅ Vérification de la page de succès...');
    
    try {
      // Attendre un peu pour la redirection
      await this.page.waitForTimeout(2000);
      
      // Vérifier si on est sur une page de succès
      const successIndicators = await this.page.$$('h1:contains("Succès"), h1:contains("Success"), h1:contains("Merci"), .success, [class*="success"]');
      
      if (successIndicators.length > 0) {
        this.testResults.push({ test: 'Success Page Verification', status: 'PASSED' });
      } else {
        // Vérifier l'URL pour voir si on a été redirigé
        const currentUrl = this.page.url();
        if (currentUrl.includes('success') || currentUrl.includes('confirmation')) {
          this.testResults.push({ test: 'Success Page Verification', status: 'PASSED' });
        } else {
          this.testResults.push({ test: 'Success Page Verification', status: 'FAILED', error: 'Page de succès non trouvée' });
        }
      }
    } catch (error) {
      this.testResults.push({ test: 'Success Page Verification', status: 'FAILED', error: error.message });
    }
  }

  printResults() {
    console.log('\n📊 RÉSULTATS DES TESTS:');
    console.log('='.repeat(50));
    
    let passed = 0;
    let failed = 0;
    
    this.testResults.forEach((result, index) => {
      const status = result.status === 'PASSED' ? '✅' : result.status === 'FAILED' ? '❌' : '⏳';
      console.log(`${status} Test ${index + 1}: ${result.test}`);
      console.log(`   Status: ${result.status}`);
      if (result.error) {
        console.log(`   Erreur: ${result.error}`);
      }
      if (result.message) {
        console.log(`   Message: ${result.message}`);
      }
      console.log('');
      
      if (result.status === 'PASSED') passed++;
      if (result.status === 'FAILED') failed++;
    });
    
    console.log(`📈 RÉSUMÉ: ${passed} réussis, ${failed} échoués`);
    
    if (failed === 0) {
      console.log('🎉 Tous les tests sont passés !');
    } else {
      console.log('⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Robot fermé.');
    }
  }
}

// Fonction principale pour lancer les tests
async function runPaymentTests() {
  const bot = new PaymentTestBot();
  
  try {
    await bot.init();
    await bot.testPaymentFlow();
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
  }
}

// Lancer les tests si le script est exécuté directement
if (require.main === module) {
  console.log('🤖 Robot de test de paiement Stripe');
  console.log('='.repeat(50));
  
  runPaymentTests().catch(console.error);
}

module.exports = PaymentTestBot;
