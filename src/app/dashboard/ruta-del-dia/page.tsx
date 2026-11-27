import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import RutaDelDiaWorkspace from "@/components/tools/RutaDelDiaWorkspace"

export const dynamic = "force-dynamic"

export default async function RutaDelDiaPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const role = ((session.user as any)?.role || "").toUpperCase()
  const email = (session.user?.email || "").toLowerCase()
  const name = (session.user?.name || "").toLowerCase()
  const isAdmin = role.includes("ADMIN") || role.includes("COORDINATOR") || role.includes("MANAGEMENT")
  const isStefy = role.includes("EDICION") || email.includes("stefy") || name.includes("stefy") || email.includes("edicion")

  if (isStefy && !isAdmin) {
    redirect("/dashboard/flash")
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white rounded-3xl border border-slate-800/80 overflow-hidden p-2 sm:p-4">
      <RutaDelDiaWorkspace embedded={true} isOpen={true} />
    </div>
  )
}
