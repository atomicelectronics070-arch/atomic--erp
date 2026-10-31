import { Metadata } from "next"
import PorteroMultifuncionClient from "./PorteroMultifuncionClient"

export const metadata: Metadata = {
  title: "Portero Eléctrico Multifunción ZKTeco con App Móvil | ATOMIC Ecuador",
  description: "Videoportero y control de acceso inteligente ZKTeco por solo $198.99. Múltiples métodos de verificación: 3000 tarjetas RFID, 3000 huellas dactilares, 1500 rostros, 150,000 eventos. Conexión Wi-Fi, videollamada y apertura remota desde la App ZKBio Zlink GRATIS.",
  keywords: [
    "portero multifuncion zkteco",
    "videoportero biometrico facial",
    "zkbio zlink gratis ecuador",
    "control de acceso huella tarjeta rostro",
    "citofono wifi con app",
    "portero electrico 198 dolares",
    "atomic electronics ecuador"
  ],
  openGraph: {
    title: "Portero Multifunción ZKTeco con Reconocimiento Facial y App Móvil | ATOMIC",
    description: "Desbloquea por rostro, huella, tarjeta o App ZKBio Zlink. Capacidad masiva para 1500 rostros y apertura de chapa a distancia por $198.99.",
    images: [{ url: "/images/porteros/portero-inteligente-app-movil-198.jpg" }]
  }
}

export default function PorteroMultifuncionPage() {
  return <PorteroMultifuncionClient />
}
