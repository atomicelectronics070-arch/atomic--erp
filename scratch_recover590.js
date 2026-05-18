const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Check if $590 already exists
    const exists = await prisma.transaction.findFirst({
        where: { amount: 590, status: { not: 'CANCELADO' } }
    });
    if (exists) {
        console.log("✅ Ingreso de $590 ya existe:", exists.trxId, exists.client, exists.date);
        return;
    }

    // Get last TRX number
    const lastTrx = await prisma.transaction.findFirst({ orderBy: { trxId: 'desc' } });
    let nextNumber = 1;
    if (lastTrx) {
        const matches = lastTrx.trxId.match(/TRX-(\d+)/);
        if (matches) nextNumber = parseInt(matches[1]) + 1;
    }
    const trxId = `TRX-${nextNumber.toString().padStart(3, '0')}`;

    const trx = await prisma.transaction.create({
        data: {
            trxId,
            client: 'RECUPERADO',
            amount: 590,
            pvp: 590,
            cost: 0,
            profit: 590,
            commission: 0,
            bonus: 0,
            status: 'PAGADO',
            commissionStatus: 'PENDIENTE',
            type: 'Ingreso Simple',
            date: new Date('2026-04-15'),
            quoteNumber: 'RECUPERADO-590',
        }
    });
    console.log("✅ Ingreso de $590 restaurado:", trx.trxId);
}

main().catch(console.error).finally(() => prisma.$disconnect());
