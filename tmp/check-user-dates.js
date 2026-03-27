const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("--- USER AUDIT ---")
  try {
    const users = await prisma.user.findMany({
      select: { email: true, createdAt: true, role: true },
      orderBy: { createdAt: 'asc' },
      take: 50
    })
    console.log(JSON.stringify(users, null, 2))
  } catch (e) {
    console.error("Query failed", e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
