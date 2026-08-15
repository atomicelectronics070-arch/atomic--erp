export const dynamic = 'force-dynamic';
import { Metadata } from "next"
import WhatsAppCrmClient from "./WhatsAppCrmClient"

export const metadata: Metadata = {
    title: "WhatsApp CRM Cloud | Atomic ERP",
    description: "Gestión avanzada de clientes mediante WhatsApp",
}

export default function WhatsappCrmPage() {
    return <WhatsAppCrmClient />
}
