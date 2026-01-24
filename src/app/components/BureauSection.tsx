"use client";
import Image from "next/image";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { motion, easeOut } from 'framer-motion';

const membres = [
  { nom: "Alphonse Mehounme", image: "/alphonse.jpg", linkedin: "https://www.linkedin.com/in/alphonsemehounme?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", twitter: "https://x.com/mehounme" },
  { nom: "Loïc Kassa", image: "/loic.jpg", linkedin: "https://www.linkedin.com/in/loickassa/", twitter: "https://x.com/Loicbtc", facebook: "https://www.facebook.com/loicbtc" },
  { nom: "Samadou Salahou", image: "/samade.jpg", linkedin: "#", twitter: "https://x.com/samadousalahou", facebook: "https://www.facebook.com/Samadousalahou" },
  { nom: "Abdoul Ouadoud", image: "/speaker17.3ac5cb2e.svg", linkedin: "", twitter: "https://bento.me/abdoul-ouadoud", facebook: "https://www.facebook.com/abdoulouadoud.bouraima" },
  { nom: "Ramane Boda", image: "/raman.jpg", linkedin: "https://www.linkedin.com/in/abdoul-rahamane-boda-78b829209?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", twitter: "https://x.com/Ramane_Boda?t=A6iRSZcqFvEpW1dAH2yryg&s=09", facebook: "https://www.facebook.com/Ramane.boda" },
  { nom: "Wilfried Sotodji", image: "/will.jpeg", linkedin: "https://www.linkedin.com/in/wilfried-sotodji-42556a217?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", twitter: "https://x.com/willy_btc", facebook: "https://www.facebook.com/MarxWilfriedS" },
  { nom: "Abdias Olaniran Afouda", image: "/abdias.svg", linkedin: "https://www.linkedin.com/in/abdias-afouda-06461022a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", twitter: "x.com/heyolaniran", facebook: "https://www.facebook.com/laurentAb143" },
  { nom: "Joseph QUAYE", image: "/jo.jpeg", linkedin: "https://www.linkedin.com/in/joseph-quaye-1170041b1/", twitter: "https://x.com/Jobitcoiner", facebook: "https://www.facebook.com/" },
  { nom: "Marshal Dekon", image: "/marshal.jpeg", twitter: "https://x.com/MarshalOS_btc?t=__NZ_IVISa6wpzhAk1-Ftg&s=09", facebook: "https://www.facebook.com/romeo.ken.9659?mibextid=rS40aB7S9Ucbxw6v" },
  { nom: "Béni-Christ Edaye Dokoui", image: "/beni.jpg", linkedin: "https://www.linkedin.com/in/mahougnon-b%C3%A9ni-christ-edaye-dokoui-254131336/", twitter: "https://x.com/BenedBTC", facebook: "https://www.facebook.com/beni.christ.edaye.dokoui.2025" },
  { nom: "Carlos Adimou", image: "/carlos.jpeg", linkedin: "https://www.linkedin.com/in/carlos-adimou?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", twitter: "https://x.com/CarlAdm04?t=ElCMdZbrohO16J6UzWS13w&s=09" },
  { nom: "Geoffroy Acakpo", image: "/geo.jpg", linkedin: "https://www.linkedin.com/in/g%C3%A9offroy-acakpo-a12a77252?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", twitter: "https://x.com/iamgeoffroy", facebook: "https://www.facebook.com/share/1DKDaaJsR2/" },
];

export default function TeamSection() {

  const sectionVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeOut } },
  };

  return (
    <motion.section
      className="relative py-24 px-4 sm:px-6 flex flex-col items-center overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >

      {/* ✅ Titre Section */}
      <motion.div
        className="max-w-7xl mx-auto w-full mb-16"
        variants={titleVariants}
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center">
          L&apos;équipe derrière <br />
          <span className="text-brand-orange">Bitcoin Bénin</span>
        </h2>
      </motion.div>

      {/*  Grille des membres */}
      <motion.ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full"
        variants={gridVariants}
      >
        {membres.map((membre, index) => (
          <motion.li
            key={index}
            className="group glass-panel rounded-2xl overflow-hidden border border-white/5 hover:bg-white/5 transition-all duration-300 hover:-translate-y-2"
            variants={cardVariants}
          >
            {/* Image */}
            <div className="relative w-full h-72 overflow-hidden">
              <Image
                src={membre.image}
                alt={membre.nom}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority={index < 4}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80"></div>

              {/* Liens sur l'image */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                {membre.twitter && <a
                  href={membre.twitter}
                  className="p-2 rounded-full bg-black/50 hover:bg-brand-orange text-white transition-colors"
                  target="_blank" rel="noopener noreferrer"
                >
                  <FaTwitter size={18} />
                </a>}
                {membre.linkedin && <a
                  href={membre.linkedin}
                  className="p-2 rounded-full bg-black/50 hover:bg-brand-orange text-white transition-colors"
                  target="_blank" rel="noopener noreferrer"
                >
                  <FaLinkedin size={18} />
                </a>}
                {membre.facebook && <a
                  href={membre.facebook}
                  className="p-2 rounded-full bg-black/50 hover:bg-brand-orange text-white transition-colors"
                  target="_blank" rel="noopener noreferrer"
                >
                  <FaFacebook size={18} />
                </a>}
              </div>
            </div>

            {/* Texte */}
            <div className="p-4 text-center">
              <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-brand-orange transition-colors duration-300">
                {membre.nom}
              </h3>
            </div>
          </motion.li>
        ))}
      </motion.ul>

      {/*  Barre blanche */}
      <div className="w-full max-w-7xl h-px bg-white/10 mt-24"></div>

    </motion.section>
  );
}