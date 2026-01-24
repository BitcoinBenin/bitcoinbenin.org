'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { NAV_LINKS, SOCIAL_LINKS } from '../data';
import { FaBars, FaTimes } from 'react-icons/fa';
import Button from './ui/Button';
import TopBanner from './TopBanner';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out w-full max-w-5xl px-4 ${isScrolled ? 'top-6' : 'top-8 lg:top-12'
        }`}
    >
      <div className={`
        relative flex items-center justify-between px-2 py-2 md:px-6 md:py-3 rounded-full 
        transition-all duration-300
        ${isScrolled
          ? 'bg-brand-charcoal/80 backdrop-blur-xl border border-white/10 shadow-glass w-full'
          : 'bg-brand-charcoal/40 backdrop-blur-md border border-white/5 shadow-lg w-full'
        }
      `}>

        <Link href="/" className="relative z-50 pl-2">
          <div className="relative h-8 w-32 md:h-9 md:w-36">
            <Image
              src="/logo.svg"
              alt="Bitcoin Benin"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-medium text-gray-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 transition-all"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center pl-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.open('https://t.me/+vUzohmB0EFMzZTI8', '_blank')}
            className="!rounded-full px-6 text-xs"
          >
            Rejoindre
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2 hover:text-brand-green transition-colors pr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* TopBanner Positioned Below Navbar */}
      <div className="flex justify-center mt-3 relative z-40">
        <TopBanner />
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-brand-dark/95 backdrop-blur-2xl z-[-1] flex flex-col items-center justify-center gap-8 transition-all duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        style={{ top: '-100px', height: '140vh' }}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-2xl font-bold text-gray-300 hover:text-brand-green transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        <div className="flex gap-4 mt-8">
          {SOCIAL_LINKS.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/5 text-gray-400 hover:bg-brand-green hover:text-white transition-all"
            >
              <link.icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
