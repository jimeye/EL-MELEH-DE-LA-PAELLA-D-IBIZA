const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Images lourdes à optimiser en priorité
const HEAVY_IMAGES = [
  'public/images/SLIDER4.JPG',
  'public/images/mekbouba1.jpeg',
  'public/images/slider4-small.jpg',
  'public/images/tajine1.jpg'
];

async function optimizeHeavyImage(inputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    
    console.log(`🔄 Optimisation de ${path.basename(inputPath)}...`);
    console.log(`   Taille originale: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    
    const outputPath = inputPath.replace(/\.[^/.]+$/, '.webp');
    
    await sharp(inputPath)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    const optimizedStats = fs.statSync(outputPath);
    const optimizedSize = optimizedStats.size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`   ✅ Optimisé: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   📉 Réduction: ${reduction}%`);
    console.log(`   📁 Fichier: ${path.basename(outputPath)}`);
    
    return { success: true, reduction };
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function optimizeAllHeavyImages() {
  console.log('🚀 Optimisation des images lourdes...\n');
  
  let totalOptimized = 0;
  let totalReduction = 0;
  
  for (const imagePath of HEAVY_IMAGES) {
    if (fs.existsSync(imagePath)) {
      const result = await optimizeHeavyImage(imagePath);
      
      if (result.success) {
        totalOptimized++;
        totalReduction += parseFloat(result.reduction);
      }
      
      console.log(''); // Ligne vide
    } else {
      console.log(`⚠️  Fichier non trouvé: ${imagePath}`);
    }
  }
  
  console.log('🎉 Optimisation terminée !');
  console.log(`📊 Résumé:`);
  console.log(`   - Images optimisées: ${totalOptimized}`);
  console.log(`   - Réduction moyenne: ${(totalReduction / totalOptimized).toFixed(1)}%`);
}

optimizeAllHeavyImages(); 