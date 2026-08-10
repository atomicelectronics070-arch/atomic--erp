export const dynamic = 'force-dynamic'
export const revalidate = 0

import { prisma } from "@/lib/prisma"
import CPUsClient from "./CPUsClient"

export default async function CPUsPage() {
    // Keywords strictly associated with CPUs, Processors, Laptops with High Performance CPUs, and Desktop Processors
    const keywords = [
        'intel', 'core i9', 'core i7', 'core i5', 'core i3', 'xeon', 'ultra 9', 'ultra 7',
        'amd', 'ryzen 9', 'ryzen 7', 'ryzen 5', 'ryzen 3', 'threadripper', 'epyc',
        'procesador', 'cpu', 'm1', 'm2', 'm3', 'm4', 'apple silicon'
    ];
    
    // Words to exclude (like CPU coolers, thermal paste without processor, etc.)
    const excludeKeywords = ['pasta termica', 'pasta térmica', 'cooler solo', 'ventilador de cpu sin procesador'];

    const rawProducts = await prisma.product.findMany({
        where: {
            isDeleted: false,
            isActive: true,
            OR: [
                { name: { contains: 'Intel', mode: 'insensitive' } },
                { name: { contains: 'Ryzen', mode: 'insensitive' } },
                { name: { contains: 'Procesador', mode: 'insensitive' } },
                { name: { contains: 'Core i9', mode: 'insensitive' } },
                { name: { contains: 'Core i7', mode: 'insensitive' } },
                { name: { contains: 'Core i5', mode: 'insensitive' } },
                { name: { contains: 'AMD', mode: 'insensitive' } },
                { name: { contains: 'Xeon', mode: 'insensitive' } },
                { name: { contains: 'CPU', mode: 'insensitive' } },
                { category: { name: { contains: 'Procesadores', mode: 'insensitive' } } },
                { category: { name: { contains: 'Laptops', mode: 'insensitive' } } },
                { category: { name: { contains: 'Computadoras', mode: 'insensitive' } } },
            ]
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

    const filteredProducts = rawProducts.filter(p => {
        const text = `${p.name} ${p.description || ''} ${p.category?.name || ''}`.toLowerCase();
        if (excludeKeywords.some(ex => text.includes(ex))) return false;
        return keywords.some(kw => text.includes(kw));
    });

    const productsJSON = JSON.parse(JSON.stringify(filteredProducts))

    return <CPUsClient dbProducts={productsJSON} />
}
