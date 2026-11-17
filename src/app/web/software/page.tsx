import SoftwarePageClient from './SoftwarePageClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Desarrollo de Software, Sistemas ERP & IA 2027 | ATOMIC Ecuador',
  description: 'Desarrollamos sistemas ERP a la medida, páginas web de alto rendimiento, facturación electrónica SRI y automatizaciones con Inteligencia Artificial para comercios y empresas.',
  openGraph: {
    title: 'ATOMIC Software & AI Solutions • Versión 2027',
    description: 'Sistemas ERP a medida, agentes inteligentes de WhatsApp y desarrollo web de alta conversión para todo tipo de negocios.',
    images: ['/images/software/atencion-bot-24-7.jpg']
  }
}

export default function SoftwarePage() {
  return <SoftwarePageClient />
}
