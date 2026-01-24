// Redirection vers la page gallery principale
import { redirect } from 'next/navigation';

export default function GaleriePage() {
  redirect('/gallery');
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