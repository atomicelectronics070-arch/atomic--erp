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
    const isAdministrative = role.includes("ADMIN") || role.includes("COORDINATOR") || role.includes("MANAGEMENT")

    // Los vendedores (SALESPERSON como Luisa, Kevin, Nicolas) no tienen acceso al CRM WhatsApp
    if (!isAdministrative) {
        redirect("/dashboard/asistencia")
    }

    return <WhatsAppCrmClient />
}
