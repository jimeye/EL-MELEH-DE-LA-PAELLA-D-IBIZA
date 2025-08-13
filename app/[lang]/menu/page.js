'use client';

import { useTranslation } from '../../i18n/useTranslation';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function MenuPage() {
  const { t, loading, locale } = useTranslation();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsHeaderVisible(scrollTop < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Afficher un loader pendant le chargement des traductions
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Chargement des traductions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/uneexperienceunique-ibiza-kosher-cacher-friendly.webp"
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <Navbar isVisible={isHeaderVisible} />
        <div className="container mx-auto px-4 pt-20 pb-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">{t('home.title')}<br />{t('home.kosherFriendly')}</h1>
            <div className="w-24 h-1 bg-accent-red mx-auto mb-6"></div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto text-center">
              {t('menu.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-7xl">
            {/* Sandwich Boulettes Mekbouba */}
            <div className="group relative">
              <div className="shadow-2xl overflow-hidden flex flex-col relative border-2 border-accent-red bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-3xl h-[650px]">
                <div className="relative h-56 aspect-square">
                  <Image
                    src="/images/sbm1.webp"
                    alt={t('menu.sbm.title')}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={85}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">{t('menu.sbm.title')}<br/>{t('menu.price')}</h3>
                  <p className="text-gray-600 mb-4 text-center flex-grow leading-relaxed">
                    {t('menu.sbm.description')}
                  </p>
                  <div className="bg-orange-50 p-3 rounded-lg mb-4 badge-border-pulse border border-red-500">
                    <p className="text-sm text-orange-800 text-center font-semibold">
                      🚚 {t('menu.sbm.freeDelivery')}
                    </p>
                  </div>
                  <Link 
                    href={`/${locale}/reservation`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 bg-accent-red hover:bg-accent-red/90 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full text-center mt-auto text-base btn-shine-3d"
                  >
                    <span className="text-[1.84rem]">🥪</span>
                    <span>{t('home.orderButton')}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Box Boulettes Mekbouba */}
            <div className="group relative">
              <div className="shadow-2xl overflow-hidden flex flex-col relative border-2 border-accent-red bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-3xl h-[650px]">
                <div className="relative h-56 aspect-square">
                  <Image
                    src="/images/bbm1.webp"
                    alt={t('menu.bbm.title')}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={85}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">{t('menu.bbm.title')}<br/>{t('menu.price')}</h3>
                  <p className="text-gray-600 mb-4 text-center flex-grow leading-relaxed">
                    {t('menu.bbm.description')}
                  </p>
                  <div className="bg-green-50 p-3 rounded-lg mb-4 badge-border-pulse border border-red-500">
                    <p className="text-sm text-green-800 text-center font-semibold">
                      🚚 {t('menu.bbm.freeDelivery')}
                    </p>
                  </div>
                  <Link 
                    href={`/${locale}/reservation`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 bg-accent-red hover:bg-accent-red/90 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full text-center mt-auto text-base btn-shine-3d"
                  >
                    <span className="text-[1.84rem]">🍱</span>
                    <span>{t('home.orderButton')}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Tajines Shabbat */}
            <div className="group relative">
              <div className="shadow-2xl overflow-hidden flex flex-col relative border-2 border-accent-red bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-3xl h-[650px]">
                <div className="relative h-56 aspect-square">
                  <Image
                    src="/images/shabbat-catering-ibiza-kosher-cacher-friendly-ou-manger-cacher.webp"
                    alt={t('menu.tajines.title')}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={85}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">{t('menu.tajines.title')}<br/>45 €</h3>
                  <p className="text-gray-600 mb-4 text-center flex-grow leading-relaxed">
                    {t('menu.tajines.description')}
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 text-center font-semibold">
                      👥 {t('menu.tajines.minPeople')}
                    </p>
                  </div>
                  <button 
                    className="inline-flex items-center justify-center space-x-2 bg-gray-400 text-white px-5 py-1.5 rounded-xl font-semibold cursor-not-allowed w-full text-center mt-auto text-base"
                    disabled
                  >
                    <span className="text-[1.84rem]">🔜</span>
                    <span>{t('menu.tajines.comingSoon')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
                  <a href="https://wa.me/33756872352" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">📞 +33 7 56 87 23 52</a>
                  <a href="mailto:info@el-meleh-ibiza.com" className="block hover:text-white transition-colors">📧 info@el-meleh-ibiza.com</a>
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
    </>
  );
} 