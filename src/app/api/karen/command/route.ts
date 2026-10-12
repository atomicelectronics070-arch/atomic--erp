export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { karenState, processJuanCommand, isJuan } from '@/lib/karen/karenBrain';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { command, mode } = body;

        // 1. Cambio directo de modo si se solicita
        if (mode && (mode === "AUTOMATIC" || mode === "MANUAL" || mode === "AWAITING_APPROVAL")) {
            karenState.mode = mode;
            return NextResponse.json({
                success: true,
                mode: karenState.mode,
                message: `Modo de Karen cambiado a ${karenState.mode}`
            });
        }

        // 2. Procesar comando de texto como si lo enviara Juan
        if (command) {
            const reply = await processJuanCommand(command);
            return NextResponse.json({
                success: true,
                reply,
                karenState: {
                    mode: karenState.mode,
                    pendingSend: karenState.pendingSend,
                    lastUncatalogedChat: karenState.lastUncatalogedChat
                }
            });
        }

        return NextResponse.json({ error: "Comando o modo no especificado" }, { status: 400 });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
