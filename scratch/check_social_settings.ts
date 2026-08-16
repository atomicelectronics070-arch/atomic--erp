import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const social = await (prisma as any).socialSettings.findFirst();
  console.log('CONFIGURACION SOCIAL ACTUAL:');
  console.log(JSON.stringify(social, null, 2));

  const activeCampaigns = await (prisma as any).marketingCampaign.findMany({
    where: { status: 'ACTIVE' }
  });
  console.log('\nCAMPAÑAS ACTIVAS EN CRM/MARKETING:');
  console.log(JSON.stringify(activeCampaigns, null, 2));

  await prisma.$disconnect();
}

main().catch(console.error);
