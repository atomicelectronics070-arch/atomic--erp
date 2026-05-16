import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        
        // Find the log first to get the campaignId
        const logToDelete = await prisma.marketingSpendLog.findUnique({
            where: { id }
        });

        if (!logToDelete) {
            return NextResponse.json({ error: 'Spend log not found' }, { status: 404 });
        }

        const campaignId = logToDelete.campaignId;

        // Delete the log
        await prisma.marketingSpendLog.delete({
            where: { id }
        });

        // Recalculate total spent for this campaign
        const allLogs = await prisma.marketingSpendLog.findMany({
            where: { campaignId }
        });
        
        const totalSpent = allLogs.reduce((acc, curr) => acc + curr.amount, 0);

        // Update campaign's currentSpent
        const updatedCampaign = await prisma.marketingCampaign.update({
            where: { id: campaignId },
            data: { currentSpent: totalSpent },
            include: { spendLogs: true }
        });

        return NextResponse.json(updatedCampaign);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete spend log' }, { status: 500 });
    }
}
