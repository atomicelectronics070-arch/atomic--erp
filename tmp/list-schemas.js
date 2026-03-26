const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("--- SCHEMAS ---")
  try {
    const schemas = await prisma.$queryRaw`SELECT schema_name FROM information_schema.schemata;`
    console.log(JSON.stringify(schemas, null, 2))
  } catch (e) {
    console.error("Query failed", e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
