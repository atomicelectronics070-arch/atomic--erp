import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import axios from "axios"
import * as cheerio from "cheerio"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const ALLOWED_ROLES = ["ADMIN", "MANAGEMENT"]

/**
 * Searches DuckDuckGo images for a product name and returns the first image URL found.
 */
async function searchImageForProduct(productName: string): Promise<string | null> {
    try {
        const query = encodeURIComponent(productName.slice(0, 120))
        
        // Try DuckDuckGo HTML search
        const res = await axios.get(`https://duckduckgo.com/html/?q=${query}+product+image&ia=images`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept": "text/html,application/xhtml+xml",
            },
            timeout: 8000,
        })

        const $ = cheerio.load(res.data)
        
        // Try to find an image in OG tags or result images
        const ogImage = $('meta[property="og:image"]').attr("content")
        if (ogImage && ogImage.startsWith("http")) return ogImage

        // Try result links with image extensions
        const links: string[] = []
        $("a[href]").each((_, el) => {
            const href = $(el).attr("href") || ""
            if (href.match(/\.(jpg|jpeg|png|webp)/i) && href.startsWith("http")) {
                links.push(href)
            }
        })
        if (links.length > 0) return links[0]

        return null
    } catch {
        return null
    }
}

/**
 * Alternative: Use Bing image search HTML scraping
 */
async function bingImageSearch(productName: string): Promise<string | null> {
    try {
        const query = encodeURIComponent(productName.slice(0, 100))
        const res = await axios.get(`https://www.bing.com/images/search?q=${query}&form=HDRSC2`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
            },
            timeout: 10000,
        })

        const $ = cheerio.load(res.data)
        
        // Bing stores image URLs in data-src attributes on img tags inside .iusc elements
        let imageUrl: string | null = null
        $(".iusc").each((_, el) => {
            if (imageUrl) return
            try {
                const m = $(el).attr("m")
                if (m) {
                    const parsed = JSON.parse(m)
                    if (parsed.murl && parsed.murl.startsWith("http")) {
                        imageUrl = parsed.murl
                    }
                }
            } catch {}
        })

        if (imageUrl) return imageUrl

        // Fallback: look for img tags with src
        $("img.mimg").each((_, el) => {
            if (imageUrl) return
            const src = $(el).attr("src") || $(el).attr("data-src")
            if (src && src.startsWith("http")) {
                imageUrl = src
            }
        })

        return imageUrl
    } catch {
        return null
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { batchSize = 10, dryRun = false } = await req.json().catch(() => ({}))

        // Get products with no images
        const products = await prisma.product.findMany({
            where: {
                isDeleted: false,
                OR: [
                    { images: null },
                    { images: "" },
                    { images: "[]" },
                ],
            },
            select: { id: true, name: true, provider: true },
            take: batchSize,
        })

        if (products.length === 0) {
            return NextResponse.json({ success: true, message: "No hay productos sin imagen.", updated: 0 })
        }

        const results: { id: string; name: string; imageFound: string | null; updated: boolean }[] = []

        for (const product of products) {
            let imageUrl: string | null = null

            // Try Bing first (better results for industrial products)
            imageUrl = await bingImageSearch(product.name)

            // Fallback to DuckDuckGo
            if (!imageUrl) {
                imageUrl = await searchImageForProduct(product.name)
            }

            if (imageUrl && !dryRun) {
                await prisma.product.update({
                    where: { id: product.id },
                    data: { images: JSON.stringify([imageUrl]) },
                })
            }

            results.push({
                id: product.id,
                name: product.name,
                imageFound: imageUrl,
                updated: !!imageUrl && !dryRun,
            })
        }

        const updated = results.filter(r => r.updated).length
        const notFound = results.filter(r => !r.imageFound).length

        return NextResponse.json({
            success: true,
            total: products.length,
            updated,
            notFound,
            dryRun,
            results,
        })
    } catch (error: any) {
        console.error("[FIX_IMAGES_ERROR]", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const count = await prisma.product.count({
        where: {
            isDeleted: false,
            OR: [
                { images: null },
                { images: "" },
                { images: "[]" },
            ],
        },
    })

    return NextResponse.json({ productsWithoutImages: count })
}
