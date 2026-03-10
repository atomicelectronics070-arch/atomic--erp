import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const domain = searchParams.get("domain")

    try {
        if (domain) {
            const template = await prisma.extractionTemplate.findUnique({
                where: { domain }
            })
            return NextResponse.json(template)
        }
        const templates = await prisma.extractionTemplate.findMany({
            orderBy: { domain: 'asc' }
        })
        return NextResponse.json(templates)
    } catch (error) {
        return NextResponse.json({ error: "Error fetching templates" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { domain, name, selectors } = body

        const template = await prisma.extractionTemplate.upsert({
            where: { domain },
            update: { name, selectors: JSON.stringify(selectors) },
            create: { domain, name, selectors: JSON.stringify(selectors) }
        })

        return NextResponse.json(template)
    } catch (error) {
        return NextResponse.json({ error: "Error saving template" }, { status: 500 })
    }
}
