'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CommandePage() {
  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    adresse: '',
    notes: ''
  });

  const [cart] = useState([
    // Exemple de données de panier - à remplacer par les vraies données
    { name: "Slata Mechouia", quantity: 2, price: "6 €", section: "salata" },
    { name: "Couscous bel pkaila", quantity: 1, price: "45 €", section: "couscous" },
    { name: "Vin rouge, rosé & blanc", quantity: 1, price: "40 €", section: "side", wineType: ["rouge", "rosé"] }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici on peut ajouter la logique pour envoyer la commande
    alert('Commande envoyée avec succès !');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-black">
      {/* Header */}
      <div className="bg-[#f9f7f2] py-4 border-b border-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/menu-juliette" className="text-black hover:text-gray-700 transition-colors">
              ← Retour au menu
            </Link>
            <h1 className="text-2xl font-bold text-black">Commande</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Formulaire client */}
            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <h2 className="text-xl font-bold mb-4 text-black">Informations client</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9f7f2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9f7f2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9f7f2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de livraison *
                  </label>
                  <textarea
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9f7f2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes spéciales (allergies, préférences, etc.)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9f7f2] focus:border-transparent"
                  />
                </div>
              </form>
            </div>

            {/* Récapitulatif de la commande */}
            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <h2 className="text-xl font-bold mb-4 text-black">Récapitulatif de la commande</h2>
              
              <div className="space-y-3 mb-6">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-start border-b border-gray-200 pb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-black">{item.name}</h3>
                      {item.wineType && (
                        <p className="text-xs text-gray-600 mt-1">
                          Variante: {item.wineType.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-black">x{item.quantity}</p>
                      <p className="text-xs text-gray-600">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-black">Total items: {totalItems}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton commander */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              className="bg-[#f9f7f2] text-black px-8 py-3 text-lg font-bold border border-black hover:bg-[#0038B8] transition-colors"
            >
              CONFIRMER LA COMMANDE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 