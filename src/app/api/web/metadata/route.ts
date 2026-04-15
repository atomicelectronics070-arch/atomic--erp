import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const [categories, collections] = await Promise.all([
            prisma.category.findMany({ orderBy: { name: "asc" } }),
            prisma.collection.findMany({ orderBy: { name: "asc" } }),
        ])
        return NextResponse.json({ categories, collections })
    } catch (error) {
        console.error("Web metadata API error:", error)
        return NextResponse.json({ categories: [], collections: [] })
    }
}
