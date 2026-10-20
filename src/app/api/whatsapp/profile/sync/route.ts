export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { getWhatsAppCredentials } from '@/lib/whatsapp/service';
import { prisma } from '@/lib/prisma';

const API_VERSION = 'v21.0';

async function uploadToMeta(token: string, phoneId: string, imageBuffer: Buffer, mimeType: string = 'image/jpeg') {
    // 1. Resolve Meta App ID
    let appId = process.env.META_APP_ID || process.env.WHATSAPP_APP_ID;

    // Method A: query debug_token
    if (!appId) {
        try {
            const debugRes = await axios.get(`https://graph.facebook.com/${API_VERSION}/debug_token`, {
                params: { input_token: token, access_token: token },
                timeout: 10000
            });
            if (debugRes.data?.data?.app_id) {
                appId = debugRes.data.data.app_id;
            }
        } catch (e: any) {
            console.warn('[SYNC_DEBUG_TOKEN_WARN]', e.response?.data || e.message);
        }
    }

    // Method B: query /app
    if (!appId) {
        try {
            const appRes = await axios.get(`https://graph.facebook.com/${API_VERSION}/app`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            });
            if (appRes.data?.id) {
                appId = appRes.data.id;
            }
        } catch (e: any) {
            console.warn('[SYNC_APP_GET_WARN]', e.response?.data || e.message);
        }
    }

    // Method C: Fallback to literal "app" if App ID could not be inspected
    const uploadTarget = appId || 'app';

    // 2. Start Resumable Upload Session
    const sessionRes = await axios.post(
        `https://graph.facebook.com/${API_VERSION}/${uploadTarget}/uploads`,
        null,
        {
            params: {
                file_length: imageBuffer.length,
                file_type: mimeType
            },
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000
        }
    );

    const uploadSessionId = sessionRes.data?.id;
    if (!uploadSessionId) {
        throw new Error('Meta no devolvió un Session ID para la subida de la imagen.');
    }

    // 3. Upload Binary File to Upload Session
    const uploadUrl = uploadSessionId.startsWith('http') 
        ? uploadSessionId 
        : `https://graph.facebook.com/${API_VERSION}/${uploadSessionId}`;

    const uploadRes = await axios.post(
        uploadUrl,
        imageBuffer,
        {
            headers: {
                Authorization: `OAuth ${token}`,
                file_offset: 0,
                'Content-Type': mimeType
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            timeout: 30000
        }
    );

    const handle = uploadRes.data?.h;
    if (!handle) {
        throw new Error('Meta no devolvió el identificador (handle) para la foto de perfil.');
    }

    // 4. Update WhatsApp Business Profile with profile_picture_handle
    const profileRes = await axios.post(
        `https://graph.facebook.com/${API_VERSION}/${phoneId}/whatsapp_business_profile`,
        {
            messaging_product: 'whatsapp',
            profile_picture_handle: handle
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            timeout: 15000
        }
    );

    return { profileResult: profileRes.data, handle };
}

export async function GET() {
    return handleSync();
}

export async function POST() {
    return handleSync();
}

async function handleSync() {
    try {
        const { token, phoneId } = await getWhatsAppCredentials();

        if (!token || !phoneId) {
            return NextResponse.json({
                success: false,
                error: 'Credenciales de WhatsApp faltantes (WHATSAPP_TOKEN o PHONE_NUMBER_ID)'
            }, { status: 400 });
        }

        // 1. Obtener imagen oficial de ATOMIC de la base de datos o de disco
        let imageBuffer: Buffer | null = null;
        let mimeType = 'image/jpeg';

        try {
            const dbSetting = await prisma.systemSetting.findFirst({
                where: { key: 'WHATSAPP_PROFILE_BASE64' }
            });
            if (dbSetting?.value) {
                imageBuffer = Buffer.from(dbSetting.value, 'base64');
            }
        } catch (_) {}

        if (!imageBuffer) {
            const atomicPublicPath = path.join(process.cwd(), 'public', 'images', 'atomic_whatsapp_profile.jpg');
            const standardPublicPath = path.join(process.cwd(), 'public', 'images', 'whatsapp_profile.jpg');
            const userUploadedBrainPath = 'C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\dd376637-2aad-48f3-96f6-8caa8e9dc5cb\\.user_uploaded\\media_1791779100566.jpg';

            if (fs.existsSync(atomicPublicPath)) imageBuffer = fs.readFileSync(atomicPublicPath);
            else if (fs.existsSync(userUploadedBrainPath)) imageBuffer = fs.readFileSync(userUploadedBrainPath);
            else if (fs.existsSync(standardPublicPath)) imageBuffer = fs.readFileSync(standardPublicPath);
        }

        if (!imageBuffer) {
            return NextResponse.json({
                success: false,
                error: 'No se encontró el archivo oficial de imagen de ATOMIC para WhatsApp.'
            }, { status: 404 });
        }

        // Persistir en Base de Datos y en disco público para garantizar disponibilidad permanente
        const base64Str = imageBuffer.toString('base64');
        try {
            await prisma.systemSetting.upsert({
                where: { key: 'WHATSAPP_PROFILE_BASE64' },
                update: { value: base64Str },
                create: {
                    key: 'WHATSAPP_PROFILE_BASE64',
                    value: base64Str,
                    description: 'Foto oficial de WhatsApp Business (Logo ATOMIC con personajes y seguridad)'
                }
            });

            const dir = path.join(process.cwd(), 'public', 'images');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, 'atomic_whatsapp_profile.jpg'), imageBuffer);
            fs.writeFileSync(path.join(dir, 'whatsapp_profile.jpg'), imageBuffer);
        } catch (_) {}

        // 2. Subir imagen oficial de ATOMIC a Meta WhatsApp Business Profile
        const syncResult = await uploadToMeta(token, phoneId, imageBuffer, mimeType);

        // 3. Consultar perfil actualizado en Meta para verificar URL
        let updatedProfile = null;
        try {
            const checkRes = await axios.get(
                `https://graph.facebook.com/${API_VERSION}/${phoneId}/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );
            updatedProfile = checkRes.data?.data?.[0] || null;

            if (updatedProfile?.profile_picture_url) {
                await prisma.systemSetting.upsert({
                    where: { key: 'WHATSAPP_PROFILE_PICTURE_URL' },
                    update: { value: updatedProfile.profile_picture_url },
                    create: {
                        key: 'WHATSAPP_PROFILE_PICTURE_URL',
                        value: updatedProfile.profile_picture_url,
                        description: 'URL de foto de perfil WhatsApp oficial en Meta CDN'
                    }
                });
            }
        } catch (_) {}

        return NextResponse.json({
            success: true,
            message: '¡Foto oficial de ATOMIC sincronizada exitosamente con Meta WhatsApp Cloud API (+593 96 322 6319)!',
            handle: syncResult.handle,
            metaResult: syncResult.profileResult,
            updatedProfile,
            avatarUrl: `/api/whatsapp-avatar?t=${Date.now()}`
        });

    } catch (e: any) {
        console.error('[WHATSAPP_PROFILE_SYNC_ERROR]', e.response?.data || e.message);
        return NextResponse.json({
            success: false,
            error: e.response?.data?.error?.message || e.message || 'Error al sincronizar con Meta',
            metaErrorDetails: e.response?.data || null
        }, { status: 500 });
    }
}
