'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { clearSupabaseSession } from '@/lib/supabase';
import { 
  FaImages, 
  FaCalendarAlt, 
  FaSchool, 
  FaSignOutAlt, 
  FaChartLine,
  FaBars,
  FaTimes
} from 'react-icons/fa';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await clearSupabaseSession();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      router.replace('/login');
    }
  };

  const menuItems = [
    { name: 'Tableau de bord', href: '/admin', icon: FaChartLine },
    { name: 'Gallery', href: '/admin/gallery', icon: FaImages },
    { name: 'Événements', href: '/admin/events', icon: FaCalendarAlt },
    { name: 'Bitcoin School', href: '/admin/bitcoin-school', icon: FaSchool },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-6 right-6 z-[60] p-3 rounded-xl bg-brand-green text-white shadow-glow"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-72 bg-brand-charcoal border-r border-white/5 flex flex-col z-[55]
        transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="p-8 border-b border-white/5 bg-brand-dark/20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-40">
              <Image
                src="/logo.svg"
                alt="Bitcoin Benin"
                fill
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2 mt-4 overflow-y-auto">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 mb-4">
            Navigation Admin
          </div>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-4 rounded-xl transition-all group
                  ${isActive 
                    ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={`text-xl ${isActive ? 'text-brand-green' : 'group-hover:text-brand-green transition-colors'}`} />
                  <span className="font-medium tracking-wide">{item.name}</span>
                </div>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green shadow-glow animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-6 border-t border-white/5 bg-brand-dark/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all group"
          >
            <FaSignOutAlt className="text-xl group-hover:scale-110 transition-transform" />
            <span className="font-medium tracking-wide">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
