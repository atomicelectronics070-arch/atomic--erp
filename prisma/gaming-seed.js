const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const category = await prisma.category.findUnique({
        where: { slug: 'consolas-de-video-juegos' }
    })

    if (!category) {
        console.error('Category not found')
        return
    }

    const products = [
        {
            name: 'PlayStation 4 Slim 1TB (Open Box)',
            description: 'Consola PS4 Slim de 1TB en condición Open Box. Incluye 1 control original, cables y garantía técnica. Rendimiento confiable y catálogo inmenso de juegos.',
            price: 249.00,
            stock: 5,
            categoryId: category.id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1507457379470-08b8006bc664?auto=format&fit=crop&q=80&w=800']),
            isActive: true,
            featured: true
        },
        {
            name: 'PlayStation 4 Pro 1TB (Open Box)',
            description: 'Consola PS4 Pro con soporte para resolución 4K y HDR. Condición Open Box con soporte técnico continuo. Ideal para gamers que buscan potencia extra en la generación anterior.',
            price: 319.00,
            stock: 3,
            categoryId: category.id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800']),
            isActive: true,
            featured: true
        },
        {
            name: 'PlayStation 5 Slim 1TB SSD (Digital)',
            description: 'La nueva versión Slim de PS5. 1TB de almacenamiento SSD ultra rápido, soporte para 4K a 120fps y Ray Tracing. Diseño compacto y elegante.',
            price: 489.00,
            stock: 8,
            categoryId: category.id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1606813907291-d86ebb9c94ad?auto=format&fit=crop&q=80&w=800']),
            isActive: true,
            featured: true
        },
        {
            name: 'PlayStation 5 Pro 1TB SSD (Elite Edition)',
            description: 'La máxima potencia gaming. PS5 Pro con mejoras en GPU y IA para un rendimiento sin precedentes. Condición garantizada por Atomic Electronics.',
            price: 799.00,
            stock: 2,
            categoryId: category.id,
            images: JSON.stringify(['https://images.unsplash.com/photo-1607633271525-42bc3796d194?auto=format&fit=crop&q=80&w=800']),
            isActive: true,
            featured: true
        }
    ]

    for (const p of products) {
        await prisma.product.create({ data: p })
    }
    console.log('4 Gaming consoles added successfully.')
}

main().finally(() => prisma.$disconnect())
