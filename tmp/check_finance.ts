import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const ticketCount = await prisma.paymentTicket.count();
    console.log(`PaymentTicket count: ${ticketCount}`);
    
    const transactionCount = await prisma.transaction.count();
    console.log(`Transaction count: ${transactionCount}`);
    
    const latestTickets = await prisma.paymentTicket.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log('Latest Tickets:', JSON.stringify(latestTickets, null, 2));

    const latestTransactions = await prisma.transaction.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log('Latest Transactions:', JSON.stringify(latestTransactions, null, 2));

  } catch (error) {
    console.error('Error checking DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
