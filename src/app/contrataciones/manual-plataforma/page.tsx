import { Metadata } from 'next';
import ContratacionesClient from '../ContratacionesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Manual de Plataforma | Instructivo Paso a Paso Vendedores ATOMIC',
  description: 'Instructivo oficial para registro, acceso y carga diaria de evidencias de las 7 actividades ordinarias en la plataforma ATOMIC.',
};

export default function ManualPlataformaPage() {
  return <ContratacionesClient />;
}
