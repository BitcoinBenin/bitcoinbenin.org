'use client';

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-dark overflow-x-hidden">
      {/* Sidebar */}
      <AdminSidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)}
        isOpenMobile={isOpenMobile}
        onToggleMobile={() => setIsOpenMobile(!isOpenMobile)}
      />
      
      {/* Contenu principal */}
      <main className={`
        flex-1 w-full min-h-screen transition-all duration-300
        ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}
      `}>
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
