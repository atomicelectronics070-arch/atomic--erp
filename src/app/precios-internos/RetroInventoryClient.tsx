'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type Product = {
    id: string; name: string; sku: string; pvp: number; costo: number | null;
    provider: string; descuento5: number; margen: number | null; stock: number; categoria: string;
}
type Provider = {
    provider: string; product_count: number; avg_pvp: number; avg_cost: number | null; avg_margin_pct: number | null;
}

export default function RetroInventoryClient() {
    const [view, setView] = useState<'products' | 'providers'>('products')
    const [products, setProducts] = useState<Product[]>([])
    const [providers, setProviders] = useState<Provider[]>([])
    const [allProviders, setAllProviders] = useState<string[]>([])
    const [search, setSearch] = useState('')
    const [selectedProvider, setSelectedProvider] = useState('TODOS')
    const [loading, setLoading] = useState(true)
    const [totalCount, setTotalCount] = useState(0)
    const [booted, setBooted] = useState(false)
    const [bootText, setBootText] = useState('')
    const searchRef = useRef<HTMLInputElement>(null)
    const tableRef = useRef<HTMLDivElement>(null)

    const bootLines = [
        'ATOMIC INDUSTRIES CORP. — INVENTORY MANAGEMENT SYSTEM v2.1',
        'Copyright (C) 2024 Atomic Industries. All rights reserved.',
        '',
        'Initializing database connection...',
        'Connected to: aws-1-us-east-1.pooler.supabase.com',
        'Loading product catalog...',
        'Sync complete.',
        '',
        'READY.',
    ]

    useEffect(() => {
        let i = 0; let text = ''
        const interval = setInterval(() => {
            if (i < bootLines.length) {
                text += bootLines[i] + '\n'
                setBootText(text)
                i++
            } else {
                clearInterval(interval)
                setTimeout(() => setBooted(true), 400)
            }
        }, 120)
        return () => clearInterval(interval)
    }, [])

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            if (view === 'providers') {
                const res = await fetch('/api/retro/products?view=providers')
                const data = await res.json()
                setProviders(data.data || [])
            } else {
                const params = new URLSearchParams({ view: 'products', q: search, provider: selectedProvider })
                const res = await fetch(`/api/retro/products?${params}`)
                const data = await res.json()
                setProducts(data.data || [])
                setTotalCount(data.total || 0)
                if (data.providers) setAllProviders(data.providers)
            }
        } catch (e) { console.error(e) }
        setLoading(false)
    }, [view, search, selectedProvider])

    useEffect(() => {
        if (booted) fetchData()
    }, [booted, fetchData])

    const fmt = (n: number | null) => n == null ? 'N/A' : `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    const fmtPct = (n: number | null) => n == null ? 'N/A' : `${n}%`

    const filteredProducts = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.provider.toLowerCase().includes(search.toLowerCase()))
    const filteredProviders = providers.filter(p => !search || p.provider.toLowerCase().includes(search.toLowerCase()))

    if (!booted) return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Courier New", Courier, monospace' }}>
            <pre style={{ color: '#33ff33', fontSize: 13, lineHeight: 1.8, padding: 40, whiteSpace: 'pre-wrap' }}>
                {bootText}<span style={{ animation: 'blink 1s infinite' }}>█</span>
            </pre>
            <style>{`@keyframes blink { 0%,49%{opacity:1}50%,100%{opacity:0} }`}</style>
        </div>
    )

    return (
        <div style={{
            background: '#0a0a0a',
            minHeight: '100vh',
            fontFamily: '"Courier New", Courier, monospace',
            color: '#33ff33',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <style>{`
                @keyframes blink { 0%,49%{opacity:1}50%,100%{opacity:0} }
                @keyframes scanline { 0%{transform:translateY(-100%)}100%{transform:translateY(100vh)} }
                * { box-sizing: border-box; }
                ::-webkit-scrollbar { width: 8px; background: #0a0a0a; }
                ::-webkit-scrollbar-thumb { background: #33ff33; }
                input, select { font-family: "Courier New", monospace !important; }
                input:focus, select:focus { outline: none; }
                tr:hover td { background: #002200 !important; }
                .retro-btn { background: transparent; border: 1px solid #33ff33; color: #33ff33; font-family: "Courier New", monospace; padding: 4px 14px; cursor: pointer; font-size: 12px; letter-spacing: 1px; }
                .retro-btn:hover { background: #33ff33; color: #000; }
                .retro-btn.active { background: #33ff33; color: #000; }
                .row-alt { background: #001a00; }
                td, th { padding: 3px 10px; white-space: nowrap; overflow: hidden; max-width: 300px; text-overflow: ellipsis; }
                th { color: #ffff00; border-bottom: 1px solid #33ff33; padding-bottom: 5px; }
            `}</style>

            {/* CRT Scanline overlay */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 9999, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)' }} />

            {/* Header */}
            <div style={{ borderBottom: '1px solid #33ff33', padding: '8px 16px', background: '#001200' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{ color: '#ffff00', fontSize: 14, fontWeight: 'bold', letterSpacing: 2 }}>
                            ▌ATOMIC INDUSTRIES — INVENTORY SYSTEM v2.1
                        </span>
                        <span style={{ color: '#555', fontSize: 11, marginLeft: 20 }}>
                            {new Date().toLocaleDateString('es-EC')} {new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className={`retro-btn ${view === 'products' ? 'active' : ''}`} onClick={() => { setView('products'); setSearch('') }}>
                            [F1] PRODUCTOS
                        </button>
                        <button className={`retro-btn ${view === 'providers' ? 'active' : ''}`} onClick={() => { setView('providers'); setSearch('') }}>
                            [F2] PROVEEDORES
                        </button>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{ borderBottom: '1px solid #1a3a1a', padding: '8px 16px', background: '#000d00', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#ffff00', fontSize: 12 }}>BUSCAR&gt;</span>
                    <input
                        ref={searchRef}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={view === 'products' ? 'Nombre / SKU / Proveedor...' : 'Nombre de proveedor...'}
                        style={{
                            background: '#001200', border: '1px solid #33ff33', color: '#33ff33',
                            padding: '3px 10px', fontSize: 13, width: 280,
                        }}
                        autoFocus
                    />
                    {search && (
                        <button className="retro-btn" onClick={() => setSearch('')}>[X]</button>
                    )}
                </div>

                {/* Provider filter (only in products view) */}
                {view === 'products' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: '#ffff00', fontSize: 12 }}>PROVEEDOR&gt;</span>
                        <select
                            value={selectedProvider}
                            onChange={e => setSelectedProvider(e.target.value)}
                            style={{
                                background: '#001200', border: '1px solid #33ff33', color: '#33ff33',
                                padding: '3px 10px', fontSize: 13, cursor: 'pointer',
                            }}
                        >
                            <option value="TODOS">-- TODOS --</option>
                            {allProviders.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                )}

                {/* Status */}
                <div style={{ marginLeft: 'auto', fontSize: 12, color: '#888' }}>
                    {loading
                        ? <span style={{ color: '#ffff00', animation: 'blink 0.5s infinite' }}>● CARGANDO...</span>
                        : <span style={{ color: '#33ff33' }}>
                            ● {view === 'products'
                                ? `${filteredProducts.length} / ${totalCount} REGISTROS`
                                : `${filteredProviders.length} PROVEEDORES`
                            }
                        </span>
                    }
                </div>
            </div>

            {/* Table */}
            <div ref={tableRef} style={{ flex: 1, overflow: 'auto', padding: '0 0 40px 0' }}>
                {view === 'products' ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead style={{ position: 'sticky', top: 0, background: '#001200', zIndex: 10 }}>
                            <tr>
                                <th style={{ textAlign: 'left', width: 60 }}>#</th>
                                <th style={{ textAlign: 'left', width: 80 }}>SKU</th>
                                <th style={{ textAlign: 'left', maxWidth: 350 }}>DESCRIPCIÓN</th>
                                <th style={{ textAlign: 'right', width: 100 }}>PVP</th>
                                <th style={{ textAlign: 'right', width: 100 }}>COSTO</th>
                                <th style={{ textAlign: 'right', width: 90 }}>MARGEN</th>
                                <th style={{ textAlign: 'right', width: 120 }}>DESC. 5%</th>
                                <th style={{ textAlign: 'left', width: 180 }}>PROVEEDOR</th>
                                <th style={{ textAlign: 'right', width: 70 }}>STOCK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((p, i) => (
                                <tr key={p.id} className={i % 2 === 0 ? '' : 'row-alt'}>
                                    <td style={{ color: '#555' }}>{i + 1}</td>
                                    <td style={{ color: '#88ff88' }}>{p.sku}</td>
                                    <td title={p.name} style={{ maxWidth: 380 }}>{p.name}</td>
                                    <td style={{ textAlign: 'right', color: '#ffff00' }}>{fmt(p.pvp)}</td>
                                    <td style={{ textAlign: 'right', color: '#aaaaaa' }}>{fmt(p.costo)}</td>
                                    <td style={{ textAlign: 'right', color: p.margen == null ? '#555' : p.margen > 0 ? '#33ff33' : '#ff4444' }}>
                                        {fmtPct(p.margen)}
                                    </td>
                                    <td style={{ textAlign: 'right', color: '#ffaa00' }}>{fmt(p.descuento5)}</td>
                                    <td style={{ color: '#88aaff', maxWidth: 180 }}>{p.provider}</td>
                                    <td style={{ textAlign: 'right', color: p.stock > 0 ? '#33ff33' : '#ff4444' }}>
                                        {p.stock}
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#555' }}>
                                        *** NO RECORDS FOUND ***
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead style={{ position: 'sticky', top: 0, background: '#001200', zIndex: 10 }}>
                            <tr>
                                <th style={{ textAlign: 'left', width: 50 }}>#</th>
                                <th style={{ textAlign: 'left' }}>PROVEEDOR</th>
                                <th style={{ textAlign: 'right', width: 140 }}>N° PRODUCTOS</th>
                                <th style={{ textAlign: 'right', width: 140 }}>PVP PROMEDIO</th>
                                <th style={{ textAlign: 'right', width: 140 }}>COSTO PROMEDIO</th>
                                <th style={{ textAlign: 'right', width: 160 }}>MARGEN PROMEDIO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProviders.map((p, i) => (
                                <tr key={p.provider} className={i % 2 === 0 ? '' : 'row-alt'}>
                                    <td style={{ color: '#555' }}>{i + 1}</td>
                                    <td style={{ color: '#88aaff', fontWeight: 'bold' }}>{p.provider}</td>
                                    <td style={{ textAlign: 'right', color: '#ffff00' }}>{Number(p.product_count).toLocaleString()}</td>
                                    <td style={{ textAlign: 'right', color: '#ffaa00' }}>{fmt(p.avg_pvp)}</td>
                                    <td style={{ textAlign: 'right', color: '#aaaaaa' }}>{fmt(p.avg_cost)}</td>
                                    <td style={{ textAlign: 'right', color: p.avg_margin_pct == null ? '#555' : p.avg_margin_pct > 0 ? '#33ff33' : '#ff4444' }}>
                                        {fmtPct(p.avg_margin_pct)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Status bar */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                borderTop: '1px solid #33ff33', background: '#001200',
                padding: '4px 16px', display: 'flex', justifyContent: 'space-between',
                fontSize: 11, color: '#555'
            }}>
                <span>F1=PRODUCTOS  F2=PROVEEDORES  ESC=LIMPIAR BÚSQUEDA</span>
                <span style={{ color: '#33ff33' }}>ATOMIC INDUSTRIES CORP. — SISTEMA DE PRECIOS INTERNOS</span>
                <span>▓▓▓▓▓▓▓▓▓▓</span>
            </div>
        </div>
    )
}
