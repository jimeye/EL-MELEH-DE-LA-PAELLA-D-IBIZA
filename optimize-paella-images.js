const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'public/images/paella de poisson';
const outputDir = 'public/images/paella de poisson/optimized';

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  try {
    console.log('🔄 Optimisation des images de paella...');
    
    // Lire tous les fichiers du dossier
    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(file => 
      file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );
    
    console.log(`📁 ${imageFiles.length} images trouvées`);
    
    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);
      
      console.log(`\n🖼️  Traitement de: ${file}`);
      
      // Redimensionner et optimiser avec Sharp
      await sharp(inputPath)
        .resize(1200, 800, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ 
          quality: 85,
          effort: 6
        })
        .toFile(outputPath.replace(/\.[^.]+$/, '.webp'));
      
      console.log(`✅ ${file} optimisé et redimensionné`);
    }
    
    console.log('\n🎉 Optimisation terminée !');
    console.log(`📂 Images optimisées dans: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error);
  }
}

optimizeImages(); 