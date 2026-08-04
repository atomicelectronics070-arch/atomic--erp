import MatrizPreciosComponent from '@/components/MatrizPreciosComponent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Matriz de Precios & Productos | ATOMIC Database',
  description: 'Interfaz ultra rápida tipo base de datos retro para visualización masiva de productos, costos, precios de venta y margen de ganancia.',
};

export default function WebMatrizPreciosPage() {
  return <MatrizPreciosComponent />;
}
