const fs = require('fs');
const path = require('path');
const axios = require('axios');

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
    console.log('🛍️ ACTIVACIÓN DE CATÁLOGO EN WHATSAPP CLOUD API (META)');
    console.log('========================================================\n');

    const token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '1215685301622232';

    if (!token) {
        console.error('❌ ERROR: No se encontró WHATSAPP_TOKEN en .env');
        process.exit(1);
    }

    console.log(`📱 Phone Number ID: ${phoneId}`);

    // 1. Consultar estado actual de comercio en Meta
    console.log('\n🔍 Consultando whatsapp_commerce_settings actual...');
    try {
        const getRes = await axios.get(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}/whatsapp_commerce_settings`,
            {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            }
        );
        console.log('📊 Estado actual en Meta:', JSON.stringify(getRes.data, null, 2));
    } catch (e) {
        console.warn('⚠️ Advertencia consultando estado actual:', e.response?.data || e.message);
    }

    // 2. Activar is_catalog_visible = true y is_cart_enabled = true
    console.log('\n⏳ Activando is_catalog_visible=true y is_cart_enabled=true...');
    try {
        const postRes = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}/whatsapp_commerce_settings?is_catalog_visible=true&is_cart_enabled=true`,
            null,
            {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000
            }
        );
        console.log('🎉 ¡RESPUESTA DE META EXITOSA!:', JSON.stringify(postRes.data, null, 2));
    } catch (e) {
        console.error('❌ Error activando whatsapp_commerce_settings en Meta:', e.response?.data || e.message);
    }

    // 3. Consultar WABA ID asociado
    let wabaId = '';
    console.log('\n🔎 Consultando WhatsApp Business Account (WABA) ID...');
    try {
        const phoneRes = await axios.get(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}?fields=whatsapp_business_account`,
            {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            }
        );
        wabaId = phoneRes.data?.whatsapp_business_account?.id;
        console.log(`✅ WABA ID detectado: ${wabaId || 'No retornado'}`);
    } catch (e) {
        console.warn('⚠️ No se pudo obtener WABA ID:', e.response?.data?.error?.message || e.message);
    }

    // 4. Consultar catálogos vinculados al WABA
    if (wabaId) {
        console.log(`\n🔎 Consultando catálogos de productos vinculados en WABA (${wabaId})...`);
        try {
            const catRes = await axios.get(
                `https://graph.facebook.com/${API_VERSION}/${wabaId}/product_catalogs`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );
            console.log('📦 Catálogos vinculados en Meta:', JSON.stringify(catRes.data, null, 2));
        } catch (e) {
            console.warn('⚠️ Advertencia consultando product_catalogs:', e.response?.data?.error?.message || e.message);
        }
    }

    // 5. Verificar configuración final
    console.log('\n🔎 Verificación final de whatsapp_commerce_settings...');
    try {
        const verifyRes = await axios.get(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}/whatsapp_commerce_settings`,
            {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000
            }
        );
        console.log('✅ Configuración final aplicada en Meta:', JSON.stringify(verifyRes.data, null, 2));
    } catch (e) {
        console.warn('⚠️ No se pudo verificar:', e.message);
    }
}

main().catch(err => {
    console.error('❌ Error fatal:', err);
    process.exit(1);
});
