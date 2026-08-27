import { Metadata } from 'next';
import CercosClient from './CercosClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Barreras de Cerco Eléctrico de Alta Precisión | ATOMIC Seguridad Perimetral',
  description: 'Sistemas electrificadores inteligentes, kits de cerco eléctrico completos Hagroy y JFL con monitoreo celular, batería de respaldo y sirena de 20W para protección perimetral.',
  openGraph: {
    title: 'Barreras de Cerco Eléctrico de Alta Precisión | ATOMIC',
    description: 'Kits completos de cerco eléctrico Hagroy y JFL desde $89 + IVA. Monitoreo remoto, disuasión activa y garantía oficial.',
    images: ['/images/promociones/cercos-electricos-portada.jpg'],
  }
};

export default function CercosElectricosPage() {
  return <CercosClient />;
}
