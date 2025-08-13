# 🚀 Configuration API Instagram Meta (Officielle)

## **Étape 1: Créer une app Facebook**

1. **Allez sur [developers.facebook.com](https://developers.facebook.com)**
2. **Cliquez sur "Créer une app"**
3. **Choisissez "Business" ou "Consumer"**
4. **Remplissez :**
   - Nom de l'app : `EL MELEH DE LA PAELLA 👑`
   - Email de contact : votre email
   - Catégorie : `Food & Drink`

## **Étape 2: Ajouter Instagram Basic Display**

1. **Dans votre app, allez dans "Ajouter des produits"**
2. **Cherchez "Instagram Basic Display"**
3. **Cliquez sur "Configurer"**

## **Étape 3: Configurer l'authentification**

1. **Dans "Instagram Basic Display" → "Basic Display"**
2. **Ajoutez votre domaine :**
   ```
   https://votre-domaine.com
   http://localhost:3000
   ```
3. **Notez votre `Instagram App ID`**

## **Étape 4: Générer un token d'accès**

1. **Allez dans "Basic Display" → "Token Generator"**
2. **Connectez-vous avec votre compte Instagram `@la_boulette_ibiza`**
3. **Autorisez l'accès à votre profil**
4. **Copiez le "Long-lived Access Token"**

## **Étape 5: Configurer les variables d'environnement**

Créez un fichier `.env.local` dans votre projet :

```env
# Instagram Basic Display API (Meta)
INSTAGRAM_APP_ID=123456789012345
INSTAGRAM_APP_SECRET=abcdef123456789
INSTAGRAM_ACCESS_TOKEN=IGQVJ...
```

## **Étape 6: Tester l'API**

Une fois configuré, testez avec :

```bash
curl http://localhost:3000/api/instagram
```

## **✅ Avantages de cette méthode :**

- ✅ **Gratuit à 100%** (aucune limite)
- ✅ **Officiel et stable** (Meta)
- ✅ **Données réelles** de votre Instagram
- ✅ **Pas de coûts cachés**
- ✅ **Configuration une seule fois**

## **❌ Inconvénients :**

- ❌ **Configuration complexe** (30 minutes)
- ❌ **Nécessite validation Meta** (optionnel)
- ❌ **Pas d'accès aux likes** (limitation API)

## **🎯 Résultat final :**

Votre site aura un vrai flux Instagram avec :
- Vos vraies photos Instagram
- Vos vrais captions et hashtags
- Timestamps réels
- Liens vers vos posts Instagram

## **🚀 Prêt à commencer ?**

Dites-moi quand vous avez créé votre app Facebook et je vous aiderai pour la suite ! 🚀 