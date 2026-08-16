import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const metaToken = "EAAO2vRww4MoBSBB91q8Hz90XTIZBIkjjo84CmWq6qDBRFRQZCFtTBQfOVcVo7lKNFnSIJ9CFTPDZCWHOsPkt1E5t1IAYKLZAvZBlkTMX580BtEaRTMhVwjZCh9fabfm130ZA4yPix2mGpXtZC1yLEXleNekBGE7JxzL7CNBjNZC3tmrV5f0R5dcfd98s3ZBQiT1KHQEFWAoDgJMi0gmeDhJnxRzCe0U2yZBFT6UysBzF9f47m3BIyM45KmAbz2K9ZB0fOckT8ExhUNJiZAHj9GmxyAOTJ0LHBonGXS0sycmkdvD0ZD";

async function main() {
  console.log('Iniciando prueba y guardado del Meta Access Token en producción...\n');

  // 1. Inspect Token with Meta Graph API
  try {
    const meRes = await fetch(`https://graph.facebook.com/v22.0/me?fields=id,name&access_token=${metaToken}`);
    const meData = await meRes.json();
    console.log('--- META USER INFO ---');
    console.log(JSON.stringify(meData, null, 2));

    // Fetch accounts (Pages)
    const pagesRes = await fetch(`https://graph.facebook.com/v22.0/me/accounts?access_token=${metaToken}`);
    const pagesData = await pagesRes.json();
    console.log('\n--- META PAGES ---');
    console.log(JSON.stringify(pagesData, null, 2));

    let pageId = '1045348268171466'; // App ID default
    if (pagesData.data && pagesData.data.length > 0) {
      pageId = pagesData.data[0].id;
      console.log(`Página detectada: ${pagesData.data[0].name} (ID: ${pageId})`);
    }

    // 2. Save in SocialSettings
    const existingSocial = await (prisma as any).socialSettings.findFirst();
    if (existingSocial) {
      await (prisma as any).socialSettings.update({
        where: { id: existingSocial.id },
        data: {
          metaPageToken: metaToken,
          metaPageId: pageId,
          updatedAt: new Date()
        }
      });
      console.log('\n✅ SocialSettings actualizado en la base de datos de producción.');
    } else {
      await (prisma as any).socialSettings.create({
        data: {
          metaPageToken: metaToken,
          metaPageId: pageId,
        }
      });
      console.log('\n✅ SocialSettings creado en la base de datos de producción.');
    }

    // 3. Save in SystemSetting (WHATSAPP_ACCESS_TOKEN & WHATSAPP_CLOUD_TOKEN)
    await prisma.systemSetting.upsert({
      where: { key: 'WHATSAPP_ACCESS_TOKEN' },
      update: { value: metaToken },
      create: { key: 'WHATSAPP_ACCESS_TOKEN', value: metaToken, description: 'Meta Access Token para WhatsApp & Marketing' }
    });

    await prisma.systemSetting.upsert({
      where: { key: 'META_PAGE_TOKEN' },
      update: { value: metaToken },
      create: { key: 'META_PAGE_TOKEN', value: metaToken, description: 'Meta Page Access Token' }
    });

    await prisma.systemSetting.upsert({
      where: { key: 'META_PAGE_ID' },
      update: { value: pageId },
      create: { key: 'META_PAGE_ID', value: pageId, description: 'Meta Page ID' }
    });

    console.log('✅ SystemSetting upserted correctamente (WHATSAPP_ACCESS_TOKEN, META_PAGE_TOKEN, META_PAGE_ID).');

  } catch (e: any) {
    console.error('Error al probar Meta Token:', e.message);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
