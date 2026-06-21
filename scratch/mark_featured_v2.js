const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.product.updateMany({
    where: {
      provider: 'MultiTecnologia V&V',
      OR: [
        { name: { contains: 'camara', mode: 'insensitive' } },
        { name: { contains: 'cámara', mode: 'insensitive' } },
        { name: { contains: 'espia', mode: 'insensitive' } },
        { name: { contains: 'espía', mode: 'insensitive' } },
        { name: { contains: 'oculta', mode: 'insensitive' } }
      ]
    },
    data: {
      featured: true,
      isActive: true // Ensure they are active
    }
  })

  console.log(`Updated ${result.count} products from MultiTecnologia V&V as featured and active.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
