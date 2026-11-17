import ProyectosLandingClient from "./ProyectosLandingClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Proyectos de Tecnología, Residenciales & Edificios | ATOMIC Ecuador",
  description: "Ingeniería, suministro, instalación técnica y garantía para proyectos de seguridad electrónica, videoporteros para edificios, cerraduras biométricas, CCTV 4K y cercos eléctricos.",
  openGraph: {
    title: "Proyectos de Tecnología & Seguridad • ATOMIC Ecuador",
    description: "Sistemas de seguridad e infraestructura tecnológica para casas, edificios y empresas con cobertura nacional.",
    images: ["/images/categories/residencial.jpg"]
  }
}

export default function ProyectosPage() {
  return <ProyectosLandingClient />
}
