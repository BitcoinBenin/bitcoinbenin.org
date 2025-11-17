"use client";

export default function Communautesection() {
  return (
    <section className="text-white px-4 md:px-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre principal */}
        <h2 className="text-vert text-3xl md:text-4xl font-bold mb-8">
          Nos évènements et projets
        </h2>

        {/* Grille des colonnes */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* Colonne 1 */}
          <div className="w-full">
            <p className="text-sm leading-relaxed mb-4 text-left hyphens-auto break-words max-w-none">
              <strong>Chaque mois, la communauté Bitcoin Bénin</strong> réalise
              un événement de type &quot;meet-up&quot;. Entièrement gratuit et ouvert à
              tou(te)s, de nombreux experts et aficionados de Bitcoin se
              retrouvent à partir de 16h dans un endroit du centre ville de Cotonou.
              Les échanges sont alors inclusifs et dynamiques jusqu&apos;à 18h, heure
              de la présentation mensuelle dont le thème varie chaque mois.
            </p>
            <p className="text-sm leading-relaxed mb-4 text-left hyphens-auto break-words max-w-none">
              Par suite, après une série de questions-réponses, les participants
              sont invités à reprendre leurs discussions librement. Certains
              décident alors, en fonction des meet-ups, de réaliser des petits
              ateliers afin de développer ou de partager leurs connaissances.
            </p>
            <p className="text-sm font-semibold text-white text-left hyphens-auto break-words max-w-none">
              Ces événements sont parfaits pour tous ; experts, curieux comme
              novices.
            </p>
          </div>

          {/* Colonne 2 */}
          <div className="w-full flex flex-col">
            <p className="text-sm leading-relaxed mb-4 text-left hyphens-auto break-words max-w-none">
              La communauté donne également des conférences dans les écoles et
              universités de la région. Ces dernières peuvent alors être
              généralistes (<em>&quot;Qu&apos;est-ce que Bitcoin ?&quot;, &quot;Quels sont ses cas
              d&apos;utilisation ?&quot;, &quot;L&apos;histoire de Bitcoin&quot;</em>) comme centrées
              sur un (ou des) sujet(s) spécifique(s) (le minage, le
              fonctionnement du réseau, l&apos;aspect monétaire, la sécurité des clés
              privées, l&apos;intérêt de posséder du bitcoin dans la trésorerie de
              son entreprise, etc.).
            </p>
            <p className="text-sm font-semibold text-white text-left hyphens-auto break-words max-w-none">
              Ces conférences s&apos;adaptent donc très bien aux besoins et envies
              des écoles et BDE.
            </p>
            <p className="text-sm mt-4 text-left hyphens-auto break-words max-w-none">
              Si cela vous intéresse, n&apos;hésitez donc pas à nous contacter :
            </p>

            <div className="mt-4">
              <button
                className="bg-black text-white border border-white px-5 py-2 rounded-full font-semibold text-sm transition-colors duration-300 hover:bg-white hover:text-black"
                aria-label="Contacter Bitcoin Bénin"
              >
                bitcoinbenin@gmail.com
              </button>
            </div>
          </div>

          {/* Colonne 3 */}
          <div className="w-full">
            <p className="text-sm leading-relaxed mb-4 text-left hyphens-auto break-words max-w-none">
              <strong>Enfin, une à deux fois par an</strong>, Bitcoin Bénin
              organise un atelier à destination des commerçants et entreprises.
              Quatre points sont alors abordés :
            </p>
            <div className="text-sm space-y-2 text-left max-w-none">
              <p className="flex items-start hyphens-auto break-words">
                <span className="mr-2">–</span>
                <span>quels sont les avantages et les inconvénients d&apos;accepter Bitcoin comme moyen de paiement dans son commerce ?</span>
              </p>
              <p className="flex items-start hyphens-auto break-words">
                <span className="mr-2">–</span>
                <span>quelles solutions simples et ergonomiques existe-t-il actuellement pour l&apos;accepter ?</span>
              </p>
              <p className="flex items-start hyphens-auto break-words">
                <span className="mr-2">–</span>
                <span>en quoi Bitcoin se positionne-t-il comme une réserve de valeur pertinente pour la gestion de sa trésorerie ?</span>
              </p>
              <p className="flex items-start hyphens-auto break-words">
                <span className="mr-2">–</span>
                <span>comment l&apos;intégrer dans sa comptabilité ?</span>
              </p>
            </div>
            <p className="text-sm mt-4 text-left hyphens-auto break-words max-w-none">
              Un atelier pratique permettra également aux participants de
              découvrir la simplicité et la rapidité de cette technologie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}