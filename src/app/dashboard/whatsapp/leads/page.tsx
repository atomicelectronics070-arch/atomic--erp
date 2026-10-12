export const dynamic = 'force-dynamic'
export const revalidate = 0

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import PageClient from "./PageClient"

export default async function DynamicDashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        redirect("/login")
    }

    const role = String((session.user as any)?.role || "SALESPERSON").toUpperCase()
    const isAdministrative = role.includes("ADMIN") || role.includes("COORDINATOR") || role.includes("MANAGEMENT")

    // Solo administrativos tienen acceso a gestión de leads de WhatsApp
    if (!isAdministrative) {
        redirect("/dashboard/asistencia")
    }

    return <PageClient />
}
