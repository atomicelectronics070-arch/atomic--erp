export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import axios from 'axios';

const API_VERSION = 'v21.0';

async function getCredentials() {
    let token = process.env.WHATSAPP_TOKEN;
    let phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '1215685301622222';

    try {
        const dbToken = await prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_TOKEN' } });
        if (dbToken?.value) token = dbToken.value;

        const dbPhoneId = await prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_PHONE_NUMBER_ID' } });
        if (dbPhoneId?.value) phoneId = dbPhoneId.value;
    } catch (e) {
        // Fallback
    }

    return { token, phoneId };
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const testPhone = searchParams.get('phone') || '593969043453';
    const sendTestMsg = searchParams.get('send') === 'true';

    const { token, phoneId } = await getCredentials();

    const diagnostics: any = {
        success: false,
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        hasPhoneNumberId: !!phoneId,
        phoneNumberId: phoneId || 'MISSING',
        metaApiCheck: null,
        sendTestResult: null,
        error: null
    };

    if (!token || !phoneId) {
        diagnostics.error = 'ERROR: Las credenciales WHATSAPP_TOKEN o WHATSAPP_PHONE_NUMBER_ID no están configuradas en BD ni en variables de entorno.';
        return NextResponse.json(diagnostics, { status: 400 });
    }

    try {
        const metaRes = await axios.get(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        diagnostics.metaApiCheck = metaRes.data;
        diagnostics.success = true;
    } catch (err: any) {
        diagnostics.metaApiCheck = {
            error: true,
            status: err.response?.status,
            data: err.response?.data || err.message
        };
        diagnostics.error = err.response?.data?.error?.message || err.message;
    }

    if (sendTestMsg && diagnostics.success) {
        try {
            const cleanPhone = testPhone.replace(/\D/g, '');
            const sendRes = await axios.post(
                `https://graph.facebook.com/${API_VERSION}/${phoneId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: cleanPhone,
                    type: 'text',
                    text: { body: `🧪 Test WhatsApp ATOMIC ERP (${new Date().toLocaleTimeString()})` },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            diagnostics.sendTestResult = sendRes.data;
        } catch (err: any) {
            diagnostics.sendTestResult = {
                error: true,
                status: err.response?.status,
                metaErrorData: err.response?.data || err.message
            };
        }
    }

    return NextResponse.json(diagnostics);
}
