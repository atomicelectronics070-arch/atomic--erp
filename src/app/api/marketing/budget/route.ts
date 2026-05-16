import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const budget = await prisma.marketingMasterBudget.findFirst({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(budget || { totalAmount: 0 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { totalAmount } = await req.json();
        
        let budget = await prisma.marketingMasterBudget.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        if (budget) {
            budget = await prisma.marketingMasterBudget.update({
                where: { id: budget.id },
                data: { totalAmount }
            });
        } else {
            budget = await prisma.marketingMasterBudget.create({
                data: { totalAmount }
            });
        }

        return NextResponse.json(budget);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
    }
}
