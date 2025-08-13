#!/bin/bash

# Script pour démarrer la maintenance de toutes les bases de données
# Usage: ./start_database_maintenance.sh [intervalle_en_heures]

echo "🚀 Démarrage de la maintenance des bases de données (Upstash + Supabase)..."

# Vérifier que le serveur Next.js tourne
if ! curl -s http://localhost:3002 > /dev/null; then
    echo "❌ Le serveur Next.js n'est pas accessible sur http://localhost:3002"
    echo "💡 Démarrez d'abord le serveur avec: npm run dev"
    exit 1
fi

# Déterminer l'intervalle (par défaut 6 heures)
INTERVAL=${1:-6}
INTERVAL_MS=$((INTERVAL * 60 * 60 * 1000))

echo "✅ Serveur Next.js détecté"
echo "⏰ Intervalle de maintenance: ${INTERVAL} heures"
echo "🔄 Démarrage du script de maintenance combiné..."

# Démarrer le script de maintenance combiné
node utils/keep_all_databases_alive.js --continuous --interval=$INTERVAL_MS 