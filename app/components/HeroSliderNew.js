'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSliderNew({ images, onSliderScroll }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const sliderRef = useRef(null);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isScrolling) {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }
    }, 8000); // 8 secondes par slide

    return () => clearInterval(timer);
  }, [images.length, isScrolling]);

  // Fonction pour gérer le scroll du slider
  const handleSliderScroll = useCallback((event) => {
    const isScrolled = event.currentTarget.scrollTop > 1;
    if (onSliderScroll) {
      onSliderScroll(isScrolled);
    }
  }, [onSliderScroll]);

  // Ajouter un listener de scroll sur le slider pour cacher le header
  useEffect(() => {
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      const handleSliderScrollEvent = () => {
        const scrollTop = sliderElement.scrollTop;
        const slideHeight = sliderElement.clientHeight;
        const currentSlideIndex = Math.round(scrollTop / slideHeight);
        
        // Si on n'est pas sur le premier slide, cacher le header
        if (currentSlideIndex > 0) {
          // Déclencher un événement personnalisé pour informer le parent
          window.dispatchEvent(new CustomEvent('sliderScrolled', { 
            detail: { isScrolled: true } 
          }));
        } else {
          window.dispatchEvent(new CustomEvent('sliderScrolled', { 
            detail: { isScrolled: false } 
          }));
        }
      };

      sliderElement.addEventListener('scroll', handleSliderScrollEvent);
      return () => sliderElement.removeEventListener('scroll', handleSliderScrollEvent);
    }
  }, []);

  // Scroll programmatique fluide
  const scrollToSlide = useCallback((index) => {
    if (sliderRef.current) {
      setIsScrolling(true);
      const slideElement = sliderRef.current.children[0].children[index];
      if (slideElement) {
        slideElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      setCurrentSlide(index);
      setTimeout(() => setIsScrolling(false), 1000);
    }
  }, []);

  const nextSlide = useCallback(() => {
    const nextIndex = (currentSlide + 1) % images.length;
    scrollToSlide(nextIndex);
  }, [currentSlide, images.length, scrollToSlide]);

  const prevSlide = useCallback(() => {
    const prevIndex = (currentSlide - 1 + images.length) % images.length;
    scrollToSlide(prevIndex);
  }, [currentSlide, images.length, scrollToSlide]);

  const goToSlide = useCallback((index) => {
    scrollToSlide(index);
  }, [scrollToSlide]);

  // Gestion du swipe tactile
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault();
        nextSlide();
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div 
      ref={sliderRef}
      className="relative h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"
      style={{ 
        scrollBehavior: 'smooth',
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch'
      }}
      onScroll={handleSliderScroll}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full">
        {/* Logo mobile - visible seulement dans le slider */}
        <div className="fixed top-[17%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden">
          <div className="relative w-32 h-32 md:w-52 md:h-52 scale-[1.46]">
            <Image
              src="/images/logo ile.png"
              alt="Logo Ile"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 128px, 208px"
              quality={85}
            />
          </div>
        </div>

        {/* Slides en scroll vertical */}
        {images.map((slide, index) => (
          <div
            key={slide.id}
            className="relative w-full h-screen transition-all duration-500 ease-in-out snap-start"
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center hover:text-[#0038B8] transition-colors duration-300 cursor-pointer">{slide.title}</h1>
                <p className="text-xl md:text-2xl text-center max-w-2xl px-4 -mt-2" dangerouslySetInnerHTML={{ __html: slide.description }}></p>
                <Link 
                  href={slide.id === 2 ? "/menu-shabbat" : "/reservation"}
                  className="mt-6 bg-[#0038B8] text-white text-center py-2 px-6 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg btn-shine-3d border border-white hover:bg-white hover:text-[#0038B8] hover:border-[#0038B8]"
                >
                  {slide.id === 2 ? "COMMANDEZ VOTRE SHABBAT" : "COMMANDEZ"}
                </Link>
                {slide.deliveryInfo && (
                  <p className="text-xl md:text-2xl text-white/90 mt-6 mb-1 text-[1.2em] text-center">{slide.deliveryInfo}</p>
                )}
                {slide.preOrderInfo && (
                  <p className="text-base md:text-lg text-white/90 text-[0.63em] -mt-1 text-center" dangerouslySetInnerHTML={{ __html: slide.preOrderInfo }}></p>
                )}
                {/* Lien de réservation avec ID unique */}
                <div className="mt-1 relative z-50">
                  <Link 
                    href="/reservation"
                    id="reservation-link-slider"
                    className="text-lg md:text-xl text-white/80 hover:text-[#f9f7f2] transition-colors duration-300 cursor-pointer block text-center animate-heartbeat"
                    style={{ pointerEvents: 'auto' }}
                    dangerouslySetInnerHTML={{ __html: slide.reservationText || "Réservez votre kiff dès maintenant c'est open 🚀" }}
                  />
                  {/* Bloc info commande + viande kosher juste après le lien */}
                  <div className="mt-4 text-center">
                    <div className="text-white text-lg leading-tight" dangerouslySetInnerHTML={{ __html: slide.bottomText || "Des saveurs judéo-espagnoles,<br />partout à Ibiza, tous les jours." }}>
                    </div>
                    <div className="mt-2">
                      <span>Viande cacher by </span>
                      <a href="https://bovini.fr/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Bovini</a>
                    </div>
                    <div className="mt-2 text-white text-lg">
                      Kosher Friendly Ibiza
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Dots */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2 z-30 hidden">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Swipe Instructions (Mobile) */}
      {/* <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 text-white/70 text-sm bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm md:hidden">
        ← Glissez pour naviguer →
      </div> */}
    </div>
  );
} 