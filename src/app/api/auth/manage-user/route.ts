export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/auth/manage-user?action=approve|reject&userId=xxx&token=yyy
 * 
 * Endpoint de acción directa — se envía por WhatsApp como link al admin.
 * No requiere sesión, usa token secreto de admin en la URL.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const action = searchParams.get("action")     // "approve" | "reject"
        const userId = searchParams.get("userId")
        const token  = searchParams.get("token")

        // Validar token de seguridad
        const validToken = process.env.ADMIN_ACTION_TOKEN || "atomic-admin-2026"
        if (token !== validToken) {
            return new Response(`
                <!DOCTYPE html>
                <html lang="es">
                <head><meta charset="UTF-8"><title>ATOMIC — Acceso Denegado</title>
                <style>body{background:#0a0a0a;color:#f87171;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}h1{font-size:2rem}p{color:#94a3b8;margin-top:1rem}</style>
                </head>
                <body><div><h1>🔒 Token Inválido</h1><p>El enlace de acción no es válido o ha expirado.</p></div></body>
                </html>
            `, { headers: { "Content-Type": "text/html" }, status: 403 })
        }

        if (!userId || !action) {
            return new Response(`
                <!DOCTYPE html>
                <html lang="es">
                <head><meta charset="UTF-8"><title>ATOMIC — Error</title>
                <style>body{background:#0a0a0a;color:#f87171;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}</style>
                </head>
                <body><div><h1>❌ Parámetros faltantes</h1></div></body>
                </html>
            `, { headers: { "Content-Type": "text/html" }, status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            return new Response(`
                <!DOCTYPE html>
                <html lang="es">
                <head><meta charset="UTF-8"><title>ATOMIC — Usuario no encontrado</title>
                <style>body{background:#0a0a0a;color:#f87171;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}</style>
                </head>
                <body><div><h1>⚠️ Usuario no encontrado</h1><p>El ID proporcionado no existe en la base de datos.</p></div></body>
                </html>
            `, { headers: { "Content-Type": "text/html" }, status: 404 })
        }

        if (action === "approve") {
            await prisma.user.update({
                where: { id: userId },
                data: { status: "APPROVED", isActive: true }
            })

            return new Response(`
                <!DOCTYPE html>
                <html lang="es">
                <head><meta charset="UTF-8"><title>ATOMIC — Cuenta Aprobada</title>
                <style>
                    body{background:#050d1a;color:#f1f5f9;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
                    .card{background:#0f172a;border:1px solid #10b981;border-radius:1.5rem;padding:2.5rem;text-align:center;max-width:400px;box-shadow:0 0 40px rgba(16,185,129,0.2)}
                    h1{color:#10b981;font-size:2rem;margin:0 0 0.5rem}
                    .name{font-size:1.2rem;color:#94a3b8;margin:0.5rem 0}
                    .email{font-size:0.9rem;color:#475569;margin-bottom:1.5rem}
                    .badge{display:inline-block;background:#10b98120;border:1px solid #10b981;color:#10b981;padding:0.3rem 1rem;border-radius:999px;font-size:0.75rem;font-weight:700;text-transform:uppercase}
                </style>
                </head>
                <body>
                    <div class="card">
                        <div style="font-size:3rem">✅</div>
                        <h1>Cuenta Aprobada</h1>
                        <p class="name">${user.name || "Usuario"}</p>
                        <p class="email">${user.email}</p>
                        <div class="badge">SALESPERSON · ACTIVO</div>
                        <p style="color:#64748b;font-size:0.8rem;margin-top:1.5rem">La cuenta ya está activa y el usuario puede iniciar sesión en ATOMIC ERP.</p>
                    </div>
                </body>
                </html>
            `, { headers: { "Content-Type": "text/html" }, status: 200 })
        }

        if (action === "reject") {
            await prisma.user.delete({ where: { id: userId } })

            return new Response(`
                <!DOCTYPE html>
                <html lang="es">
                <head><meta charset="UTF-8"><title>ATOMIC — Cuenta Rechazada</title>
                <style>
                    body{background:#050d1a;color:#f1f5f9;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
                    .card{background:#0f172a;border:1px solid #f43f5e;border-radius:1.5rem;padding:2.5rem;text-align:center;max-width:400px;box-shadow:0 0 40px rgba(244,63,94,0.2)}
                    h1{color:#f43f5e;font-size:2rem;margin:0 0 0.5rem}
                    .badge{display:inline-block;background:#f43f5e20;border:1px solid #f43f5e;color:#f43f5e;padding:0.3rem 1rem;border-radius:999px;font-size:0.75rem;font-weight:700;text-transform:uppercase;margin-top:1rem}
                </style>
                </head>
                <body>
                    <div class="card">
                        <div style="font-size:3rem">🗑️</div>
                        <h1>Cuenta Eliminada</h1>
                        <p style="color:#94a3b8">El usuario <strong>${user.name || "desconocido"}</strong> (${user.email}) ha sido eliminado del sistema.</p>
                        <div class="badge">RECHAZADO · ELIMINADO</div>
                        <p style="color:#64748b;font-size:0.8rem;margin-top:1.5rem">La cuenta fue removida permanentemente de ATOMIC ERP.</p>
                    </div>
                </body>
                </html>
            `, { headers: { "Content-Type": "text/html" }, status: 200 })
        }

        return NextResponse.json({ error: "Acción no válida. Use 'approve' o 'reject'." }, { status: 400 })

    } catch (error: any) {
        console.error("[manage-user] Error:", error)
        return new Response(`
            <!DOCTYPE html>
            <html><head><meta charset="UTF-8"><title>Error</title>
            <style>body{background:#0a0a0a;color:#f87171;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}</style>
            </head>
            <body><h1>❌ Error interno del servidor</h1></body>
            </html>
        `, { headers: { "Content-Type": "text/html" }, status: 500 })
    }
}
