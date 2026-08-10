export const dynamic = 'force-dynamic'
export const revalidate = 0

import { prisma } from "@/lib/prisma"
import CPUsClient from "./CPUsClient"

export default async function CPUsPage() {

    // ── The only reliable filter: the product name STARTS WITH a processor prefix ──
    // "PROC." and "PROCESADOR" are catalog prefixes used exclusively for standalone CPUs.
    // Using `startsWith` instead of `contains` eliminates accessories, cables, TV sticks,
    // speakers, and any other product that merely MENTIONS the word CPU/Procesador.
    const rawProducts = await prisma.product.findMany({
        where: {
            isDeleted: false,
            isActive: true,
            OR: [
                // ── Primary catalog prefixes (most reliable) ──
                { name: { startsWith: 'PROC.', mode: 'insensitive' } },
                { name: { startsWith: 'PROCESADOR', mode: 'insensitive' } },
                { name: { startsWith: 'PROCESADORES', mode: 'insensitive' } },
                // ── Workstation & server processors (rarely prefixed with PROC.) ──
                { name: { startsWith: 'Threadripper', mode: 'insensitive' } },
                { name: { startsWith: 'EPYC', mode: 'insensitive' } },
                { name: { startsWith: 'Xeon', mode: 'insensitive' } },
            ],
        },
        orderBy: { price: 'desc' },
        take: 100,
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
