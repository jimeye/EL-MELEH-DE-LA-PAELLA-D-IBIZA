'use client';

import { useState, useEffect, useRef } from 'react';

export default function CartIcon({ cartItems, totalItems, totalPrice, onRemoveItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const popupRef = useRef(null);

  // Fermer le popup si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const formatPrice = (price) => {
    return `${price.toFixed(2)} €`;
  };

  // Calculer les frais de livraison
  const getDeliveryFee = () => {
    // Calculer les articles éligibles pour la livraison gratuite (excluant Paella et Kabbalat)
    const eligibleItemsForFreeDelivery = (cartItems.sbmLots?.reduce((sum, lot) => sum + lot.qty, 0) || 0) + 
                                       (cartItems.bbmLots?.reduce((sum, lot) => sum + lot.qty, 0) || 0) + 
                                       (cartItems.keftaLots?.reduce((sum, lot) => sum + lot.qty, 0) || 0);
    return eligibleItemsForFreeDelivery >= 6 ? 0 : 15;
  };

  // Calculer le total avec livraison
  const getTotalWithDelivery = () => {
    return totalPrice + getDeliveryFee();
  };

  const getCartSummary = () => {
    const summary = [];
    
    // Compter les SBM
    const sbmCount = cartItems.sbmLots?.reduce((sum, lot) => sum + lot.qty, 0) || 0;
    if (sbmCount > 0) {
      summary.push(`${sbmCount} SBM`);
    }
    
    // Compter les BBM
    const bbmCount = cartItems.bbmLots?.reduce((sum, lot) => sum + lot.qty, 0) || 0;
    if (bbmCount > 0) {
      summary.push(`${bbmCount} BBM`);
    }
    
    // Compter les Paella
    const paellaCount = cartItems.paellaLots?.reduce((sum, lot) => sum + lot.qty, 0) || 0;
    if (paellaCount > 0) {
      summary.push(`${paellaCount} Paella`);
    }
    
    // Compter les Kefta
    const keftaCount = cartItems.keftaLots?.reduce((sum, lot) => sum + lot.qty, 0) || 0;
    if (keftaCount > 0) {
      summary.push(`${keftaCount} Kefta`);
    }
    
    // Compter les boulettes supplémentaires
    if (cartItems.boulettesSuppGlobal > 0) {
      summary.push(`${cartItems.boulettesSuppGlobal} boulettes`);
    }
    
    return summary.join(' + ');
  };

  return (
    <div className="relative" ref={popupRef}>
      {/* Icône du panier → remplacée par une poêle de paella */}
      <button
        className="relative p-2 rounded-full transition-all duration-300 bg-transparent hover:bg-transparent focus:outline-none"
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Voir le panier"
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Poignées de la poêle */}
          <rect x="1" y="10.5" width="3" height="3" rx="1" stroke="white" strokeWidth="1.5" />
          <rect x="20" y="10.5" width="3" height="3" rx="1" stroke="white" strokeWidth="1.5" />
          {/* Bord de la poêle */}
          <circle cx="12" cy="12" r="7.5" stroke="white" strokeWidth="1.5" />
          {/* Riz safrané */}
          <circle cx="12" cy="12" r="6" fill="#F4C542" />
          {/* Ingrédients (sans crustacés) */}
          <circle cx="9" cy="10" r="0.8" fill="#2E7D32" />
          <circle cx="15" cy="13" r="0.8" fill="#2E7D32" />
          <rect x="10.5" y="8.5" width="3" height="0.7" rx="0.3" fill="#C62828" transform="rotate(20 12 8.8)" />
          <rect x="7.5" y="12.5" width="3" height="0.7" rx="0.3" fill="#C62828" transform="rotate(-25 9 12.8)" />
        </svg>
        
        {/* Badge avec nombre d'articles */}
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </button>

      {/* Popup du panier */}
      {(isOpen || isHovered) && totalItems > 0 && (
        <div className="absolute top-full right-0 mt-2 w-72 md:w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* En-tête */}
          <div className="bg-accent-red text-white px-4 py-3 rounded-t-lg">
            <h3 className="font-semibold text-lg">Votre commande</h3>
          </div>
          
          {/* Contenu */}
          <div className="p-3 md:p-4 max-h-48 md:max-h-64 overflow-y-auto">
            {cartItems.sbmLots?.map((lot, index) => (
              <div key={`sbm-${index}`} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm md:text-base">Sandwich Boulettes Mekbouba</span>
                  <div className="text-xs md:text-sm text-gray-600">
                    {lot.options.piment && '🌶️ '}
                    {lot.options.oeuf && '🥚 '}
                    {lot.options.mekbouba && '🥘 '}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="font-medium text-sm md:text-base">{lot.qty} × 26€</div>
                    <div className="text-accent-red font-bold text-sm md:text-base">{(lot.qty * 26).toFixed(2)}€</div>
                  </div>
                  {onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem('sbm', lot.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {cartItems.bbmLots?.map((lot, index) => (
              <div key={`bbm-${index}`} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm md:text-base">Box Boulettes Mekbouba</span>
                  <div className="text-xs md:text-sm text-gray-600">
                    {lot.options.piment && '🌶️ '}
                    {lot.options.oeuf && '🥚 '}
                    {lot.options.mekbouba && '🥘 '}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="font-medium text-sm md:text-base">{lot.qty} × 26€</div>
                    <div className="text-accent-red font-bold text-sm md:text-base">{(lot.qty * 26).toFixed(2)}€</div>
                  </div>
                  {onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem('bbm', lot.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {cartItems.paellaLots?.map((lot, index) => (
              <div key={`paella-${index}`} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm md:text-base">🍚 Paella de Pescado</span>
                  <div className="text-xs md:text-sm text-gray-600">
                    Minimum 6 personnes
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="font-medium text-sm md:text-base">{lot.qty} × 32€</div>
                    <div className="text-accent-red font-bold text-sm md:text-base">{(lot.qty * 32).toFixed(2)}€</div>
                  </div>
                  {onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem('paella', lot.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {cartItems.kabbalatLots?.map((lot, index) => (
              <div key={`kabbalat-${index}`} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm md:text-base">🍽️ Kabbalat Shabbat</span>
                  <div className="text-xs md:text-sm text gray-600">
                    Minimum 6 personnes
                  </div>
                  {lot.options && (
                    <div className="text-xs text-gray-500 mt-1">
                      {Object.entries(lot.options)
                        .filter(([key, value]) => value && key.includes('couscous') && !key.includes('Qty'))
                        .map(([key, value]) => {
                          const optionNames = {
                            couscousPkaila: 'Couscous Pkaila',
                            couscousLoubia: 'Couscous Loubia',
                            couscousHams: 'Couscous Hams',
                            couscousLegumesPoulet: 'Couscous Légumes Poulet',
                            couscousLegumesViandes: 'Couscous Légumes Viande'
                          };
                          const qtyKey = key + 'Qty';
                          const qty = lot.options[qtyKey] || 0;
                          return `${optionNames[key]} (${qty})`;
                        })
                        .join(', ')}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="font-medium text-sm md:text-base">{lot.qty} × 45€</div>
                    <div className="text-accent-red font-bold text-sm md:text-base">{(lot.qty * 45).toFixed(2)}€</div>
                  </div>
                  {onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem('kabbalat', lot.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {cartItems.keftaLots?.map((lot, index) => (
              <div key={`kefta-${index}`} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm md:text-base">🥪 Sandwich Kefta Poisson<br/>Mekbouba SKM</span>
                  <div className="text-xs md:text-sm text-gray-600">
                    🌙 Spécial Ticha Beav
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="font-medium text-sm md:text-base">{lot.qty} × 26€</div>
                    <div className="text-accent-red font-bold text-sm md:text-base">{(lot.qty * 26).toFixed(2)}€</div>
                  </div>
                  {onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem('kefta', lot.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {cartItems.boulettesSuppGlobal > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-sm md:text-base">Boulettes supplémentaires</span>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="font-medium text-sm md:text-base">{cartItems.boulettesSuppGlobal} × 5€</div>
                    <div className="text-accent-red font-bold text-sm md:text-base">{(cartItems.boulettesSuppGlobal * 5).toFixed(2)}€</div>
                  </div>
                  {onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem('boulettesSupp')}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Résumé */}
          <div className="px-3 md:px-4 py-3 bg-gray-50 rounded-b-lg">
            {/* Sous-total */}
            <div className="flex justify-between items-center text-sm md:text-base mb-1">
              <span>Sous-total</span>
              <span className="text-gray-700">{formatPrice(totalPrice)}</span>
            </div>
            
            {/* Frais de livraison */}
            {getDeliveryFee() > 0 ? (
              <div className="flex justify-between items-center text-sm md:text-base mb-2">
                <span>Livraison</span>
                <span className="text-gray-700">{formatPrice(getDeliveryFee())}</span>
              </div>
            ) : (
              <div className="flex justify-between items-center text-sm md:text-base mb-2">
                <span>Livraison</span>
                <span className="text-green-600 font-semibold">Gratuite</span>
              </div>
            )}
            
            {/* Ligne de séparation */}
            <div className="border-t border-gray-200 my-2"></div>
            
            {/* Total avec livraison */}
            <div className="flex justify-between items-center text-base md:text-lg font-bold">
              <span>Total</span>
              <span className="text-accent-red">{formatPrice(getTotalWithDelivery())}</span>
            </div>
            
            <div className="text-xs md:text-sm text-gray-600 mt-1">
              {getCartSummary()}
            </div>
            
            {/* Message de livraison gratuite */}
            {getDeliveryFee() > 0 && (
              <div className="text-xs text-green-600 mt-1">
                Livraison offerte pour 6 articles ou plus ! ({6 - totalItems} article{6 - totalItems > 1 ? 's' : ''} restant{6 - totalItems > 1 ? 's' : ''} à ajouter)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 