import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// In-memory profiles map as persistent cache
const profilesCache: Record<string, any> = {
    "ceo@atomic.com.ec": {
        fullName: "CEO Atomic Electronics",
        email: "ceo@atomic.com.ec",
        phone: "+593991112233",
        hasComputer: true,
        city: "Quito, Ecuador",
        schedule: "08:00 - 18:00",
        avatar: { gender: "hombre", hair: "corto", skin: "light", clothes: "suit", emoji: "👑" }
    },
    "coordinacion@atomic.com.ec": {
        fullName: "Luis G. Coordinador",
        email: "coordinacion@atomic.com.ec",
        phone: "+593992223344",
        hasComputer: true,
        city: "Guayaquil, Ecuador",
        schedule: "07:45 - 17:00",
        avatar: { gender: "hombre", hair: "ondulado", skin: "medium", clothes: "casual", emoji: "👨‍💼" }
    },
    "supervisor@atomic.com.ec": {
        fullName: "Supervisor QC Calidad",
        email: "supervisor@atomic.com.ec",
        phone: "+593993334455",
        hasComputer: true,
        city: "Quito, Ecuador",
        schedule: "06:00 - 15:00",
        avatar: { gender: "hombre", hair: "corto", skin: "medium", clothes: "tech", emoji: "🛡️" }
    }
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email") || session.user?.email || ""

    // Try to get from database
    let dbUser = null
    try {
        dbUser = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true, email: true, name: true, phoneNumber: true,
                residenceSector: true, availability: true, profileData: true
            }
        })
    } catch (_) {}

    const cached = profilesCache[email] || {}
    const profile = {
        fullName: dbUser?.name || cached.fullName || "",
        email: dbUser?.email || email,
        phone: dbUser?.phoneNumber || cached.phone || "",
        hasComputer: cached.hasComputer ?? true,
        city: dbUser?.residenceSector || cached.city || "",
        schedule: dbUser?.availability || cached.schedule || "08:00 - 17:00",
        resumeUrl: cached.resumeUrl || null,
        hasResume: !!cached.resumeUrl,
        avatar: cached.avatar || { gender: "hombre", hair: "corto", skin: "medium", clothes: "casual", emoji: "👾" }
    }

    return NextResponse.json({ success: true, profile, allProfiles: profilesCache })
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    try {
        const body = await req.json()
        const userEmail = session.user?.email || ""

        const updatedProfile = {
            fullName: body.fullName || (session.user as any)?.name || "",
            email: userEmail,
            phone: body.phone || "",
            hasComputer: body.hasComputer ?? true,
            city: body.city || "",
            schedule: body.schedule || "08:00 - 17:00",
            resumeUrl: body.resumeUrl || null,
            hasResume: body.hasResume ?? false,
            avatar: body.avatar || { gender: "hombre", hair: "corto", skin: "medium", clothes: "casual", emoji: "👾" },
            updatedAt: new Date().toISOString()
        }

        profilesCache[userEmail] = updatedProfile

        // Update database if possible
        try {
            await prisma.user.update({
                where: { email: userEmail },
                data: {
                    name: updatedProfile.fullName,
                    phoneNumber: updatedProfile.phone,
                    residenceSector: updatedProfile.city,
                    availability: updatedProfile.schedule,
                    profileData: JSON.stringify(updatedProfile)
                }
            })
        } catch (_) {}

        return NextResponse.json({ success: true, profile: updatedProfile, allProfiles: profilesCache })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
