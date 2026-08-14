import { prisma } from "../../src/lib/prisma";

async function forceUpdateWhatsAppId() {
  const REAL_PHONE_ID = "1215685301622222";
  console.log(`Setting WHATSAPP_PHONE_NUMBER_ID to ${REAL_PHONE_ID}...`);

  await prisma.systemSetting.upsert({
    where: { key: "WHATSAPP_PHONE_NUMBER_ID" },
    update: { value: REAL_PHONE_ID },
    create: {
      key: "WHATSAPP_PHONE_NUMBER_ID",
      value: REAL_PHONE_ID,
      description: "Identificador de teléfono de WhatsApp Business Producción real"
    }
  });

  console.log("SUCCESS: WHATSAPP_PHONE_NUMBER_ID set in SystemSetting database table.");
}

forceUpdateWhatsAppId().catch(console.error).finally(() => process.exit(0));
