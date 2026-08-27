"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Server, ShieldCheck, Cpu, HardDrive, Network, CheckCircle2,
  ArrowRight, Sparkles, MessageSquare, Wrench, Building2, Lock
} from "lucide-react"

const SERVIDORES_LIST = [
  {
    id: "dell-poweredge-r450",
    brand: "Dell EMC",
    name: "Dell PowerEdge R450 1U Rack Server",
    price: 2450,
    badge: "Alta Densidad 1U",
    specs: [
      "Procesador: Intel Xeon Silver 4314 (16 Cores / 32 Threads)",
      "Memoria: 64GB DDR4 RDIMM ECC 3200MHz",
      "Almacenamiento: 2x 960GB SSD SAS Enterprise (RAID 1)",
      "Fuentes Redundantes: 2x 800W Platinum Hot-Plug",
      "Red: 4x 1GbE + 2x 10GbE SFP+ Dual Port",
      "Administración remota: iDRAC9 Enterprise"
    ],
    ideal: "Bases de datos SQL, ERPs empresariales, virtualización Proxmox / VMware."
  },
  {
    id: "hpe-proliant-dl380",
    brand: "HPE",
    name: "HPE ProLiant DL380 Gen10 2U Rack",
    price: 3890,
    badge: "Empresas Medianas / Grandes",
    specs: [
      "Procesador: Dual Intel Xeon Gold 5218R (40 Cores Totales)",
      "Memoria: 128GB DDR4 SmartMemory ECC",
      "Almacenamiento: 4x 1.92TB SSD Enterprise NVMe U.3",
      "Controladora: Smart Array P408i-a con 2GB Flash FBWC",
      "Fuentes Redundantes: 2x 1600W Flex Slot Platinum",
      "Administración remota: HPE iLO 5 Advanced"
    ],
    ideal: "Centros de datos, clusters de alta disponibilidad, almacenamiento masivo y nube privada."
  },
  {
    id: "supermicro-gpu-ai",
    brand: "Supermicro",
    name: "Supermicro AI & Storage SuperServer 2U",
    price: 4950,
    badge: "Inteligencia Artificial & Cómputo",
    specs: [
      "Procesador: AMD EPYC 7763 (64 Cores / 128 Threads)",
      "Memoria: 256GB DDR4 ECC 3200MHz",
      "Soporte GPU: Hasta 4x GPUs PCIe Gen 4.0 Dual-Width",
      "Almacenamiento: 8x 3.84TB NVMe U.2 Hot-Swap",
      "Red de ultra velocidad: Dual 25GbE Mellanox",
      "Fuentes Redundantes: 2x 2000W Titanium"
    ],
    ideal: "Modelos de Inteligencia Artificial locales, procesamiento masivo y análisis de datos en tiempo real."
  }
]

export default function ServidoresClient() {
  const [includeInstallation, setIncludeInstallation] = useState(true)

  const handleConsultWhatsApp = (serv: typeof SERVIDORES_LIST[0]) => {
    const msg = `🖥️ *COTIZACIÓN DE SERVIDOR EMPRESARIAL CON INSTALACIÓN*%0A%0A` +
      `*Servidor:* ${encodeURIComponent(serv.name)} ($${serv.price} USD)%0A` +
      `*Instalación & Configuración:* ${includeInstallation ? 'INCLUIDA (Puesta en marcha, RAID y SO)' : 'Solo Hardware'}%0A%0A` +
      `_Deseo agendar levantamiento técnico y cotización formal corporativa._`

    window.open(`https://wa.me/593969043453?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/3 w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Server className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-cyan-400">SERVERS</span></span>
          </Link>

          <Link
            href="/web"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
          >
            ← Volver a Con Instalación
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={14} /> Infraestructura TI Corporativa
          </div>
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Servidores de Alto Rendimiento con <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              Instalación y Configuración en Sitio
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto mt-4">
            Optimiza la gestión de tu empresa. Montaje en rack, arreglos de discos RAID, sistemas de virtualización y copias de seguridad automatizadas con soporte técnico especializado.
          </p>
        </motion.div>
      </section>

      {/* Servers List */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {SERVIDORES_LIST.map((serv) => (
            <div
              key={serv.id}
              className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all grid lg:grid-cols-3 gap-8 items-center shadow-2xl"
            >
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase">
                    {serv.brand}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-bold">
                    {serv.badge}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white">{serv.name}</h3>

                <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-2">
                  {serv.specs.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-xs text-slate-400">
                  <strong className="text-slate-200">Recomendado para:</strong> {serv.ideal}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-6">
                <div>
                  <span className="block text-xs text-slate-400 uppercase font-bold">Inversión Hardware</span>
                  <span className="text-4xl font-black text-cyan-400">${serv.price} USD</span>
                  <span className="block text-[11px] text-emerald-400 mt-1 font-semibold">
                    ✓ Incluye Configuración Inicial y Puesta en Marcha
                  </span>
                </div>

                <button
                  onClick={() => handleConsultWhatsApp(serv)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-sm hover:brightness-110 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  <span>Cotizar Servidor e Instalación</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Installation Methodology */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 grid md:grid-cols-3 gap-6 text-center">
          <div>
            <Building2 size={28} className="text-cyan-400 mx-auto mb-2" />
            <strong className="block text-white text-base">1. Levantamiento en Sitio</strong>
            <p className="text-xs text-slate-400 mt-1">Evaluación del cuarto de servidores, energía y climatización.</p>
          </div>
          <div>
            <Wrench size={28} className="text-cyan-400 mx-auto mb-2" />
            <strong className="block text-white text-base">2. Montaje & Cableado Estructurado</strong>
            <p className="text-xs text-slate-400 mt-1">Instalación en rack, etiquetado y redundancia eléctrica.</p>
          </div>
          <div>
            <Lock size={28} className="text-cyan-400 mx-auto mb-2" />
            <strong className="block text-white text-base">3. Seguridad & Backups</strong>
            <p className="text-xs text-slate-400 mt-1">Configuración de cortafuegos, VPNs y respaldos automáticos.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 Atomic Industries. Soluciones de Servidores y Centros de Datos.</p>
      </footer>
    </div>
  )
}
