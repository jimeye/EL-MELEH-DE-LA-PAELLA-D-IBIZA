import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Utilisation d'une app Instagram existante (pas besoin de créer une app)
    // Cette méthode utilise l'API publique d'Instagram
    
    const username = 'la_boulette_ibiza';
    
    // Tentative de récupération via l'API publique
    const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error('Impossible de récupérer les données Instagram');
    }

    const data = await response.json();
    
    // Transformation des données
    const posts = data.graphql?.user?.edge_owner_to_timeline_media?.edges?.slice(0, 12).map((edge, index) => ({
      id: edge.node.id,
      image: edge.node.display_url,
      caption: edge.node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
      likes: edge.node.edge_media_preview_like?.count || Math.floor(Math.random() * 200) + 50,
      comments: edge.node.edge_media_to_comment?.count || Math.floor(Math.random() * 30) + 5,
      timestamp: new Date(edge.node.taken_at_timestamp * 1000).toISOString(),
      isVideo: edge.node.is_video,
      permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`
    })) || [];

    return NextResponse.json({
      success: true,
      posts: posts,
      totalPosts: posts.length,
      source: 'instagram_public'
    });

  } catch (error) {
    console.error('Erreur Instagram public:', error);
    
    // Fallback vers le flux simulé avec photos dynamiques
    return NextResponse.json({
      success: true,
      posts: await getDynamicInstagramPosts(),
      totalPosts: 5,
      source: 'dynamic_fallback'
    });
  }
}

async function getDynamicInstagramPosts() {
  const instagramDir = path.join(process.cwd(), 'public', 'instagram');
  const posts = [];
  
  try {
    // Vérifier si le dossier existe
    if (!fs.existsSync(instagramDir)) {
      console.log('Dossier Instagram non trouvé, utilisation des posts par défaut');
      return getDefaultPosts();
    }

    // Lire tous les fichiers du dossier Instagram
    const files = fs.readdirSync(instagramDir);
    const imageFiles = files.filter(file => 
      file.endsWith('.webp') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    ).sort(); // Trier pour un ordre cohérent

    if (imageFiles.length === 0) {
      console.log('Aucune image trouvée dans le dossier Instagram, utilisation des posts par défaut');
      return getDefaultPosts();
    }

    // Créer des posts dynamiques basés sur les images trouvées
    imageFiles.forEach((file, index) => {
      const imagePath = `/instagram/${file}`;
      const caption = generateCaption(file, index);
      
      posts.push({
        id: index + 1,
        image: imagePath,
        caption: caption,
        likes: Math.floor(Math.random() * 300) + 100,
        comments: Math.floor(Math.random() * 50) + 10,
        timestamp: new Date(Date.now() - (index * 3600000)).toISOString(),
        isVideo: false
      });
    });

    // Ajouter les posts par défaut après les photos dynamiques
    const defaultPosts = getDefaultPosts();
    defaultPosts.forEach((post, index) => {
      posts.push({
        ...post,
        id: posts.length + index + 1,
        timestamp: new Date(Date.now() - ((posts.length + index) * 3600000)).toISOString()
      });
    });

    console.log(`✅ ${posts.length} posts Instagram générés (${imageFiles.length} dynamiques + ${defaultPosts.length} par défaut)`);
    return posts;

  } catch (error) {
    console.error('Erreur lors de la lecture du dossier Instagram:', error);
    return getDefaultPosts();
  }
}

function generateCaption(filename, index) {
  const captions = [
    '🌅 Ibiza Isla Bonita - Une Expérience Culinaire Unique ! Découvrez nos saveurs authentiques dans un cadre paradisiaque.',
    '🍽️ EL MELEH DE LA PAELLA 👑 - Notre signature culinaire ! Des saveurs traditionnelles revisitées avec passion.',
    '🌴 Sunset à Ibiza - L\'heure parfaite pour savourer nos spécialités ! Une ambiance magique pour des moments inoubliables.',
    '🍲 Traditions culinaires du Maghreb - Nos plats authentiques vous transportent au cœur des saveurs méditerranéennes.',
    '✨ Une expérience gastronomique unique à Ibiza ! Découvrez nos créations culinaires dans un cadre exceptionnel.'
  ];

  // Utiliser l'index pour sélectionner une légende, ou générer une légende basée sur le nom de fichier
  if (index < captions.length) {
    return captions[index];
  }

  // Légende générique basée sur le nom de fichier
  if (filename.includes('ibizasunshine')) {
    return '☀️ Ibiza Sunshine - La lumière unique d\'Ibiza illumine nos créations culinaires !';
  } else if (filename.includes('kosher')) {
    return '🕯️ Cuisine cachère authentique - Nos plats respectent les traditions tout en innovant !';
  } else {
    return '🌅 Moment magique à Ibiza - Une expérience culinaire qui éveille tous les sens !';
  }
}

function getDefaultPosts() {
  return [
    {
      id: 1,
      image: '/images/sandwich-kefta-poisson/sandwich-kefta-poisson-paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-1-ibiza-kosher-cacher-friendly.webp',
                     caption: '🥪 Sandwich Kefta Poisson Mekbouba SKM - 🌙 Spécial Ticha Beav 🌊✨ Baguette, mekbouka maison, kefta de poisson aux épices et herbes, œuf au plat coulant. Léger, savoureux, et profondément méditerranéen !',
      likes: 245,
      comments: 42,
      timestamp: new Date().toISOString(),
      isVideo: false
    },
    {
      id: 2,
      image: '/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-1.webp',
      caption: '🐟 Paella de Pescado - Riz safrané avec poisson frais de la Méditerranée ! Plat traditionnel espagnol cachère parfait pour cette semaine sans viande. Une explosion de saveurs marines !',
      likes: 198,
      comments: 34,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isVideo: false
    },
    {
      id: 3,
      image: '/images/sbm1.webp',
      caption: 'Sandwich Boulettes Mekbouba SBM - Notre signature ! 🌶️',
      likes: 156,
      comments: 23,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isVideo: false
    },
    {
      id: 4,
      image: '/images/esvedra-ibizasunshine-ibiza-kosher-cacher-friendly.webp',
      caption: '🌅 Es Vedrà - Le rocher magique d\'Ibiza ! Ce monument naturel mystique est l\'un des symboles les plus emblématiques de l\'île. Une vue à couper le souffle qui inspire nos créations culinaires !',
      likes: 267,
      comments: 38,
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      isVideo: false
    },
    {
      id: 5,
      image: '/images/nosspecialites-ibiza-kosher-cacher-friendly.webp',
      caption: 'Box Boulettes Mekbouba BBM - La même que le SBM mais en box complète 🍱',
      likes: 142,
      comments: 18,
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      isVideo: false
    },
    {
      id: 6,
      image: '/images/mekbouba1-ibiza-kosher-cacher-friendly.webp',
      caption: 'Mekbouba - Poivrons, Piments, Tomates & Zeit 🔥',
      likes: 189,
      comments: 31,
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      isVideo: false
    },
    {
      id: 7,
      image: '/images/tajine1.webp',
      caption: 'Tajines Shabbat - Loubia, Hams, Nikitouche 🍲',
      likes: 167,
      comments: 28,
      timestamp: new Date(Date.now() - 21600000).toISOString(),
      isVideo: false
    },
    {
      id: 8,
      image: '/images/ibizasunshine-ibiza-kosher-cacher-friendly.webp',
      caption: 'Ibiza Isla Bonita - Une Expérience Culinaire Unique 🌴',
      likes: 234,
      comments: 52,
      timestamp: new Date(Date.now() - 25200000).toISOString(),
      isVideo: false
    }
  ];
} 