import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Common headers to mimic a real browser and bypass hotlink protection
const BROWSER_HEADERS = {
    "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Sec-Fetch-Dest": "image",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "cross-site",
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get("url")

    if (!url) {
        return new NextResponse("Missing url parameter", { status: 400 })
    }

    // Validate URL
    let parsedUrl: URL
    try {
        parsedUrl = new URL(url)
    } catch {
        return new NextResponse("Invalid URL", { status: 400 })
    }

    // Only allow http/https
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return new NextResponse("Invalid protocol", { status: 400 })
    }

    try {
        // Set the Referer to the same domain as the image to bypass same-origin hotlink checks
        const referer = `${parsedUrl.protocol}//${parsedUrl.hostname}/`

        const response = await fetch(url, {
            headers: {
                ...BROWSER_HEADERS,
                Referer: referer,
                Origin: referer,
            },
            // 8 second timeout
            signal: AbortSignal.timeout(8000),
        })

        if (!response.ok) {
            // Return a transparent 1x1 pixel on failure so UI shows placeholder instead of broken image
            return new NextResponse(
                Buffer.from(
                    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
                    "base64"
                ),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "image/png",
                        "Cache-Control": "public, max-age=60",
                    },
                }
            )
        }

        const contentType = response.headers.get("content-type") || "image/jpeg"
        const buffer = await response.arrayBuffer()

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                // Cache proxied images for 24 hours to reduce external requests
                "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
                "Access-Control-Allow-Origin": "*",
            },
        })
    } catch (err) {
        console.error("[img-proxy] Failed to fetch image:", url, err)
        // Return transparent pixel on error
        return new NextResponse(
            Buffer.from(
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
                "base64"
            ),
            {
                status: 200,
                headers: {
                    "Content-Type": "image/png",
                    "Cache-Control": "public, max-age=60",
                },
            }
        )
    }
}
