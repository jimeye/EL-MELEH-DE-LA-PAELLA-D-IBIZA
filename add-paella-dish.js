#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🐟 Démarrage de l\'ajout automatique du plat Paella de Poisson...\n');

// 1. Ajout sur la page d'accueil (app/page.js)
console.log('📝 1. Modification de la page d\'accueil...');
try {
  const pagePath = path.join(process.cwd(), 'app', 'page.js');
  let pageContent = fs.readFileSync(pagePath, 'utf8');
  
  // Ajouter l'import PaellaSlider
  if (!pageContent.includes('import PaellaSlider')) {
    pageContent = pageContent.replace(
      "import InstagramFeed from './components/InstagramFeed';",
      "import InstagramFeed from './components/InstagramFeed';\nimport PaellaSlider from './components/PaellaSlider';"
    );
  }
  
  // Ajouter le plat Paella en première position
  const paellaSection = `        {/* Paella de Poisson */}
        <div className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-56 aspect-square">
            <PaellaSlider />
          </div>
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">🕯️ Special Tisha Beav</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Paella<br/>de Poisson<br/>26 €</h3>
            <p className="text-gray-600 mb-4 text-center flex-grow leading-relaxed">
              🐟 Riz safrané avec poisson frais de la Méditerranée, légumes de saison et épices authentiques. Plat traditionnel espagnol cachère parfait pour cette semaine sans viande. Une explosion de saveurs marines ! Plat traditionnel espagnol cachère. *min 2 personnes
            </p>
          </div>
        </div>`;
  
  // Insérer après le premier plat existant
  const menuStart = pageContent.indexOf('{/* Menu Section */}');
  const firstPlatEnd = pageContent.indexOf('</div>', pageContent.indexOf('</div>', pageContent.indexOf('group bg-white rounded-lg')));
  
  if (menuStart !== -1 && firstPlatEnd !== -1) {
    pageContent = pageContent.slice(0, firstPlatEnd + 6) + '\n' + paellaSection + '\n' + pageContent.slice(firstPlatEnd + 6);
  }
  
  fs.writeFileSync(pagePath, pageContent);
  console.log('✅ Page d\'accueil modifiée');
} catch (error) {
  console.log('❌ Erreur page d\'accueil:', error.message);
}

// 2. Ajout sur la page réservation (app/reservation/page.js)
console.log('📝 2. Modification de la page réservation...');
try {
  const reservationPath = path.join(process.cwd(), 'app', 'reservation', 'page.js');
  let reservationContent = fs.readFileSync(reservationPath, 'utf8');
  
  // Ajouter paellaLots au state
  if (!reservationContent.includes('paellaLots')) {
    reservationContent = reservationContent.replace(
      'const [formData, setFormData] = useState({\n    sbmLots: [],\n    bbmLots: [],',
      'const [formData, setFormData] = useState({\n    sbmLots: [],\n    bbmLots: [],\n    paellaLots: [],'
    );
  }
  
  // Ajouter le prix Paella
  if (!reservationContent.includes('paella: 26')) {
    reservationContent = reservationContent.replace(
      'const prices = {\n    sbm: 12,\n    bbm: 15,',
      'const prices = {\n    sbm: 12,\n    bbm: 15,\n    paella: 26,'
    );
  }
  
  // Ajouter la section Paella dans le JSX
  const paellaReservationSection = `          {/* Paella de Poisson */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">🐟 Paella de Poisson</h3>
              <span className="text-lg font-semibold text-green-600">26 €</span>
            </div>
            <div className="text-xs text-gray-600 mb-4">
              🐟 Riz safrané avec poisson frais de la Méditerranée, légumes de saison et épices authentiques. Plat traditionnel espagnol cachère parfait pour cette semaine sans viande. Une explosion de saveurs marines ! Plat traditionnel espagnol cachère. *min 2 personnes
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => addLot('paella')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Add
              </button>
              <select
                value={formData.paellaLots.length > 0 ? formData.paellaLots[formData.paellaLots.length - 1]?.qty || 1 : 1}
                onChange={(e) => updateLotQuantity('paella', formData.paellaLots.length > 0 ? formData.paellaLots[formData.paellaLots.length - 1]?.id : null, parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>`;
  
  // Insérer après la section BBM
  const bbmSectionEnd = reservationContent.indexOf('</div>', reservationContent.lastIndexOf('BBM'));
  if (bbmSectionEnd !== -1) {
    reservationContent = reservationContent.slice(0, bbmSectionEnd + 6) + '\n' + paellaReservationSection + '\n' + reservationContent.slice(bbmSectionEnd + 6);
  }
  
  // Modifier la fonction addLot pour Paella
  if (!reservationContent.includes('type === \'paella\' ? 2 : 1')) {
    reservationContent = reservationContent.replace(
      'qty: 1,',
      'qty: type === \'paella\' ? 2 : 1,'
    );
  }
  
  fs.writeFileSync(reservationPath, reservationContent);
  console.log('✅ Page réservation modifiée');
} catch (error) {
  console.log('❌ Erreur page réservation:', error.message);
}

// 3. Créer le composant PaellaSlider
console.log('📝 3. Création du composant PaellaSlider...');
try {
  const paellaSliderPath = path.join(process.cwd(), 'app', 'components', 'PaellaSlider.js');
  const paellaSliderContent = `'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const PaellaSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const paellaImages = [
    '/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-1.webp',
    '/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-2.webp',
    '/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-3.webp',
    '/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-4.webp'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === paellaImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change d'image toutes les 5 secondes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-56 aspect-square overflow-hidden rounded-lg w-full h-full">
      {paellaImages.map((image, index) => (
        <div
          key={index}
          className={\`absolute inset-0 transition-opacity duration-1000 w-full h-full \${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}\`}
        >
          <Image
            src={image}
            alt={\`Paella de Poisson - Image \${index + 1}\`}
            fill
            className="object-cover object-center w-full h-full group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
};

export default PaellaSlider;`;
  
  fs.writeFileSync(paellaSliderPath, paellaSliderContent);
  console.log('✅ Composant PaellaSlider créé');
} catch (error) {
  console.log('❌ Erreur PaellaSlider:', error.message);
}

