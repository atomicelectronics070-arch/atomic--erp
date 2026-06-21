const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.product.updateMany({
    where: {
      provider: 'MultiTecnologia V&V',
      OR: [
        { name: { contains: 'camara espia', mode: 'insensitive' } },
        { name: { contains: 'cámara espía', mode: 'insensitive' } },
        { name: { startsWith: 'CE-', mode: 'insensitive' } }
      ]
    },
    data: {
      featured: true
    }
  })

  console.log(`Updated ${result.count} products from MultiTecnologia V&V as featured.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
