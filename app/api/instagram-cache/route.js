import { NextResponse } from 'next/server';

// Cache en mémoire pour éviter trop de requêtes
let cache = {
  data: null,
  timestamp: null,
  expiresIn: 3600000 // 1 heure
};

export async function GET() {
  try {
    // Vérifier si on a des données en cache récentes
    const now = Date.now();
    if (cache.data && cache.timestamp && (now - cache.timestamp) < cache.expiresIn) {
      console.log('Utilisation du cache Instagram (économise les requêtes)');
      return NextResponse.json({
        ...cache.data,
        source: 'cache',
        cached: true
      });
    }

    // Si pas de cache, faire une vraie requête
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
    const username = 'la_boulette_ibiza';
    
    if (!RAPIDAPI_KEY) {
      console.log('Pas de clé RapidAPI, utilisation du flux simulé');
      return NextResponse.json({
        success: true,
        posts: getFallbackPosts(),
        totalPosts: 6,
        source: 'fallback'
      });
    }

    console.log('Nouvelle requête Instagram (consomme 1 requête)');
    
    const response = await fetch(`https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/media_by_username/${username}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'instagram-bulk-profile-scrapper.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur RapidAPI: ${response.status}`);
    }

    const data = await response.json();
    
    // Transformation des données RapidAPI
    const posts = data.response?.posts?.slice(0, 12).map((post, index) => ({
      id: post.id || index + 1,
      image: post.display_url,
      caption: post.caption?.text || '',
      likes: post.likes || Math.floor(Math.random() * 200) + 50,
      comments: post.comments || Math.floor(Math.random() * 30) + 5,
      timestamp: new Date(post.taken_at_timestamp * 1000).toISOString(),
      isVideo: post.is_video || false,
      permalink: post.permalink || `https://www.instagram.com/p/${post.shortcode}/`
    })) || [];

    const result = {
      success: true,
      posts: posts,
      totalPosts: posts.length,
      source: 'rapidapi'
    };

    // Mettre en cache pour économiser les requêtes
    cache.data = result;
    cache.timestamp = now;

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erreur RapidAPI Instagram:', error);
    
    return NextResponse.json({
      success: true,
      posts: getFallbackPosts(),
      totalPosts: 6,
      source: 'fallback'
    });
  }
}

function getFallbackPosts() {
  return [
    {
      id: 1,
      image: '/images/sbm1.webp',
      caption: 'Sandwich Boulettes Mekbouba SBM - Notre signature ! 🌶️ #labouletteibiza #kosherfriendly',
      likes: 156,
      comments: 23,
      timestamp: new Date().toISOString(),
      isVideo: false
    },
    {
      id: 2,
      image: '/images/nosspecialites-ibiza-kosher-cacher-friendly.webp',
      caption: 'Box Boulettes Mekbouba BBM - La même que le SBM mais en box complète 🍱 #ibiza #kosher',
      likes: 142,
      comments: 18,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isVideo: false
    },
    {
      id: 3,
      image: '/images/mekbouba1-ibiza-kosher-cacher-friendly.webp',
      caption: 'Mekbouba - Poivrons, Piments, Tomates & Zeit 🔥 #mekbouba #tunisianfood',
      likes: 189,
      comments: 31,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isVideo: false
    },
    {
      id: 4,
      image: '/images/uneexperienceunique-ibiza-kosher-cacher-friendly.webp',
      caption: 'Une expérience unique à Ibiza 🌅 #ibiza #kosherfriendly #labouletteibiza',
      likes: 203,
      comments: 45,
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      isVideo: false
    },
    {
      id: 5,
      image: '/images/tajine1.webp',
      caption: 'Tajines Shabbat - Loubia, Hams, Nikitouche 🍲 #shabbat #tajine #kosher',
      likes: 167,
      comments: 28,
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      isVideo: false
    },
    {
      id: 6,
      image: '/images/ibizasunshine-ibiza-kosher-cacher-friendly.webp',
      caption: 'Ibiza Isla Bonita - Une Expérience Culinaire Unique 🌴 #ibiza #islandlife',
      likes: 234,
      comments: 52,
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      isVideo: false
    }
  ];
} 