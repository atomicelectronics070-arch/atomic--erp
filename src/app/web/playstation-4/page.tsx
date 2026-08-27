import { Metadata } from 'next';
import PlayStationClient from './PageClient';

export const metadata: Metadata = {
  title: 'PlayStation 4 Slim Reacondicionadas Certificadas | Atomic Gaming',
  description: 'PS4 Slim $325 USD con 2 años de garantía, 2 controles, parlante de regalo y mantenimiento preventivo gratuito.',
};

export default function PlayStationPage() {
  return <PlayStationClient />;
}
