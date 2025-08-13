"use client";

import Image from 'next/image';
import Navbar from './components/Navbar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import HeroSliderNew from './components/HeroSliderNew';
import MusicPlayerButton from './components/MusicPlayerButton';
import InstagramFeed from './components/InstagramFeed';
import PaellaSlider from './components/PaellaSlider';
import KeftaSlider from './components/KeftaSlider';

const heroImages = [
  {
    id: 1,
    image: '/images/ibiza-sunshine-cala--kosher-cacher-friendly-paella-restaurtant-2.webp',
    title: 'Paella de Pescado',
    description: 'La Mejor Paella del mundo',
    deliveryInfo: "Livraisons partout sur l'île du dimanche au vendredi",
    preOrderInfo: 'Pré-Commande Obligatoire<br />à partir de 4 personnes',
    reservationText: 'nous aussi on a le droit ! reserve des maintenant',
    bottomText: 'Des saveurs judéo-espagnoles,<br />partout à Ibiza, tous les jours.'
  },
  {
    id: 3,
    image: '/images/ibiza-sunshine-cala--kosher-cacher-friendly-paella-restaurtant-3.webp',
    title: 'Paella de Pollo',
    description: 'Du riz qui chante, un parfum d’Espagne… sans la griffe du homard !',
    deliveryInfo: "Livraisons partout sur l'île du dimanche au vendredi",
    preOrderInfo: 'Pré-Commande Obligatoire<br />à partir de 4 personnes',
    reservationText: 'nous aussi on a le droit ! reserve des maintenant',
    bottomText: 'Des saveurs judéo-espagnoles,<br />partout à Ibiza, tous les jours.'
  },
  {
    id: 4,
    image: '/images/ibiza-sunshine-cala--kosher-cacher-friendly-paella-restaurtant-4.webp',
    title: 'Fideua de pescado',
    description: 'Des vermicelles dorés, un parfum de mer et le soleil d’Espagne dans l’assiette.',
    deliveryInfo: "Livraisons partout sur l'île du dimanche au vendredi",
    preOrderInfo: 'Pré-Commande Obligatoire<br />à partir de 4 personnes',
    reservationText: 'nous aussi on a le droit ! reserve des maintenant',
    bottomText: 'Des saveurs judéo-espagnoles,<br />partout à Ibiza, tous les jours.'
  },
  {
    id: 5,
    image: '/images/ibiza-sunshine-cala--kosher-cacher-friendly-paella-restaurtant-1.webp',
    title: 'Ibiza Isla Bonita',
    description: 'Une Expérience Culinaire Unique<br/>À Ibiza Kosher Friendly',
    deliveryInfo: "Livraisons partout sur l'île du dimanche au vendredi",
    preOrderInfo: 'Pré-Commande Obligatoire<br />à partir de 4 personnes',
    reservationText: 'nous aussi on a le droit ! reserve des maintenant',
    bottomText: 'Des saveurs judéo-espagnoles,<br />partout à Ibiza, tous les jours.'
  }
];

const tajineImages = [
  '/images/tajine2.webp', // Image principale des tajines
  '/images/tajine1.webp', // Votre nouvelle image de tajine
  // Ajoutez ici vos nouvelles images de tajines en format WebP
  // Exemple: '/images/tajine3.webp', '/images/tajine4.webp', etc.
];

function OrientationLock({ children }) {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const check = () => {
      const isMobile = window.innerWidth < 900;
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      setShowOverlay(isMobile && !isPortrait);
    };
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  if (showOverlay) {
    return (
      <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[9999]">
        <p className="text-white text-2xl font-bold mb-4">Veuillez tourner votre téléphone en mode portrait 📱</p>
      </div>
    );
  }
  return children;
}

