export const dynamic = 'force-dynamic'
export const revalidate = 0

import { prisma } from "@/lib/prisma"
import ConsolasClient from "./ConsolasClient"

export default async function ConsolasPage() {
    // Keywords strictly associated with video game consoles and console gaming accessories
    const keywords = ['playstation', 'ps5', 'ps4', 'ps3', 'xbox', 'nintendo', 'switch', 'pandora arcade', 'consola', 'joystick', 'volante', 'racing wheel'];
    
    // Words to exclude (like network switches, power tool switches, cameras)
    const excludeKeywords = ['puertos', 'taladro', 'cargador de batería', 'camara', 'camera', 'micro switch', 'dip switch', 'switch para', 'switch poe', 'switch de', 'switch kvm', 'switch vga', 'switch hdmi', 'switch t-link', 'switch tp-link', 'switch mercurys', 'switch hikvision'];

    const rawProducts = await prisma.product.findMany({
        where: {
            isDeleted: false,
            isActive: true,
            OR: [
                { category: { name: { contains: 'Consolas', mode: 'insensitive' } } },
                { category: { name: { contains: 'Gaming', mode: 'insensitive' } } },
                { name: { contains: 'PlayStation', mode: 'insensitive' } },
                { name: { contains: 'PS5', mode: 'insensitive' } },
                { name: { contains: 'PS4', mode: 'insensitive' } },
                { name: { contains: 'Nintendo', mode: 'insensitive' } },
                { name: { contains: 'Xbox', mode: 'insensitive' } },
                { name: { contains: 'Pandora', mode: 'insensitive' } },
            ]
        },
        orderBy: { price: 'desc' },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            images: true,
            category: { select: { id: true, name: true, slug: true } }
        }
    })

    const filteredProducts = rawProducts.filter(p => {
        const text = `${p.name} ${p.category?.name || ''}`.toLowerCase();
        // Check exclusions
        if (excludeKeywords.some(ex => text.includes(ex))) return false;
        // Check inclusions
        return keywords.some(kw => text.includes(kw));
    });

    const productsJSON = JSON.parse(JSON.stringify(filteredProducts))

    return <ConsolasClient dbProducts={productsJSON} />
}
