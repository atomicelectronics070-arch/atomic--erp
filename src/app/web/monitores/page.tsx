import { Metadata } from 'next';
import MonitoresClient from './PageClient';

export const metadata: Metadata = {
  title: 'Monitores Dahua & Pantallas LED para Oficina y CCTV | Atomic',
  description: 'Monitores Dahua DH-LM19-L200 LED de bajo consumo, resolución HD 1600x900 y entradas HDMI/VGA. Diseñados para trabajo 24/7.',
};

export default function MonitoresPage() {
  return <MonitoresClient />;
}
