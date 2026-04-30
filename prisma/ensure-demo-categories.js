const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Ensure "Desarrollo" and "Diseño" categories exist and are visible
    const dev = await prisma.category.upsert({
        where: { slug: 'software-desarrollo' },
        update: { isVisible: true, name: 'Desarrollo Web' },
        create: { 
            name: 'Desarrollo Web', 
            slug: 'software-desarrollo', 
            isVisible: true,
            image: '/categories/software-desarrollo.png' 
        }
    })

    const design = await prisma.category.upsert({
        where: { slug: 'diseno-grafico' },
        update: { isVisible: true, name: 'Diseño & Branding' },
        create: { 
            name: 'Diseño & Branding', 
            slug: 'diseno-grafico', 
            isVisible: true,
            image: '/categories/diseno.png' 
        }
    })

    console.log(`Ensured categories: ${dev.name}, ${design.name}`)
}

main().finally(() => prisma.$disconnect())
