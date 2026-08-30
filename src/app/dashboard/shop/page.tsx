import MatrizPreciosComponent from '@/components/MatrizPreciosComponent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Matriz de Precios ERP | ATOMIC System',
  description: 'Base de datos y matriz de precios unificada con soporte de roles dual admin / vendedores.',
};

export default function ShopPage() {
  return <MatrizPreciosComponent />;
}
