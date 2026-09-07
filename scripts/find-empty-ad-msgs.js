const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const emptyOrAdMsgs = await prisma.wAMessage.findMany({
    where: {
      OR: [
        { body: "" },
        { body: { contains: "unsupported" } },
        { body: { contains: "PAUTA" } },
        { body: { contains: "fb.me" } },
        { type: "unsupported" },
        { type: "interactive" },
        { type: "button" }
      ]
    },
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      conversation: {
        include: { contact: true }
      }
    }
  });

  console.log("Found matches:", emptyOrAdMsgs.length);
  for (const m of emptyOrAdMsgs) {
    console.log(`\nID: ${m.id} | Contact: ${m.conversation?.contact?.name} (${m.conversation?.contact?.whatsappId})`);
    console.log(`Direction: ${m.direction} | Type: ${m.type}`);
    console.log(`MediaUrl: ${m.mediaUrl}`);
    console.log(`Body: ${m.body.substring(0, 150)}...`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
