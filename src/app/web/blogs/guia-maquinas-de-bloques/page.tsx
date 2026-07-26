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
      if (isLock && price < 100) return false;
      return true;
    })
    .map(p => ({
      ...p,
      price: Number(p.price) || 0
    }));

  return (
    <div className="bg-[#030712] min-h-screen">
      {/* Navegación para volver a Blogs */}
      <nav className="fixed top-0 w-full z-50 p-6 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-[#030712]/90 to-transparent backdrop-blur-sm">
          <Link href="/web/blogs" className="group flex items-center space-x-2 text-white/50 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-none border border-white/10 flex items-center justify-center bg-slate-900/50 backdrop-blur-xl border-slate-700/50/5 group-hover:bg-slate-900/50 backdrop-blur-xl border-slate-700/50/10 transition-colors">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] shadow-black drop-shadow-md">Volver a Blogs</span>
          </Link>
          <div className="text-[10px] uppercase font-black tracking-[0.3em] text-orange-500 shadow-black drop-shadow-md">Maquinaria Industrial</div>
      </nav>

      <BlockMachineLanding products={blockMachines} />
    </div>
  )
}
