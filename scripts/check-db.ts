import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.product.count()
  console.log(`Total products in DB: ${count}`)
  
  const latestProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { name: true, createdAt: true, isActive: true }
  })
  
  console.log('Latest 5 products:')
  console.log(JSON.stringify(latestProducts, null, 2))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
