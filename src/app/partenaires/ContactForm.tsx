'use client';

import { useState, FormEvent } from 'react';

const ContactForm = () => {
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
        setStatus("Merci ! Votre message a été envoyé.");
        form.reset();
      } else {
        const responseData = await response.json();
        if (Object.prototype.hasOwnProperty.call(responseData, 'errors')) {
          setStatus(responseData['errors'].map((error: any) => error['message']).join(', '));
        } else {
          setStatus("Oops! Une erreur est survenue lors de l'envoi.");
        }
      }
    } catch (error) {
      setStatus("Oops! Une erreur est survenue lors de l'envoi.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form 
        action="https://formspree.io/f/YOUR_FORM_ID" // <-- REMPLACEZ PAR VOTRE URL FORMSPREE
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">Nom de l\'entreprise/organisation</label>
            <input type="text" name="company" id="company" required className="form-input" />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Votre nom complet</label>
            <input type="text" name="name" id="name" required className="form-input" />
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Votre email</label>
          <input type="email" name="email" id="email" required className="form-input" />
        </div>
        <div className="mt-6">
          <label htmlFor="partnership_type" className="block text-sm font-medium text-gray-300 mb-2">Type de partenariat envisagé</label>
          <select name="partnership_type" id="partnership_type" required className="form-input">
            <option>Sponsor financier</option>
            <option>Partenaire technique</option>
            <option>Partenaire communautaire</option>
            <option>Autre</option>
          </select>
        </div>
        <div className="mt-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Votre message</label>
          <textarea name="message" id="message" rows={5} required className="form-input"></textarea>
        </div>
        <div className="mt-8 text-center">
          <button type="submit" className="btn-primary-green text-white font-bold py-4 px-12 rounded-xl text-lg transform hover:scale-105 transition-all duration-300 inline-block shadow-lg hover:shadow-xl">
            Envoyer
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
  );
};

export default ContactForm;
