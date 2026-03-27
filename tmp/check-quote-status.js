const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("--- QUOTE STATUS AUDIT ---")
  try {
    const quoteStatuses = await prisma.quote.groupBy({
      by: ['status'],
      _count: { _all: true }
    })
    console.log("Quote Status Distribution:")
    console.log(JSON.stringify(quoteStatuses, null, 2))

    const samplePaid = await prisma.quote.findMany({
      where: { NOT: { status: 'DRAFT' } },
      take: 5
    })
    console.log("Sample Non-Draft Quotes:")
    console.log(JSON.stringify(samplePaid, null, 2))
  } catch (e) {
    console.error("Query failed", e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
