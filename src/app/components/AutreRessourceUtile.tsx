import Image from "next/image";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";

const autresRessources = [
  {
    image: "/mempool.jpg",
    title: "Explorateur de la chaîne de blocs Bitcoin.",
    link: "https://mempool.space"
  },
  {
    image: "/freedom.webp",
    title: "Replay des conférences nationales et internationales.",
    link: "https://planb.academy/fr/resources/conferences"
  },
  {
    image: "/liste.jpg",
    title: "Liste des podcasts Bitcoin, francophones et anglophones.",
    link: "https://planb.academy/fr/resources/conferences"
  },
  {
    image: "/dictionnaire.jpg",
    title: "Dictionnaire de Bitcoin, par Loïc Pandul.",
    link: "https://planb.academy/fr/resources/glossary"
  },
  {
    image: "/BTCmap.webp",
    title: "Carte des commerces acceptant Bitcoin dans le monde.",
    link: "https://btcmap.org/map#15/12.11209/-68.91119"
  },
  {
    image: "/carte.png",
    title: "Carte des communautés Bitcoin dans le monde.",
    link: "https://btcmap.org/map#15/12.11209/-68.91119"
  },
  {
    image: "/8543eb7d1ba409ca6f0030d7180e88cd237fc221-1200x630-1-uai-720x540.jpg",
    title: "Maison d’édition de livres Bitcoin Konsensus Network.",
    link: "https://bitcoinbook.shop/collections/french"
  },
];

export default function AutresRessourcesUtiles() {
  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto text-left relative z-10">

        <h2 className="text-3xl md:text-5xl font-bold mb-16 tracking-tight text-white">
          Autres Ressources <span className="text-brand-orange">Utiles</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {autresRessources.map((item, index) => (
            <div key={index} className="glass-panel p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group">

              {/* Image */}
              <div className="w-full h-48 rounded-xl overflow-hidden mb-6 relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Link */}
              <Link
                href={item.link}
                className="flex items-center gap-2 uppercase text-xs font-bold tracking-wider text-brand-orange hover:text-white mb-3 transition-colors"
                target="_blank"
              >
                Découvrir
                <FaExternalLinkAlt size={12} />
              </Link>

              {/* Description */}
              <p className="text-gray-300 text-sm font-medium leading-relaxed group-hover:text-white transition-colors">
                {item.title}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
