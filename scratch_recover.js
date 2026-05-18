const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function recover() {
    try {
        const ticket = await prisma.paymentTicket.findFirst({
            where: { concept: { contains: 'erik', mode: 'insensitive' } },
            orderBy: { createdAt: 'desc' }
        });

        if (!ticket) {
            console.log("No ticket found for Erik.");
            return;
        }

        console.log("Found Ticket:", ticket);

        const trx = await prisma.transaction.create({
            data: {
                trxId: `TRX-RECOVER-${Date.now().toString().slice(-4)}`,
                client: `Erik (Recovered from Ticket)`,
                amount: ticket.amount,
                pvp: ticket.amount,
                cost: 0,
                profit: ticket.amount,
                commission: 0,
                bonus: 0,
                status: "PAGADO",
                type: "Venta Directa",
                date: ticket.issueDate,
                quoteNumber: "RECUPERADO",
                salespersonId: ticket.advisorId
            }
        });

        console.log("Recovered Transaction:", trx);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

recover();
