export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const type = searchParams.get("type") || "all"

        // Fetch clients originating from web landing forms
        const leads = await prisma.client.findMany({
            where: {
                OR: [
                    { source: "MANUAL_NEGOCIACION_PROVEEDORES" },
                    { source: "LANDING_PROVEEDORES" },
                    { requirement: { contains: "Guía", mode: "insensitive" } },
                    { requirement: { contains: "Proveedores", mode: "insensitive" } },
                    { requirement: { contains: "landing", mode: "insensitive" } },
                ]
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                city: true,
                source: true,
                requirement: true,
                status: true,
                createdAt: true,
                salesperson: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            total: leads.length,
            leads
        })
    } catch (err) {
        console.error("[formularios-api] Error fetching form leads:", err)
        return NextResponse.json({ error: "Error al obtener los datos de formularios" }, { status: 500 })
    }
}
