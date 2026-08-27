import { Metadata } from 'next';
import PizarrasClient from './PageClient';

export const metadata: Metadata = {
  title: 'Pizarras Smart Interactivas 4K UHD ViewBoard 75" | Atomic Tech',
  description: 'Pizarra interactiva táctil 4K ViewBoard IFP7550-5F de 75 pulgadas con Android 11, 8GB RAM, 128GB ROM y WiFi. Para educación y salas de juntas ejecutivas.',
};

export default function PizarrasPage() {
  return <PizarrasClient />;
}
