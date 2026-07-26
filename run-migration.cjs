const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const stmts = [
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "plainPassword" TEXT`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "area" TEXT`,
    `CREATE TABLE IF NOT EXISTS "PersonalBotMemory" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "botName" TEXT,
      "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "PersonalBotMemory_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE TABLE IF NOT EXISTS "PersonalBotMessage" (
      "id" TEXT NOT NULL,
      "memoryId" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "PersonalBotMessage_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "PersonalBotMemory_userId_key" ON "PersonalBotMemory"("userId")`,
    `CREATE INDEX IF NOT EXISTS "PersonalBotMessage_memoryId_idx" ON "PersonalBotMessage"("memoryId")`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PersonalBotMemory_userId_fkey') THEN
        ALTER TABLE "PersonalBotMemory" ADD CONSTRAINT "PersonalBotMemory_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PersonalBotMessage_memoryId_fkey') THEN
        ALTER TABLE "PersonalBotMessage" ADD CONSTRAINT "PersonalBotMessage_memoryId_fkey"
          FOREIGN KEY ("memoryId") REFERENCES "PersonalBotMemory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$`,
  ]

  for (const stmt of stmts) {
    try {
      await prisma.$executeRawUnsafe(stmt)
      console.log('✓', stmt.trim().substring(0, 70))
    } catch (e) {
      console.error('✗', stmt.trim().substring(0, 70), '\n  ->', e.message)
    }
  }

  console.log('\n✅ Migration done!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
