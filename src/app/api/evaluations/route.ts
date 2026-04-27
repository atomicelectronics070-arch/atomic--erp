import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const evaluations = await prisma.evaluation.findMany({
            include: {
                evaluatee: true,
                evaluator: true,
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(evaluations)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch evaluations" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const evaluation = await prisma.evaluation.create({
            data: {
                evaluatorId: body.evaluatorId,
                evaluateeId: body.evaluateeId,
                score: parseFloat(body.score),
                rubricData: typeof body.rubricData === 'string' ? body.rubricData : JSON.stringify(body.rubricData),
                observations: body.observations,
                cycleDay: parseInt(body.cycleDay || "1"),
            },
            include: {
                evaluatee: true,
                evaluator: true,
            }
        })
        return NextResponse.json(evaluation)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to create evaluation" }, { status: 500 })
    }
}


