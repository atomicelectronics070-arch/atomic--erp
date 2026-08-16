import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 7); // 7 days campaign

  const assignedBudget = 20.00;
  const taxDeducted = assignedBudget * 0.15; // 15% tax
  const usableBudget = assignedBudget - taxDeducted;

  const campaign = await prisma.marketingCampaign.create({
    data: {
      publishedAd: 'PAUTA FACEBOOK -> WHATSAPP LEADS (MANDOS & CONSOLAS GAMING)',
      platform: 'WhatsApp',
      assignedBudget,
      taxDeducted,
      usableBudget,
      startDate,
      endDate,
      targetHours: 168,
      currentSpent: 0,
      status: 'ACTIVE'
    }
  });

  console.log('✅ Campaña registrada y ACTIVADA (ON) en producción:');
  console.log('   ID:', campaign.id);
  console.log('   Anuncio:', campaign.publishedAd);
  console.log('   Plataforma:', campaign.platform);
  console.log('   Presupuesto Asignado: $' + campaign.assignedBudget);
  console.log('   Estado:', campaign.status);

  await prisma.$disconnect();
}

main().catch(console.error);
