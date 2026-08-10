export const dynamic = 'force-dynamic'
export const revalidate = 0

import { prisma } from "@/lib/prisma"
import CPUsClient from "./CPUsClient"

export default async function CPUsPage() {

    // ── STRICT CPU-only query ──────────────────────────────────────────────────
    // Only fetch products whose NAME explicitly identifies them as a processor.
    // We do NOT query by category (too broad) – just the product name.
    const rawProducts = await prisma.product.findMany({
        where: {
            isDeleted: false,
            isActive: true,
            OR: [
                // Explicit "Procesador" keyword  
                { name: { contains: 'Procesador', mode: 'insensitive' } },
                // Explicit "CPU" keyword
                { name: { contains: ' CPU', mode: 'insensitive' } },
                // Core i-series  (e.g. "Core i9", "Core i7", "Core i5", "Core i3")
                { name: { contains: 'Core i9', mode: 'insensitive' } },
                { name: { contains: 'Core i7', mode: 'insensitive' } },
                { name: { contains: 'Core i5', mode: 'insensitive' } },
                { name: { contains: 'Core i3', mode: 'insensitive' } },
                // Intel Ultra (Arrow Lake / Meteor Lake branding)
                { name: { contains: 'Core Ultra', mode: 'insensitive' } },
                // Ryzen series
                { name: { contains: 'Ryzen 9', mode: 'insensitive' } },
                { name: { contains: 'Ryzen 7', mode: 'insensitive' } },
                { name: { contains: 'Ryzen 5', mode: 'insensitive' } },
                { name: { contains: 'Ryzen 3', mode: 'insensitive' } },
                // Threadripper / EPYC (workstation/server processors)
                { name: { contains: 'Threadripper', mode: 'insensitive' } },
                { name: { contains: 'EPYC', mode: 'insensitive' } },
                // Xeon (Intel server processors)
                { name: { contains: 'Xeon', mode: 'insensitive' } },
                // Apple Silicon chips sold standalone or in Mac Mini / Mac Studio
                { name: { contains: 'Apple M1', mode: 'insensitive' } },
                { name: { contains: 'Apple M2', mode: 'insensitive' } },
                { name: { contains: 'Apple M3', mode: 'insensitive' } },
                { name: { contains: 'Apple M4', mode: 'insensitive' } },
            ],
        },
        orderBy: { price: 'desc' },
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

    // ── Secondary exclusion filter (post-query safety net) ──────────────────
    // Remove anything that still slips through and is clearly NOT a CPU.
    const CPU_EXCLUDE_WORDS = [
        'mainboard', 'motherboard', 'placa madre', 'placa base',
        'monitor', 'pantalla', 'display',
        'laptop', 'notebook', 'portátil', 'portatil',
        'alexa', 'echo', 'domotica', 'domótica', 'smart home',
        'cerradura', 'lock', 'camara', 'cámara', 'camera',
        'router', 'switch', 'hub', 'access point',
        'teclado', 'keyboard', 'mouse', 'raton',
        'ram', 'memoria', 'memory',
        'ssd', 'disco duro', 'hard drive', 'nvme',
        'gpu', 'tarjeta grafica', 'tarjeta gráfica', 'graphics card',
        'fuente de poder', 'power supply', 'psu',
        'gabinete', 'case', 'torre',
        'cooler', 'disipador', 'ventilador',
        'pasta termica', 'pasta térmica',
    ]

    const filteredProducts = rawProducts.filter(p => {
        const text = `${p.name} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase()
        return !CPU_EXCLUDE_WORDS.some(ex => text.includes(ex))
    })

    const productsJSON = JSON.parse(JSON.stringify(filteredProducts))

    return <CPUsClient dbProducts={productsJSON} />
}
