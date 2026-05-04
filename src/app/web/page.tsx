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
    // This is MUCH faster than client-side fetch because it's direct DB access
    const [categories, collections, products, settings] = await Promise.all([
        prisma.category.findMany({ 
            where: { isVisible: true }, 
            orderBy: { name: 'asc' } 
        }),
        prisma.collection.findMany({ 
            where: { isVisible: true } 
        }),
        prisma.product.findMany({
            where: { isDeleted: false, isActive: true },
            orderBy: { createdAt: 'desc' },
            take: 100,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                images: true,
                featured: true,
                collectionId: true,
                createdAt: true,
                category: { select: { name: true, slug: true } }
            }
        }),
        getStoreSettings()
    ])

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
