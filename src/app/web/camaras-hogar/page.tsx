import { Metadata } from "next"
import CamarasHogarClient from "./CamarasHogarClient"

export const metadata: Metadata = {
  title: "Cámaras para Hogar 4K, 3K y 3MP con Garantía de 2 Años | ATOMIC Ecuador",
  description: "Cámaras de seguridad inteligentes 100% Wi-Fi sin cables para el hogar. Modelos Básica 3MP ($44.99), Avanzada 3K ($64.99) y Premium 4K ($78.99) con Garantía de 2 Años y opción de instalación a nivel nacional.",
  keywords: ["camaras de seguridad", "camaras wifi", "camaras 4k hogar", "ezviz ecuador", "camaras 360", "seguridad residencial", "atomic camaras"],
  openGraph: {
    title: "Cámaras para Hogar de Alta Calidad 4K con Garantía de 2 Años | ATOMIC",
    description: "Seguridad inteligente, tranquilidad total. Cámaras Wi-Fi con visión nocturna a color, detección IA y audio bidireccional.",
    images: [{ url: "/banners/camaras-hogar-portada-4k.jpg" }]
  }
}

export default function CamarasHogarPage() {
  return <CamarasHogarClient />
}
