import { Metadata } from 'next';
import VideoporterosClient from './PageClient';

export const metadata: Metadata = {
  title: 'Videoporteros Smart DIEL 10" & EZVIZ HP7 Inalámbrico | Atomic Security',
  description: 'Kit videoportero DIEL 10" ($221.01) con botonera metálica antivandálica y EZVIZ HP7 ($199.99+IVA) táctil sin cables con RFID.',
};

export default function VideoporterosPage() {
  return <VideoporterosClient />;
}
