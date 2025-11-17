import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const resources = [
  {
    title: "Le guide ultime du bitcoiner, avec la plateforme gratuite PlanB.Network.",
    image: "/planb.png",
    link: "https://planb.academy/fr/learn-anytime"
  },
  {
    title: "Les formations, flyers et articles open-source de ProfEduStream.",
    image: "/formations.png",
    link: "https://profedustream.substack.com/t/se-former-a-bitcoin"
  },
  {
    title: "Les nombreux tutoriels vidéo et podcasts de Découvre Bitcoin.",
    image: "/lapin.png",
    link: "https://www.youtube.com/c/D%C3%A9couvreBitcoin/videos"
  },
  {
    title: "Le très complet blog pandulfi, tenu par Loïc Morel.",
    image: "/loice.jpg",
    link: "https://pandul.fr/"
  }
];

export default function Incontournables() {
  return (
    <section className="bg-[var(--background)] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ✅ Titre aligné à gauche */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-left mb-16 tracking-tight"
            style={{ color: "" }}>
          Les incontournables
        </h2>

        {/* ✅ Grille alignée comme l'autre composant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">

          {resources.map((resource, index) => (
            <div key={index} className="flex flex-col items-center">

              {/* ✅ Image */}
              <div className="w-full h-56 bg-black/20 rounded-lg overflow-hidden mb-4">
                <Image
                  src={resource.image}
                  alt={resource.title}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* ✅ “Découvrir” + icône orange Bitcoin */}
              <Link
                href={resource.link}
                className="flex items-center justify-center gap-2 uppercase text-sm font-bold tracking-wider"
                style={{ color: "#F7931A" }}
              >
                Découvrir
                <ExternalLink size={16} style={{ color: "#F7931A" }} />
              </Link>

              {/* ✅ Texte descriptif */}
              <p className="text-gray-300 mt-3 text-sm sm:text-base font-medium">
                {resource.title}
              </p>

            </div>
          ))}
        </div>

        {/* ✅ Ligne décorative */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-[2px] sm:h-[3px] bg-white opacity-30 mt-12"></div>
      </div>  
    </div>
    </section>
  );
}
