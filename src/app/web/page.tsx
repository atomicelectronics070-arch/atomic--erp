import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import PublicWebClient from "./PublicWebClient"

export const dynamic = "force-dynamic"

export default async function PublicWebPage() {
    const session = await getServerSession(authOptions)
    const userRole = session?.user?.role

    // Fetch essential data in parallel on the server
    // This is MUCH faster than client-side fetch because it's direct DB access
    const [categories, collections, products] = await Promise.all([
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
            include: { 
                category: { select: { id: true, name: true, slug: true } },
                collection: { select: { id: true, name: true, slug: true } }
            }
        })
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
        />
    )
}
