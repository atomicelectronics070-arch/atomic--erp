import { prisma } from "@/lib/prisma"
import BlockMachineLanding from "@/components/marketing/BlockMachineLanding"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: 'Guía Definitiva: Máquinas de Hacer Bloques | Atomic Corporate',
  description: 'Todo lo que necesitas saber sobre líneas de producción de bloques: tamaños, tipos, equipos incluidos y soporte técnico.',
}

export const dynamic = 'force-dynamic'

export default async function GuiaMaquinasBloquesPage() {
  // Buscar las máquinas de bloques
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'bloque', mode: 'insensitive' } },
        { name: { contains: 'block', mode: 'insensitive' } },
        { name: { contains: 'ladrillo', mode: 'insensitive' } }
      ]
    },
    select: { id: true, name: true, sku: true, price: true, description: true, images: true, category: { select: { name: true } } }
  });

  // Filtrar falsos positivos por si acaso (ej. candados o cosas que tengan 'bloque' pero no sean maquinas)
  const blockMachines = products
    .filter(p => {
      const n = p.name.toLowerCase();
      const isLock = n.includes('candado') || n.includes('construcción') || n.includes('esponja');
      const price = Number(p.price) || 0;
      if (price < 5000) return false; // Las verdaderas máquinas industriales cuestan más de $5,000
      return true;
    })
    .map(p => ({
      ...p,
      price: Number(p.price) || 0
    }));

  return (
    <div className="bg-white min-h-screen">
      {/* Navegación para volver a Blogs */}
      <nav className="fixed top-0 w-full z-50 p-6 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-white/90 to-transparent backdrop-blur-sm">
          <Link href="/web/blogs" className="group flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors">
              <div className="w-8 h-8 rounded-none border border-slate-200 flex items-center justify-center bg-white/50 backdrop-blur-xl group-hover:bg-slate-100 transition-colors">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-sm text-slate-700">Volver a Blogs</span>
          </Link>
          <div className="text-[10px] uppercase font-black tracking-[0.3em] text-orange-600 drop-shadow-sm">Maquinaria Industrial</div>
      </nav>

      <BlockMachineLanding products={blockMachines} />
    </div>
  )
}
