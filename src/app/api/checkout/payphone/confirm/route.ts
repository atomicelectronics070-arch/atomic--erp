export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/lib/whatsapp/service';

const JUAN_PHONE = '593969043453';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const transactionId = searchParams.get('id');
        const clientTransactionId = searchParams.get('clientTransactionId') || searchParams.get('orderNumber');

        if (!clientTransactionId) {
            return NextResponse.json({ error: 'Falta identificador de orden (clientTransactionId)' }, { status: 400 });
        }

        // 1. Localizar la orden en la base de datos
        const order = await prisma.webOrder.findFirst({
            where: {
                OR: [
                    { orderNumber: clientTransactionId },
                    { id: clientTransactionId }
                ]
            }
        });

        if (!order) {
            return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
        }

        // Si ya está pagada previamente
        if (order.status === 'PAID') {
            return NextResponse.json({
                success: true,
                status: 'PAID',
                orderNumber: order.orderNumber,
                order
            });
        }

        const payphoneToken = process.env.PAYPHONE_TOKEN || process.env.PAYPHONE_PRIVATE_TOKEN;
        let isApproved = false;
        let authCode = transactionId || 'DEMO_APPROVED';

        // 2. Si hay token oficial de PayPhone y transactionId, verificar en la API de PayPhone
        if (payphoneToken && transactionId) {
            try {
                const checkRes = await fetch(`https://pay.payphonetodoesposible.com/api/button/v1/Check?id=${transactionId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${payphoneToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (checkRes.ok) {
                    const data = await checkRes.json();
                    // StatusCode 3 es Aprobado en PayPhone
                    if (data.statusCode === 3 || data.transactionStatus === 'Approved') {
                        isApproved = true;
                        authCode = data.authorizationCode || transactionId;
                    }
                }
            } catch (payErr: any) {
                console.warn('[PAYPHONE_CHECK_ERR]', payErr.message);
            }
        } else {
            // Modo Demo / Prueba interna o confirmación con ID de transacción
            if (transactionId) {
                isApproved = true;
            }
        }

        if (isApproved) {
            // 3. Actualizar orden a PAGADA
            const updatedOrder = await prisma.webOrder.update({
                where: { id: order.id },
                data: {
                    status: 'PAID',
                    notes: `${order.notes || ''} | Pago verificado PayPhone ID: ${transactionId || 'N/A'}`
                }
            });

            // 4. Actualizar Transacción financiera
            await prisma.transaction.updateMany({
                where: { quoteNumber: order.orderNumber },
                data: {
                    status: 'PAGADO',
                    proofUrl: `https://payphone.app/voucher/${transactionId || order.orderNumber}`
                }
            }).catch(() => {});

            // 5. Notificar por WhatsApp a Juan / Dirección
            try {
                const items = JSON.parse(order.itemsData || '[]');
                const itemsList = items.map((it: any) => `• ${it.quantity}x ${it.name} ($${Number(it.price).toFixed(2)})`).join('\n');
                const notificationMsg = `🎉 *¡NUEVO PAGO CONFIRMADO EN LÍNEA!* 💳✨\n\n📌 *Orden:* #${order.orderNumber}\n👤 *Cliente:* ${order.customerName}\n📧 *Email:* ${order.customerEmail}\n📱 *Teléfono:* ${order.customerPhone || 'N/A'}\n💰 *Total Cobrado:* $${order.totalAmount.toFixed(2)} USD\n\n📦 *Productos a Despachar:*\n${itemsList}\n\n⚡ Ver detalles y gestionar en: https://atomiccotizador.shop/dashboard/coordinacion`;
                await sendWhatsAppMessage(JUAN_PHONE, notificationMsg);
            } catch (notifyErr: any) {
                console.warn('[PAYPHONE_NOTIFY_ERR]', notifyErr.message);
            }

            return NextResponse.json({
                success: true,
                status: 'PAID',
                orderNumber: updatedOrder.orderNumber,
                order: updatedOrder
            });
        }

        return NextResponse.json({
            success: false,
            status: order.status,
            orderNumber: order.orderNumber,
            message: 'El pago aún está en proceso de autorización'
        });

    } catch (e: any) {
        console.error('[PAYPHONE_CONFIRM_ERROR]', e);
        return NextResponse.json({ error: e.message || 'Error al confirmar pago' }, { status: 500 });
    }
}
