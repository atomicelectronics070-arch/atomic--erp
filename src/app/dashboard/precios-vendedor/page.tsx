import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import MatrizPreciosComponent from '@/components/MatrizPreciosComponent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Matriz de Precios Vendedores | ATOMIC System',
  description: 'Catálogo público general de productos, precios PVP y descuentos máximos para vendedores.',
};

export default async function DashboardPreciosVendedorPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/precios-vendedor');
  }

  return <MatrizPreciosComponent isVendedorMode={true} />;
}

