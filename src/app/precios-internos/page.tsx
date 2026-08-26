import MatrizPreciosComponent from "@/components/MatrizPreciosComponent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lista de Precios Públicos | ATOMIC System",
  description: "Consulta de lista de precios públicos y catálogo de productos.",
};

export default function PreciosInternosPage() {
  return (
    <MatrizPreciosComponent
      isVendedorMode={true}
      title="LISTA DE PRECIOS PUBLICOS"
      subtitle="LISTA GENERAL DE PRODUCTOS"
      allowPermanentDelete={false}
      defaultTheme="bw-inv"
    />
  );
}

