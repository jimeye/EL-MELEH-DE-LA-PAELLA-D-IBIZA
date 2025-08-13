'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export default function ImagesAdmin() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur:', error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    
    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('images')
        .insert([{
          name: selectedFile.name,
          url: publicUrl,
          path: filePath,
          size: selectedFile.size,
          type: selectedFile.type
        }]);

      if (dbError) {
        console.error('Erreur DB:', dbError);
      } else {
        setSelectedFile(null);
        fetchImages();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
    
    setUploading(false);
  };

  const handleDelete = async (image) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('site-images')
        .remove([image.path]);

      if (storageError) {
        console.error('Erreur suppression storage:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', image.id);

      if (dbError) {
        console.error('Erreur suppression DB:', dbError);
      } else {
        fetchImages();
      }
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL copiée dans le presse-papiers !');
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Images</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
                  <div className="bg-[#f9f7f2] p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-xl font-semibold mb-4">Uploader une nouvelle image</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner une image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-red focus:border-accent-red"
              />
            </div>
            {selectedFile && (
              <div className="text-sm text-gray-600">
                Fichier sélectionné : {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-accent-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Upload en cours...' : 'Uploader l\'image'}
            </button>
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map(image => (
                            <div key={image.id} className="bg-[#f9f7f2] rounded-lg shadow-sm border overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{image.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {(image.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => copyToClipboard(image.url)}
                    className="w-full text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Copier l'URL
                  </button>
                  <button
                    onClick={() => handleDelete(image)}
                    className="w-full text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              Aucune image uploadée pour le moment.
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 