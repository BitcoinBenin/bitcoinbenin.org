import Hero from "./components/Hero";
import Mission from "./components/Mission";
import JoinUs from "./components/JoinUs";
import Testimonials from "./components/Testimonials";
import GalleryPreview from "./components/GalleryPreview";
import Partners from "./components/Partners";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Accueil",
  description: "Rejoignez la communauté Bitcoin Béninoise. Découvrez, apprenez et développez l'écosystème Bitcoin au Bénin grâce à nos événements, formations et ressources éducatives.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <JoinUs />
      <GalleryPreview />
      <Testimonials />
      <Partners />
    </>
  );
}
