const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("--- MIGRATIONS ---")
  try {
    const migrations = await prisma.$queryRaw`SELECT * FROM _prisma_migrations ORDER BY applied_steps_count DESC;`
    console.log(JSON.stringify(migrations, null, 2))
  } catch (e) {
    console.error("Query failed", e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
