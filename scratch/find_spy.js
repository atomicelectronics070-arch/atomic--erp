const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'espia', mode: 'insensitive' } },
        { name: { contains: 'espía', mode: 'insensitive' } },
        { description: { contains: 'espia', mode: 'insensitive' } },
        { description: { contains: 'espía', mode: 'insensitive' } }
      ]
    },
    select: { name: true, isActive: true, featured: true }
  })
  console.log('Found ' + products.length + ' spy products')
  products.forEach(p => console.log(`[${p.isActive ? 'ACTIVE' : 'INACTIVE'}] [${p.featured ? 'FEATURED' : 'NORMAL'}] ${p.name}`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
