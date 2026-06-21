const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const cameras = await prisma.product.findMany({
    where: {
      provider: 'MultiTecnologia V&V',
      OR: [
        { name: { contains: 'espia', mode: 'insensitive' } },
        { name: { contains: 'espía', mode: 'insensitive' } }
      ]
    },
    select: { name: true, images: true, isActive: true, featured: true }
  })
  console.log(JSON.stringify(cameras, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
