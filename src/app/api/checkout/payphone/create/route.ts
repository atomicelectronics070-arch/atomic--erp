export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            items,
            customerName,
            customerEmail,
            customerPhone,
            companyName,
            city,
            address,
            notes,
        } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'El carrito no contiene productos' }, { status: 400 });
        }

        if (!customerName || !customerEmail) {
            return NextResponse.json({ error: 'Nombre y correo electrónico son requeridos' }, { status: 400 });
        }

        // 1. Calcular totales
        const subtotal = items.reduce((acc: number, it: any) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
        // IVA 15% en Ecuador
        const taxRate = 0.15;
        const tax = Math.round(subtotal * taxRate * 100) / 100;
        const total = Math.round((subtotal + tax) * 100) / 100;

        // Convertir a centavos requeridos por PayPhone
        const amountCents = Math.round(total * 100);
        const taxCents = Math.round(tax * 100);
        const amountWithTaxCents = Math.round(subtotal * 100);

        // 2. Generar Número de Orden Único
        const timestamp = Date.now().toString().slice(-6);
        const randomSalt = Math.floor(100 + Math.random() * 900);
        const orderNumber = `ATMC-${timestamp}-${randomSalt}`;

        // 3. Crear WebOrder en Base de Datos
        const order = await prisma.webOrder.create({
            data: {
                orderNumber,
                customerName: customerName.trim(),
                customerEmail: customerEmail.trim().toLowerCase(),
                customerPhone: customerPhone ? customerPhone.trim() : null,
                companyName: companyName ? companyName.trim() : (city ? `${city} - ${address || ''}` : null),
                status: 'PENDING_PAYMENT',
                itemsData: JSON.stringify(items),
                totalAmount: total,
                notes: notes ? String(notes) : `Pedido en línea desde /web/cart - Ciudad: ${city || 'Ecuador'}`
            }
        });

        // 4. Crear Transacción financiera asociada
        await prisma.transaction.create({
            data: {
                trxId: `TRX-${orderNumber}`,
                client: customerName.trim(),
                amount: total,
                cost: Math.round(subtotal * 0.7 * 100) / 100, // Costo estimado de referencia
                profit: Math.round(subtotal * 0.3 * 100) / 100,
                status: 'PENDIENTE',
                type: 'Venta Web PayPhone',
                quoteNumber: orderNumber,
                proofUrl: null
            }
        }).catch((err) => console.warn('[PAYPHONE_TRX_WARN]', err.message));

        // 5. Si el cliente tiene teléfono, registrar en CRM WhatsApp
        if (customerPhone) {
            const cleanPhone = customerPhone.replace(/\D/g, '');
            if (cleanPhone.length >= 9) {
                const fullPhone = cleanPhone.startsWith('593') ? cleanPhone : cleanPhone.startsWith('0') ? `593${cleanPhone.slice(1)}` : `593${cleanPhone}`;
                try {
                    const contact = await prisma.wAContact.upsert({
                        where: { whatsappId: fullPhone },
                        update: { name: customerName.trim() },
                        create: { whatsappId: fullPhone, name: customerName.trim() }
                    });

                    let conv = await prisma.wAConversation.findFirst({
                        where: { contactId: contact.id },
                        orderBy: { updatedAt: 'desc' }
                    });

                    if (!conv) {
                        conv = await prisma.wAConversation.create({
                            data: {
                                contactId: contact.id,
                                status: 'BOT',
                                priority: 'HIGH'
                            }
                        });
                    }

                    await prisma.wAMessage.create({
                        data: {
                            conversationId: conv.id,
                            whatsappMessageId: `order-init-${Date.now()}`,
                            direction: 'INBOUND',
                            type: 'text',
                            body: `🛒 [NUEVO PEDIDO WEB]: Orden #${orderNumber} iniciada por ${customerName} por un total de $${total.toFixed(2)} USD. Productos: ${items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}`,
                            status: 'RECEIVED',
                            senderId: 'SYSTEM_ECOMMERCE'
                        }
                    });
                } catch (crmErr: any) {
                    console.warn('[PAYPHONE_CRM_WARN]', crmErr.message);
                }
            }
        }

        const payphoneToken = process.env.PAYPHONE_TOKEN || process.env.NEXT_PUBLIC_PAYPHONE_TOKEN || '';
        const payphoneStoreId = process.env.PAYPHONE_STORE_ID || process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID || '';

        return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber: order.orderNumber,
            total,
            subtotal,
            tax,
            amountCents,
            taxCents,
            amountWithTaxCents,
            clientTransactionId: order.orderNumber,
            currency: 'USD',
            payphoneToken,
            payphoneStoreId,
            responseUrl: `/web/checkout/confirm?orderNumber=${order.orderNumber}`
        });

    } catch (e: any) {
        console.error('[PAYPHONE_CREATE_ERROR]', e);
        return NextResponse.json({ error: e.message || 'Error al iniciar checkout' }, { status: 500 });
    }
}
