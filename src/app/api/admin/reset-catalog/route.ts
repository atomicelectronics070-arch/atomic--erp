import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { confirm } = await req.json();
        
        if (confirm !== "BORRAR_TODO_EL_CATALOGO") {
            return NextResponse.json({ success: false, message: "Confirmación de seguridad requerida." }, { status: 400 });
        }

        console.log("⚠️ Iniciando reinicio de catálogo...");

        let totalDeleted = 0;
        let hasMore = true;
        const batchSize = 1000;

        while (hasMore) {
            const batch = await prisma.product.findMany({
                where: { isDeleted: false },
                select: { id: true },
                take: batchSize
            });

            if (batch.length === 0) {
                hasMore = false;
                break;
            }

            const ids = batch.map(p => p.id);
            await prisma.product.updateMany({
                where: { id: { in: ids } },
                data: { isDeleted: true }
            });

            totalDeleted += batch.length;
            console.log(`✅ Lote completado: ${totalDeleted} productos procesados.`);
        }

        return NextResponse.json({ 
            success: true, 
            message: `Catálogo reiniciado con éxito. Se archivaron ${totalDeleted} productos.`,
            deletedCount: totalDeleted
        });
    } catch (error: any) {
        console.error("❌ Error en reinicio de catálogo:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
