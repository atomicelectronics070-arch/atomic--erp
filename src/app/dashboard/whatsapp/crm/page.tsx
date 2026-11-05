export const dynamic = 'force-dynamic';

import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import WhatsAppCrmClient from "./WhatsAppCrmClient"

export const metadata: Metadata = {
    title: "WhatsApp CRM Cloud | Atomic ERP",
    description: "Gestión avanzada de clientes mediante WhatsApp",
}

export default async function WhatsappCrmPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        redirect("/login")
    }

    const role = String((session.user as any)?.role || "SALESPERSON").toUpperCase()
    const userName = String(session.user?.name || "").toUpperCase()
    const userEmail = String(session.user?.email || "").toUpperCase()
    const isKevin = userName.includes("KEVIN") || userName.includes("KEVON") || userEmail.includes("KEVIN") || userEmail.includes("KEVON")
    const isAdministrative = role.includes("ADMIN") || role.includes("COORDINATOR") || role.includes("MANAGEMENT") || role.includes("CRM") || isKevin

    // Acceso restringido: Administrativos, Coordinación y Kevin (habilitado expresamente para atención y respuesta de CRM)
    if (!isAdministrative) {
        redirect("/dashboard/asistencia")
    }

    return <WhatsAppCrmClient />
}
