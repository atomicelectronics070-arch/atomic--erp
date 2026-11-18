import AreaVentasClient from './AreaVentasClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Área de Ventas • Academia Comercial Softres & ATOMIC | Capítulos Oficiales',
  description: 'Serie de capacitación comercial oficial para vendedores de Softres y ATOMIC. Términos y condiciones, comisiones vs sueldo fijo ($450), plataforma de asistencia y técnicas de venta.',
  openGraph: {
    title: 'Área de Ventas • Capacitación Comercial Oficial',
    description: 'Programa oficial de inducción y metodología de ventas para el equipo de Softres y ATOMIC ERP.',
    images: ['https://img.youtube.com/vi/tFyDBikor4I/maxresdefault.jpg']
  }
}

export default function AreaVentasPage() {
  return <AreaVentasClient />
}
