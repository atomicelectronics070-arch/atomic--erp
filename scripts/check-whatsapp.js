const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tokenSetting = await prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_TOKEN' } });
  const phoneSetting = await prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_PHONE_NUMBER_ID' } });
  console.log('DB WHATSAPP_PHONE_NUMBER_ID:', phoneSetting?.value || 'NO CONFIGURADO EN DB');
  console.log('DB WHATSAPP_TOKEN exists:', !!tokenSetting?.value, 'Length:', tokenSetting?.value?.length || 0);
  if (tokenSetting?.value) {
    console.log('DB Token Preview:', tokenSetting.value.substring(0, 15) + '...');
  }
  console.log('ENV WHATSAPP_TOKEN exists:', !!process.env.WHATSAPP_TOKEN);
  console.log('ENV WHATSAPP_PHONE_NUMBER_ID:', process.env.WHATSAPP_PHONE_NUMBER_ID || 'NO EN ENV');

  // Also check recent media messages
  const mediaMsgs = await prisma.wAMessage.findMany({
    where: {
      OR: [
        { type: { not: 'text' } },
        { mediaUrl: { not: null } },
        { body: { contains: 'PAUTA' } }
      ]
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: { id: true, type: true, body: true, mediaUrl: true, direction: true, createdAt: true }
  });
  console.log('Recent media / pauta messages count:', mediaMsgs.length);
  console.log(JSON.stringify(mediaMsgs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
