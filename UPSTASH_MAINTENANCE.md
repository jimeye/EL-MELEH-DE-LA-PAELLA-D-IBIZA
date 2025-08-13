# 🔄 Maintenance des Bases de Données (Upstash + Supabase)

Ce guide vous explique comment maintenir vos bases de données actives pour éviter qu'elles soient supprimées.

## 🚨 Problème

Upstash ET Supabase suppriment les bases de données gratuites inactives. Pour éviter cela, nous devons générer du trafic régulier.

## 🛠️ Solutions

### Option 1: Script combiné (RECOMMANDÉ)

```bash
# Démarrer la maintenance de toutes les bases de données
./start_database_maintenance.sh

# Ou avec un intervalle personnalisé (ex: 4 heures)
./start_database_maintenance.sh 4
```

### Option 2: Scripts individuels

```bash
# Maintenance Upstash uniquement
./start_upstash_maintenance.sh

# Maintenance Supabase uniquement
node utils/keep_supabase_alive.js --continuous

# Maintenance combinée manuelle
node utils/keep_all_databases_alive.js --continuous
```

### Option 3: Scripts manuels

```bash
# Test unique combiné
node utils/keep_all_databases_alive.js

# Mode continu (6 heures par défaut)
node utils/keep_all_databases_alive.js --continuous

# Mode continu avec intervalle personnalisé (1 heure)
node utils/keep_all_databases_alive.js --continuous --interval=3600000
```

## 📋 Prérequis

1. **Serveur Next.js en cours d'exécution**
   ```bash
   npm run dev
   ```

2. **Variables d'environnement** (optionnel)
   Ajoutez dans `.env.local` :
   ```
   UPSTASH_REDIS_REST_URL=votre_url_upstash
   UPSTASH_REDIS_REST_TOKEN=votre_token_upstash
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
   ```

## 🔧 Fonctionnement

### Upstash Redis
Le script génère du trafic en appelant les API :
- `/api/check-counter`
- `/api/generate-order-number`
- `/api/get-commandes`
- `/api/admin-commandes`

### Supabase
Le script génère du trafic en visitant les pages :
- `/admin` (authentification)
- `/admin/plats` (base de données)
- `/admin/images` (stockage)
- `/api/instagram-simple` (API)

Ces appels maintiennent vos bases de données actives.

## ⏰ Intervalles recommandés

- **6 heures** : Par défaut, suffisant pour maintenir l'activité
- **4 heures** : Plus fréquent, pour plus de sécurité
- **1 heure** : Très fréquent, si vous voulez être sûr

## 🚀 Démarrage automatique

Pour démarrer automatiquement la maintenance :

```bash
# Dans un nouveau terminal
./start_database_maintenance.sh

# Ou avec intervalle personnalisé
./start_database_maintenance.sh 4
```

## 🛑 Arrêt

Appuyez sur `Ctrl+C` pour arrêter le script.

## 📊 Monitoring

Le script affiche :
- ✅ Statut de chaque API/page
- ⏰ Prochaine génération de trafic
- 🕐 Timestamp de chaque action
- 📊 Trafic Upstash et Supabase séparé

## 🔍 Vérification

Pour vérifier que ça fonctionne :
1. Lancez le script
2. Vérifiez les logs Upstash et Supabase dans vos dashboards
3. Vous devriez voir de l'activité régulière

## 💡 Conseils

- Gardez le script en cours d'exécution sur votre serveur
- Utilisez un intervalle de 4-6 heures pour économiser les ressources
- Surveillez les logs pour détecter les erreurs
- Redémarrez le script si nécessaire

## 🆘 Dépannage

**Erreur "Serveur Next.js non accessible"**
```bash
npm run dev
```

**Erreur "Variables d'environnement manquantes"**
Ajoutez les variables dans `.env.local`

**Script qui s'arrête**
Redémarrez avec : `./start_database_maintenance.sh`

## 📧 Emails de suppression

**Upstash** : "Inactive database notice"
**Supabase** : "Database inactivity warning"

**Solution** : Lancez immédiatement le script de maintenance !

## 🎯 Résultat

Vos bases de données Upstash ET Supabase resteront actives et vous ne recevrez plus d'emails de suppression ! 