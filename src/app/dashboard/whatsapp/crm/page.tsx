import { Metadata } from "next"

export const metadata: Metadata = {
    title: "WhatsApp CRM Cloud | Atomic ERP",
    description: "Gestión avanzada de clientes mediante WhatsApp",
}

export default function WhatsappCrmPage() {
    return (
        <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-[#0A0A0A] flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        WhatsApp CRM Cloud
                    </h1>
                    <p className="text-sm text-slate-400">Plataforma conectada por API oficial</p>
                </div>
            </div>
            <div className="flex-1 bg-[#050505] relative overflow-hidden">
                <iframe
                    src="https://whatsapp-crm-two-pi.vercel.app/login"
                    className="w-full h-full border-0 absolute inset-0"
                    title="WhatsApp CRM Cloud"
                    allow="microphone; camera; display-capture"
                />
            </div>
        </div>
    )
}
