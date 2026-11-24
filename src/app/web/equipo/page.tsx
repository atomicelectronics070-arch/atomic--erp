import EquipoClient from './EquipoClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Equipo Directivo & Liderazgo | ATOMIC Ecuador',
  description: 'Conoce al equipo directivo y fundadores de ATOMIC: Santiago Guzmán (Fundador & CEO) y Juan Pablo Guzmán (Director de Ventas & I+D). Respaldo institucional, tecnología e importación directa en Ecuador.',
  openGraph: {
    title: 'Equipo Directivo ATOMIC • Santiago Guzmán & Juan Pablo Guzmán',
    description: 'Dirección ejecutiva, desarrollo de software ERP, homologación técnica y distribución de hardware en Ecuador.',
    images: ['/logo.png']
  }
}

export default function EquipoPage() {
  return <EquipoClient />
}
