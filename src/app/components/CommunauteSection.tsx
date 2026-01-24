"use client";

export default function Communautesection() {
  return (
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Titre principal */}
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-white">
          Nos évènements <span className="text-brand-orange">et projets</span>
        </h2>

        {/* Grille des colonnes */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Colonne 1: Meetups */}
          <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-colors border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4">Meet-ups Mensuels</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              <strong className="text-white">Chaque mois</strong>, la communauté Bitcoin Bénin réalise un événement gratuit et ouvert à tous. Experts et curieux se retrouvent en centre-ville de Cotonou pour des échanges inclusifs.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Après une présentation thématique et une session Q&amp;R, les discussions libres et ateliers pratiques permettent à chacun d&apos;approfondir ses connaissances.
            </p>
          </div>

          {/* Colonne 2: Conférences */}
          <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-colors border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4">Conférences Éducatives</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Nous intervenons dans les écoles et universités avec des conférences adaptées : <em>&ldquo;Qu&apos;est-ce que Bitcoin ?&rdquo;</em>, cas d&apos;usage, minage, sécurité, etc.
            </p>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm font-semibold text-brand-orange mb-3">
                Vous souhaitez organiser une conférence ?
              </p>
              <a
                href="mailto:benedoffice@gmail.com"
                className="inline-block bg-white/5 border border-white/10 hover:bg-brand-orange hover:border-brand-orange hover:text-white text-gray-300 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300"
              >
                Nous contacter
              </a>
            </div>
          </div>

          {/* Colonne 3: Ateliers Pro */}
          <div className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-colors border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4">Ateliers Professionnels</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Une à deux fois par an, nous formons les commerçants et entreprises sur l&apos;intégration de Bitcoin : avantages, solutions techniques, trésorerie et comptabilité.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                "Avantages & Inconvénients",
                "Solutions d'encaissement",
                "Réserve de valeur",
                "Intégration comptable"
              ].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}