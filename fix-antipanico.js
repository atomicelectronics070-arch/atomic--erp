const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {name: {contains: 'antipanico', mode: 'insensitive'}},
        {name: {contains: 'antipánico', mode: 'insensitive'}},
        {name: {contains: 'push', mode: 'insensitive'}},
        {name: {contains: 'toallero', mode: 'insensitive'}},
        {name: {contains: 'eiffel', mode: 'insensitive'}}
      ]
    }
  });

  for (const p of products) {
    let cleanDesc = p.description || "";
    // Remove confidential provider names
    cleanDesc = cleanDesc.replace(/KINUTEK/gi, 'ATOMIC');
    cleanDesc = cleanDesc.replace(/CRONTE/gi, '');
    cleanDesc = cleanDesc.replace(/YALE/gi, '');
    cleanDesc = cleanDesc.replace(/BRAND:/gi, '');
    cleanDesc = cleanDesc.replace(/MODEL:/gi, '');
    cleanDesc = cleanDesc.replace(/MARCA:/gi, '');
    cleanDesc = cleanDesc.replace(/MODELO:/gi, '');
    
    if (
        p.name.includes("60 CENTIMETROS") || 
        p.name.includes("100 CENTIMETROS") || 
        p.name.includes("TOALLERO") || 
        p.name.includes("1 METRO 1 PUNTO") || 
        p.name.includes("EIFFEL") ||
        p.name.includes("BARRA ANTIPANICO VERTICAL") ||
        p.name.includes("BARRERA ANTIPANICO VERTICAL") ||
        p.name.includes("CERRADURA ANTI PANICO") ||
        p.name.includes("CERRADURA ANTIUPANICO") ||
        p.name.includes("Manija Eiffel") ||
        p.name.includes("ROJO DE 1 METRO")
    ) {
        await prisma.product.update({
            where: { id: p.id },
            data: { 
                description: "<p>Sistema de evacuación de emergencia homologado y certificado. Máxima seguridad y respuesta instantánea garantizada.</p>",
                provider: null 
            }
        });
        console.log("Updated description for:", p.name);
    }
  }
}

run();
