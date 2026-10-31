import { Metadata } from "next"
import BarrerasDitecClient from "./BarrerasDitecClient"

export const metadata: Metadata = {
  title: "Barreras Vehiculares Automáticas Dítec Serie 2027 | ATOMIC Ecuador",
  description: "La cumbre de la ingeniería italiana en control de acceso vehicular de alto tráfico. Barrera Automática Dítec Serie 2027 ($1,928.90 precio especial de lanzamiento). Hasta 6 metros de mástil, motor Brushless de 24V de uso continuo (100% duty cycle), apertura ultrarrápida de 2 segundos y 3 años de garantía oficial ATOMIC.",
  keywords: [
    "barreras automaticas ditec ecuador",
    "ditec serie 2027",
    "control de acceso vehicular quito",
    "barreras vehiculares alto flujo",
    "barrera ditec 1928 dolares",
    "talanqueras de estacionamiento ditec",
    "atomic electronics ecuador"
  ],
  openGraph: {
    title: "Barrera Vehicular Automática Dítec Serie 2027 | El Futuro del Control de Acceso",
    description: "Ingeniería europea para condominios, centros comerciales, hospitales y complejos corporativos de alto tráfico vehicular en Ecuador.",
    images: [{ url: "/images/barreras/barrera-ditec-serie-2027-futuro.jpg" }]
  }
}

export default function BarrerasDitecPage() {
  return <BarrerasDitecClient />
}
