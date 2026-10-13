export const dynamic = 'force-dynamic'
export const revalidate = 0

import PublicInformeClient from "./PublicInformeClient"

export const metadata = {
    title: "Informe Técnico IT-2026-1012-DOMUM-01 | DOMUM CONSTRUCCIONES",
    description: "Informe Técnico de Inspección en Sitio y Factibilidad de Barreras Herméticas DITEC, Adecuación de Circuito Independiente y Bases Metálicas. ATOMIC ERP.",
}

export default function InformePublicoPage() {
    return <PublicInformeClient />
}
