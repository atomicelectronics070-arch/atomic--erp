import { Metadata } from 'next';
import GeneradoresClient from './PageClient';

export const metadata: Metadata = {
  title: 'Generadores Eléctricos vs Gasolina | Combos con Paneles Solares | Atomic',
  description: 'Comparativa definitiva: Generadores solares ecológicos vs generadores a gasolina. Configura tu combo con paneles y accesorios.',
};

export default function GeneradoresPage() {
  return <GeneradoresClient />;
}
