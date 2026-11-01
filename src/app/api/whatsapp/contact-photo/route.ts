export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { phone, profilePic } = body;

        if (!phone) {
            return NextResponse.json({ error: 'Número de teléfono es requerido' }, { status: 400 });
        }

        const rawPhone = String(phone).replace(/\D/g, '');

        // Buscar el contacto por varias combinaciones usuales
        const contact = await prisma.wAContact.findFirst({
            where: {
                OR: [
                    { whatsappId: phone },
                    { whatsappId: rawPhone },
                    { whatsappId: rawPhone.startsWith('593') ? rawPhone : `593${rawPhone.replace(/^0/, '')}` },
                    { whatsappId: { contains: rawPhone.slice(-8) } }
                ]
            }
        });

        if (!contact) {
            // Si el contacto aún no existe en WAContact, lo creamos
            const newContact = await prisma.wAContact.create({
                data: {
                    whatsappId: rawPhone,
                    name: 'Cliente WhatsApp',
                    profilePic: profilePic || null
                }
            });
            return NextResponse.json({ success: true, contact: newContact });
        }

        // Actualizar el contacto existente
        const updated = await prisma.wAContact.update({
            where: { id: contact.id },
            data: {
                profilePic: profilePic || null
            }
        });

        return NextResponse.json({ success: true, contact: updated });
    } catch (error: any) {
        console.error('[CONTACT_PHOTO_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Error al actualizar foto' }, { status: 500 });
    }
}
