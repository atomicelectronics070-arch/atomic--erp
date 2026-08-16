"use client"


import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Search, ChevronLeft, Zap, MessageCircle, Layers, Cpu, ShieldCheck, CheckCircle2, Award } from "lucide-react"
import { calculateDiscountedPrice } from "@/lib/utils/pricing"
import { motion } from "framer-motion"

const safeParseArray = (str: any, fallback: any = []) => {
    if (!str || str === 'null' || str === '[]' || str === '') return fallback;
    if (Array.isArray(str)) return str.length > 0 ? str : fallback;
    if (typeof str === 'string') {
        const trimmed = str.trim();
        if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:image')) return [trimmed];
        try {
            let cleaned = trimmed;
            if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.substring(1, cleaned.length - 1).replace(/\\"/g, '"');
            let parsed = JSON.parse(cleaned);
            if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch(e) {} }
            if (Array.isArray(parsed)) return parsed.length > 0 ? parsed : fallback;
            if (typeof parsed === 'string' && parsed.length > 0) return [parsed];
        } catch (e) {
            const urlRegex = /(https?:\/\/[^\s"\]]+)/g;
            const matches = trimmed.match(urlRegex);
            if (matches && matches.length > 0) return matches;
        }
    }
    return fallback;
};

const FALLBACK_CABLES = [
    {
        id: "cable-cat6-100-cobre-305m",
        name: "BOBINA DE CABLE UTP CAT6 100% COBRE PURO 305M (23AWG LSZH Fluke Passed)",
        description: "Bobina de cable UTP Categoria 6 de 100% Cobre Puro de 305 metros. Conductor sólido 24AWG/23AWG ideal para certificación Fluke Networks, redes Gigabit 10/100/1000Mbps y alimentación PoE+ / PoE++ (Power over Ethernet). Cubierta libre de halógenos LSZH anti-incendio.",
        price: 145.00,
        stock: 45,
        type: "100% COBRE",
        category: { name: "BOBINAS DE CABLE" },
        specs: "100% Cobre Puro, 305 Metros, Cat6 23AWG, Fluke Passed, PoE+ Support",
        images: JSON.stringify(["/api/web-banners/banner-1.jpg"])
    },
    {
        id: "cable-cat6-cca-305m",
        name: "BOBINA DE CABLE UTP CAT6 ALEACIÓN CCA 305M (24AWG PVC Interior)",
        description: "Bobina de cable UTP Categoría 6 Aleación CCA (Aluminio Revestido de Cobre) de 305 metros. Ideal para instalaciones de CCTV analógico / AHD / IP, redes residenciales y de oficina hasta 70m.",
        price: 68.00,
        stock: 60,
        type: "ALEACIÓN CCA",
        category: { name: "BOBINAS DE CABLE" },
        specs: "Aleación CCA, 305 Metros, Cat6 24AWG, Jacket PVC Interior",
        images: JSON.stringify(["/api/web-banners/banner-2.jpg"])
    },
    {
        id: "cable-cat6-ftp-exterior-cobre-305m",
        name: "BOBINA DE CABLE BLINDADO FTP CAT6 100% COBRE EXTERIOR CON MENSAJERO DE ACERO 305M",
        description: "Bobina de cable blindado FTP Cat6 100% Cobre Puro con chaqueta de Polietileno (PE) para intemperie / exterior anti-UV y guaya mensajera de acero para tendidos aéreos entre postes.",
        price: 185.00,
        stock: 25,
        type: "EXTERIOR / FTP",
        category: { name: "BOBINAS DE CABLE" },
        specs: "100% Cobre Puro, FTP Blindado, Dieléctrico Exterior PE, Guaya de Acero 305m",
        images: JSON.stringify(["/api/web-banners/banner-3.jpg"])
    },
    {
        id: "cable-cat5e-100-cobre-305m",
        name: "BOBINA DE CABLE UTP CAT5E 100% COBRE PURO 305M (24AWG PVC azul/gris)",
        description: "Bobina de cable UTP Categoría 5e 100% Cobre de 305 metros. Transmisión confiable hasta 1000Mbps, soporte PoE estándar para cámaras de seguridad IP y teléfonos VoIP.",
        price: 95.00,
        stock: 30,
        type: "100% COBRE",
        category: { name: "BOBINAS DE CABLE" },
        specs: "100% Cobre, 305m, Cat5e 24AWG, Certificación ISO9001",
        images: JSON.stringify(["/api/web-banners/banner-4.jpg"])
    },
    {
        id: "cable-cat5e-cca-305m",
        name: "BOBINA DE CABLE UTP CAT5E ALEACIÓN CCA 305M (Económica para Alarmas & CCTV)",
        description: "Bobina de cable UTP Cat5e Aleación CCA de 305m. Solución de alta relación costo-beneficio para sistemas de alarma, sensores de intrusión, citofonía y cámaras de video.",
        price: 45.00,
        stock: 80,
        type: "ALEACIÓN CCA",
        category: { name: "BOBINAS DE CABLE" },
        specs: "Aleación CCA, 305m, Cat5e, Uso Residencial & CCTV",
        images: JSON.stringify(["/api/web-banners/banner-5.jpg"])
    },
    {
        id: "fibra-optica-drop-1-hilo-1000m",
        name: "BOBINA DE FIBRA ÓPTICA DROP 1 HILO MONOMODO FTTH 1000M CON MENSAJERO DE ACERO",
        description: "Bobina de fibra óptica Drop monomodo G.657A1 de 1 hilo con mensajero de acero de 1000 metros. Diseñada para redes FTTH de internet por fibra óptica y enlaces punto a punto.",
        price: 110.00,
        stock: 15,
        type: "FIBRA ÓPTICA",
        category: { name: "BOBINAS DE CABLE" },
        specs: "Monomodo G.657A1, 1 Hilo, 1000m, Mensajero de Acero FTTH",
        images: JSON.stringify(["/api/web-banners/banner-6.jpg"])
    },
    {
        id: "cable-coaxial-rg6-305m",
        name: "BOBINA DE CABLE COAXIAL RG6 75 OHMIOS 305M (Con Malla al 60% Aluminio)",
        description: "Bobina de cable coaxial RG6 de 75 Ohmios con blindaje de malla al 60% de aluminio. Ideal para televisión por cable HD, antenas parabólicas, televisión digital terrestre (TDT) y cámaras AHD.",
        price: 52.00,
        stock: 35,
        type: "COAXIAL",
        category: { name: "BOBINAS DE CABLE" },
        specs: "RG6 75 Ohm, Malla 60%, 305m, TV HD & CCTV",
        images: JSON.stringify(["/api/web-banners/banner-7.jpg"])
    },
    {
        id: "cable-cat6a-stp-100-cobre-305m",
        name: "BOBINA DE CABLE STP CAT6A 10Gbps 100% COBRE PURO 305M (Doble Blindaje Malla + Papel de Aluminio)",
        description: "Bobina de cable Cat6A 10Gbps 500MHz con doble blindaje (S/FTP: blindaje individual por par de lámina de aluminio + malla global de cobre estañado). Diseñado para Data Centers y redes de alto tráfico.",
        price: 240.00,
        stock: 10,
        type: "100% COBRE",
        category: { name: "BOBINAS DE CABLE" },
        specs: "100% Cobre, Cat6A 10Gbps 500MHz, Double Shielded S/FTP, 305m",
        images: JSON.stringify(["/api/web-banners/banner-8.jpg"])
    }
];

export default function BobinasCablesPage() {
    const [products, setProducts] = useState<any[]>(FALLBACK_CABLES)
    const [search, setSearch] = useState("")
    const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("TODOS")

    useEffect(() => {
        fetch("/api/web/bobinas-cables")
            .then(r => r.json())
            .then(res => {
                if (res?.products && res.products.length > 0) {
                    const map = new Map()
                    FALLBACK_CABLES.forEach(f => map.set(f.name.toLowerCase().trim(), f))
                    res.products.forEach((p: any) => map.set(p.name.toLowerCase().trim(), p))
                    setProducts(Array.from(map.values()))
                }
            })
            .catch(() => {})
    }, [])

    const filtered = useMemo(() => {
        let p = products

        if (search.trim()) {
            const q = search.toLowerCase().trim()
            p = p.filter(x => 
                x.name?.toLowerCase().includes(q) || 
                x.description?.toLowerCase().includes(q) ||
                x.specs?.toLowerCase().includes(q)
            )
        }

        if (selectedTypeFilter !== "TODOS") {
            const f = selectedTypeFilter.toLowerCase()
            p = p.filter(x => {
                const nameLower = (x.name || '').toLowerCase()
                const specsLower = (x.specs || '').toLowerCase()
                const typeLower = (x.type || '').toLowerCase()

                if (f === '100% cobre') return nameLower.includes('cobre') || specsLower.includes('cobre') || typeLower.includes('cobre')
                if (f === 'aleación cca') return nameLower.includes('cca') || specsLower.includes('cca') || typeLower.includes('cca')
                if (f === 'cat 6') return nameLower.includes('cat6') || specsLower.includes('cat6')
                if (f === 'cat 5e') return nameLower.includes('cat5') || specsLower.includes('cat5')
                if (f === 'exterior / ftp') return nameLower.includes('ftp') || nameLower.includes('exterior') || nameLower.includes('blindado')
                if (f === 'fibra óptica') return nameLower.includes('fibra') || nameLower.includes('ftth')
                if (f === 'coaxial') return nameLower.includes('coaxial') || nameLower.includes('rg6')
                return true
            })
        }

        return p.sort((a, b) => a.name.localeCompare(b.name))
    }, [products, search, selectedTypeFilter])

    return (
        <div className="min-h-screen bg-[#05070c] text-slate-100 font-sans pb-32">
            <div className="w-full bg-[#080d18] text-cyan-300 text-[11px] font-black uppercase tracking-[0.3em] text-center py-2 px-4 border-b border-blue-500/30 font-mono flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                TECNOLOGÍA, INDUSTRIA Y HOGAR — BOBINAS DE CABLE & CABLEADO ESTRUCTURADO 2026
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            </div>

            <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#ff6b4a] via-[#ff5733] to-[#ff4136] text-white shadow-xl border-b border-[#e04322] px-4 py-2.5">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <Link href="/web" className="flex items-center gap-2 text-white font-bold hover:text-amber-200 transition-colors">
                        <ChevronLeft size={20} />
                        <span className="text-xs font-mono font-black uppercase tracking-wider">Volver a la Tienda</span>
                    </Link>
                    
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar bobina Cat6, 100% Cobre, CCA, FTP..."
                            className="w-full bg-[#0a0f1d] border border-blue-400/40 text-white placeholder-slate-400 pl-9 pr-4 py-1.5 text-xs rounded-full outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-inner font-mono"
                        />
                    </div>
                </div>
            </nav>

            <header className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-8 space-y-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-4"
                >
                    <div className="flex items-center gap-3">
                        <div
                            style={{
                                backgroundColor: '#ffffff',
                                border: '2px solid #d4af37',
                                borderRadius: '12px',
                                boxShadow: '0 0 22px rgba(0, 102, 255, 0.85), 0 4px 12px rgba(0, 0, 0, 0.4)',
                                width: '48px',
                                height: '48px',
                                minWidth: '48px',
                                minHeight: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}
                            className="shrink-0 relative z-10"
                        >
                            <Zap size={24} style={{ color: '#0f172a', strokeWidth: 2.5 }} />
                        </div>

                        <div>
                            <span className="text-[10px] font-mono font-black text-cyan-300 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-500/40 uppercase tracking-widest">
                                GUÍA TÉCNICA & CATÁLOGO DE BOBINAS
                            </span>
                            <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight font-mono mt-1">
                                Bobinas de Cable UTP, FTP & Cableado Estructurado
                            </h1>
                        </div>
                    </div>

                    <p className="text-xs md:text-sm text-slate-300 max-w-4xl leading-relaxed font-medium">
                        Soluciones profesionales en bobinas de cable de 305m y 1000m para telecomunicaciones, redes Gigabit, proyectos de CCTV y transmisión de alta velocidad. Disponemos de aleaciones <strong className="text-amber-300 font-bold">CCA (Aluminio Revestido de Cobre)</strong> para economía en CCTV/alarmas, y conductores <strong className="text-cyan-300 font-bold">100% Cobre Puro (BC)</strong> certificables Fluke para redes Gigabit PoE+.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="bg-[#0e1424] border border-[#d4af37]/60 p-4 rounded-2xl shadow-xl space-y-2 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/40 uppercase">
                                🟡 100% COBRE PURO (BC)
                            </span>
                            <Award size={16} className="text-amber-400" />
                        </div>
                        <h3 className="font-mono font-black text-sm text-white uppercase">Máximo Rendimiento Fluke & PoE+</h3>
                        <ul className="space-y-1 text-[11px] text-slate-300 font-medium">
                            <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-amber-400 shrink-0" /> Conductor sólido 100% Cobre (23/24 AWG)</li>
                            <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-amber-400 shrink-0" /> Certificación Fluke Networks a 100m</li>
                            <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-amber-400 shrink-0" /> Compatible con PoE+ / PoE++ (Power over Ethernet)</li>
                            <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-amber-400 shrink-0" /> Menor resistencia eléctrica y calentamiento</li>
                        </ul>
                    </div>

                    <div className="bg-[#0e1424] border border-blue-500/50 p-4 rounded-2xl shadow-xl space-y-2 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-black text-cyan-300 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-500/40 uppercase">
                                ⚡ ALEACIÓN CCA (ECONOMÍA)
                            </span>
                            <Cpu size={16} className="text-cyan-400" />
                        </div>
                        <h3 className="font-mono font-black text-sm text-white uppercase">Alta Relación Costo-Beneficio</h3>
                        <ul className="space-y-1 text-[11px] text-slate-300 font-medium">
                            <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-cyan-400 shrink-0" /> Núcleo de Aluminio revestido con Cobre</li>
                            <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-cyan-400 shrink-0" /> Ideal para CCTV analógico, AHD e IP &lt;70m</li>
                            <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-cyan-400 shrink-0" /> Perfecto para sistemas de alarma y citofonía</li>
                            <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-cyan-400 shrink-0" /> Reducción importante de costo en grandes obras</li>
                        </ul>
                    </div>

                    <div className="bg-[#0e1424] border border-emerald-500/50 p-4 rounded-2xl shadow-xl space-y-2 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-black text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/40 uppercase">
                                🛡️ FTP / BLINDADO & EXTERIOR
                            </span>
                            <ShieldCheck size={16} className="text-emerald-400" />
                        </div>
                        <h3 className="font-mono font-black text-sm text-white uppercase">Protección Electromagnética & UV</h3>
                        <ul className="space-y-1 text-[11px] text-slate-300 font-medium">
                            <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-400 shrink-0" /> Lámina de aluminio (FTP) contra interferencia EMI</li>
                            <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-400 shrink-0" /> Chaqueta de Polietileno (PE) anti-rayos UV</li>
                            <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-400 shrink-0" /> Opción con mensajero de acero para tendido aéreo</li>
                            <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-400 shrink-0" /> Recomendado para motores y ambientes industriales</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                    {["TODOS", "100% COBRE", "ALEACIÓN CCA", "CAT 6", "CAT 5E", "EXTERIOR / FTP", "FIBRA ÓPTICA", "COAXIAL"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedTypeFilter(cat)}
                            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs font-mono transition-all border ${
                                selectedTypeFilter === cat
                                    ? "bg-[#ff5733] text-white border-[#ff7f66] shadow-[0_0_12px_rgba(255,87,51,0.5)]"
                                    : "bg-[#0e1424] text-slate-300 border-[#1e293b] hover:border-cyan-400 hover:text-white"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-4">
                <div className="flex items-center justify-between border-b border-[#1e293b] pb-3 mb-6 font-mono text-xs">
                    <h2 className="font-black text-white uppercase tracking-tight flex items-center gap-2">
                        <Layers size={16} className="text-cyan-400" />
                        Bobinas & Cables Disponibles
                    </h2>
                    <span className="text-cyan-300 font-bold bg-blue-950 px-2.5 py-0.5 rounded border border-blue-500/30">
                        {filtered.length} Opciones
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((p, i) => {
                        const imgs = safeParseArray(p.images)
                        const price = calculateDiscountedPrice(p.price)
                        const displayImg = imgs.length > 0 ? imgs[0] : null

                        return (
                            <motion.div 
                                key={p.id || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-30px" }}
                                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                                className="bg-[#0e1424] border border-[#1e293b] hover:border-cyan-400/80 rounded-2xl p-4 shadow-xl hover:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div 
                                        style={{
                                            backgroundColor: '#ffffff',
                                            border: '2px solid #d4af37',
                                            boxShadow: '0 0 16px rgba(0, 102, 255, 0.75), 0 4px 10px rgba(0, 0, 0, 0.25)',
                                            borderRadius: '12px',
                                        }}
                                        className="relative overflow-hidden aspect-square mb-3.5 flex items-center justify-center p-3 group-hover:scale-[1.02] transition-transform duration-300"
                                    >
                                        {displayImg ? (
                                            <img 
                                                src={displayImg} 
                                                alt={p.name} 
                                                className="max-h-full max-w-full object-contain" 
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <Zap size={48} className="text-[#0f172a] stroke-[1.5]" />
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                        <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest truncate">
                                            {p.category?.name || "CABLEADO ESTRUCTURADO"}
                                        </span>
                                        {p.type && (
                                            <span className={`text-[8px] font-mono font-black px-2 py-0.5 rounded border uppercase shrink-0 ${
                                                p.type.includes('COBRE') 
                                                    ? 'bg-amber-950 text-amber-300 border-amber-500/40' 
                                                    : 'bg-blue-950 text-cyan-300 border-blue-500/40'
                                            }`}>
                                                {p.type}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xs md:text-sm font-bold tracking-tight text-white leading-snug mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                                        {p.name}
                                    </h3>

                                    {p.specs && (
                                        <p className="text-[10px] text-slate-400 font-mono line-clamp-2 mb-2 bg-[#05070c] p-1.5 rounded border border-slate-800">
                                            {p.specs}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-3 pt-3 border-t border-[#1e293b] space-y-2">
                                    <div className="flex items-baseline justify-between font-mono">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Precio Oficial:</span>
                                        <span className="text-base font-black text-cyan-300">${price.toFixed(2)}</span>
                                    </div>

                                    <a
                                        href={`https://wa.me/593969043453?text=${encodeURIComponent(`Hola ATOMIC! Deseo cotizar la Bobina/Cable: ${p.name} ($${price.toFixed(2)})`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full py-2 bg-gradient-to-r from-[#0066ff] to-[#1d4ed8] hover:from-[#0052cc] hover:to-[#1e40af] text-white font-bold text-[11px] uppercase rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-1.5"
                                    >
                                        <MessageCircle size={13} /> Cotizar por WhatsApp
                                    </a>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
