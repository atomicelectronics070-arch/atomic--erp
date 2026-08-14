import axios from 'axios';
import { prisma } from '@/lib/prisma';

const REAL_PHONE_NUMBER_ID_FALLBACK = '1215685301622222'; // Real Production Number ID (+593 96 322 6319)
const API_VERSION = 'v21.0';

async function getWhatsAppCredentials() {
    let token = process.env.WHATSAPP_TOKEN;
    let phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || REAL_PHONE_NUMBER_ID_FALLBACK;

    // Check DB overrides if available
    try {
        const dbPhoneId = await prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_PHONE_NUMBER_ID' } });
        if (dbPhoneId?.value) phoneId = dbPhoneId.value;

        const dbToken = await prisma.systemSetting.findUnique({ where: { key: 'WHATSAPP_TOKEN' } });
        if (dbToken?.value) token = dbToken.value;
    } catch (e) {
        // Fallback to env or constant
    }

    return { token, phoneId };
}

export async function sendWhatsAppMessage(to: string, message: string) {
    try {
        const { token, phoneId } = await getWhatsAppCredentials();

        if (!token) {
            throw new Error('Falta la variable WHATSAPP_TOKEN en Railway o Base de Datos.');
        }

        // Clean phone number to digits only
        const cleanTo = to.replace(/\D/g, '');

        const response = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanTo,
                type: 'text',
                text: { body: message },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error: any) {
        const errorDetail = error.response?.data?.error?.message || error.message || 'Error al enviar mensaje via Meta WhatsApp';
        console.error('WhatsApp Send Error:', error.response?.data || error.message);
        throw new Error(errorDetail);
    }
}

export async function sendWhatsAppTemplate(to: string, templateName: string, languageCode: string = 'es') {
    try {
        const { token, phoneId } = await getWhatsAppCredentials();

        if (!token) {
            throw new Error('Falta la variable WHATSAPP_TOKEN en Railway o Base de Datos.');
        }

        const cleanTo = to.replace(/\D/g, '');

        const response = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}/messages`,
            {
                messaging_product: 'whatsapp',
                to: cleanTo,
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: languageCode },
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        const errorDetail = error.response?.data?.error?.message || error.message;
        console.error('WhatsApp Template Error:', error.response?.data || error.message);
        throw new Error(errorDetail);
    }
}
