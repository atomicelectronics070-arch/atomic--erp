export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

/**
 * Recordatorios internos hacia gerencia, coordinación y asesores desactivados.
 * Karen opera exclusivamente como agente comercial y clasificador CRM.
 */
export async function GET() {
    return NextResponse.json({
        success: true,
        disabled: true,
        timestamp: new Date().toISOString(),
        message: 'Karen proactive notifications and internal coordinator/CEO reminders are disabled.'
    });
}

export async function POST() {
    return GET();
}
