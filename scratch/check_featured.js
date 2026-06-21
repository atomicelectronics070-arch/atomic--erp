const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const featured = await prisma.product.findMany({
    where: { featured: true },
    select: { name: true, provider: true }
  })
  console.log('Total featured:', featured.length)
  featured.forEach(f => console.log(`- ${f.name} (${f.provider})`))
}

main().catch(console.error).finally(() => prisma.$disconnect())
