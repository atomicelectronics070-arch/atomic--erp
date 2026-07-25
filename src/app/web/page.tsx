import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import PublicWebClient from "./PublicWebClient"
import { getStoreSettings } from "@/lib/actions/shop"

export const revalidate = 60 // Cache for 60s - much faster repeated loads

// Lightweight skeleton shown immediately while products load
function StoreSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 backdrop-blur-xl">
            {/* Hero skeleton */}
            <div className="h-[420px] bg-slate-900/50 border-b border-white/10 animate-pulse" />
            
            {/* Product grid skeleton */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="h-8 w-48 bg-slate-900/50 rounded-lg mb-10 animate-pulse border border-white/10" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden animate-pulse">
                            <div className="aspect-square bg-slate-800/50" />
                            <div className="p-4 space-y-2">
                                <div className="h-4 bg-slate-800/50 rounded w-3/4" />
                                <div className="h-4 bg-slate-800/50 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Async component that loads products — streamed AFTER the skeleton appears
async function StoreContent({ userRole }: { userRole?: string }) {
    // Fetch metadata and settings first (lightweight)
    const [categories, collections, settings] = await Promise.all([
        prisma.category.findMany({ 
            where: { isVisible: true }, 
            orderBy: { name: 'asc' } 
        }),
        prisma.collection.findMany({ 
            where: { isVisible: true } 
        }),
        getStoreSettings()
    ])

    // Fetch featured/priority products (limit reduced to essentials)
    const priorityProducts = await prisma.product.findMany({
        where: { 
            isDeleted: false, 
            isActive: true,
            OR: [
                { featured: true },
                { provider: { contains: 'multitecnologia', mode: 'insensitive' } },
                { name: { startsWith: 'CE-' } },
            ]
        },
        take: 80,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, description: true, price: true, images: true, featured: true, provider: true, collectionId: true, createdAt: true, category: { select: { id: true, name: true, slug: true } } }
    })

    const priorityIds = new Set(priorityProducts.map((p: any) => p.id))

    // Fetch remaining products but exclude already fetched ones
    const recentProducts = await prisma.product.findMany({
        where: { 
            isDeleted: false, 
            isActive: true,
            id: { notIn: Array.from(priorityIds) as string[] }
        },
        orderBy: { createdAt: 'desc' },
        take: 200,
        select: { id: true, name: true, description: true, price: true, images: true, featured: true, provider: true, collectionId: true, createdAt: true, category: { select: { id: true, name: true, slug: true } } }
    })

    const products = [...priorityProducts, ...recentProducts]

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

export default async function PublicWebPage() {
    const session = await getServerSession(authOptions)
    const userRole = session?.user?.role

    return (
        <Suspense fallback={<StoreSkeleton />}>
            <StoreContent userRole={userRole} />
        </Suspense>
    )
}
