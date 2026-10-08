"use client"

import React, { useState } from "react"
import BarcodeScannerModal, { ScannedProductItem } from "@/components/scanner/BarcodeScannerModal"
import { Scan, Plus, Box, Download, ArrowRight, ShieldCheck, RefreshCw, Sparkles, Table } from "lucide-react"
import Link from "next/link"

export default function ScannerClient() {
    const [isScannerOpen, setIsScannerOpen] = useState(true)
    const [scannedItems, setScannedItems] = useState<ScannedProductItem[]>([])

    const handleProductSelected = (product: ScannedProductItem) => {
        setScannedItems(prev => {
            const filtered = prev.filter(p => p.sku !== product.sku)
            return [product, ...filtered]
        })
    }

    return (
        <div className="min-h-screen bg-[#050914] text-white p-4 md:p-8 space-y-8">
            
            {/* Header */}
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                        <Scan size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            Escáner Óptico de Códigos de Barras
                        </h1>
                        <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mt-1">
                            Captura Móvil · Indexación Instantánea de Inventario ATOMIC
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <Scan size={18} />
                        <span>Abrir Cámara Escáner</span>
                    </button>
                    <Link
                        href="/dashboard/matriz-precios"
                        className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all"
                    >
                        <Table size={16} />
                        <span>Ver Matriz de Precios</span>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
                    <span className="text-xs font-mono uppercase text-slate-400 block">Productos Escaneados Hoy</span>
                    <span className="text-3xl font-black text-white mt-1 block">{scannedItems.length}</span>
                    <span className="text-[10px] font-mono text-cyan-400 mt-2 block">Sincronizado con Base de Datos</span>
                </div>
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
                    <span className="text-xs font-mono uppercase text-slate-400 block">Unidades Registradas</span>
                    <span className="text-3xl font-black text-cyan-400 mt-1 block">
                        {scannedItems.reduce((acc, curr) => acc + (curr.stock || 1), 0)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 mt-2 block">Control de Bodega Express</span>
                </div>
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
                    <span className="text-xs font-mono uppercase text-slate-400 block">Valorización Inventario</span>
                    <span className="text-3xl font-black text-emerald-400 mt-1 block">
                        ${scannedItems.reduce((acc, curr) => acc + curr.price * (curr.stock || 1), 0).toFixed(2)} USD
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400/80 mt-2 block">PVP Total Proyectado</span>
                </div>
            </div>

            {/* Instructions & Help */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800/80 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <Sparkles size={16} className="text-cyan-400" />
                    <span>¿Cómo funciona el Escáner de Códigos de Barras con el Celular?</span>
                </h3>
                <ul className="text-xs text-slate-400 space-y-2 list-disc pl-5">
                    <li>Apunta la cámara trasera de tu celular a la etiqueta del producto (códigos EAN-13, UPC, Code-128 o QR).</li>
                    <li>Si el producto ya existe en ATOMIC, el sistema te mostrará su nombre, precio de venta y stock disponible con botones para sumar o restar unidades de inmediato.</li>
                    <li>Si el producto es nuevo, se abrirá un formulario instantáneo para ingresar su nombre, PVP, categoría y stock, indexándolo permanentemente en la base de datos de ATOMIC.</li>
                </ul>
            </div>

            {/* Modal instance */}
            <BarcodeScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onProductSelected={handleProductSelected}
            />

        </div>
    )
}
