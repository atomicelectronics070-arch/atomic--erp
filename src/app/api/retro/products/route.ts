import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const view = searchParams.get('view') || 'products' // 'products' | 'providers'
    const search = searchParams.get('q') || ''
    const provider = searchParams.get('provider') || ''

    try {
        if (view === 'providers') {
            // Provider summary view
            const providers = await (prisma as any).$queryRawUnsafe(`
                SELECT 
                    COALESCE(provider, 'Sin proveedor') as provider,
                    COUNT(*) as product_count,
                    ROUND(AVG(price)::numeric, 2) as avg_pvp,
                    ROUND(AVG("compareAtPrice")::numeric, 2) as avg_cost,
                    ROUND(
                        AVG(
                            CASE WHEN "compareAtPrice" > 0 AND "compareAtPrice" IS NOT NULL
                            THEN (price - "compareAtPrice") / "compareAtPrice" * 100 
                            END
                        )::numeric, 1
                    ) as avg_margin_pct
                FROM "Product"
                WHERE "isDeleted" = false AND "isActive" = true
                AND (provider IS NOT NULL AND provider != '')
                GROUP BY provider
                ORDER BY product_count DESC
            `)
            return NextResponse.json({ view: 'providers', data: providers })
        }

        // Products view
        const whereClause: any = {
            isDeleted: false,
            isActive: true,
        }

        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { provider: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (provider && provider !== 'TODOS') {
            whereClause.provider = provider
        }

        const products = await (prisma as any).product.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                price: true,
                compareAtPrice: true,
                provider: true,
                sku: true,
                stock: true,
                category: { select: { name: true } },
            },
            orderBy: { name: 'asc' },
            take: 500,
        })

        // Calculate discount (5% off PVP)
        const data = products.map((p: any) => ({
            id: p.id,
            name: p.name || 'Sin nombre',
            sku: p.sku || '-',
            pvp: p.price || 0,
            costo: p.compareAtPrice || null,
            provider: p.provider || 'Sin proveedor',
            descuento5: p.price ? Math.round(p.price * 0.95 * 100) / 100 : 0,
            margen: (p.compareAtPrice && p.price)
                ? Math.round(((p.price - p.compareAtPrice) / p.compareAtPrice) * 100 * 10) / 10
                : null,
            stock: p.stock || 0,
            categoria: p.category?.name || '-',
        }))

        // Get unique providers for the filter dropdown
        const allProviders = await (prisma as any).$queryRawUnsafe(`
            SELECT DISTINCT provider FROM "Product"
            WHERE "isDeleted" = false AND "isActive" = true
            AND provider IS NOT NULL AND provider != ''
            ORDER BY provider ASC
        `)

        return NextResponse.json({
            view: 'products',
            data,
            total: data.length,
            providers: allProviders.map((r: any) => r.provider),
        })

    } catch (error: any) {
        console.error('Retro inventory error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
