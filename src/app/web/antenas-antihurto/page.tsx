import { Metadata } from "next"
import AntenasAntihurtoClient from "./AntenasAntihurtoClient"

export const metadata: Metadata = {
  title: "Antenas Anti-Hurto para Locales Comerciales & Retail | ¡No Dejes Que Te Roben! | ATOMIC Ecuador",
  description: "Sistemas antihurto profesionales para tiendas de ropa, calzado, farmacias, ópticas y locales de electrónica en Ecuador. Kit Dual Antenas RF ($576.00) y Kit Acrílico Premium Dual ($745.00). Detección precisa de tags rígidos, alarmas sonoras y lumínicas de alta potencia. 3 años de garantía ATOMIC.",
  keywords: [
    "antenas anti hurto ecuador",
    "no dejes que te roben",
    "antenas eas para ropa",
    "sensores antihurto quito",
    "antenas retail 576 dolares",
    "antenas acrilicas 745 dolares",
    "seguridad para tiendas de ropa",
    "atomic electronics ecuador"
  ],
  openGraph: {
    title: "¡No Dejes Que Te Roben! Antenas Anti Hurto para Locales | ATOMIC Ecuador",
    description: "Protege tu mercadería e inversión con sistemas de detección por radiofrecuencia y acrílicos de lujo para tiendas.",
    images: [{ url: "/images/antihurto/antenas-antihurto-par-576.jpg" }]
  }
}

export default function AntenasAntihurtoPage() {
  return <AntenasAntihurtoClient />
}
