import { Metadata } from 'next';
import CamarasWifiClient from './PageClient';

export const metadata: Metadata = {
  title: 'Cámaras de Seguridad Wi-Fi a Batería & Exteriores IMOU 360° | Atomic Security',
  description: 'Cámaras de seguridad 100% Wi-Fi a batería y profesionales para exteriores con configuración e instalación incluida. Para garitas, locales, guarderías y residencias.',
};

export default function CamarasWifiPage() {
  return <CamarasWifiClient />;
}
