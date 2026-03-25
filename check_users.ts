import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        role: true
      }
    })
    console.log(`Found ${users.length} users in the database:`)
    console.table(users)
  } catch (error) {
    console.error("Error fetching users:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
