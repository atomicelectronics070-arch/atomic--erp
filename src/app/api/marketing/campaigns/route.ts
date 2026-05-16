import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const campaigns = await prisma.marketingCampaign.findMany({
            include: { spendLogs: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(campaigns);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const campaign = await prisma.marketingCampaign.create({
            data: {
                publishedAd: data.publishedAd,
                platform: data.platform,
                assignedBudget: data.assignedBudget,
                taxDeducted: data.taxDeducted,
                usableBudget: data.usableBudget,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                targetHours: data.targetHours,
                currentSpent: data.currentSpent || 0,
                status: 'ACTIVE'
            },
            include: { spendLogs: true }
        });
        return NextResponse.json(campaign);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
    }
}
