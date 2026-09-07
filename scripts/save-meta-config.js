const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const token = "EAAO2vRww4MoBSVBS263ztXANnlwa3WF8i1A55fj0l6RZCstjmaINjzk9rApxeYanHJcGBYd9VjEhyRtbI9K2BZAG9mGh2XbpIxUM2CaU0CnFUk8BhIAEuU8OzZAas77NzWIkxMd8R7HJMGa3PaJ5npUJjwaJ8ebEi7IScqSQ4PdFcZBgMCQpaI0NFJapZAkLAAwZDZD";
const phoneId = "1215685301622232";
const wabaId = "2087519162174495";

async function main() {
    console.log("Saving full WhatsApp Cloud API config to DB...");
    await prisma.systemSetting.upsert({
        where: { key: 'WHATSAPP_TOKEN' },
        update: { value: token },
        create: { key: 'WHATSAPP_TOKEN', value: token, description: 'Token permanente de WhatsApp' }
    });

    await prisma.systemSetting.upsert({
        where: { key: 'WHATSAPP_PHONE_NUMBER_ID' },
        update: { value: phoneId },
        create: { key: 'WHATSAPP_PHONE_NUMBER_ID', value: phoneId, description: 'ID de teléfono WhatsApp' }
    });

    await prisma.systemSetting.upsert({
        where: { key: 'WHATSAPP_BUSINESS_ACCOUNT_ID' },
        update: { value: wabaId },
        create: { key: 'WHATSAPP_BUSINESS_ACCOUNT_ID', value: wabaId, description: 'WABA ID' }
    });

    console.log("✅ All settings saved to database!");

    // Test querying the phone endpoint directly
    console.log("Testing Phone endpoint with Meta API...");
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}?fields=verified_name,code_verification_status,display_phone_number,quality_rating`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    console.log("Meta API Response:", data);
}

main().catch(console.error).finally(() => prisma.$disconnect());
