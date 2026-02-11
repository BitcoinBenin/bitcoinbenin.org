'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { supabase, GalleryImage, Album } from '@/lib/supabase';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaDownload, FaExpand } from 'react-icons/fa';
import ImageLightbox from '@/app/components/ImageLightbox';
import Image from 'next/image';

interface AlbumPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AlbumPage({ params }: AlbumPageProps) {
  const { id } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const fetchAlbumAndImages = useCallback(async () => {
    if (!supabase) return;
    
    try {
      // Récupérer les informations de l'album
      const { data: albumData, error: albumError } = await supabase
        .from('albums')
        .select('*')
        .eq('id', id)
        .single();

      // Récupérer les images de l'album
      const { data: imagesData, error: imagesError } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('album_id', id)
        .order('created_at', { ascending: false });

      if (albumError) {
        console.error('Erreur lors du chargement de l\'album:', albumError);
      } else {
        setAlbum(albumData);
      }

      if (imagesError) {
        console.error('Erreur lors du chargement des images:', imagesError);
      } else {
        setImages(imagesData || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    fetchAlbumAndImages();
  }, [fetchAlbumAndImages]);

  const getImageUrl = (filePath: string) => {
    if (!supabase) return '/gallery-placeholder.webp';
    try {
      const { data } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Erreur URL Supabase:', error);
      return '/gallery-placeholder.webp';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Chargement de l&apos;album...</div>
      </div>
    );
  }

  if (!supabase || !album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Album introuvable</h2>
          <Link href="/gallery" className="text-brand-green hover:text-brand-accent transition-colors">
            ← Retour à la gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-56">
        {/* Header avec retour */}
        <div className="mb-8">
          <Link 
            href="/gallery"
            className="inline-flex items-center gap-2 text-brand-green hover:text-brand-accent transition-colors mb-6"
          >
            <FaArrowLeft />
            Retour à la gallery
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-4">
              {album.name}
            </h1>
            {album.description && (
              <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-4">
                {album.description}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                {new Date(album.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div className="text-brand-green font-medium">
                {images.length} photo{images.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Grid d'images */}
        {images.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">
              Aucune photo dans cet album
            </h3>
            <p className="text-gray-400">
              Les photos seront bientôt ajoutées à cet album.
            </p>
          </div>
        ) : (
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
                  onClick={() => setSelectedImage(image)}
                  onError={(e) => {
                    console.error('Erreur chargement image:', getImageUrl(image.file_path));
                    // Fallback vers une image par défaut
                    e.currentTarget.src = '/gallery-placeholder.webp';
                    e.currentTarget.onerror = null; // Éviter la boucle infinie
                  }}
                  onLoad={() => {
                    // S'assurer que l'image se charge correctement
                    console.log('Image chargée:', getImageUrl(image.file_path));
                  }}
                />
                
                {/* Texte de fallback si l'image ne se charge toujours pas */}
                <div className="absolute inset-0 flex items-center justify-center bg-brand-charcoal/80 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center p-4">
                    <div className="text-brand-green font-bold text-lg mb-2">
                      {image.title || album?.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Photo non disponible
                    </div>
                  </div>
                </div>
                
                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setSelectedImage(image)}
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
        )}
        
        {/* Lightbox */}
        <ImageLightbox
          images={images}
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
          initialIndex={images.findIndex(img => img.id === selectedImage?.id)}
        />
      </div>
    </div>
  );
}