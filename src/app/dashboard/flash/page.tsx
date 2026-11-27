import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import FlashClient from "./FlashClient"

export const dynamic = "force-dynamic"

export default async function FlashPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const role = ((session.user as any)?.role || "").toUpperCase()
  const email = (session.user?.email || "").toLowerCase()
  const name = (session.user?.name || "").toLowerCase()

  const authorized =
    role.includes("ADMIN") ||
    role.includes("COORDINATOR") ||
    role.includes("MANAGEMENT") ||
    role.includes("EDICION") ||
    email.includes("stefy") ||
    name.includes("stefy") ||
    email.includes("edicion")

  if (!authorized) {
    redirect("/dashboard")
  }

  return <FlashClient />
}
