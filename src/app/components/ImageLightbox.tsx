'use client';

import { useState, useEffect } from 'react';
import { GalleryImage } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';

interface ImageLightboxProps {
  images: GalleryImage[];
  selectedImage: GalleryImage | null;
  onClose: () => void;
  initialIndex?: number;
}

export default function ImageLightbox({ images, selectedImage, onClose, initialIndex = 0 }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (selectedImage) {
      const index = images.findIndex(img => img.id === selectedImage.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [selectedImage, images]);

  const getImageUrl = (filePath: string) => {
    if (!supabase) return '';
    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      setCurrentIndex(newIndex);
    } else {
      const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(newIndex);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        navigateImage('prev');
        break;
      case 'ArrowRight':
        navigateImage('next');
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  if (!selectedImage) return null;

  const currentImage = images[currentIndex] || selectedImage;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative max-w-7xl max-h-[90vh] w-full">
        <Image
          src={getImageUrl(currentImage.file_path)}
          alt={currentImage.title}
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
            onClose();
          }}
          className="absolute top-4 right-4 p-3 bg-black/60 rounded-full hover:bg-black/80 transition-colors shadow-lg"
          title="Fermer (Échap)"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Informations */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-display font-bold text-lg">{currentImage.title}</h3>
            {images.length > 1 && (
              <span className="text-brand-green text-sm">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>
          {currentImage.description && (
            <p className="text-gray-300 text-sm mb-2">{currentImage.description}</p>
          )}
          {currentImage.event_date && (
            <p className="text-brand-green text-sm">
              {new Date(currentImage.event_date).toLocaleDateString('fr-FR', {
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
  );
}