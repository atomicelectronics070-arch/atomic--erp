import { Metadata } from "next"
import CamarasExteriorClient from "./CamarasExteriorClient"

export const metadata: Metadata = {
  title: "Cámaras de Seguridad Exterior Wi-Fi e Inalámbricas IP66 | ATOMIC Ecuador",
  description: "Cámaras profesionales para intemperie con visión nocturna a color, doble lente 360°, kits con NVR y sirena disuasiva activa. Doble Lente IP81 ($63.77), IMOU Cruiser Triple 11MP ($135.00), ATOMIC Combo Kit NVR ($95.00), Cámara Exterior Wi-Fi ($47.82) e IMOU Titan Pro Aurora ($115.00). 3 años de garantía oficial.",
  keywords: [
    "camaras de seguridad exterior ecuador",
    "camaras wifi intemperie",
    "imou cruiser triple ecuador",
    "imou titan pro aurora",
    "kit camaras nvr wifi",
    "camaras ip66 vision nocturna color",
    "seguridad perimetral exterior",
    "atomic ecuador"
  ],
  openGraph: {
    title: "Cámaras de Seguridad Exterior Wi-Fi e Intemperie IP66 | ATOMIC Electronics",
    description: "Protección perimetral inteligente para casas, quintas, condominios y locales comerciales con visión nocturna full color y sirena integrada.",
    images: [{ url: "/images/camaras-exterior/camara-imou-cruiser-triple-11mp.jpg" }]
  }
}

export default function CamarasExteriorPage() {
  return <CamarasExteriorClient />
}
