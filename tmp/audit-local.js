const { PrismaClient } = require('@prisma/client')
// Use a separate prisma instance for SQLite
const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db'
    }
  }
})

async function main() {
  console.log("--- LOCAL DB AUDIT ---")
  try {
    const counts = {
      transactions: await sqlitePrisma.transaction.count().catch(() => -1),
      paymentTickets: await sqlitePrisma.paymentTicket.count().catch(() => -1),
      quotes: await sqlitePrisma.quote.count().catch(() => -1),
      products: await sqlitePrisma.product.count().catch(() => -1),
    }
    console.log(JSON.stringify(counts, null, 2))
    
    if (counts.transactions > 0) {
      const sample = await sqlitePrisma.transaction.findMany({ take: 5 })
      console.log("Sample Transactions found in local DB:")
      console.log(JSON.stringify(sample, null, 2))
    }
  } catch (e) {
    console.error("Local audit failed", e)
  } finally {
    await sqlitePrisma.$disconnect()
  }
}

main()
