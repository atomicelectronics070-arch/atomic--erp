import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import MatrizPreciosComponent from '@/components/MatrizPreciosComponent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Lista General de Productos & Precios Públicos | ATOMIC System',
  description: 'Catálogo de productos y precios PVP autorizados para vendedores y asesores comerciales.',
};

export default async function WebMatrizPreciosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?callbackUrl=/web/matriz-precios');
  }

  return (
    <MatrizPreciosComponent 
      isVendedorMode={true}
      title="LISTA DE PRECIOS PUBLICOS"
      subtitle="LISTA GENERAL DE PRODUCTOS"
      defaultTheme="bw-inv"
    />
  );
}

