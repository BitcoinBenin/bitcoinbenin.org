import Link from "next/link";

export default function Communautes() {
  return (
    <section className="bg-anthracite text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* ✅ Bloc Telegram */}
        <div className="flex flex-col h-full">
          <h2
            className="text-2xl sm:text-3xl font-extrabold mb-6"
            style={{ color: "#F7931A" }}
          >
            Notre groupe Telegram
          </h2>

          <div className="flex-grow">
            <p className="text-gray-300 leading-relaxed text-base">
              L&apos;objectif du groupe Telegram est d&apos;être une première porte vers les canaux de communication de la communauté Bitcoin Bénin. Cela signifie que son objectif n&apos;est pas d&apos;être le lieu de conversations quotidiennes.
              <br /><br />
              Des questions courtes peuvent donc être posées, mais nous préférerions que le serveur Discord soit utilisé pour les discussions plus complètes afin d&apos;y permettre une meilleure visibilité de tous les échanges.
            </p>
          </div>

          {/* ✅ Bouton Telegram */}
          <Link
            href="https://t.me/+vUzohmB0EFMzZTI8"
            className="mt-8 bg-[var(--bitcoin-orange)] text-black font-bold uppercase
                       py-3 px-8 rounded-full mx-auto lg:mx-0 transition-all
                       hover:bg-black hover:text-[var(--bitcoin-orange)]
                       border-2 border-[var(--bitcoin-orange)] w-fit text-sm"
          >
            Accéder au groupe Telegram
          </Link>

          {/* ✅ Ligne de séparation */}
          <div className="w-full border-t border-gray-700 mt-12"></div>
        </div>

        {/* ✅ Bloc Discord */}
        <div className="flex flex-col h-full">
          <h2
            className="text-2xl sm:text-3xl font-extrabold mb-6"
            style={{ color: "#F7931A" }}
          >
            Notre serveur Discord
          </h2>

          <div className="flex-grow">
            <p className="text-gray-300 leading-relaxed text-base">
              L&apos;objectif du serveur Discord est d&apos;être centralisateur de l&apos;ensemble des communications des membres et affiliés de la communauté. Cela signifie que les discussions générales, techniques et le partage de ressources sont bienvenus !
              <br /><br />
              Par ailleurs, des bots programmés lieront en direct le canal général du serveur Discord au groupe Telegram, permettant à tous les messages d&apos;être partagés sur les deux canaux de communication.
            </p>
          </div>

          {/* ✅ Bouton Discord */}
          <Link
            href="#"
            className="mt-8 bg-[var(--bitcoin-orange)] text-black font-bold uppercase
                       py-3 px-8 rounded-full mx-auto lg:mx-0 transition-all
                       hover:bg-black hover:text-[var(--bitcoin-orange)]
                       border-2 border-[var(--bitcoin-orange)] w-fit text-sm"
          >
            Accéder au serveur Discord
          </Link>

          {/* ✅ Ligne de séparation */}
          <div className="w-full border-t border-gray-700 mt-12"></div>
        </div>

      </div>
    </section>
  );
}