import { FaRegCalendarAlt, FaBitcoin, FaShoppingCart, FaTelegramPlane, FaTwitter, FaEnvelope, FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaLinkedin, FaFacebook } from 'react-icons/fa';

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
    href: '/rejoindre',
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
  { name: 'Trezor Academy', logo: '/partners/TrezorAcademy.png' },
  { name: 'Plan B Network', logo: '/partners/planb-network.png' },
  { name: 'Flash', logo: '/partners/Flash.png' },
  { name: 'BMM', logo: '/partners/BMM.png' },
];

// Navigation Links Data
export const NAV_LINKS = [
  { name: ' Communauté', href: '/communaute' },
  { name: ' Evènements', href: '/events' },
  { name: ' Soutenir', href: '/nous-soutenir' },
  { name: ' Ressources', href: '/NosRessources' },
  { name: ' Galerie', href: '/galerie' },
  { name: 'Accepter Bitcoin', href: '/accepter-bitcoin' },
];

// Social Links Data
export const SOCIAL_LINKS = [
  { icon: FaTelegramPlane, href: 'https://t.me/+vUzohmB0EFMzZTI8' },
  { icon: FaTwitter, href: 'https://x.com/BitcoinBenin' },
  { icon: FaEnvelope, href: ' bitcoinbenin@gmail.com' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/company/bitcoinbenin/' },
  { icon: FaFacebook, href: 'https://www.facebook.com/BitcoinBenin' },
];

// Events Data
export const EVENTS = [
  {
    id: 1,
    title: 'Meetup Bitcoin mensuel',
    date: '15 Novembre 2025',
    time: '16h00 - 18h00',
    startDate: null,
    endDate: null,
    location: 'SOROC, Ancienne boulangerie Zogbo',
    locationLink: 'https://maps.app.goo.gl/Hie2sSxvGPipLNFu5?g_st=ac',
    description: "Ce samedi 15 novembre, Bitcoin Bénin invite tous les commerçants, chefs d’entreprise et particuliers à un meetup exclusif pour apprendre : comment intégrer le Bitcoin à ton activité, quelles solutions existent déjà au Bénin, et comment le faire sans risque, étape par étape.",
    image: '/event.webp',
    posterImage: '/event1.jpg',
    link: '/events/1',
    registrationLink: 'https://clooza.com/events/MEETUPNOVEMBRE',
    iconCalendar: FaCalendarAlt,
    iconLocation: FaMapMarkerAlt,
    iconArrowRight: FaArrowRight,
  },
  
  {
    id: 4,
    title: 'Atelier Lightning Network (Passé)',
    date: '20 Octobre 2024',
    time: '10h00 - 13h00',
    startDate: '2024-10-20T10:00:00',
    endDate: '2024-10-20T13:00:00',
    location: 'Online',
    locationLink: '#',
    description: "Un atelier technique pour apprendre à utiliser le Lightning Network pour des paiements Bitcoin rapides et à faible coût.",
    image: '/event.webp',
    posterImage: '/event1.jpg',
    link: '/events/4',
    registrationLink: '#',
    iconCalendar: FaCalendarAlt,
    iconLocation: FaMapMarkerAlt,
    iconArrowRight: FaArrowRight,
  },
];
