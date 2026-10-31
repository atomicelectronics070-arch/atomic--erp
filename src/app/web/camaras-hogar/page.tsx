import { Metadata } from "next"
import CamarasHogarClient from "./CamarasHogarClient"

export const metadata: Metadata = {
  title: "Cámaras de Seguridad para Hogar 360° Wi-Fi | Cuida a tus Hijos y Familia | ATOMIC Ecuador",
  description: "Cámaras inteligentes 100% Wi-Fi para interiores de casa. IMOU Ranger 3MP ($35.80), IMOU Mini PT Full Color ($39.10), Doble Lente 360° ($42.50) y EZVIZ H6C ($43.99). Monitoreo en vivo desde tu celular, audio bidireccional y visión nocturna sin mensualidades.",
  keywords: [
    "camaras para hogar",
    "camaras para bebes ecuador",
    "camara wifi interior",
    "ezviz h6c ecuador",
    "imou ranger 3mp",
    "imou mini pt full color",
    "camara doble lente 360",
    "seguridad para amas de casa",
    "atomic ecuador"
  ],
  openGraph: {
    title: "Cámaras Inteligentes para el Hogar | Tranquilidad Total para Mamá y Familia",
    description: "Vigila a tus hijos, mascotas y hogar desde cualquier lugar con audio bidireccional y visión 360° sin costos mensuales.",
    images: [{ url: "/images/camaras/camara-ezviz-h6c-3mp-pauta.jpg" }]
  }
}

export default function CamarasHogarPage() {
  return <CamarasHogarClient />
}
