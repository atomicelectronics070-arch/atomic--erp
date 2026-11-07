import MonitoresClient from './MonitoresClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Monitores Gaming & Corporativos 120Hz/144Hz IPS | ATOMIC Ecuador',
  description: 'Monitores gamers ASUS, LG UltraGear, GIGABYTE y Dell profesionales distribuidos por Tecnomega. Precios oficiales con IVA y margen transparente. Despacho inmediato en Quito y envíos a todo Ecuador.',
  openGraph: {
    title: 'Monitores Gaming 144Hz e IPS Tecnomega • ATOMIC',
    description: 'ASUS VY279HGR 120Hz ($317.40), LG UltraGear 144Hz ($220.07), Gigabyte 170Hz ($261.19) y Dell Pro 20 ($182.82).',
    images: ['/images/monitores/monitor-asus-vy279hgr-27.png']
  }
}

export default async function MonitoresPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: {
        sku: {
          in: [
            'MONASUVY279HGR',
            'MONLGX24G411B-B',
            'MONLGX27G411A-B',
            'MONGIBGS24F14',
            'MONDELE2026H'
          ]
        }
      }
    })
  } catch (e) {
    console.warn('[MonitoresPage] Error cargando monitores de DB:', e)
  }

  return (
    <MonitoresClient 
      products={products.length > 0 ? JSON.parse(JSON.stringify(products)) : []} 
    />
  )
}
