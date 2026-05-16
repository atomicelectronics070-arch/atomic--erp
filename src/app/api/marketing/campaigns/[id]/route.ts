import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await req.json();
        
        const updateData: any = {};
        
        if (data.assignedBudget !== undefined) updateData.assignedBudget = data.assignedBudget;
        if (data.taxDeducted !== undefined) updateData.taxDeducted = data.taxDeducted;
        if (data.usableBudget !== undefined) updateData.usableBudget = data.usableBudget;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.realEndDate !== undefined) updateData.realEndDate = new Date(data.realEndDate);
        if (data.realSales !== undefined) updateData.realSales = data.realSales;
        if (data.realConsultants !== undefined) updateData.realConsultants = data.realConsultants;
        if (data.realBudgetDebited !== undefined) updateData.realBudgetDebited = data.realBudgetDebited;
        if (data.grossMargin !== undefined) updateData.grossMargin = data.grossMargin;
        if (data.minExpectedReturn !== undefined) updateData.minExpectedReturn = data.minExpectedReturn;
        if (data.currentSpent !== undefined) updateData.currentSpent = data.currentSpent;

        const campaign = await prisma.marketingCampaign.update({
            where: { id },
            data: updateData,
            include: { spendLogs: true }
        });

        return NextResponse.json(campaign);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
    }
}
