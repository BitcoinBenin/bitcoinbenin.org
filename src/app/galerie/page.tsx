// Redirection vers la page gallery principale
import { redirect } from 'next/navigation';

export default function GaleriePage() {
  redirect('/gallery');
}