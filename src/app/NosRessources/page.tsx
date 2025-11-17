import NosRessources from "../components/NosRessources";
import RessourcesCommunaute from "../components/OtherRessources";
import Incontournables from "../components/Incontournable";
import AutresRessourcesUtiles from "../components/AutreRessourceUtile";

export default function NosRessourcesPage() {
  return (
    <main className="bg-hero-gradient-dark text-white min-h-screen">
    <NosRessources />
    <RessourcesCommunaute />
    <Incontournables />
    <AutresRessourcesUtiles />
    </main>
  );
}
