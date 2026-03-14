'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { clearSupabaseSession } from '@/lib/supabase';
import { FaImages, FaCalendarAlt, FaSchool, FaSignOutAlt, FaChartLine, FaBars, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
}

export default function AdminSidebar({ isCollapsed, onToggle, isOpenMobile, onToggleMobile }: AdminSidebarProps) {
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

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={onToggleMobile}
        className="lg:hidden fixed top-6 right-6 z-[60] p-3 rounded-xl bg-brand-green text-white shadow-glow"
      >
        {isOpenMobile ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          onClick={onToggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-brand-charcoal border-r border-white/5 flex flex-col z-[55]
        transition-all duration-300 lg:translate-x-0
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}>
        {/* Toggle Button Desktop */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-brand-green text-white rounded-full items-center justify-center shadow-glow z-[60] hover:scale-110 transition-transform"
        >
          {isCollapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
        </button>

        {/* Logo Section */}
        <div className={`p-8 border-b border-white/5 bg-brand-dark/20 ${isCollapsed ? 'flex justify-center p-6' : ''}`}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className={`relative ${isCollapsed ? 'h-8 w-8' : 'h-10 w-40'}`}>
              <Image
                src={isCollapsed ? "/favicon.ico" : "/logo.svg"}
                alt="Bitcoin Benin"
                fill
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isCollapsed ? 'p-2' : 'p-6'} space-y-2 mt-4 overflow-y-auto overflow-x-hidden`}>
          {!isCollapsed && (
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 mb-4">
              Navigation Admin
            </div>
          )}
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onToggleMobile()}
                title={isCollapsed ? item.name : ''}
                className={`
                  flex items-center rounded-xl transition-all group
                  ${isCollapsed ? 'justify-center p-4' : 'justify-between px-4 py-4'}
                  ${isActive 
                    ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={`text-xl flex-shrink-0 ${isActive ? 'text-brand-green' : 'group-hover:text-brand-green transition-colors'}`} />
                  {!isCollapsed && <span className="font-medium tracking-wide whitespace-nowrap">{item.name}</span>}
                </div>
                {!isCollapsed && isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green shadow-glow animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className={`${isCollapsed ? 'p-2' : 'p-6'} border-t border-white/5 bg-brand-dark/20`}>
          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Déconnexion' : ''}
            className={`
              w-full flex items-center rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all group
              ${isCollapsed ? 'justify-center p-4' : 'gap-4 px-4 py-4'}
            `}
          >
            <FaSignOutAlt className="text-xl group-hover:scale-110 transition-transform flex-shrink-0" />
            {!isCollapsed && <span className="font-medium tracking-wide whitespace-nowrap">Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
