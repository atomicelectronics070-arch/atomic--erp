import { Metadata } from 'next';
import LuminariasSolaresClient from './PageClient';

export const metadata: Metadata = {
  title: 'Luminarias Solares Autónomas & Luces LED | Atomeca Industria',
  description: 'Luminarias solares de 300W ($43), 600W ($54) y 800W ($66) con panel solar integrado y control remoto. Alumbrado exterior autónomo.',
};

export default function LuminariasSolaresPage() {
  return <LuminariasSolaresClient />;
}
