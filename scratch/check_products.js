const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.product.count()
  console.log('Total Products:', count)

  const multi = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'multitecnologia', mode: 'insensitive' } },
        { name: { contains: 'multi-tecnologia', mode: 'insensitive' } },
        { name: { contains: 'multi tecnología', mode: 'insensitive' } },
        { description: { contains: 'multitecnologia', mode: 'insensitive' } },
        { description: { contains: 'multi-tecnologia', mode: 'insensitive' } },
        { description: { contains: 'multi tecnología', mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      name: true,
      isActive: true,
      isDeleted: true,
      featured: true,
      provider: true
    }
  })

  console.log('Multitecnologia Products Found:', multi.length)
  console.log(JSON.stringify(multi, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
