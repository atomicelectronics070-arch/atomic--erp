const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testLive() {
    console.log("=== INICIANDO VALIDACIÓN INTERNA DEL CRM WHATSAPP ===");

    // 1. Verificar credenciales en DB
    const token = await prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_TOKEN' } });
    const phoneId = await prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_PHONE_NUMBER_ID' } });
    const wabaId = await prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_BUSINESS_ACCOUNT_ID' } });

    console.log("1. Estado en Base de Datos:");
    console.log("   - WHATSAPP_TOKEN:", token?.value ? `✅ Configurado (${token.value.substring(0, 15)}...)` : "❌ Faltante");
    console.log("   - WHATSAPP_PHONE_NUMBER_ID:", phoneId?.value || "❌ Faltante");
    console.log("   - WHATSAPP_BUSINESS_ACCOUNT_ID:", wabaId?.value || "❌ Faltante");

    // 2. Probar conexión en vivo con Meta Graph API
    console.log("\n2. Validando comunicación con los servidores de Meta Graph API v21.0...");
    const phoneRes = await fetch(`https://graph.facebook.com/v21.0/${phoneId.value}?fields=verified_name,code_verification_status,display_phone_number,quality_rating`, {
        headers: { 'Authorization': `Bearer ${token.value}` }
    });
    const phoneData = await phoneRes.json();
    console.log("   - Respuesta Meta:", phoneData);

    // 3. Probar permisos y WABA
    console.log("\n3. Validando cuenta comercial de WhatsApp (WABA)...");
    const wabaRes = await fetch(`https://graph.facebook.com/v21.0/${wabaId.value}?fields=id,name,currency,timezone_id`, {
        headers: { 'Authorization': `Bearer ${token.value}` }
    });
    const wabaData = await wabaRes.json();
    console.log("   - Cuenta Comercial:", wabaData);

    // 4. Verificar conversaciones registradas en el CRM
    const totalConv = await prisma.wAConversation.count();
    const totalMsg = await prisma.wAMessage.count();
    const latestConv = await prisma.wAConversation.findFirst({
        orderBy: { updatedAt: 'desc' },
        include: {
            contact: true,
            owner: true,
            messages: { take: 3, orderBy: { createdAt: 'desc' } }
        }
    });

    console.log("\n4. Estado del CRM en Atomic ERP:");
    console.log(`   - Total conversaciones en DB: ${totalConv}`);
    console.log(`   - Total mensajes en DB: ${totalMsg}`);
    if (latestConv) {
        console.log(`   - Última conversación: ${latestConv.contact?.name || latestConv.contact?.whatsappId}`);
        console.log(`   - Asesor asignado: ${latestConv.owner?.name || 'Sin asignar'}`);
        console.log(`   - Últimos mensajes:`);
        latestConv.messages.forEach(m => {
            console.log(`     [${m.direction}] (${m.type}) ${m.body?.substring(0, 50)}...`);
        });
    }

    console.log("\n=== VALIDACIÓN COMPLETADA CON ÉXITO ===");
}

testLive().catch(console.error).finally(() => prisma.$disconnect());
