
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const total = await prisma.product.count()
    const active = await prisma.product.count({ where: { isDeleted: false } })
    const deleted = await prisma.product.count({ where: { isDeleted: true } })
    const visible = await prisma.product.count({ where: { isDeleted: false, isActive: true } })

    console.log('--- Database Stats ---')
    console.log('Total Products:', total)
    console.log('Active (isDeleted: false):', active)
    console.log('Deleted (isDeleted: true):', deleted)
    console.log('Visible (isActive: true AND isDeleted: false):', visible)
    
    if (total > 0) {
      const sample = await prisma.product.findFirst({
        where: { isDeleted: false }
      })
      console.log('Sample Product Name:', sample?.name)
    }
  } catch (error) {
    console.error('Error connecting to database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
