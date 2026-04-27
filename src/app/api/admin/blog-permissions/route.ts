import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true, canCreateBlogs: true },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGEMENT')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { userId, canCreateBlogs } = await req.json()
        if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 })

        const updated = await prisma.user.update({
            where: { id: userId },
            data: { canCreateBlogs }
        })

        return NextResponse.json({ success: true, user: updated })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}


