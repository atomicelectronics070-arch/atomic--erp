import { Metadata } from 'next';
import MantenimientoConsolasClient from './PageClient';

export const metadata: Metadata = {
  title: 'Servicio Técnico & Mantenimiento de Consolas | Atomic Gaming',
  description: 'Mantenimiento preventivo, cambio de metal líquido, pasta térmica y reparación para PS5, PS4, Xbox Series X/S, Nintendo Switch y consolas retro. 10% OFF en servicios mayores a $80.',
};

export default function MantenimientoConsolasPage() {
  return <MantenimientoConsolasClient />;
}
