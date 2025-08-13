const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'public/images/sandwich-kefta-poisson';
const outputDir = 'public/images/sandwich-kefta-poisson';

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Fonction pour optimiser une image
async function optimizeImage(inputPath, outputPath, width, height, quality = 85) {
  try {
    await sharp(inputPath)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality })
      .toFile(outputPath);
    
    console.log(`✅ Optimisé: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'optimisation de ${inputPath}:`, error.message);
  }
}

// Fonction principale
async function optimizeImages() {
  console.log('🖼️  Optimisation des images pour Sandwich Kefta Poisson...\n');

  // Vérifier si le dossier d'entrée existe
  if (!fs.existsSync(inputDir)) {
    console.log(`📁 Création du dossier: ${inputDir}`);
    fs.mkdirSync(inputDir, { recursive: true });
    console.log('✅ Dossier créé. Ajoutez vos images dans ce dossier puis relancez le script.');
    return;
  }

  // Lire tous les fichiers du dossier
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  if (imageFiles.length === 0) {
    console.log('📁 Aucune image trouvée dans le dossier.');
    console.log(`📂 Ajoutez vos images dans: ${inputDir}`);
    return;
  }

  console.log(`📸 ${imageFiles.length} image(s) trouvée(s):\n`);

  // Optimiser chaque image
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;
    const outputPath = path.join(outputDir, `${baseName}-ibiza-kosher-cacher-friendly.webp`);

    // Dimensions recommandées pour le slider
    await optimizeImage(inputPath, outputPath, 400, 400);
  }

  console.log('\n🎉 Optimisation terminée !');
  console.log('📁 Images optimisées dans:', outputDir);
  console.log('\n💡 Prochaines étapes:');
  console.log('1. Vérifiez les images optimisées');
  console.log('2. Mettez à jour le composant KeftaSlider.js avec les nouveaux noms de fichiers');
  console.log('3. Testez l\'affichage sur le site');
}

// Lancer l'optimisation
optimizeImages().catch(console.error); 