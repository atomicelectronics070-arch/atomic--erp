"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { 
    Zap, ShieldCheck, CheckCircle2, MessageCircle, ArrowRight,
    Sparkles, Wrench, RefreshCw, Award, Gauge, BatteryCharging, Shield, Truck
} from "lucide-react"

const WHATSAPP_NUMBER = "0969043453"
const WHATSAPP_LINK = "https://wa.me/593969043453?text=Hola%20ATOMIC%20Industries%2C%20quiero%20cotizar%20los%20Cargadores%20El%C3%A9ctricos%20EV%20y%20Saltadores%20de%20Bater%C3%ADa."

export default function EVChargersLandingPage() {
    const [selectedWallboxVersion, setSelectedWallboxVersion] = useState<"7kw" | "11kw" | "22kw">("7kw")
    const [selectedPortableVersion, setSelectedPortableVersion] = useState<"3.5kw" | "7.4kw">("3.5kw")

    const WALLBOX_VERSIONS = {
        "7kw": {
            name: "Wallbox 7.4 kW Monofásico",
            voltage: "220V / 32A Monofásico",
            speed: "~35 - 40 km por hora de carga",
            price: "$650.00",
            useCase: "Ideal para garajes residenciales, hogares y conjuntos residenciales."
        },
        "11kw": {
            name: "Wallbox 11 kW Trifásico",
            voltage: "380V / 16A Trifásico",
            speed: "~60 - 70 km por hora de carga",
            price: "$890.00",
            useCase: "Ideal para empresas, flotas de vehículos y comercios con red trifásica."
        },
        "22kw": {
            name: "Wallbox 22 kW Ultra Fast",
            voltage: "380V / 32A Trifásico Ultra Rápido",
            speed: "~120 km por hora de carga",
            price: "$1,250.00",
            useCase: "Máxima potencia comercial, estaciones de carga públicas e industrias."
        }
    }

    const PORTABLE_VERSIONS = {
        "3.5kw": {
            name: "Cargador Portátil 3.5 kW (Schuko Doméstico)",
            plug: "Conector Schuko 110V/220V 16A",
            price: "$380.00",
            desc: "Para conectar en cualquier tomacorriente doméstico mientras viajas."
        },
        "7.4kw": {
            name: "Cargador Portátil 7.4 kW (CEE Industrial 32A)",
            plug: "Conector Industrial CEE 220V 32A",
            price: "$490.00",
            desc: "Potencia de carga acelerada portátil para uso profesional e industrial."
        }
    }

    return (
        <div className="font-sans text-slate-100 bg-[#020617] selection:bg-emerald-500/30 selection:text-white overflow-x-hidden">

            {/* HERO PRINCIPAL */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-[#030b18] to-[#020617] border-b border-slate-800/80">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[160px] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-14">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="flex-1 space-y-7 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            ATOMIC MOVILIDAD ELÉCTRICA · FABRICACIÓN EUROPEA
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight">
                            Cargadores EV & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                                Saltadores de Batería
                            </span>
                        </h1>

                        <p className="text-slate-300 text-base md:text-lg max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
                            Equipos inteligentes para vehículos eléctricos e híbridos enchufables. <strong className="text-emerald-400 font-bold">3 Años de Garantía</strong>, certificación europea CE & TUV, chasis IP65/IK10 ultra duradero e instalación profesional llave en mano.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            {[
                                { t: "Garantía 3 Años", d: "Certificación Europea CE/TUV" },
                                { t: "Protección IP65", d: "Resistente a Lluvia & Polvo" },
                                { t: "Instalación EV", d: "Servicio Llave en Mano" },
                                { t: "Balanceo Inteligente", d: "Carga Segura & Eficiente" }
                            ].map((badge, idx) => (
                                <div key={idx} className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-left">
                                    <h4 className="font-bold text-xs text-emerald-400">{badge.t}</h4>
                                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">{badge.d}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center lg:justify-start">
                            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-3">
                                <MessageCircle size={20} /> Asesoría por WhatsApp ({WHATSAPP_NUMBER})
                            </a>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex-1 w-full max-w-lg">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] space-y-4">
                            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center">
                                <img src="/ev-images/cargador-1.jpeg" alt="Wallbox Smart EV Charger ATOMIC" className="w-full h-full object-cover" />
                                <span className="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold rounded-full">
                                    ⚡ Wallbox Smart EV 7.4kW / 11kW / 22kW
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square">
                                    <img src="/ev-images/cargador-4.jpeg" alt="Cargador Portatil" className="w-full h-full object-cover" />
                                </div>
                                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square">
                                    <img src="/ev-images/cargador-2.jpeg" alt="Saltador 2000A" className="w-full h-full object-cover" />
                                </div>
                                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square">
                                    <img src="/ev-images/cargador-3.jpeg" alt="Saltador 1200A" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>


            {/* SECCIÓN PRODUCTOS CON VARIANTES & APARTADOS INDIVIDUALES */}
            <section className="py-24 px-6 max-w-7xl mx-auto space-y-20">
                <div className="text-center space-y-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                        CATÁLOGO DE PRODUCTOS & MODELOS DISPONIBLES
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Estaciones de Carga & Saltadores de Batería
                    </h2>
                </div>

                {/* 1. PRODUCTO MULTI-VERSIÓN: WALLBOX STRENGTH */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-800 pb-8">
                        <div>
                            <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold uppercase rounded-full mb-2 inline-block">
                                🔌 ESTACIÓN DE PARED WALLBOX SMART
                            </span>
                            <h3 className="text-3xl font-black text-white">Estación de Carga EV Wallbox Smart ATOMIC</h3>
                            <p className="text-xs font-mono text-slate-400 mt-1">Conectividad WiFi/Bluetooth/RFID · Pantalla LCD Telemetría · Fabricación Europea CE/TUV</p>
                        </div>

                        {/* Version selector buttons */}
                        <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                            {(["7kw", "11kw", "22kw"] as const).map(v => (
                                <button key={v} onClick={() => setSelectedWallboxVersion(v)}
                                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${selectedWallboxVersion === v ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                                    {v.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video lg:aspect-square relative">
                            <img src="/ev-images/cargador-1.jpeg" alt="Wallbox Smart EV Charger" className="w-full h-full object-cover" />
                        </div>

                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                                <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                                    <h4 className="font-bold text-white text-base">{WALLBOX_VERSIONS[selectedWallboxVersion].name}</h4>
                                    <span className="text-2xl font-black text-emerald-400 font-mono">{WALLBOX_VERSIONS[selectedWallboxVersion].price}</span>
                                </div>
                                <div className="space-y-2 text-xs font-mono text-slate-300 pt-1">
                                    <p><strong>• Voltaje & Red:</strong> {WALLBOX_VERSIONS[selectedWallboxVersion].voltage}</p>
                                    <p><strong>• Velocidad Estimada:</strong> {WALLBOX_VERSIONS[selectedWallboxVersion].speed}</p>
                                    <p><strong>• Aplicación Recomendada:</strong> {WALLBOX_VERSIONS[selectedWallboxVersion].useCase}</p>
                                    <p><strong>• Garantía Incluida:</strong> 3 Años de Garantía con soporte de repuestos en oficina.</p>
                                </div>
                            </div>

                            <a href={`https://wa.me/593969043453?text=Hola%2C%20quiero%20cotizar%20la%20${encodeURIComponent(WALLBOX_VERSIONS[selectedWallboxVersion].name)}`}
                                target="_blank" rel="noopener noreferrer"
                                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all">
                                <MessageCircle size={18} /> Cotizar {WALLBOX_VERSIONS[selectedWallboxVersion].name} por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* 2. PRODUCTO MULTI-VERSIÓN: CARGADOR PORTÁTIL */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-800 pb-8">
                        <div>
                            <span className="px-3 py-1 bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold uppercase rounded-full mb-2 inline-block">
                                🎒 CARGADOR PORTÁTIL MULTICONECTOR
                            </span>
                            <h3 className="text-3xl font-black text-white">Cargador Portátil EV Pro ATOMIC</h3>
                            <p className="text-xs font-mono text-slate-400 mt-1">Regulación de Amperaje (8A a 32A) · Cable 5m Cobre Puro · Pantalla OLED Táctil</p>
                        </div>

                        <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                            {(["3.5kw", "7.4kw"] as const).map(v => (
                                <button key={v} onClick={() => setSelectedPortableVersion(v)}
                                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${selectedPortableVersion === v ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                                    {v.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video lg:aspect-square relative">
                            <img src="/ev-images/cargador-4.jpeg" alt="Cargador Portatil EV Pro ATOMIC" className="w-full h-full object-cover" />
                        </div>

                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                                <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                                    <h4 className="font-bold text-white text-base">{PORTABLE_VERSIONS[selectedPortableVersion].name}</h4>
                                    <span className="text-2xl font-black text-cyan-400 font-mono">{PORTABLE_VERSIONS[selectedPortableVersion].price}</span>
                                </div>
                                <div className="space-y-2 text-xs font-mono text-slate-300 pt-1">
                                    <p><strong>• Conector:</strong> {PORTABLE_VERSIONS[selectedPortableVersion].plug}</p>
                                    <p><strong>• Uso:</strong> {PORTABLE_VERSIONS[selectedPortableVersion].desc}</p>
                                    <p><strong>• Protección:</strong> IP67 a prueba de agua en controlador y conector.</p>
                                    <p><strong>• Garantía:</strong> 3 Años de Garantía Europea CE/TUV.</p>
                                </div>
                            </div>

                            <a href={`https://wa.me/593969043453?text=Hola%2C%20quiero%20cotizar%20el%20${encodeURIComponent(PORTABLE_VERSIONS[selectedPortableVersion].name)}`}
                                target="_blank" rel="noopener noreferrer"
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all">
                                <MessageCircle size={18} /> Cotizar {PORTABLE_VERSIONS[selectedPortableVersion].name} por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* 3. PRODUCTOS ARRANCADORES / SALTADORES DE BATERÍA (2 MODELOS) */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Saltador 2000A */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold uppercase rounded-full inline-block">
                                🔋 SALTADOR HEAVY DUTY 2000A
                            </span>
                            <h3 className="text-2xl font-black text-white">Arrancador de Batería Heavy Duty 2000A ATOMIC</h3>
                            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-48">
                                <img src="/ev-images/cargador-2.jpeg" alt="Saltador Bateria 2000A" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
                                <p><strong>• Corriente Pico:</strong> 2000A (Motores hasta 8.0L Gas / 6.5L Diésel)</p>
                                <p><strong>• Powerbank:</strong> 24,000 mAh con carga rápida USB-C</p>
                                <p><strong>• Linterna:</strong> LED 300 Lumens (Modo SOS, Strobe)</p>
                                <p><strong>• Garantía:</strong> 3 Años de Garantía por escrito</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-2xl font-black text-amber-400 font-mono">$165.00</span>
                            <a href="https://wa.me/593969043453?text=Hola%2C%20quiero%20comprar%20el%20Saltador%20de%20Bateria%20Heavy%20Duty%202000A"
                                target="_blank" rel="noopener noreferrer"
                                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all">
                                Comprar por WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Saltador 1200A */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <span className="px-3 py-1 bg-purple-500/15 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold uppercase rounded-full inline-block">
                                ⚡ SALTADOR COMPACTO 1200A
                            </span>
                            <h3 className="text-2xl font-black text-white">Saltador Compacto 1200A con QC3.0 ATOMIC</h3>
                            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-48">
                                <img src="/ev-images/cargador-3.jpeg" alt="Saltador Bateria 1200A" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
                                <p><strong>• Corriente Pico:</strong> 1200A (Motores hasta 6.0L Gas / 4.0L Diésel)</p>
                                <p><strong>• Powerbank:</strong> 16,000 mAh con QuickCharge 3.0</p>
                                <p><strong>• Pinzas:</strong> Sistema anti-chispas y protección polaridad</p>
                                <p><strong>• Garantía:</strong> 3 Años de Garantía por escrito</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-2xl font-black text-purple-400 font-mono">$115.00</span>
                            <a href="https://wa.me/593969043453?text=Hola%2C%20quiero%20comprar%20el%20Saltador%20de%20Bateria%20Compacto%201200A"
                                target="_blank" rel="noopener noreferrer"
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all">
                                Comprar por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>


            {/* SECCIÓN BENEFICIOS GENERALES: DURABILIDAD, INSTALACIÓN, GARANTÍA 3 AÑOS */}
            <section className="py-24 bg-slate-950 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-3">
                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                            VENTAJAS EXCLUSIVAS DE NUESTROS CARGADORES EUROPEOS
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            ¿Por qué Elegir ATOMIC EV?
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                                <Award size={24} />
                            </div>
                            <h3 className="font-bold text-white text-base">Garantía de 3 Años</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                Cobertura completa por 3 años con soporte de fábrica y repuestos originales disponibles en Ecuador.
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="font-bold text-white text-base">Durabilidad IP65 / IK10</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                Chasis sellado a prueba de lluvias torrenciales, polvo y golpes de alta intensidad para exteriores.
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                                <Wrench size={24} />
                            </div>
                            <h3 className="font-bold text-white text-base">Instalación Llave en Mano</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                Contamos con técnicos certficados para realizar la instalación eléctrica, protección de brekers y ductos.
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold">
                                <Truck size={24} />
                            </div>
                            <h3 className="font-bold text-white text-base">Envíos a Nivel Nacional</h3>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                Despachos seguros y rastreados a todas las provincias de Ecuador con entrega express en 24h.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* FOOTER WHATSAPP ACTION */}
            <section className="py-20 bg-gradient-to-r from-emerald-950 via-slate-950 to-teal-950 border-t border-emerald-500/30 text-center space-y-6">
                <div className="max-w-4xl mx-auto px-6 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black text-white">¿Necesitas Asesoría para Elegir tu Cargador EV?</h2>
                    <p className="text-slate-300 text-sm max-w-xl mx-auto">Comunícate directamente con nuestros ingenieros en movilidad eléctrica al WhatsApp {WHATSAPP_NUMBER}.</p>
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all">
                        <MessageCircle size={20} /> Hablar por WhatsApp ({WHATSAPP_NUMBER})
                    </a>
                </div>
            </section>

        </div>
    )
}
