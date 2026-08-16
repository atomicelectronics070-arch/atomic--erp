import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const conversations = await prisma.wAConversation.findMany({
    include: {
      contact: true,
      messages: true
    }
  });

  console.log(`TOTAL CONVERSACIONES EN BD: ${conversations.length}`);
  console.log(JSON.stringify(conversations, null, 2));

  await prisma.$disconnect();
}

main().catch(console.error);
