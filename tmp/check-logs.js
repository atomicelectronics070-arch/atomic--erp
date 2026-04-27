const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("--- LOG AUDIT ---")
  try {
    const logCount = await prisma.dailyLog.count()
    console.log(`DailyLog Count: ${logCount}`)

    if (logCount > 0) {
      const logs = await prisma.dailyLog.findMany({ take: 10 })
      console.log("Sample DailyLogs:")
      console.log(JSON.stringify(logs, null, 2))
    }

    const cycles = await prisma.workCycle.findMany({ take: 10 })
    console.log("Sample WorkCycles:")
    console.log(JSON.stringify(cycles, null, 2))
  } catch (e) {
    console.error("Query failed", e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
