"use client"

import { useState } from "react"
import { ExternalLink, RefreshCw, Bot } from "lucide-react"

export default function ExtractionPage() {
    const [key, setKey] = useState(0)

    return (
        <div className="flex flex-col h-full -m-10 lg:-m-14">
            {/* Sub-header */}
            <div className="flex items-center justify-between px-8 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                    <Bot size={18} className="text-indigo-400" />
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.25em]">Scraper Pro AI</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 border border-slate-700">
                        Solo Admin
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setKey(k => k + 1)}
                        className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest border border-slate-700 px-2 py-1 hover:border-slate-500 transition-all"
                    >
                        <RefreshCw size={10} />
                        Recargar
                    </button>
                    <a
                        href="/scraper/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest border border-indigo-800 px-2 py-1 hover:border-indigo-600 transition-all"
                    >
                        <ExternalLink size={10} />
                        Abrir ventana nueva
                    </a>
                </div>
            </div>

            {/* Iframe — served from Next.js public/scraper/ */}
            <div className="flex-1 relative bg-slate-950 overflow-hidden">
                <iframe
                    key={key}
                    src="/scraper/index.html"
                    className="w-full h-full border-0"
                    title="Scraper Pro AI"
                    allow="clipboard-write; clipboard-read"
                />
            </div>
        </div>
    )
}
