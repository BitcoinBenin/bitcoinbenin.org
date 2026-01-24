import Image from "next/image";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";

const ressources = [
  {
    image: "/ressource1.jpg",
    title: "Se former à Bitcoin en 10 vidéos.",
    link: "https://profedustream.substack.com/t/se-former-a-bitcoin"
  },
  {
    image: "/ressource2.jpg",
    title: "Replay des présentations et conférences de la communauté.",
    link: "https://www.youtube.com/@BitcoinLille"
  },
  {
    image: "/ressource3.jpg",
    title: "Comment créer une communauté ou un meet-up Bitcoin ?",
    link: "https://www.youtube.com/@BitcoinLille"
  },
  {
    image: "/ressource4.jpg",
    title: "Comment créer une communauté Bitcoin ?",
    link: "https://www.youtube.com/watch?v=RI4AevL7YaY"
  },
];

export default function RessourcesCommunaute() {
  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto relative z-10">

        <h2 className="text-3xl md:text-5xl font-bold mb-16 tracking-tight text-white">
          Les ressources de la <span className="text-brand-orange">communauté</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {ressources.map((item, index) => (
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
