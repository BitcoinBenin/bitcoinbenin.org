'use client';

import { FaBitcoin, FaBolt, FaCopy } from 'react-icons/fa';
import Image from 'next/image';
import { useState } from 'react';

const DonationPage = () => {
  const [copiedOnChain, setCopiedOnChain] = useState(false);
  const [copiedLightning, setCopiedLightning] = useState(false);
  
  const onChainAddress = "bc1ql0puzkqrd3sqngzlxed0r809alelypxmvt7vwjrgetyazyzlaqeqasaaxy";
  const lightningAddress = "bitcoinbenin@blink.sv";
  
  const copyToClipboard = (text: string, type: 'onchain' | 'lightning') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'onchain') {
        setCopiedOnChain(true);
        setTimeout(() => setCopiedOnChain(false), 2000);
      } else {
        setCopiedLightning(true);
        setTimeout(() => setCopiedLightning(false), 2000);
      }
    });
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-green-400 sm:text-5xl lg:text-6xl">
            Soutenez notre mission
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
            Votre don en Bitcoin nous aide à promouvoir l&apos;éducation et l&apos;adoption de Bitcoin au Bénin. Chaque satoshi compte !
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* On-Chain Donation */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
              <FaBitcoin className="text-yellow-500" /> Don On-Chain
            </h2>
            <div className="mt-4 bg-white p-4 rounded-lg">
              <Image 
                src="/onchain_qr.jpg"
                alt="QR Code pour don en Bitcoin"
                width={200}
                height={200}
              />
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Scannez le QR code pour un don direct sur la blockchain.
            </p>
            <div className="mt-4 w-full flex items-center bg-gray-900 rounded-lg p-2 h-auto min-h-[3rem] break-all">
              {onChainAddress}
            </div>
            <button 
              onClick={() => copyToClipboard(onChainAddress, 'onchain')}
              className="mt-3 flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
            >
              <FaCopy /> {copiedOnChain ? 'Copié!' : 'Copier l\'adresse'}
            </button>
            <p className="mt-3 text-xs text-gray-500">
              N&apos;envoyez que des BTC à cette adresse.
            </p>
          </div>

          {/* Lightning Donation */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
              <FaBolt className="text-yellow-400" /> Don Lightning
            </h2>
            <div className="mt-4 bg-white p-4 rounded-lg">
              <Image 
                src="/blink.jpg"
                alt="QR Code pour don Lightning"
                width={200}
                height={200}
              />
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Scannez le QR code pour un don instantané avec le Lightning Network.
            </p>
            <div className="mt-4 w-full flex items-center bg-gray-900 rounded-lg p-2 h-auto min-h-[3rem] break-all">
              {lightningAddress}
            </div>
            <button 
              onClick={() => copyToClipboard(lightningAddress, 'lightning')}
              className="mt-3 flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
            >
              <FaCopy /> {copiedLightning ? 'Copié!' : 'Copier l\'adresse'}
            </button>
            <p className="mt-3 text-xs text-gray-500">
              Adresse LNURL ou facture Lightning.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-green-400">Pourquoi votre don est important ?</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors duration-300">
              <h3 className="text-xl font-semibold">Éducation</h3>
              <p className="mt-2 text-gray-400">
                Financer des ateliers, des meetups et du matériel éducatif pour tous.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors duration-300">
              <h3 className="text-xl font-semibold">Adoption</h3>
              <p className="mt-2 text-gray-400">
                Aider les commerçants locaux à intégrer Bitcoin et à accepter les paiements.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors duration-300">
              <h3 className="text-xl font-semibold">Communauté</h3>
              <p className="mt-2 text-gray-400">
                Organiser des évènements pour renforcer la communauté Bitcoin au Bénin.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-green-900 to-gray-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Merci pour votre soutien !</h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Chaque contribution, aussi petite soit-elle, nous rapproche de notre objectif de faire du Bénin un centre d&apos;excellence pour Bitcoin en Afrique.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Transparence</h3>
              <p className="text-sm text-gray-300 mt-2">Tous nos rapports financiers sont publiés mensuellement</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Sécurité</h3>
              <p className="text-sm text-gray-300 mt-2">95% des fonds sont stockés en cold storage hors ligne</p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Impact</h3>
              <p className="text-sm text-gray-300 mt-2">100% des fonds soutiennent directement la communauté locale</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonationPage;