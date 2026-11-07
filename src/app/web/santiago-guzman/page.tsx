import SantiagoGuzmanClient from './SantiagoGuzmanClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Santiago Guzmán | Fundador & CEO | ATOMIC Ecuador',
  description: 'Perfil oficial y visión estratégica de Santiago Guzmán: Liderazgo tecnológico, desarrollo de arquitectura ERP, infraestructura de distribución en Ecuador e innovación.',
  openGraph: {
    title: 'Santiago Guzmán • Fundador & CEO ATOMIC',
    description: 'Liderazgo tecnológico, infraestructura de distribución de hardware de alto rendimiento y arquitectura empresarial en ATOMIC Ecuador.',
    images: ['/logo.png']
  }
}

export default function SantiagoGuzmanPage() {
  return <SantiagoGuzmanClient />
}
