# 🚀 Configuration GitHub Actions pour la Maintenance

Ce guide vous explique comment configurer GitHub Actions pour maintenir vos bases de données actives 24h/24.

## 📋 Prérequis

1. **Repository GitHub** avec votre code
2. **Variables d'environnement** configurées

## 🔧 Configuration

### 1. Ajouter les Secrets GitHub

Dans votre repository GitHub :
1. Allez dans `Settings` → `Secrets and variables` → `Actions`
2. Ajoutez ces secrets :

```
UPSTASH_REDIS_REST_URL=votre_url_upstash
UPSTASH_REDIS_REST_TOKEN=votre_token_upstash
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
```

### 2. Pousser le code

```bash
git add .
git commit -m "🔧 Ajout GitHub Actions pour maintenance"
git push origin main
```

### 3. Vérifier l'activation

1. Allez dans l'onglet `Actions` de votre repository
2. Vous devriez voir le workflow "🔄 Maintenance Upstash & Supabase"
3. Il se déclenchera automatiquement toutes les 6 heures

## ⏰ Programmation

Le workflow s'exécute :
- **Automatiquement** : Toutes les 6 heures
- **Manuellement** : Via l'interface GitHub Actions

## 🔍 Monitoring

### Vérifier que ça marche :
1. **GitHub Actions** : Onglet Actions → Voir les logs
2. **Upstash Dashboard** : Vérifier l'activité
3. **Supabase Dashboard** : Vérifier l'activité

### Logs attendus :
```
🚀 GitHub Actions - Maintenance des bases de données
⏰ 2024-01-15T10:00:00.000Z
✅ Upstash maintenu actif
✅ Supabase maintenu actif
📊 Résultats:
   Upstash: ✅
   Supabase: ✅
🎉 Maintenance réussie !
```

## 🛠️ Personnalisation

### Changer la fréquence :
Modifiez le cron dans `.github/workflows/upstash-maintenance.yml` :

```yaml
# Toutes les 4 heures
- cron: '0 */4 * * *'

# Toutes les 2 heures  
- cron: '0 */2 * * *'

# Toutes les heures
- cron: '0 * * * *'
```

### Ajouter d'autres bases :
Modifiez `utils/github-actions-maintenance.js` pour ajouter d'autres services.

## 💰 Coût

**Gratuit** ! GitHub Actions offre :
- 2000 minutes/mois gratuitement
- Notre workflow utilise ~2 minutes toutes les 6 heures
- Total : ~48 minutes/mois (bien dans la limite gratuite)

## 🆘 Dépannage

### Workflow qui échoue :
1. Vérifiez les secrets GitHub
2. Regardez les logs dans l'onglet Actions
3. Testez manuellement le script localement

### Variables manquantes :
```bash
# Test local
UPSTASH_REDIS_REST_URL=votre_url node utils/github-actions-maintenance.js
```

## 🎯 Avantages

✅ **24h/24** : Fonctionne même quand votre ordi est éteint
✅ **Gratuit** : Utilise les minutes gratuites GitHub
✅ **Fiable** : Infrastructure GitHub robuste
✅ **Monitoring** : Logs détaillés dans GitHub
✅ **Flexible** : Facile à modifier et personnaliser

## 🚀 Résultat

Vos bases de données resteront actives 24h/24 sans intervention manuelle ! 