const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("--- INTERNAL MESSAGES ---")
  try {
    const messages = await prisma.internalMessage.findMany({ take: 10 })
    console.log(JSON.stringify(messages, null, 2))
  } catch (e) {
    console.error("Query failed", e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
