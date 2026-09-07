const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const token = "EAAO2vRww4MoBSVBS263ztXANnlwa3WF8i1A55fj0l6RZCstjmaINjzk9rApxeYanHJcGBYd9VjEhyRtbI9K2BZAG9mGh2XbpIxUM2CaU0CnFUk8BhIAEuU8OzZAas77NzWIkxMd8R7HJMGa3PaJ5npUJjwaJ8ebEi7IScqSQ4PdFcZBgMCQpaI0NFJapZAkLAAwZDZD";

async function main() {
    console.log("Saving WHATSAPP_TOKEN to Database SystemSetting...");
    const setting = await prisma.systemSetting.upsert({
        where: { key: 'WHATSAPP_TOKEN' },
        update: { value: token },
        create: {
            key: 'WHATSAPP_TOKEN',
            value: token,
            description: 'Token permanente de WhatsApp Cloud API de Meta'
        }
    });
    console.log("Saved successfully:", setting);

    // Also check WHATSAPP_PHONE_NUMBER_ID
    const phoneIdSetting = await prisma.systemSetting.findUnique({
        where: { key: 'WHATSAPP_PHONE_NUMBER_ID' }
    });
    console.log("Current WHATSAPP_PHONE_NUMBER_ID in DB:", phoneIdSetting);

    // Test token against Meta Graph API
    console.log("Testing token with Meta API...");
    const phoneId = phoneIdSetting?.value || '1215685301622222';
    try {
        const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}?fields=verified_name,code_verification_status,display_phone_number,quality_rating`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        console.log("Meta API Response for Phone:", data);
    } catch (e) {
        console.error("Error testing with Meta:", e);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
