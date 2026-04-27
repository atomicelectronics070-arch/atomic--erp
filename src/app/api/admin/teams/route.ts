import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const teams = await prisma.team.findMany({
            include: { members: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(teams)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const team = await prisma.team.create({
            data: {
                name: body.name,
                description: body.description,
            }
        })
        return NextResponse.json(team)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
    }
}


