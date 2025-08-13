# 🤖 Guide du Robot de Test de Paiement Stripe

## 🎯 Objectif
Ce robot automatisé teste le système de paiement Stripe de votre site restaurant en local.

## 📋 Prérequis

### 1. Installation des dépendances
```bash
# Installer Puppeteer si pas déjà fait
npm install puppeteer
```

### 2. Configuration Stripe
Créer un fichier `.env.local` avec vos clés Stripe :
```bash
# Clés Stripe (mode test)
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique
```

### 3. Démarrer le serveur local
```bash
npm run dev
```

## 🚀 Utilisation

### Méthode 1 : Script simple
```bash
node run-payment-tests.js
```

### Méthode 2 : Robot complet
```bash
node test-payment-bot.js
```

## 📊 Tests effectués

Le robot teste automatiquement :

1. **🏠 Navigation vers la page d'accueil**
   - Vérifie que le site charge correctement
   - Récupère le titre de la page

2. **🛒 Navigation vers la page de commande**
   - Cherche les liens vers les pages de commande
   - Navigue vers `/commande` si nécessaire

3. **🛍️ Ajout d'items au panier**
   - Cherche les boutons "Add" ou "Ajouter"
   - Simule l'ajout d'items au panier
   - Vérifie les indicateurs de panier

4. **💳 Navigation vers la page de paiement**
   - Cherche les boutons de paiement
   - Navigue vers `/payment` si nécessaire
   - Vérifie la présence de Stripe Elements

5. **💳 Test du paiement avec carte de test**
   - Utilise la carte de test Stripe : `4242424242424242`
   - Simule la saisie des informations de carte
   - Déclenche le processus de paiement

6. **✅ Vérification de la page de succès**
   - Attend la redirection après paiement
   - Vérifie la présence d'indicateurs de succès
   - Contrôle l'URL de confirmation

## 🧪 Cartes de test Stripe

### Carte de succès
```
Numéro: 4242424242424242
Expiration: 12/25
CVC: 123
```

### Carte de déclin
```
Numéro: 4000000000000002
Expiration: 12/25
CVC: 123
```

## 📈 Interprétation des résultats

### ✅ Tests réussis
- Navigation fluide entre les pages
- Ajout d'items au panier fonctionnel
- Stripe Elements chargé correctement
- Paiement traité avec succès
- Redirection vers la page de confirmation

### ❌ Tests échoués
- **Erreur de navigation** : Vérifiez les routes de votre application
- **Erreur de panier** : Vérifiez la logique d'ajout au panier
- **Erreur Stripe** : Vérifiez les clés API et la configuration
- **Erreur de paiement** : Vérifiez la logique de traitement des paiements

## 🔧 Personnalisation

### Modifier les tests
Éditez `test-payment-bot.js` pour :
- Changer les sélecteurs CSS
- Ajouter de nouveaux tests
- Modifier les délais d'attente
- Personnaliser les cartes de test

### Ajouter des scénarios
```javascript
// Dans test-payment-bot.js
async testCustomScenario() {
  // Votre logique de test personnalisée
}
```

## 🐛 Dépannage

### Erreur "Serveur non détecté"
```bash
# Vérifiez que le serveur tourne
npm run dev

# Vérifiez l'URL
http://localhost:3000
```

### Erreur "Puppeteer non installé"
```bash
npm install puppeteer
```

### Erreur "Stripe Elements non trouvé"
- Vérifiez que les clés Stripe sont correctes
- Vérifiez que Stripe Elements est bien intégré
- Vérifiez la console du navigateur pour les erreurs

### Erreur "Page de paiement non trouvée"
- Vérifiez que la route `/payment` existe
- Vérifiez que les boutons de paiement sont présents
- Vérifiez la navigation entre les pages

## 📝 Logs et débogage

Le robot affiche des logs détaillés :
- 📤 Requêtes HTTP sortantes
- 📥 Réponses HTTP entrantes
- 🏠 Navigation entre les pages
- 💳 Processus de paiement
- ✅ Résultats des tests

### Mode debug
Pour voir le navigateur en action :
```javascript
// Dans test-payment-bot.js, ligne 15
headless: false, // Changez à true pour masquer le navigateur
```

## 🔄 Tests en boucle

Pour tester en continu :
```bash
# Script simple
while true; do
  node run-payment-tests.js
  sleep 30
done
```

## 📱 Tests mobiles

Pour tester sur mobile :
```javascript
// Dans test-payment-bot.js
defaultViewport: { width: 375, height: 667 } // iPhone
```

## 🎯 Intégration CI/CD

Pour intégrer dans un pipeline CI/CD :
```yaml
# .github/workflows/payment-tests.yml
name: Payment Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run dev &
      - run: sleep 10
      - run: node run-payment-tests.js
```

## 📞 Support

### Logs utiles
- **Console du robot** : Résultats détaillés des tests
- **Console du navigateur** : Erreurs JavaScript
- **Logs Stripe** : Dashboard Stripe > Developers > Logs

### Variables d'environnement
```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## ✅ Checklist de validation

- [ ] Serveur Next.js en cours d'exécution
- [ ] Variables d'environnement Stripe configurées
- [ ] Puppeteer installé
- [ ] Robot lancé avec succès
- [ ] Tous les tests passent
- [ ] Paiement traité correctement
- [ ] Page de confirmation accessible

---

**🤖 Le robot est prêt à tester votre système de paiement !**
