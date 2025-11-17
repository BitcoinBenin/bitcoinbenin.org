import Communaute from '../components/Communaute'
import Communautesection from '../components/CommunauteSection';
import Communautesection1 from '../components/CommunauteSection1';
import Communautesection2 from '../components/CommunauteSection2';
import TeamSection from '../components/BureauSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Communauté",
  description: "Rejoignez la communauté Bitcoin Bénin. Échangez avec d'autres passionnés, participez à nos événements et contribuez au développement de l'écosystème Bitcoin au Bénin.",
};

export default function CommunautePage() {
  return (
    <main className="bg-hero-gradient-dark text-white min-h-screen">
      <Communaute />
      <Communautesection />
      <Communautesection1 />
      <Communautesection2 />
      <TeamSection />
    </main>
  );
}
