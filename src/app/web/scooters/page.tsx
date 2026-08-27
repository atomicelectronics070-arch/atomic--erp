import { Metadata } from 'next';
import ScootersClient from './PageClient';

export const metadata: Metadata = {
  title: 'Scooters Eléctricos Smart & Segway Ninebot | Atomic Mobility',
  description: 'Movilidad inteligente en Ecuador: Segway Ninebot F25 ($489), KickScooter ES1L ($412) y KickScooter E12 ($269). Envíos a todo el país.',
};

export default function ScootersPage() {
  return <ScootersClient />;
}
