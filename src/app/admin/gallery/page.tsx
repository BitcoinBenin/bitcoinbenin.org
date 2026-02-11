'use client';

import { useState, useEffect } from 'react';
import { supabase, Album, GalleryImage } from '@/lib/supabase';
import { createAlbum as createAlbumAction, deleteAlbum as deleteAlbumAction, updateAlbumCover, setFirstImageAsCover } from '../actions';
import ImageUploadWithActions from '@/app/components/ImageUploadWithActions';
import ImageGalleryWithActions from '@/app/components/ImageGalleryWithActions';
import Button from '@/app/components/ui/Button';
import { FaPlus, FaTrash, FaImages, FaImage, FaStar } from 'react-icons/fa';

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [albumImages, setAlbumImages] = useState<GalleryImage[]>([]);
  const [showNewAlbumForm, setShowNewAlbumForm] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des albums:', error);
      } else {
        setAlbums(data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbumImages = async (albumId: string) => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('album_id', albumId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des images:', error);
      } else {
        setAlbumImages(data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const createAlbum = async () => {
    if (!newAlbum.name.trim()) {
      console.error('Le nom de l\'album est vide');
      return;
    }

    try {
      const data = await createAlbumAction(newAlbum.name, newAlbum.description);
      console.log('Album créé avec succès:', data);
      setAlbums([data, ...albums]);
      setNewAlbum({ name: '', description: '' });
      setShowNewAlbumForm(false);
    } catch (error) {
      console.error('Erreur lors de la création de l\'album:', error);
    }
  };

  const deleteAlbum = async (albumId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet album et toutes ses photos ?')) return;

    try {
      await deleteAlbumAction(albumId);
      setAlbums(albums.filter(a => a.id !== albumId));
      if (selectedAlbum === albumId) {
        setSelectedAlbum(null);
        setAlbumImages([]);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'album:', error);
    }
  };

  const handleAlbumSelect = (albumId: string) => {
    if (selectedAlbum === albumId) {
      setSelectedAlbum(null);
      setAlbumImages([]);
    } else {
      setSelectedAlbum(albumId);
      fetchAlbumImages(albumId);
    }
  };

  const handleImageUpload = (newImages: GalleryImage[]) => {
    if (selectedAlbum) {
      setAlbumImages([...newImages, ...albumImages]);
    }
  };

  const handleImageDelete = (imageId: string) => {
    setAlbumImages(albumImages.filter(img => img.id !== imageId));
  };

  const setAsCover = async (imagePath: string) => {
    if (!selectedAlbum) return;

    try {
      const updatedAlbum = await updateAlbumCover(selectedAlbum, imagePath);
      setAlbums(albums.map(album => 
        album.id === selectedAlbum ? updatedAlbum : album
      ));
      console.log('Photo de couverture mise à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la couverture:', error);
    }
  };

  const handleSetFirstImageAsCover = async () => {
    if (!selectedAlbum || albumImages.length === 0) return;

    try {
      const updatedAlbum = await setFirstImageAsCover(selectedAlbum);
      setAlbums(albums.map(album => 
        album.id === selectedAlbum ? updatedAlbum : album
      ));
      console.log('Première photo définie comme couverture avec succès');
    } catch (error) {
      console.error('Erreur lors de la définition de la première photo comme couverture:', error);
    }
  };

  const isCoverImage = (imagePath: string) => {
    if (!selectedAlbum) return false;
    const album = albums.find(a => a.id === selectedAlbum);
    return album?.cover_image === imagePath;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Configuration requise</h2>
          <p className="text-gray-400">Veuillez configurer Supabase pour accéder à l&apos;administration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
            Administration
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent ml-2">
              Gallery
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Gérez les albums et les photos de la communauté Bitcoin Bénin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des albums */}
          <div className="lg:col-span-1">
            <div className="bg-brand-charcoal/50 border border-white/5 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  <FaImages />
                  Albums
                </h2>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowNewAlbumForm(!showNewAlbumForm)}
                  className="flex items-center gap-2"
                >
                  <FaPlus />
                  Nouveau
                </Button>
              </div>

              {/* Formulaire nouvel album */}
              {showNewAlbumForm && (
                <div className="mb-6 p-4 bg-white/5 rounded-lg">
                  <input
                    type="text"
                    placeholder="Nom de l'album"
                    value={newAlbum.name}
                    onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })}
                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-2 text-white mb-3 focus:outline-none focus:border-brand-green"
                  />
                  <textarea
                    placeholder="Description (optionnel)"
                    value={newAlbum.description}
                    onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                    className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-2 text-white mb-3 focus:outline-none focus:border-brand-green resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={createAlbum}
                      disabled={!newAlbum.name.trim()}
                    >
                      Créer
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowNewAlbumForm(false);
                        setNewAlbum({ name: '', description: '' });
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}

              {/* Liste des albums */}
              <div className="space-y-2">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedAlbum === album.id
                        ? 'bg-brand-green/20 border-brand-green'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => handleAlbumSelect(album.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-bold text-white">{album.name}</h3>
                          {album.cover_image && (
                            <div className="bg-brand-green/20 text-brand-green text-xs px-2 py-1 rounded-full flex items-center gap-1">
                              <FaStar className="text-xs" />
                              Couverture
                            </div>
                          )}
                        </div>
                        {album.description && (
                          <p className="text-sm text-gray-400 line-clamp-1">{album.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAlbum(album.id);
                          }}
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          <FaTrash size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Zone de gestion des images */}
          <div className="lg:col-span-2">
            {selectedAlbum ? (
              <div className="bg-brand-charcoal/50 border border-white/5 rounded-xl p-6">
                <h2 className="text-xl font-display font-bold text-white mb-6">
                  {albums.find(a => a.id === selectedAlbum)?.name}
                </h2>

                {/* Upload d'images */}
                <div className="mb-8">
                  <ImageUploadWithActions 
                    onUploadComplete={handleImageUpload}
                    albumId={selectedAlbum}
                  />
                </div>

                {/* Gallery d'images */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-display font-bold text-white">Photos de l&apos;album</h3>
                    {albumImages.length > 0 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleSetFirstImageAsCover}
                        className="flex items-center gap-2"
                      >
                        <FaImage />
                        Première photo comme couverture
                      </Button>
                    )}
                  </div>
                  
                  <ImageGalleryWithActions
                    images={albumImages}
                    onImageDelete={handleImageDelete}
                    editable={true}
                    onSetAsCover={setAsCover}
                    isCoverImage={isCoverImage}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-brand-charcoal/50 border border-white/5 rounded-xl p-12 text-center">
                <FaImages className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  Sélectionnez un album
                </h3>
                <p className="text-gray-400">
                  Choisissez un album à gauche pour voir et gérer ses photos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
