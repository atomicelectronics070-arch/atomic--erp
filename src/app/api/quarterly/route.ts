import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const plans = await prisma.quarterlyPlan.findMany({
            include: {
                assignedUsers: {
                    select: { id: true, name: true, role: true }
                },
                tasks: true
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(plans)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await req.json()
        const { 
            name, objective, participants, notifyUsers, 
            postsPerDay, retargetingPerWeek, leadsPerWeek,
            adminMeetingsPerWeek, adminProvideDbPerWeek,
            assignedUserIds 
        } = data

        const plan = await prisma.quarterlyPlan.create({
            data: {
                name,
                objective,
                participants: JSON.stringify(participants),
                notifyUsers,
                postsPerDay: parseInt(postsPerDay),
                retargetingPerWeek: parseInt(retargetingPerWeek),
                leadsPerWeek: parseInt(leadsPerWeek),
                adminMeetingsPerWeek: parseInt(adminMeetingsPerWeek),
                adminProvideDbPerWeek: parseInt(adminProvideDbPerWeek),
                assignedUsers: {
                    connect: assignedUserIds.map((id: string) => ({ id }))
                }
            }
        })

        // Create initial tasks for each assigned user for the 12 weeks
        // This is a simplified version; in a real app, you might create them lazily
        
        return NextResponse.json(plan)
    } catch (error) {
        console.error("Create plan error:", error)
        return NextResponse.json({ error: "Failed to create plan" }, { status: 500 })
    }
}


