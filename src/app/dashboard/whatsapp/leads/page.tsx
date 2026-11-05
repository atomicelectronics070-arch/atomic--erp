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
    const userName = String(session.user?.name || "").toUpperCase()
    const userEmail = String(session.user?.email || "").toUpperCase()
    const isKevin = userName.includes("KEVIN") || userName.includes("KEVON") || userEmail.includes("KEVIN") || userEmail.includes("KEVON")
    const isAdministrative = role.includes("ADMIN") || role.includes("COORDINATOR") || role.includes("MANAGEMENT") || role.includes("CRM") || isKevin

    // Acceso administrativo o autorizado expresamente para gestión de leads
    if (!isAdministrative) {
        redirect("/dashboard/asistencia")
    }

    return <PageClient />
}
