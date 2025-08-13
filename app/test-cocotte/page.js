'use client';

export default function TestCocottePage() {
  const bagIcons = [
    '🛒', '👜', '💼', '🎒', '🛍️', '🪣', '🧺', '📦', '🗑️', '🛢️',
    '🪡', '🧵', '🪢', '🪣', '🪤', '🪥', '🪦', '🪧', '🪨', '🪩'
  ];

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-black p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Test Icônes Panier/Sac</h1>
        
        <div className="grid grid-cols-5 gap-6 max-w-4xl mx-auto">
          {bagIcons.map((icon, index) => (
            <div key={index} className="text-center">
              <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                <div className="text-4xl mb-2">{icon}</div>
                <p className="text-sm text-gray-600">Panier {index + 1}</p>
                <p className="text-xs text-gray-500 mt-1">Code: {icon}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-xl font-bold mb-4">Icônes en contexte (comme dans le panier)</h2>
          <div className="flex justify-center items-center space-x-8">
            {bagIcons.slice(0, 5).map((icon, index) => (
              <div key={index} className="flex items-center space-x-2">
                <button className="px-2 py-1 text-xs bg-white text-black border border-black hover:bg-gray-100 transition-colors">
                  {icon}
                </button>
                <span className="text-xs text-black">(3)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/menu-juliette" className="inline-block bg-[#f9f7f2] text-black px-6 py-3 border border-black hover:bg-[#0038B8] transition-colors">
            Retour au Menu Juliette
          </a>
        </div>
      </div>
    </div>
  );
} 