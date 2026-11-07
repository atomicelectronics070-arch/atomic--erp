import HoraPowerBanksClient from './HoraPowerBanksClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Bancos de Carga 1Hora (20000 mAh & 5000 mAh MagSafe) | MultiTecnología V&V & ATOMIC',
  description: 'Bancos de carga portátiles 1Hora con 4 cables integrados (USB, V8, Tipo C, iPhone) a solo $27.10 y cargadores magnéticos MagSafe de 15W a $28.90. Distribución oficial MultiTecnología.',
  openGraph: {
    title: '1Hora • La Energía del Futuro • Carga Sin Límites',
    description: 'Bancos de carga 20000 mAh y cargadores magnéticos 15W MagSafe. Compra directa y envíos inmediatos en Ecuador.',
    images: ['/images/1hora/banco-20000-rojo-magsafe-combo.jpg']
  }
}

export default async function HoraPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: {
        isDeleted: false,
        isActive: true,
        OR: [
          { sku: { startsWith: '1H-' } },
          { name: { contains: '1HORA', mode: 'insensitive' } },
          { name: { contains: 'GAR159', mode: 'insensitive' } },
          { name: { contains: 'GAR276', mode: 'insensitive' } },
          { provider: 'MultiTecnologia V&V' }
        ]
      },
      orderBy: { price: 'asc' },
      take: 20
    })
  } catch (e) {
    console.warn('[HoraPage] Error fetching products:', e)
  }

  return (
    <HoraPowerBanksClient initialProducts={JSON.parse(JSON.stringify(products))} />
  )
}