export default function HomeNew() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // S'assurer que la page se positionne en haut lors du rafraîchissement
  useEffect(() => {
    // Méthode 1: Scroll vers le haut immédiatement
    window.scrollTo(0, 0);
    
    // Méthode 2: Supprimer les ancres dans l'URL
    if (window.location.hash) {
      window.location.hash = '';
    }
    
    // Méthode 3: Forcer le scroll après un délai (pour mobile)
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100);
    
    // Méthode 4: Forcer le scroll vers le haut au chargement
    window.scrollTo(0, 0);
    
  }, []);

  // Fonction simplifiée pour gérer la visibilité du header
  const handleSliderScroll = (isScrolledOnSlider) => {
    // Désactivé pour éviter les conflits de scroll
    // setIsHeaderVisible(!isScrolledOnSlider);
  };

  return (
    <OrientationLock>
      <main className="min-h-screen bg-white">
        <Navbar isVisible={isHeaderVisible} />
        
        {/* Hero Section avec Images à la Suite */}
        <section id="hero" className="relative">
          <HeroSliderNew images={heroImages} onSliderScroll={handleSliderScroll} />
        </section>
        
        {/* H1 Principal pour SEO */}
        <section className="py-8 bg-white relative">
          <div className="absolute inset-0 z-0" style={{
            backgroundImage: "url('/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-1.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              EL MELEH DE LA PAELLA 👑<br />
              <Link href="/catering" className="hover:text-[#0038B8] transition-colors">
                Catering du lundi au jeudi.
              </Link><br />
              Cacher, Kosher Friendly à Ibiza
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Découvrez notre cuisine traditionnelle, servie en bord de mer à Ibiza. Idéal pour vos vacances sous le soleil. Cacher, Kosher Friendly.
            </p>
          </div>
        </section>

        {/* Menu Section Amélioré */}
        <section id="menu" className="relative min-h-screen bg-gray-50 py-20 transition-all duration-700 ease-in-out">
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/uneexperienceunique-ibiza-kosher-cacher-friendly.webp"
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                quality={85}
              />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">Notre Menu</h2>
              <div className="w-24 h-1 bg-[#0038B8] mx-auto mb-6"></div>
            </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-7xl">
               {/* Paella de Poisson (Classique) */}
               <div className="group relative">
                 <div className="shadow-2xl overflow-hidden flex flex-col relative border-2 border-[#0038B8] bg-[#f9f7f2] transform transition-all duration-500 hover:scale-105 hover:shadow-3xl h-[650px]">
                   <div className="relative h-56 aspect-square">
                     {/* On réutilise une image existante */}
                      <Image
                        src="/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-2.webp"
                        alt="Paella de Pescado"
                       fill
                       className="object-cover group-hover:scale-110 transition-transform duration-500"
                       sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                       quality={85}
                     />
                   </div>
                   <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Paella de Pescado<br/><span className="text-blue-800">32 €</span></h3>
                      <p className="text-blue-800 mb-4 text-center flex-grow leading-relaxed">
                       Riz safrané, poisson frais, légumes. 100% cacher. Sans crustacés ni fruits de mer.
                     </p>
                     <div className="bg-blue-50 p-3 mb-4 badge-border-pulse border border-blue-500">
                       <p className="text-sm text-blue-800 text-center font-semibold">👥 Minimum 4 personnes</p>
                     </div>
                     <a 
                       href="/reservation"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="inline-flex items-center justify-center space-x-2 bg-[#0038B8] hover:bg-[#0038B8]/90 text-white border border-black px-5 py-2 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full text-center mt-auto text-base btn-shine-3d"
                     >
                       <span>COMMANDEZ</span>
                     </a>
                   </div>
                 </div>
               </div>

               {/* Paella de Pollo */}
               <div className="group relative">
                 <div className="shadow-2xl overflow-hidden flex flex-col relative border-2 border-[#0038B8] bg-[#f9f7f2] transform transition-all duration-500 hover:scale-105 hover:shadow-3xl h-[650px]">
                   <div className="relative h-56 aspect-square">
                      <Image
                        src="/images/sbm1.webp"
                        alt="Paella de Pollo"
                       fill
                       className="object-cover group-hover:scale-110 transition-transform duration-500"
                       sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                       quality={85}
                     />
                   </div>
                   <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Paella de Pollo<br/><span className="text-blue-800">32 €</span></h3>
                      <p className="text-blue-800 mb-4 text-center flex-grow leading-relaxed">
                       Riz safrané, poulet, légumes de saison. 100% cacher. Sans crustacés ni fruits de mer.
                     </p>
                      <div className="bg-blue-50 p-3 mb-4 badge-border-pulse border border-blue-500">
                        <p className="text-sm text-blue-800 text-center font-semibold">👥 Minimum 4 personnes</p>
                      </div>
                     <a 
                       href="/reservation"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="inline-flex items-center justify-center space-x-2 bg-[#0038B8] hover:bg-[#0038B8]/90 text-white border border-black px-5 py-2 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full text-center mt-auto text-base btn-shine-3d"
                     >
                       <span>COMMANDEZ</span>
                     </a>
                   </div>
                 </div>
               </div>

               {/* Paella de Poisson - Légumes (supprimée) */}

               {/* Paella de Poisson - Safran Plus */}
               <div className="group relative">
                 <div className="shadow-2xl overflow-hidden flex flex-col relative border-2 border-[#0038B8] bg-[#f9f7f2] transform transition-all duration-500 hover:scale-105 hover:shadow-3xl h-[650px]">
                   <div className="relative h-56 aspect-square">
                      <Image
                        src="/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-4.webp"
                        alt="Paella de Rochas"
                       fill
                       className="object-cover group-hover:scale-110 transition-transform duration-500"
                       sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                       quality={85}
                     />
                   </div>
                   <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Paella de Rochas<br/><span className="text-blue-800">38 €</span></h3>
                      <p className="text-blue-800 mb-4 text-center flex-grow leading-relaxed">
                       Accent safrané plus prononcé, poisson frais, légumes. 100% cacher. Sans crustacés ni fruits de mer.
                     </p>
                      <div className="bg-blue-50 p-3 mb-4 badge-border-pulse border border-blue-500">
                        <p className="text-sm text-blue-800 text-center font-semibold">👥 Minimum 4 personnes</p>
                      </div>
                     <a 
                       href="/reservation"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="inline-flex items-center justify-center space-x-2 bg-[#0038B8] hover:bg-[#0038B8]/90 text-white border border-black px-5 py-2 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full text-center mt-auto text-base btn-shine-3d"
                     >
                       <span>COMMANDEZ</span>
                     </a>
                   </div>
                 </div>
               </div>

               {/* Fideua de Poisson */}
               <div className="group relative">
                 <div className="shadow-2xl overflow-hidden flex flex-col relative border-2 border-[#0038B8] bg-[#f9f7f2] transform transition-all duration-500 hover:scale-105 hover:shadow-3xl h-[650px]">
                   <div className="relative h-56 aspect-square">
                     <Image
                       src="/images/paella de poisson/paella-poisson-ibiza-kosher-cacher-friendly-ou-manger-cacher-1.webp"
                       alt="Fideua de Poisson"
                       fill
                       className="object-cover group-hover:scale-110 transition-transform duration-500"
                       sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                       quality={85}
                     />
                   </div>
                   <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Fideua de Poisson<br/><span className="text-blue-800">32 €</span></h3>
                      <p className="text-blue-800 mb-4 text-center flex-grow leading-relaxed">
                       Nouilles fines façon paella, poisson frais, légumes de saison, safran. 100% cacher, sans crustacés ni fruits de mer.
                     </p>
                      <div className="bg-blue-50 p-3 mb-4 badge-border-pulse border border-blue-500">
                        <p className="text-sm text-blue-800 text-center font-semibold">👥 Minimum 2 personnes</p>
                      </div>
                     <a 
                       href="/reservation"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="inline-flex items-center justify-center space-x-2 bg-[#0038B8] hover:bg-[#0038B8]/90 text-white border border-black px-5 py-2 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full text-center mt-auto text-base btn-shine-3d"
                     >
                       <span>COMMANDEZ</span>
                     </a>
                   </div>
                 </div>
               </div>

             </div>
           </div>
         </section>

        {/* Gallery Section */}
        <section id="gallery" className="relative min-h-screen bg-white py-20 hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gray-800 mb-6">Diner Room</h2>
              <div className="w-24 h-1 bg-[#0038B8] mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                '/images/mekbouba1.webp',
                '/images/nos specialites.webp',
                '/images/uneexperienceunique-ibiza-kosher-cacher-friendly.webp',
                '/images/ibizasunshine-ibiza-kosher-cacher-friendly.webp'
              ].map((image, index) => (
                <div key={index} className="group relative overflow-hidden shadow-lg">
                  <div className="relative h-64">
                    <Image
                      src={image}
                      alt={`Galerie ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Section (masqué) */}
        <section className="bg-white relative hidden">
          {/* Feed Instagram en temps réel - plein écran */}
          <InstagramFeed />
          
          {/* Titre Instagram - overlay sur la section Instagram */}
          <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <h2 className="text-5xl font-bold text-white drop-shadow-2xl">
              Instagram
            </h2>
          </div>
          
          
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative min-h-screen py-20 hidden">
                    <div className="absolute inset-0 z-0">
                      <Image
                        src="/images/uneexperienceunique-ibiza-kosher-cacher-friendly.webp"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="100vw"
                        quality={75}
                      />
                    </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">Prenez le micro 🎙️</h2>
              <div className="w-24 h-1 bg-[#0038B8] mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-8 -2xl h-[400px] flex flex-col">
                <h3 className="text-[1.7rem] font-bold text-white mb-6 text-center">Essentiel</h3>
                <div className="space-y-4 flex-grow text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-[1.2rem]">📞</div>
                    <div>
                      <div className="text-white font-semibold text-base">Téléphone</div>
                      <a href="https://wa.me/33756872352" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent-red transition-colors text-base">
+33 7 56 87 23 52
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-[1.2rem]">📧</div>
                    <div>
                      <div className="text-white font-semibold text-base">Email</div>
                                      <a href="mailto:info@el-meleh-de-la-paella-ibiza.com" className="text-white hover:text-accent-red transition-colors text-base">
                        info@el-meleh-de-la-paella-ibiza.com
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-[1.2rem]">🌍</div>
                    <div>
                      <div className="text-white font-semibold text-base">Localisation</div>
                      <a 
                        href="https://maps.google.com/maps?q=38.96426,1.47936&z=15"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-accent-red transition-colors duration-300 cursor-pointer text-base"
                        title="Ouvrir dans Plans, Waze ou Google Maps"
                      >
                        Ibiza, Espagne
                      </a>
                    </div>
                  </div>
                    </div>
                  </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 -2xl h-[400px] flex flex-col">
                <h3 className="text-[1.7rem] font-bold text-white mb-6 text-center">Pré-commande obligatoire</h3>
                <div className="space-y-4 flex-grow text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-[1.2rem]">⏰</div>
                    <div className="text-base text-white hover:text-accent-red transition-colors duration-300">
                      Des saveurs judéo-espagnoles,<br />partout à Ibiza, tous les jours.
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2 mt-2">
                    <div className="text-base text-white hover:text-accent-red transition-colors duration-300">
                      Viande Kosher by <a href="https://bovini.fr/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Bovini</a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 -2xl h-[400px] flex flex-col">
                <h3 className="text-[1.7rem] font-bold text-white mb-6 text-center">COMMANDEZ maintenant</h3>
                <p className="text-white hover:text-accent-red transition-colors duration-300 mb-6 flex-grow text-center leading-relaxed px-4 text-base">
                  Prêt à découvrir nos saveurs authentiques ?<br />
                  COMMANDEZ directement via WhatsApp !
                </p>
                <a 
                  href="/reservation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-[#0038B8] hover:bg-[#0038B8]/90 text-black border border-black px-5 py-1.5  font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full text-center mt-auto text-base"
                >
                  <span>COMMANDEZ</span>
                </a>
              </div>
            </div>
          </div>
        </section>

              {/* Footer Amélioré */}
      <footer className="bg-[#0038B8] text-white py-3">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-0">EL MELEH DE LA PAELLA D'IBIZA</h3>
                <div className="text-base mb-0">Kosher Friendly</div>
                <div className="mb-2"></div>
                <p className="text-sm text-white mb-2">
                  Cuisine certifiée 100% judéo-espagnoles,<br />
                  transmise de génération en génération.<br /><br />
                  Viande Kosher by <a href="https://bovini.fr/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Bovini</a>.
                </p>
              </div>
              
              <div className="text-center md:text-left">
                <div className="text-sm text-white mb-2">
                  Des saveurs judéo-espagnoles,<br />partout à Ibiza, tous les jours.<br /><br />
                </div>
                <div className="space-y-1 text-sm">
                  <a href="https://wa.me/33756872352" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
📞 +33 7 56 87 23 52
                  </a>
                  <a href="mailto:info@el-meleh-ibiza.com" className="block hover:text-white transition-colors">
📧 info@el-meleh-ibiza.com
                  </a>
                  <a 
                    href="https://maps.google.com/maps?q=38.96426,1.47936&z=15"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-white transition-colors"
                    title="Ouvrir dans Google Maps"
                  >
                    🌍 Ibiza, Espagne
                  </a>
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <div className="mt-0">
                  <p className="text-sm text-white">
                    © 2025 EL MELEH DE LA PAELLA D'IBIZA KOSHER FRIENDLY
                  </p>
                  <p className="text-xs text-white mt-1">
                    <a href="https://wa.me/33756872352?text=Je veux le meme site !!" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      Website design by JOSEPH-STUDIO.COM
                    </a>
                    <br />
                    <span>Tous droits réservés</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
      <MusicPlayerButton />
    </OrientationLock>
  );
} 