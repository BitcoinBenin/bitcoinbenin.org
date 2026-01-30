'use client';

import { useState } from 'react';
import { GalleryImage } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { deleteImage } from '../admin/actions';
import { FaDownload, FaTrash, FaExpand, FaChevronLeft, FaChevronRight, FaStar, FaImage } from 'react-icons/fa';
import Image from 'next/image';

interface ImageGalleryProps {
  images: GalleryImage[];
  onImageDelete?: (imageId: string) => void;
  editable?: boolean;
  onSetAsCover?: (imagePath: string) => void;
  isCoverImage?: (imagePath: string) => boolean;
}

export default function ImageGalleryWithActions({ 
  images, 
  onImageDelete, 
  editable = false, 
  onSetAsCover, 
  isCoverImage 
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const getImageUrl = (filePath: string) => {
    if (!supabase) return '';
    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleDelete = async (imageId: string, filePath: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    setLoading(imageId);
    try {
      await deleteImage(imageId, filePath);
      onImageDelete?.(imageId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setLoading(null);
    }
  };

  const openImage = (image: GalleryImage) => {
    const index = images.findIndex(img => img.id === image.id);
    setCurrentIndex(index);
    setSelectedImage(image);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      setCurrentIndex(newIndex);
      setSelectedImage(images[newIndex]);
    } else {
      const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedImage) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        navigateImage('prev');
        break;
      case 'ArrowRight':
        navigateImage('next');
        break;
      case 'Escape':
        setSelectedImage(null);
        break;
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
            <Image
              src={getImageUrl(image.file_path)}
              alt={image.title}
              fill
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
              onClick={() => openImage(image)}
              onError={() => {
                console.error('Erreur chargement image:', getImageUrl(image.file_path));
                // Optionnel: ajouter un fallback
              }}
            />
            
            {/* Overlay au hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <button
                onClick={() => openImage(image)}
                className="p-3 bg-brand-green/80 rounded-full hover:bg-brand-green transition-colors shadow-lg"
                title="Voir en grand"
              >
                <FaExpand className="text-white text-base" />
              </button>
              
              <button
                onClick={() => handleDownload(getImageUrl(image.file_path), image.title)}
                className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors shadow-lg"
                title="Télécharger"
              >
                <FaDownload className="text-white text-base" />
              </button>
              
              {editable && (
                <button
                  onClick={() => handleDelete(image.id, image.file_path)}
                  disabled={loading === image.id}
                  className="p-3 bg-red-500/80 rounded-full hover:bg-red-500/30 transition-colors disabled:opacity-50 shadow-lg"
                  title="Supprimer"
                >
                  <FaTrash className="text-white text-base" />
                </button>
              )}
              
              {editable && onSetAsCover && !isCoverImage?.(image.file_path) && (
                <button
                  onClick={() => onSetAsCover(image.file_path)}
                  className="p-3 bg-brand-accent/80 rounded-full hover:bg-brand-accent transition-colors shadow-lg"
                  title="Définir comme photo de couverture"
                >
                  <FaImage className="text-white text-base" />
                </button>
              )}
            </div>

            {/* Badge de photo de couverture */}
            {isCoverImage && isCoverImage(image.file_path) && (
              <div className="absolute top-2 right-2 bg-brand-green/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <FaStar className="text-xs" />
                Couverture
              </div>
            )}

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

      {/* Modal pour l'image en grand avec navigation */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full">
            <Image
              src={getImageUrl(selectedImage.file_path)}
              alt={selectedImage.title}
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl mx-auto cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
            />
            
            {/* Flèche gauche */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 rounded-full hover:bg-black/80 transition-colors shadow-lg"
                title="Image précédente (flèche gauche)"
              >
                <FaChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}
            
            {/* Flèche droite */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 rounded-full hover:bg-black/80 transition-colors shadow-lg"
                title="Image suivante (flèche droite)"
              >
                <FaChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
            
            {/* Bouton de fermeture */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 p-3 bg-black/60 rounded-full hover:bg-black/80 transition-colors shadow-lg"
              title="Fermer (Échap)"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Informations améliorées */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-display font-bold text-lg">{selectedImage.title}</h3>
                {images.length > 1 && (
                  <span className="text-brand-green text-sm">
                    {currentIndex + 1} / {images.length}
                  </span>
                )}
              </div>
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