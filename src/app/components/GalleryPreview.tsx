'use client';

import { useState, useEffect } from 'react';
import { supabase, GalleryImage } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import Button from './ui/Button';
import { FaImages, FaArrowRight } from 'react-icons/fa';

export default function GalleryPreview() {
  const [recentImages, setRecentImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState(false);

  useEffect(() => {
    // Vérifier si Supabase est configuré
    if (!supabase) {
      setSupabaseError(true);
      setLoading(false);
      return;
    }
    fetchRecentImages();
  }, []);

  const fetchRecentImages = async () => {
    try {
      const { data, error } = await supabase!
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Erreur lors du chargement des images:', error);
        setSupabaseError(true);
      } else {
        setRecentImages(data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setSupabaseError(true);
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
      <section className="py-20 bg-brand-charcoal/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-white">Chargement de la gallery...</div>
          </div>
        </div>
      </section>
    );
  }

  if (supabaseError || recentImages.length === 0) {
    return null; // Ne pas afficher la section si Supabase n'est pas configuré ou s'il n'y a pas d'images
  }

  return (
    <section className="py-20 bg-brand-charcoal/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaImages className="text-3xl text-brand-green" />
            <h2 className="text-3xl md:text-4xl font-display font-black text-white">
              Gallery
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-2">
                Photos
              </span>
            </h2>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Découvrez les moments forts de notre communauté Bitcoin Bénin à travers nos photos d&apos;événements et meetups.
          </p>
          <Link href="/gallery">
            <Button variant="primary" size="lg" className="inline-flex items-center gap-2">
              Voir toute la gallery
              <FaArrowRight />
            </Button>
          </Link>
        </div>

        {/* Grid d'images récentes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {recentImages.slice(0, 6).map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-brand-dark/50 border border-white/5 hover:border-brand-green/30 transition-all duration-300"
            >
              <Image
                src={getImageUrl(image.file_path)}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium truncate">{image.title}</p>
                  {image.event_date && (
                    <p className="text-brand-green text-xs">
                      {new Date(image.event_date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton voir plus */}
        <div className="text-center">
          <Link href="/gallery">
            <Button variant="outline" size="lg" className="inline-flex items-center gap-2">
              Explorer toutes les photos
              <FaArrowRight className="text-sm" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
