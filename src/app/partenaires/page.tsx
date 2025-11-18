'use client';

import { FaHandshake, FaLightbulb, FaBullhorn } from 'react-icons/fa';

import ContactForm from './ContactForm';

const PartnersPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-green-400 sm:text-5xl lg:text-6xl">
            Devenir Partenaire
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-300">
            Rejoignez-nous pour construire l&apos;avenir de Bitcoin au Bénin. Votre soutien en tant que partenaire est crucial pour notre succès.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-green-400">Pourquoi devenir partenaire ?</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg text-center hover:bg-gray-750 transition-colors duration-300">
              <FaBullhorn className="text-yellow-400 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Visibilité Accrue</h3>
              <p className="mt-2 text-gray-400">
                Associez votre marque à l&apos;innovation et à l&apos;éducation Bitcoin en Afrique francophone.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg text-center hover:bg-gray-750 transition-colors duration-300">
              <FaHandshake className="text-yellow-400 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Réseau Stratégique</h3>
              <p className="mt-2 text-gray-400">
                Accédez à notre réseau de professionnels, de développeurs et d&apos;enthousiastes Bitcoin.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg text-center hover:bg-gray-750 transition-colors duration-300">
              <FaLightbulb className="text-yellow-400 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Impact Direct</h3>
              <p className="mt-2 text-gray-400">
                Soutenez directement des projets concrets qui favorisent l&apos;adoption et l&apos;éducation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-800 rounded-xl p-8 lg:p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Prêt à nous rejoindre ?</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Remplissez le formulaire ci-dessous pour discuter des opportunités de partenariat. Nous vous recontacterons dans les plus brefs délais.
            </p>
          </div>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PartnersPage;
