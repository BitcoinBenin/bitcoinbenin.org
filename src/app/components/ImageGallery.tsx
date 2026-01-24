'use client';

import { useState } from 'react';
import { GalleryImage } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { FaDownload, FaTrash, FaExpand } from 'react-icons/fa';

interface ImageGalleryProps {
  images: GalleryImage[];
  onImageDelete?: (imageId: string) => void;
  editable?: boolean;
}

export default function ImageGallery({ images, onImageDelete, editable = false }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const getImageUrl = (filePath: string) => {
    if (!supabase) return '';
    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleDelete = async (imageId: string, filePath: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    if (!supabase) return;

    setLoading(imageId);
    try {
      // Suppression du fichier
      await supabase.storage
        .from('gallery')
        .remove([filePath]);

      // Suppression de l'entrée dans la base
      await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      onImageDelete?.(imageId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleDownload = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Aucune image dans la gallery</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square rounded-xl overflow-hidden bg-brand-charcoal/50 border border-white/5 hover:border-brand-green/30 transition-all duration-300"
          >
            <img
              src={getImageUrl(image.file_path)}
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => {
                console.error('Erreur chargement image:', getImageUrl(image.file_path));
                // Optionnel: ajouter un fallback
              }}
            />
            
            {/* Overlay au hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <button
                onClick={() => setSelectedImage(image)}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                title="Voir en grand"
              >
                <FaExpand className="text-white text-sm" />
              </button>
              
              <button
                onClick={() => handleDownload(getImageUrl(image.file_path), image.title)}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                title="Télécharger"
              >
                <FaDownload className="text-white text-sm" />
              </button>
              
              {editable && (
                <button
                  onClick={() => handleDelete(image.id, image.file_path)}
                  disabled={loading === image.id}
                  className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  title="Supprimer"
                >
                  <FaTrash className="text-white text-sm" />
                </button>
              )}
            </div>

            {/* Badge de date si présente */}
            {image.event_date && (
              <div className="absolute top-2 left-2 bg-brand-green/80 text-white text-xs px-2 py-1 rounded-full">
                {new Date(image.event_date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal pour l'image en grand */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh]">
            <img
              src={getImageUrl(selectedImage.file_path)}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4">
              <h3 className="text-white font-display font-bold text-lg mb-2">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-300 text-sm mb-2">{selectedImage.description}</p>
              )}
              {selectedImage.event_date && (
                <p className="text-brand-green text-sm">
                  {new Date(selectedImage.event_date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
