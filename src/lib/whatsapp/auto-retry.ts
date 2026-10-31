import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage, sendWhatsAppMedia, sanitizeToE164 } from './service';

export const MAX_RETRY_ATTEMPTS = 5;
export const BACKOFF_DELAYS_SEC = [15, 30, 60, 120, 300]; // 15s, 30s, 1m, 2m, 5m

export interface ParsedRetryMeta {
    attempt: number;
    maxAttempts: number;
    nextRetryAt: number;
    cleanError: string;
}

/**
 * Parsea el estado de reintento codificado en el campo errorMessage.
 * Formato: [INTENTOS: X/Y | PROXIMO: timestamp] Mensaje de error
 */
export function parseRetryMetadata(errorMessage?: string | null): ParsedRetryMeta {
    if (!errorMessage) {
        return {
            attempt: 0,
            maxAttempts: MAX_RETRY_ATTEMPTS,
            nextRetryAt: 0,
            cleanError: ''
        };
    }

    const match = errorMessage.match(/\[INTENTOS:\s*(\d+)\/(\d+)\s*\|\s*PROXIMO:\s*(\d+)\]\s*([\s\S]*)/);
    if (match) {
        return {
            attempt: parseInt(match[1], 10) || 0,
            maxAttempts: parseInt(match[2], 10) || MAX_RETRY_ATTEMPTS,
            nextRetryAt: parseInt(match[3], 10) || 0,
            cleanError: (match[4] || '').trim()
        };
    }

    return {
        attempt: 0,
        maxAttempts: MAX_RETRY_ATTEMPTS,
        nextRetryAt: 0,
        cleanError: errorMessage.trim()
    };
}

/**
 * Serializa los metadatos de reintento inteligente para almacenar en la BD.
 */
export function formatRetryMetadata(attempt: number, nextRetryAt: number, originalError: string): string {
    const cleanErr = (originalError || 'Fallo temporal en entrega Meta').replace(/\[INTENTOS:.*?\]\s*/g, '').trim();
    return `[INTENTOS: ${attempt}/${MAX_RETRY_ATTEMPTS} | PROXIMO: ${nextRetryAt}] ${cleanErr}`;
}

export interface SmartRetryResult {
    messageId: string;
    conversationId: string;
    phone: string;
    success: boolean;
    status: 'SENT' | 'FAILED';
    attempt: number;
    maxAttempts: number;
    nextRetryAt?: number;
    nextDelaySec?: number;
    errorMessage?: string | null;
    metaMessageId?: string;
    actionTaken: 'SENT_SUCCESS' | 'WAITING_BACKOFF' | 'FAILED_RETRY' | 'ALREADY_SENT' | 'MAX_ATTEMPTS_EXCEEDED';
}

/**
 * Ejecuta un reintento inteligente de un mensaje específico.
 * @param messageId ID del mensaje en WAMessage
 * @param options.force Si es true, ignora el tiempo de espera (backoff) y reintenta inmediatamente
 */
