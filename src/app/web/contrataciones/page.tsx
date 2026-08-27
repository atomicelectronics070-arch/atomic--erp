import { Metadata } from 'next';
import ContratacionesClient from './PageClient';

export const metadata: Metadata = {
  title: 'Ecosistema de Contrataciones | Atomic Industries',
  description: 'Únete a nuestro equipo: Desarrollo, Redes, Instalaciones Técnicas y Ventas Digitales. Trabajo fijo y esquema de crecimiento.',
};

export default function ContratacionesPage() {
  return <ContratacionesClient />;
}
