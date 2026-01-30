import { FaRegCalendarAlt, FaBitcoin, FaShoppingCart, FaTelegramPlane, FaTwitter, FaEnvelope, FaLinkedin, FaFacebook } from 'react-icons/fa';

// Mission Data
export const MISSIONS = [
  {
    icon: FaRegCalendarAlt,
    title: 'Évènements',
    description: 'Découvrez Bitcoin lors de nos évènements ouverts et gratuits, tous les premiers mercredis du mois au Bénin.',
    buttonText: 'Participer',
    href: '/events',
  },
  {
    icon: FaBitcoin,
    title: 'Éducation',
    description: 'Organisez dans votre école, votre université ou avec votre BDE une conférence ou un atelier en partenariat avec Bitcoin Bénin.',
    buttonText: 'Accéder',
    href: '#',
  },
  {
    icon: FaShoppingCart,
    title: 'Commerces',
    description: 'Acceptez Bitcoin comme moyen de paiement dans votre commerce, et obtenez une formation et un suivi gratuit.',
    buttonText: 'Commencer',
    href: '/accepter-bitcoin',
  },
];

// Partners Data
export const PARTNERS = [
  
   { name: 'izichange', logo: '/partners/Flash Logo.png' },
   { name: 'BMM', logo: '/partners/Logo BMM.png' },
   { name: 'planb Network', logo: '/partners/planb-network.png' },
   { name: 'Trezor', logo: '/partners/TrezorAcademy.png' },
  
];

// Navigation Links Data
export const NAV_LINKS = [
  { name: ' Communauté', href: '/communaute' },
  { name: ' Evènements', href: '/events' },
  { name: ' Soutenir', href: '/nous-soutenir' },
  { name: ' Ressources', href: '/NosRessources' },
  { name: ' Galerie', href: '/gallery' },
  { name: 'Accepter Bitcoin', href: '/accepter-bitcoin' },
];

// Social Links Data
export const SOCIAL_LINKS = [
  { name: 'Telegram', icon: FaTelegramPlane, href: 'https://t.me/+vUzohmB0EFMzZTI8' },
  { name: 'Twitter', icon: FaTwitter, href: 'https://x.com/BitcoinBenin' },
  { name: 'Email', icon: FaEnvelope, href: 'mailto:benedoffice@gmail.com' }, // Fixed mailto protocol while at it
  { name: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/company/bitcoinbenin/' },
  { name: 'Facebook', icon: FaFacebook, href: 'https://www.facebook.com/BitcoinBenin' },
];

// Events Data
export const EVENTS = [
  {
    id: '1',
    title: 'Premier événement Bitcoin Bénin',
    date: '2024-01-03',
    location: 'Cotonou, Bénin',
    description: 'Rejoignez-nous pour découvrir les bases de Bitcoin lors de notre premier événement mensuel gratuit.',
    imageUrl: '/images/event-placeholder.jpg',
  },
  {
    id: '2',
    title: 'Atelier Bitcoin avancé',
    date: '2024-02-07',
    location: 'Porto-Novo, Bénin',
    description: 'Un atelier pour approfondir vos connaissances sur le stockage et la sécurité Bitcoin.',
    imageUrl: '/images/event-placeholder.jpg',
  },
];