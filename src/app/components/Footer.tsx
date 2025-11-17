'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaChevronUp } from 'react-icons/fa';
import { SOCIAL_LINKS } from '../data';

export default function Footer() {
  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-hero-gradient-dark text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt="Bitcoin Benin Logo"
              width={180} 
              height={40} 
              className="h-10 w-auto"
            />
          </Link>
          <p className="text-sm text-gray-400 hidden md:block">
             {new Date().getFullYear()} Bitcoin Benin.
          </p>
          <div className="flex gap-6 text-2xl">
            {SOCIAL_LINKS.map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full p-1"
                aria-label={`Suivez-nous sur ${link.icon.name || 'réseau social'}`}
              >
                <link.icon />
              </a>
            ))}
            <button 
            onClick={scrollToTop}
            className="flex justify-items-center gap-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-950 rounded-full px-4 py-2"
            aria-label="Retour en haut de la page"
          >
            <FaChevronUp />

          </button>
          </div>
        </div>
        {/* Copyright text for mobile screens */}
        <p className="text-sm text-gray-400 text-center mt-4 md:hidden">
           {new Date().getFullYear()} Bitcoin Benin.
        </p>
      </div>
    </footer>
  );
}