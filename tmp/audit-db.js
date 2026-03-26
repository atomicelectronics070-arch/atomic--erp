const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("--- DATABASE AUDIT ---")
  try {
    const counts = {
      transactions: await prisma.transaction.count(),
      paymentTickets: await prisma.paymentTicket.count(),
      internalMessages: await prisma.internalMessage.count(),
      quotes: await prisma.quote.count(),
      products: await prisma.product.count(),
      users: await prisma.user.count(),
    }
    console.log(JSON.stringify(counts, null, 2))
  } catch (e) {
    console.error("Audit failed", e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
