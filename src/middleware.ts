import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (path.startsWith("/academy")) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (path.startsWith("/admin") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login?error=Unauthorized", req.url))
  }

  if (path.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const response = NextResponse.next()
  if (path.startsWith("/web")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Surrogate-Control", "no-store")
  }
  return response
}

export const config = {
  matcher: [
    "/web",
    "/web/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/academy/:path*",
    "/api/products/:path*",
    "/api/users/:path*",
    "/api/whatsapp/:path*",
    "/api/crm/:path*",
  ],
}
