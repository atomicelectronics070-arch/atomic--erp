"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    Zap, ShieldCheck, CheckCircle2, MessageCircle, ArrowRight,
    Sparkles, Wrench, RefreshCw, Award, Gauge, BatteryCharging, Shield, Truck,
    ChevronRight, Check, Copy
} from "lucide-react";

const WHATSAPP_NUMBER = "593969043453";
const WHATSAPP_LINK = "https://wa.me/593969043453?text=Hola%20ATOMIC%2C%20quiero%20cotizar%20los%20Cargadores%20para%20Veh%C3%ADculos%20El%C3%A9ctricos%20EV.";

interface ProductItem {
    id: string;
    name: string;
    sku: string;
    badge: string;
    badgeColor: string;
    power: string;
    price: number;
    voltage: string;
    speed: string;
    connector: string;
    useCase: string;
    images: string[];
    features: string[];
}

const EV_PRODUCTS: ProductItem[] = [
    {
        id: "livoltek-mevo-7kw",
        name: "Cargador Wallbox Livoltek Mevo Mobility 7.3 kW",
        sku: "LIVOLTEK-MEVO-7.3KW",
        badge: "DESTACADO · CARGA FOTOVOLTAICA",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        power: "7.3 kW Monofásico (Tipo 2)",
        price: 789.00,
        voltage: "220V AC / 32A Monofásico · Modo Dinámico",
        speed: "~40 a 50 km de autonomía por hora",
        connector: "Conector Tipo 2 (IEC 62196)",
        useCase: "Hogares, sistemas solares fotovoltaicos, garajes y condominios.",
        images: [
            "/images/promociones/cargador-wallbox-mevo.jpg",
            "/img/cargadores/ev_real_1.jpeg",
            "/img/cargadores/ev_real_2.jpeg"
        ],
        features: [
            "Conectividad 4G / WiFi / Bluetooth con control y acceso remoto completo",
            "Aplicación Móvil My Livoltek: Controla, monitorea y gestiona tu carga desde tu móvil",
            "Compatibilidad nativa con Carga Fotovoltaica (Aprovecha tu energía solar)",
            "Protocolo OCPP 1.6J con Modo Dinámico de Carga y balanceo de red",
            "Certificaciones de seguridad internacionales: IP54, IEC-61851-21, IEC-61851-1",
            "Garantía oficial por escrito de 2 Años"
        ]
    },
    {
        id: "wallbox-7kw",
        name: "Cargador Portátil EV Wallbox Go 7.4 kW",
        sku: "EV-GO-7KW",
        badge: "PORTÁTIL MULTI-AMPERAJE",
        badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/40",
        power: "7.4 kW Monofásico",
        price: 448.50,
        voltage: "220V AC / 32A Monofásico Regulable (8A - 32A)",
        speed: "~35 a 45 km de autonomía por hora",
        connector: "Tipo 2 (IEC 62196) / GB/T Universal",
        useCase: "Hogares, garajes privados, casas de campo y condominios.",
        images: [
            "/img/cargadores/ev_real_1.jpeg",
            "/img/cargadores/ev_real_2.jpeg",
            "/img/cargadores/ev_wallbox_7kw.png"
        ],
        features: [
            "Pantalla LCD a color con telemetría en tiempo real (kWh, voltaje, amperios, temperatura)",
            "Amperaje ajustable en 5 niveles: 8A, 10A, 13A, 16A y 32A",
            "Protección RCD Tipo A + DC 6mA (protección total contra fugas eléctricas)",
            "Chasis impermeable IP66 con resistencia a impactos IK10",
            "Cable de cobre puro de 5 metros reforzado con TPU de alta flexibilidad",
            "Garantía oficial por escrito de 3 Años"
        ]
    },
    {
        id: "pulsar-11kw",
        name: "Estación de Carga Smart EV Pulsar Pro 11 kW",
        sku: "EV-PULSAR-11KW",
        badge: "CONECTIVIDAD SMART APP",
        badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
        power: "11 kW Trifásico",
        price: 782.00,
        voltage: "380V - 400V AC / 16A Trifásico",
        speed: "~65 a 75 km de autonomía por hora",
        connector: "Tipo 2 Europeo con Seguro Electromecánico",
        useCase: "Empresas, edificios residenciales, comercios y usuarios con red trifásica.",
        images: [
            "/img/cargadores/ev_real_3.jpeg",
            "/img/cargadores/ev_real_4.jpeg",
            "/img/cargadores/ev_pulsar_11kw.png"
        ],
        features: [
            "Control inteligente por App móvil iOS & Android (WiFi + Bluetooth)",
            "Lector de tarjetas RFID para control de acceso y usuarios autorizados (3 tarjetas incluidas)",
            "Tecnología Power Boost para balanceo dinámico de carga en el hogar",
            "Programación horaria para cargar en tarifas eléctricas nocturnas económicas",
            "Certificación CE, IEC 61851-1 y TÜV Rheinland de fabricación europea",
            "Garantía oficial por escrito de 3 Años"
        ]
    },
    {
        id: "ultra-22kw",
        name: "Estación Comercial EV Ultra Fast 22 kW",
        sku: "EV-ULTRA-22KW",
        badge: "USO COMERCIAL PESADO",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
        power: "22 kW Trifásico Dual",
        price: 1437.50,
        voltage: "400V AC / 32A Trifásico Ultra Rápido",
        speed: "~120 km de autonomía por hora de carga",
        connector: "Doble conector Tipo 2 para carga simultánea",
        useCase: "Hoteles, centros comerciales, parqueaderos públicos y electrolineras privadas.",
        images: [
            "/img/cargadores/ev_real_5.jpeg",
            "/img/cargadores/ev_pulsar_11kw.png"
        ],
        features: [
            "Protocolo Abierto OCPP 1.6 JSON para cobro y monetización de recargas",
            "Pantalla táctil HD industrial de 7 pulgadas con interfaz en español",
            "Medidor de energía MID certificado Clase 1 para facturación eléctrica",
            "Conexión 4G LTE SIM + Ethernet RJ45 + WiFi industrial",
            "Cuerpo de acero galvanizado con recubrimiento electrostático antivandálico",
            "Garantía oficial de 3 Años con stock de repuestos locales"
        ]
    },
    {
        id: "travel-3.7kw",
        name: "Cargador Portátil de Emergencia EV Travel 3.7 kW",
        sku: "EV-TRAVEL-3.7KW",
        badge: "KIT DE VIAJE PORTÁTIL",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        power: "3.7 kW / 1.8 kW",
        price: 276.00,
        voltage: "110V (1.8 kW) / 220V (3.7 kW) 16A",
        speed: "~20 a 25 km por hora de carga",
        connector: "Adaptadores intercambiables NEMA + CEE Industrial",
        useCase: "Viajes por carretera, emergencias y conexión en cualquier tomacorriente doméstico.",
        images: [
            "/img/cargadores/ev_real_6.jpeg",
            "/img/cargadores/ev_real_1.jpeg"
        ],
        features: [
            "Conéctalo a cualquier toma convencional de 110V o 220V en casas u hoteles",
            "Maletín rígido shockproof de transporte impermeable de regalo",
            "Sensor térmico en enchufe que corta la energía si detecta calentamiento en la pared",
            "Cable ultra flexible reforzado de 6 metros a prueba de aplastamiento de vehículos",
            "Grado de protección IP67 100% sumergible y resistente a lluvia",
            "Garantía oficial de 3 Años"
        ]
    }
];

