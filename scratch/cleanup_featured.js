const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Un-feature computers and mini pcs
  const unfeature = await prisma.product.updateMany({
    where: {
      OR: [
        { name: { contains: 'mini pc', mode: 'insensitive' } },
        { name: { contains: 'computadora', mode: 'insensitive' } },
        { name: { contains: 'laptop', mode: 'insensitive' } }
      ]
    },
    data: {
      featured: false
    }
  })
  console.log(`Un-featured ${unfeature.count} computers/mini pcs.`)

  // Ensure cameras are featured
  const feature = await prisma.product.updateMany({
    where: {
      provider: 'MultiTecnologia V&V',
      OR: [
        { name: { contains: 'camara', mode: 'insensitive' } },
        { name: { contains: 'cámara', mode: 'insensitive' } },
        { name: { contains: 'espia', mode: 'insensitive' } },
        { name: { contains: 'espía', mode: 'insensitive' } }
      ]
    },
    data: {
      featured: true,
      isActive: true
    }
  })
  console.log(`Confirmed ${feature.count} spy cameras as featured and active.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
