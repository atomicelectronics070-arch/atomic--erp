import TorniquetesClient from './TorniquetesClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Torniquetes Peatonales & Control de Acceso | ATOMIC Security',
  description: 'Catálogo especializado de torniquetes trípode, molinetes, puertas de vidrio flap barrier y control de acceso biométrico.',
}

export default async function TorniquetesLandingPage() {
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
      isActive: true,
      OR: [
        { name: { contains: 'torniquete', mode: 'insensitive' } },
        { name: { contains: 'molinete', mode: 'insensitive' } },
        { name: { contains: 'bracket', mode: 'insensitive' } },
        { name: { contains: 'fotosensor', mode: 'insensitive' } },
        { name: { contains: 'bobina', mode: 'insensitive' } }
      ]
    },
    orderBy: { price: 'desc' }
  })

  return <TorniquetesClient initialProducts={JSON.parse(JSON.stringify(products))} />
}
