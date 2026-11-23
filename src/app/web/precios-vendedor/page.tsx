export const dynamic = 'force-dynamic'
export const revalidate = 0

import PageClient from './PageClient'

export const metadata = {
  title: 'Portal Maestro de Vendedores, PVPs & Políticas | ATOMIC 2026',
  description: 'Matriz de precios públicos, políticas de entrega, cuentas bancarias, distribución y 100 mensajes de cierre.',
}

export default function PreciosVendedorPage() {
  return <PageClient />
}
