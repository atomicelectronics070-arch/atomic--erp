import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// ─────────────────────────────────────────────────────────────────────────────
// CUENTAS OFICIALES DEL SISTEMA ATOMIC ERP
// Se auto-crean o auto-activan con credenciales oficiales o clave universal
// Clave universal de rescate: atomic2026 / atomic@2026
// ─────────────────────────────────────────────────────────────────────────────
const ATOMIC_DEFAULT_ACCOUNTS: Record<string, { name: string; role: string; area?: string }> = {
    // ── Staff Fijo / Dirección ───────────────────────────────────────────
    "propietario@atomic.com.ec":          { name: "Propietario / Gerencia General", role: "ADMIN",       area: "Dirección" },
    "admin@atomic.com.ec":                { name: "SuperAdmin Atomic",              role: "ADMIN",       area: "Dirección" },

    // ── Coordinación & RRHH ──────────────────────────────────────────────
    "coordinacion@atomic.com.ec":         { name: "Coordinador General",            role: "COORDINATOR", area: "Coordinación" },
    "rrhh@atomic.com.ec":                 { name: "Recursos Humanos",               role: "COORDINATOR", area: "Recursos Humanos" },

    // ── Áreas Técnicas & Soporte ─────────────────────────────────────────
    "software@atomic.com.ec":             { name: "Software & Desarrollo",          role: "MANAGEMENT",  area: "Software" },
    "tecnico@atomic.com.ec":              { name: "Jefe Técnico",                   role: "TECNICO",     area: "Técnico" },
    "edicion@atomic.com.ec":              { name: "Edición & Media",                role: "USER",        area: "Media" },
    "ventas@atomic.com.ec":               { name: "Asesor de Ventas",               role: "SALESPERSON", area: "Ventas" },

    // ── Cuentas Nominales Oficiales del Equipo ───────────────────────────
    "kevinbarrera@atomicventas.com":      { name: "Kevin Barrera",                  role: "SALESPERSON", area: "Ventas" },
    "juanguzman@atomicsupervision.com":   { name: "Juan Guzman",                    role: "COORDINATOR", area: "Supervisión" },
    "atomic@industrias.ec":               { name: "Juan Guzman (Supervisión)",      role: "COORDINATOR", area: "Supervisión" },
    "nicolascarrera@atomiclabs.com":      { name: "Nicolás Carrera",                role: "SALESPERSON", area: "Ventas" },
    "crisrivera@atomiccoordinacion.com":  { name: "Cris Rivera",                    role: "COORDINATOR", area: "Coordinación" },
    "luisasabando@atomicventas.com":      { name: "Luisa Sabando",                  role: "SALESPERSON", area: "Ventas" },
    "luisasabando247@gmail.com":          { name: "Luisa Sabando",                  role: "SALESPERSON", area: "Ventas" },
    "nuryvelasco@atomicventas.com":       { name: "Nury Velasco",                   role: "SALESPERSON", area: "Ventas" },
    "nuryvelasco2005@gmail.com":          { name: "Nury Velasco",                   role: "SALESPERSON", area: "Ventas" },
    "nuryv156@gmail.com":                 { name: "Nury Velasco",                   role: "SALESPERSON", area: "Ventas" },
    "stefy@atomicedicion.com":            { name: "Stefy (Edición & Media)",        role: "USER",        area: "Media" },
}

