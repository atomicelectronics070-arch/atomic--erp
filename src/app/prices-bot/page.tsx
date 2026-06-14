"use client"

export default function StandalonePricesPage() {
    const iframeUrl = "/prices/index.html"

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
