import SolicitudesLandingClient from "./SolicitudesLandingClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Solicitudes de Landing • Proyectos y Seguridad | ATOMIC Dashboard",
  description: "Visualización y gestión de contactos generados desde la landing page y campañas de redes sociales."
}

export default function SolicitudesLandingPage() {
  return <SolicitudesLandingClient />
}
