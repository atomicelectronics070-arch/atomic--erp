import CarrosIndustrialesClient from './CarrosIndustrialesClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Equipos de Carga & Carros Industriales BP | ATOMIC Ecuador',
  description: 'Carros escaladores para gradas 80kg, plataformas multiuso plegables, zorras de carga pesada 200kg y carros porta herramientas para taller. Envíos a todo el Ecuador.',
  openGraph: {
    title: 'Catálogo Industrial de Carros de Carga & Taller | ATOMIC',
    description: 'Resistencia comprobada para trabajo pesado. Domina bodegas, talleres, escaleras y despachos.',
    images: ['/images/landing-carros/carro-escalador-80kg.jpg'],
  }
}

const BP_PRODUCT_IDS = [
  'cmmwxkyzt05zr86cq1s9mvvkp', // Carro Escalador 80KG
  'cmmwxkyzt05zq86cqv9e17dws', // Carro Multiuso Plataforma
  'cmmwxkyzt05zs86cqa707o7mn', // Carro Carga Industrial 200KG
  'cmmx2lf4602aibnt09pqie90g', // Carro Porta Herramientas 3 Niveles
  'cmmwxkyzt05zp86cqs9j2tss1'  // Carro Porta Cajas / Cilindros
]

export default async function CarrosIndustrialesLandingPage() {
  let dbProducts: any[] = []
  try {
    dbProducts = await prisma.product.findMany({
      where: {
        id: { in: BP_PRODUCT_IDS },
        isDeleted: false
      }
    })
  } catch (err) {
    console.warn('[CarrosIndustrialesLanding] Fallback to static catalog due to query timeout:', err)
  }

  return (
    <CarrosIndustrialesClient initialProducts={JSON.parse(JSON.stringify(dbProducts))} />
  )
}
