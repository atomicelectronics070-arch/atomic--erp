import { Metadata } from 'next';
import SoftwareQrClient from './PageClient';

export const metadata: Metadata = {
  title: 'Software de Control de Acceso por Códigos QR y Tickets | Atomic Systems',
  description: 'Sistema integral de control de acceso por QR y tickets para condominios, eventos, gimnasios y empresas. Registro de visitantes y reportes en tiempo real.',
};

export default function SoftwareQrPage() {
  return <SoftwareQrClient />;
}
