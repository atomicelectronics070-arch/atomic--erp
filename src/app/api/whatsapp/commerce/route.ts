export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { getWhatsAppCredentials } from '@/lib/whatsapp/service';
import { prisma } from '@/lib/prisma';

const API_VERSION = 'v21.0';

export async function GET() {
    try {
        const { token, phoneId } = await getWhatsAppCredentials();

        if (!token || !phoneId) {
            return NextResponse.json({
                error: 'Credenciales de WhatsApp incompletas (WHATSAPP_TOKEN o PHONE_NUMBER_ID faltantes)',
                isConfigured: false
            }, { status: 400 });
        }

        // 1. Obtener estado de Comercio en Meta WhatsApp Cloud API
        let metaCommerceData: any = null;
        let metaError: string | null = null;
        try {
            const commerceRes = await axios.get(
                `https://graph.facebook.com/${API_VERSION}/${phoneId}/whatsapp_commerce_settings`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );
            metaCommerceData = commerceRes.data?.data?.[0] || commerceRes.data || null;
        } catch (err: any) {
            metaError = err.response?.data?.error?.message || err.message;
            console.warn('[WHATSAPP_COMMERCE_GET_WARN]', metaError);
        }

        // 2. Obtener WABA ID (WhatsApp Business Account ID)
        let wabaId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '';
        try {
            const phoneRes = await axios.get(
                `https://graph.facebook.com/${API_VERSION}/${phoneId}?fields=whatsapp_business_account`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );
            if (phoneRes.data?.whatsapp_business_account?.id) {
                wabaId = phoneRes.data.whatsapp_business_account.id;
            }
        } catch (_) {}

        // 3. Consultar catálogos vinculados al WABA en Meta
        let linkedCatalogs: any[] = [];
        if (wabaId) {
            try {
                const catalogsRes = await axios.get(
                    `https://graph.facebook.com/${API_VERSION}/${wabaId}/product_catalogs`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        timeout: 10000
                    }
                );
                linkedCatalogs = catalogsRes.data?.data || [];
            } catch (catErr: any) {
                console.warn('[WHATSAPP_WABA_CATALOGS_WARN]', catErr.response?.data?.error?.message || catErr.message);
            }
        }

        // 4. Obtener ajustes locales guardados en la base de datos
        const dbSettings = await prisma.systemSetting.findMany({
            where: {
                key: {
                    in: [
                        'WHATSAPP_CATALOG_ID',
                        'WHATSAPP_CATALOG_VISIBLE',
                        'WHATSAPP_CART_ENABLED'
                    ]
                }
            }
        });

        const localSettings = dbSettings.reduce((acc: any, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        // 5. Contar productos activos del ERP disponibles para sincronización
        const totalProducts = await prisma.product.count({
            where: { isActive: true, isDeleted: false }
        });

        const feedUrl = 'https://atomiccotizador.shop/api/whatsapp/catalog?format=csv';

        return NextResponse.json({
            success: true,
            phoneId,
            wabaId,
            metaCommerceData,
            metaError,
            linkedCatalogs,
            isCatalogVisible: metaCommerceData?.is_catalog_visible ?? (localSettings.WHATSAPP_CATALOG_VISIBLE === 'true'),
            isCartEnabled: metaCommerceData?.is_cart_enabled ?? (localSettings.WHATSAPP_CART_ENABLED === 'true'),
            catalogId: linkedCatalogs[0]?.id || localSettings.WHATSAPP_CATALOG_ID || '',
            totalProducts,
            feedUrl
        });

    } catch (error: any) {
        console.error('[WHATSAPP_COMMERCE_GET_ERROR]', error);
        return NextResponse.json({
            error: error.response?.data?.error?.message || error.message || 'Error al consultar configuración de comercio en WhatsApp'
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { token, phoneId } = await getWhatsAppCredentials();
        const body = await req.json();
        const {
            isCatalogVisible = true,
            isCartEnabled = true,
            catalogId
        } = body;

        if (!token || !phoneId) {
            return NextResponse.json({
                error: 'Credenciales de WhatsApp faltantes (WHATSAPP_TOKEN o PHONE_NUMBER_ID)'
            }, { status: 400 });
        }

        // 1. Activar o desactivar visibilidad de catálogo y carrito en Meta Graph API
        const commerceParams = new URLSearchParams();
        commerceParams.append('is_catalog_visible', String(isCatalogVisible));
        commerceParams.append('is_cart_enabled', String(isCartEnabled));

        const commerceRes = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${phoneId}/whatsapp_commerce_settings?${commerceParams.toString()}`,
            null,
            {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000
            }
        );

        // 2. Si se proporciona o detecta un WABA y catalogId, vincular el catálogo
        let linkCatalogResult = null;
        let wabaId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '';

        try {
            const phoneRes = await axios.get(
                `https://graph.facebook.com/${API_VERSION}/${phoneId}?fields=whatsapp_business_account`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );
            if (phoneRes.data?.whatsapp_business_account?.id) {
                wabaId = phoneRes.data.whatsapp_business_account.id;
            }
        } catch (_) {}

        if (wabaId && catalogId) {
            try {
                const linkRes = await axios.post(
                    `https://graph.facebook.com/${API_VERSION}/${wabaId}/product_catalogs`,
                    { catalog_id: catalogId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 15000
                    }
                );
                linkCatalogResult = linkRes.data;
            } catch (linkErr: any) {
                console.warn('[LINK_CATALOG_WARN]', linkErr.response?.data || linkErr.message);
                linkCatalogResult = { error: linkErr.response?.data?.error?.message || linkErr.message };
            }
        }

        // 3. Guardar ajustes en la base de datos
        await prisma.systemSetting.upsert({
            where: { key: 'WHATSAPP_CATALOG_VISIBLE' },
            update: { value: String(isCatalogVisible) },
            create: { key: 'WHATSAPP_CATALOG_VISIBLE', value: String(isCatalogVisible), description: 'Visibilidad de catálogo en perfil de WhatsApp' }
        });

        await prisma.systemSetting.upsert({
            where: { key: 'WHATSAPP_CART_ENABLED' },
            update: { value: String(isCartEnabled) },
            create: { key: 'WHATSAPP_CART_ENABLED', value: String(isCartEnabled), description: 'Carrito de compras activo en WhatsApp' }
        });

        if (catalogId) {
            await prisma.systemSetting.upsert({
                where: { key: 'WHATSAPP_CATALOG_ID' },
                update: { value: String(catalogId) },
                create: { key: 'WHATSAPP_CATALOG_ID', value: String(catalogId), description: 'ID de Catálogo de Meta Commerce Manager' }
            });
        }

        return NextResponse.json({
            success: true,
            message: '¡Ajustes de catálogo y comercio en WhatsApp actualizados con éxito en Meta!',
            metaCommerceResult: commerceRes.data,
            linkCatalogResult,
            isCatalogVisible,
            isCartEnabled,
            catalogId
        });

    } catch (error: any) {
        console.error('[WHATSAPP_COMMERCE_POST_ERROR]', error.response?.data || error.message);
        return NextResponse.json({
            error: error.response?.data?.error?.message || error.message || 'Error al actualizar configuración de catálogo en Meta',
            metaError: error.response?.data || null
        }, { status: 500 });
    }
}
