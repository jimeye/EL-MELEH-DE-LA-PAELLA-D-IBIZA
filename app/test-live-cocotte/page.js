'use client';
import { useState } from 'react';

export default function TestLiveCocottePage() {
  const [selectedIcon, setSelectedIcon] = useState('🍲');
  
  const cocotteIcons = [
    '🍲', '🥘', '🫕', '🍳', '🥄', '🍽️', '🥣', '🫖', '☕', '🫗',
    '🥤', '🧉', '🍵', '🫙', '🥛', '🥤', '🧃', '🥤', '🧋', '🍶'
  ];

  const simpleIcons = [
    '●', '○', '■', '□', '▲', '△', '◆', '◇', '★', '☆',
    '♦', '♠', '♥', '♣', '⚫', '⚪', '⬛', '⬜', '🔴', '🔵'
  ];

  const potIcons = [
    // Casserole simple
    <svg key="pot1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/>
      <path d="M8 6h8v2H8z"/>
      <circle cx="8" cy="12" r="1"/>
      <circle cx="16" cy="12" r="1"/>
    </svg>,
    // Casserole avec couvercle
    <svg key="pot2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/>
      <path d="M8 6h8v2H8z"/>
      <circle cx="8" cy="12" r="1"/>
      <circle cx="16" cy="12" r="1"/>
      <path d="M6 8a8 4 0 0 0 12 0"/>
    </svg>,
    // Casserole ronde
    <svg key="pot3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="12" rx="8" ry="6"/>
      <path d="M4 12h16"/>
      <circle cx="8" cy="12" r="1"/>
      <circle cx="16" cy="12" r="1"/>
    </svg>,
    // Casserole avec vapeur
    <svg key="pot4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/>
      <path d="M8 6h8v2H8z"/>
      <circle cx="8" cy="12" r="1"/>
      <circle cx="16" cy="12" r="1"/>
      <path d="M10 4c0-1 1-2 2-2s2 1 2 2"/>
      <path d="M12 4v2"/>
    </svg>,
    // Casserole simple sans poignées
    <svg key="pot5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/>
      <path d="M8 6h8v2H8z"/>
    </svg>
  ];

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-black">
      {/* Header */}
      <div className="bg-[#f9f7f2] py-4 border-b border-black">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center text-black">Test Icônes Live Chat Cocotte</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center">Icônes de cocotte style live chat</h2>
          
          {/* Grille des icônes cocotte */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {cocotteIcons.map((icon, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                  <div className="text-3xl mb-2">{icon}</div>
                  <p className="text-sm text-gray-600">Cocotte {index + 1}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Grille des icônes simples noir et blanc */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {simpleIcons.map((icon, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                  <div className="text-3xl mb-2 text-black">{icon}</div>
                  <p className="text-sm text-gray-600">Simple {index + 1}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Grille des icônes de casserole minimalistes */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {potIcons.map((icon, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                  <div className="flex justify-center items-center mb-2 text-black">
                    {icon}
                  </div>
                  <p className="text-sm text-gray-600">Casserole {index + 1}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Icônes flottantes style live chat */}
          <div className="space-y-8">
            <h3 className="text-lg font-bold text-center mb-4">Style Live Chat (Flottant)</h3>
            
            {/* Position bottom-right */}
            <div className="relative h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div className="absolute bottom-4 right-4">
                <button
                  style={{
                    background: "#ffffff",
                    color: "#000000",
                    border: "1px solid #000000",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-300 text-2xl"
                >
                  {selectedIcon}
                </button>
              </div>
              <div className="absolute top-4 left-4 text-sm text-gray-600">
                Position: bottom-right
              </div>
            </div>

            {/* Position bottom-left */}
            <div className="relative h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div className="absolute bottom-4 left-4">
                <button
                  style={{
                    background: "#f9f7f2",
                    color: "#000",
                    border: "2px solid #000",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 text-2xl"
                >
                  {selectedIcon}
                </button>
              </div>
              <div className="absolute top-4 left-4 text-sm text-gray-600">
                Position: bottom-left
              </div>
            </div>

            {/* Position center */}
            <div className="relative h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <button
                  style={{
                    background: "#f9f7f2",
                    color: "#000",
                    border: "2px solid #000",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 text-2xl"
                >
                  {selectedIcon}
                </button>
              </div>
              <div className="absolute top-4 left-4 text-sm text-gray-600">
                Position: center
              </div>
            </div>
          </div>

          {/* Sélecteur d'icône */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-bold mb-4">Choisir une icône</h3>
            <div className="flex justify-center flex-wrap gap-2">
              {cocotteIcons.map((icon, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-2 rounded border transition-colors ${
                    selectedIcon === icon
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <a href="/menu-juliette" className="inline-block bg-[#f9f7f2] text-black px-6 py-3 border border-black hover:bg-[#0038B8] transition-colors">
              Retour au Menu Juliette
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 