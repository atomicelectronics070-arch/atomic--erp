import { Metadata } from 'next';
import InversionesClient from './PageClient';

export const metadata: Metadata = {
  title: 'Ecosistema de Inversiones | Futura Tech & Atomic Capital',
  description: 'Invierte con criterio, crece con tecnología. Inversión inicial $100 con beneficios constantes por un año.',
  robots: { index: false, follow: false } // Private landing per instruction
};

export default function InversionesPage() {
  return <InversionesClient />;
}
