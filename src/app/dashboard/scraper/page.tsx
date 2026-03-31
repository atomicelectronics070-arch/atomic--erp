"use client"

import { useEffect, useState } from "react"

export default function ScraperPage() {
    const [scraperUrl, setScraperUrl] = useState("http://localhost:5173")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    // Try to detect if the scraper client is running
    useEffect(() => {
        const checkIfRunning = async () => {
            try {
                // A quick fetch to see if the port is alive (will fail with CORS, but the error means it's running)
                await fetch("http://localhost:5173", { mode: "no-cors", signal: AbortSignal.timeout(3000) })
                setError(false)
            } catch {
                // CORS error = server is up. Network error = server is down
                setError(false)
            }
        }
        checkIfRunning()
    }, [])

    return (
        <div className="flex flex-col h-full -m-10 lg:-m-14">
            {/* Sub-header */}
            <div className="flex items-center justify-between px-8 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em]">Scraper Pro AI</span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-2 py-0.5 border border-slate-700 rounded-none">
                        Solo Admin
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] text-slate-600 font-mono">localhost:5173 → 5005</span>
                    <a
                        href="http://localhost:5173"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest border border-indigo-800 px-2 py-1 hover:border-indigo-600 transition-all"
                    >
                        Abrir en ventana nueva ↗
                    </a>
                </div>
            </div>

            {/* Iframe */}
            <div className="flex-1 relative bg-slate-950">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10">
                        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                            Conectando con Scraper Pro...
                        </p>
                        <p className="text-[10px] text-slate-700 mt-2">Asegúrate que el servidor esté corriendo en el puerto 5173</p>
                    </div>
                )}
                <iframe
                    src="http://localhost:5173"
                    className="w-full h-full border-0"
                    title="Scraper Pro AI"
                    onLoad={() => setIsLoading(false)}
                    onError={() => { setIsLoading(false); setError(true) }}
                    allow="clipboard-write"
                />
                {error && !isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-lg font-bold text-slate-300 mb-2">Scraper Pro no está disponible</h3>
                        <p className="text-xs text-slate-500 mb-6 text-center max-w-sm">
                            El servidor del Scraper no está corriendo. Inicia el proyecto scraper-pro para acceder desde aquí.
                        </p>
                        <div className="bg-slate-900 border border-slate-700 p-4 rounded-none text-left max-w-md w-full">
                            <p className="text-[10px] text-slate-400 font-mono mb-2 text-indigo-400">Terminal 1 — Cliente:</p>
                            <code className="text-[11px] text-green-400 font-mono block mb-4">
                                cd scraper-pro/client && npm run dev
                            </code>
                            <p className="text-[10px] text-slate-400 font-mono mb-2 text-indigo-400">Terminal 2 — Servidor:</p>
                            <code className="text-[11px] text-green-400 font-mono block">
                                cd scraper-pro/server && node server.js
                            </code>
                        </div>
                        <button
                            onClick={() => { setIsLoading(true); setError(false) }}
                            className="mt-6 text-xs font-bold text-indigo-400 border border-indigo-700 px-4 py-2 hover:bg-indigo-900/30 transition-all uppercase tracking-widest"
                        >
                            Reintentar conexión
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
