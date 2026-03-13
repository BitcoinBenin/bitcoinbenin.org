import type { Metadata } from 'next';
import AdminSidebar from './AdminSidebar';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-brand-dark overflow-x-hidden">
      {/* Sidebar - Fixe à gauche sur desktop, tiroir sur mobile */}
      <AdminSidebar />
      
      {/* Contenu principal - Se décale sur desktop (pl-72) */}
      <main className="flex-1 w-full lg:pl-72 min-h-screen transition-all duration-300">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