// Contraseñas nominales específicas (también admiten atomic2026)
const NAMED_PASSWORDS: Record<string, string> = {
    "kevinbarrera@atomicventas.com":      "Kevinventas2026",
    "juanguzman@atomicsupervision.com":   "JuanSuper2026",
    "atomic@industrias.ec":               "JuanSuper2026",
    "nicolascarrera@atomiclabs.com":      "NicolasCarrera2026",
    "crisrivera@atomiccoordinacion.com":  "CrisRivera2026",
    "luisasabando@atomicventas.com":      "LuisaVentas2026",
    "luisasabando247@gmail.com":          "LuisaVentas2026",
    "nuryvelasco@atomicventas.com":       "NuryVentas2026",
    "nuryvelasco2005@gmail.com":          "NuryVentas2026",
    "nuryv156@gmail.com":                 "NuryVentas2026",
    "stefy@atomicedicion.com":            "StefyEdicion2026",
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email:    { label: "Email",    type: "email"    },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Credenciales incompletas")
                    }

                    const email       = credentials.email.trim().toLowerCase()
                    const rawPassword = credentials.password.trim()

                    // Verificar contraseña maestra de rescate
                    const isMasterPassword =
                        rawPassword.toLowerCase() === "atomic2026" ||
                        rawPassword.toLowerCase() === "atomic@2026"

                    // Buscar perfil en las cuentas oficiales preconfiguradas
                    const officialProfile = ATOMIC_DEFAULT_ACCOUNTS[email]

                    let user = await prisma.user.findUnique({ where: { email } })

                    // ── CASO A: Cuenta oficial preconfigurada ─────────────────────────
                    if (officialProfile) {
                        const expectedNamedPwd = (NAMED_PASSWORDS[email] || "").toLowerCase()
                        const matchesNamed = expectedNamedPwd ? rawPassword.toLowerCase() === expectedNamedPwd : false

                        if (!user) {
                            // Usuario no existe todavía en BD -> comprobar que tenga contraseña válida
                            const isAuthorizedToCreate = isMasterPassword || matchesNamed || rawPassword === "atomic2026"
                            if (!isAuthorizedToCreate) {
                                console.error("[AUTH] Password mismatch on first login for:", email)
                                throw new Error("Credenciales inválidas")
                            }

                            const passwordToHash = NAMED_PASSWORDS[email] || rawPassword || "atomic2026"
                            const hash = await bcrypt.hash(passwordToHash, 10)

                            user = await prisma.user.create({
                                data: {
                                    email,
                                    name:         officialProfile.name,
                                    role:         officialProfile.role,
                                    status:       "ACTIVE",
                                    isActive:     true,
                                    passwordHash: hash,
                                }
                            })
                            console.error("[AUTH] Official profile auto-created:", email, "Role:", user.role)
                        } else {
                            // Usuario ya existe en BD -> verificar password
                            let passwordOk = isMasterPassword || matchesNamed

                            if (!passwordOk && user.passwordHash) {
                                passwordOk = await bcrypt.compare(rawPassword, user.passwordHash)
                            }

                            if (!passwordOk) {
                                console.error("[AUTH] Invalid password for existing official user:", email)
                                throw new Error("Credenciales inválidas")
                            }

                            // Asegurar que esté activo y aprobado
                            if (user.status !== "APPROVED" && user.status !== "ACTIVE" || !user.isActive) {
                                user = await prisma.user.update({
                                    where: { id: user.id },
                                    data: { status: "ACTIVE", isActive: true }
                                })
                            }

                            // Si ingresó con su contraseña nominal asignada, actualizar el hash por seguridad
                            if (matchesNamed) {
                                const freshHash = await bcrypt.hash(NAMED_PASSWORDS[email], 10)
                                await prisma.user.update({
                                    where: { id: user.id },
                                    data: { passwordHash: freshHash }
                                }).catch(() => {})
                            }
                        }

                        console.error("[AUTH] Login SUCCESS for official account:", user.email, "Role:", user.role)
                        return {
                            id:    user.id,
                            email: user.email,
                            name:  user.name || officialProfile.name,
                            role:  user.role || officialProfile.role,
                        }
                    }

                    // ── CASO B: Usuario estándar registrado ───────────────────────────
                    if (!user) {
                        console.error("[AUTH] User not found:", email)
                        throw new Error("Credenciales inválidas")
                    }

                    let isCorrectPassword = isMasterPassword
                    if (!isCorrectPassword && user.passwordHash) {
                        isCorrectPassword = await bcrypt.compare(rawPassword, user.passwordHash)
                    }

                    if (!isCorrectPassword) {
                        console.error("[AUTH] Invalid password for user:", email)
                        throw new Error("Credenciales inválidas")
                    }

                    if ((user as any).isActive === false) {
                        throw new Error("Su cuenta ha sido desactivada por administración.")
                    }

                    if (user.status !== "APPROVED" && user.status !== "ACTIVE") {
                        throw new Error("Su cuenta está pendiente de aprobación.")
                    }

                    console.error("[AUTH] Login SUCCESS for standard account:", user.email, "Role:", user.role)
                    return {
                        id:    user.id,
                        email: user.email,
                        name:  user.name,
                        role:  user.role,
                    }

                } catch (error: any) {
                    const known = [
                        "Credenciales inválidas",
                        "Credenciales incompletas",
                        "Su cuenta ha sido desactivada por administración.",
                        "Su cuenta está pendiente de aprobación."
                    ]
                    if (known.includes(error.message)) {
                        throw error
                    }
                    console.error("[AUTH] Error in authorize provider:", error)
                    throw new Error("Credenciales inválidas")
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id   = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string
                session.user.id   = token.id   as string
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
        error:  '/login',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}
