import Link from 'next/link';

export default function TopBanner() {
  return (
    <div className="bg-green-800 text-white text-center p-2 text-sm">
      <Link href="/events/1" className="hover:text-green-200 hover:underline">
        <p>Rejoignez notre meet-up dédié aux commerçants : Pourquoi et comment accepter Bitcoin ?</p>
      </Link>
    </div>
  );
}
