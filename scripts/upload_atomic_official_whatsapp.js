const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Cargar variables de entorno desde .env
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
    console.log('🔥 ACTUALIZANDO FOTO OFICIAL DE ATOMIC EN WHATSAPP META');
    console.log('========================================================\n');

    const token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '1215685301622232';

    if (!token) {
        console.error('❌ ERROR: Falta WHATSAPP_TOKEN');
        process.exit(1);
    }

    // 1. Origen de la imagen oficial de ATOMIC enviada por Juan
    const userUploadedPath = 'C:\\Users\\SANTIAGO\\.gemini\\antigravity\\brain\\dd376637-2aad-48f3-96f6-8caa8e9dc5cb\\.user_uploaded\\media_1791779100566.jpg';
    
    if (!fs.existsSync(userUploadedPath)) {
        console.error('❌ ERROR: No se encontró la imagen en:', userUploadedPath);
        process.exit(1);
    }

    const imageBuffer = fs.readFileSync(userUploadedPath);
    console.log(`📸 Imagen de ATOMIC cargada: ${(imageBuffer.length / 1024).toFixed(2)} KB (${imageBuffer.length} bytes)`);

    // Guardar en public/images/
    const targetDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    const destProfile = path.join(targetDir, 'atomic_whatsapp_profile.jpg');
    const destDefault = path.join(targetDir, 'whatsapp_profile.jpg');

    fs.writeFileSync(destProfile, imageBuffer);
    fs.writeFileSync(destDefault, imageBuffer);
    console.log('✅ Imagen guardada en public/images/atomic_whatsapp_profile.jpg y whatsapp_profile.jpg');

    // 2. Resolver App ID
    let appId = process.env.META_APP_ID || process.env.WHATSAPP_APP_ID || '1045348268171466';
    console.log(`🎯 Meta App ID: ${appId}`);

    // 3. Iniciar sesión de Resumable Upload
    console.log('\n⏳ Paso 1/3: Creando sesión de subida en Meta Graph API...');
    const sessionRes = await axios.post(
        `https://graph.facebook.com/${API_VERSION}/${appId}/uploads`,
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

    const uploadSessionId = sessionRes.data?.id;
    console.log(`✅ Sesión de subida en Meta: ${uploadSessionId}`);

    // 4. Subir bytes binarios
    console.log('\n⏳ Paso 2/3: Transfiriendo bytes de la foto oficial de ATOMIC a Meta...');
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

    const handle = uploadRes.data?.h;
    console.log(`✅ Handle generado por Meta: ${handle}`);

    // 5. Asignar al perfil oficial de WhatsApp Business
    console.log('\n⏳ Paso 3/3: Aplicando nueva foto a WhatsApp Business Profile (+593 96 322 6319)...');
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

    console.log('🎉 ¡RESPUESTA EXITOSA DE META!:', profileRes.data);

    // 6. Consultar perfil en Meta para obtener la URL final del CDN
    console.log('\n🔎 Consultando la nueva URL generada en Meta CDN...');
    const verifyRes = await axios.get(
        `https://graph.facebook.com/${API_VERSION}/${phoneId}/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites`,
        {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000
        }
    );

    const metaProfile = verifyRes.data?.data?.[0];
    const newCdnUrl = metaProfile?.profile_picture_url;
    console.log('\n========================================================');
    console.log('✅ NUEVA FOTO OFICIAL DE ATOMIC EN WHATSAPP:');
    console.log('========================================================');
    console.log('🔗 URL EN META CDN:', newCdnUrl);
    console.log('========================================================\n');

    // 7. Guardar en PostgreSQL
    if (newCdnUrl) {
        await prisma.systemSetting.upsert({
            where: { key: 'WHATSAPP_PROFILE_PICTURE_URL' },
            update: { value: newCdnUrl },
            create: {
                key: 'WHATSAPP_PROFILE_PICTURE_URL',
                value: newCdnUrl,
                description: 'Foto oficial de ATOMIC en WhatsApp Business'
            }
        });
    }

    const base64Str = imageBuffer.toString('base64');
    await prisma.systemSetting.upsert({
        where: { key: 'ATOMIC_LOGO_BASE64' },
        update: { value: base64Str },
        create: {
            key: 'ATOMIC_LOGO_BASE64',
            value: base64Str,
            description: 'Logo oficial ATOMIC WhatsApp en Base64'
        }
    });

    console.log('✅ Base de datos actualizada con la nueva foto oficial de ATOMIC.');
}

main()
    .catch(err => {
        console.error('❌ Error fatal:', err.response?.data || err.message);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
