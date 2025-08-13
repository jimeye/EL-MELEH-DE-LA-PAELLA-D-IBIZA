# 📋 Script de renommage de fichiers PDF

Ce script permet de renommer automatiquement vos fichiers PDF avec un format de date séquentiel.

## 🎯 Format de nommage

Les fichiers seront renommés selon le format : **MM YY.pdf**

Exemples :
- `01 24.pdf` (Janvier 2024)
- `02 24.pdf` (Février 2024)
- `12 24.pdf` (Décembre 2024)
- `01 25.pdf` (Janvier 2025)
- etc.

## 📁 Contenu du dossier

- `rename_pdfs.js` - Script principal en Node.js
- `rename_pdfs.sh` - Script shell pour faciliter l'exécution
- `README.md` - Ce fichier d'instructions

## 🚀 Utilisation

### Méthode 1 : Script shell (recommandé)

```bash
# Rendre le script exécutable
chmod +x ~/Desktop/SCRIPT/rename_pdfs.sh

# Renommer les PDF du dossier courant
~/Desktop/SCRIPT/rename_pdfs.sh

# Renommer les PDF d'un dossier spécifique
~/Desktop/SCRIPT/rename_pdfs.sh ~/Desktop/MesPDFs

# Afficher l'aide
~/Desktop/SCRIPT/rename_pdfs.sh --help
```

### Méthode 2 : Script Node.js directement

```bash
# Renommer les PDF du dossier courant
node ~/Desktop/SCRIPT/rename_pdfs.js

# Renommer les PDF d'un dossier spécifique
node ~/Desktop/SCRIPT/rename_pdfs.js ~/Desktop/MesPDFs

# Afficher l'aide
node ~/Desktop/SCRIPT/rename_pdfs.js --help
```

## ⚙️ Configuration

Vous pouvez modifier les paramètres dans le fichier `rename_pdfs.js` :

```javascript
const START_YEAR = 2024;  // Année de début
const END_YEAR = 2025;    // Année de fin
const START_MONTH = 1;    // Mois de début (1 = Janvier)
const END_MONTH = 12;     // Mois de fin (12 = Décembre)
```

## ⚠️ Important

1. **Faites une sauvegarde** de vos fichiers avant d'exécuter le script
2. Le script affiche d'abord un aperçu des changements
3. **Décommentez les lignes** dans le script pour l'exécuter réellement
4. Le renommage est **irréversible**

## 🔧 Prérequis

- **Node.js** doit être installé sur votre système
- Téléchargeable sur : https://nodejs.org/

## 📝 Exemple d'utilisation

1. Placez vos fichiers PDF dans un dossier
2. Ouvrez le Terminal
3. Naviguez vers le dossier contenant vos PDF :
   ```bash
   cd ~/Desktop/MesPDFs
   ```
4. Exécutez le script :
   ```bash
   ~/Desktop/SCRIPT/rename_pdfs.sh
   ```
5. Vérifiez l'aperçu des changements
6. Décommentez les lignes dans le script si vous êtes satisfait
7. Relancez le script pour effectuer le renommage

## 🆘 Dépannage

- **Erreur "Node.js n'est pas installé"** : Installez Node.js depuis https://nodejs.org/
- **Erreur de permissions** : Rendez le script exécutable avec `chmod +x ~/Desktop/SCRIPT/rename_pdfs.sh`
- **Aucun fichier PDF trouvé** : Vérifiez que vos fichiers ont bien l'extension `.pdf` (en minuscules)

## 📞 Support

Si vous rencontrez des problèmes, vérifiez que :
- Node.js est installé et accessible
- Les fichiers PDF sont dans le bon dossier
- Vous avez les permissions nécessaires sur le dossier 