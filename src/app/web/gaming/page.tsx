import AtomicGamingClient from './AtomicGamingClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'ATOMIC Gaming • Consolas Certificadas con 2 Años de Garantía | PlayStation, Xbox & Nintendo',
  description: 'Nosotros nos encargamos de buscar las mejores consolas y tú confía en nosotros. Consolas de segunda mano 100% revisadas con pasta térmica nueva, estuches, controles originales y 2 años de garantía.',
  openGraph: {
    title: 'ATOMIC Gaming • Ecosistema de Consolas Certificadas',
    description: 'PlayStation 4 Slim 1TB, PS5, Switch y más con 2 años de garantía. Canal de YouTube & Blog Gaming.',
    images: ['/images/gaming/ps4-slim-1tb-god-of-war.jpg']
  }
}

export default async function GamingEcosystemPage() {
  let dbProducts: any[] = []
  try {
    dbProducts = await prisma.product.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        OR: [
          { sku: { startsWith: 'PS4-' } },
          { name: { contains: 'PlayStation', mode: 'insensitive' } },
          { name: { contains: 'PS4', mode: 'insensitive' } },
          { name: { contains: 'PS5', mode: 'insensitive' } },
          { provider: 'ATOMIC GAMING' },
          { category: { slug: 'gaming-consolas' } }
        ]
      },
      orderBy: { price: 'asc' }
    })
  } catch (e) {
    console.warn('[GamingEcosystemPage] Error loading products:', e)
  }

  return (
    <AtomicGamingClient initialProducts={JSON.parse(JSON.stringify(dbProducts))} />
  )
}
