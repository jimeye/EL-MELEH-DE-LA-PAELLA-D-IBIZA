import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Web scraping Instagram (alternative à l'API officielle)
    // Note: Cette méthode peut être instable car Instagram change souvent sa structure
    
    const username = 'la_boulette_ibiza'; // Votre nom d'utilisateur Instagram
    
    // Tentative de récupération via scraping
    const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('Impossible de récupérer les données Instagram');
    }

    const data = await response.json();
    
    // Transformation des données scrapées
    const posts = data.graphql?.user?.edge_owner_to_timeline_media?.edges?.slice(0, 12).map((edge, index) => ({
      id: edge.node.id,
      image: edge.node.display_url,
      caption: edge.node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
      likes: edge.node.edge_media_preview_like?.count || 0,
      comments: edge.node.edge_media_to_comment?.count || 0,
      timestamp: new Date(edge.node.taken_at_timestamp * 1000).toISOString(),
      isVideo: edge.node.is_video,
      permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`
    })) || [];

    return NextResponse.json({
      success: true,
      posts: posts,
      totalPosts: posts.length,
      source: 'scraping'
    });

  } catch (error) {
    console.error('Erreur scraping Instagram:', error);
    
    // Fallback vers le flux simulé
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