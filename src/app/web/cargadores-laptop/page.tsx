import { Metadata } from 'next';
import CargadoresLaptopClient from './PageClient';

export const metadata: Metadata = {
  title: 'Cargadores de Laptop Originales & Compatibles | Precio de Distribuidor por 6 Unidades | Atomic',
  description: 'Cargadores para laptop Asus, HP, Dell, Lenovo, Apple y Acer. Compra 6 unidades y obtén precio de distribuidor con descuentos exclusivos.',
};

export default function CargadoresLaptopPage() {
  return <CargadoresLaptopClient />;
}
