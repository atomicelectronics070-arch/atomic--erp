export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get('conversationId');

        if (!conversationId) {
            return NextResponse.json({ error: 'Falta conversationId' }, { status: 400 });
        }

        const conv = await prisma.wAConversation.findUnique({
            where: { id: conversationId },
            include: { tags: true }
        });

        if (!conv) {
            return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
        }

        const isBotActive = conv.status !== 'MANUAL' && !conv.tags?.some(t => t.name === 'BOT_OFF');

        return NextResponse.json({
            conversationId,
            botActive: isBotActive,
            status: conv.status
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await req.json();
        const { conversationId, botActive } = body;

        if (!conversationId || typeof botActive !== 'boolean') {
            return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
        }

        const currentConv = await prisma.wAConversation.findUnique({
            where: { id: conversationId },
            include: { tags: true }
        });

        if (!currentConv) {
            return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });
        }

        // Si desactivamos el bot: status = 'MANUAL'
        // Si activamos el bot: status = 'OPEN'
        const nextStatus = botActive ? 'OPEN' : 'MANUAL';

        const updated = await prisma.wAConversation.update({
            where: { id: conversationId },
            data: {
                status: nextStatus,
                updatedAt: new Date()
            }
        });

        console.log(`[BOT_TOGGLE] Chat ${conversationId} cambiado a Bot: ${botActive ? 'ON (Automático)' : 'OFF (Manual)'}`);

        return NextResponse.json({
            success: true,
            conversationId,
            botActive,
            status: updated.status,
            message: botActive ? '🤖 Bot activado para este chat' : '🛑 Bot pausado: Atención 100% manual'
        });
    } catch (e: any) {
        console.error('[API_TOGGLE_BOT_ERROR]', e);
        return NextResponse.json({ error: e.message || 'Error al cambiar estado del bot' }, { status: 500 });
    }
}
