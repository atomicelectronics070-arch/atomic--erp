export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, lat, lng, address, salespersonId } = body

        if (!name || !salespersonId) {
            return NextResponse.json({ error: "Name and salespersonId are required" }, { status: 400 })
        }

        // Verifica si ya existe un prospecto con el mismo nombre y ubicación para evitar duplicados exactos
        const existing = await prisma.client.findFirst({
            where: {
                name,
                lat,
                lng
            }
        })

        if (existing) {
            return NextResponse.json({ error: "Este prospecto ya ha sido guardado" }, { status: 400 })
        }

        const newProspect = await prisma.client.create({
            data: {
                name,
                lat,
                lng,
                address,
                salespersonId,
                status: "PROSPECTO",
                source: "MAPS"
            }
        })

        return NextResponse.json(newProspect, { status: 201 })
    } catch (error) {
        console.error("Prospect mapping error:", error)
        return NextResponse.json({ error: "Failed to save prospect" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const salespersonId = searchParams.get("salespersonId")
        
        let whereClause: any = {
            source: "MAPS"
        }
        
        if (salespersonId) {
            whereClause.salespersonId = salespersonId
        }

        const prospects = await prisma.client.findMany({
            where: whereClause,
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(prospects)
    } catch (error) {
        console.error("Prospect fetch error:", error)
        return NextResponse.json({ error: "Failed to fetch prospects" }, { status: 500 })
    }
}
