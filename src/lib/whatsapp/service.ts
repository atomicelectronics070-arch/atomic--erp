import axios from 'axios';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

const REAL_PHONE_NUMBER_ID_FALLBACK = '1215685301622232'; // Real Production Number ID (+593 96 322 6319)
const API_VERSION = 'v21.0';

export function sanitizeToE164(phone: string): string {
    let digits = phone.replace(/\D/g, '');
    // Ecuador phone formatting: if number starts with '09' (10 digits total), transform to '5939...'
    if (digits.startsWith('09') && digits.length === 10) {
        digits = '593' + digits.substring(1);
    } else if (digits.length === 9 && digits.startsWith('9')) {
        digits = '593' + digits;
    }
    return digits;
}

async function getWhatsAppCredentials() {
    let token = process.env.WHATSAPP_TOKEN;
    let phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || REAL_PHONE_NUMBER_ID_FALLBACK;

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

        // Clean and format phone number to strict international E.164 (e.g. 593969043453)
        const cleanTo = sanitizeToE164(to);

        console.log(`[WhatsApp Service] Sending message to clean recipient: ${cleanTo} using Phone ID: ${phoneId}`);

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

        const cleanTo = sanitizeToE164(to);

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

function getMimeType(filePath: string, mediaType: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.webp': return 'image/webp';
        case '.gif': return 'image/gif';
        case '.mp3': return 'audio/mpeg';
        case '.ogg': return 'audio/ogg';
        case '.m4a': return 'audio/mp4';
        case '.wav': return 'audio/wav';
        case '.mp4': return 'video/mp4';
        case '.3gp': return 'video/3gpp';
        case '.pdf': return 'application/pdf';
        case '.doc': return 'application/msword';
        case '.docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case '.xls':
        case '.xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        default:
            if (mediaType === 'image') return 'image/jpeg';
            if (mediaType === 'audio') return 'audio/mp4';
            if (mediaType === 'video') return 'video/mp4';
            return 'application/octet-stream';
    }
}

export async function sendWhatsAppMedia(
    to: string,
    mediaUrl: string,
    mediaType: 'image' | 'audio' | 'video' | 'document' = 'image',
    caption?: string,
    filename?: string
) {
    try {
        const { token, phoneId } = await getWhatsAppCredentials();

        if (!token) {
            throw new Error('Falta la variable WHATSAPP_TOKEN en Railway o Base de Datos.');
        }

        const cleanTo = sanitizeToE164(to);
        let mediaPayload: any = {};

        // Case A: Direct internet URL (http:// or https://)
        if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
            mediaPayload = {
                link: mediaUrl,
                ...(caption && mediaType !== 'audio' ? { caption } : {}),
                ...(filename && mediaType === 'document' ? { filename } : {})
            };
        } else {
            // Case B: Local relative file path (e.g. /uploads/whatsapp/file.jpg)
            const cleanRelPath = mediaUrl.startsWith('/') ? mediaUrl.substring(1) : mediaUrl;
            const localFilePath = path.join(process.cwd(), 'public', cleanRelPath);

            if (fs.existsSync(localFilePath)) {
                const fileBuffer = fs.readFileSync(localFilePath);
                const mimeType = getMimeType(localFilePath, mediaType);
                const fileBaseName = filename || path.basename(localFilePath);

                const formData = new FormData();
                formData.append('messaging_product', 'whatsapp');
                formData.append('file', new Blob([fileBuffer], { type: mimeType }), fileBaseName);
                formData.append('type', mimeType);

                const uploadRes = await axios.post(
                    `https://graph.facebook.com/${API_VERSION}/${phoneId}/media`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );

                const metaMediaId = uploadRes.data?.id;
                if (!metaMediaId) {
                    throw new Error('No se pudo obtener el ID del archivo subido a Meta.');
                }

                mediaPayload = {
                    id: metaMediaId,
                    ...(caption && mediaType !== 'audio' ? { caption } : {}),
                    ...(filename && mediaType === 'document' ? { filename } : {})
                };
            } else {
                throw new Error(`Archivo local no encontrado en el servidor: ${mediaUrl}`);
            }
        }

        const response = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}/messages`,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanTo,
                type: mediaType,
                [mediaType]: mediaPayload,
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
        const errorDetail = error.response?.data?.error?.message || error.message || 'Error al enviar multimedia vía WhatsApp';
        console.error('WhatsApp Media Send Error:', error.response?.data || error.message);
        throw new Error(errorDetail);
    }
}

