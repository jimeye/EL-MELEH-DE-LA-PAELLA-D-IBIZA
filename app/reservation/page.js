'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

export default function ReservationPage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [formData, setFormData] = useState({
    deliveryDate: '',
    deliveryTime: '',
    firstName: '',
    lastName: '',
    isHotel: '',
    selectedHotel: '',
    roomNumber: '',
    otherHotelName: '',
    otherHotelAddress: '',
    otherHotelPostalCode: '',
    otherHotelCity: '',
    otherHotelCountry: 'Espagne',
    address: '',
    postalCode: '',
    city: '',
    country: 'Espagne',
    phone: '',
    notes: '',
    sbmLots: [],
    bbmLots: [],
    paellaLots: [],
    keftaLots: [],
    boulettesSuppGlobal: 0
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsHeaderVisible(scrollTop < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const prices = { sbm: 26, bbm: 26, paella: 26, kefta: 26 };

  const ibizaHotels = [
    'Autre',
    'Ushuaïa Ibiza Beach',
    'Hard Rock Hotel Ibiza',
    'Six Senses Ibiza',
    'Hotel Riomar, Ibiza, a Tribute Portfolio Hotel',
    'Nobu Hotel Ibiza Bay',
    'Destino Pacha Ibiza Resort',
    'Aguas de Ibiza Grand Luxe',
    'Atzaró Agroturismo',
    'Bless Ibiza',
    'Casa Maca',
    'Cenit',
    'W Ibiza, Santa Eulària des Riu',
    'Es Vive',
    'Hacienda Na Xamena',
    'Ibiza Corso Hotel & Spa',
    'Ibiza Gran',
    'Los Felices (The Concept Hotels)',
    'ME Ibiza',
    'Mirador de Dalt Vila',
    'Montesol Experimental',
    'Montesol Ibiza',
    'Montesol Ibiza Curio Collection by Hilton',
    'OD Talamanca',
    'OKU Ibiza',
    'Palladium Hotel Playa d\'en Bossa',
    'Pikes Ibiza',
    'Ses Figueres',
    'The Unexpected Ibiza',
    'Torre del Mar',
    'TRS Ibiza'
  ];

  const subtotal = formData.sbmLots.reduce((sum, lot) => sum + lot.qty * prices.sbm, 0)
    + formData.bbmLots.reduce((sum, lot) => sum + lot.qty * prices.bbm, 0)
    + formData.paellaLots.reduce((sum, lot) => sum + lot.qty * prices.paella, 0)
    + formData.keftaLots.reduce((sum, lot) => sum + lot.qty * prices.kefta, 0)
    + (formData.boulettesSuppGlobal * 5);
  const totalItems = formData.sbmLots.reduce((sum, lot) => sum + lot.qty, 0) + formData.bbmLots.reduce((sum, lot) => sum + lot.qty, 0) + formData.paellaLots.reduce((sum, lot) => sum + lot.qty, 0) + formData.keftaLots.reduce((sum, lot) => sum + lot.qty, 0);
  const deliveryFee = totalItems >= 6 ? 0 : 15;
  const total = subtotal + deliveryFee;
  
  // Données pour le panier
  const cartData = {
    sbmLots: formData.sbmLots,
    bbmLots: formData.bbmLots,
    paellaLots: formData.paellaLots,
    keftaLots: formData.keftaLots,
    boulettesSuppGlobal: formData.boulettesSuppGlobal
  };


  // Fonction pour supprimer un article depuis le pop-up du panier
  const handleRemoveFromCart = (type, id) => {
    if (type === 'boulettesSupp') {
      setFormData(prev => ({
        ...prev,
        boulettesSuppGlobal: 0
      }));
    } else {
      removeLot(type, id);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Si la date change, vérifier si l'heure actuelle est toujours disponible
    if (name === 'deliveryDate') {
      const currentTime = formData.deliveryTime;
      const availableTimesForNewDate = getAvailableTimesForDate(value);
      
      // Si l'heure actuelle n'est plus disponible, la réinitialiser
      if (currentTime && !availableTimesForNewDate.includes(currentTime)) {
        setFormData(prev => ({ ...prev, [name]: value, deliveryTime: '' }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Utiliser l'API de géocodage inverse pour obtenir l'adresse
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
              const address = data.display_name || '';
              const parts = address.split(', ');
              
              setFormData(prev => ({
                ...prev,
                address: parts.slice(0, 2).join(', ') || '',
                postalCode: data.address?.postcode || '',
                city: data.address?.city || data.address?.town || data.address?.village || '',
                country: data.address?.country || 'Espagne'
              }));
            })
            .catch(error => {
              console.error('Erreur lors de la récupération de l\'adresse:', error);
              alert('Impossible de récupérer l\'adresse. Veuillez la saisir manuellement.');
            });
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          alert('Impossible d\'accéder à votre position GPS. Veuillez saisir votre adresse manuellement.');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  const getCurrentLocationForHotel = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Utiliser l'API de géocodage inverse pour obtenir l'adresse
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
              const address = data.display_name || '';
              const parts = address.split(', ');
              
              setFormData(prev => ({
                ...prev,
                otherHotelAddress: parts.slice(0, 2).join(', ') || '',
                otherHotelPostalCode: data.address?.postcode || '',
                otherHotelCity: data.address?.city || data.address?.town || data.address?.village || '',
                otherHotelCountry: data.address?.country || 'Espagne'
              }));
            })
            .catch(error => {
              console.error('Erreur lors de la récupération de l\'adresse:', error);
              alert('Impossible de récupérer l\'adresse. Veuillez la saisir manuellement.');
            });
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          alert('Impossible d\'accéder à votre position GPS. Veuillez saisir votre adresse manuellement.');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Vérifier que tous les champs requis sont remplis
    if (!formData.deliveryDate || !formData.deliveryTime || !formData.firstName || 
        !formData.lastName || !formData.phone || !formData.isHotel) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Vérifier l'adresse selon le type de livraison
    if (formData.isHotel === 'yes') {
      if (!formData.selectedHotel) {
        alert('Veuillez sélectionner un hôtel.');
        return;
      }
      if (formData.selectedHotel === 'Autre' && !formData.otherHotelName) {
        alert('Veuillez saisir le nom de votre hôtel.');
        return;
      }
    } else {
      if (!formData.address || !formData.postalCode || !formData.city) {
        alert('Veuillez saisir votre adresse complète.');
        return;
      }
    }

    // Vérifier qu'il y a au moins un article
    if (totalItems === 0) {
      alert('Veuillez ajouter au moins un article à votre commande.');
      return;
    }

    // Afficher les options de paiement
    setShowPaymentOptions(true);
  };

  const handlePaymentSelection = (paymentType) => {
    setPaymentMethod(paymentType);
    
    // Rediriger vers la page de paiement
    const orderDataParam = encodeURIComponent(JSON.stringify(formData));
    const amountParam = total;
    
    const paymentUrl = `/payment?orderData=${orderDataParam}&paymentType=${paymentType}&amount=${amountParam}`;
    router.push(paymentUrl);
  };

  const getAvailableDays = () => {
    const availableDays = [];
    const currentYear = 2025;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    for (let month = 6; month <= 7; month++) { // 6 = juillet, 7 = août
      const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, month, day);
        // Inclure tous les jours sauf samedi (6) et filtrer les dates passées
        if (date.getDay() !== 6 && date >= today) { // 6 = samedi
          availableDays.push(date);
        }
      }
    }
    return availableDays.sort((a, b) => a - b);
  };
  const availableDays = getAvailableDays();

  const availableTimes = [
    'de 12H30 à 16H00',
    'de 20H00 à 23H00'
  ];

  // Fonction pour filtrer les créneaux selon le jour sélectionné
  const getAvailableTimesForDate = (selectedDate) => {
    if (!selectedDate) return availableTimes;
    
    // Extraire le jour de la semaine de la date sélectionnée
    const dateParts = selectedDate.split(' ');
    const dayName = dateParts[0]; // "dimanche", "jeudi", "vendredi"
    
    // Si c'est vendredi, exclure le créneau du soir
    if (dayName === 'vendredi') {
      return ['de 12H30 à 16H00'];
    }
    
    // Pour dimanche et jeudi, tous les créneaux sont disponibles
    return availableTimes;
  };

  const addLot = (type) => {
    const newLot = {
      id: Date.now() + Math.random(),
      qty: type === 'paella' ? 6 : 1,
      options: { piment: true, oeuf: true, mekbouba: true },
      boulettesSupp: 0
    };
    setFormData(prev => ({
      ...prev,
      [`${type}Lots`]: [...prev[`${type}Lots`], newLot]
    }));
  };

  const removeLot = (type, id) => {
    setFormData(prev => ({
      ...prev,
      [`${type}Lots`]: prev[`${type}Lots`].filter(lot => lot.id !== id)
    }));
  };

  const updateLot = (type, id, field, value) => {
    setFormData(prev => ({
      ...prev,
      [`${type}Lots`]: prev[`${type}Lots`].map(lot =>
        lot.id === id ? { ...lot, [field]: value } : lot
      )
    }));
  };

  const updateLotOption = (type, id, opt, checked) => {
    setFormData(prev => ({
      ...prev,
      [`${type}Lots`]: prev[`${type}Lots`].map(lot =>
        lot.id === id ? { ...lot, options: { ...lot.options, [opt]: checked } } : lot
      )
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white reservation-page">
      <main className="flex-grow">
        <Navbar 
        isVisible={isHeaderVisible} 
        cartItems={cartData}
        totalItems={totalItems}
        totalPrice={subtotal}
        onRemoveItem={handleRemoveFromCart}
      />
        <div className="relative">
          <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: "url('/images/uneexperienceunique-ibiza-kosher-cacher-friendly.webp')" }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative z-10 container mx-auto p-4 md:p-8">
            <div className="max-w-3xl mx-auto bg-[#f9f7f2]/95 p-6 md:p-10 -2xl shadow-xl my-16">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Réservez chez<br className="md:hidden" /> EL MELEH DE LA PAELLA 👑<br className="md:hidden" /> <span className="text-lg md:text-xl">Kosher Friendly</span></h1>
                <p className="text-gray-600 mt-2">Livraisons partout sur l'ile du dimanche au vendredi</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* Section Commande */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Votre commande</h2>
                  {/* SBM */}
                  <div className="bg-gray-50 p-4  mb-4">
                    <div className="flex flex-row items-center justify-between">
                      <div>
                        <span className="font-semibold text-lg leading-tight">Sandwich Boulettes Mekbouba SBM 26 € 🥪</span>
                      </div>
                      <button type="button" onClick={() => addLot('sbm')} className="bg-accent-red text-black px-4 md:px-6 py-1 md:py-1.5 font-semibold text-sm ml-2 border border-black">Add</button>
                    </div>
                    {formData.sbmLots.map((lot, idx) => (
                      <div key={lot.id} className="mt-2 ml-4 p-2 border-l-4 border-accent-red bg-[#f9f7f2] -r-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-xs">Combo SBM #{idx + 1}</span>
                          <button 
                            type="button" 
                            onClick={() => removeLot('sbm', lot.id)} 
                            className="text-red-500 font-bold text-xs cursor-pointer hover:text-red-700 transition-colors duration-200"
                            title="Supprimer"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                          <label className="text-xs font-medium">Quantité :</label>
                          <select
                            className="border  px-1 py-0.5 text-xs w-11 h-5"
                            value={lot.qty}
                            onChange={e => updateLot('sbm', lot.id, 'qty', Math.max(1, Math.min(10, parseInt(e.target.value))))}
                          >
                            {[...Array(10).keys()].map(n => (
                              <option key={n+1} value={n+1}>{n+1}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex space-x-3 mb-1">
                          <label className="flex items-center text-xs"><input type="checkbox" checked={lot.options.piment} onChange={e => updateLotOption('sbm', lot.id, 'piment', e.target.checked)} className="mr-1"/>🌶️ Piment</label>
                          <label className="flex items-center text-xs"><input type="checkbox" checked={lot.options.oeuf} onChange={e => updateLotOption('sbm', lot.id, 'oeuf', e.target.checked)} className="mr-1"/>🥚 Oeuf</label>
                          <label className="flex items-center text-xs"><input type="checkbox" checked={lot.options.mekbouba} onChange={e => updateLotOption('sbm', lot.id, 'mekbouba', e.target.checked)} className="mr-1"/>🥘 Mekbouba</label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* BBM */}
                  <div className="bg-gray-50 p-4 ">
                    <div className="flex flex-row items-center justify-between">
                      <div>
                        <span className="font-semibold text-lg leading-tight">Box Boulettes Mekbouba BBM 26 €🍴</span>
                      </div>
                      <button type="button" onClick={() => addLot('bbm')} className="bg-accent-red text-black px-4 md:px-6 py-1 md:py-1.5 font-semibold text-sm ml-2 border border-black">Add</button>
                    </div>
                    {formData.bbmLots.map((lot, idx) => (
                      <div key={lot.id} className="mt-2 ml-4 p-2 border-l-4 border-accent-red bg-[#f9f7f2] -r-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-xs">Combo BBM #{idx + 1}</span>
                          <button 
                            type="button" 
                            onClick={() => removeLot('bbm', lot.id)} 
                            className="text-red-500 font-bold text-xs cursor-pointer hover:text-red-700 transition-colors duration-200"
                            title="Supprimer"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                          <label className="text-xs font-medium">Quantité :</label>
                          <select
                            className="border  px-1 py-0.5 text-xs w-11 h-5"
                            value={lot.qty}
                            onChange={e => updateLot('bbm', lot.id, 'qty', Math.max(1, Math.min(10, parseInt(e.target.value))))}
                          >
                            {[...Array(10).keys()].map(n => (
                              <option key={n+1} value={n+1}>{n+1}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex space-x-3 mb-1">
                          <label className="flex items-center text-xs"><input type="checkbox" checked={lot.options.piment} onChange={e => updateLotOption('bbm', lot.id, 'piment', e.target.checked)} className="mr-1"/>🌶️ Piment</label>
                          <label className="flex items-center text-xs"><input type="checkbox" checked={lot.options.oeuf} onChange={e => updateLotOption('bbm', lot.id, 'oeuf', e.target.checked)} className="mr-1"/>🥚 Oeuf</label>
                          <label className="flex items-center text-xs"><input type="checkbox" checked={lot.options.mekbouba} onChange={e => updateLotOption('bbm', lot.id, 'mekbouba', e.target.checked)} className="mr-1"/>🥘 Mekbouba</label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Paella de Pescado */}
                  <div className="bg-gray-50 p-4  mt-4">
                    <div className="flex flex-row items-center justify-between">
                      <div>
                        <span className="font-semibold text-lg leading-tight">Paella de Pescado 26 € 🍚</span>
                      </div>
                      <button type="button" onClick={() => addLot('paella')} className="bg-accent-red text-black px-4 md:px-6 py-1 md:py-1.5 font-semibold text-sm ml-2 border border-black">Add</button>
                    </div>
                    {formData.paellaLots.map((lot, idx) => (
                      <div key={lot.id} className="mt-2 ml-4 p-2 border-l-4 border-accent-red bg-white -r-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm text-gray-800">🍚 Paella de Pescado #{idx + 1}</span>
                          <button 
                            type="button" 
                            onClick={() => removeLot('paella', lot.id)} 
                            className="text-red-500 font-bold text-xs cursor-pointer hover:text-red-700 transition-colors duration-200"
                            title="Supprimer"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                          <label className="text-xs font-medium">Quantité :</label>
                          <select
                            className="border  px-1 py-0.5 text-xs w-11 h-5"
                            value={lot.qty}
                            onChange={e => {
                              const newValue = parseInt(e.target.value);
                              updateLot('paella', lot.id, 'qty', newValue);
                            }}
                          >
                            {[...Array(10).keys()].map(n => (
                              <option key={n+1} value={n+1}>{n+1}</option>
                            ))}
                          </select>
                        </div>
                        <div className="text-xs text-gray-600">
                          🐟 Riz safrané avec poisson frais de la Méditerranée, légumes de saison et épices. Plat traditionnel espagnol cachère parfait pour cette semaine sans viande. *min 6 personnes
                        </div>
                      </div>
                    ))}
                  </div>
                  
                                     {/* Sandwich Kefta Poisson Mekbouba SKM */}
                  <div className="bg-gray-50 p-4  mb-4">
                    <div className="flex flex-row items-center justify-between">
                      <div>
                                                 <span className="font-semibold text-lg leading-tight">Sandwich Kefta Poisson<br/>Mekbouba SKM 26 € 🥪</span>
                      </div>
                      <button type="button" onClick={() => addLot('kefta')} className="bg-accent-red text-black px-4 md:px-6 py-1 md:py-1.5 font-semibold text-sm ml-2 border border-black">Add</button>
                    </div>
                    {formData.keftaLots.map((lot, idx) => (
                      <div key={lot.id} className="mt-2 ml-4 p-2 border-l-4 border-accent-red bg-white -r-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm text-gray-800">🥪 Sandwich Kefta Poisson<br/>Mekbouba SKM #{idx + 1}</span>
                          <button 
                            type="button" 
                            onClick={() => removeLot('kefta', lot.id)} 
                            className="text-red-500 font-bold text-xs cursor-pointer hover:text-red-700 transition-colors duration-200"
                            title="Supprimer"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                          <label className="text-xs font-medium">Quantité :</label>
                          <select
                            className="border  px-1 py-0.5 text-xs w-11 h-5"
                            value={lot.qty}
                            onChange={e => {
                              const newValue = parseInt(e.target.value);
                              updateLot('kefta', lot.id, 'qty', newValue);
                            }}
                          >
                            {[...Array(10).keys()].map(n => (
                              <option key={n+1} value={n+1}>{n+1}</option>
                            ))}
                          </select>
                        </div>
                        <div className="text-xs text-gray-600">
                          🌙 Spécial Ticha Beav 🌊✨ Baguette, mekbouka maison, kefta de poisson aux épices et herbes, œuf au plat coulant. Léger, savoureux, et profondément méditerranéen.
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 p-4  mt-4 mb-4">
                    <div className="flex flex-row items-center justify-between">
                      <span className="font-semibold text-lg leading-tight">Boulettes 5 € 🥘</span>
                      <select
                        className="bg-accent-red text-black px-4 md:px-6 py-1 md:py-1.5 font-semibold text-sm border border-black w-10 md:w-14"
                        value={formData.boulettesSuppGlobal}
                        onChange={e => setFormData(prev => ({ ...prev, boulettesSuppGlobal: Math.max(0, Math.min(10, parseInt(e.target.value))) }))}
                      >
                        {[...Array(11).keys()].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (allergies, etc.)</label>
                    <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows="3" className="w-full mt-1 px-3 py-2 border border-gray-300 "></textarea>
                  </div>
                </div>

                {/* Section Coordonnées & Livraison */}
                <div className="border-b pb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Vos informations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">Date de livraison</label>
                      <select id="deliveryDate" name="deliveryDate" value={formData.deliveryDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 " required>
                        <option value="" disabled>Sélectionnez une date (tous les jours sauf samedi)</option>
                        {availableDays.map(d => <option key={d.toISOString()} value={d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}>{d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">Heure de livraison confirmée la veille</label>
                      <select id="deliveryTime" name="deliveryTime" value={formData.deliveryTime} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 " required>
                        <option value="" disabled>Sélectionnez un créneau</option>
                        {getAvailableTimesForDate(formData.deliveryDate).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                      <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Votre prénom" className="w-full px-3 py-2 border border-gray-300 " required />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                      <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Votre nom" className="w-full px-3 py-2 border border-gray-300 " required />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+33 7..." className="w-full px-3 py-2 border border-gray-300 " required />
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                      <label className="block text-sm font-medium text-gray-700">Êtes-vous dans un hôtel ?</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="isHotel" 
                            value="yes" 
                            checked={formData.isHotel === 'yes'} 
                            onChange={handleInputChange} 
                            className="mr-2"
                          />
                          Oui
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="isHotel" 
                            value="no" 
                            checked={formData.isHotel === 'no'} 
                            onChange={handleInputChange} 
                            className="mr-2"
                          />
                          Non
                        </label>
                      </div>
                      
                      {formData.isHotel === 'yes' && (
                        <div>
                          {formData.selectedHotel !== 'Autre' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionnez votre hôtel</label>
                                <select 
                                  name="selectedHotel" 
                                  value={formData.selectedHotel} 
                                  onChange={handleInputChange} 
                                  className="w-full px-3 py-2 border border-gray-300 "
                                  required
                                >
                                  <option value="" disabled>Sélectionnez un hôtel</option>
                                  {ibizaHotels.map(hotel => (
                                    <option key={hotel} value={hotel}>{hotel}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de chambre</label>
                                <input 
                                  type="text" 
                                  name="roomNumber" 
                                  value={formData.roomNumber} 
                                  onChange={handleInputChange} 
                                  placeholder="Ex: 205, 3ème étage, etc." 
                                  className="w-full px-3 py-2 border border-gray-300 "
                                />
                              </div>
                            </div>
                          )}
                          
                          {formData.selectedHotel === 'Autre' && (
                            <div className="mt-4 space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'hôtel</label>
                                <input 
                                  type="text" 
                                  name="otherHotelName" 
                                  value={formData.otherHotelName} 
                                  onChange={handleInputChange} 
                                  placeholder="Nom de votre hôtel" 
                                  className="w-full px-3 py-2 border border-gray-300 "
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de chambre</label>
                                <input 
                                  type="text" 
                                  name="roomNumber" 
                                  value={formData.roomNumber} 
                                  onChange={handleInputChange} 
                                  placeholder="Ex: 205, 3ème étage, etc." 
                                  className="w-full px-3 py-2 border border-gray-300 "
                                />
                              </div>
                              <div className="mt-3">
                                <button 
                                  type="button" 
                                  onClick={getCurrentLocationForHotel}
                                  className="flex items-center justify-center space-x-1 bg-[#f9f7f2] hover:bg-[#0038B8] text-black border border-black px-2 py-1  text-xs transition-colors duration-200"
                                >
                                  <span>📍</span>
                                  <span>Utiliser ma position GPS</span>
                                </button>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de l'hôtel</label>
                                <input 
                                  type="text" 
                                  name="otherHotelAddress" 
                                  value={formData.otherHotelAddress} 
                                  onChange={handleInputChange} 
                                  placeholder="Numéro et nom de rue" 
                                  className="w-full px-3 py-2 border border-gray-300 "
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input 
                                  type="text" 
                                  name="otherHotelPostalCode" 
                                  value={formData.otherHotelPostalCode} 
                                  onChange={handleInputChange} 
                                  placeholder="Code Postal" 
                                  className="w-full px-3 py-2 border border-gray-300 "
                                />
                                <input 
                                  type="text" 
                                  name="otherHotelCity" 
                                  value={formData.otherHotelCity} 
                                  onChange={handleInputChange} 
                                  placeholder="Ville" 
                                  className="w-full px-3 py-2 border border-gray-300 "
                                />
                                <input 
                                  type="text" 
                                  name="otherHotelCountry" 
                                  value={formData.otherHotelCountry} 
                                  onChange={handleInputChange} 
                                  placeholder="Pays" 
                                  className="w-full px-3 py-2 border border-gray-300 "
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {formData.isHotel === 'no' && (
                        <>
                          <div className="mt-3">
                            <button 
                              type="button" 
                              onClick={getCurrentLocation}
                              className="flex items-center justify-center space-x-1 bg-[#f9f7f2] hover:bg-[#0038B8] text-black border border-black px-2 py-1  text-xs transition-colors duration-200"
                            >
                              <span>📍</span>
                              <span>Utiliser ma position GPS</span>
                            </button>
                          </div>
                          <label className="block text-sm font-medium text-gray-700">Adresse de livraison</label>
                          <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Numéro et nom de rue" className="w-full px-3 py-2 border border-gray-300 " />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Code Postal" className="w-full px-3 py-2 border border-gray-300 " />
                              <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Ville" className="w-full px-3 py-2 border border-gray-300 " />
                              <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="Pays" className="w-full px-3 py-2 border border-gray-300 " />
                          </div>
                        </>
                      )}
                  </div>
                </div>

                {/* Total et Bouton de soumission */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex justify-between text-lg"><span>Sous-total</span><span>{subtotal}€</span></div>
                  <div className="flex justify-between text-lg"><span>Livraison</span><span>{deliveryFee}€</span></div>
                  {totalItems > 0 && totalItems < 6 && <p className="text-center text-sm text-gray-500">Livraison offerte pour 6 articles ou plus !</p>}
                  <div className="flex justify-between text-2xl font-bold"><span>TOTAL</span><span>{total}€</span></div>
                  
                  {!showPaymentOptions ? (
                    <button 
                      type="submit" 
                      disabled={totalItems === 0} 
                      className="w-full bg-accent-red text-white py-3 -md font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      🚀 Continuer vers le paiement
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700 text-center">Choisissez votre mode de paiement</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handlePaymentSelection('cash_validation')}
                          className="inline-flex items-center justify-center space-x-2 bg-accent-red hover:bg-accent-red/90 text-black border border-black px-5 py-1.5  font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full text-base"
                        >
                          <span>💰 Cash<br /><span className='text-xs font-normal'>Validation CB 0€ – paiement à la livraison</span></span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handlePaymentSelection('full_payment')}
                          className="inline-flex items-center justify-center space-x-2 bg-accent-red hover:bg-accent-red/90 text-black border border-black px-5 py-1.5  font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full text-base"
                        >
                          <span>💳 Cb<br /><span className='text-xs font-normal'>Payez maintenant {total}€</span></span>
                        </button>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setShowPaymentOptions(false)}
                        className="w-full text-gray-500 hover:text-gray-700 underline text-sm"
                      >
                        ← Retour à la commande
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer Amélioré */}
      <footer className="bg-[#0038B8] text-white py-3">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-0">EL MELEH DE LA PAELLA 👑</h3>
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
                    ©2025 EL MELEH DE LA PAELLA 👑 Kosher friendly
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
    </div>
  );
}