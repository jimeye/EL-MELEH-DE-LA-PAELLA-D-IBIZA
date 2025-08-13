'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import Image from 'next/image';



export default function OuMangerCacherIbiza() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const router = useRouter();

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
      <Head>
        <title>Où manger cacher à Ibiza ? Découvrez La Boulette, une adresse judéo-tunisienne authentique 🌶️</title>
        <meta name="description" content="Vous cherchez un restaurant cacher à Ibiza ? EL MELEH DE LA PAELLA 👑 propose une cuisine judéo-tunisienne authentique : sandwichs Mékbouba, tajines, couscous. Livraison et précommande en ligne." />
        <meta name="keywords" content="restaurant cacher ibiza, manger cacher ibiza, cuisine judéo-tunisienne ibiza, kosher friendly ibiza, la boulette ibiza, sandwichs mékbouba, tajines ibiza, couscous ibiza, livraison cacher ibiza" />
      </Head>
      <div className="min-h-screen bg-[#f9f7f2]">
        <Navbar isVisible={isHeaderVisible} />
      {/* Header */}
      <div className="relative text-white py-20">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/images/uneexperienceunique-ibiza-kosher-cacher-friendly-ou-manger-cacher.webp')"}}></div>
        <div className="relative z-10 w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Où manger cacher à Ibiza ?
          </h1>
          <p className="text-xl md:text-2xl">
            Découvrez EL MELEH DE LA PAELLA 👑,<br />
            une adresse judéo-tunisienne authentique 🌶️
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="w-full py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Introduction */}
          <div className="mb-12 text-center px-4">
            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Vous cherchez un restaurant cacher à Ibiza ? EL MELEH DE LA PAELLA 👑 
              est une adresse incontournable pour les amateurs de cuisine 
              judéo-tunisienne authentique.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-700">
              Située à Ibiza, La Boulette propose une carte originale : 
              sandwichs mékbouba, boulettes, tajines maison, couscous boulettes légumes parfumés, pkaïla, loubia, harissa blé 
              ou encore box à emporter pour vos journées à la plage et vos soirées.
            </p>
          </div>

          {/* Image principale */}
          <div className="mb-12 text-center">
            <div className="relative w-full h-96 overflow-hidden shadow-lg">
              <Image
                src="/images/mekbouba1.webp"
                alt="EL MELEH DE LA PAELLA 👑 - Restaurant cacher judéo-tunisien"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  EL MELEH DE LA PAELLA 👑
                </h2>
                <p className="text-xl md:text-2xl text-white">
                  Kosher Friendly
                </p>
              </div>
            </div>
          </div>

          {/* Section Cuisine Authentique */}
          <section className="mb-12 text-center px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Une cuisine judéo-tunisienne authentique
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-red-600 mb-4">
                  Nos spécialités maison
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center justify-center">
                    <span className="text-red-500 mr-2">🌶️</span>
                    <strong>Sandwichs Mékbouba</strong> - Notre signature
                  </li>
                  <li className="flex items-center justify-center">
                    <span className="text-red-500 mr-2">🍲</span>
                    <strong>Tajines traditionnels</strong> - Cuisinés avec amour
                  </li>
                  <li className="flex items-center justify-center">
                    <span className="text-red-500 mr-2">🥘</span>
                    <strong>Couscous parfumé</strong> - Recettes par ma Maman
                  </li>
                  <li className="flex items-center justify-center">
                    <span className="text-red-500 mr-2">📦</span>
                    <strong>Box à emporter</strong> - Parfaits pour vos soirées
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-red-600 mb-4">
                  Respect des traditions
                </h3>
                <p className="text-gray-700 mb-4">
                  Tous nos plats sont <strong>cacher friendly</strong>, préparés 
                  dans le respect des traditions culinaires judéo-tunisiennes.
                </p>
                <p className="text-gray-700">
                  Nous utilisons uniquement des <strong>produits frais et</strong> 
                  <strong> faits maison</strong> pour garantir une qualité exceptionnelle.
                </p>
              </div>
            </div>
          </section>

          {/* Section Services */}
          <section className="mb-12 p-8 text-center px-4 relative">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/images/mekbouba2-ibiza-kosher-cacher-friendly.webp')"}}></div>
            <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Nos services pour votre confort
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Livraison à domicile
                </h3>
                <p className="text-white">
                  Profitez de nos plats chez vous, livrés rapidement à votre adresse.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Précommande en ligne
                </h3>
                <p className="text-white">
                  COMMANDEZ facilement sur notre site et récupérez à l'heure souhaitée.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Produits frais & faits maison
                </h3>
                <p className="text-white">
                  Qualité garantie avec des ingrédients frais et des recettes authentiques.
                </p>
              </div>
            </div>
            </div>
          </section>

          {/* Section Pourquoi choisir La Boulette */}
          <section className="mb-12 text-center px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Pourquoi choisir La Boulette pour manger cacher à Ibiza ?
            </h2>
            
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Authenticité garantie
                </h3>
                <p className="text-gray-700">
                  Nos recettes viennent directement de Maman, transmises de génération en génération.
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Respect des traditions cacher
                </h3>
                <p className="text-gray-700">
                  Tous nos plats respectent les règles de la cacherout pour votre tranquillité.
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Flexibilité totale
                </h3>
                <p className="text-gray-700">
                  Que vous soyez en vacances ou résident sur l'île, nous nous adaptons à vos besoins.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="relative text-white p-8 text-center px-4">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/images/uneexperienceunique-ibiza-kosher-cacher-friendly-ou-manger-cacher.webp')"}}></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à découvrir nos saveurs ?
              </h2>
              <p className="text-xl mb-6">
                Que vous soyez en vacances ou résident sur l'île, La Boulette est l'option idéale 
                pour manger cacher à Ibiza, avec des saveurs de Maman qu'on ne retrouve nulle part ailleurs !
              </p>
            
              <div className="flex justify-center space-x-4">
                <Link 
                  href="/menu" 
                  className="inline-block bg-accent-red hover:bg-accent-red/90 text-black border border-black px-8 py-2 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-center text-base btn-shine-3d  w-32 flex items-center justify-center"
                >
                  Menu
                </Link>
                <Link 
                  href="/reservation" 
                  className="inline-block bg-accent-red hover:bg-accent-red/90 text-black border border-black px-8 py-2 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-center text-base btn-shine-3d  w-32 flex items-center justify-center"
                >
                  COMMANDEZ
                </Link>
              </div>
              
              <p className="mt-6 text-lg">
                👉 COMMANDEZ sur <Link href="/reservation" className="underline hover:text-red-500 transition-colors"><strong>el-meleh-de-la-paella-ibiza.com</strong></Link>
              </p>
            </div>
          </section>



        </div>
      </div>

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
                  <a href="https://maps.google.com/maps?q=38.96426,1.47936&z=15" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors" title="Ouvrir dans Google Maps">🌍 Ibiza, Espagne</a>
                </div>
              </div>
              
              <div className="text-center md:text-left">
                <div className="mt-0">
                  <p className="text-sm text-white">©2025 EL MELEH DE LA PAELLA 👑 Kosher friendly</p>
                  <p className="text-xs text-white mt-1">
                    <a href="https://wa.me/33756872352?text=Je veux le meme site !!" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Website design by JOSEPH-STUDIO.COM</a><br />
                    <span>Tous droits réservés</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 