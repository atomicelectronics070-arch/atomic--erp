const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.product.count({
    where: { provider: 'MultiTecnologia V&V' }
  })
  console.log('Total products from MultiTecnologia V&V:', count)

  const inactive = await prisma.product.count({
    where: { provider: 'MultiTecnologia V&V', isActive: false }
  })
  console.log('Inactive products from MultiTecnologia V&V:', inactive)

  const cameras = await prisma.product.findMany({
    where: {
      provider: 'MultiTecnologia V&V',
      OR: [
        { name: { contains: 'camara', mode: 'insensitive' } },
        { name: { contains: 'cámara', mode: 'insensitive' } },
        { name: { contains: 'espia', mode: 'insensitive' } },
        { name: { contains: 'espía', mode: 'insensitive' } }
      ]
    },
    select: { id: true, name: true, isActive: true, featured: true }
  })

  console.log('Spy cameras from MultiTecnologia V&V:', cameras.length)
  console.log(JSON.stringify(cameras, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
