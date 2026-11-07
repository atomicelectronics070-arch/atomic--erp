import AdataHd710Client from './AdataHd710Client'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Discos Duros Externos ADATA HD710 AntiShock & WaterResist | ATOMIC Ecuador',
  description: 'Discos duros externos blindados ADATA HD710 1TB ($148.12) y 2TB ($178.80) con certificación militar MIL-STD-810G e IP68 sumergible. Precios incluyen IVA. Envíos a todo el Ecuador.',
  openGraph: {
    title: 'ADATA HD710 1TB & 2TB • Máxima Resistencia Militar IP68',
    description: 'A prueba de caídas, agua y polvo. 1TB $148.12 y 2TB $178.80 Inc. IVA con entrega inmediata.',
    images: ['/images/adata-hd710/adata-hd710-1tb-amarillo.png']
  }
}

export default async function AdataHd710Page() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: {
        sku: {
          in: [
            'HDDADA1TBHD710Y',
            'HDDADA1TBHD710R',
            'HDDADA1TBHD710L',
            'HDDADA2TBHD710K',
            'HDDADA2TBHD710R'
          ]
        }
      }
    })
  } catch (e) {
    console.warn('[AdataHd710Page] Error cargando productos de DB:', e)
  }

  return (
    <AdataHd710Client 
      products={products.length > 0 ? JSON.parse(JSON.stringify(products)) : []} 
    />
  )
}