export default function EVChargersLandingPage() {
    const [selectedProduct, setSelectedProduct] = useState<ProductItem>(EV_PRODUCTS[0]);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [copiedSku, setCopiedSku] = useState<string | null>(null);

    const getWaLink = (item: ProductItem) => {
        const msg = `*¡Hola ATOMIC! Me interesa cotizar este Cargador de Auto Eléctrico:*
• *Equipo:* ${item.name}
• *Código / SKU:* ${item.sku}
• *Potencia:* ${item.power}
• *Precio:* $${item.price.toFixed(2)}
• *Garantía:* 3 Años Oficial

¿Tienen disponibilidad para envío inmediato o instalación?`;
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    };

    const handleCopySpecs = (item: ProductItem) => {
        const text = `⚡ ${item.name.toUpperCase()} (SKU: ${item.sku})
💵 Precio: $${item.price.toFixed(2)}
🔌 Potencia: ${item.power} (${item.voltage})
🚗 Velocidad: ${item.speed}
🛡️ Garantía: 3 Años Oficial
📦 Características: ${item.features.join(" · ")}`;
        navigator.clipboard.writeText(text);
        setCopiedSku(item.sku);
        setTimeout(() => setCopiedSku(null), 2500);
    };

    return (
        <div className="font-sans text-slate-100 bg-[#020617] selection:bg-emerald-500/30 selection:text-white overflow-x-hidden min-h-screen">

            {/* HEADER */}
            <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 py-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/web" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                            <Zap size={20} className="text-black group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <span className="text-lg font-black tracking-widest text-white uppercase font-mono">
                                ATOMIC <span className="text-emerald-400">EV MOBILITY</span>
                            </span>
                            <p className="text-[10px] text-slate-400 font-mono tracking-wider">CARGADORES EUROPEOS CON 3 AÑOS DE GARANTÍA</p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/web"
                            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-mono font-bold transition-all"
                        >
                            ← Catálogo General
                        </Link>
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
                        >
                            <MessageCircle size={14} />
                            <span>WhatsApp Oficial</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* HERO PRINCIPAL */}
            <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-[#030b18] to-[#020617] border-b border-slate-800/80 pt-12 pb-20">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[160px] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span>Línea de Movilidad Eléctrica Certificada 2026</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight uppercase font-mono">
                            Cargadores de Auto Eléctrico <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                                De Alta Eficiencia
                            </span>
                        </h1>

                        <p className="text-slate-300 text-sm md:text-base max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
                            Equipos inteligentes para vehículos eléctricos e híbridos enchufables con <strong className="text-emerald-400 font-bold">3 Años de Garantía</strong>, certificación europea TÜV / CE, chasis IP66 de alta intemperie y compatibilidad con 100% de marcas (BYD, Tesla, BMW, Audi, Hyundai, Kia, MG, Chery, Dongfeng).
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            {[
                                { t: "3 Años Garantía", d: "Certificación Europea TÜV/CE" },
                                { t: "Grado IP66 / IK10", d: "Resistente a Lluvia & Golpes" },
                                { t: "Instalación EV", d: "Servicio Llave en Mano" },
                                { t: "App Móvil Smart", d: "WiFi, Bluetooth & RFID" }
                            ].map((badge, idx) => (
                                <div key={idx} className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-left">
                                    <h4 className="font-bold text-xs text-emerald-400 font-mono">{badge.t}</h4>
                                    <p className="text-[10px] font-sans text-slate-400 mt-0.5">{badge.d}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-3">
                                <MessageCircle size={18} /> Asesoría por WhatsApp
                            </a>
                            <a href="#catalogo"
                                className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 font-mono font-bold text-xs uppercase tracking-wider transition-all">
                                Ver Modelos y Precios ↓
                            </a>
                        </div>
                    </div>

                    {/* HERO PREVIEW IMAGES */}
                    <div className="flex-1 w-full max-w-lg">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] space-y-4">
                            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center">
                                <img src="/img/cargadores/ev_real_1.jpeg" alt="Cargador EV ATOMIC" className="w-full h-full object-cover" />
                                <span className="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold rounded-full">
                                    ⚡ Fotografías Reales de Equipos ATOMIC
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    "/img/cargadores/ev_real_2.jpeg",
                                    "/img/cargadores/ev_real_3.jpeg",
                                    "/img/cargadores/ev_real_4.jpeg",
                                    "/img/cargadores/ev_real_5.jpeg"
                                ].map((imgSrc, i) => (
                                    <div key={i} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square">
                                        <img src={imgSrc} alt="Detalle Cargador EV" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN INTERACTIVA DE CATÁLOGO COMPLETO */}
            <section id="catalogo" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                        CATÁLOGO OFICIAL DISPONIBLE PARA ENTREGA INMEDIATA
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase font-mono">
                        Modelos de Cargadores EV
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto font-light">
                        Equipos con entrega express en Quito, Guayaquil, Cuenca y envíos asegurados a las 24 provincias.
                    </p>
                </div>

                {/* GRID DE PRODUCTOS CON TODAS SUS FOTOS REALES */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {EV_PRODUCTS.map((prod) => (
                        <div
                            key={prod.id}
                            className="rounded-3xl bg-[#0D0F1A] border-2 border-slate-800 hover:border-emerald-500/60 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-2xl group"
                        >
                            {/* Card Visual Header */}
                            <div>
                                <div className="relative w-full aspect-video sm:aspect-[16/10] bg-[#05060A] overflow-hidden border-b border-slate-800">
                                    <img
                                        src={prod.images[0]}
                                        alt={prod.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase font-mono border backdrop-blur-md ${prod.badgeColor}`}>
                                            {prod.badge}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase font-mono bg-black/80 text-slate-300 border border-white/10">
                                            SKU: {prod.sku}
                                        </span>
                                    </div>

                                    {/* Price Tag */}
                                    <div className="absolute bottom-4 right-4 bg-emerald-500 text-black font-mono font-black text-lg px-4 py-1.5 rounded-xl shadow-xl border border-emerald-400/60">
                                        ${prod.price.toFixed(2)}
                                    </div>
                                </div>

                                {/* Mini Thumbnails Gallery */}
                                {prod.images.length > 1 && (
                                    <div className="flex gap-2 p-3 bg-slate-950/60 border-b border-slate-800/80">
                                        {prod.images.map((thumb, idx) => (
                                            <div key={idx} className="w-16 h-12 rounded-lg overflow-hidden border border-slate-800 bg-black">
                                                <img src={thumb} alt="Miniatura" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Content Details */}
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                                            ⚡ {prod.power}
                                        </span>
                                        <button
                                            onClick={() => handleCopySpecs(prod)}
                                            className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/10 transition-all cursor-pointer"
                                            title="Copiar ficha técnica"
                                        >
                                            {copiedSku === prod.sku ? (
                                                <>
                                                    <Check size={12} className="text-emerald-400" />
                                                    <span className="text-emerald-400">¡Copiado!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={12} />
                                                    <span>Copiar Ficha</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-black text-white uppercase font-mono leading-snug">
                                        {prod.name}
                                    </h3>

                                    {/* Specifications Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80">
                                        <div>
                                            <span className="text-slate-500 block text-[10px]">VOLTAJE & RED:</span>
                                            <span className="text-slate-200 font-bold">{prod.voltage}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block text-[10px]">VELOCIDAD DE CARGA:</span>
                                            <span className="text-emerald-400 font-bold">{prod.speed}</span>
                                        </div>
                                        <div className="sm:col-span-2 pt-1 border-t border-slate-800">
                                            <span className="text-slate-500 block text-[10px]">APLICACIÓN:</span>
                                            <span className="text-slate-300">{prod.useCase}</span>
                                        </div>
                                    </div>

                                    {/* Features Bullet Points */}
                                    <div className="space-y-1.5 pt-2">
                                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                                            VENTAJAS PRINCIPALES:
                                        </span>
                                        {prod.features.map((feat, fIdx) => (
                                            <div key={fIdx} className="text-xs text-slate-300 flex items-start gap-2">
                                                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Card CTA Footer */}
                            <div className="p-6 pt-0">
                                <a
                                    href={getWaLink(prod)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 cursor-pointer"
                                >
                                    <MessageCircle size={16} />
                                    <span>Cotizar {prod.name.split(" ")[2] || "Cargador"} por WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECCIÓN FOTOGRAFÍAS REALES & CONTROL DE CALIDAD */}
            <section className="py-16 bg-slate-950 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 space-y-8">
                    <div className="text-center space-y-2">
                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                            EQUIPOS 100% REALES EN STOCK ATOMIC
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-mono">
                            Galería de Productos e Instalaciones
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                            { src: "/img/cargadores/ev_real_1.jpeg", label: "Wallbox Go 7.4kW" },
                            { src: "/img/cargadores/ev_real_2.jpeg", label: "Detalle Conector Tipo 2" },
                            { src: "/img/cargadores/ev_real_3.jpeg", label: "Smart Pulsar 11kW" },
                            { src: "/img/cargadores/ev_real_4.jpeg", label: "Control Pantalla LCD" },
                            { src: "/img/cargadores/ev_real_5.jpeg", label: "Estación 22kW Comercial" },
                            { src: "/img/cargadores/ev_real_6.jpeg", label: "Kit Portátil de Viaje" },
                        ].map((g, idx) => (
                            <div key={idx} className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-square">
                                <img src={g.src} alt={g.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                                    <span className="text-[10px] font-mono font-bold text-white uppercase truncate">{g.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECCIÓN BENEFICIOS Y GARANTÍA */}
            <section className="py-20 bg-[#070914] border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-3">
                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                            VENTAJAS EXCLUSIVAS ATOMIC EV
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase font-mono">
                            ¿Por qué elegir nuestros cargadores?
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                                <Award size={24} />
                            </div>
                            <h3 className="font-bold text-white text-base font-mono">Garantía de 3 Años</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                Cobertura completa por 3 años con soporte de fábrica y repuestos originales disponibles en Ecuador.
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="font-bold text-white text-base font-mono">Grado IP66 / IK10</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                Chasis sellado a prueba de lluvias torrenciales, polvo y golpes de alta intensidad para exteriores.
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                                <Wrench size={24} />
                            </div>
                            <h3 className="font-bold text-white text-base font-mono">Instalación Llave en Mano</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                Contamos con técnicos certificados para realizar la instalación eléctrica, breakers y protecciones.
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold">
                                <Truck size={24} />
                            </div>
                            <h3 className="font-bold text-white text-base font-mono">Envíos a Todo el País</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                Despachos seguros y asegurados a las 24 provincias con entrega express en 24h a 48h.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-800 bg-[#05060A] py-12 px-6 text-center text-xs text-slate-500 font-mono space-y-3">
                <p>© 2026 ATOMIC INDUSTRIES — Soluciones de Movilidad Eléctrica y Cargadores EV Europeos.</p>
                <p className="text-[11px] text-slate-600">Disponibilidad en Quito, Guayaquil, Cuenca, Ambato, Manta y despachos a todo el Ecuador.</p>
            </footer>
        </div>
    );
}
