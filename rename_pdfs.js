#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const START_YEAR = 2024;
const END_YEAR = 2025;
const START_MONTH = 1; // Janvier
const END_MONTH = 12; // Décembre

function formatMonth(month) {
  return month.toString().padStart(2, '0');
}

function formatYear(year) {
  return year.toString().slice(-2);
}

function generateFileName(month, year) {
  const monthStr = formatMonth(month);
  const yearStr = formatYear(year);
  return `${monthStr} ${yearStr}`;
}

function getPDFFiles(directory) {
  try {
    const files = fs.readdirSync(directory);
    return files.filter(file =>
      file.toLowerCase().endsWith('.pdf') &&
      !file.startsWith('.')
    );
  } catch (error) {
    console.error(`Erreur lors de la lecture du dossier ${directory}:`, error.message);
    return [];
  }
}

function renamePDFs(directory) {
  console.log(`🔍 Recherche de fichiers PDF dans: ${directory}`);
  const pdfFiles = getPDFFiles(directory);
  
  if (pdfFiles.length === 0) {
    console.log('❌ Aucun fichier PDF trouvé dans le dossier spécifié.');
    return;
  }
  
  console.log(`📄 ${pdfFiles.length} fichier(s) PDF trouvé(s):`);
  pdfFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });

  console.log('\n📋 Séquence de renommage qui sera appliquée:');
  let fileIndex = 0;
  
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    for (let month = START_MONTH; month <= END_MONTH; month++) {
      if (fileIndex < pdfFiles.length) {
        const newName = generateFileName(month, year);
        console.log(`  ${fileIndex + 1}. ${pdfFiles[fileIndex]} → ${newName}.pdf`);
        fileIndex++;
      }
    }
  }

  console.log('\n⚠️  ATTENTION: Cette opération va renommer définitivement vos fichiers!');
  console.log('Voulez-vous continuer? (oui/non):');
  console.log('💡 Pour exécuter le renommage, décommentez les lignes dans le script et relancez-le.');

  // DÉCOMMENTEZ LES LIGNES CI-DESSOUS POUR EXÉCUTER LE RENOMMAGE:
  /*
  fileIndex = 0;
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    for (let month = START_MONTH; month <= END_MONTH; month++) {
      if (fileIndex < pdfFiles.length) {
        const oldPath = path.join(directory, pdfFiles[fileIndex]);
        const newName = generateFileName(month, year) + '.pdf';
        const newPath = path.join(directory, newName);

        try {
          fs.renameSync(oldPath, newPath);
          console.log(`✅ ${pdfFiles[fileIndex]} → ${newName}`);
        } catch (error) {
          console.error(`❌ Erreur lors du renommage de ${pdfFiles[fileIndex]}:`, error.message);
        }
        fileIndex++;
      }
    }
  }
  console.log('\n🎉 Renommage terminé!');
  */
}

function showHelp() {
  console.log(`
📋 Script de renommage de fichiers PDF
=====================================

Usage: node rename_pdfs.js [dossier]

Arguments:
  dossier    Chemin vers le dossier contenant les PDF à renommer
             (par défaut: dossier courant)

Exemples:
  node rename_pdfs.js                    # Renomme les PDF du dossier courant
  node rename_pdfs.js ~/Desktop/PDFs     # Renomme les PDF du dossier ~/Desktop/PDFs
  node rename_pdfs.js "/chemin/vers/dossier"  # Renomme les PDF du dossier spécifié

Format de nommage:
  Les fichiers seront renommés selon le format: MM YY.pdf
  Exemple: 01 24.pdf, 02 24.pdf, ..., 12 24.pdf, 01 25.pdf, etc.

Configuration:
  Année de début: ${START_YEAR}
  Année de fin: ${END_YEAR}
  Mois de début: ${START_MONTH}
  Mois de fin: ${END_MONTH}

⚠️  ATTENTION: 
  - Faites une sauvegarde de vos fichiers avant d'exécuter ce script
  - Le renommage est irréversible
  - Décommentez les lignes dans le script pour l'exécuter réellement
`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  const targetDirectory = args[0] || process.cwd();
  
  console.log('🚀 Script de renommage de fichiers PDF');
  console.log('=====================================\n');
  
  if (!fs.existsSync(targetDirectory)) {
    console.error(`❌ Le dossier spécifié n'existe pas: ${targetDirectory}`);
    return;
  }
  
  renamePDFs(targetDirectory);
}

if (require.main === module) {
  main();
}

module.exports = { renamePDFs, generateFileName }; 