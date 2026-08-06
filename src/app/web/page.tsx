export const dynamic = 'force-dynamic';
import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import PublicWebClient from "./PublicWebClient"
import { getStoreSettings } from "@/lib/actions/shop"

export const revalidate = 60 // Cache for 60s

function StoreSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950">
            <div className="h-[420px] bg-slate-900/50 animate-pulse" />
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="bg-slate-900/50 h-64 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    )
}

async function StoreContent({ userRole }: { userRole?: string }) {
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

    // Fetch up to 1000 active products so all catalog items are loaded
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
        take: 300,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, description: true, price: true, images: true, featured: true, provider: true, collectionId: true, createdAt: true, category: { select: { id: true, name: true, slug: true } } }
    })

    const priorityIds = new Set(priorityProducts.map((p: any) => p.id))

    const recentProducts = await prisma.product.findMany({
        where: { 
            isDeleted: false, 
            isActive: true,
            id: { notIn: Array.from(priorityIds) as string[] }
        },
        orderBy: { createdAt: 'desc' },
        take: 700,
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
