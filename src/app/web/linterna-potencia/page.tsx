import { Metadata } from 'next';
import LinternaClient from './PageClient';

export const metadata: Metadata = {
  title: 'Linterna Steren Alto Nivel Lumínico | Potencia Extrema | Atomic',
  description: 'Linterna de alta potencia Steren con mango ergonómico. Incluye paquete de baterías de obsequio.',
};

export default function LinternaPage() {
  return <LinternaClient />;
}
