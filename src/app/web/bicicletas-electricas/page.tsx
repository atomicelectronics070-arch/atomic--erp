import { Metadata } from 'next';
import BicicletasClient from './PageClient';

export const metadata: Metadata = {
  title: 'Bicicletas Eléctricas Shimano & Montaña | Oferta Verano 25% - 40% OFF | Atomic',
  description: 'Bicicletas eléctricas de alta potencia Shimano R8014, Montaña 26" y Plegables urbanas. Descuento de verano del 25% y 40% para estudiantes.',
};

export default function BicicletasPage() {
  return <BicicletasClient />;
}
