'use client';

import Logo from './Logo'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CartIcon from './CartIcon';

export default function Navbar({ isVisible, cartItems, totalItems, totalPrice, onRemoveItem, isDark = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      console.log('Scroll Y:', scrollY); // Debug
      setIsScrolled(scrollY > 5); // Réduit le seuil à 5px pour disparition plus rapide
    };

    const handleSliderScroll = (event) => {
      console.log('Slider scrolled:', event.detail.isScrolled); // Debug
      setIsScrolled(event.detail.isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('sliderScrolled', handleSliderScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('sliderScrolled', handleSliderScroll);
    };
  }, []);

  // Définir les couleurs en fonction du mode
  const textColor = isDark ? 'text-black' : 'text-white';
  const hoverColor = isDark ? 'hover:text-gray-700' : 'hover:text-[#f9f7f2]';
  const hamburgerColor = isDark ? 'bg-black' : 'bg-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className={`container mx-auto pl-2 landscape:pl-0 landscape:-ml-4 md:pl-6 pr-4 py-2 md:py-4 flex ${isDark ? 'justify-end' : 'justify-between'} items-start md:items-center`}>
        {!isDark && (
          <div className="transition-all duration-300 opacity-100">
            <Logo isVisible={isVisible} />
          </div>
        )}
        
        {/* Menu et Panier */}
        <div className="flex items-start md:items-center space-x-0 md:space-x-1 md:absolute md:top-4 md:right-4 relative z-50">
          {/* Menu desktop - masqué pour la page Shabbat */}
          {!isDark && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/notre-histoire" className={`${textColor} ${hoverColor} transition-colors whitespace-nowrap`} style={{ fontSize: '15px' }}>
                NOTRE HISTOIRE
              </Link>
              <Link href="/menu" className={`${textColor} ${hoverColor} transition-colors whitespace-nowrap`} style={{ fontSize: '15px' }}>
                PAELLA
              </Link>
              {/* Liens retirés: MENU SHABBAT, CATERING, EAT CACHER À IBIZA */}
              <Link href="/reservation" className="bg-[#0038B8] hover:bg-[#f9f7f2] border border-black text-black font-bold px-4 py-2 transition-colors text-xs whitespace-nowrap">
                RÉSERVER
              </Link>
            </nav>
          )}
          
          {/* Panier - masqué pour la page Shabbat */}
          {!isDark && (
            <CartIcon 
              cartItems={cartItems} 
              totalItems={totalItems} 
              totalPrice={totalPrice} 
              onRemoveItem={onRemoveItem}
            />
          )}
          
          {/* Hamburger menu - visible sur mobile toujours, et sur desktop si isDark */}
          <button
            className={`flex flex-col justify-center items-center w-10 h-10 mt-0.5 focus:outline-none cursor-pointer pointer-events-auto z-50 ${isDark ? 'block' : 'md:hidden'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Ouvrir le menu"
            style={{ transform: isDark ? 'translateY(7px)' : 'translateY(0)' }}
          >
            <span className={`block w-7 h-0.5 ${hamburgerColor} rounded transition-all duration-300 mb-1`}></span>
            <span className={`block w-7 h-0.5 ${hamburgerColor} rounded transition-all duration-300 mb-1`}></span>
            <span className={`block w-7 h-0.5 ${hamburgerColor} rounded transition-all duration-300`}></span>
          </button>
        </div>
      </div>
      
      {/* Overlay menu visible sur tous les écrans */}
      {menuOpen && (
        <div className="fixed top-0 right-0 h-full w-auto min-w-fit bg-black/80 z-50 flex flex-col items-end p-6">
          <button
            className="text-white text-3xl focus:outline-none self-end mb-8"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            ×
          </button>
          <nav className="flex flex-col items-end space-y-1 text-right w-full">
            <Link href="/notre-histoire" className="text-white hover:text-[#f9f7f2] transition-colors text-sm whitespace-nowrap btn-shine-3d" onClick={() => setMenuOpen(false)}>
              NOTRE HISTOIRE
            </Link>
            <Link href="/menu" className="text-white hover:text-[#f9f7f2] transition-colors text-sm whitespace-nowrap btn-shine-3d" onClick={() => setMenuOpen(false)}>
              PAELLA
            </Link>
            {/* Liens retirés du hamburger: MENU SHABBAT, CATERING, EAT CACHER À IBIZA */}
            <Link href="/reservation" className="bg-[#0038B8] hover:bg-[#f9f7f2] border border-black text-black font-bold px-1 py-0.5 transition-colors text-sm whitespace-nowrap text-right flex justify-end" onClick={() => setMenuOpen(false)}>
              RÉSERVER
            </Link>
          </nav>
        </div>
      )}
    </nav>
  );
} 