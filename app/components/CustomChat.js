'use client';

import { useState } from 'react';

export default function CustomChat() {
  const [isOpen, setIsOpen] = useState(false);

  const handleQuickMessage = (message) => {
    const whatsappUrl = `https://wa.me/33756872352?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Bouton de chat flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: "#0038B8",
          color: "#fff",
          border: "2px solid #fff",
          boxShadow: "0 4px 16px rgba(255,255,255,0.25)",
        }}
        className={`fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300`}
        aria-label="Ouvrir le chat"
      >
        {/* Cœur minimaliste */}
        <span className="text-lg">♥</span>
      </button>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div
          style={{
            background: "rgba(255,255,255,0.85)", // blanc semi-transparent
            backdropFilter: "blur(8px)",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            border: "1px solid #e5e7eb",
          }}
          className="fixed bottom-16 right-4 z-40 w-72 h-80 flex flex-col"
        >
          {/* En-tête */}
          <div className="bg-accent-red text-white p-4 rounded-t-lg">
            <h3 className="font-bold text-lg">💬 Support Mekbouba</h3>
            <p className="text-sm opacity-90">Chat WhatsApp • Réponse rapide</p>
          </div>

          {/* Messages rapides */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            <div className="text-center text-gray-600 text-sm mb-4">
              <p className="mb-2">❓ <strong>Problème pour commander ?</strong></p>
              <p className="text-xs">Sélectionnez votre problème :</p>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleQuickMessage("Bonjour, j'aimerais passer une commande chez Mekbouba, mais je n'arrive pas à finaliser ma commande. Pouvez-vous m'aider à aller au bout de la commande, s'il vous plaît ?")}
                className="w-full text-left p-3 bg-[#f9f7f2] hover:bg-[#0038B8] border border-white rounded-lg transition-colors duration-200 text-sm text-black"
              >
                1️⃣ Je n'arrive pas à finaliser
              </button>
              
              <button
                onClick={() => handleQuickMessage("Bonjour, j'aimerais passer une commande chez Mekbouba, mais je n'arrive pas à payer. Pouvez-vous m'aider à valider mon paiement, s'il vous plaît ?")}
                className="w-full text-left p-3 bg-[#f9f7f2] hover:bg-[#0038B8] border border-white rounded-lg transition-colors duration-200 text-sm text-black"
              >
                2️⃣ Je n'arrive pas à payer
              </button>
              
              <button
                onClick={() => handleQuickMessage("Bonjour, j'aimerais passer une commande chez Mekbouba, mais je n'arrive pas à me localiser. Pouvez-vous m'aider à renseigner mon adresse, s'il vous plaît ?")}
                className="w-full text-left p-3 bg-[#f9f7f2] hover:bg-[#0038B8] border border-white rounded-lg transition-colors duration-200 text-sm text-black"
              >
                3️⃣ Je n'arrive pas à me localiser
              </button>
              
              <button
                onClick={() => handleQuickMessage("Bonjour, j'aimerais passer une commande chez Mekbouba, mais j'ai un autre problème. Pouvez-vous m'aider, s'il vous plaît ?")}
                className="w-full text-left p-3 bg-[#f9f7f2] hover:bg-[#0038B8] border border-white rounded-lg transition-colors duration-200 text-sm text-black"
              >
                4️⃣ Autre
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 