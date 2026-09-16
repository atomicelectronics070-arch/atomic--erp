import { Metadata } from 'next';
import PortafolioClient from './PortafolioClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Portafolio Atomic | Soluciones de Ingeniería, Tecnología y Hogar',
  description: 'Portafolio corporativo oficial de ATOMIC. Tecnología Residencial, Línea Hogar para Arquitectos y Constructores, Ingeniería Electrónica, Desarrollo de Software y Servicios Técnicos Especializados con referencias en video.',
  openGraph: {
    title: 'Portafolio Atomic | Soluciones de Ingeniería, Tecnología y Hogar',
    description: 'Portafolio institucional de ATOMIC: divisiones de Tecnología Residencial, Hogar, Electrónica, Software, Servicios Certificados y Referencias de Obras.',
    type: 'website',
  },
};

export default function PortafolioPage() {
  return <PortafolioClient />;
}
