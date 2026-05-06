import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import PublicWebClient from "./PublicWebClient"
import { getStoreSettings } from "@/lib/actions/shop"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PublicWebPage() {
    const session = await getServerSession(authOptions)
    const userRole = session?.user?.role

    // Fetch essential data in parallel on the server
    // Two-query strategy to guarantee spy cameras ALWAYS appear in featured
    const [categories, collections, priorityProducts, recentProducts, settings] = await Promise.all([
        prisma.category.findMany({ 
            where: { isVisible: true }, 
            orderBy: { name: 'asc' } 
        }),
        prisma.collection.findMany({ 
            where: { isVisible: true } 
        }),
        // Priority 1: ALL featured products + Multitecnología (spy cameras) — no take limit
        prisma.product.findMany({
            where: { 
                isDeleted: false, 
                isActive: true,
                OR: [
                    { featured: true },
                    { provider: { contains: 'multitecnologia', mode: 'insensitive' } },
                    { provider: { contains: 'Multitecnología', mode: 'insensitive' } },
                    { name: { startsWith: 'CE-' } },
                ]
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                images: true,
                featured: true,
                provider: true,
                collectionId: true,
                createdAt: true,
                category: { select: { name: true, slug: true } }
            }
        }),
        // Priority 2: Most recent products to fill the catalog
        prisma.product.findMany({
            where: { isDeleted: false, isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 150,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                images: true,
                featured: true,
                provider: true,
                collectionId: true,
                createdAt: true,
                category: { select: { name: true, slug: true } }
            }
        }),
        getStoreSettings()
    ])

    // Merge: priority products first, then fill with recent (deduplicated)
    const priorityIds = new Set(priorityProducts.map((p: any) => p.id))
    const products = [
        ...priorityProducts,
        ...recentProducts.filter((p: any) => !priorityIds.has(p.id))
    ]

    const metadata = { 
        categories: JSON.parse(JSON.stringify(categories)), 
        collections: JSON.parse(JSON.stringify(collections)) 
    }
    const initialProducts = JSON.parse(JSON.stringify(products))

    return (
        <PublicWebClient 
            initialProducts={initialProducts} 
            metadata={metadata} 
            userRole={userRole} 
            storeSettings={settings}
        />
    )
}
