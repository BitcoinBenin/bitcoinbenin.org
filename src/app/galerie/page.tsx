import { getGalleryData } from '@/lib/gallery';
import GalleryClient from './GalleryClient';
import { Suspense } from 'react';

// Cette page est maintenant un Server Component, elle s'exécute côté serveur.
export default async function GaleriePage() {
  // 1. Récupère les données directement sur le serveur au moment de la construction ou de la requête.
  const galleryData = await getGalleryData();

  // 2. Passe les données pré-chargées au composant client, qui gérera l'interactivité.
  return (
    <Suspense fallback={<LoadingState />}>
      <GalleryClient initialData={galleryData} />
    </Suspense>
  );
}

// Un composant simple pour l'état de chargement, utilisé par Suspense.
function LoadingState() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 animate-pulse">
          Chargement de la galerie...
        </h2>
        <p className="text-gray-400 mt-2">Veuillez patienter.</p>
      </div>
    </div>
  );
}