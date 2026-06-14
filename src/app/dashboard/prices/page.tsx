"use client"

import { RefreshCw } from "lucide-react"

export default function PricesPage() {
    const iframeUrl = "/prices/index.html"

    return (
        <div className="w-full h-[calc(100vh-10rem)] bg-[#0c0c14] rounded-2xl overflow-hidden border border-slate-200/50 shadow-2xl relative">
            <iframe 
                src={iframeUrl} 
                className="w-full h-full border-none"
                title="Lista de Precios & Asistente Virtual Ícaro"
            />
        </div>
    )
}
