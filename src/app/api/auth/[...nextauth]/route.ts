import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Handler for the NextAuth catch-all route
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
