import Image from "next/image";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";

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
    <section className="py-20 px-6 relative">
      <div className="max-w-7xl mx-auto relative z-10">

        <h2 className="text-3xl md:text-5xl font-bold text-left mb-16 tracking-tight text-white">
          Les <span className="text-brand-orange">incontournables</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {resources.map((resource, index) => (
            <div key={index} className="glass-panel p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group">

              {/* Image */}
              <div className="w-full h-48 rounded-xl overflow-hidden mb-6 relative">
                <Image
                  src={resource.image}
                  alt={resource.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Link */}
              <Link
                href={resource.link}
                className="flex items-center gap-2 uppercase text-xs font-bold tracking-wider text-brand-orange hover:text-white mb-3 transition-colors"
                target="_blank"
              >
                Découvrir
                <FaExternalLinkAlt size={12} />
              </Link>

              {/* Description */}
              <p className="text-gray-300 text-sm font-medium leading-relaxed group-hover:text-white transition-colors">
                {resource.title}
              </p>

            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-white/10 mt-24"></div>
      </div>
    </section>
  );
}
