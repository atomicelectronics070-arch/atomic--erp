import { Metadata } from 'next';
import ServidoresClient from './PageClient';

export const metadata: Metadata = {
  title: 'Catálogo de Servidores Empresariales & Rack con Instalación | Atomic',
  description: 'Servidores Dell PowerEdge, HPE ProLiant y Supermicro con configuración, virtualización e instalación en sitio para empresas.',
};

export default function ServidoresPage() {
  return <ServidoresClient />;
}
