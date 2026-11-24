"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import {
  ShieldCheck,
  Video,
  Lock,
  Wifi,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Star,
  Truck,
  Eye,
  Bell,
  ShoppingCart,
  Check
} from "lucide-react"

const VIDEOPORTEROS = [
  {
    id: "kit-diel-10",
    name: 'Kit Videoportero DIEL LCD de 10" con Botonera Metálica',
    subtitle: "Oferta de alta gama: Botonera antigolpes metálica y anti-vandálica",
    price: 221.01,
    oldPrice: 285.00,
    priceNote: "IVA Incluido",
    badge: "Botonera Antivandálica",
    image: "/images/videoporteros/videoportero-diel-10.jpg",
    specs: [
      'Pantalla panorámica LCD de 10" DIEL de alta definición',
      "Botonera exterior metálica de aleación de aluminio anti-impacto",
      "Cámara integrada gran angular con visión nocturna infrarroja nítida",
      "Apertura de cerradura eléctrica y portón desde el monitor interno",
      "Comunicación de audio bidireccional claro y sin eco",
      "Instalación sencilla de 4 hilos para residencias, negocios y oficinas"
    ]
  },
  {
    id: "ezviz-hp7-cb1",
    name: "Portero Electrónico Smart EZVIZ HP7 CB1 Sin Cables",
    subtitle: "Portero unifamiliar de alto rendimiento y máxima calidad",
    price: 199.99,
    oldPrice: 249.99,
    priceNote: "+ IVA",
    badge: "100% Sin Cables / Wi-Fi",
    image: "/images/videoporteros/ezviz-cb1-hp7.jpg",
    specs: [
      "Pantalla táctil a color de 7 pulgadas con interfaz moderna",
      "Cámara 2K con lente ultra gran angular de 162° y visión nocturna",
      "Detección inteligente de movimiento humano con alertas en tiempo real",
      "Desbloqueo inteligente por tarjetas RFID de proximidad (2 etiquetas)",
      "Atiende la puerta y abre remotamente desde la App EZVIZ en tu celular",
      "Compatible con timbre inalámbrico adicional e integración con Alexa"
    ]
  }
]

export default function VideoporterosClient() {
  const { addToCart, totalItems } = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)

  const handleAddToCart = (item: typeof VIDEOPORTEROS[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    })
    setAddedId(item.id)
    setTimeout(() => setAddedId(null), 2500)
  }

  const handleOrderWhatsApp = (item: typeof VIDEOPORTEROS[0]) => {
    const msg = `📹 *PEDIDO VIDEOPORTERO SMART*\n\n` +
      `*Equipo:* ${item.name}\n` +
      `*Precio Promocional:* $${item.price.toFixed(2)} USD (${item.priceNote})\n` +
      `*Garantía:* 1 Año Oficial Atomic Security\n\n` +
      `_Deseo consultar sobre instalación en mi domicilio u oficina en Ecuador._`

    window.open(`https://wa.me/593969043453?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/3 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07090E]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/web" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Video className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">ATOMIC <span className="text-cyan-400">ACCESS</span></span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/web/cart"
              className="relative inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="font-bold">Proforma / Carrito</span>
              {totalItems > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-400 text-black text-[10px] font-black">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/web"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
            >
              ← Volver a Ofertas
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 max-w-7xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck size={14} /> Control de Acceso & Seguridad Residencial
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Videoporteros Smart de Alta Calidad: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400">
              Ve, Habla y Abre desde Cualquier Lugar
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Protege lo que más importa. Soluciones cableadas antivandálicas e inalámbricas Wi-Fi con apertura remota para casas, departamentos, oficinas y condominios.
          </p>
        </motion.div>
      </section>

      {/* Product Comparison Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {VIDEOPORTEROS.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase tracking-wider border border-cyan-500/20">
                    {item.badge}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star size={13} fill="currentColor" /> 5.0 / 5.0
                  </div>
                </div>

                {/* Product Image Presentation */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-6 flex items-center justify-center p-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 font-mono">
                    Garantía 1 Año
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  {item.subtitle}
                </p>

                <div className="mt-6 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Especificaciones Principales:</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {item.specs.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price & Action Section */}
              <div className="mt-8 space-y-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Precio Especial</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-cyan-400">${item.price.toFixed(2)} USD</span>
                      <span className="text-xs text-slate-500 line-through">${item.oldPrice.toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.priceNote}</span>
                  </div>

                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                    ✓ Stock Inmediato
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider font-heading flex items-center justify-center gap-2 border transition-all ${
                      addedId === item.id
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                        : "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                    }`}
                  >
                    {addedId === item.id ? (
                      <>
                        <Check size={16} className="text-emerald-400" />
                        <span>¡Añadido a Proforma!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        <span>Añadir a Proforma</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOrderWhatsApp(item)}
                    className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-xs uppercase tracking-wider font-heading hover:brightness-110 shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} />
                    <span>Pedir por WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-12 text-center text-slate-500 text-xs">
        <p>© 2026 ATOMIC Electronics Ecuador. Videoporteros, Intercomunicadores y Control de Acceso.</p>
        <p className="mt-2 text-slate-600">Av. Amazonas, Quito, Ecuador • WhatsApp Oficial: 0969043453</p>
      </footer>
    </div>
  )
}
