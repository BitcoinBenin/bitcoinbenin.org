import NosRessources from "../components/NosRessources";
import RessourcesCommunaute from "../components/OtherRessources";
import Incontournables from "../components/Incontournable";
import AutresRessourcesUtiles from "../components/AutreRessourceUtile";

export default function NosRessourcesPage() {
  return (
    <main className="min-h-screen pt-24 md:pt-28">
      <NosRessources />
      <RessourcesCommunaute />
      <Incontournables />
      <AutresRessourcesUtiles />
    </main>
  );
}
