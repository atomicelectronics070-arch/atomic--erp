export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { executeSmartRetryForMessage, executeSmartAutoRetryBatch, parseRetryMetadata } from '@/lib/whatsapp/auto-retry';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const runBatch = searchParams.get('run') === 'true';

        if (runBatch) {
            const batchResult = await executeSmartAutoRetryBatch(20);
            return NextResponse.json({
                success: true,
                ...batchResult
            });
        }

        // Devolver lista de mensajes fallidos con sus estados de reintento
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const failed = await prisma.wAMessage.findMany({
            where: {
                direction: 'OUTBOUND',
                status: 'FAILED',
                createdAt: { gte: twentyFourHoursAgo }
            },
            include: {
                conversation: {
                    include: { contact: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 30
        });

        const formatted = failed.map(m => {
            const meta = parseRetryMetadata(m.errorMessage);
            const remainingSec = meta.nextRetryAt > Date.now() 
                ? Math.ceil((meta.nextRetryAt - Date.now()) / 1000) 
                : 0;

            return {
                id: m.id,
                conversationId: m.conversationId,
                clientName: m.conversation?.contact?.name || 'Cliente WhatsApp',
                phone: m.conversation?.contact?.whatsappId || '',
                body: m.body,
                createdAt: m.createdAt,
                attempt: meta.attempt,
                maxAttempts: meta.maxAttempts,
                nextRetryAt: meta.nextRetryAt,
                remainingSec,
                cleanError: meta.cleanError
            };
        });

        return NextResponse.json({
            count: formatted.length,
            messages: formatted
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { messageId, conversationId, force = true } = body;

        // Caso 1: Se especifica messageId directo
        if (messageId) {
            const result = await executeSmartRetryForMessage(messageId, { force: Boolean(force) });
            return NextResponse.json({
                success: result.success,
                message: result.success 
                    ? '¡Mensaje entregado y reportado correcto por Meta WhatsApp!' 
                    : `Reintento procesado: ${result.errorMessage || 'En espera de próximo intento'}`,
                data: result
            }, { status: result.success ? 200 : 202 });
        }

        // Caso 2: Se especifica conversationId
        if (conversationId) {
            const targetMsg = await prisma.wAMessage.findFirst({
                where: {
                    conversationId,
                    direction: 'OUTBOUND',
                    status: 'FAILED'
                },
                orderBy: { createdAt: 'desc' }
            });

            if (!targetMsg) {
                return NextResponse.json({
                    success: true,
                    message: 'No hay mensajes fallidos pendientes en este chat.',
                    alreadyClean: true
                });
            }

            const result = await executeSmartRetryForMessage(targetMsg.id, { force: Boolean(force) });
            return NextResponse.json({
                success: result.success,
                message: result.success 
                    ? '¡Mensaje entregado y reportado correcto por Meta WhatsApp!' 
                    : `Reintento procesado: ${result.errorMessage || 'En espera de próximo intento'}`,
                data: result
            }, { status: result.success ? 200 : 202 });
        }

        // Caso 3: Ejecución batch de fondo
        const batchResult = await executeSmartAutoRetryBatch(15);
        return NextResponse.json({
            success: true,
            message: `Batch completado: ${batchResult.succeeded} entregados con éxito, ${batchResult.failed} fallidos, ${batchResult.scanned} escaneados.`,
            ...batchResult
        });
    } catch (e: any) {
        console.error('[API_AUTO_RETRY_ERROR]', e);
        return NextResponse.json({ error: e.message || 'Error en motor de auto-reintento' }, { status: 500 });
    }
}
