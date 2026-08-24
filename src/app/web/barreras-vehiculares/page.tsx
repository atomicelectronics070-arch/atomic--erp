export const dynamic = 'force-dynamic'
export const revalidate = 0

import BarrerasVehicularesClient from "./BarrerasVehicularesClient"

export const metadata = {
  title: "Barreras Vehiculares Automáticas & Control de Acceso | ATOMIC Ecuador",
  description: "Venta e instalación de barreras vehiculares automáticas para urbanizaciones, condominios, parqueaderos e industrias en todo el Ecuador. Hikvision, Dahua, ZKTeco, Ditec y Garen.",
}

export default function BarrerasVehicularesPage() {
  return <BarrerasVehicularesClient />
}
