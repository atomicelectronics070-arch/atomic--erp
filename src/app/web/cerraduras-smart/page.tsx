export const dynamic = 'force-dynamic'
export const revalidate = 0

import CerradurasSmartClient from "./CerradurasSmartClient"

export const metadata = {
  title: "Cerraduras Smart con Instalación en Ecuador | ATOMIC",
  description: "Catálogo completo de cerraduras inteligentes y control biométrico con instalación profesional en Quito, Sierra, Costa, Oriente y Galápagos. Red nacional de técnicos certificados.",
}

export default function CerradurasSmartPage() {
  return <CerradurasSmartClient />
}
