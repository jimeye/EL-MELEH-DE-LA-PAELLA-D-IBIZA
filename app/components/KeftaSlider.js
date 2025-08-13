'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const KeftaSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Images du slider (utilisant les vraies images optimisées)
  const keftaImages = [
    '/images/sandwich-kefta-poisson/sandwich-kefta-poisson-paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-1-ibiza-kosher-cacher-friendly.webp',
    '/images/sandwich-kefta-poisson/sandwich-kefta-poisson-paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-2-ibiza-kosher-cacher-friendly.webp',
    '/images/sandwich-kefta-poisson/sandwich-kefta-poisson-paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-3-ibiza-kosher-cacher-friendly.webp'
  ];

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === keftaImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change d'image toutes les 5 secondes

    return () => clearInterval(interval);
  }, [keftaImages.length]);

  return (
    <div className="relative h-56 aspect-square overflow-hidden w-full">
      {keftaImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isClient && index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`Sandwich Kefta Poisson ${index + 1}`}
            fill
            className="object-cover object-center w-full h-full group-hover:scale-110 transition-transform duration-500"
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
          />
        </div>
      ))}
    </div>
  );
};

export default KeftaSlider; 