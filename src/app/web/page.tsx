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
    // Three-query strategy: Priority (Spy) + Curated (Phones/Motors/etc) + Recent
    const [categories, collections, priorityProducts, curatedProducts, recentProducts, settings] = await Promise.all([
        prisma.category.findMany({ 
            where: { isVisible: true }, 
            orderBy: { name: 'asc' } 
        }),
        prisma.collection.findMany({ 
            where: { isVisible: true } 
        }),
        // Priority 1: ALL featured products + Multitecnología (spy cameras)
        prisma.product.findMany({
            where: { 
                isDeleted: false, 
                isActive: true,
                OR: [
                    { featured: true },
                    { provider: { contains: 'multitecnologia', mode: 'insensitive' } },
                    { name: { startsWith: 'CE-' } },
                ]
            },
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, description: true, price: true, images: true, featured: true, provider: true, collectionId: true, createdAt: true, category: { select: { name: true, slug: true } } }
        }),
        // Priority 2: Curated items for storefront strips (Phones, Tablets, Motors, Security, etc.)
        prisma.product.findMany({
            where: {
                isDeleted: false,
                isActive: true,
                OR: [
                    { category: { name: { contains: 'celular', mode: 'insensitive' } } },
                    { category: { name: { contains: 'tablet', mode: 'insensitive' } } },
                    { category: { name: { contains: 'telefon', mode: 'insensitive' } } },
                    { category: { name: { contains: 'barrera', mode: 'insensitive' } } },
                    { category: { name: { contains: 'motor', mode: 'insensitive' } } },
                    { category: { name: { contains: 'cerradura', mode: 'insensitive' } } },
                    { category: { name: { contains: 'portero', mode: 'insensitive' } } },
                    { name: { contains: 'iphone', mode: 'insensitive' } },
                    { name: { contains: 'samsung galaxy', mode: 'insensitive' } },
                    { name: { contains: 'xiaomi redmi', mode: 'insensitive' } },
                    { name: { contains: 'ipad', mode: 'insensitive' } },
                    { name: { contains: 'motor de garaje', mode: 'insensitive' } },
                    { name: { contains: 'motor batiente', mode: 'insensitive' } },
                    { name: { contains: 'barrera vehicular', mode: 'insensitive' } },
                    { name: { contains: 'calefactor', mode: 'insensitive' } },
                    { name: { contains: 'luminaria', mode: 'insensitive' } },
                    { name: { contains: 'generador', mode: 'insensitive' } },
                    { name: { contains: 'playstation', mode: 'insensitive' } },
                    { name: { contains: 'laptop', mode: 'insensitive' } },
                ]
            },
            take: 400,
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, description: true, price: true, images: true, featured: true, provider: true, collectionId: true, createdAt: true, category: { select: { name: true, slug: true, id: true } } }
        }),
        // Priority 3: Most recent products to fill the catalog
        prisma.product.findMany({
            where: { isDeleted: false, isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 200,
            select: { id: true, name: true, description: true, price: true, images: true, featured: true, provider: true, collectionId: true, createdAt: true, category: { select: { name: true, slug: true } } }
        }),
        getStoreSettings()
    ])

    // Merge: priority products first, then curated, then fill with recent (deduplicated)
    const priorityIds = new Set([
        ...priorityProducts.map((p: any) => p.id),
        ...curatedProducts.map((p: any) => p.id)
    ])
    const products = [
        ...priorityProducts,
        ...curatedProducts,
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
