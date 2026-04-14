import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
    try {
        // Restauramos todos los productos marcados como eliminados
        const result = await (prisma as any).product.updateMany({
            where: { isDeleted: true },
            data: { isDeleted: false, isActive: true }
        })

        return NextResponse.json({
            success: true,
            message: `Se han restaurado ${result.count} productos.`,
            count: result.count
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET() {
    return NextResponse.json({ message: "Utiliza POST para restaurar todos los productos." })
}
