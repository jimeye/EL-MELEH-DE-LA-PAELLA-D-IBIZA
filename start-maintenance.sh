#!/bin/bash

# Script pour démarrer la maintenance des bases de données
# Usage: ./start-maintenance.sh [intervalle_en_heures]

echo "🚀 Démarrage de la maintenance des bases de données..."

# Vérifier si les variables sont configurées
if [ -z "$UPSTASH_REDIS_REST_URL" ] || [ -z "$UPSTASH_REDIS_REST_TOKEN" ]; then
    echo "⚠️ Variables Upstash non configurées, utilisation de la simulation..."
    echo "💡 Pour utiliser les vraies bases, configurez les variables dans .env.local"
    
    # Démarrer la simulation
    node utils/test-maintenance-simulation.js --continuous
else
    echo "✅ Variables configurées, démarrage de la vraie maintenance..."
    
    # Déterminer l'intervalle
    INTERVAL=${1:-6}  # 6 heures par défaut
    INTERVAL_MS=$((INTERVAL * 60 * 60 * 1000))
    
    echo "⏰ Intervalle: $INTERVAL heures"
    
    # Démarrer la vraie maintenance
    node utils/keep_all_databases_alive.js --continuous --interval $INTERVAL_MS
fi 