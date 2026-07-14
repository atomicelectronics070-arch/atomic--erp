'use server'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function submitLeadContactForm(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    
    if (!name || !phone) {
        return { success: false, message: "Nombre y teléfono son obligatorios." }
    }

    try {
        // Find any user to assign as salesperson
        const user = await prisma.user.findFirst()
        const salespersonId = user ? user.id : 'cmqj34w0k0001...' // fallback

        await prisma.client.create({
            data: {
                name,
                email,
                phone,
                source: "LANDING_PAGE",
                status: "PROSPECTO",
                salespersonId: salespersonId,
                category: "FUEGO Y EVACUACION"
            }
        })

        return { success: true, message: "¡Gracias! Nos pondremos en contacto pronto." }
    } catch (error) {
        console.error("Error saving lead:", error)
        return { success: false, message: "Ocurrió un error al enviar el formulario." }
    }
}
