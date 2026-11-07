import JuanPabloGuzmanClient from './JuanPabloGuzmanClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Juan Pablo Guzmán | Las 48 Leyes del Poder & Crecimiento Viral | ATOMIC',
  description: 'Serie de videos y análisis estratégico de Juan Pablo Guzmán: Las 48 Leyes del Poder (Ley 1 y Ley 2 desbloqueadas) y Estrategia de Crecimiento Viral y Fidelización con tarjetas digitales.',
  openGraph: {
    title: 'Juan Pablo Guzmán • Las 48 Leyes del Poder',
    description: 'Análisis de poder, psicología histórica y crecimiento para negocios locales con Juan Pablo Guzmán.',
    images: ['/videos/juan-pablo-guzman/poster-ley-1.jpg']
  }
}

export default function JuanPabloGuzmanPage() {
  return <JuanPabloGuzmanClient />
}
