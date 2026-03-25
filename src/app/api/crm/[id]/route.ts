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
        const client = await prisma.client.update({
            where: { id: resolvedParams.id },
            data: {
                name: body.name,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone,
                requirement: body.requirement,
                city: body.city,
                status: body.status,
                source: body.source,
                campaignsSent: body.campaignsSent,
                purchaseCount: body.purchaseCount
            }
        })
        return NextResponse.json(client)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const resolvedParams = await params
        await prisma.client.delete({
            where: { id: resolvedParams.id }
        })
        return NextResponse.json({ message: "Client permanently deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
    }
}
