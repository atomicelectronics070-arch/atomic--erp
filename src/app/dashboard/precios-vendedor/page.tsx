import MatrizPreciosComponent from '@/components/MatrizPreciosComponent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Matriz de Precios Vendedores | ATOMIC System',
  description: 'Catálogo público general de productos, precios PVP y descuentos máximos para vendedores.',
};

export default function DashboardPreciosVendedorPage() {
  return <MatrizPreciosComponent isVendedorMode={true} />;
}
