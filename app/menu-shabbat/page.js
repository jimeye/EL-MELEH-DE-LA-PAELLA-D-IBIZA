'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function MenuShabbat() {
  const [activeSection, setActiveSection] = useState('formules');
  const [orderMode, setOrderMode] = useState('formule'); // 'formule' ou 'carte'
  const [selectedFormule, setSelectedFormule] = useState(null);
  const [selectedCouscous, setSelectedCouscous] = useState([]);
  const [selectedSalades, setSelectedSalades] = useState([]);
  const [selectedSides, setSelectedSides] = useState([]);
  const [selectedWine, setSelectedWine] = useState('rouge');
  const [sideQuantities, setSideQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);


  const formules = {
    3: { personnes: 3, couscous: 1, salades: 5, prix: 135 },
    6: { personnes: 6, couscous: 2, salades: 5, prix: 270 },
    9: { personnes: 9, couscous: 3, salades: 5, prix: 405 },
    12: { personnes: 12, couscous: 3, salades: 5, prix: 540 }
  };

  const menuData = {
    couscous: [
      { name: "Couscous Au Bœuf & Légumes", description: "Navets, carottes, courgettes, pomme de terre & épices.", price: 20 },
      { name: "Couscous Au Poulet & Légumes", description: "Navets, carottes, courgettes, pomme de terre & épices.", price: 20 },
      { name: "Couscous Bel Pkaila", description: "Épinards confits à l'huile d'olive, viande, haricots blancs.", price: 20 },
      { name: "Couscous Loubia Bel Kamoun", description: "Bœuf mijoté au cumin et haricots blancs.", price: 20 },
      { name: "Couscous 'Hams", description: "Jarret de bœuf, pois chiche, ail & cumin.", price: 20 },
      { name: "Couscous Nikitouche", description: "Poule, céleri, oignon, petite nikitouche & épices.", price: 20 }
    ],
    salades: [
      { name: "Slata Mekbouba", description: "Poivrons, Piments, Tomates & Zeit.", price: 5 },
      { name: "Slata Ajlouke de carottes", description: "Citron, ail, carvi, harissa, huile d'olive, sel & poivre.", price: 5 },
      { name: "Slata Batatta Harissa", description: "Pomme de terre, harissa, cumin, huile d'olive.", price: 5 },
      { name: "Slata Yossef Hatsadik", description: "Oeuf mimosa, mayonnaise maison, sel & poivre.", price: 5 },
      { name: "Slata Aliya", description: "Poivrons rôtis, ail, origan.", price: 5 },
      { name: "Slata De Pois Chiches Citronnés", description: "Cumin, oignons, menthe fraîche.", price: 5 },
      { name: "Slata Carottes Papi Jean", description: "Jus d'orange, citron beldi, pistaches & has el hanout.", price: 5 },
      { name: "Slata De Concombre", description: "Citronnées, sel poivre & huile d'olive.", price: 5 },
      { name: "Slata De Fenouil & Orange", description: "Fraîche, sucrée-salée.", price: 5 }
    ],
    sides: [
      { name: "Halla", description: "Pain sacré du Shabbat.", price: 5 },
      { name: "Jus de Raisin", description: "Jus de raisin doux pour Kiddouch.", price: 7 },
      { name: "Hrayimi le poisson malin", description: "Poisson selon arrivage, citron, ail, paprika, harissa, tomates, sel & poivre. *min 3 personnes. (26 € par personne)", price: 26 },
      { name: "Boulettes Marchi", description: "Boeuf, Oignons, Persil, Coriandre & Rose.", price: 7 },
      { name: "Slata Mechouia", description: "Ventreche de thon, Poivrons, tomates, ail grillés & oeuf coulant.", price: 20 },
      { name: "Schnitzel", description: "Blanc de pollo, crunchy panko, sésame (250 gr).", price: 26 },
      { name: "Mloukhia", description: "La magie noire - jarret de boeuf, corète, ail & laurier. *min 3 personnes. (26 € par personne)", price: 26 },
      { name: "Assiette Tunisienne", description: "Thon, oeuf coulant, olives, câpres, pommes de terre, tomates, concombres, poivrons, citrons beldi & piments.", price: 26 },
      { name: "Vin Rouge, Rosé & Blanc", description: "Sélectionné par notre sommelier(tmenik).", price: 40 },
      { name: "The Macallan, Scotch Double Cask 12 Ans", description: "The Macallan Double Cask 12 Years Old se caractérise par la combinaison parfaite de fûts de chêne européen et américain.", price: 95 }
    ]
  };

  const addCouscous = (couscous) => {
    if (selectedFormule) {
      const maxCouscous = formules[selectedFormule].couscous;
      if (selectedCouscous.length < maxCouscous) {
        setSelectedCouscous(prev => [...prev, couscous]);
      }
    } else {
      // Pas de couscous à la carte sans formule
      alert("Veuillez d'abord sélectionner une formule pour ajouter des couscous.");
    }
  };

  const addSalade = (salade) => {
    if (selectedFormule) {
      const maxSalades = formules[selectedFormule].salades;
      if (selectedSalades.length < maxSalades) {
        setSelectedSalades(prev => [...prev, salade]);
      }
    } else {
      // Vérifier si le minimum de commande est atteint
      const totalSides = Object.entries(sideQuantities).reduce((sum, [name, qty]) => {
        const side = menuData.sides.find(s => s.name === name);
        return sum + (side ? side.price * qty : 0);
      }, 0);
      
      if (totalSides + 15 >= 200) {
        // Minimum atteint - ajouter la salade
        setCart(prev => [...prev, { ...salade, type: 'salade', prix: salade.price }]);
      } else {
        // Minimum non atteint - afficher un message
        alert(`Veuillez d'abord sélectionner une formule ou atteindre le minimum de commande de 200€ avec les sides. Votre commande actuelle: ${(totalSides + 15).toFixed(2)}€ (frais de livraison)`);
      }
    }
  };

  const addSide = (side) => {
    const sideWithWine = {
      ...side,
      wineType: side.name === "Vin Rouge, Rosé & Blanc" ? selectedWine : null
    };
    setSelectedSides(prev => [...prev, sideWithWine]);
  };

  const updateSideQuantity = (sideName, quantity) => {
    setSideQuantities(prev => {
      const newQuantities = {
        ...prev,
        [sideName]: (sideName === "Poisson hrayimi le poisson malin" && quantity > 0) ? 3 : 
                    (sideName === "Mloukhia" && quantity > 0) ? 3 : 
                    Math.max(0, quantity)
      };
      
      // Vérifier si le minimum est atteint (sans formule sélectionnée)
      if (!selectedFormule) {
        const totalSides = Object.entries(newQuantities).reduce((sum, [name, qty]) => {
          const side = menuData.sides.find(s => s.name === name);
          return sum + (side ? side.price * qty : 0);
        }, 0);
        
        if (totalSides + 15 >= 200 && !showInfoPopup) {
          setTimeout(() => setShowInfoPopup(true), 500); // Petit délai pour éviter les conflits
        }
      }
      
      return newQuantities;
    });
  };

  const getSideQuantity = (sideName) => {
    if (sideName === "Mloukhia") {
      return sideQuantities[sideName] || 0;
    }
    if (sideName === "Hrayimi le poisson malin") {
      return sideQuantities[sideName] || 0;
    }
    return sideQuantities[sideName] || 0;
  };

  const validateFormule = () => {
    // Vérifier le minimum de commande si pas de formule sélectionnée
    if (!selectedFormule) {
      const totalSides = getTotalComplete();
      if (totalSides + 15 < 200) {
        alert(`Commande minimum de 200€ avec frais de livraison requis. Votre commande actuelle: ${(totalSides + 15).toFixed(2)}€`);
        return;
      } else {
        // Minimum atteint - proposer d'ajouter des salades
        setShowInfoPopup(true);
        return;
      }
      
      // Si on a assez de sides, créer une commande à la carte
      const sidesWithQuantities = Object.entries(sideQuantities)
        .filter(([name, quantity]) => quantity > 0)
        .map(([name, quantity]) => {
          const side = menuData.sides.find(s => s.name === name);
          return {
            ...side,
            quantity: quantity,
            wineType: name === "Vin Rouge, Rosé & Blanc" ? selectedWine : null
          };
        });

      const commande = {
        type: 'carte',
        prix: totalSides,
        sides: sidesWithQuantities
      };
      setCart([commande]);
      alert(`Commande à la carte ajoutée au panier ! Total: ${(totalSides + 15).toFixed(2)}€`);
      return;
    }
    
    const formule = formules[selectedFormule];
    const isValid = selectedCouscous.length === formule.couscous && 
                   selectedSalades.length === formule.salades;
    
    if (isValid) {
      // Créer les sides avec quantités
      const sidesWithQuantities = Object.entries(sideQuantities)
        .filter(([name, quantity]) => quantity > 0)
        .map(([name, quantity]) => {
          const side = menuData.sides.find(s => s.name === name);
          return {
            ...side,
            quantity: quantity,
            wineType: name === "Vin Rouge, Rosé & Blanc" ? selectedWine : null
          };
        });

      const commande = {
        type: 'formule',
        personnes: formule.personnes,
        prix: formule.prix,
        couscous: selectedCouscous,
        salades: selectedSalades,
        sides: sidesWithQuantities
      };
      setCart([commande]);
      alert(`Formule ${formule.personnes} personnes ajoutée au panier !`);
    } else {
      alert(`Il faut sélectionner ${formule.couscous} couscous et ${formule.salades} salades exactement.`);
    }
  };

  const getTotalCart = () => {
    return cart.reduce((total, item) => {
      if (item.type === 'formule') {
        const sidesPrix = Object.entries(sideQuantities).reduce((sum, [name, quantity]) => {
          const side = menuData.sides.find(s => s.name === name);
          return sum + (side ? side.price * quantity : 0);
        }, 0);
        return total + item.prix + sidesPrix;
      }
      return total + item.prix;
    }, 0);
  };

  const getTotalComplete = () => {
    let total = 0;
    
    // Ajouter le prix de la formule sélectionnée
    if (selectedFormule) {
      total += formules[selectedFormule].prix;
    }
    
    // Ajouter les items à la carte
    total += cart.reduce((sum, item) => sum + item.prix, 0);
    
    // Ajouter les sides
    total += Object.entries(sideQuantities).reduce((sum, [name, quantity]) => {
      const side = menuData.sides.find(s => s.name === name);
      return sum + (side ? side.price * quantity : 0);
    }, 0);
    
    return total;
  };

  const resetSelection = () => {
    setSelectedFormule(null);
    setSelectedCouscous([]);
    setSelectedSalades([]);
    setSelectedSides([]);
    setSideQuantities({});
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-black menu-shabbat-page">
      <Navbar 
        isVisible={true} 
        isDark={true}
        cartItems={cart}
        totalItems={cart.length}
        totalPrice={getTotalComplete()}
        onRemoveItem={(index) => {
          setCart(prev => prev.filter((_, i) => i !== index));
        }}
      />
      
      {/* Bandeau avec texte défilant */}
      <div className="bg-accent-red text-black py-1 overflow-hidden cursor-pointer hover:bg-red-600 transition-colors" onClick={() => window.open('https://wa.me/33756872352', '_blank')}>
        <div className="animate-marquee whitespace-nowrap">
          <span className="inline-block px-4 font-light text-sm">
            Pour les groupes de plus de 12 personnes merci de nous contacter
          </span>
          <span className="inline-block px-4 font-light text-sm">
            Pour les groupes de plus de 12 personnes merci de nous contacter
          </span>
          <span className="inline-block px-4 font-light text-sm">
            Pour les groupes de plus de 12 personnes merci de nous contacter
          </span>
        </div>
      </div>
      
      {/* Header */}
      <div className="bg-[#f9f7f2] py-2 mt-1">
        <div className="container mx-auto px-4 text-center">
          <p 
            className="text-lg md:text-xl font-bold text-black mb-1 cursor-pointer hover:text-gray-700 transition-colors"
            onClick={() => window.location.href = '/'}
          >
            LA BOULLETTE IBIZA 🌶
          </p>
          <div 
            className="text-base md:text-lg text-center w-full -mt-2 mb-1"
          >
            Kosher Friendly
          </div>
          <div className="h-px bg-black mb-1" style={{width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)'}}></div>
          <h1 className="text-2xl md:text-3xl font-bold -mb-4 text-black">Menu Shabbat</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#f9f7f2]">
        <div className="px-[26px]">
          <nav className="flex justify-center items-center space-x-1 py-0">
            <button
              onClick={() => {
                setActiveSection('formules');
                document.getElementById('formules-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1 text-xs md:text-sm transition-colors text-gray-600 hover:text-black hover:border-b-2 hover:border-black w-fit"
            >
              Formules
            </button>
            <button
              onClick={() => {
                setActiveSection('couscous');
                document.getElementById('couscous-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1 text-xs md:text-sm transition-colors text-gray-600 hover:text-black hover:border-b-2 hover:border-black w-fit"
            >
              Couscous
            </button>
            <button
              onClick={() => {
                setActiveSection('salades');
                document.getElementById('salades-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1 text-xs md:text-sm transition-colors text-gray-600 hover:text-black hover:border-b-2 hover:border-black w-fit"
            >
              Slata
            </button>
            <button
              onClick={() => {
                setActiveSection('sides');
                document.getElementById('sides-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1 text-xs md:text-sm transition-colors text-gray-600 hover:text-black hover:border-b-2 hover:border-black w-fit"
            >
              Side
            </button>
            <div className="flex items-center space-x-1">
              <button
                onClick={resetSelection}
                className="px-2 py-1 text-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded"
                title="Tout effacer"
              >
                Reset
              </button>
              <button
                onClick={() => setShowCartPopup(true)}
                className="px-2 py-1 text-xs transition-colors bg-transparent relative"
              >
                <img 
                  src="/icone-cocotte.webp" 
                  alt="Panier" 
                  className="w-6 h-6"
                />
                <div className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="#0038B8">
                    <path d="M10 3.5C10 3.5 8.5 1.5 6 1.5C3.5 1.5 2 3 2 5.5C2 8 4 10 10 15.5C16 10 18 8 18 5.5C18 3 16.5 1.5 14 1.5C11.5 1.5 10 3.5 10 3.5Z"/>
                  </svg>
                  <span className="absolute text-black text-[7px] font-light" style={{transform: 'translateY(-2.5px)'}}>
                    {selectedCouscous.length + selectedSalades.length + Object.values(sideQuantities).reduce((sum, qty) => sum + qty, 0)}
                  </span>
                </div>
              </button>
            </div>
          </nav>
          <div className="w-full h-px bg-black mt-0" style={{marginLeft: '-26px', marginRight: '-26px', width: 'calc(100% + 52px)'}}></div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="px-[26px] py-3">
        {/* Section Formules */}
        <div id="formules-section" className="w-full mb-4">
          <h2 className="text-xl font-bold text-black mb-4 text-center">Formules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(formules).map(([key, formule]) => (
              <div key={key} className="border-b border-gray-800 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-black">Formule {formule.personnes} personnes</h3>
                    <p className="text-gray-600 text-sm">{formule.couscous} couscous au choix et {formule.salades} salades au choix</p>
                    <p className="font-bold text-black mt-1">{formule.prix} €</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedFormule(parseInt(key)); 
                        setSelectedCouscous([]); 
                        setSelectedSalades([]);
                      }}
                      className={`px-2 py-0.5 text-xs border-2 border-black transition-colors ${
                        selectedFormule === parseInt(key)
                          ? 'bg-transparent text-black'
                          : 'bg-transparent text-black hover:bg-[#0038B8] hover:text-black'
                      }`}
                    >
                      {selectedFormule === parseInt(key) ? '✓' : 'Formule+'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedFormule && (
            <div className="mt-6 p-4 bg-[#0038B8] border border-black">
              <h3 className="font-bold text-lg mb-2">Formule {formules[selectedFormule].personnes} personnes sélectionnée</h3>
              <div className="text-sm grid grid-cols-3 gap-4">
                <div>
                  <strong>Couscous:</strong> {selectedCouscous.length}/{formules[selectedFormule].couscous}
                </div>
                <div>
                  <strong>Salades:</strong> {selectedSalades.length}/{formules[selectedFormule].salades}
                </div>
                <div>
                  <strong>Sides:</strong> {Object.values(sideQuantities).reduce((sum, q) => sum + q, 0)} (optionnel)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Couscous */}
        <div id="couscous-section" className="w-full mb-4">
          <h2 className="text-xl font-bold text-black mb-4 text-center">
            Couscous
            {selectedFormule && ` (${selectedCouscous.length}/${formules[selectedFormule].couscous})`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {menuData.couscous.map((item, index) => (
              <div key={index} className="border-b border-gray-800 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="font-bold text-black mt-1">{item.price} €</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {selectedFormule ? (
                      <button
                        onClick={() => {
                          if (selectedCouscous.some(c => c.name === item.name)) {
                            // Désélectionner
                            setSelectedCouscous(prev => prev.filter(c => c.name !== item.name));
                          } else {
                            // Sélectionner
                            addCouscous(item);
                          }
                        }}
                        disabled={!selectedCouscous.some(c => c.name === item.name) && selectedCouscous.length >= formules[selectedFormule].couscous}
                        className={`px-2 py-0.5 text-xs border-2 border-black transition-colors ${
                          selectedCouscous.some(c => c.name === item.name)
                            ? 'bg-transparent text-black'
                            : selectedCouscous.length < formules[selectedFormule].couscous
                            ? 'bg-transparent text-black hover:bg-[#0038B8] hover:text-black'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {selectedCouscous.some(c => c.name === item.name) ? '✓' : 'Formule+'}
                      </button>
                    ) : (
                      <button
                        onClick={() => addCouscous(item)}
                        className="px-2 py-0.5 text-xs border-2 border-black bg-transparent text-black hover:bg-black hover:text-white transition-colors"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Salades */}
        <div id="salades-section" className="w-full mb-4">
          <h2 className="text-xl font-bold text-black mb-4 text-center">
            Slata
            {selectedFormule && ` (${selectedSalades.length}/${formules[selectedFormule].salades})`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {menuData.salades.map((item, index) => (
              <div key={index} className="border-b border-gray-800 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="font-bold text-black mt-1">{item.price} €</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {selectedFormule ? (
                      <button
                        onClick={() => {
                          if (selectedSalades.some(s => s.name === item.name)) {
                            // Désélectionner
                            setSelectedSalades(prev => prev.filter(s => s.name !== item.name));
                          } else {
                            // Sélectionner
                            addSalade(item);
                          }
                        }}
                        disabled={!selectedSalades.some(s => s.name === item.name) && selectedSalades.length >= formules[selectedFormule].salades}
                        className={`px-2 py-0.5 text-xs border-2 border-black transition-colors ${
                          selectedSalades.some(s => s.name === item.name)
                            ? 'bg-transparent text-black'
                            : selectedSalades.length < formules[selectedFormule].salades
                            ? 'bg-transparent text-black hover:bg-[#0038B8] hover:text-black'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {selectedSalades.some(s => s.name === item.name) ? '✓' : 'Formule+'}
                      </button>
                    ) : (
                      <button
                        onClick={() => addSalade(item)}
                        className="px-2 py-0.5 text-xs border-2 border-black bg-transparent text-black hover:bg-black hover:text-white transition-colors"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Sides */}
        <div id="sides-section" className="w-full mb-4">
          <h2 className="text-xl font-bold text-black mb-4 text-center">Sides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {menuData.sides.map((item, index) => (
              <div key={index} className="border-b border-gray-800 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-black">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="font-bold text-[#0038B8] mt-1">{item.price} €</p>
                    
                    {/* Sélecteur de vin pour l'item vin */}
                    {item.name === "Vin Rouge, Rosé & Blanc" && (
                      <div className="mt-2">
                        <div className="flex space-x-2 mb-2">
                          {['rouge', 'rosé', 'blanc'].map((wineType) => (
                            <button
                              key={wineType}
                              onClick={() => setSelectedWine(wineType)}
                              className={`px-2 py-1 text-xs border border-black transition-colors ${
                                selectedWine === wineType
                                  ? 'bg-[#0038B8] text-black'
                                  : 'bg-transparent text-black hover:bg-gray-200'
                              }`}
                            >
                              {wineType.charAt(0).toUpperCase() + wineType.slice(1)}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">
                          Sélectionné : {selectedWine.charAt(0).toUpperCase() + selectedWine.slice(1)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => updateSideQuantity(item.name, getSideQuantity(item.name) - 1)}
                        className="px-2 py-0.5 text-xs border-2 border-black bg-transparent text-black hover:bg-black hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs border-2 border-black bg-white text-black min-w-[20px] text-center">
                        {getSideQuantity(item.name)}
                      </span>
                      <button
                        onClick={() => updateSideQuantity(item.name, getSideQuantity(item.name) + 1)}
                        className="px-2 py-0.5 text-xs border-2 border-black bg-transparent text-black hover:bg-black hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bouton de validation de formule */}
      {selectedFormule && selectedCouscous.length === formules[selectedFormule].couscous && 
       selectedSalades.length === formules[selectedFormule].salades && (
        <div className="px-[26px] pt-1 pb-3 text-center">
          <button
            onClick={validateFormule}
            className="bg-[#0038B8] text-black px-8 py-2 font-bold hover:bg-[#0038B8] text-lg border-2 border-black"
          >
            ✅ {selectedFormule ? (Object.values(sideQuantities).some(q => q > 0) ? 'VALIDER VOTRE COMMANDE' : 'VALIDER FORMULE') : 'VALIDER COMMANDE'} ({(getTotalComplete() + 15).toFixed(2)}€)
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0038B8] text-black py-1">
        <div className="px-[26px] text-center">
          <Link href="/" className="text-black hover:underline">
            ← Back à La Boulette 🌶️
          </Link>
        </div>
      </footer>

      {/* Popup panier */}
      {showCartPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#f9f7f2] p-6 rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Panier</h2>
              <button
                onClick={() => setShowCartPopup(false)}
                className="text-black text-2xl hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              {cart.length === 0 && !selectedFormule && Object.entries(sideQuantities).every(([name, quantity]) => quantity === 0) ? (
                <p className="text-gray-500 text-center">Panier vide</p>
              ) : (
                <>
                  {/* Formule sélectionnée */}
                  {selectedFormule && (
                    <div className="border-b border-black pb-2">
                      <div className="font-bold text-lg mb-2">Formule {formules[selectedFormule].personnes} personnes</div>
                      <div className="text-sm font-bold mb-2">Prix: {formules[selectedFormule].prix}€</div>
                      
                      {selectedCouscous.length > 0 && (
                        <div className="mb-2">
                          <div className="font-bold text-sm">Couscous sélectionnés:</div>
                          {selectedCouscous.map((couscous, idx) => (
                            <div key={idx} className="text-sm ml-2">• {couscous.name}</div>
                          ))}
                        </div>
                      )}
                      
                      {selectedSalades.length > 0 && (
                        <div className="mb-2">
                          <div className="font-bold text-sm">Salades sélectionnées:</div>
                          {selectedSalades.map((salade, idx) => (
                            <div key={idx} className="text-sm ml-2">• {salade.name}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Items à la carte */}
                  {cart.map((item, index) => (
                    <div key={index} className="border-b border-black pb-2">
                      {item.type === 'formule' ? (
                        <div>
                          <div className="font-bold text-lg mb-2">Formule {item.personnes} personnes</div>
                          <div className="text-sm font-bold mb-2">Prix: {item.prix}€</div>
                          
                          {item.couscous.length > 0 && (
                            <div className="mb-2">
                              <div className="font-bold text-sm">Couscous sélectionnés:</div>
                              {item.couscous.map((couscous, idx) => (
                                <div key={idx} className="text-sm ml-2">• {couscous.name}</div>
                              ))}
                            </div>
                          )}
                          
                          {item.salades.length > 0 && (
                            <div className="mb-2">
                              <div className="font-bold text-sm">Salades sélectionnées:</div>
                              {item.salades.map((salade, idx) => (
                                <div key={idx} className="text-sm ml-2">• {salade.name}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span>{item.name}</span>
                          <span>{item.prix}€</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {Object.entries(sideQuantities).some(([name, quantity]) => quantity > 0) && (
                    <div>
                      <h3 className="font-bold mt-4">Sides ajoutés:</h3>
                      {Object.entries(sideQuantities)
                        .filter(([name, quantity]) => quantity > 0)
                        .map(([name, quantity]) => {
                          const side = menuData.sides.find(s => s.name === name);
                          return (
                            <div key={name} className="flex justify-between text-sm">
                              <span>
                                {name} x{quantity}
                                {name === "Vin Rouge, Rosé & Blanc" && (
                                  <span className="text-gray-600 ml-1">
                                    ({selectedWine.charAt(0).toUpperCase() + selectedWine.slice(1)})
                                  </span>
                                )}
                              </span>
                              <span>{(side ? side.price * quantity : 0).toFixed(2)}€</span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="border-t border-black pt-4">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span>Sous-total:</span>
                <span>{getTotalComplete().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center mb-2 text-sm">
                <span>Livraison:</span>
                <span>15.00€</span>
              </div>
              <div className="flex justify-between items-center mb-2 font-bold text-lg">
                <span>Total:</span>
                <span>{(getTotalComplete() + 15).toFixed(2)}€</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={resetSelection}
                  className="flex-1 bg-[#f9f7f2] text-black px-4 py-2 text-sm border border-black hover:bg-[#0038B8] transition-colors"
                >
                  Vider tout
                </button>
                <button
                  onClick={() => setShowCartPopup(false)}
                  className="flex-1 bg-[#0038B8] text-black px-4 py-2 text-sm border border-black hover:bg-[#f9f7f2] transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup d'information */}
      {showInfoPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#f9f7f2] p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Information</h2>
              <button
                onClick={() => setShowInfoPopup(false)}
                className="text-black text-2xl hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-black mb-3">
                Votre commande atteint le minimum de 200€ ! 🎉
              </p>
              <p className="text-black mb-3">
                Vous pouvez maintenant :
              </p>
              <ul className="list-disc list-inside text-black space-y-1">
                <li>Valider votre commande actuelle</li>
                <li>Ajouter des salades à votre commande</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowInfoPopup(false)}
                className="flex-1 bg-[#0038B8] text-black px-4 py-2 text-sm border border-black hover:bg-[#f9f7f2] transition-colors"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 