export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import axios from 'axios';

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_VERSION = 'v21.0';

export async function GET() {
    try {
        if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
            return NextResponse.json({
                profile: {
                    about: 'Tecnología, Industria y Hogar',
                    description: 'Importación y Comercialización de Equipos Tecnológicos, Industriales y de Hogar.',
                    email: 'ventas@atomic.com.ec',
                    websites: ['https://atomiccotizador.shop/web'],
                    address: 'Quito, Ecuador',
                    profile_picture_url: ''
                },
                isConfigured: false
            });
        }

        const response = await axios.get(
            `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites`,
            {
                headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
            }
        );

        const data = response.data?.data?.[0] || {};
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
                profile_picture_url: ''
            },
            isConfigured: !!(WHATSAPP_TOKEN && PHONE_NUMBER_ID),
            error: error.response?.data?.error?.message || error.message
        });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { about, description, email, websites, address, profile_picture_url } = body;

        if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
            return NextResponse.json({ error: 'Configuración de WhatsApp incompletas (WHATSAPP_TOKEN o PHONE_NUMBER_ID faltantes)' }, { status: 400 });
        }

        // 1. Update text profile fields
        const payload: any = {
            messaging_product: 'whatsapp',
            about: about || 'Tecnología, Industria y Hogar',
            description: description || 'Importación y Comercialización de Equipos Tecnológicos, Industriales y de Hogar.',
            email: email || 'ventas@atomic.com.ec',
            websites: websites || ['https://atomiccotizador.shop/web'],
            address: address || 'Quito, Ecuador'
        };

        const resProfile = await axios.post(
            `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/whatsapp_business_profile`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return NextResponse.json({ success: true, result: resProfile.data });
    } catch (error: any) {
        console.error('[WHATSAPP_PROFILE_POST_ERROR]', error.response?.data || error.message);
        return NextResponse.json({
            error: error.response?.data?.error?.message || error.message || 'Error al actualizar perfil en WhatsApp'
        }, { status: 500 });
    }
}
