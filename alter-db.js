const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addCols() {
    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Client" ADD COLUMN "lat" DOUBLE PRECISION, ADD COLUMN "lng" DOUBLE PRECISION, ADD COLUMN "address" TEXT;`);
        console.log("Columns added successfully!");
    } catch(e) {
        console.error(e);
    }
}
addCols().finally(() => prisma.$disconnect());
