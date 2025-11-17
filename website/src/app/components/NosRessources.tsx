import Image from 'next/image';
import Link from 'next/link';

export default function NosRessources() {
  return (
    <section className="relative bg-hero-gradient-dark text-white pt-20 pb-24 md:pt-28 md:pb-40">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Texte à gauche */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-glow-green tracking-tight leading-tight">
            Entrez dans le terrier du lapin
          </h2>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            Découvrez ci-dessous une sélection de ressources permettant de comprendre Bitcoin.
            Vous y trouverez notamment :
          </p>

          <ul className="space-y-3 list-disc list-inside text-gray-300 text-base sm:text-lg">
            <li>Les replays de nos meet-ups ;</li>
            <li>Les conférences de la communauté ;</li>
            <li>Des outils indispensables à l’apprentissage de Bitcoin.</li>
          </ul>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            Ces contenus vous permettront d’avancer dans votre aventure Bitcoin.
            Et si vous avez besoin d’un guide, nous serons là pour vous aider.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link 
              href="#" 
              className="btn-primary-orange px-6 py-3 rounded-lg font-semibold text-black hover:text-[var(--bitcoin-orange)] hover:bg-black text-center transition-all duration-300 text-sm sm:text-base"
            >
              NOTRE CHAÎNE YOUTUBE
            </Link>

            <Link
              href="/CommunityRegle"
              className="btn-secondary-green-outline px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 text-sm sm:text-base"
            >
              ENTRER EN CONTACT
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative h-64 sm:h-80 md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden order-1 lg:order-2">
          <Image
            src="/wallet.jpg"
            alt="Présentation Bitcoin"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-0 w-full bg-black/70 p-3">
            <p className="text-sm text-gray-300 italic text-center sm:text-left">
              Présentation sur la sécurité des hardware wallets – le 03/04/2024.
            </p>
          </div>
        </div>

      </div>

      {/* ✅ Barre placée *sous* la grille = toujours en bas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-[2px] sm:h-[3px] bg-white opacity-30 mt-12"></div>
      </div>

    </section>
  );
}
