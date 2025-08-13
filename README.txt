🍽️ GUIDE D'UTILISATION - AJOUT DE NOUVEAUX PLATS
==================================================

📋 DESCRIPTION
-------------
Ce script automatise l'ajout de nouveaux plats sur le site web du restaurant.
Il modifie tous les fichiers nécessaires et crée les composants requis.

🚀 UTILISATION
--------------
1. Ouvrez un terminal dans le dossier du projet
2. Exécutez : node add-new-dish.js
3. Répondez aux questions qui s'affichent

📝 QUESTIONS À RÉPONDRE
------------------------
1. 📝 Nom du plat : ex: "Paella de Poisson"
2. 💰 Prix (en €) : ex: "26"
3. 📄 Description : ex: "Riz safrané avec poisson frais..."
4. 🍽️ Type (ex: paella, sbm, bbm) : ex: "paella"
5. 🎨 Emoji (ex: 🐟, 🍚, 🥪) : ex: "🐟"

✅ CE QUE FAIT LE SCRIPT
------------------------
1. 📁 Crée le dossier : public/images/[nom-normalisé]/
2. 📝 Modifie la page d'accueil (app/page.js)
3. 📝 Modifie la page réservation (app/reservation/page.js)
4. 📝 Crée le composant slider (app/components/[Type]Slider.js)
5. 📝 Modifie le panier (app/components/CartIcon.js)
6. 🔧 Crée le script d'optimisation (optimize-[nom]-images.js)

📁 STRUCTURE DES DOSSIERS
-------------------------
Après exécution, vous aurez :
```
public/images/[nom-normalisé]/
├── [nom]-1.jpg (ou .png)
├── [nom]-2.jpg (ou .png)
├── [nom]-3.jpg (ou .png)
└── [nom]-4.jpg (ou .png)
```

🔧 OPTIMISATION DES IMAGES
--------------------------
1. Placez vos photos dans le dossier créé
2. Exécutez : node optimize-[nom]-images.js
3. Les images seront redimensionnées et converties en WebP

🚀 REDÉMARRAGE
---------------
Après avoir ajouté les photos et optimisé :
npm run dev

💡 EXEMPLES
-----------
Nom du plat : "Paella de Poisson"
→ Dossier créé : public/images/paella-de-poisson/
→ Script d'optimisation : optimize-paella-de-poisson-images.js

Nom du plat : "Couscous Royal"
→ Dossier créé : public/images/couscous-royal/
→ Script d'optimisation : optimize-couscous-royal-images.js

⚠️ NOTES IMPORTANTES
--------------------
- Maximum 4 photos par plat
- Formats acceptés : .jpg, .jpeg, .png, .webp
- Le nom du plat est automatiquement normalisé pour le dossier
- Les accents et caractères spéciaux sont convertis

🎯 RÉSULTAT FINAL
------------------
✅ Le plat apparaît sur la page d'accueil avec slider
✅ Le plat est disponible sur la page réservation
✅ Le plat s'affiche dans le panier
✅ Les photos défilent automatiquement toutes les 5 secondes

📞 SUPPORT
----------
En cas de problème, vérifiez :
1. Que vous êtes dans le bon dossier
2. Que Node.js est installé
3. Que tous les fichiers sont bien créés
4. Que les photos sont dans le bon format

Créé le : $(date)
Version : 1.0 