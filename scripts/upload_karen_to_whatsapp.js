const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 1. Cargar variables de entorno desde .env manualmente
function loadEnv() {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, 'utf8').split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIdx = trimmed.indexOf('=');
            if (eqIdx > 0) {
                const key = trimmed.substring(0, eqIdx).trim();
                let val = trimmed.substring(eqIdx + 1).trim();
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.substring(1, val.length - 1);
                }
                if (!process.env[key]) {
                    process.env[key] = val;
                }
            }
        }
    }
}

loadEnv();

const API_VERSION = 'v21.0';

async function main() {
    console.log('========================================================');
    console.log('🚀 SUBIENDO FOTO DE KAREN A META WHATSAPP BUSINESS API');
    console.log('========================================================\n');

    const token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '1215685301622232';

    if (!token) {
        console.error('❌ ERROR: No se encontró WHATSAPP_TOKEN en .env');
        process.exit(1);
    }

    console.log(`📱 Phone Number ID: ${phoneId}`);
    console.log(`🔑 Token detectado: ${token.substring(0, 15)}... (longitud ${token.length})`);

    // 2. Localizar la imagen de Karen
    const publicImg = path.join(process.cwd(), 'public', 'images', 'karen_executive_avatar.jpg');
    const localBrainImg = 'C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\dd376637-2aad-48f3-96f6-8caa8e9dc5cb\\karen_executive_avatar_1791743857711.jpg';

    let targetImgPath = '';
    if (fs.existsSync(publicImg)) targetImgPath = publicImg;
    else if (fs.existsSync(localBrainImg)) targetImgPath = localBrainImg;

    if (!targetImgPath) {
        console.error('❌ ERROR: No se encontró la imagen de Karen en public/images/ ni en brain');
        process.exit(1);
    }

    console.log(`🖼️ Imagen seleccionada: ${targetImgPath}`);
    const imageBuffer = fs.readFileSync(targetImgPath);
    console.log(`📦 Tamaño del archivo: ${(imageBuffer.length / 1024).toFixed(2)} KB (${imageBuffer.length} bytes)`);

    // 3. Obtener App ID de Meta
    let appId = process.env.META_APP_ID || process.env.WHATSAPP_APP_ID;

    if (!appId) {
        console.log('🔍 Consultando App ID en Meta Graph API (debug_token)...');
        try {
            const debugRes = await axios.get(`https://graph.facebook.com/${API_VERSION}/debug_token`, {
                params: { input_token: token, access_token: token },
                timeout: 10000
            });
            if (debugRes.data?.data?.app_id) {
                appId = debugRes.data.data.app_id;
                console.log(`✅ App ID obtenido de debug_token: ${appId}`);
            }
        } catch (e) {
            console.warn('⚠️ No se pudo obtener app_id por debug_token:', e.response?.data?.error?.message || e.message);
        }
    }

    if (!appId) {
        console.log('🔍 Consultando App ID por /app...');
        try {
            const appRes = await axios.get(`https://graph.facebook.com/${API_VERSION}/app`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            });
            if (appRes.data?.id) {
                appId = appRes.data.id;
                console.log(`✅ App ID obtenido de /app: ${appId}`);
            }
        } catch (e) {
            console.warn('⚠️ No se pudo obtener app_id por /app:', e.response?.data?.error?.message || e.message);
        }
    }

    const uploadTarget = appId || 'app';
    console.log(`🎯 Objetivo de subida en Meta: ${uploadTarget}`);

    // 4. Iniciar sesión de Resumable Upload en Meta
    console.log('\n⏳ Paso 1/3: Iniciando sesión de subida en Meta (/uploads)...');
    let uploadSessionId = '';
    try {
        const sessionRes = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${uploadTarget}/uploads`,
            null,
            {
                params: {
                    file_length: imageBuffer.length,
                    file_type: 'image/jpeg'
                },
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000
            }
        );

        uploadSessionId = sessionRes.data?.id;
        console.log(`✅ Sesión de subida creada: ${uploadSessionId}`);
    } catch (e) {
        console.error('❌ Error iniciando sesión de subida:', e.response?.data || e.message);
        process.exit(1);
    }

    // 5. Subir los bytes binarios de la imagen a la sesión
    console.log('\n⏳ Paso 2/3: Transfiriendo bytes binarios de la imagen a Meta...');
    let handle = '';
    try {
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
                    'Content-Type': 'image/jpeg'
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                timeout: 30000
            }
        );

        handle = uploadRes.data?.h;
        console.log(`✅ Handle generado por Meta: ${handle}`);
    } catch (e) {
        console.error('❌ Error transfiriendo imagen a Meta:', e.response?.data || e.message);
        process.exit(1);
    }

    // 6. Asignar profile_picture_handle al perfil de WhatsApp Business
    console.log('\n⏳ Paso 3/3: Asignando foto a WhatsApp Business Profile en Meta...');
    try {
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

        console.log('🎉 ¡RESPUESTA DE META EXITOSA!:', profileRes.data);
    } catch (e) {
        console.error('❌ Error asignando foto en whatsapp_business_profile:', e.response?.data || e.message);
        process.exit(1);
    }

    // 7. Verificar perfil actualizado en Meta
    console.log('\n🔎 Verificando perfil final en Meta Graph API...');
    try {
        const verifyRes = await axios.get(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites`,
            {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            }
        );

        const profileData = verifyRes.data?.data?.[0];
        console.log('\n========================================================');
        console.log('✅ PERFIL DE WHATSAPP ACTUALIZADO EN META:');
        console.log('========================================================');
        console.log('Eslogan:', profileData?.about);
        console.log('Email:', profileData?.email);
        console.log('Sitio Web:', profileData?.websites);
        console.log('🔗 URL DE FOTO EN META CDN:', profileData?.profile_picture_url || '(Generándose en CDN de Meta)');
        console.log('========================================================\n');
        console.log('🎉 ¡LA FOTO DE WHATSAPP HA SIDO ACTUALIZADA CON ÉXITO EN META!');
    } catch (e) {
        console.warn('⚠️ No se pudo consultar la verificación final:', e.message);
    }
}

main().catch(err => {
    console.error('❌ Error fatal:', err);
    process.exit(1);
});
