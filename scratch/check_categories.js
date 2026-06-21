const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: 'camaras-espia' },
    include: { products: { take: 5 } }
  })
  console.log('Category:', category?.name)
  console.log('Product count:', category?.products.length)
  
  const allCategories = await prisma.category.findMany({
    select: { name: true, slug: true }
  })
  console.log('All categories:', allCategories.map(c => `${c.name} (${c.slug})`).join(', '))
}

main().catch(console.error).finally(() => prisma.$disconnect())
