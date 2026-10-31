import { Metadata } from "next"
import MantenimientoGeneradoresClient from "./MantenimientoGeneradoresClient"

export const metadata: Metadata = {
  title: "Mantenimiento Preventivo y Reparación de Generadores Eléctricos | Domésticos e Industriales | ATOMIC Ecuador",
  description: "Servicio técnico especializado en mantenimiento preventivo, correctivo y reparación de generadores eléctricos residenciales e industriales a diésel y gasolina. Servicio básico desde $50.00 (limpieza, cambio de aceite y revisión integral). Tableros de transferencia ATS, diagnóstico de alternador y banco de pruebas en Quito y Ecuador.",
  keywords: [
    "mantenimiento generadores electricos ecuador",
    "reparacion plantas electricas quito",
    "mantenimiento generadores industriales",
    "generadores diesel gasolina 50 dolares",
    "servicio tecnico plantas de luz",
    "cambio de aceite generadores",
    "revision tableros ats",
    "atomic electronics soluciones energeticas"
  ],
  openGraph: {
    title: "Mantenimiento & Reparación de Generadores Eléctricos | Tu Energía Asegurada | ATOMIC",
    description: "Evita que un corte de luz paralice tu fábrica, clínica, servidor o residencia. Mantenimiento profesional certificado desde $50.",
    images: [{ url: "/images/generadores/mantenimiento-generadores-electricos-50.jpg" }]
  }
}

export default function MantenimientoGeneradoresPage() {
  return <MantenimientoGeneradoresClient />
}
