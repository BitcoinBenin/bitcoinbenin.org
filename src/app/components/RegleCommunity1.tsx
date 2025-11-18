export default function ReglesCommunity() {  
  return (
    <section className="bg-anthracite text-white py-16 px-6">

      {/* ------------------ BLOC 1 : RÈGLES 1T / 1D et 2T / 2D ------------------ */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* ------------------ COLONNE TELEGRAM ------------------ */}
        <div className="flex flex-col justify-between h-full">

          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--bitcoin-orange)]">
              Règle 1T – Respecter le thème du groupe
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              « Les contenus postés sur le groupe Telegram doivent concerner &quot;les crypto-
              monnaies, leur écosystème, et Bitcoin&quot;. Ceux ne respectant pas le thème du groupe
              seront soumis à une modération. Le groupe Telegram est par ailleurs francophone. »
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--bitcoin-orange)]">
              Règle 2T – Promotions et contenus indésirables
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              « Les liens de &quot;promotions&quot; pour des activités lucratives, ainsi que les liens
              de parrainage et d&apos;invitation vers une plateforme x ou y, sont examinés et peuvent
              être supprimés.<br /><br />
              En parallèle, les propositions d&apos;échange &quot;cash vs crypto/btc&quot; sont autorisées sur
              Telegram, et acceptés lors des meet-ups. Attention toutefois aux arnaques et autres
              scams.<br /><br />
              Les partages de photos, voire de fichiers, sont eux aussi examinés et peuvent être
              soumis à modération / suppression. »
            </p>
          </div>

        </div>

        {/* ------------------ COLONNE DISCORD ------------------ */}
        <div className="flex flex-col justify-between h-full">

          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--bitcoin-orange)]">
              Règle 1D – Respecter le thème de chaque salon
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              « De nombreux salons sont disponibles sur le Discord communautaire. Leur nom est
              explicite, et les contenus postés dans chacun d&apos;eux doivent respecter ledit thème.
              Les messages ne le respectant pas seront soumis à une modération. Le Discord est
              par ailleurs international. »
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--bitcoin-orange)]">
              Règle 2D – Promotions et contenus indésirables
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              « Les liens de &quot;promotions&quot; pour des activités lucratives, ainsi que les liens
              de parrainage et d&apos;invitation vers une plateforme x ou y, sont examinés et peuvent
              être supprimés.<br /><br />
              En parallèle, les propositions d&apos;échange &quot;cash vs crypto/btc&quot; sont autorisées sur
              Discord, et acceptées lors des meet-ups. Attention toutefois aux arnaques et
              autres scams.<br /><br />
              Les partages de photos, voire de fichiers, sont eux aussi examinés et peuvent être
              soumis à modération / suppression. »
            </p>
          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------------------ */}
      {/* ------------------ BLOC 2 : RÈGLES 3T / 3D et 4T / 4D ------------------ */}
      {/* ------------------------------------------------------------------------ */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16">

        {/* ------------------ RÈGLES TELEGRAM ------------------ */}
        <div className="flex flex-col justify-between h-full">

          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--bitcoin-orange)]">
              Règle 3T – Priorité aux partages et aux échanges
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              « Pour assurer la meilleure visibilité des échanges sur Telegram, merci de ne pas
              saturer la conversation de petites annonces personnelles, de blagues, de gifs, etc. »
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--bitcoin-orange)]">
              Règle 4T – Être courtois et surtout civilisé
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              « Le harcèlement sous toutes ses formes est interdit, comme les commentaires
              dégradants.<br /><br />
              Tout le monde doit également être traité avec respect : il est normal d&apos;avoir des
              débats constructifs, mais il est essentiel de rester aimable dans les échanges
              Telegram.<br /><br />
              Enfin, les propos racistes, homophobes, sexistes et/ou religieux sont interdits. »
            </p>
          </div>

        </div>

        {/* ------------------ RÈGLES DISCORD ------------------ */}
        <div className="flex flex-col justify-between h-full">

          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--bitcoin-orange)]">
              Règle 3D – Priorité aux partages et aux échanges
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              « Pour assurer la meilleure visibilité des échanges sur les salons du Discord, merci
              de ne pas les saturer avec des petites annonces personnelles, blagues, gifs, etc. »
            </p>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--bitcoin-orange)]">
              Règle 4D – Être courtois et surtout civilisé
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              « Le harcèlement sous toutes ses formes est interdit, comme les commentaires
              dégradants.<br /><br />
              Tout le monde doit également être traité avec respect : il est normal d&apos;avoir des
              débats constructifs, mais il est essentiel de rester aimable dans les échanges
              sur Discord.<br /><br />
              Enfin, les propos racistes, homophobes, sexistes et/ou religieux sont interdits. »
            </p>
          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------------------ */}
      {/* ------------------ BLOC 3 : RÈGLES 5T / 5D / 6D / 7D ------------------ */}
      {/* ------------------------------------------------------------------------ */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16">

        {/* ------------------ COLONNE TELEGRAM ------------------ */}
        <div className="flex flex-col justify-between h-full">

          {/* RÈGLE 5T */}
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--bitcoin-orange)]">
              Règle 5T – Décisions de l&apos;équipe de modération
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              « L&apos;équipe de modération prendra ses décisions, de concert, dès qu&apos;une des règles ne
              sera pas respectée.<br /><br />
              En fonction de la situation, elle pourra effectuer un rappel écrit à ces règles, mettre
              en sourdine la personne mais également la bannir et/ou la bloquer du groupe Telegram.<br /><br />
              Ces décisions sont rares et n&apos;ont qu&apos;un seul objectif : permettre à la communauté de
              se sentir en confiance, dans un environnement mature et agréable. »
            </p>
          </div>

        </div>

        {/* ------------------ COLONNE DISCORD ------------------ */}
        <div className="flex flex-col justify-between h-full">

          {/* RÈGLE 5D */}
          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--bitcoin-orange)]">
              Règle 5D – Adopter une attitude mature
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              « Le spam/flood, ainsi que les commentaires trollesques, ne sont pas acceptés et
              seront soumis à modération. »
            </p>
          </div>

          {/* RÈGLE 6D */}
          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--bitcoin-orange)]">
              Règle 6D – Rester soi-même
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              « Tout vol ou usurpation d&apos;identité/de pseudo sera soumis à modération. »
            </p>
          </div>

          {/* RÈGLE 7D */}
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-[var(--bitcoin-orange)]">
              Règle 7D – Décisions de l&apos;équipe de modération
            </h3>
            <p className="text-gray-300 leading-relaxed text-base">
              « L&apos;équipe de modération prendra ses décisions, de concert, dès qu&apos;une des règles ne
              sera pas respectée.<br /><br />
              En fonction de la situation, elle pourra effectuer un rappel écrit à ces règles, mettre
              en sourdine la personne mais également la bannir et/ou la bloquer du serveur Discord.<br /><br />
              Ces décisions sont rares et n&apos;ont qu&apos;un seul objectif : permettre à la communauté de
              se sentir en confiance, dans un environnement mature et agréable. »
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}