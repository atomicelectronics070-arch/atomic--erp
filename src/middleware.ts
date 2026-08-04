import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public academy — allow
    if (path.startsWith("/academy")) {
      return NextResponse.next()
    }
    
    // Role-based protection
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=Unauthorized", req.url))
    }

    if (path.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        if (path.startsWith("/academy")) {
          return true
        }
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/academy/:path*",
    "/api/products/:path*",
    "/api/users/:path*",
    "/api/whatsapp/:path*",
    "/api/crm/:path*",
  ],
}
