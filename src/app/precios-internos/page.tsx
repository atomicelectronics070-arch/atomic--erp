import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import MatrizPreciosComponent from "@/components/MatrizPreciosComponent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lista de Precios Públicos | ATOMIC System",
  description: "Consulta de lista de precios públicos y catálogo de productos para vendedores autorizados.",
};

export default async function PreciosInternosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/precios-internos");
  }

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


