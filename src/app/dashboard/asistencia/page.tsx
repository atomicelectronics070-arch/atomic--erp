export const dynamic = 'force-dynamic'
export const revalidate = 0

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AttendanceClient from "./AttendanceClient"

export default async function AsistenciaPage() {
    const session = await getServerSession(authOptions)
    if (session) {
        const email = (session.user?.email || "").toLowerCase()
        const name = (session.user?.name || "").toLowerCase()
        const role = ((session.user as any)?.role || "").toUpperCase()
        const isAdmin = role.includes("ADMIN") || role.includes("COORDINATOR") || role.includes("MANAGEMENT")
        if ((email.includes("stefy") || name.includes("stefy") || email.includes("edicion")) && !isAdmin) {
            redirect("/dashboard/flash")
        }
    }

    return <AttendanceClient />
}
