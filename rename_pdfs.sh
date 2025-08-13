#!/bin/bash

# Script de renommage de fichiers PDF
# Usage: ./rename_pdfs.sh [dossier]

echo "🚀 Script de renommage de fichiers PDF"
echo "====================================="
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    echo "   Vous pouvez le télécharger sur: https://nodejs.org/"
    exit 1
fi

# Obtenir le chemin du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_SCRIPT="$SCRIPT_DIR/rename_pdfs.js"

# Vérifier que le script Node.js existe
if [ ! -f "$NODE_SCRIPT" ]; then
    echo "❌ Le script rename_pdfs.js n'a pas été trouvé dans $SCRIPT_DIR"
    exit 1
fi

# Rendre le script exécutable
chmod +x "$NODE_SCRIPT"

# Exécuter le script Node.js avec les arguments passés
node "$NODE_SCRIPT" "$@" 