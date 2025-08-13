"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const paellaImages = [
  '/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-1.webp',
  '/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-2.webp',
  '/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-3.webp',
  '/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-4.webp',
];

export default function PaellaSlider() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

                useEffect(() => {
                const interval = setInterval(() => {
                  setCurrentImageIndex((prevIndex) =>
                    prevIndex === paellaImages.length - 1 ? 0 : prevIndex + 1
                  );
                }, 5000); // Change d'image toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-56 aspect-square overflow-hidden w-full">
      {paellaImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 w-full h-full ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`Paella de Pescado - Image ${index + 1}`}
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
} 