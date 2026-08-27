import { Metadata } from 'next';
import TiendaOnlineClient from './PageClient';

export const metadata: Metadata = {
  title: 'Impulsa tu Negocio con tu Propia Tienda en Línea | Atomic Web Development',
  description: 'Creamos tu tienda online y catálogo digital desde Quito (El Labrador). Gestiona inventario, pedidos y pagos directamente desde tu celular.',
};

export default function TiendaOnlinePage() {
  return <TiendaOnlineClient />;
}
