import CreacionContenidoClient from './CreacionContenidoClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'ATOMIC Studio • Planes de Redes Sociales, Video y Audio, Remodelación de Logotipos y Catálogos',
  description: 'Planes mensuales para redes sociales con planeación y estrategia en video y audio, remodelación o creación de logotipos, refinación de imágenes para catálogos y consistencia de marca.',
  openGraph: {
    title: 'ATOMIC Studio • Contenido Estratégico (Video + Audio), Logotipos & Catálogos',
    description: 'Planes mensuales desde $100: estrategia de contenido con video y audio, remodelación de logotipo, refinación de productos para catálogo y consistencia de marca.',
    images: ['/images/atomic-studio/planes-mensuales-redes-sociales.jpg'],
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
