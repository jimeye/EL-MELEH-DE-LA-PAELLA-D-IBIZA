#!/bin/bash

# Script pour démarrer la maintenance Upstash
# Usage: ./start_upstash_maintenance.sh [intervalle_en_heures]

echo "🚀 Démarrage de la maintenance Upstash..."

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
echo "🔄 Démarrage du script de maintenance..."

# Démarrer le script de maintenance
node utils/keep_upstash_alive_simple.js --continuous --interval=$INTERVAL_MS 