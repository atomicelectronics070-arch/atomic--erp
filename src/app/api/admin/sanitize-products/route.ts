import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sanitizeProductPrice, sanitizeProductImage } from "@/lib/productSanitizer"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        const userRole = (session?.user as any)?.role || ""
        const isAllowed = userRole === "ADMIN" || userRole === "MANAGEMENT" || userRole.includes("ADMIN")
        
        // Note: For convenience in development or admin calls, allow authenticated staff
        if (!session && process.env.NODE_ENV === "production") {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        // Fetch products with prices < $30 or with missing images
        const suspectProducts = await prisma.product.findMany({
            where: {
                isDeleted: false,
                OR: [
                    { price: { lt: 30 } },
                    { images: null },
                    { images: "[]" },
                    { images: "" }
                ]
            },
            select: {
                id: true,
                name: true,
                price: true,
                images: true,
                category: { select: { name: true } }
            },
            take: 200
        })

        let sanitizedCount = 0
        const details: any[] = []

        for (const p of suspectProducts) {
            const priceResult = sanitizeProductPrice(p.name, p.price, p.category?.name)
            const sanitizedImg = sanitizeProductImage(p.name, p.images, p.category?.name)

            const needsPriceUpdate = priceResult.isSanitized
            const needsImageUpdate = !p.images || p.images === "[]" || p.images === ""

            if (needsPriceUpdate || needsImageUpdate) {
                const dataToUpdate: any = {}
                if (needsPriceUpdate) dataToUpdate.price = priceResult.price
                if (needsImageUpdate) dataToUpdate.images = JSON.stringify([sanitizedImg])

                await prisma.product.update({
                    where: { id: p.id },
                    data: dataToUpdate
                })

                sanitizedCount++
                details.push({
                    id: p.id,
                    name: p.name,
                    oldPrice: p.price,
                    newPrice: needsPriceUpdate ? priceResult.price : p.price,
                    reason: priceResult.reason || "Imagen restaurada"
                })
            }
        }

        return NextResponse.json({
            success: true,
            sanitizedCount,
            totalInspected: suspectProducts.length,
            details: details.slice(0, 20)
        })
    } catch (e: any) {
        console.error("Error sanitizing products:", e)
        return NextResponse.json({ success: false, error: e.message }, { status: 500 })
    }
}
