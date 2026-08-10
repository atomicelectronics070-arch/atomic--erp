export const dynamic = 'force-dynamic'
export const revalidate = 0

import { prisma } from "@/lib/prisma"
import CPUsClient from "./CPUsClient"

export default async function CPUsPage() {

    // ── Fetch ONLY standalone processors – strict AND NOT exclusions ──────────
    // The DB has laptops/mini-PCs/barebones whose name also contains "Core i7" etc.
    // We use Prisma AND/NOT to eliminate them at query level, not just client-side.
    const rawProducts = await prisma.product.findMany({
        where: {
            isDeleted: false,
            isActive: true,
            AND: [
                // ── MUST match at least one explicit processor keyword ──
                {
                    OR: [
                        { name: { contains: 'Procesador', mode: 'insensitive' } },
                        { name: { contains: 'PROC.', mode: 'insensitive' } },
                        { name: { contains: ' CPU ', mode: 'insensitive' } },
                        { name: { startsWith: 'CPU ', mode: 'insensitive' } },
                        { name: { contains: 'Threadripper', mode: 'insensitive' } },
                        { name: { contains: 'EPYC', mode: 'insensitive' } },
                        { name: { contains: 'Xeon', mode: 'insensitive' } },
                    ],
                },
                // ── MUST NOT be a laptop / notebook ──
                { NOT: { name: { contains: 'laptop', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'notebook', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'portátil', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'portatil', mode: 'insensitive' } } },
                { NOT: { name: { startsWith: 'NOT.', mode: 'insensitive' } } },   // "NOT. LENOVO..."
                { NOT: { name: { startsWith: 'NOT ', mode: 'insensitive' } } },
                // ── MUST NOT be a mini-PC / barebone / desktop computer ──
                { NOT: { name: { contains: 'barebone', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'Barebones', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'SFF PC', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'NUC', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'Mini PC', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'MiniPC', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'AIO', mode: 'insensitive' } } },       // All-in-one
                { NOT: { name: { contains: 'ThinkCentre', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'ThinkBook', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'ThinkPad', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'computador', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'computadora', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'Mac Mini', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'MacBook', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'Mac Studio', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'iMac', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'Pro Slim', mode: 'insensitive' } } },  // Dell Pro Slim = mini PC
                { NOT: { name: { contains: 'Cubi', mode: 'insensitive' } } },      // MSI Cubi = barebone
                { NOT: { name: { contains: 'Industrial Pc', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'Dynabook', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'Lenovo', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'HP 15', mode: 'insensitive' } } },
                { NOT: { name: { contains: 'ASUS 90AR', mode: 'insensitive' } } }, // ASUS barebone SKU pattern
                { NOT: { name: { contains: 'COP.', mode: 'insensitive' } } },       // Computer prefix
                { NOT: { name: { contains: 'COP ', mode: 'insensitive' } } },
            ],
        },
        orderBy: { price: 'desc' },
        take: 80,
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            compareAtPrice: true,
            images: true,
            stock: true,
            sku: true,
            specs: true,
            category: { select: { id: true, name: true, slug: true } }
        }
    })

    const productsJSON = JSON.parse(JSON.stringify(rawProducts))

    return <CPUsClient dbProducts={productsJSON} />
}
