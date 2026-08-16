'use client'

import { useEffect } from "react"

export default function WebError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("[WEB_RUNTIME_ERROR]", error)
    }, [error])

    return (
        <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <span className="text-blue-400 font-mono font-bold text-2xl">⚡</span>
            </div>
            <h2 className="text-xl font-bold uppercase tracking-wider mb-2">Sincronizando Catálogo en Vivo</h2>
            <p className="text-xs text-neutral-400 max-w-sm mb-6 font-mono">
                Reconectando los servicios de catálogo e Inteligencia Artificial ATOMIC...
            </p>
            <button
                onClick={() => reset()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-600/30 active:scale-95"
            >
                Restablecer Vista
            </button>
        </div>
    )
}
