import { Metadata } from 'next';
import IluminacionClient from './PageClient';

export const metadata: Metadata = {
  title: 'Iluminación de Lujo para Departamentos | Colección de Temporada | Atomic',
  description: 'Lámparas colgantes de diseño industrial, plafones modernos y pendientes individuales a costo mega reducido.',
};

export default function IluminacionPage() {
  return <IluminacionClient />;
}
