import Image from 'next/image';
import Link from 'next/link';

export default function NosRessources() {
  return (
    <section className="relative pt-20 pb-24 md:pt-28 md:pb-40 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">

        {/* Texte à gauche */}
        <div className="flex flex-col gap-8 order-2 lg:order-1">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Entrez dans le <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-accent">terrier du lapin</span>
          </h1>

          <p className="text-lg text-gray-400 leading-relaxed">
            Découvrez ci-dessous une sélection de ressources permettant de comprendre Bitcoin.
            Vous y trouverez notamment :
          </p>

          <ul className="space-y-4 list-disc list-inside text-gray-300 text-lg">
            <li>Les replays de nos meet-ups</li>
            <li>Les conférences de la communauté</li>
            <li>Des outils indispensables à l’apprentissage de Bitcoin</li>
          </ul>

          <p className="text-lg text-gray-400 leading-relaxed">
            Ces contenus vous permettront d’avancer dans votre aventure Bitcoin.
            Et si vous avez besoin d’un guide, nous serons là pour vous aider.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a
              href="#"
              className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-brand-orange to-brand-accent shadow-glow hover:shadow-glow-hover hover:scale-105 transition-all duration-300 text-center"
            >
              NOTRE CHAÎNE YOUTUBE
            </a>

            <Link
              href="/CommunityRegle"
              className="px-8 py-4 rounded-full font-bold text-white border border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand-orange/50 transition-all duration-300 text-center"
            >
              ENTRER EN CONTACT
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative h-64 sm:h-80 md:h-[500px] rounded-3xl overflow-hidden order-1 lg:order-2 border border-white/5 shadow-2xl group">
          <Image
            src="/wallet.jpg"
            alt="Présentation Bitcoin"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-90"></div>
          <div className="absolute bottom-0 w-full p-6">
            <p className="text-sm text-gray-300 italic text-center sm:text-left">
              Présentation sur la sécurité des hardware wallets – le 03/04/2024.
            </p>
          </div>
        </div>

      </div>

      {/* Separator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="w-full h-px bg-white/10"></div>
      </div>

    </section>
  );
}
