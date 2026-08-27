import { Metadata } from 'next';
import CamarasEspiaClient from './PageClient';

export const metadata: Metadata = {
  title: 'Línea de Cámaras Espía & Vigilancia Discreta | Atomic Security',
  description: 'Gafas con cámara Full HD, cargadores espía, percheros con cámara y micro dispositivos de seguridad invisible.',
};

export default function CamarasEspiaPage() {
  return <CamarasEspiaClient />;
}
