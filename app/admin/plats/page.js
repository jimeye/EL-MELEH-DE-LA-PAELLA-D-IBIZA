'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

export default function PlatsAdmin() {
  const [plats, setPlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlat, setEditingPlat] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie: 'plat_principal',
    disponible: true,
    image_url: ''
  });

  useEffect(() => {
    fetchPlats();
  }, []);

  const fetchPlats = async () => {
    const { data, error } = await supabase
      .from('plats')
      .select('*')
      .order('categorie', { ascending: true });

    if (error) {
      console.error('Erreur:', error);
    } else {
      setPlats(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (editingPlat) {
      // Mise à jour
      const { error } = await supabase
        .from('plats')
        .update(formData)
        .eq('id', editingPlat.id);

      if (error) {
        console.error('Erreur mise à jour:', error);
      } else {
        setEditingPlat(null);
        setShowForm(false);
        resetForm();
        fetchPlats();
      }
    } else {
      // Création
      const { error } = await supabase
        .from('plats')
        .insert([formData]);

      if (error) {
        console.error('Erreur création:', error);
      } else {
        setShowForm(false);
        resetForm();
        fetchPlats();
      }
    }
    setLoading(false);
  };

  const handleEdit = (plat) => {
    setEditingPlat(plat);
    setFormData({
      nom: plat.nom,
      description: plat.description,
      prix: plat.prix,
      categorie: plat.categorie,
      disponible: plat.disponible,
      image_url: plat.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      const { error } = await supabase
        .from('plats')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur suppression:', error);
      } else {
        fetchPlats();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      prix: '',
      categorie: 'plat_principal',
      disponible: true,
      image_url: ''
    });
  };

  const categories = [
    { value: 'entree', label: 'Entrées' },
    { value: 'plat_principal', label: 'Plats Principaux' },
    { value: 'dessert', label: 'Desserts' },
    { value: 'boisson', label: 'Boissons' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
              <header className="bg-[#f9f7f2] shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link href="/admin" className="text-accent-red hover:text-red-700 mb-2 inline-block">
                ← Retour à l'administration
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Plats</h1>
            </div>
            <button
              onClick={() => {
                setEditingPlat(null);
                resetForm();
                setShowForm(true);
              }}
              className="bg-accent-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              + Ajouter un plat
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="bg-[#f9f7f2] p-6 rounded-lg shadow-sm border mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingPlat ? 'Modifier le plat' : 'Ajouter un nouveau plat'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du plat
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-red focus:border-accent-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.prix}
                    onChange={(e) => setFormData({...formData, prix: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-red focus:border-accent-red"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-red focus:border-accent-red"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-red focus:border-accent-red"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de l'image
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-red focus:border-accent-red"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="disponible"
                    checked={formData.disponible}
                    onChange={(e) => setFormData({...formData, disponible: e.target.checked})}
                    className="h-4 w-4 text-accent-red focus:ring-accent-red border-gray-300 rounded"
                  />
                  <label htmlFor="disponible" className="ml-2 block text-sm text-gray-900">
                    Disponible
                  </label>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-accent-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sauvegarde...' : (editingPlat ? 'Mettre à jour' : 'Ajouter')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPlat(null);
                    resetForm();
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des plats */}
        <div className="space-y-6">
          {categories.map(categorie => {
            const platsCategorie = plats.filter(plat => plat.categorie === categorie.value);
            if (platsCategorie.length === 0) return null;

            return (
                              <div key={categorie.value} className="bg-[#f9f7f2] rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">{categorie.label}</h3>
                </div>
                <div className="divide-y">
                  {platsCategorie.map(plat => (
                    <div key={plat.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">{plat.nom}</h4>
                          <span className="text-lg font-semibold text-accent-red">{plat.prix}€</span>
                          {!plat.disponible && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              Indisponible
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{plat.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(plat)}
                          className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(plat.id)}
                          className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
} 