import PanelesRanuradosClient from './PanelesRanuradosClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Paneles Ranurados WPC (2.90m x 16cm) | Remodelación de Interiores & Exteriores ATOMIC',
  description: 'Paneles ranurados WPC a solo $9.09 por panel. Acabados en Negro Mate, Bicolor Madera y Café Cálido. 100% impermeable, alta durabilidad. Retiro en Carapungo (Quito) y envíos a todo el Ecuador.',
  openGraph: {
    title: 'Paneles Ranurados WPC de 2.90m • Remodelaciones Modernas | ATOMIC',
    description: 'Transforma tus muros en minutos. Impermeable, cero mantenimiento, acabado arquitectónico de revista. $9.09 el panel.',
    images: ['/images/paneles-wpc/panel-wpc-negro.jpg'],
  }
}

export default async function PanelesRanuradosPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        OR: [
          { sku: { startsWith: 'WPC-' } },
          { name: { contains: 'WPC', mode: 'insensitive' } },
          { provider: 'ATOMIC ARQUITECTURA' }
        ]
      },
      orderBy: { price: 'asc' }
    })
  } catch (e) {
    console.warn('[PanelesRanuradosPage] Error loading products:', e)
  }

  return (
    <PanelesRanuradosClient initialProducts={JSON.parse(JSON.stringify(products))} />
  )
}
