import CreacionContenidoClient from './CreacionContenidoClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'ATOMIC Studio • Creación de Contenido & Planes de Redes Sociales',
  description: 'Paquetes mensuales para Redes Sociales, producción audiovisual profesional y Mega Pack Creador de Contenido. La esencia de tu marca convertida en contenido que conecta y vende.',
  openGraph: {
    title: 'ATOMIC Studio • Innovación, Calidad y Rendimiento en Contenido',
    description: 'Tickets armados mensuales desde $100. Diseños para Facebook e Instagram, Reels virales y sesiones de fotografía y video profesional.',
    images: ['/images/atomic-studio/paquetes-creacion-contenido.jpg'],
  }
}

export default async function CreacionContenidoPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        OR: [
          { sku: { startsWith: 'STUDIO-' } },
          { provider: 'ATOMIC STUDIO' }
        ]
      },
      orderBy: { price: 'asc' }
    })
  } catch (e) {
    console.warn('[CreacionContenidoPage] Error loading studio products:', e)
  }

  return (
    <CreacionContenidoClient dbProducts={JSON.parse(JSON.stringify(products))} />
  )
}
