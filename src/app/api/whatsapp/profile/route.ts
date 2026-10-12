export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { getWhatsAppCredentials } from '@/lib/whatsapp/service';
import { prisma } from '@/lib/prisma';

const API_VERSION = 'v21.0';

async function uploadProfilePictureToMeta(token: string, phoneId: string, imageBuffer: Buffer, mimeType: string = 'image/jpeg') {
    // 1. Discover Meta App ID
    let appId = process.env.META_APP_ID || process.env.WHATSAPP_APP_ID;
    
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
            console.warn('[META_DEBUG_TOKEN_FETCH_WARN]', e.response?.data || e.message);
        }
    }

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
            console.warn('[META_APP_ID_FETCH_WARN]', e.response?.data || e.message);
        }
    }

    const uploadTarget = appId || 'app';

    // 2. Start Resumable Upload Session
    const sessionRes = await axios.post(
        `https://graph.facebook.com/${API_VERSION}/${uploadTarget}/uploads`,
        null,
        {
            params: {
                file_length: imageBuffer.length,
                file_type: mimeType || 'image/jpeg'
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
                'Content-Type': mimeType || 'image/jpeg'
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

    return { result: profileRes.data, handle };
}

export async function GET() {
    try {
        const { token, phoneId } = await getWhatsAppCredentials();

        // Check if there is a custom profile picture saved in DB
        let localPhotoUrl = '/api/whatsapp-avatar';
        try {
            const dbSetting = await prisma.systemSetting.findFirst({
                where: { key: 'WHATSAPP_PROFILE_PICTURE_URL' }
            });
            if (dbSetting?.value) {
                localPhotoUrl = dbSetting.value;
            }
        } catch (dbErr) {
            // ignore
        }

        if (!token || !phoneId) {
            return NextResponse.json({
                profile: {
                    about: 'Tecnología, Industria y Hogar',
                    description: 'Importación y Comercialización de Equipos Tecnológicos, Industriales y de Hogar.',
                    email: 'ventas@atomic.com.ec',
                    websites: ['https://atomiccotizador.shop/web'],
                    address: 'Quito, Ecuador',
                    profile_picture_url: localPhotoUrl
                },
                isConfigured: false
            });
        }

        // Auto-sincronización transparente de la foto oficial de ATOMIC con Meta
        try {
            const syncFlag = await prisma.systemSetting.findFirst({
                where: { key: 'ATOMIC_PROFILE_SYNCED_V2' }
            });
            if (!syncFlag?.value) {
                const atomicPublicPath = path.join(process.cwd(), 'public', 'images', 'atomic_whatsapp_profile.jpg');
                const userUploadedBrainPath = 'C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\dd376637-2aad-48f3-96f6-8caa8e9dc5cb\\.user_uploaded\\media_1791779100566.jpg';
                const standardPublicPath = path.join(process.cwd(), 'public', 'images', 'whatsapp_profile.jpg');

                let imgBuf: Buffer | null = null;
                if (fs.existsSync(atomicPublicPath)) imgBuf = fs.readFileSync(atomicPublicPath);
                else if (fs.existsSync(userUploadedBrainPath)) imgBuf = fs.readFileSync(userUploadedBrainPath);
                else if (fs.existsSync(standardPublicPath)) imgBuf = fs.readFileSync(standardPublicPath);

                if (imgBuf) {
                    const base64Str = imgBuf.toString('base64');
                    await prisma.systemSetting.upsert({
                        where: { key: 'WHATSAPP_PROFILE_BASE64' },
                        update: { value: base64Str },
                        create: { key: 'WHATSAPP_PROFILE_BASE64', value: base64Str, description: 'Foto oficial de WhatsApp Business (ATOMIC)' }
                    });
                    const dir = path.join(process.cwd(), 'public', 'images');
                    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                    fs.writeFileSync(path.join(dir, 'atomic_whatsapp_profile.jpg'), imgBuf);
                    fs.writeFileSync(path.join(dir, 'whatsapp_profile.jpg'), imgBuf);

                    // Sincronizar con Meta Graph API
                    uploadProfilePictureToMeta(token, phoneId, imgBuf, 'image/jpeg')
                        .then(async () => {
                            await prisma.systemSetting.upsert({
                                where: { key: 'ATOMIC_PROFILE_SYNCED_V2' },
                                update: { value: 'true' },
                                create: { key: 'ATOMIC_PROFILE_SYNCED_V2', value: 'true', description: 'Flag de sincronización de logo oficial ATOMIC en Meta' }
                            });
                        })
                        .catch((err) => console.warn('[AUTO_SYNC_ATOMIC_META_ERR]', err.message));
                }
            }
        } catch (_) {}

        const response = await axios.get(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites`,
            {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            }
        );

        const data = response.data?.data?.[0] || {};
        if (!data.profile_picture_url && localPhotoUrl) {
            data.profile_picture_url = localPhotoUrl;
        }

        return NextResponse.json({ profile: data, isConfigured: true });
    } catch (error: any) {
        console.error('[WHATSAPP_PROFILE_GET_ERROR]', error.response?.data || error.message);
        return NextResponse.json({
            profile: {
                about: 'Tecnología, Industria y Hogar',
                description: 'Importación y Comercialización de Equipos Tecnológicos, Industriales y de Hogar.',
                email: 'ventas@atomic.com.ec',
                websites: ['https://atomiccotizador.shop/web'],
                address: 'Quito, Ecuador',
                profile_picture_url: '/api/whatsapp-avatar'
            },
            isConfigured: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
}

export async function POST(req: Request) {
    try {
        const { token, phoneId } = await getWhatsAppCredentials();
        const body = await req.json();
        const {
            about,
            description,
            email,
            websites,
            address,
            profile_picture_url,
            profile_picture_base64
        } = body;

        if (!token || !phoneId) {
            return NextResponse.json({ error: 'Configuración de WhatsApp incompleta (WHATSAPP_TOKEN o PHONE_NUMBER_ID faltantes)' }, { status: 400 });
        }

        // 1. Update text profile fields on Meta
        const payload: any = {
            messaging_product: 'whatsapp',
            about: about || 'Tecnología, Industria y Hogar',
            description: description || 'Importación y Comercialización de Equipos Tecnológicos, Industriales y de Hogar.',
            email: email || 'ventas@atomic.com.ec',
            websites: Array.isArray(websites) ? websites : (websites ? [websites] : ['https://atomiccotizador.shop/web']),
            address: address || 'Quito, Ecuador'
        };

        const resProfile = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}/whatsapp_business_profile`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );

        // 2. Handle Official ATOMIC Profile Picture Update
        let metaPictureSuccess = false;
        let metaPictureMessage = '';
        let imageBuffer: Buffer | null = null;
        let mimeType = 'image/jpeg';

        if (profile_picture_base64) {
            let rawBase64 = profile_picture_base64;
            const match = rawBase64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
            if (match) {
                mimeType = match[1];
                rawBase64 = match[2];
            }
            imageBuffer = Buffer.from(rawBase64, 'base64');
        } else if (profile_picture_url && profile_picture_url.startsWith('data:image')) {
            const match = profile_picture_url.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
            if (match) {
                mimeType = match[1];
                imageBuffer = Buffer.from(match[2], 'base64');
            }
        } else if (profile_picture_url && (profile_picture_url.startsWith('http://') || profile_picture_url.startsWith('https://'))) {
            try {
                const imgDownload = await axios.get(profile_picture_url, {
                    responseType: 'arraybuffer',
                    timeout: 10000
                });
                imageBuffer = Buffer.from(imgDownload.data);
                if (imgDownload.headers['content-type']) {
                    mimeType = String(imgDownload.headers['content-type'] || 'image/jpeg');
                }
            } catch (dlErr: any) {
                console.warn('[PROFILE_IMG_DOWNLOAD_ERR]', dlErr.message);
            }
        }

        // Si no se proporcionó archivo nuevo, cargar automáticamente la imagen oficial de ATOMIC
        if (!imageBuffer) {
            try {
                const dbSetting = await prisma.systemSetting.findFirst({
                    where: { key: 'WHATSAPP_PROFILE_BASE64' }
                });
                if (dbSetting?.value) {
                    imageBuffer = Buffer.from(dbSetting.value, 'base64');
                } else {
                    const atomicPublicPath = path.join(process.cwd(), 'public', 'images', 'atomic_whatsapp_profile.jpg');
                    const standardPublicPath = path.join(process.cwd(), 'public', 'images', 'whatsapp_profile.jpg');
                    const userUploadedBrainPath = 'C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\dd376637-2aad-48f3-96f6-8caa8e9dc5cb\\.user_uploaded\\media_1791779100566.jpg';
                    if (fs.existsSync(atomicPublicPath)) imageBuffer = fs.readFileSync(atomicPublicPath);
                    else if (fs.existsSync(userUploadedBrainPath)) imageBuffer = fs.readFileSync(userUploadedBrainPath);
                    else if (fs.existsSync(standardPublicPath)) imageBuffer = fs.readFileSync(standardPublicPath);
                }
            } catch (_) {}
        }

        if (imageBuffer && imageBuffer.length > 0) {
            const base64String = imageBuffer.toString('base64');

            // A) Save to Database for WhatsApp official profile
            try {
                await prisma.systemSetting.upsert({
                    where: { key: 'WHATSAPP_PROFILE_BASE64' },
                    update: { value: base64String },
                    create: {
                        key: 'WHATSAPP_PROFILE_BASE64',
                        value: base64String,
                        description: 'Foto oficial de WhatsApp Business (Logo ATOMIC con personajes)'
                    }
                });

                await prisma.systemSetting.upsert({
                    where: { key: 'WHATSAPP_PROFILE_PICTURE_URL' },
                    update: { value: profile_picture_url || '/api/whatsapp-avatar' },
                    create: {
                        key: 'WHATSAPP_PROFILE_PICTURE_URL',
                        value: profile_picture_url || '/api/whatsapp-avatar',
                        description: 'URL de foto de perfil WhatsApp'
                    }
                });
            } catch (dbErr: any) {
                console.warn('[DB_AVATAR_PERSIST_WARN]', dbErr.message);
            }

            // B) Save to filesystem if writable
            try {
                const dir = path.join(process.cwd(), 'public', 'images');
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                fs.writeFileSync(path.join(dir, 'atomic_whatsapp_profile.jpg'), imageBuffer);
                fs.writeFileSync(path.join(dir, 'whatsapp_profile.jpg'), imageBuffer);
            } catch (fsErr) {
                // Read-only filesystem in Vercel is expected; DB persistence handles it
            }

            // C) Upload to Meta via Resumable Upload API
            try {
                const metaUpload = await uploadProfilePictureToMeta(token, phoneId, imageBuffer, mimeType);
                metaPictureSuccess = true;
                metaPictureMessage = 'Foto oficial de ATOMIC sincronizada con éxito en Meta WhatsApp Cloud API (+593 96 322 6319).';
            } catch (metaErr: any) {
                console.error('[META_PICTURE_UPLOAD_ERROR]', metaErr.response?.data || metaErr.message);
                const detail = metaErr.response?.data?.error?.message || metaErr.message;
                metaPictureMessage = `Foto guardada en el CRM. Meta Cloud API advirtió: ${detail}`;
            }
        }

        return NextResponse.json({
            success: true,
            result: resProfile.data,
            metaPictureSuccess,
            metaPictureMessage,
            avatarUrl: `/api/whatsapp-avatar?t=${Date.now()}`
        });
    } catch (error: any) {
        console.error('[WHATSAPP_PROFILE_POST_ERROR]', error.response?.data || error.message);
        return NextResponse.json({
            error: error.response?.data?.error?.message || error.message || 'Error al actualizar perfil en WhatsApp'
        }, { status: 500 });
    }
}
