'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import Image from 'next/image';
import type { GalleryFolder, GalleryImage } from '@/lib/gallery';

// --- Icon Components ---
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Memoized Card Components for Performance ---

const FolderCard = memo(function FolderCard({ folder, onClick, isPriority }: { folder: GalleryFolder; onClick: () => void; isPriority: boolean }) {
  return (
    <div onClick={onClick} className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={folder.coverImage}
          alt={`Couverture de ${folder.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-110 transition-transform duration-500"
          priority={isPriority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-white">{folder.name}</h3>
        <p className="text-gray-400 text-sm mt-3">{folder.images.length} photo{folder.images.length > 1 ? 's' : ''}</p>
      </div>
    </div>
  );
});

const ImageCard = memo(function ImageCard({ image, onClick }: { image: GalleryImage; onClick: () => void }) {
  return (
    <div onClick={onClick} className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-white truncate">{image.title}</h3>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{image.description}</p>
      </div>
    </div>
  );
});

// --- Main Client Component ---

export default function GalleryClient({ initialData }: { initialData: GalleryFolder[] }) {
  const [galleryData] = useState<GalleryFolder[]>(initialData);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const openFolder = useCallback((folderId: string) => setSelectedFolderId(folderId), []);
  const openImage = useCallback((imageId: string) => setSelectedImageId(imageId), []);
  const closeFolder = useCallback(() => setSelectedFolderId(null), []);
  const closeImage = useCallback(() => setSelectedImageId(null), []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (!selectedImageId || !selectedFolderId) return;
    
    const folder = galleryData.find(f => f.id === selectedFolderId);
    if (!folder || folder.images.length < 2) return;
    
    const currentIndex = folder.images.findIndex(img => img.id === selectedImageId);
    const newIndex = direction === 'prev'
      ? (currentIndex - 1 + folder.images.length) % folder.images.length
      : (currentIndex + 1) % folder.images.length;
    
    setSelectedImageId(folder.images[newIndex].id);
  }, [selectedImageId, selectedFolderId, galleryData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') navigateImage('next');
      else if (event.key === 'ArrowLeft') navigateImage('prev');
      else if (event.key === 'Escape') closeImage();
    };

    if (selectedImageId) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageId, navigateImage, closeImage]);



  const selectedFolder = galleryData.find(f => f.id === selectedFolderId);
  const selectedImage = selectedFolder?.images.find(img => img.id === selectedImageId);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-green-400 sm:text-5xl lg:text-6xl">Galerie Bitcoin Bénin</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">Découvrez nos moments forts, événements et rencontres communautaires</p>
        </div>

        {!selectedFolder ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryData.map((folder, index) => (
              <FolderCard key={folder.id} folder={folder} onClick={() => openFolder(folder.id)} isPriority={index < 3} />
            ))}
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-8">
              <button onClick={closeFolder} className="flex items-center text-green-400 hover:text-green-300 font-medium">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Retour aux dossiers
              </button>
              <h2 className="text-3xl font-bold text-green-400 ml-6">{selectedFolder.name}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedFolder.images.map((image) => (
                <ImageCard key={image.id} image={image} onClick={() => openImage(image.id)} />
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4" onClick={closeImage}>
          <div className="relative max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeImage} className="absolute -top-12 right-0 text-white hover:text-green-400 z-10" aria-label="Fermer">
              <CloseIcon className="w-8 h-8" />
            </button>
            <button onClick={() => navigateImage('prev')} className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-green-400 z-10 bg-black/30 rounded-full w-12 h-12 flex items-center justify-center" aria-label="Image précédente">
              <ArrowLeftIcon className="w-8 h-8" />
            </button>
            <button onClick={() => navigateImage('next')} className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-green-400 z-10 bg-black/30 rounded-full w-12 h-12 flex items-center justify-center" aria-label="Image suivante">
              <ArrowLeftIcon className="w-8 h-8 rotate-180" />
            </button>
            
            <div className="relative aspect-auto text-center">
              {/* Image principale visible */}
              <Image
                key={selectedImage.id}
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                className="rounded-lg max-h-[80vh] animate-fade-in"
                priority
              />
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-white">{selectedImage.title}</h3>
                <p className="text-gray-300 mt-2 max-w-2xl mx-auto">{selectedImage.description}</p>
              </div>
            </div>

            {/* Pré-chargement des images adjacentes */}
            {(() => {
              if (!selectedFolder || selectedFolder.images.length <= 1) return null;
              const currentIndex = selectedFolder.images.findIndex(img => img.id === selectedImage.id);
              const nextIndex = (currentIndex + 1) % selectedFolder.images.length;
              const prevIndex = (currentIndex - 1 + selectedFolder.images.length) % selectedFolder.images.length;
              const nextImage = selectedFolder.images[nextIndex];
              const prevImage = selectedFolder.images[prevIndex];

              return (
                <>
                  <Image
                    src={nextImage.src}
                    alt={nextImage.alt}
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                    style={{ display: 'none' }}
                    priority
                  />
                  <Image
                    src={prevImage.src}
                    alt={prevImage.alt}
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                    style={{ display: 'none' }}
                    priority
                  />
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}