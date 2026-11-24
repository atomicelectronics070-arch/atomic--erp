"use client"

import { useState } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import {
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Phone,
  Lock,
  ChevronRight,
  Cpu,
  Layers,
  ShieldCheck,
  Award,
  Wrench,
  ShoppingCart,
  Check
} from "lucide-react"

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

const DEFAULT_TORNIQUETES: Product[] = [
  {
    id: "zk-ts1000-pro",
    sku: "ZK-TS1000PRO",
    name: "Torniquete Trípode Biométrico ZKTeco TS1000 Pro (Acero Inoxidable SUS304)",
    price: 890.00,
    compareAtPrice: 1190.00,
    stock: 5,
    description: "Mecanismo bidireccional de aleación reforzada con caída de brazo en caso de emergencia/incendio. Compatible con biometría ZKBioAccess.",
    images: JSON.stringify(["/images/seguridad/zkteco-kit-acceso.jpg"])
  },
  {
    id: "zk-fbl2000-pro",
    sku: "ZK-FBL2000PRO",
    name: "Pasarela Flap Barrier de Alta Velocidad FBL2000 Pro con Cristal Retráctil",
    price: 1650.00,
    compareAtPrice: 2100.00,
    stock: 3,
    description: "Diseño corporativo ultra elegante con aletas retráctiles de apertura silenciosa. Sensores infrarrojos anti-aplastamiento y detección de cola (tailgating).",
    images: JSON.stringify(["/images/seguridad/zkteco-acceso-edificio.jpg"])
  },
  {
    id: "zk-sbtl2000",
    sku: "ZK-SBTL2000",
    name: "Molinete Batiente Swing Barrier SBTL2000 Accesibilidad Universal / Sillas de Ruedas",
    price: 1420.00,
    compareAtPrice: 1850.00,
    stock: 4,
    description: "Paso ancho de hasta 900mm apto para paso de personas con movilidad reducida o bultos. Chasis en acero inoxidable y señalización LED bicolor.",
    images: JSON.stringify(["/images/seguridad/zkteco-specs.jpg"])
  }
]

export default function TorniquetesClient({ initialProducts }: { initialProducts: Product[] }) {
  const { addToCart, totalItems } = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)

  // Merge initial products with default flagship turnstiles if needed
  const catalogProducts = initialProducts.length > 0
    ? [...initialProducts, ...DEFAULT_TORNIQUETES.filter(d => !initialProducts.some(p => p.sku === d.sku))]
    : DEFAULT_TORNIQUETES

  const parseImage = (imgStr: string | null) => {
    if (!imgStr) return "/images/seguridad/zkteco-kit-acceso.jpg"
    try {
      const arr = JSON.parse(imgStr)
      if (Array.isArray(arr) && arr.length > 0) return arr[0]
      return imgStr
    } catch {
      return imgStr
    }
  }

  const handleAddToCart = (p: Product) => {
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
      image: parseImage(p.images)
    })
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 2500)
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
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E8341A] rounded-xl flex items-center justify-center font-black text-white text-xl shadow-[0_0_20px_rgba(232,52,26,0.5)]">
              A
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white uppercase italic">ATOMIC <span className="text-[#E8341A]">SECURITY</span></span>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Sistemas de Control Peatonal</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/web/cart"
              className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] border border-white/10 hover:border-white/20 text-xs font-bold text-slate-300 transition-colors"
            >
              <ShoppingCart size={14} className="text-[#E8341A]" />
              <span>Proforma / Carrito</span>
              {totalItems > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#E8341A] text-white text-[10px] font-black">
                  {totalItems}
                </span>
              )}
            </Link>

            <a 
              href="https://wa.me/593969043453?text=Hola%20ATOMIC,%20necesito%20cotizar%20un%20sistema%20de%20torniquetes%20peatonales"
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
              <span className="text-xs font-black text-[#E8341A] uppercase tracking-widest">Equipos Homologados & Stock</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight italic mt-1">Catálogo de Equipos Peatonales</h2>
            </div>
            <p className="text-xs text-slate-400 font-medium max-w-md">
              Precios transparentes con stock actualizado en tiempo real. Cotiza instalaciones completas con llave en mano y garantía oficial en Ecuador.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {catalogProducts.map((p) => (
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
                      {p.stock > 0 ? `Stock: ${p.stock} Unidades` : 'Stock Inmediato'}
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

                <div className="pt-6 mt-6 border-t border-white/[0.04] space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Precio Promoción:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white italic">${p.price.toFixed(2)} USD</span>
                        {p.compareAtPrice && (
                          <span className="text-xs text-slate-500 line-through">${p.compareAtPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                      ✓ Garantía 2 Años
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddToCart(p)}
                      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider font-heading flex items-center justify-center gap-1.5 border transition-all ${
                        addedId === p.id
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                          : "bg-white/[0.06] hover:bg-white/[0.12] text-white border-white/10"
                      }`}
                    >
                      {addedId === p.id ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span>¡Añadido!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} className="text-[#E8341A]" />
                          <span>Proforma</span>
                        </>
                      )}
                    </button>

                    <a 
                      href={`https://wa.me/593969043453?text=Hola%20ATOMIC,%20deseo%20cotizar%20el%20equipo:%20${encodeURIComponent(p.name)}%20(SKU:%20${p.sku || 'N/A'})%20con%20precio%20$${p.price.toFixed(2)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 bg-[#E8341A] hover:bg-[#ff4025] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(232,52,26,0.3)]"
                    >
                      <span>Cotizar</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
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
          <p className="text-[10px] text-slate-500">
            Av. Amazonas & Guayaquil, Ecuador | Contacto Directo WhatsApp: 0969043453
          </p>
        </div>
      </footer>
    </div>
  )
}
