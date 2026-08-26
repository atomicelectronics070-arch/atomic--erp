
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check settings or price matrices
  try {
    const roles = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });
    console.log('User roles in DB:', roles);
  } catch (e) {
    console.log('Error checking users:', e.message);
  }

  try {
    // Check if there is any Price/Discount/Tier table
    const tables = Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_'));
    console.log('Available Prisma models:', tables);
  } catch (e) {
    console.log('Error models:', e.message);
  }

  await prisma.();
}
main();
