import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("[AUTH] Attempting login for:", credentials?.email)
                
                if (!credentials?.email || !credentials?.password) {
                    console.log("[AUTH] Missing credentials")
                    throw new Error("Credenciales incompletas")
                }

                const email = credentials.email.trim().toLowerCase()
                
                const user = await prisma.user.findUnique({
                    where: { email }
                })

                if (!user) {
                    console.log("[AUTH] User not found in DB for email:", email)
                    throw new Error("Credenciales inválidas")
                }

                console.log("[AUTH] User found:", user.email, "Status:", user.status)

                if (!user.passwordHash) {
                    console.log("[AUTH] User has no password hash")
                    throw new Error("Credenciales inválidas")
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                )

                console.log("[AUTH] Password match result:", isCorrectPassword)

                if (!isCorrectPassword) {
                    throw new Error("Credenciales inválidas")
                }

                if (user.status !== "APPROVED" && user.status !== "ACTIVE") {
                    console.log("[AUTH] User status not allowed:", user.status)
                    throw new Error("Su cuenta está pendiente de aprobación o inactiva.")
                }

                console.log("[AUTH] Login successful for:", user.email)
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