export async function executeSmartRetryForMessage(
    messageId: string,
    options: { force?: boolean } = {}
): Promise<SmartRetryResult> {
    const { force = false } = options;

    const message = await prisma.wAMessage.findUnique({
        where: { id: messageId },
        include: {
            conversation: {
                include: { contact: true }
            }
        }
    });

    if (!message || !message.conversation || !message.conversation.contact) {
        throw new Error(`Mensaje con ID ${messageId} no existe o no tiene conversación asociada.`);
    }

    const conv = message.conversation;
    const cleanPhone = sanitizeToE164(conv.contact.whatsappId);
    const parsed = parseRetryMetadata(message.errorMessage);

    // Si ya está SENT, no hacer nada
    if (message.status === 'SENT') {
        return {
            messageId: message.id,
            conversationId: conv.id,
            phone: cleanPhone,
            success: true,
            status: 'SENT',
            attempt: parsed.attempt,
            maxAttempts: parsed.maxAttempts,
            errorMessage: null,
            metaMessageId: message.whatsappMessageId || undefined,
            actionTaken: 'ALREADY_SENT'
        };
    }

    const now = Date.now();

    // Si no es forzado y aún no ha vencido el tiempo de espera programado
    if (!force && parsed.nextRetryAt > now) {
        const remainingSec = Math.ceil((parsed.nextRetryAt - now) / 1000);
        return {
            messageId: message.id,
            conversationId: conv.id,
            phone: cleanPhone,
            success: false,
            status: 'FAILED',
            attempt: parsed.attempt,
            maxAttempts: parsed.maxAttempts,
            nextRetryAt: parsed.nextRetryAt,
            nextDelaySec: remainingSec,
            errorMessage: parsed.cleanError,
            actionTaken: 'WAITING_BACKOFF'
        };
    }

    // Si ya excedió el número máximo de reintentos y no es forzado manualmente
    if (!force && parsed.attempt >= MAX_RETRY_ATTEMPTS) {
        return {
            messageId: message.id,
            conversationId: conv.id,
            phone: cleanPhone,
            success: false,
            status: 'FAILED',
            attempt: parsed.attempt,
            maxAttempts: parsed.maxAttempts,
            errorMessage: parsed.cleanError || 'Límite máximo de reintentos alcanzado',
            actionTaken: 'MAX_ATTEMPTS_EXCEEDED'
        };
    }

    // Limpiar texto de errores o prefijos residuales
    let cleanBody = message.body || '';
    if (cleanBody.includes('[ERROR DE ENVÍO META]:')) {
        cleanBody = cleanBody.replace(/⚠️\s*\[ERROR DE ENVÍO META\]:\s*/g, '');
        if (cleanBody.includes('\n\nMotivo del fallo:')) {
            cleanBody = cleanBody.split('\n\nMotivo del fallo:')[0].trim();
        }
    } else if (cleanBody.includes('[FALLO DE IA / PROCESO]')) {
        cleanBody = '¡Hola! Un asesor de ATOMIC Electronics se encuentra atendiendo tu solicitud.';
    }

    console.log(`[SMART_RETRY] Iniciando reintento (intento ${parsed.attempt + 1}/${MAX_RETRY_ATTEMPTS}) para mensaje ${message.id} -> ${cleanPhone}`);

    try {
        let metaResult: any = null;
        if (message.mediaUrl) {
            metaResult = await sendWhatsAppMedia(
                cleanPhone,
                message.mediaUrl,
                (message.type as any) || 'image',
                cleanBody
            );
        } else {
            metaResult = await sendWhatsAppMessage(cleanPhone, cleanBody);
        }

        const deliveredMsgId = metaResult?.messages?.[0]?.id || `retry-ok-${Date.now()}`;

        // ¡ENVÍO REPORTADO CORRECTO POR META!
        await prisma.wAMessage.update({
            where: { id: message.id },
            data: {
                body: cleanBody,
                status: 'SENT',
                errorMessage: null,
                whatsappMessageId: deliveredMsgId
            }
        });

        // Actualizar conversación: pasa a estado normal OPEN
        await prisma.wAConversation.update({
            where: { id: conv.id },
            data: {
                status: conv.status === 'LEAD_PAUTA' ? 'LEAD_PAUTA' : 'OPEN',
                updatedAt: new Date(),
                lastMessageAt: new Date()
            }
        });

        console.log(`[SMART_RETRY_SUCCESS] ¡Mensaje ${message.id} reportado correcto por Meta! WhatsAppMsgId: ${deliveredMsgId}`);

        return {
            messageId: message.id,
            conversationId: conv.id,
            phone: cleanPhone,
            success: true,
            status: 'SENT',
            attempt: parsed.attempt + 1,
            maxAttempts: parsed.maxAttempts,
            errorMessage: null,
            metaMessageId: deliveredMsgId,
            actionTaken: 'SENT_SUCCESS'
        };
    } catch (err: any) {
        const nextAttempt = parsed.attempt + 1;
        const delayIdx = Math.min(nextAttempt, BACKOFF_DELAYS_SEC.length - 1);
        const nextDelaySec = BACKOFF_DELAYS_SEC[delayIdx];
        const nextRetryAt = Date.now() + nextDelaySec * 1000;
        const rawErr = err?.response?.data?.error?.message || err.message || 'Error de entrega Meta';

        const updatedErrorMsg = formatRetryMetadata(nextAttempt, nextRetryAt, rawErr);

        await prisma.wAMessage.update({
            where: { id: message.id },
            data: {
                errorMessage: updatedErrorMsg
            }
        });

        console.warn(`[SMART_RETRY_FAILED] Intento ${nextAttempt}/${MAX_RETRY_ATTEMPTS} falló para ${message.id}. Próximo reintento en ${nextDelaySec}s. Motivo: ${rawErr}`);

        return {
            messageId: message.id,
            conversationId: conv.id,
            phone: cleanPhone,
            success: false,
            status: 'FAILED',
            attempt: nextAttempt,
            maxAttempts: parsed.maxAttempts,
            nextRetryAt,
            nextDelaySec,
            errorMessage: rawErr,
            actionTaken: 'FAILED_RETRY'
        };
    }
}

/**
 * Escanea y procesa todos los mensajes fallidos en las últimas 24 horas que cumplan el backoff.
 */
export async function executeSmartAutoRetryBatch(limit = 15): Promise<{
    scanned: number;
    retried: number;
    succeeded: number;
    failed: number;
    results: SmartRetryResult[];
}> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const failedMessages = await prisma.wAMessage.findMany({
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
        orderBy: { createdAt: 'asc' },
        take: limit
    });

    const now = Date.now();
    const results: SmartRetryResult[] = [];
    let succeededCount = 0;
    let failedCount = 0;
    let retriedCount = 0;

    for (const msg of failedMessages) {
        const meta = parseRetryMetadata(msg.errorMessage);

        // Si ya superó el máximo de intentos, omitir en ejecuciones batch automáticas
        if (meta.attempt >= MAX_RETRY_ATTEMPTS) {
            continue;
        }

        // Si aún no vence el backoff, omitir
        if (meta.nextRetryAt > now) {
            continue;
        }

        retriedCount++;
        try {
            const res = await executeSmartRetryForMessage(msg.id, { force: false });
            results.push(res);
            if (res.success) succeededCount++;
            else failedCount++;
        } catch (e: any) {
            failedCount++;
            results.push({
                messageId: msg.id,
                conversationId: msg.conversationId,
                phone: msg.conversation.contact.whatsappId,
                success: false,
                status: 'FAILED',
                attempt: meta.attempt + 1,
                maxAttempts: MAX_RETRY_ATTEMPTS,
                errorMessage: e.message,
                actionTaken: 'FAILED_RETRY'
            });
        }
    }

    return {
        scanned: failedMessages.length,
        retried: retriedCount,
        succeeded: succeededCount,
        failed: failedCount,
        results
    };
}
