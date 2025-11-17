import WaveTransition from './WaveTransition';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative text-white pt-32 pb-48 md:pt-40 md:pb-56 flex items-center justify-center">
      {/* Background image optimisée */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Hero background"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
          quality={85}
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-hero-gradient-dark opacity-90 z-10"></div>

      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        {/* Text and Buttons */}
        <div className="flex flex-col gap-8 items-center justify-center w-full">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter animate-fade-in-up text-center w-full">
            Rejoignez la communauté Bitcoin Béninoise
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto text-center animate-fade-in-up delay-100 w-full">
            Découvrez, apprenez et développez l&apos;écosystème{' '}
            <span className="text-orange-bitcoin font-semibold">Bitcoin</span> au Bénin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center animate-fade-in-up delay-200 w-full">
            <a
              href="/rejoindre"
              className="btn-primary-orange text-white font-bold py-4 px-8 rounded-lg text-lg hover:shadow-orange-glow transition-all duration-300 transform hover:scale-105 animate-pulse-green mx-2"
            >
              Rejoindre la communauté
            </a>
            <a
              href="/nous-soutenir"
              className="btn-secondary-outline text-white font-bold py-4 px-8 rounded-lg text-lg transform hover:scale-105 transition-all duration-300 mx-2"
            >
              Nous soutenir
            </a>
          </div>
        </div>
      </div>

      {/* Wave Transition to next section */}
      <WaveTransition />
    </section>
  );
}