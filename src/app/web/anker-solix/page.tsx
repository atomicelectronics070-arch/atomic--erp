import AnkerSolixClient from './AnkerSolixClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Anker SOLIX C300 | Generador 100% Eléctrico Silencioso (Entrega Gratis en Quito)',
  description: 'Generador portátil Anker SOLIX C300 a precio de oferta $380 (Normal $420). 288Wh, 300W, LiFePO4, 3 salidas AC, 140W USB-C, 3 años de garantía. Entrega gratis en Quito y envíos a todo Ecuador.',
  openGraph: {
    title: 'Anker SOLIX C300 • Autonomía Total para tu Hogar',
    description: 'Energía limpia, silenciosa y sin gasolina para apagones y viajes. Oferta $380 con Entrega Gratis en Quito.',
    images: ['/images/anker-solix/anker-solix-c300-hero-hogar.jpg']
  }
}

export default async function AnkerSolixPage() {
  let product: any = null
  try {
    product = await prisma.product.findFirst({
      where: {
        sku: 'ANKER-SOLIX-C300'
      }
    })
  } catch (e) {
    console.warn('[AnkerSolixPage] Error loading product:', e)
  }

  return (
    <AnkerSolixClient dbProduct={product ? JSON.parse(JSON.stringify(product)) : null} />
  )
}
