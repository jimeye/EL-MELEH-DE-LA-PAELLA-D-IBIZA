'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from './Navbar';

export default function NotreHistoirePage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsHeaderVisible(scrollTop < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar isVisible={isHeaderVisible} />
      <section id="histoire" className="pt-20 min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Slata Mechouia-ibiza-kosher-cacher-friendly.webp"
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
              <div className="max-w-2xl w-full px-4 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg border-4 border-accent-red bg-gray-100">
            <Image
              src="/images/jimmy-joseph-ibiza-kosher-cacher-friendly.webp"
              alt="Jimmy Joseph"
              width={160}
              height={160}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
        <div className="bg-white/30 backdrop-blur-sm shadow-lg p-6 md:p-10 space-y-6 text-white text-base leading-relaxed">
          <p><strong>Jimmy Joseph – Le passionné derrière EL MELEH DE LA PAELLA 👑</strong></p>
          <p>Paris-Belleville-Ibiza. Juif tunisien jusqu'au bout de l'ADN, né à Paris. À 20 ans, il a découvert Ibiza, l'île qui ne dort jamais mais qui respire l'été éternel. Depuis, il vit entre ici et là-bas, mais surtout, il savoure cette vibe.</p>
          <p>C'est au fil des Shabbat, en voyant ses invités savourer à chaque fois, qu'il s'est dit : faut qu'il partage ça. Le plaisir dans leurs yeux, les assiettes vides, les "refais-nous ça, Jimmy !" — là, il a compris. Fallait que ça sorte de la maison.</p>
          <p>Pas un resto, pas un food truck. Non, du direct, du simple, du vrai. EL MELEH DE LA PAELLA 👑, c'est la livraison de sandwichs aux boulettes 100 % kasher, préparés dans les règles de l'art — cuisine dédiée, vaisselle trempée au mikvé, séparation viande/lait, respect strict des règles halakhiques, zéro bullshit.</p>
          <p>Il n'a pas de Teouda, mais il a le feu sacré du kehal de Rav M. Gabison, son Rabbi d'amour. Ici, ils font les choses bien, avec respect, passion, et cette énergie qu'on ne trouve qu'en Méditerranée.</p>
          <p>À chacun sa manière de faire vivre l'histoire. Lui, c'est par la cuisine.<br/>La cuisine juive, fruit de l'histoire dispersée, transporte avec elle des récits d'exil, de fêtes et de résistance joyeuse. En préparant chaque plat, il rend hommage à ceux qui lui ont transmis ces saveurs, il fait circuler une mémoire vivante — et il veille à ce qu'elle continue à se transmettre, bouchée après bouchée.</p>
          <p>Et puis y'a Israël, toujours dans son cœur. Un lien viscéral. Une boussole. Une source. Son amour pour Eretz Israël fait partie de tout ce qu'il est — et ça se sent dans chaque boulette.</p>
          <p>EL MELEH DE LA PAELLA 👑, c'est un clin d'œil à Belleville, un hommage à Tunis, une ode à Ibiza… et une pensée pour Jérusalem à chaque bouchée.<br/>Livré avec amour, attitude et convictions.</p>
        </div>
      </div>
    </section>

          {/* Footer Amélioré */}
      <footer className="bg-black text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">EL MELEH DE LA PAELLA 👑</h3>
                          <div className="text-lg mb-4">Kosher Friendly</div>
            <p className="text-sm text-gray-200 mb-4">
              Cuisine certifiée 100% judéo-espagnoles,<br />
              transmise de génération en génération.<br />
              Viande Kosher by <a href="https://bovini.fr/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Bovini</a>.
            </p>
          </div>
          
          <div className="text-center">
            <div className="space-y-2 text-sm">
              <a href="https://wa.me/33756872352" target="_blank" rel="noopener noreferrer" className="block hover:text-gray-200 transition-colors">
📞 +33 7 56 87 23 52
              </a>
                  <a href="mailto:info@el-meleh-ibiza.com" className="block hover:text-gray-200 transition-colors">
                    📧 info@el-meleh-ibiza.com
              </a>
              <a 
                href="https://maps.google.com/maps?q=38.96426,1.47936&z=15"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-gray-200 transition-colors"
                title="Ouvrir dans Google Maps"
              >
                🌍 Ibiza, Espagne
              </a>
            </div>
          </div>
          
          <div className="text-center">
            <div className="space-y-2 text-sm text-gray-200">
              <div>⏰ Des saveurs judéo-espagnoles,<br />partout à Ibiza, tous les jours.</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-200">
                            ©2025 EL MELEH DE LA PAELLA 👑 Kosher friendly<br /><span className="text-xs">Tous droits réservés</span>
          </p>
          <p className="text-xs text-gray-200 mt-2">
                            <a href="https://wa.me/33756872352?text=Je veux le meme site !!" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200 transition-colors">
              Website design by ©MEKBOUBA STUDIO
            </a>
          </p>
        </div>
      </div>
    </footer>
    </>
  );
} 