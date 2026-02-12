'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaArrowUp } from 'react-icons/fa';
import { SOCIAL_LINKS } from '../data';

const Footer = () => {
  return (
    <footer className="bg-brand-dark py-12 px-4 sm:px-6 relative z-10">
      {/* Container: Rounded & Darker */}
      <div className="max-w-[1400px] mx-auto bg-[#0a0f1e] rounded-[40px] border border-white/5 p-10 md:p-16 relative overflow-hidden">

        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-24 relative z-10">

          {/* Brand Column (Left) - Span 4 */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-40">
                <Image
                  src="/logo.svg"
                  alt="Bitcoin Benin"
                  fill
                  className="object-contain" // Preserving original colors
                />
              </div>
            </Link>

            <div className="flex gap-4">
              {SOCIAL_LINKS.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="text-gray-400 hover:text-brand-orange transition-colors"
                >
                  <link.icon size={22} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns (Right) - Span 8 */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
              <h3 className="text-white font-medium">Communauté</h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="/communaute" className="text-sm text-gray-400 hover:text-brand-orange transition-colors">À propos</Link></li>
                <li><Link href="/events" className="text-sm text-gray-400 hover:text-brand-orange transition-colors">Évènements</Link></li>
                <li><a href="https://t.me/+vUzohmB0EFMzZTI8" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-brand-orange transition-colors">Rejoindre</a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-6">
              <h3 className="text-white font-medium">Ressources</h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="/NosRessources" className="text-sm text-gray-400 hover:text-brand-orange transition-colors">Comprendre Bitcoin</Link></li>
                <li><Link href="/galerie" className="text-sm text-gray-400 hover:text-brand-orange transition-colors">Galerie Photos</Link></li>
                <li><Link href="/accepter-bitcoin" className="text-sm text-gray-400 hover:text-brand-orange transition-colors">Business</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6">
              <h3 className="text-white font-medium">Légal</h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="/nous-soutenir" className="text-sm text-gray-400 hover:text-brand-orange transition-colors">Faire un don</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-400 hover:text-brand-orange transition-colors">Contact</Link></li>
                <li><span className="text-sm text-gray-400 cursor-not-allowed">Mentions Légales</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} Bitcoin Benin. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Retour en haut <FaArrowUp />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;