const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const QUALITY = 85;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

// Dossiers à traiter
const IMAGE_DIRS = [
  'public/images',
  'public/images/paella de poisson',
  'public/images/sandwich-kefta-poisson',
  'public/images/instagram'
];

// Extensions supportées
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];

async function optimizeImage(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    
    console.log(`🔄 Optimisation de ${path.basename(inputPath)}...`);
    console.log(`   Taille originale: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    
    await sharp(inputPath)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath);
    
    const optimizedStats = fs.statSync(outputPath);
    const optimizedSize = optimizedStats.size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`   ✅ Optimisé: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   📉 Réduction: ${reduction}%`);
    
    return { success: true, reduction };
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function findAndOptimizeImages() {
  console.log('🚀 Début de l\'optimisation des images...\n');
  
  let totalOptimized = 0;
  let totalReduction = 0;
  
  for (const dir of IMAGE_DIRS) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Dossier non trouvé: ${dir}`);
      continue;
    }
    
    console.log(`📁 Traitement du dossier: ${dir}`);
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const ext = path.extname(file).toLowerCase();
      
      // Vérifier si c'est une image non optimisée
      if (SUPPORTED_EXTENSIONS.includes(ext) && !file.endsWith('.webp')) {
        const outputPath = path.join(dir, `${path.parse(file).name}.webp`);
        
        // Éviter de retraiter les fichiers déjà optimisés
        if (fs.existsSync(outputPath)) {
          console.log(`   ⏭️  ${file} déjà optimisé`);
          continue;
        }
        
        const result = await optimizeImage(filePath, outputPath);
        
        if (result.success) {
          totalOptimized++;
          totalReduction += parseFloat(result.reduction);
        }
        
        console.log(''); // Ligne vide pour la lisibilité
      }
    }
  }
  
  console.log('🎉 Optimisation terminée !');
  console.log(`📊 Résumé:`);
  console.log(`   - Images optimisées: ${totalOptimized}`);
  console.log(`   - Réduction moyenne: ${(totalReduction / totalOptimized).toFixed(1)}%`);
}

// Vérifier si sharp est installé
try {
  require('sharp');
  findAndOptimizeImages();
} catch (error) {
  console.log('❌ Sharp n\'est pas installé. Installation...');
  console.log('💡 Exécutez: npm install sharp');
  process.exit(1);
} 