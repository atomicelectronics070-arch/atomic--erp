import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// Map specific routes to allowed roles
const roleProtection: Record<string, string[]> = {
    "/dashboard/admin": ["ADMIN"],
    "/dashboard/sales": ["ADMIN", "MANAGEMENT", "SALESPERSON"],
    "/dashboard/coordinator": ["ADMIN", "MANAGEMENT", "COORDINATOR", "COORD_ASSISTANT"],
    "/dashboard/editor": ["ADMIN", "MANAGEMENT", "EDITOR"],
}

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        if (!token) return NextResponse.redirect(new URL("/login", req.url))

        const userRole = token.role as string

        // Check against role protection map
        for (const [route, allowedRoles] of Object.entries(roleProtection)) {
            if (path.startsWith(route)) {
                if (!allowedRoles.includes(userRole)) {
                    return NextResponse.redirect(new URL("/dashboard", req.url))
                }
            }
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        }
    }
)

export const config = {
    matcher: ["/dashboard/:path*"],
}
