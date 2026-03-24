'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  filePath: string;
  alt: string;
  size?: 'thumb' | 'medium' | 'large' | 'full';
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  onClick?: () => void;
  onError?: () => void;
  onLoad?: () => void;
  priority?: boolean;
}

export default function OptimizedImage({
  filePath,
  alt,
  size = 'medium',
  className = '',
  fill = false,
  width,
  height,
  onClick,
  onError,
  onLoad,
  priority = false
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const getImageUrl = (filePath: string, size: 'thumb' | 'medium' | 'large' | 'full') => {
    if (!filePath) return '/gallery-placeholder.webp';
    
    // Encoder le chemin pour l'URL
    const encodedPath = encodeURIComponent(filePath);
    
    if (size === 'full') {
      // Pour la lightbox, on utilise l'URL directe Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        return `${supabaseUrl}/storage/v1/object/public/gallery/${encodedPath}`;
      }
      return '/gallery-placeholder.webp';
    }
    
    // Utiliser notre API de transformation d'images
    const params = new URLSearchParams();
    params.set('path', filePath);
    
    if (size === 'thumb') {
      // Vignettes : qualité moyenne pour chargement rapide
      params.set('width', '400');
      params.set('height', '400');
      params.set('quality', '80');
    } else if (size === 'medium') {
      // Albums : bonne qualité
      params.set('width', '1200');
      params.set('height', '800');
      params.set('quality', '85');
    } else {
      // Grande taille : qualité élevée
      params.set('width', '1920');
      params.set('height', '1080');
      params.set('quality', '90');
    }

    return `/api/image?${params.toString()}`;
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-brand-charcoal/50 ${className}`}>
        <div className="text-gray-400 text-sm">Image non disponible</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-brand-charcoal/50 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={getImageUrl(filePath, size)}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onClick={onClick}
        onError={handleError}
        onLoad={handleLoad}
        loading={priority ? 'eager' : 'lazy'}
        sizes={
          size === 'thumb' 
            ? '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw'
            : size === 'medium'
            ? '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
            : '(max-width: 768px) 100vw, 100vw'
        }
      />
    </div>
  );
}
