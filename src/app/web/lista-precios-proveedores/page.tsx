import React from "react"
import { Metadata } from "next"
import ListaPreciosProveedoresConfidencial from "@/components/shop/ListaPreciosProveedoresConfidencial"
import Link from "next/link"
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Lista de Precios & Proveedores Confidencial | ATOMIC",
    description: "Catálogo confidencial de proveedores, costos mayoristas y extracción de fotos y descripciones para Stefy y Cristina."
}

export default function PublicListaPreciosProveedoresPage() {
    return (
        <div className="min-h-screen bg-[#070a14] text-slate-100 font-sans p-4 sm:p-8 pb-32">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Back Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <Link
                        href="/web/banco-publicaciones"
                        className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span>Volver a Estudio de Asignación & Banco de Contenido</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Portal Verificado</span>
                    </div>
                </div>

                <ListaPreciosProveedoresConfidencial />
            </div>
        </div>
    )
}
