import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const ATOMIC_DEFAULT_ACCOUNTS: Record<string, { name: string; role: string }> = {
    "ceo@atomic.com.ec": { name: "CEO / Gerencia General", role: "ADMIN" },
    "coordinacion@atomic.com.ec": { name: "Coordinación Operativa", role: "COORDINATOR" },
    "ventas@atomic.com.ec": { name: "Asesor Comercial Ventas", role: "SALESPERSON" },
    "desarrollo@atomic.com.ec": { name: "Desarrollo & Software", role: "MANAGEMENT" },
    "edicion@atomic.com.ec": { name: "Edición Audiovisual & Media", role: "USER" },
    "supervisor@atomic.com.ec": { name: "Supervisor de Calidad", role: "COORD_ASSISTANT" },
    "contabilidad@atomic.com.ec": { name: "Contabilidad & Finanzas", role: "MANAGEMENT" },
    "marketing@atomic.com.ec": { name: "Marketing & Pautas", role: "USER" },
    "investigacion@atomic.com.ec": { name: "Investigación & I+D", role: "USER" },
    "admin@atomic.com.ec": { name: "SuperAdmin Atomic", role: "ADMIN" },
    "atomic@administrador.com": { name: "Admin General", role: "ADMIN" },
    "atomic@cordinacion.com": { name: "Coordinador General", role: "COORDINATOR" },
    "atomic@industrias.ec": { name: "Coordinación Atomic", role: "ADMIN" },
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.error("[AUTH] Attempting login for:", credentials?.email)
                
                if (!credentials?.email || !credentials?.password) {
                    console.error("[AUTH] Missing credentials")
                    throw new Error("Credenciales incompletas")
                }

                const email = credentials.email.trim().toLowerCase()
                
                let user = await prisma.user.findUnique({
                    where: { email }
                })

                // Auto-provisioning para cuentas estándar @atomic.com.ec con clave atomic2026
                if (!user && ATOMIC_DEFAULT_ACCOUNTS[email]) {
                    const defaultProfile = ATOMIC_DEFAULT_ACCOUNTS[email]
                    const hash = await bcrypt.hash(credentials.password || "atomic2026", 10)
                    user = await prisma.user.create({
                        data: {
                            email,
                            name: defaultProfile.name,
                            role: defaultProfile.role,
                            status: "ACTIVE",
                            isActive: true,
                            passwordHash: hash
                        }
                    })
                    console.error("[AUTH] Auto-created standard atomic profile:", email)
                }

                if (!user) {
                    console.error("[AUTH] User not found in DB for email:", email)
                    throw new Error("Credenciales inválidas")
                }

                console.error("[AUTH] User found:", user.email, "Status:", user.status)

                let isCorrectPassword = false
                if (user.passwordHash) {
                    isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        user.passwordHash
                    )
                }

                // Fallback de rescate para contraseña genérica de equipo atomic2026
                if (!isCorrectPassword && (credentials.password === "atomic2026" || credentials.password === "atomic@2026")) {
                    isCorrectPassword = true
                }

                console.error("[AUTH] Password match result:", isCorrectPassword)

                if (!isCorrectPassword) {
                    throw new Error("Credenciales inválidas")
                }

                if ((user as any).isActive === false) {
                    console.error("[AUTH] User account is deactivated")
                    throw new Error("Su cuenta ha sido desactivada por administración.")
                }

                if (user.status !== "APPROVED" && user.status !== "ACTIVE") {
                    console.error("[AUTH] User status not allowed:", user.status)
                    throw new Error("Su cuenta está pendiente de aprobación.")
                }

                console.error("[AUTH] Login successful for:", user.email)
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string
                session.user.id = token.id as string
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}


