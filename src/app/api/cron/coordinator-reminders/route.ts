export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { 
    checkAndSendScheduledCoordinatorReminders, 
    checkAndSendMorningBriefingToJuan, 
    checkInactivityAndAlertJuan 
} from '@/lib/karen/karenBrain';

/**
 * Cron Endpoint para Recordatorios y Reportes Automáticos de Coordinación y Gerencia
 * - Dispara recordatorios matutinos (9:00 AM) y vespertinos (7:00 PM) para Cristina (0980319050)
 * - Dispara saludo matutino diario a Juan (0969043453)
 * - Revisa inactividad y envía alertas preventivas
 * - Permite testeo forzado con query param: ?force=morning o ?force=evening
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const force = searchParams.get('force') as 'morning' | 'evening' | null;

        const cristinaResult = await checkAndSendScheduledCoordinatorReminders(force || undefined);
        const juanBriefingSent = await checkAndSendMorningBriefingToJuan();
        const inactivityAlertSent = await checkInactivityAndAlertJuan();

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            cristina: cristinaResult,
            juan: {
                morningBriefingSent: juanBriefingSent,
                inactivityAlertSent: inactivityAlertSent
            }
        });
    } catch (error: any) {
        console.error('[CRON_COORDINATOR_REMINDERS_ERR]', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    return GET(req);
}
