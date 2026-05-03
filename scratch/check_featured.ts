
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const featured = await prisma.product.count({ where: { featured: true, isDeleted: false, isActive: true } })
    const tech = await prisma.product.count({ 
        where: { 
            isDeleted: false, 
            isActive: true,
            OR: [
                { name: { contains: 'power bank', mode: 'insensitive' } },
                { name: { contains: 'espia', mode: 'insensitive' } },
                { description: { contains: 'oculta', mode: 'insensitive' } }
            ]
        } 
    })

    console.log('--- FEATURED CHECK ---')
    console.log('Featured in DB:', featured)
    console.log('Tech Keywords in DB:', tech)
    console.log('----------------------')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
