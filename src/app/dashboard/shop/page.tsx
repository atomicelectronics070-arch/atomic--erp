import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import MatrizPreciosComponent from '@/components/MatrizPreciosComponent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Matriz de Precios ERP | ATOMIC System',
  description: 'Base de datos y matriz de precios unificada con soporte de roles dual admin / vendedores.',
};

export default async function ShopPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/shop');
  }

  return <MatrizPreciosComponent />;
}

