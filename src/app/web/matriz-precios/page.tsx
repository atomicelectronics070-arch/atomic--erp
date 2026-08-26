import MatrizPreciosComponent from '@/components/MatrizPreciosComponent';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Matriz de Precios Vendedores & Catálogo | ATOMIC Database',
  description: 'Interfaz retro para consulta de catálogo masivo de productos, precios PVP y descuentos máximos para vendedores.',
};

export default function WebMatrizPreciosPage() {
  return (
    <MatrizPreciosComponent 
      isVendedorMode={true}
      title="LISTA DE PRECIOS PUBLICOS"
      subtitle="LISTA GENERAL DE PRODUCTOS"
      defaultTheme="bw-inv"
    />
  );
}
