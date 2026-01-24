'use client';

import { useState, useEffect } from 'react';
import { supabase, Album, GalleryImage } from '@/lib/supabase';
import Link from 'next/link';
import { FaImages, FaCalendarAlt, FaPhotoVideo } from 'react-icons/fa';

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [recentImages, setRecentImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    fetchAlbumsAndImages();
  }, []);

  const fetchAlbumsAndImages = async () => {
    if (!supabase) return;
    
    try {
      // Récupérer les albums
      const { data: albumsData, error: albumsError } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      // Récupérer les images récentes pour la section "derniers ajouts"
      const { data: imagesData, error: imagesError } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (albumsError) {
        console.error('Erreur lors du chargement des albums:', albumsError);
      } else {
        setAlbums(albumsData || []);
      }

      if (imagesError) {
        console.error('Erreur lors du chargement des images:', imagesError);
      } else {
        setRecentImages(imagesData || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (filePath: string) => {
    if (!supabase) return '';
    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Chargement de la gallery...</div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Gallery en maintenance</h2>
          <p className="text-gray-400">La gallery sera bientôt disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
            Gallery
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-2">
              Bitcoin Bénin
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explorez les albums photos de nos événements, meetups et activités communautaires.
          </p>
        </div>

        {/* Derniers ajouts */}
        {recentImages.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FaPhotoVideo className="text-2xl text-brand-green" />
              <h2 className="text-2xl font-display font-bold text-white">Derniers ajouts</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-brand-charcoal/50 border border-white/5 hover:border-brand-green/30 transition-all duration-300"
                >
                  <img
                    src={getImageUrl(image.file_path)}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => {
                      console.error('Erreur chargement image:', getImageUrl(image.file_path));
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Albums */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <FaImages className="text-2xl text-brand-green" />
            <h2 className="text-2xl font-display font-bold text-white">Albums</h2>
          </div>

          {albums.length === 0 ? (
            <div className="text-center py-16">
              <FaImages className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold text-white mb-2">
                Aucun album pour le moment
              </h3>
              <p className="text-gray-400">
                Les albums photos seront bientôt disponibles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  href={`/gallery/album/${album.id}`}
                  className="group block bg-brand-charcoal/50 border border-white/5 rounded-xl overflow-hidden hover:border-brand-green/30 transition-all duration-300"
                >
                  <div className="relative aspect-video bg-brand-dark/50">
                    {album.cover_image ? (
                      <img
                        src={getImageUrl(album.cover_image || '')}
                        alt={album.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => {
                          console.error('Erreur chargement image:', getImageUrl(album.cover_image || ''));
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FaImages className="text-4xl text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-brand-green transition-colors">
                      {album.name}
                    </h3>
                    {album.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {album.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <FaCalendarAlt className="text-xs" />
                        {new Date(album.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-brand-green font-medium">
                        Voir les photos →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
