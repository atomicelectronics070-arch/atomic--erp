export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import axios from 'axios';

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_VERSION = 'v21.0';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const testPhone = searchParams.get('phone') || '593969043453';

    const diagnostics: any = {
        hasToken: !!WHATSAPP_TOKEN,
        tokenLength: WHATSAPP_TOKEN ? WHATSAPP_TOKEN.length : 0,
        hasPhoneNumberId: !!PHONE_NUMBER_ID,
        phoneNumberId: PHONE_NUMBER_ID || 'MISSING',
        testPhoneTarget: testPhone.replace(/\D/g, ''),
        metaApiCheck: null,
        sendTestResult: null,
        error: null
    };

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        diagnostics.error = 'ERROR CRÍTICO: Las variables WHATSAPP_TOKEN o WHATSAPP_PHONE_NUMBER_ID no están configuradas en Railway.';
        return NextResponse.json(diagnostics, { status: 400 });
    }

    // Step 1: Check Phone Number ID metadata via Meta Graph API
    try {
        const metaRes = await axios.get(
            `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}`,
            {
                headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
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
            `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanPhone,
                type: 'text',
                text: { body: `🧪 Mensaje de Diagnóstico de ATOMIC ERP (${new Date().toLocaleTimeString()})` },
            },
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
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
