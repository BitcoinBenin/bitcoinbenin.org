'use client';

import { useState, FormEvent } from 'react';

const JoinPage = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("Merci ! Votre demande d'adhésion a été envoyée.");
        form.reset();
      } else {
        const responseData = await response.json();
        if (Object.prototype.hasOwnProperty.call(responseData, 'errors')) {
          setStatus(responseData['errors'].map((error: { message: string }) => error.message).join(', '));
        } else {
          setStatus("Oops! Une erreur est survenue lors de l'envoi.");
        }
      }
    } catch (_error) {
      setStatus("Oops! Une erreur est survenue lors de l'envoi.");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-16 sm:py-24">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-green-400 sm:text-5xl">
            Rejoindre la communauté
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
            Remplissez le formulaire ci-dessous pour faire partie de la première communauté Bitcoin du Bénin.
          </p>
        </div>
        <div className="mt-12 max-w-2xl mx-auto">
          <form 
            action="https://formspree.io/f/YOUR_COMMUNITY_FORM_ID" // <-- REMPLACEZ PAR VOTRE URL FORMSPREE
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Prénom & Nom</label>
                <input type="text" name="name" id="name" required className="form-input" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Votre email</label>
                <input type="email" name="email" id="email" required className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Numéro de téléphone <span className="text-gray-500">(Optionnel)</span></label>
                <input type="tel" name="phone" id="phone" className="form-input" />
              </div>
              <div>
                <label htmlFor="profession" className="block text-sm font-medium text-gray-300 mb-2">Profession <span className="text-gray-500">(Optionnel)</span></label>
                <input type="text" name="profession" id="profession" className="form-input" />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="knowledge_level" className="block text-sm font-medium text-gray-300 mb-2">Votre niveau sur Bitcoin</label>
              <select name="knowledge_level" id="knowledge_level" required className="form-input">
                <option>Totalement débutant(e)</option>
                <option>Je connais les bases</option>
                <option>Niveau intermédiaire</option>
                <option>Niveau avancé</option>
              </select>
            </div>
            <div className="mt-6">
              <label htmlFor="join_reason" className="block text-sm font-medium text-gray-300 mb-2">Pourquoi souhaitez-vous nous rejoindre ? (Optionnel)</label>
              <textarea name="join_reason" id="join_reason" rows={5} className="form-input"></textarea>
            </div>
            <div className="mt-8 text-center">
              <button type="submit" className="btn-primary-green text-white font-bold py-4 px-12 rounded-xl text-lg transform hover:scale-105 transition-all duration-300 inline-block shadow-lg hover:shadow-xl">
                Envoyer ma demande
              </button>
            </div>
          </form>
          {status && <p className="mt-4 text-center text-gray-300">{status}</p>}
          <style jsx>{`
            .form-input {
              width: 100%;
              background-color: #1F2937; /* bg-gray-800 */
              border: 1px solid #4B5563; /* border-gray-600 */
              color: white;
              border-radius: 0.5rem;
              padding: 0.75rem 1rem;
              transition: border-color 0.2s;
            }
            .form-input:focus {
              outline: none;
              border-color: #34D399; /* green-400 */
            }
          `}</style>
        </div>
      </main>
    </div>
  );
};

export default JoinPage;