// 4. Modifier CartIcon pour inclure Paella
console.log('📝 4. Modification du composant CartIcon...');
try {
  const cartIconPath = path.join(process.cwd(), 'app', 'components', 'CartIcon.js');
  let cartIconContent = fs.readFileSync(cartIconPath, 'utf8');
  
  // Ajouter paellaLots dans getCartSummary
  if (!cartIconContent.includes('paellaLots')) {
    cartIconContent = cartIconContent.replace(
      'const sbmItems = formData.sbmLots || [];\n    const bbmItems = formData.bbmLots || [];',
      'const sbmItems = formData.sbmLots || [];\n    const bbmItems = formData.bbmLots || [];\n    const paellaItems = formData.paellaLots || [];'
    );
  }
  
  // Ajouter l'affichage Paella
  if (!cartIconContent.includes('🍚 Paella de Poisson')) {
    const paellaDisplay = `        {paellaItems.length > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🍚</span>
              <span className="font-medium text-gray-800">Paella de Poisson</span>
              <span className="text-sm text-gray-500">x{paellaItems.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-green-600">{paellaItems.length * 26}€</span>
              {onRemoveItem && (
                <button
                  onClick={() => onRemoveItem('paella', paellaItems[0]?.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  title="Supprimer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}`;
    
    // Insérer après BBM
    const bbmDisplayEnd = cartIconContent.indexOf('</div>', cartIconContent.lastIndexOf('BBM'));
    if (bbmDisplayEnd !== -1) {
      cartIconContent = cartIconContent.slice(0, bbmDisplayEnd + 6) + '\n' + paellaDisplay + '\n' + cartIconContent.slice(bbmDisplayEnd + 6);
    }
  }
  
  fs.writeFileSync(cartIconPath, cartIconContent);
  console.log('✅ CartIcon modifié');
} catch (error) {
  console.log('❌ Erreur CartIcon:', error.message);
}

// 5. Ajouter Paella à l'Instagram feed
console.log('📝 5. Ajout de Paella à l\'Instagram feed...');
try {
  const instagramPath = path.join(process.cwd(), 'app', 'api', 'instagram-simple', 'route.js');
  let instagramContent = fs.readFileSync(instagramPath, 'utf8');
  
  // Ajouter le post Paella en première position
  if (!instagramContent.includes('Paella de Poisson')) {
    const paellaPost = `    {
      id: 1,
      image: '/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-1.webp',
      caption: '🐟 Paella de Poisson - Riz safrané avec poisson frais de la Méditerranée ! Plat traditionnel espagnol cachère parfait pour cette semaine sans viande. Une explosion de saveurs marines ! #paella #poisson #mediterranean #kosher #ibiza',
      likes: 198,
      comments: 34,
      timestamp: new Date().toISOString(),
      isVideo: false
    },`;
    
    // Insérer au début du tableau
    const postsStart = instagramContent.indexOf('return [');
    if (postsStart !== -1) {
      instagramContent = instagramContent.slice(0, postsStart + 8) + '\n' + paellaPost + '\n' + instagramContent.slice(postsStart + 8);
    }
  }
  
  fs.writeFileSync(instagramPath, instagramContent);
  console.log('✅ Instagram feed modifié');
} catch (error) {
  console.log('❌ Erreur Instagram feed:', error.message);
}

// 6. Créer le script d'optimisation des images
console.log('📝 6. Création du script d\'optimisation...');
try {
  const optimizeScriptPath = path.join(process.cwd(), 'optimize-paella-images.js');
  const optimizeScriptContent = `const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'public', 'images', 'paella de poisson');
const outputDir = path.join(__dirname, 'public', 'images', 'paella de poisson');

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  try {
    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.webp')
    );

    console.log(\`Optimisation de \${imageFiles.length} images...\`);

    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace(/\\.(jpg|jpeg|png)$/, '.webp'));
      
      await sharp(inputPath)
        .resize(224, 224, { fit: 'cover', position: 'center' })
        .webp({ quality: 85 })
        .toFile(outputPath);
      
      console.log(\`✅ \${file} optimisé\`);
    }

    console.log('🎉 Optimisation terminée !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error);
  }
}

optimizeImages();`;
  
  fs.writeFileSync(optimizeScriptPath, optimizeScriptContent);
  console.log('✅ Script d\'optimisation créé');
} catch (error) {
  console.log('❌ Erreur script optimisation:', error.message);
}

console.log('\n🎉 Installation automatique terminée !');
console.log('\n📋 Récapitulatif des modifications :');
console.log('✅ Page d\'accueil : Paella ajouté en première position');
console.log('✅ Page réservation : Section Paella avec prix et quantité');
console.log('✅ Composant PaellaSlider : Slider d\'images automatique');
console.log('✅ CartIcon : Affichage Paella dans le panier');
console.log('✅ Instagram feed : Post Paella en première position');
console.log('✅ Script d\'optimisation : optimize-paella-images.js créé');
console.log('\n🚀 Pour finaliser :');
console.log('1. Placez vos images Paella dans public/images/paella de poisson/');
console.log('2. Exécutez : node optimize-paella-images.js');
console.log('3. Redémarrez le serveur : npm run dev'); 