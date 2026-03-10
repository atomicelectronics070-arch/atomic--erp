import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import * as cheerio from "cheerio"
import axios from "axios"

const ALLOWED_ROLES = ["ADMIN", "MANAGEMENT", "COORDINATOR", "COORD_ASSISTANT"]

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !ALLOWED_ROLES.includes(session.user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { url, selectors, useJs } = await req.json()
        const domain = new URL(url).hostname

        // Create history record
        const history = await prisma.extractionHistory.create({
            data: {
                url,
                domain,
                status: "PROCESSING"
            }
        })

        if (useJs) {
            // Update status before returning
            await prisma.extractionHistory.update({
                where: { id: history.id },
                data: { status: "ERROR", errorMessage: "JS rendering not available in this mode." }
            })
            return NextResponse.json({
                error: "El modo JavaScript requiere un servicio de renderizado separado. Usa el modo estático (sin JS).",
                historyId: history.id
            }, { status: 400 })
        }

        // Static scraping with Cheerio
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            },
            timeout: 15000
        })
        const $ = cheerio.load(response.data)

        // Extract based on selectors
        const result: Record<string, any> = {}
        if (selectors?.title) result.title = $(selectors.title).first().text().trim()
        if (selectors?.price) result.price = $(selectors.price).first().text().trim()
        if (selectors?.description) result.description = $(selectors.description).first().text().trim()
        if (selectors?.sku) result.sku = $(selectors.sku).first().text().trim()

        // Auto-extract title and description as fallback
        if (!result.title) result.title = $("title").first().text().trim() || $("h1").first().text().trim()
        if (!result.description) result.description = $('meta[name="description"]').attr("content") || ""

        // Image extraction
        if (selectors?.images) {
            const imgs: string[] = []
            $(selectors.images).each((_i, el) => {
                const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src')
                if (src) imgs.push(src)
            })
            result.images = imgs
        }

        // Update history
        await prisma.extractionHistory.update({
            where: { id: history.id },
            data: {
                status: "COMPLETED",
                itemCount: 1
            }
        })

        return NextResponse.json({ result, historyId: history.id })

    } catch (error: any) {
        console.error("Scraping error:", error)
        return NextResponse.json({ 
            error: `Error al extraer datos: ${error.message}. Verifica que la URL sea accesible.` 
        }, { status: 500 })
    }
}
