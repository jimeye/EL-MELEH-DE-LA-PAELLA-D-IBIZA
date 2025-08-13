#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Fonction pour normaliser le nom du plat pour le dossier
function normalizeDishName(dishName) {
  return dishName
    .toLowerCase()
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/[ûüù]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function addNewDish() {
  console.log('🍽️  Assistant d\'ajout de nouveau plat\n');
  
  // Collecter les informations
  const dishName = await question('📝 Nom du plat : ');
  const dishPrice = await question('💰 Prix (en €) : ');
  const dishDescription = await question('📄 Description : ');
  const dishType = await question('🍽️ Type (ex: paella, sbm, bbm) : ');
  const dishEmoji = await question('🎨 Emoji (ex: 🐟, 🍚, 🥪) : ');
  
  // Normaliser le nom du plat pour le dossier
  const folderName = normalizeDishName(dishName);
  
  console.log('\n🔄 Ajout du plat en cours...\n');
  
  // 1. Créer le dossier pour les images
  console.log('📁 1. Création du dossier images...');
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images', folderName);
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
      console.log(`✅ Dossier créé : public/images/${folderName}/`);
    } else {
      console.log(`✅ Dossier existe déjà : public/images/${folderName}/`);
    }
  } catch (error) {
    console.log('❌ Erreur dossier images:', error.message);
  }
  
  // 2. Ajout sur la page d'accueil (app/page.js)
  console.log('📝 2. Modification de la page d\'accueil...');
  try {
    const pagePath = path.join(process.cwd(), 'app', 'page.js');
    let pageContent = fs.readFileSync(pagePath, 'utf8');
    
    // Créer le composant slider pour ce plat
    const sliderComponentName = `${dishType.charAt(0).toUpperCase() + dishType.slice(1)}Slider`;
    
    // Ajouter l'import du slider
    if (!pageContent.includes(`import ${sliderComponentName}`)) {
      pageContent = pageContent.replace(
        "import InstagramFeed from './components/InstagramFeed';",
        `import InstagramFeed from './components/InstagramFeed';\nimport ${sliderComponentName} from './components/${sliderComponentName}';`
      );
    }
    
    // Créer la section du plat
    const dishSection = `        {/* ${dishName} */}
        <div className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-56 aspect-square">
            <${sliderComponentName} />
          </div>
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Nouveau</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">${dishName}<br/>${dishPrice} €</h3>
            <p className="text-gray-600 mb-4 text-center flex-grow leading-relaxed">
              ${dishDescription}
            </p>
          </div>
        </div>`;
    
    // Insérer après le premier plat existant
    const menuStart = pageContent.indexOf('{/* Menu Section */}');
    const firstPlatEnd = pageContent.indexOf('</div>', pageContent.indexOf('</div>', pageContent.indexOf('group bg-white rounded-lg')));
    
    if (menuStart !== -1 && firstPlatEnd !== -1) {
      pageContent = pageContent.slice(0, firstPlatEnd + 6) + '\n' + dishSection + '\n' + pageContent.slice(firstPlatEnd + 6);
    }
    
    fs.writeFileSync(pagePath, pageContent);
    console.log('✅ Page d\'accueil modifiée');
  } catch (error) {
    console.log('❌ Erreur page d\'accueil:', error.message);
  }
  
  // 3. Ajout sur la page réservation (app/reservation/page.js)
  console.log('📝 3. Modification de la page réservation...');
  try {
    const reservationPath = path.join(process.cwd(), 'app', 'reservation', 'page.js');
    let reservationContent = fs.readFileSync(reservationPath, 'utf8');
    
    // Ajouter le nouveau lot au state
    const newLotName = `${dishType}Lots`;
    if (!reservationContent.includes(newLotName)) {
      reservationContent = reservationContent.replace(
        'const [formData, setFormData] = useState({\n    sbmLots: [],\n    bbmLots: [],',
        `const [formData, setFormData] = useState({\n    sbmLots: [],\n    bbmLots: [],\n    ${newLotName}: [],`
      );
    }
    
    // Ajouter le prix
    if (!reservationContent.includes(`${dishType}: ${dishPrice}`)) {
      reservationContent = reservationContent.replace(
        'const prices = {\n    sbm: 12,\n    bbm: 15,',
        `const prices = {\n    sbm: 12,\n    bbm: 15,\n    ${dishType}: ${dishPrice},`
      );
    }
    
    // Ajouter la section dans le JSX
    const dishReservationSection = `          {/* ${dishName} */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">${dishEmoji} ${dishName}</h3>
              <span className="text-lg font-semibold text-green-600">${dishPrice} €</span>
            </div>
            <div className="text-xs text-gray-600 mb-4">
              ${dishDescription}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => addLot('${dishType}')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Add
              </button>
              <select
                value={formData.${newLotName}.length > 0 ? formData.${newLotName}[formData.${newLotName}.length - 1]?.qty || 1 : 1}
                onChange={(e) => updateLotQuantity('${dishType}', formData.${newLotName}.length > 0 ? formData.${newLotName}[formData.${newLotName}.length - 1]?.id : null, parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>`;
    
    // Insérer après la dernière section existante
    const lastSectionEnd = reservationContent.lastIndexOf('</div>', reservationContent.lastIndexOf('mb-6'));
    if (lastSectionEnd !== -1) {
      reservationContent = reservationContent.slice(0, lastSectionEnd + 6) + '\n' + dishReservationSection + '\n' + reservationContent.slice(lastSectionEnd + 6);
    }
    
    fs.writeFileSync(reservationPath, reservationContent);
    console.log('✅ Page réservation modifiée');
  } catch (error) {
    console.log('❌ Erreur page réservation:', error.message);
  }
  
  // 4. Créer le composant slider
  console.log('📝 4. Création du composant slider...');
  try {
    const sliderComponentName = `${dishType.charAt(0).toUpperCase() + dishType.slice(1)}Slider`;
    const sliderPath = path.join(process.cwd(), 'app', 'components', `${sliderComponentName}.js`);
    const sliderContent = `'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const ${sliderComponentName} = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger dynamiquement les images du dossier
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Appel à l'API pour récupérer les images du dossier
        const response = await fetch('/api/get-images?folder=${folderName}');
        if (response.ok) {
          const imageList = await response.json();
          setImages(imageList.images || []);
        } else {
          console.error('Erreur lors du chargement des images');
          // Fallback avec des images par défaut
          setImages([
            '/images/${folderName}/${folderName}-1.webp',
            '/images/${folderName}/${folderName}-2.webp',
            '/images/${folderName}/${folderName}-3.webp',
            '/images/${folderName}/${folderName}-4.webp'
          ]);
        }
      } catch (error) {
        console.error('Erreur:', error);
        // Fallback avec des images par défaut
        setImages([
          '/images/${folderName}/${folderName}-1.webp',
          '/images/${folderName}/${folderName}-2.webp',
          '/images/${folderName}/${folderName}-3.webp',
          '/images/${folderName}/${folderName}-4.webp'
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  // Auto-play seulement s'il y a des images
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="relative h-56 aspect-square overflow-hidden rounded-lg w-full h-full bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Chargement...</div>
        </div>
      </div>
    );
  }

  // Si aucune image, afficher un placeholder
  if (images.length === 0) {
    return (
      <div className="relative h-56 aspect-square overflow-hidden rounded-lg w-full h-full bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="text-2xl mb-2">📸</div>
            <div className="text-sm">Aucune image</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-56 aspect-square overflow-hidden rounded-lg w-full h-full">
      {images.map((image, index) => (
        <div
          key={index}
          className={\`absolute inset-0 transition-opacity duration-1000 w-full h-full \${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}\`}
        >
          <Image
            src={image}
            alt={\`${dishName} - Image \${index + 1}\`}
            fill
            className="object-cover object-center w-full h-full group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
            priority={index === 0}
            onError={(e) => {
              console.error('Erreur de chargement image:', image);
              e.target.style.display = 'none';
            }}
          />
        </div>
      ))}
      
      {/* Indicateurs de navigation si plusieurs images */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={\`w-2 h-2 rounded-full transition-colors duration-200 \${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}\`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ${sliderComponentName};`;
    
    fs.writeFileSync(sliderPath, sliderContent);
    console.log('✅ Composant slider créé');
  } catch (error) {
    console.log('❌ Erreur composant slider:', error.message);
  }
  
  // 5. Modifier CartIcon
  console.log('📝 5. Modification du composant CartIcon...');
  try {
    const cartIconPath = path.join(process.cwd(), 'app', 'components', 'CartIcon.js');
    let cartIconContent = fs.readFileSync(cartIconPath, 'utf8');
    
    const newLotName = `${dishType}Lots`;
    const newItemsName = `${dishType}Items`;
    
    // Ajouter les nouveaux items dans getCartSummary
    if (!cartIconContent.includes(newItemsName)) {
      cartIconContent = cartIconContent.replace(
        'const sbmItems = formData.sbmLots || [];\n    const bbmItems = formData.bbmLots || [];',
        `const sbmItems = formData.sbmLots || [];\n    const bbmItems = formData.bbmLots || [];\n    const ${newItemsName} = formData.${newLotName} || [];`
      );
    }
    
    // Ajouter l'affichage du nouveau plat
    const newDishDisplay = `        {${newItemsName}.length > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-lg">${dishEmoji}</span>
              <span className="font-medium text-gray-800">${dishName}</span>
              <span className="text-sm text-gray-500">x{${newItemsName}.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-green-600">{${newItemsName}.length * ${dishPrice}}€</span>
              {onRemoveItem && (
                <button
                  onClick={() => onRemoveItem('${dishType}', ${newItemsName}[0]?.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  title="Supprimer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}`;
    
    // Insérer après le dernier plat existant
    const lastDishEnd = cartIconContent.lastIndexOf('</div>', cartIconContent.lastIndexOf('border-b border-gray-200'));
    if (lastDishEnd !== -1) {
      cartIconContent = cartIconContent.slice(0, lastDishEnd + 6) + '\n' + newDishDisplay + '\n' + cartIconContent.slice(lastDishEnd + 6);
    }
    
    fs.writeFileSync(cartIconPath, cartIconContent);
    console.log('✅ CartIcon modifié');
  } catch (error) {
    console.log('❌ Erreur CartIcon:', error.message);
  }
  
  // 6. Créer le script d'optimisation
  console.log('📝 6. Création du script d\'optimisation...');
  try {
    const optimizeScriptPath = path.join(process.cwd(), `optimize-${folderName}-images.js`);
    const optimizeScriptContent = `const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public', 'images', '${folderName}');
const outputDir = path.join(__dirname, 'public', 'images', '${folderName}');

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
    
    console.log(\`✅ Optimisé: \${path.basename(inputPath)} -> \${path.basename(outputPath)}\`);
  } catch (error) {
    console.error(\`❌ Erreur lors de l'optimisation de \${inputPath}:\`, error.message);
  }
}

// Fonction principale
async function optimizeImages() {
  console.log('🖼️  Optimisation des images pour ${dishName}...\\n');

  // Vérifier si le dossier d'entrée existe
  if (!fs.existsSync(inputDir)) {
    console.log(\`📁 Création du dossier: \${inputDir}\`);
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
    console.log(\`📂 Ajoutez vos images dans: \${inputDir}\`);
    return;
  }

  console.log(\`📸 \${imageFiles.length} image(s) trouvée(s):\\n\`);

  // Optimiser chaque image
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;
    const outputPath = path.join(outputDir, \`\${baseName}-ibiza-kosher-cacher-friendly.webp\`);

    // Dimensions recommandées pour le slider
    await optimizeImage(inputPath, outputPath, 400, 400);
  }

  console.log('\\n🎉 Optimisation terminée !');
  console.log('📁 Images optimisées dans:', outputDir);
  console.log('\\n💡 Prochaines étapes:');
  console.log('1. Vérifiez les images optimisées');
  console.log('2. Le slider détectera automatiquement les nouvelles images');
  console.log('3. Testez l\'affichage sur le site');
}

// Lancer l'optimisation
optimizeImages().catch(console.error);`;
    
    fs.writeFileSync(optimizeScriptPath, optimizeScriptContent);
    console.log('✅ Script d\'optimisation créé');
  } catch (error) {
    console.log('❌ Erreur script optimisation:', error.message);
  }
  
  console.log('\n🎉 Installation terminée !');
  console.log('\n📋 Récapitulatif :');
  console.log(`✅ ${dishName} ajouté partout`);
  console.log(`💰 Prix : ${dishPrice}€`);
  console.log(`📄 Description : ${dishDescription}`);
  console.log(`🎨 Emoji : ${dishEmoji}`);
  console.log(`📁 Type : ${dishType}`);
  console.log('\n📁 Dossier créé :');
  console.log(`   public/images/${folderName}/`);
  console.log('\n🚀 Prochaines étapes :');
  console.log(`1. 📸 Placez vos photos dans : public/images/${folderName}/`);
  console.log(`   - N'importe quel nom de fichier (.jpg, .png, .webp)`);
  console.log(`   - Exemple : photo1.jpg, mon-image.png, etc.`);
  console.log(`   - Le slider détectera automatiquement toutes les images`);
  console.log(`2. 🔧 Optimisez : node optimize-${folderName}-images.js`);
  console.log('3. 🚀 Redémarrez : npm run dev');
  console.log('\n💡 Avantages du nouveau système :');
  console.log('   ✅ Détection automatique des images');
  console.log('   ✅ Noms de fichiers flexibles');
  console.log('   ✅ Ajout/suppression d\'images sans modifier le code');
  console.log('   ✅ Gestion des erreurs et fallback');
  console.log('   ✅ Indicateurs de navigation automatiques');
  console.log('\n💡 Exemple : "Paella de Poisson" → dossier "${folderName}"');
  console.log('💡 Le slider affichera automatiquement toutes les images du dossier !');
  
  rl.close();
}

addNewDish().catch(console.error); 