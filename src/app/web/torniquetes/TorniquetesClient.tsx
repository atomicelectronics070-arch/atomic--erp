"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Zap, CheckCircle, ArrowRight, Phone, Lock, ChevronRight, Cpu, Layers, ShieldCheck, Download, Award, Wrench } from "lucide-react"

interface Product {
  id: string
  sku: string | null
  name: string
  price: number
  compareAtPrice: number | null
  stock: number
  description: string | null
  images: string | null
}

export default function TorniquetesClient({ initialProducts }: { initialProducts: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const parseImage = (imgStr: string | null) => {
    if (!imgStr) return "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80"
    try {
      const arr = JSON.parse(imgStr)
      if (Array.isArray(arr) && arr.length > 0) return arr[0]
      return imgStr
    } catch {
      return imgStr
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-[#E8341A]/30 overflow-hidden">
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-[#E8341A]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/3 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-50 border-b border-white/[0.05] bg-black/60 backdrop-blur-2xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E8341A] rounded-xl flex items-center justify-center font-black text-white text-xl shadow-[0_0_20px_rgba(232,52,26,0.5)]">
              A
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white uppercase italic">ATOMIC <span className="text-[#E8341A]">SECURITY</span></span>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Sistemas de Control Peatonal</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/593969043453?text=Hola,%20necesito%20cotizar%20un%20sistema%20de%20torniquetes%20peatonales"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-[#E8341A] text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#ff4025] transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(232,52,26,0.3)]"
            >
              <Phone size={14} /> Asesoría Directa WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/80 border border-[#E8341A]/30 text-[#E8341A] text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={16} /> Alta Seguridad & Control Biométrico de Ingreso Peatonal
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight italic leading-none max-w-5xl mx-auto">
            TORNIQUETES PEATONALES & <span className="text-[#E8341A]">MOLINETES DE ACCESO</span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            Soluciones integrales de alto flujo para vestíbulos corporativos, centros educativos, industrias y gimnasios. Compatibles con huella digital, reconocimiento facial, tarjetas RFID y códigos QR.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
            {[
              { title: "Acero Inoxidable 304", desc: "Resistente a la intemperie" },
              { title: "Mecanismo Anti-Aplastamiento", desc: "Sensores de infrarrojos" },
              { title: "Integración Biométrica", desc: "ZKTeco / Hikvision / Dahua" },
              { title: "Garantía & Repuestos", desc: "Soporte técnico directo" }
            ].map((feature, i) => (
              <div key={i} className="p-4 bg-slate-900/40 border border-white/[0.04] rounded-2xl backdrop-blur-xl text-left">
                <CheckCircle size={18} className="text-[#E8341A] mb-2" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{feature.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Catalog Section */}
      <section className="relative py-16 px-6 bg-slate-950/60 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.04] pb-8">
            <div>
              <span className="text-xs font-black text-[#E8341A] uppercase tracking-widest">Equipos en Stock Inmediato</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight italic mt-1">Catálogo de Equipos Peatonales</h2>
            </div>
            <p className="text-xs text-slate-400 font-medium max-w-md">
              Precios transparentes con stock actualizado en tiempo real. Cotiza instalaciones completas con llave en mano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialProducts.map((p) => (
              <div 
                key={p.id}
                className="group bg-slate-900/40 border border-white/[0.06] hover:border-[#E8341A]/50 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/50 border border-white/[0.04] flex items-center justify-center p-4">
                    <img 
                      src={parseImage(p.images)} 
                      alt={p.name}
                      className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#E8341A] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-lg">
                      {p.stock > 0 ? `Stock: ${p.stock} Unidades` : 'Bajo Pedido'}
                    </div>
                  </div>

                  <div>
                    {p.sku && <span className="text-[10px] font-mono text-[#E8341A] uppercase">SKU: {p.sku}</span>}
                    <h3 className="text-base font-bold text-white uppercase tracking-tight mt-1 line-clamp-2">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {p.description || "Sistema de control de acceso peatonal de alta precisión para vestíbulos e instalaciones de seguridad."}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.04] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Precio de Lista:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white italic">${p.price.toFixed(2)}</span>
                      {p.compareAtPrice && (
                        <span className="text-xs text-slate-400 line-through">${p.compareAtPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/593969043453?text=Hola,%20deseo%20cotizar%20el%20equipo:%20${encodeURIComponent(p.name)}%20(SKU:%20${p.sku || 'N/A'})`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-[#E8341A] hover:bg-[#ff4025] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-[0_4px_15px_rgba(232,52,26,0.3)]"
                  >
                    Cotizar <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.05] bg-black py-12 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="font-bold text-slate-400 uppercase tracking-widest">
            © 2026 ATOMIC Electronics — Todos los derechos reservados.
          </p>
          <p className="text-[10px] text-slate-400">
            Av. Amazonas & Guayaquil, Ecuador | Contacto Directo: 0969043453
          </p>
        </div>
      </footer>
    </div>
  )
}
