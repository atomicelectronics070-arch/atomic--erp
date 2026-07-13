const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const nuevaDesc = `Gafas de Sol con Cámara Espía Oculta HD 1080p. Perfectas para grabaciones de seguridad, deportes al aire libre y monitoreo discreto.

✨ **Características Principales:**
- **Resolución HD:** Captura videos nítidos en 1080p con audio integrado.
- **Diseño Indetectable:** La lente está perfectamente oculta en el armazón, luciendo como unas gafas deportivas modernas.
- **Batería de Larga Duración:** Hasta 90 minutos de grabación continua.
- **Fácil de Usar:** Graba con un solo toque y guarda los archivos en memoria MicroSD (no incluida).
- **Protección UV:** Cristales polarizados para proteger tus ojos mientras grabas.

Un producto indispensable para vigilancia encubierta o capturar tus mejores momentos en primera persona sin usar las manos.`;

    await prisma.product.update({
        where: { id: "cmmwxkmn201eg86cqke4hsiou" },
        data: { description: nuevaDesc }
    });
    console.log("Product updated");
}

main().catch(console.error).finally(() => prisma.$disconnect());
