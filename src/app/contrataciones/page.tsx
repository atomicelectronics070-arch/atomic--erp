import { Metadata } from 'next';
import ContratacionesClient from './ContratacionesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Plan Laboral 30 Días | Convocatoria Oficial de Contratación ATOMIC',
  description: 'Plan oficial de contratación para asesores comerciales en ATOMIC. 7 actividades ordinarias, dedicación de 2 horas al día, remuneración escalonada ($100 a $450 fijos) y especialización por categoría.',
  openGraph: {
    title: 'Plan Laboral 30 Días | Convocatoria Oficial de Contratación ATOMIC',
    description: 'Convocatoria oficial de empleo y capacitación en ventas ATOMIC: 7 actividades ordinarias, 2h/día, comisiones y sueldo fijo progresivo.',
    type: 'website',
  },
};

export default function ContratacionesPage() {
  return <ContratacionesClient />;
}
