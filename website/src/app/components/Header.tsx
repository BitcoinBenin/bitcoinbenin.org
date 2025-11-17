'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { NAV_LINKS, SOCIAL_LINKS } from '../data';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fermer le menu mobile quand la taille de l'écran change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fermer le menu mobile quand on clique sur un lien
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 left-0 w-full z-30 text-white bg-hero-gradient-dark shadow-md">
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between p-4 md:p-6" role="navigation" aria-label="Navigation principale">
        <Link href="/" className="flex items-center z-50">
          <Image 
            src="/logo.svg" 
            alt="Bitcoin Benin Logo"
            width={180} 
            height={40} 
            className="h-10 w-auto"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 uppercase font-bold tracking-widest text-sm">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Social Links (visible on desktop) */}
        <div className="hidden md:flex gap-4 text-lg">
          {SOCIAL_LINKS.map((link, index) => (
            <a 
              key={index} 
              href={link.href} 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full p-1"
              aria-label={`Suivez-nous sur ${link.icon.name || 'réseau social'}`}
            >
              <link.icon />
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-50">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-2xl focus:outline-none focus:ring-2 focus:ring-green-500 rounded p-1"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-hero-gradient-dark flex flex-col items-center justify-center gap-10"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
          >
            <div className="flex flex-col items-center gap-8 uppercase font-bold tracking-widest text-lg">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-4 py-2"
                  onClick={closeMenu}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex gap-6 text-2xl mt-8">
              {SOCIAL_LINKS.map((link, index) => (
                <a 
                  key={index} 
                  href={link.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full p-2"
                  onClick={closeMenu}
                  aria-label={`Suivez-nous sur ${link.icon.name || 'réseau social'}`}
                >
                  <link.icon />
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
