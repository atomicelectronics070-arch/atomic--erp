import axios from 'axios';

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_VERSION = 'v21.0';

export async function sendWhatsAppMessage(to: string, message: string) {
    try {
        if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
            throw new Error('Faltan variables WHATSAPP_TOKEN o WHATSAPP_PHONE_NUMBER_ID en Railway.');
        }

        // Clean phone number to digits only
        const cleanTo = to.replace(/\D/g, '');

        const response = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanTo,
                type: 'text',
                text: { body: message },
            },
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
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
        if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
            throw new Error('Faltan variables WHATSAPP_TOKEN o WHATSAPP_PHONE_NUMBER_ID en Railway.');
        }

        const cleanTo = to.replace(/\D/g, '');

        const response = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
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
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
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
