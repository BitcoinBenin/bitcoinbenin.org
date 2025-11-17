import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
    <section className="bg-anthracite text-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">

        {/* ✅ Titre centré */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-16 tracking-tight text-left"
          style={{ color: "" }}
        >
         Autes Ressources Utiles
        </h2>

        {/* ✅ Grid des ressources */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {autresRessources.map((item, index) => (
            <div key={index} className="flex flex-col items-center">

              {/* Image plus grande */}
              <div className="w-full h-60 rounded-lg overflow-hidden mb-6 bg-black/25">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={450}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* ✅ Bouton “DÉCOUVRIR” orange + icône */}
              <Link
                href={item.link}
                className="flex items-center justify-center gap-2 uppercase text-sm font-bold mb-3"
                style={{ color: "#F7931A" }}
              >
                Découvrir
                <ExternalLink size={16} />
              </Link>

              {/* ✅ Texte descriptif centré */}
              <p className="text-gray-300 text-base font-medium">
                {item.title}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
