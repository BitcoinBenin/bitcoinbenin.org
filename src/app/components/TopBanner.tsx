import Link from 'next/link';

export default function TopBanner() {
  return (
    <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-brand-dark/80 backdrop-blur-md border border-white/5 text-[10px] md:text-xs font-medium text-gray-400 shadow-lg">
      <Link href="/events/1" className="group flex items-center gap-2 hover:text-white transition-colors">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
        <p>
          <span className="font-bold text-brand-green mr-1">[NOUVEAU]</span> Rejoignez notre meet-up commerçants
        </p>
      </Link>
    </div>
  );
}
