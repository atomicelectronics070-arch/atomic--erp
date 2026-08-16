import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import PublicWebClient from "./PublicWebClient"

export const dynamic = 'force-dynamic'

export default async function PublicWebPage() {
    let userRole: string | undefined = undefined;
    let metadata = { categories: [], collections: [] };
    let initialProducts: any[] = [];
    let settings: any = {
        currency: 'USD',
        shippingCost: 0,
        freeShippingThreshold: 0,
        bannerText: '',
        bannerActive: false,
        banners: { software: {}, automation: {}, gaming: {} },
        providerMargins: {}
    };

    try {
        const session = await getServerSession(authOptions).catch(() => null);
        userRole = session?.user?.role;
    } catch (e) {}

    try {
        const [categories, collections, settingRecord] = await Promise.all([
            prisma.category.findMany({ 
                where: { isVisible: true }, 
                orderBy: { name: 'asc' } 
            }).catch(() => []),
            prisma.collection.findMany({ 
                where: { isVisible: true } 
            }).catch(() => []),
            prisma.systemSetting.findUnique({
                where: { key: 'store_settings' }
            }).catch(() => null)
        ]);

        if (settingRecord?.value) {
            try {
                settings = { ...settings, ...JSON.parse(settingRecord.value) };
            } catch(e) {}
        }

        const products = await prisma.product.findMany({
            where: { isDeleted: false, isActive: true },
            take: 200,
            orderBy: { createdAt: 'desc' },
            select: { 
                id: true, name: true, description: true, price: true, 
                images: true, featured: true, provider: true, collectionId: true, createdAt: true, 
                category: { select: { id: true, name: true, slug: true } } 
            }
        }).catch(() => []);

        metadata = { 
            categories: JSON.parse(JSON.stringify(categories || [])), 
            collections: JSON.parse(JSON.stringify(collections || [])) 
        };
        initialProducts = JSON.parse(JSON.stringify(products || []));
    } catch (err) {
        console.error('[PUBLIC_WEB_PAGE_ERROR]', err);
    }

    return (
        <PublicWebClient 
            initialProducts={initialProducts} 
            metadata={metadata} 
            userRole={userRole} 
            storeSettings={settings}
        />
    )
}

