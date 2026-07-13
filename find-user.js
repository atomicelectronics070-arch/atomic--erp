const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { isActive: true },
    select: { id: true, name: true, role: true }
  });
  console.log("DEFAULT USER:", user);
}

main().catch(console.error).finally(() => prisma.$disconnect());
