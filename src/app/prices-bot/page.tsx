"use client"

export default function StandalonePricesPage() {
    // Lee la URL de producción desde el env de Next.js
    const iframeUrl = process.env.NEXT_PUBLIC_PRICES_BOT_URL || "http://localhost:3051/prices"

    return (
        <main className="w-screen h-screen bg-[#0c0c14] overflow-hidden m-0 p-0">
            <iframe 
                src={iframeUrl} 
                className="w-full h-full border-none m-0 p-0"
                title="Asistente Virtual Ícaro"
                allow="microphone; camera; clipboard-read; clipboard-write"
            />
        </main>
    )
}
