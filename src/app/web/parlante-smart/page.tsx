import { Metadata } from 'next';
import ParlanteSmartClient from './PageClient';

export const metadata: Metadata = {
  title: 'Parlante Smart Alto Rendimiento | Sonido Único Envolvente | Atomic',
  description: 'Parlante Smart de alta potencia con luces LED y sonido envolvente. ¡Por tu compra, audífonos Bluetooth a elección de regalo!',
};

export default function ParlanteSmartPage() {
  return <ParlanteSmartClient />;
}
