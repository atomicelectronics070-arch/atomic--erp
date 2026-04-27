const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Attempting to add column isVisible to Category table...');
    // Raw SQL to add columns if they don't exist
    await prisma.$executeRawUnsafe(`ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "description" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "image" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "isVisible" BOOLEAN DEFAULT true;`);
    console.log('SUCCESS: Category columns ensured.');
    
    // Also check Collection table
    await prisma.$executeRawUnsafe(`ALTER TABLE "Collection" ADD COLUMN IF NOT EXISTS "description" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Collection" ADD COLUMN IF NOT EXISTS "image" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Collection" ADD COLUMN IF NOT EXISTS "isVisible" BOOLEAN DEFAULT true;`);
    console.log('SUCCESS: Collection columns ensured.');
  } catch (err) {
    console.error('ERROR adding columns:', err);
  }
}

main().finally(() => prisma.$disconnect());
