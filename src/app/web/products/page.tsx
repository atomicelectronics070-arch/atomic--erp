"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight, Filter, ShoppingBag, ArrowRight } from "lucide-react"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"

const safeParseArray = (str: any): string[] => {
    if (!str || str === 'null' || str === '[]') return []
    if (Array.isArray(str)) return str
    if (typeof str === 'string') {
        const t = str.trim()
        if (t.startsWith('http') || t.startsWith('/')) return [t]
        try {
            let p = JSON.parse(t)
            if (typeof p === 'string') p = JSON.parse(p)
            if (Array.isArray(p)) return p
            if (typeof p === 'string') return [p]
        } catch {
            const m = t.match(/(https?:\/\/[^\s"\\]+)/g)
            if (m) return m
        }
    }
    return []
}

const LETTERS = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
const PAGE_SIZE = 30

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [activeLetter, setActiveLetter] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [userRole, setUserRole] = useState<string | undefined>()

    useEffect(() => {
        const init = async () => {
            setLoading(true)
            try {
                const [mRes, pRes, sRes] = await Promise.all([
                    fetch("/api/web/metadata").then(r => r.json()),
                    fetch("/api/web/products?pageSize=500").then(r => r.json()),
                    fetch("/api/auth/session").then(r => r.json()).catch(() => null)
                ])
                setProducts(pRes.products || [])
                setCategories(mRes.categories || [])
                if (sRes?.user?.role) setUserRole(sRes.user.role)
            } catch(e) {
                console.error(e)
            }
            setLoading(false)
        }
        init()
    }, [])

    // Reset pagination when filters change
    useEffect(() => { setPage(1) }, [search, activeLetter, activeCategory])

    const filtered = useMemo(() => {
        let p = [...products]
        if (activeCategory) p = p.filter(x => x.categoryId === activeCategory)
        if (activeLetter === '#') p = p.filter(x => !/^[a-zA-Z]/.test(x.name))
        else if (activeLetter) p = p.filter(x => x.name.toUpperCase().startsWith(activeLetter))
        if (search) p = p.filter(x => x.name.toLowerCase().includes(search.toLowerCase()) || x.description?.toLowerCase().includes(search.toLowerCase()))
        return p.sort((a, b) => a.name.localeCompare(b.name))
    }, [products, activeCategory, activeLetter, search])

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    // Available letters in current dataset
    const availableLetters = useMemo(() => {
        const set = new Set<string>()
        products.forEach(p => {
            const first = p.name[0]?.toUpperCase()
            if (/[A-Z]/.test(first)) set.add(first)
            else set.add('#')
        })
        return set
    }, [products])

    if (loading) return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-[#E8341A] border-t-transparent rounded-full" />
        </div>
    )

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200" style={{ fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui" }}>

            {/* ── Header ── */}
            <header className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1">
                        <h1 className="text-sm font-semibold text-white uppercase tracking-widest">
                            CATÁLOGO <span className="text-[#E8341A]">COMPLETO</span>
                            <span className="ml-3 text-slate-500 font-normal text-[11px]">{filtered.length} productos</span>
                        </h1>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar producto..."
                            className="w-full bg-slate-800 border border-slate-700 pl-9 pr-4 py-2.5 text-[12px] text-white placeholder-slate-500 outline-none focus:border-[#E8341A] rounded-lg transition-colors"
                        />
                    </div>

                    {/* Category filter */}
                    <select
                        value={activeCategory || ""}
                        onChange={e => setActiveCategory(e.target.value || null)}
                        className="bg-slate-800 border border-slate-700 text-slate-300 text-[11px] px-3 py-2.5 rounded-lg outline-none focus:border-[#E8341A] cursor-pointer"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.filter(c => c.isVisible).map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    {(activeLetter || activeCategory || search) && (
                        <button
                            onClick={() => { setActiveLetter(null); setActiveCategory(null); setSearch("") }}
                            className="text-[10px] font-semibold uppercase tracking-widest text-[#E8341A] hover:text-red-400 flex items-center gap-1 shrink-0"
                        >
                            <Filter size={12} /> Limpiar
                        </button>
                    )}
                </div>

                {/* Alphabet bar */}
                <div className="max-w-7xl mx-auto px-6 pb-3 flex flex-wrap gap-1">
                    {LETTERS.map(l => {
                        const has = availableLetters.has(l)
                        const active = activeLetter === l
                        return (
                            <button
                                key={l}
                                onClick={() => setActiveLetter(active ? null : l)}
                                disabled={!has}
                                className={`w-7 h-7 text-[10px] font-bold rounded transition-all ${
                                    active ? 'bg-[#E8341A] text-white' :
                                    has ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' :
                                    'bg-slate-900 text-slate-700 cursor-not-allowed'
                                }`}
                            >
                                {l}
                            </button>
                        )
                    })}
                </div>
            </header>

            {/* ── Grid ── */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {paginated.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <ShoppingBag className="w-12 h-12 text-slate-700 mb-4" />
                        <p className="text-slate-500 text-sm font-medium">No se encontraron productos</p>
                        <button onClick={() => { setSearch(""); setActiveLetter(null); setActiveCategory(null) }} className="mt-4 text-[#E8341A] text-[11px] font-semibold uppercase tracking-widest hover:underline">
                            Ver todo el catálogo
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {paginated.map(p => {
                            const imgs = safeParseArray(p.images)
                            const price = calculateDiscountedPrice(p.price, userRole)
                            return (
                                <Link
                                    key={p.id}
                                    href={`/web/product/${p.id}`}
                                    className="group flex flex-col bg-slate-800/50 border border-slate-700/40 hover:border-[#E8341A]/50 hover:bg-slate-800 transition-all duration-200 rounded-xl overflow-hidden"
                                >
                                    <div className="aspect-square relative bg-white/3 overflow-hidden">
                                        {imgs.length > 0 ? (
                                            <Image src={imgs[0]} alt={p.name} fill className="object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="text-slate-700 w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 flex flex-col flex-1">
                                        <p className="text-[10px] font-medium text-slate-400 line-clamp-2 leading-snug group-hover:text-slate-200 transition-colors flex-1 mb-2">{p.name}</p>
                                        <p className="text-[11px] font-bold text-white">${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={15} />
                        </button>

                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                            let p: number
                            if (totalPages <= 7) p = i + 1
                            else if (page <= 4) p = i + 1
                            else if (page >= totalPages - 3) p = totalPages - 6 + i
                            else p = page - 3 + i
                            return (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-9 h-9 rounded-lg text-[11px] font-semibold transition-all ${
                                        page === p
                                            ? 'bg-[#E8341A] text-white shadow-[0_0_12px_rgba(232,52,26,0.4)]'
                                            : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                                    }`}
                                >
                                    {p}
                                </button>
                            )
                        })}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={15} />
                        </button>

                        <span className="text-[10px] text-slate-500 ml-2">
                            Pág. {page} de {totalPages} · {filtered.length} resultados
                        </span>
                    </div>
                )}
            </main>
        </div>
    )
}
