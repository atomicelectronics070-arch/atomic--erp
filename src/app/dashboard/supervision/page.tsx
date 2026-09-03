import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import SupervisionClient from "./SupervisionClient"

export const dynamic = "force-dynamic"

export default async function SupervisionPage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const allowedRoles = ["ADMIN", "COORDINATOR", "COORD_ASSISTANT", "MANAGEMENT"]
    if (!allowedRoles.includes(session.user?.role as string)) {
        redirect("/dashboard")
    }

    return <SupervisionClient session={session} />
}
