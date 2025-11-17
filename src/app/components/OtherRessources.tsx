import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

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
    <section className="bg-hero-gradient-dark text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* ✅ Titre aligné à gauche et orange Bitcoin */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-16 tracking-tight text-left"
          style={{ color: "" }}
        >
          Les ressources de la communauté
        </h2>

        {/* ✅ Grid des ressources */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">

          {ressources.map((item, index) => (
            <div key={index} className="flex flex-col items-center">

              {/* Image */}
              <div className="w-full h-56 bg-black/20 rounded-lg overflow-hidden mb-6">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* ✅ Découvrir + icône orange Bitcoin */}
              <Link
                href={item.link}
                className="flex items-center justify-center gap-2 uppercase text-sm font-bold tracking-wider"
                style={{ color: "#F7931A" }}
              >
                Découvrir
                <ExternalLink size={16} style={{ color: "#F7931A" }} />
              </Link>

              {/* Description */}
              <p className="text-gray-300 mt-3 text-sm sm:text-base font-medium">
                {item.title}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
