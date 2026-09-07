const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testMedia() {
    console.log("Probando descarga de imagen desde Meta con el nuevo token...");
    const imgMsg = await prisma.wAMessage.findFirst({
        where: { type: 'image' },
        orderBy: { createdAt: 'desc' }
    });

    if (!imgMsg) {
        console.log("No hay mensajes de tipo image en DB.");
        return;
    }

    console.log("Mensaje de imagen encontrado:", imgMsg.id, "mediaUrl:", imgMsg.mediaUrl);
    // mediaUrl usually looks like /api/whatsapp/media/{mediaId}
    const mediaId = imgMsg.mediaUrl?.split('/').pop();
    if (!mediaId) return;

    console.log("Consultando Meta Graph API para mediaId:", mediaId);
    const token = (await prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_TOKEN' } })).value;

    const metaRes = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const metaData = await metaRes.json();
    console.log("Respuesta de Meta para el archivo:", metaData);
}

testMedia().catch(console.error).finally(() => prisma.$disconnect());
