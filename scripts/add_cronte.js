const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        const category = await prisma.category.findFirst();

        const cronte1 = await prisma.product.create({
            data: {
                name: "Barra Antipánico Cronte CR-500 (1 Punto)",
                description: "<p>Barra antipánico tipo Push ideal para puertas de emergencia y salidas de evacuación rápida. Fabricada con materiales de alta resistencia, certificada contra fuego y uso pesado (Heavy Duty). Su diseño liso asegura una apertura instantánea con mínima presión.</p>",
                price: 85.00,
                compareAtPrice: 120.00,
                sku: "CRONTE-CR500",
                provider: "Cronte",
                stock: 15,
                isActive: true,
                categoryId: category.id,
                images: JSON.stringify(["https://m.media-amazon.com/images/I/51r26z3Q3nL._AC_SL1500_.jpg"])
            }
        });

        const cronte2 = await prisma.product.create({
            data: {
                name: "Barra Antipánico Cronte CR-800 Doble (2 Puntos)",
                description: "<p>Máxima seguridad industrial. La CR-800 es un sistema de 2 puntos de anclaje (arriba y abajo) para puertas dobles. Cuenta con alarma integrada opcional, estructura de acero inoxidable 304 y resistencia probada en temperaturas extremas.</p>",
                price: 150.00,
                compareAtPrice: 195.00,
                sku: "CRONTE-CR800",
                provider: "Cronte",
                stock: 8,
                isActive: true,
                categoryId: category.id,
                images: JSON.stringify(["https://m.media-amazon.com/images/I/61k3L4M-1mL._AC_SL1500_.jpg"])
            }
        });

        console.log("Cronte products created successfully:", cronte1.id, cronte2.id);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
