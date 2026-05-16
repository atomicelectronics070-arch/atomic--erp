import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        
        // Create the spend log
        const spendLog = await prisma.marketingSpendLog.create({
            data: {
                campaignId: data.campaignId,
                date: new Date(data.date),
                amount: data.amount
            }
        });

        // Recalculate total spent for this campaign
        const allLogs = await prisma.marketingSpendLog.findMany({
            where: { campaignId: data.campaignId }
        });
        
        const totalSpent = allLogs.reduce((acc, curr) => acc + curr.amount, 0);

        // Update campaign's currentSpent
        const updatedCampaign = await prisma.marketingCampaign.update({
            where: { id: data.campaignId },
            data: { currentSpent: totalSpent },
            include: { spendLogs: true }
        });

        return NextResponse.json(updatedCampaign);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create spend log' }, { status: 500 });
    }
}
