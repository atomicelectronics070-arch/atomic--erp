import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const resolvedParams = await params
        const evaluation = await prisma.evaluation.update({
            where: { id: resolvedParams.id },
            data: {
                score: parseFloat(body.score),
                rubricData: typeof body.rubricData === 'string' ? body.rubricData : JSON.stringify(body.rubricData),
                observations: body.observations,
                cycleDay: parseInt(body.cycleDay),
            }
        })
        return NextResponse.json(evaluation)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update evaluation" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const resolvedParams = await params
        await prisma.evaluation.delete({
            where: { id: resolvedParams.id }
        })
        return NextResponse.json({ message: "Evaluation permanently deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete evaluation" }, { status: 500 })
    }
}

