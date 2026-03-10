import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import UserManagementClient from "./UserManagementClient"
import TeamsDashboard from "./TeamsDashboard"
import { ShieldCheck, Info } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
        redirect("/dashboard")
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        }
    })

    return (
        <div className="space-y-16 pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">
                        Gestión de <span className="text-orange-600">Equipos & Usuarios</span>
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm mt-1">Nivel Industrial: Control de acceso y estructura organizacional corporativa.</p>
                </div>
            </div>

            {/* Teams Management */}
            <div className="pt-10 border-t border-neutral-100">
                <TeamsDashboard isAdmin={session.user.role === "ADMIN"} />
            </div>

            {/* Detailed User Management */}
            <div className="pt-16 border-t border-neutral-100">
                <div className="flex items-center space-x-3 mb-8">
                    <ShieldCheck className="text-neutral-900" size={24} />
                    <h2 className="text-xl font-bold uppercase tracking-tight">Administración de Perfiles</h2>
                </div>
                {/* Fixed the prop name to match UserManagementClient expectation */}
                <UserManagementClient users={users as any} />
            </div>

            <div className="bg-neutral-900 p-8 flex items-start space-x-4">
                <Info className="text-orange-600 shrink-0" size={20} />
                <p className="text-xs text-neutral-500 leading-relaxed uppercase font-bold tracking-widest">
                    Seguridad: Toda acción de eliminación o cambio de rol queda registrada en el log de auditoría del sistema.
                </p>
            </div>
        </div>
    )
}



