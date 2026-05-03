
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const total = await prisma.product.count()
    const active = await prisma.product.count({ where: { isDeleted: false, isActive: true } })
    const inTrash = await prisma.product.count({ where: { isDeleted: true } })
    const inactive = await prisma.product.count({ where: { isActive: false, isDeleted: false } })

    console.log('--- PRODUCT STATS ---')
    console.log('Total in DB:', total)
    console.log('Active & Visible:', active)
    console.log('In Trash (Soft Deleted):', inTrash)
    console.log('Inactive (Not visible):', inactive)
    console.log('----------------------')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
