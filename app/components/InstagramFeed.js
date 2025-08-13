'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function InstagramFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Utiliser la route simple qui ne nécessite pas de portefeuille business
        const response = await fetch('/api/instagram-simple');
        const data = await response.json();
        
        if (data.success) {
          setPosts(data.posts);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Erreur lors du chargement des posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours === 1) return 'Il y a 1h';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Il y a 1j';
    return `Il y a ${diffInDays}j`;
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-0">
      {posts.map((post, index) => (
        <div key={post.id} className={`group relative aspect-[3/4] overflow-hidden ${index >= 6 ? 'hidden sm:block' : ''}`}>
          <Image
            src={post.image}
            alt={post.caption}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 16vw"
          />
          
          {/* Overlay au hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
            {/* Header avec likes et commentaires */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">❤️ {post.likes}</span>
                <span className="text-sm">💬 {post.comments}</span>
              </div>
            </div>
            
            {/* Caption */}
            <div className="text-sm leading-relaxed">
              {post.caption}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 