import CerradurasOfertaClient from './CerradurasOfertaClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Oferta Final de Año: Cerraduras Inteligentes WiFi con Entrega Inmediata | ATOMIC',
  description: 'Aprovecha las ofertas de final de año en cerraduras inteligentes Tuya Smart: Reconocimiento Facial 3D ($145), 5 Pistones con alarma ($89.80) y con Cámara integrada ($91). Entrega GRATIS en Quito y envíos a todo Ecuador.',
  openGraph: {
    title: 'Oferta Final de Año • Cerraduras Inteligentes Entrega Inmediata',
    description: 'Entrega GRATIS en Quito y envíos a todo Ecuador. Tecnología biométrica Tuya Smart desde $89.80 Inc. IVA.',
    images: ['/images/cerraduras/oferta-fin-ano/cerradura-facial-3d-5pistones-145.jpg']
  }
}

export default async function CerradurasOfertaPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: {
        sku: {
          in: [
            'CERRADURA-WIFI-FACIAL-3D',
            'CERRADURA-TUYA-WIFI-5PISTONES',
            'CERRADURA-WIFI-CAMARA-2PISTONES'
          ]
        }
      }
    })
  } catch (e) {
    console.warn('[CerradurasOfertaPage] Error cargando productos de DB:', e)
  }

  return (
    <CerradurasOfertaClient 
      products={products.length > 0 ? JSON.parse(JSON.stringify(products)) : []} 
    />
  )
}
