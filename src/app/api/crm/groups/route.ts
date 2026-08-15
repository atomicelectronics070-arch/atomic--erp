export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Helper to get or create contact groups system setting
async function getPersistedGroups() {
    let setting = await prisma.systemSetting.findUnique({
        where: { key: "crm_contact_groups" }
    })
    
    if (!setting) {
        setting = await prisma.systemSetting.create({
            data: {
                key: "crm_contact_groups",
                value: JSON.stringify(["CLIENTES VIP", "SEGUIMIENTO URGENTE", "ZONA NORTE"]),
                description: "CRM Contact Groups persisted list"
            }
        })
    }
    
    try {
        return JSON.parse(setting.value) as string[]
    } catch (e) {
        return ["CLIENTES VIP", "SEGUIMIENTO URGENTE", "ZONA NORTE"]
    }
}

// Helper to save persisted contact groups
async function savePersistedGroups(groups: string[]) {
    return await prisma.systemSetting.upsert({
        where: { key: "crm_contact_groups" },
        update: { value: JSON.stringify(groups) },
        create: {
            key: "crm_contact_groups",
            value: JSON.stringify(groups),
            description: "CRM Contact Groups persisted list"
        }
    })
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const isAdmin = session.user.role === "ADMIN" || session.user.role === "MANAGEMENT"
        
        // Load custom contact groups persistently
        const groups = await getPersistedGroups()

        // Fetch all clients to build dynamic counts and validation
        const clients = await prisma.client.findMany({
            where: isAdmin ? {} : { salespersonId: session.user.id },
            include: {
                salesperson: { select: { name: true } }
            },
            orderBy: { updatedAt: 'desc' }
        })

        const grouped = clients.reduce((acc: any, client: any) => {
            const cat = client.category || "GENERAL"
            if (!acc[cat]) acc[cat] = []
            acc[cat].push(client)
            return acc
        }, {})

        return NextResponse.json({ groups, grouped })
    } catch (error) {
        console.error("Fetch CRM Groups Error:", error)
        return NextResponse.json({ error: "Failed to fetch CRM groups" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { groupName } = await req.json()
        if (!groupName || typeof groupName !== "string" || !groupName.trim()) {
            return NextResponse.json({ error: "Invalid group name" }, { status: 400 })
        }

        const normalizedGroupName = groupName.trim().toUpperCase()
        const currentGroups = await getPersistedGroups()

        if (currentGroups.includes(normalizedGroupName)) {
            return NextResponse.json({ error: "Group already exists" }, { status: 400 })
        }

        const updatedGroups = [...currentGroups, normalizedGroupName]
        await savePersistedGroups(updatedGroups)

        return NextResponse.json({ success: true, groups: updatedGroups })
    } catch (error: any) {
        console.error("POST CRM Groups Error:", error)
        return NextResponse.json({ error: "Failed to add group", details: error.message }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { groupName } = await req.json()
        if (!groupName || typeof groupName !== "string") {
            return NextResponse.json({ error: "Invalid group name" }, { status: 400 })
        }

        const normalizedGroupName = groupName.trim().toUpperCase()
        const currentGroups = await getPersistedGroups()

        if (!currentGroups.includes(normalizedGroupName)) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 })
        }

        const updatedGroups = currentGroups.filter(g => g !== normalizedGroupName)
        await savePersistedGroups(updatedGroups)

        // Cascading reset: set category for all clients belonging to this group back to "GENERAL"
        await prisma.client.updateMany({
            where: { category: normalizedGroupName },
            data: { category: "GENERAL" }
        })

        return NextResponse.json({ success: true, groups: updatedGroups })
    } catch (error: any) {
        console.error("DELETE CRM Groups Error:", error)
        return NextResponse.json({ error: "Failed to delete group", details: error.message }, { status: 500 })
    }
}
