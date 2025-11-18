import React from 'react';

export default function HowToIntegrate() {
  return (
    <section className="my-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Video Column */}
        <div className="relative w-full h-0 pb-[56.25%] rounded-2xl shadow-lg overflow-hidden"> {/* 16:9 Aspect Ratio */}
          <iframe 
            className="absolute top-0 left-0 w-full h-full"
            src="https://youtu.be/-GJr4XjRCPo?si=Jrap-oToMMFeOIC8" // Placeholder video
            title="YouTube video player"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Text Column */}
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Comment l’intégrer ?
          </h2>
          <p className="text-base leading-relaxed text-gray-300">
            Il existe de nombreuses solutions simples et intuitives permettant d’accepter Bitcoin sans difficulté. Parmi elles, l’application “Swiss Bitcoin Pay” semble être la plus pertinente pour débuter. Elle permet en effet:
          </p>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-300">
            <li>d’accepter Bitcoin en quelques minutes, sans avoir besoin d’un TPE spécifique;</li>
            <li>de paramétrer le pourcentage de bitcoins que vous souhaitez convertir en euros;</li>
            <li>d’exporter sa comptabilité en un clic.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
