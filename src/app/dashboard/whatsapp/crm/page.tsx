export const dynamic = 'force-dynamic';
// Deploy trigger: 2026-09-07T07:20 - CRM tabs + advisor assignment + audio alerts

import { Metadata } from "next"
import WhatsAppCrmClient from "./WhatsAppCrmClient"

export const metadata: Metadata = {
    title: "WhatsApp CRM Cloud | Atomic ERP",
    description: "Gestión avanzada de clientes mediante WhatsApp",
}

export default function WhatsappCrmPage() {
    return <WhatsAppCrmClient />
}
