import { Metadata } from "next"
import BarraSonidoClient from "./BarraSonidoClient"

export const metadata: Metadata = {
  title: "Barra de Sonido Gamer Bluetooth 1 HORA BOC241N | Luces RGB & 3 Años Garantía | ATOMIC Ecuador",
  description: "Barra de sonido gamer 1 HORA BOC241N 10W. Sonido cristalino con bajos profundos, 8 modos de luz LED RGB, batería de 5h (2000 mAh), Bluetooth, AUX, USB y TF. Construcción americana con 3 años de garantía. ¡Precio lanzamiento $28.90 + IVA!",
  keywords: [
    "barra de sonido gamer",
    "soundbar bluetooth pc",
    "parlante gamer rgb",
    "boc241n 1 hora",
    "barra de sonido ecuador",
    "parlante para pc escritorio",
    "sonido gamer quito guayaquil",
    "atomic soundbar"
  ],
  openGraph: {
    title: "Barra de Sonido BOC241N 1 HORA | El Futuro del Sonido en tus Manos",
    description: "10W de potencia, 8 modos de luz RGB, batería de 2000 mAh y 3 años de garantía. ¡Solo $28.90 + IVA!",
    images: [{ url: "/images/audio/barra-sonido-boc241n-1hora-precio-28.jpg" }]
  }
}

export default function BarraSonidoPage() {
  return <BarraSonidoClient />
}
