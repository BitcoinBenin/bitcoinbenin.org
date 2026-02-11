'use client';

import { FaBitcoin, FaBolt, FaCopy } from 'react-icons/fa';
import Image from 'next/image';
import { useState } from 'react';

export default function DonationPage() {
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
    <div className="min-h-screen pt-32 md:pt-40 pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-green/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Soutenez notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-accent">Mission</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
            Votre don en Bitcoin nous aide à promouvoir l&apos;éducation et l&apos;adoption de Bitcoin au Bénin. Chaque satoshi compte !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* On-Chain Donation */}
          <div className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-green/20 transition-all duration-500"></div>

            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-8">
              <FaBitcoin className="text-brand-green text-3xl" /> Don On-Chain
            </h2>
            <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
              <Image
                src="/onchain_qr.jpg"
                alt="QR Code pour don en Bitcoin"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Scannez le QR code pour un don direct sur la blockchain.
            </p>
            <div className="w-full flex items-center justify-center bg-brand-charcoal/80 rounded-xl p-4 border border-white/5 break-all text-xs md:text-sm font-mono text-gray-300 mb-4">
              {onChainAddress}
            </div>
            <button
              onClick={() => copyToClipboard(onChainAddress, 'onchain')}
              className="flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
            >
              <FaCopy /> {copiedOnChain ? 'Copié !' : 'Copier l\'adresse'}
            </button>
            <p className="mt-4 text-xs text-gray-500">
              N&apos;envoyez que des BTC à cette adresse.
            </p>
          </div>

          {/* Lightning Donation */}
          <div className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 group-hover:bg-yellow-400/20 transition-all duration-500"></div>

            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-8">
              <FaBolt className="text-yellow-400 text-3xl" /> Don Lightning
            </h2>
            <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
              <Image
                src="/blink.jpg"
                alt="QR Code pour don Lightning"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Scannez le QR code pour un don instantané avec le Lightning Network.
            </p>
            <div className="w-full flex items-center justify-center bg-brand-charcoal/80 rounded-xl p-4 border border-white/5 break-all text-xs md:text-sm font-mono text-gray-300 mb-4">
              {lightningAddress}
            </div>
            <button
              onClick={() => copyToClipboard(lightningAddress, 'lightning')}
              className="flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
            >
              <FaCopy /> {copiedLightning ? 'Copié !' : 'Copier l\'adresse'}
            </button>
            <p className="mt-4 text-xs text-gray-500">
              Adresse LNURL ou facture Lightning.
            </p>
          </div>
        </div>

        {/* Why Support Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Pourquoi votre don est important ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Éducation', desc: 'Financer des ateliers, des meetups et du matériel éducatif pour tous.' },
              { title: 'Adoption', desc: 'Aider les commerçants locaux à intégrer Bitcoin et à accepter les paiements.' },
              { title: 'Communauté', desc: 'Organiser des évènements pour renforcer la communauté Bitcoin au Bénin.' }
            ].map((item, i) => (
              <div key={i} className="glass-panel p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-brand-green/30 group">
                <h3 className="text-xl font-bold text-white group-hover:text-brand-green transition-colors">{item.title}</h3>
                <p className="mt-4 text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Thank You Section */}
        <div className="mt-24 relative overflow-hidden rounded-3xl p-8 md:p-12 text-center border border-white/10 bg-gradient-to-br from-brand-charcoal to-brand-dark">
          <div className="absolute inset-0 bg-brand-green/5 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">Merci pour votre soutien !</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              Chaque contribution, aussi petite soit-elle, nous rapproche de notre objectif de faire du Bénin un centre d&apos;excellence pour Bitcoin en Afrique.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Transparence', desc: 'Tous nos rapports financiers sont publiés mensuellement', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { title: 'Sécurité', desc: '95% des fonds sont stockés en cold storage hors ligne', iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                { title: 'Impact', desc: '100% des fonds soutiennent directement la communauté locale', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-brand-green/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-green">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}