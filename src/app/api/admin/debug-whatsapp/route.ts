export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { getWhatsAppCredentials } from '@/lib/whatsapp/service';

const API_VERSION = 'v21.0';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const testPhone = searchParams.get('phone') || '593969043453';

    const { token, phoneId } = await getWhatsAppCredentials();

    const diagnostics: any = {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        hasPhoneNumberId: !!phoneId,
        phoneNumberId: phoneId || 'MISSING',
        testPhoneTarget: testPhone.replace(/\D/g, ''),
        metaApiCheck: null,
        sendTestResult: null,
        error: null
    };

    if (!token || !phoneId) {
        diagnostics.error = 'ERROR CRÍTICO: Las variables WHATSAPP_TOKEN o WHATSAPP_PHONE_NUMBER_ID no están configuradas.';
        return NextResponse.json(diagnostics, { status: 400 });
    }

    // Step 1: Check Phone Number ID metadata via Meta Graph API
    try {
        const metaRes = await axios.get(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        diagnostics.metaApiCheck = metaRes.data;
    } catch (err: any) {
        diagnostics.metaApiCheck = {
            error: true,
            status: err.response?.status,
            data: err.response?.data || err.message
        };
    }

    // Step 2: Attempt sending an actual test message and capture Meta's exact payload
    try {
        const cleanPhone = testPhone.replace(/\D/g, '');
        const sendRes = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanPhone,
                type: 'text',
                text: { body: `🧪 Mensaje de Diagnóstico de ATOMIC ERP (${new Date().toLocaleTimeString()})` },
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

    return NextResponse.json(diagnostics);
}
