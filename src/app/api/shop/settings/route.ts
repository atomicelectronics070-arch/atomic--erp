import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: "SHOP_SETTINGS" }
        })

        if (!setting) {
            return NextResponse.json({ settings: {} })
        }

        return NextResponse.json({ settings: JSON.parse(setting.value) })
    } catch (error) {
        return NextResponse.json({ settings: {} })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGEMENT")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()

        const setting = await prisma.systemSetting.upsert({
            where: { key: "SHOP_SETTINGS" },
            update: { value: JSON.stringify(body), description: "Advanced Shop Configuration (Mini Shopify)" },
            create: { key: "SHOP_SETTINGS", value: JSON.stringify(body), description: "Advanced Shop Configuration (Mini Shopify)" }
        })

        return NextResponse.json({ success: true, settings: JSON.parse(setting.value) })
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 })
    }
}
