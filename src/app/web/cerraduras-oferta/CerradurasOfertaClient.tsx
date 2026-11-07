"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ShieldCheck, Zap, Sparkles, ShoppingCart, Phone, ArrowRight, 
  CheckCircle2, Truck, Clock, Award, Key, ScanFace, Fingerprint, 
  Video, Bell, Lock, BatteryCharging, AlertTriangle, ChevronRight, 
  MapPin, HelpCircle, Eye, ShieldAlert, Check, X, RefreshCw
} from "lucide-react"
import { useCart } from "@/context/CartContext"

interface DbProduct {
  id: string
  name: string
  price: number
  compareAtPrice: number | null
  sku?: string | null
  images?: string | null
  description?: string | null
  stock?: number | null
}

interface CerradurasOfertaClientProps {
  products: DbProduct[]
}

const ECUADOR_CITIES = [
  { name: "Quito (Urbano, Norte, Centro, Sur, Valles)", cost: 0, isFree: true, note: "Entrega Inmediata HOY MISMO GRATIS" },
  { name: "Cumbayá / Tumbaco / Puembo", cost: 0, isFree: true, note: "Entrega Inmediata HOY MISMO GRATIS" },
  { name: "Valle de Los Chillos / Sangolquí", cost: 0, isFree: true, note: "Entrega Inmediata HOY MISMO GRATIS" },
  { name: "Carapungo / Calderón", cost: 0, isFree: true, note: "Entrega Inmediata HOY MISMO GRATIS" },
  { name: "Guayaquil / Samborondón / Durán", cost: 5.0, isFree: false, note: "Servientrega Asegurado 24h" },
  { name: "Cuenca", cost: 5.0, isFree: false, note: "Servientrega Asegurado 24h" },
  { name: "Ambato", cost: 5.0, isFree: false, note: "Servientrega Asegurado 24h" },
  { name: "Manta / Portoviejo", cost: 5.0, isFree: false, note: "Servientrega Asegurado 24-48h" },
  { name: "Machala", cost: 5.0, isFree: false, note: "Servientrega Asegurado 24-48h" },
  { name: "Santo Domingo", cost: 5.0, isFree: false, note: "Servientrega Asegurado 24h" },
  { name: "Ibarra / Otavalo", cost: 5.0, isFree: false, note: "Servientrega Asegurado 24h" },
  { name: "Loja", cost: 5.0, isFree: false, note: "Servientrega Asegurado 24-48h" },
  { name: "Riobamba", cost: 5.0, isFree: false, note: "Servientrega Asegurado 24h" },
  { name: "Quevedo / Babahoyo", cost: 5.0, isFree: false, note: "Servientrega Asegurado 24h" },
  { name: "Esmeraldas", cost: 5.0, isFree: false, note: "Servientrega Asegurado 24-48h" },
  { name: "Otras Provincias (Sierra / Costa / Oriente)", cost: 5.0, isFree: false, note: "Servientrega Asegurado 24-48h" },
  { name: "Galápagos (San Cristóbal / Santa Cruz)", cost: 7.5, isFree: false, note: "Envío Aéreo Courier Especial" }
]

export default function CerradurasOfertaClient({ products }: CerradurasOfertaClientProps) {
  const { addToCart } = useCart()
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0)
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0)
  const [addedSku, setAddedSku] = useState<string | null>(null)
  const [isFloatingMinimized, setIsFloatingMinimized] = useState<boolean>(false)

  const officialPhone = "593980319050"
  const formattedPhone = "098 031 9050"

  const selectedCity = ECUADOR_CITIES[selectedCityIndex]

  // Modelos con especificaciones visuales correspondientes a las imágenes subidas
  const CERRADURAS_MODELS = [
    {
      sku: "CERRADURA-WIFI-FACIAL-3D",
      title: "Cerradura Inteligente WiFi con Reconocimiento Facial 3D",
      badge: "MÁXIMA GAMA BIOMÉTRICA • 3D FACE ID",
      tagline: "Cámara HD 1080P, videollamada y 5 pistones ultra seguros",
      price: 145.0,
      regularPrice: 195.0,
      saveAmount: 50.0,
      image: "/images/cerraduras/oferta-fin-ano/cerradura-facial-3d-5pistones-145.jpg",
      highlightColor: "from-amber-500 to-yellow-500",
      accentBorder: "border-amber-400",
      accentBg: "bg-amber-400/10",
      pistones: "Bloqueo de 5 Pistones Ultra Seguro",
      specs: [
        { label: "Reconocimiento Facial 3D", detail: "Cámara HD 1080P integrada con sensor infrarrojo día y noche" },
        { label: "5 Métodos de Apertura", detail: "Facial 3D, Huella Semiconductor, Código Touch, Tarjeta IC RFID y Llave Física" },
        { label: "Videollamada Bidireccional", detail: "Habla y mira en tiempo real a tus visitas desde el celular vía App Tuya / Smart Life" },
        { label: "Batería de Litio Recargable", detail: "Batería de larga duración recargable por puerto USB Tipo-C incluido" },
        { label: "Bloqueo Ultra Seguro", detail: "5 pistones de acero reforzado anti-palanca y anti-taladro" },
        { label: "Compatibilidad de Puertas", detail: "Ideal para puertas de madera y metal de 35 a 120 mm de grosor" },
        { label: "Incluye de Fábrica", detail: "Cable Tipo C, 2 Tarjetas IC RFID, 2 Llaves de emergencia y kit de pernos" },
        { label: "Garantía Oficial", detail: "12 Meses de respaldo técnico directo ATOMIC Ecuador" }
      ]
    },
    {
      sku: "CERRADURA-TUYA-WIFI-5PISTONES",
      title: "Cerradura Inteligente WiFi Tuya Smart (5 Pistones + Alarma)",
      badge: "PRECIO INSUPERABLE • $89.80 INC. IVA",
      tagline: "Seguridad y tecnología con alarma antisabotaje integrada",
      price: 89.8,
      regularPrice: 125.0,
      saveAmount: 35.2,
      image: "/images/cerraduras/oferta-fin-ano/cerradura-tuya-wifi-5pistones-89.jpg",
      highlightColor: "from-red-600 to-rose-500",
      accentBorder: "border-rose-400",
      accentBg: "bg-rose-400/10",
      pistones: "Bloqueo de 5 Pistones de Máxima Seguridad",
      specs: [
        { label: "5 Métodos de Apertura", detail: "Huella biométrica, Contraseña antiespía, Tarjeta RFID, Llave y App" },
        { label: "5 Pistones de Bloqueo", detail: "Mecanismo embutido de 5 pasadores de acero de alta resistencia" },
        { label: "Alarma Antisabotaje", detail: "Sirena integrada sonora y notificación inmediata al teléfono en intento de forcejeo" },
        { label: "Compatibilidad Tuya Smart", detail: "100% compatible con App Tuya Smart y Smart Life en iOS y Android" },
        { label: "Apto Interior y Exterior", detail: "Chasis de aleación resistente a polvo, humedad y lluvia moderada" },
        { label: "Aperturas de Emergencia", detail: "Llave de seguridad mecánica y puerto de energía auxiliar de rescate" },
        { label: "Precio con Impuestos", detail: "$89.80 con IVA incluido y factura electrónica oficial" },
        { label: "Garantía Oficial", detail: "12 Meses de garantía con soporte técnico calificado" }
      ]
    },
    {
      sku: "CERRADURA-WIFI-CAMARA-2PISTONES",
      title: "Cerradura Inteligente WiFi con Cámara Frontal Integrada",
      badge: "OFERTA ESPECIAL • ¡PRECIO DE LOCURA $91!",
      tagline: "Mira quién toca el timbre en tu celular antes de abrir",
      price: 91.0,
      regularPrice: 130.0,
      saveAmount: 39.0,
      image: "/images/cerraduras/oferta-fin-ano/cerradura-camara-wifi-2pistones-91.jpg",
      highlightColor: "from-amber-500 to-orange-500",
      accentBorder: "border-orange-400",
      accentBg: "bg-orange-400/10",
      pistones: "Mecanismo de 2 Pistones de Acero Templado",
      specs: [
        { label: "Cámara HD & Timbre Integrado", detail: "Presiona el timbre en la cerradura y recibe captura y video en tu celular" },
        { label: "5 Métodos de Acceso", detail: "Huella digital, Código PIN touch, Tarjeta de proximidad, Llave y App Tuya" },
        { label: "2 Pistones de Seguridad", detail: "Cilindro con 2 pestillos de acero de alto impacto" },
        { label: "App Tuya & Smart Life", detail: "Generación de contraseñas temporales para visitas, Airbnb o personal de limpieza" },
        { label: "Apto Interior / Exterior", detail: "Acabado anodizado de alta durabilidad frente al desgaste cotidiano" },
        { label: "Alimentación Confiable", detail: "Batería de larga autonomía con aviso de batería baja y puerto de emergencia" },
        { label: "Entrega Inmediata", detail: "Stock disponible en Quito para retiro o despacho inmediato" },
        { label: "Garantía Oficial", detail: "12 Meses de respaldo de fábrica ATOMIC" }
      ]
    }
  ]

  const currentProduct = CERRADURAS_MODELS[selectedProductIndex]
  const shippingCost = selectedCity.cost
  const finalPriceWithShipping = currentProduct.price + shippingCost

  const handleAddToCart = (model: typeof CERRADURAS_MODELS[0]) => {
    // Buscar si existe en la base de datos
    const dbMatch = products.find(p => p.sku === model.sku)
    
    addToCart({
      id: dbMatch ? dbMatch.id : model.sku,
      name: model.title,
      price: model.price,
      image: model.image,
      quantity: 1
    })

    setAddedSku(model.sku)
    setTimeout(() => setAddedSku(null), 3000)
  }

  const handleWhatsAppBuy = (model: typeof CERRADURAS_MODELS[0]) => {
    const total = model.price + shippingCost
    const shippingText = selectedCity.isFree 
      ? "Entrega GRATIS en Quito (Inmediata)" 
      : `Envío a ${selectedCity.name} por Servientrega (+${shippingCost.toFixed(2)} USD)`

    const message = encodeURIComponent(
      `¡Hola ATOMIC! 👋 Deseo aprovechar la OFERTA DE FINAL DE AÑO de Cerraduras Inteligentes:\n\n` +
      `🔐 *Modelo:* ${model.title}\n` +
      `🏷️ *Precio Oferta:* $${model.price.toFixed(2)} USD\n` +
      `📍 *Ciudad de Destino:* ${selectedCity.name}\n` +
      `🚚 *Envío:* ${shippingText}\n` +
      `💰 *Total a Cancelar:* $${total.toFixed(2)} USD\n\n` +
      `¿Tienen disponibilidad para entrega inmediata? Por favor confírmenme los datos de despacho.`
    )

    window.open(`https://wa.me/${officialPhone}?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-[#060a12] text-stone-100 font-sans selection:bg-amber-400 selection:text-black">
      
      {/* ── TOP ANNOUNCEMENT BANNER: OFERTA DE FINAL DE AÑO ── */}
      <div className="bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-stone-950 px-4 py-2 text-center text-xs sm:text-sm font-black tracking-wider uppercase font-mono shadow-md flex items-center justify-center gap-2 flex-wrap">
        <span className="bg-black text-amber-300 px-2 py-0.5 rounded text-[11px] font-mono animate-pulse">
          ⚡ OFERTA FINAL DE AÑO
        </span>
        <span>CERRADURAS INTELIGENTES CON ENTREGA INMEDIATA EN QUITO (GRATIS) & ENVÍOS NACIONALES</span>
        <span className="hidden md:inline bg-white/30 text-stone-950 px-2 py-0.5 rounded text-[11px]">
          12 MESES GARANTÍA
        </span>
      </div>

      {/* ── HEADER / NAVIGATION ── */}
      <nav className="sticky top-0 z-40 bg-[#080d1a]/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/web" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-base shadow-sm group-hover:scale-105 transition-transform">
              ⚛
            </div>
            <div className="leading-none">
              <span className="font-heading font-black text-lg tracking-wider text-white">ATOMIC</span>
              <span className="block text-[9px] font-mono text-amber-400 tracking-widest uppercase">SEGURIDAD INTELIGENTE</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a 
              href={`https://wa.me/${officialPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-500/20 transition-all"
            >
              <Phone size={13} className="text-emerald-400" />
              <span>{formattedPhone}</span>
            </a>

            <Link
              href="/web/cart"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black uppercase font-mono tracking-wider shadow-sm transition-all"
            >
              <ShoppingCart size={15} />
              <span className="hidden sm:inline">Carrito</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO BANNER: OFERTA DE FINAL DE AÑO ── */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-8 border-b border-stone-800 bg-radial from-[#121c33] via-[#080d1a] to-[#04070d]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/70 border border-red-500/60 text-red-300 text-xs font-mono font-bold uppercase tracking-widest shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Liquidación de Temporada • Ofertas de Final de Año</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-white uppercase max-w-4xl mx-auto leading-tight">
            CERRADURAS INTELIGENTES <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              DISPONIBLES PARA ENTREGA INMEDIATA
            </span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Moderniza la puerta de tu hogar o negocio con tecnología biométrica de última generación. 
            <strong className="text-amber-300"> Tuya Smart & Smart Life</strong>, reconocimiento facial 3D, cámaras HD y alarma antisabotaje.
          </p>

          {/* 3 Promesas Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto pt-4">
            <div className="p-4 rounded-2xl bg-[#0e1626]/90 border border-amber-500/40 text-left flex items-start gap-3 shadow-lg">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="text-xs font-mono font-black text-amber-300 uppercase">¡Entrega GRATIS en Quito!</h4>
                <p className="text-[11px] text-stone-300 mt-0.5">Despacho inmediato el mismo día en Quito urbano, Norte, Centro, Sur y Valles sin costo adicional.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0e1626]/90 border border-cyan-500/40 text-left flex items-start gap-3 shadow-lg">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="text-xs font-mono font-black text-cyan-300 uppercase">Envíos a Todo el Ecuador</h4>
                <p className="text-[11px] text-stone-300 mt-0.5">Envíos seguros a Guayaquil, Cuenca, Ambato, Manta y provincias con valor adicional de <strong>+$5 USD</strong> vía Servientrega.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0e1626]/90 border border-emerald-500/40 text-left flex items-start gap-3 shadow-lg">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Award size={22} />
              </div>
              <div>
                <h4 className="text-xs font-mono font-black text-emerald-300 uppercase">12 Meses de Garantía</h4>
                <p className="text-[11px] text-stone-300 mt-0.5">Equipos 100% nuevos en caja original con soporte de configuración y repuestos oficiales ATOMIC.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALCULADORA / SELECTOR DE CIUDAD & COSTO DE ENVÍO ── */}
      <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0d1527] border-2 border-amber-500/70 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-heading font-black text-base sm:text-lg text-white uppercase tracking-wide">
                Cotizador de Envío y Entrega Inmediata
              </h3>
            </div>
            <span className="text-xs font-mono text-stone-400">
              Selecciona tu ciudad para verificar costo de despacho
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label htmlFor="city-select" className="block text-xs font-mono uppercase text-amber-300 mb-1.5 font-bold">
                ¿Dónde te encuentras?
              </label>
              <select
                id="city-select"
                value={selectedCityIndex}
                onChange={(e) => setSelectedCityIndex(Number(e.target.value))}
                className="w-full bg-[#070b14] border border-stone-700 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {ECUADOR_CITIES.map((c, idx) => (
                  <option key={idx} value={idx}>
                    {c.name} {c.isFree ? "— ¡ENTREGA GRATIS!" : `— (+$${c.cost.toFixed(2)} USD)`}
                  </option>
                ))}
              </select>
            </div>

            <div className={`p-4 rounded-2xl border ${selectedCity.isFree ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-cyan-950/40 border-cyan-500/50'} flex items-center justify-between`}>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                  Costo de Despacho
                </span>
                <span className={`text-xl font-mono font-black ${selectedCity.isFree ? 'text-emerald-400' : 'text-cyan-300'}`}>
                  {selectedCity.isFree ? "¡GRATIS!" : `+$${selectedCity.cost.toFixed(2)} USD`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-stone-400 block">Tiempo estimado:</span>
                <span className="text-xs font-mono font-bold text-white">{selectedCity.note}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN PRINCIPAL: 3 MODELOS EN OFERTA DE FINAL DE AÑO ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-widest">
            EQUIPOS CERTIFICADOS EN STOCK • ENTREGA INMEDIATA
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-white uppercase tracking-tight">
            Elige la Cerradura Ideal para tu Puerta
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Todas incluyen kit de instalación completo, llaves mecánicas de emergencia, garantía de 12 meses y compatibilidad nativa con Tuya Smart y Smart Life.
          </p>
        </div>

        {/* 3 PRODUCT CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CERRADURAS_MODELS.map((model, idx) => {
            const isSelected = selectedProductIndex === idx
            const totalWithSelectedCity = model.price + shippingCost

            return (
              <div 
                key={model.sku}
                className={`rounded-3xl bg-[#090f1d] border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl ${
                  isSelected 
                    ? `${model.accentBorder} shadow-[0_0_35px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/30` 
                    : 'border-stone-800 hover:border-stone-700'
                }`}
                onClick={() => setSelectedProductIndex(idx)}
              >
                {/* Header Badge */}
                <div className="p-4 bg-[#050811] border-b border-stone-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase text-amber-300 tracking-wider">
                    {model.badge}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                    ● En Stock Inmediato
                  </span>
                </div>

                {/* Image Showcase */}
                <div className="relative h-72 sm:h-80 w-full bg-black/60 overflow-hidden group">
                  <Image
                    src={model.image}
                    alt={model.title}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-mono text-stone-200 border border-stone-700">
                      🔒 {model.pistones}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-heading font-black text-lg sm:text-xl text-white uppercase leading-snug">
                      {model.title}
                    </h3>
                    <p className="text-xs text-stone-400 font-sans">
                      {model.tagline}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-2xl bg-[#050914] border border-stone-800 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-stone-500 font-mono line-through block">
                          Normal: ${model.regularPrice.toFixed(2)}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-heading font-black text-amber-400">
                            ${model.price.toFixed(2)}
                          </span>
                          <span className="text-[11px] font-mono text-stone-400">
                            USD {model.sku.includes("TUYA") ? "(Inc. IVA)" : ""}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-mono font-black text-xs">
                        -${model.saveAmount.toFixed(0)} OFF
                      </span>
                    </div>

                    {/* Cost with user selected city */}
                    <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-stone-400">Total con envío ({selectedCity.name.split(' ')[0]}):</span>
                      <span className="font-black text-white text-sm">
                        ${totalWithSelectedCity.toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  {/* Key Specs List */}
                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider block">
                      Especificaciones Técnicas:
                    </span>
                    <ul className="space-y-1.5 text-stone-300">
                      {model.specs.slice(0, 5).map((spec, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-[11px]">
                            <strong className="text-white">{spec.label}:</strong> {spec.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppBuy(model)}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-stone-950 font-black text-xs uppercase tracking-wider font-mono shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Phone size={15} className="stroke-[2.5]" />
                      <span>Pedir por WhatsApp (Entrega Inmediata)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(model)}
                      className={`w-full py-2.5 px-4 rounded-xl border text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        addedSku === model.sku 
                          ? 'bg-emerald-500 border-emerald-400 text-stone-950' 
                          : 'bg-stone-900 border-stone-700 hover:border-amber-400 text-stone-200'
                      }`}
                    >
                      <ShoppingCart size={14} />
                      <span>{addedSku === model.sku ? "¡Agregado al Carrito!" : "Añadir a la Tienda"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── TABLA COMPARATIVA TÉCNICA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-stone-800">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-widest">
            COMPARATIVA DIRECTA
          </span>
          <h3 className="text-xl sm:text-3xl font-heading font-black text-white uppercase">
            ¿Qué Modelo se Ajusta Mejor a tu Puerta?
          </h3>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-stone-800 bg-[#080d19] shadow-xl">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-[#0e1628] border-b border-stone-800 text-stone-400 text-[11px] uppercase">
                <th className="p-4 sm:p-5">Característica</th>
                <th className="p-4 sm:p-5 text-amber-400 font-bold">Facial 3D ($145)</th>
                <th className="p-4 sm:p-5 text-rose-400 font-bold">Tuya 5 Pistones ($89.80)</th>
                <th className="p-4 sm:p-5 text-orange-400 font-bold">Cámara Frontal ($91)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-300">
              <tr>
                <td className="p-4 font-bold text-white">Reconocimiento Facial 3D</td>
                <td className="p-4 text-emerald-400 font-bold">✓ Sí (HD 1080P Infrarrojo)</td>
                <td className="p-4 text-stone-500">✗ No</td>
                <td className="p-4 text-stone-500">✗ No</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Cámara Integrada / Videollamada</td>
                <td className="p-4 text-emerald-400 font-bold">✓ Videollamada Bidireccional</td>
                <td className="p-4 text-stone-500">✗ No</td>
                <td className="p-4 text-emerald-400 font-bold">✓ Sí (Cámara HD con Timbre)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Cantidad de Pistones de Bloqueo</td>
                <td className="p-4 font-bold text-white">5 Pistones Ultra Seguros</td>
                <td className="p-4 font-bold text-white">5 Pistones de Alta Seguridad</td>
                <td className="p-4 font-bold text-white">2 Pistones de Acero Templado</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Alarma Antisabotaje</td>
                <td className="p-4 text-emerald-400 font-bold">✓ Alerta en App</td>
                <td className="p-4 text-emerald-400 font-bold">✓ Sirena Sonora + Alerta App</td>
                <td className="p-4 text-emerald-400 font-bold">✓ Alerta en App</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Métodos de Apertura</td>
                <td className="p-4">Facial, Huella, Código, Tarjeta, Llave</td>
                <td className="p-4">Huella, Contraseña, Tarjeta, Llave, App</td>
                <td className="p-4">Huella, Contraseña, Tarjeta, Llave, App</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Tipo de Batería</td>
                <td className="p-4 text-amber-300 font-bold">Batería Litio Recargable Tipo-C</td>
                <td className="p-4">Pilas Alcalinas + Rescate USB</td>
                <td className="p-4">Pilas Alcalinas + Rescate USB</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Grosor de Puerta Apto</td>
                <td className="p-4">35 a 120 mm (Madera y Metal)</td>
                <td className="p-4">35 a 100 mm (Madera y Metal)</td>
                <td className="p-4">35 a 90 mm (Madera y Metal)</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-white">Garantía</td>
                <td className="p-4 text-emerald-400 font-bold">12 Meses Oficial</td>
                <td className="p-4 text-emerald-400 font-bold">12 Meses Oficial</td>
                <td className="p-4 text-emerald-400 font-bold">12 Meses Oficial</td>
              </tr>
              <tr className="bg-[#0a1122]">
                <td className="p-4 font-bold text-amber-300">Precio Final Oferta</td>
                <td className="p-4 text-xl font-heading font-black text-amber-400">$145.00</td>
                <td className="p-4 text-xl font-heading font-black text-rose-400">$89.80 Inc. IVA</td>
                <td className="p-4 text-xl font-heading font-black text-orange-400">$91.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── POLÍTICA DE ENVÍOS TRANSPARENTE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0b1326] via-[#090f1e] to-[#040812] border border-amber-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-widest">
                LOGÍSTICA & ENTREGAS A NIVEL NACIONAL
              </span>
              <h3 className="text-2xl font-heading font-black text-white uppercase mt-1">
                ¿Cómo Funciona la Entrega de tu Cerradura?
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                🚚 Despachos Activos Hoy
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Quito */}
            <div className="p-6 rounded-2xl bg-[#060a14] border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-heading font-bold text-base uppercase">
                <Truck size={20} />
                <span>Entrega Gratuita en Quito (Sin Costo Extra)</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                Si estás en Quito (Norte, Centro, Sur, Calderón, Carapungo o Valles como Cumbayá, Tumbaco y Los Chillos), 
                <strong> el envío es 100% GRATIS</strong>. Nuestro motorizado te entrega el producto empacado el mismo día o en menos de 24 horas. 
                Puedes cancelar contra entrega o por transferencia verificada.
              </p>
              <div className="pt-2 flex items-center gap-2 text-emerald-400 text-xs font-mono">
                <Check size={15} />
                <span>Opción de Pago Contra Entrega en Quito</span>
              </div>
            </div>

            {/* Resto del País */}
            <div className="p-6 rounded-2xl bg-[#060a14] border border-cyan-500/40 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-heading font-bold text-base uppercase">
                <MapPin size={20} />
                <span>Otras Ciudades de Ecuador (+ Valor Adicional)</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                Para ciudades como Guayaquil, Cuenca, Ambato, Manta, Machala, Santo Domingo, Ibarra o Loja, aplicamos un 
                <strong> valor adicional transparente de solo +$5.00 USD</strong> por concepto de guía asegurada mediante Servientrega 
                con número de rastreo directo a tu domicilio u oficina en 24 a 48 horas laborables.
              </p>
              <div className="pt-2 flex items-center gap-2 text-cyan-300 text-xs font-mono">
                <Check size={15} />
                <span>Empaque acolchado con sello de inviolabilidad</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ INTERACTIVO ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-widest">DUDAS FRECUENTES</span>
          <h3 className="text-2xl font-heading font-black text-white uppercase">Preguntas y Respuestas Rápidas</h3>
        </div>

        <div className="space-y-3">
          <div className="p-5 rounded-2xl bg-[#090f1d] border border-stone-800 space-y-1.5">
            <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
              <Key size={15} className="text-amber-400" />
              ¿Qué sucede si se acaba la batería de la cerradura?
            </h4>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              Nunca te quedarás afuera. Todas las cerraduras cuentan con 2 llaves mecánicas físicas de emergencia de alta seguridad y un puerto exterior micro-USB / Tipo-C para conectarle cualquier batería portátil (Power Bank) y energizarla al instante.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090f1d] border border-stone-800 space-y-1.5">
            <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
              <Lock size={15} className="text-amber-400" />
              ¿Es compatible con mi puerta actual?
            </h4>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              Sí. Son compatibles con puertas estándar de madera sólida, metal, hierro, aluminio y blindadas con grosor de 35 mm hasta 120 mm. El modelo es universal e invertible para apertura hacia la izquierda o hacia la derecha.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#090f1d] border border-stone-800 space-y-1.5">
            <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
              <Award size={15} className="text-amber-400" />
              ¿Quién realiza la instalación de la cerradura?
            </h4>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              Las cerraduras incluyen plantilla de perforación a escala 1:1 y manual paso a paso para carpinteros o cerrajeros. Además, en Quito contamos con servicio de instalación profesional técnica coordinada directamente por ATOMIC si así lo deseas.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-stone-800 bg-[#04060c] py-10 px-4 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="text-stone-400 font-bold">
            © {new Date().getFullYear()} ATOMIC • Cerraduras Inteligentes Ecuador • Entrega Inmediata
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-400">
            <Link href="/web" className="hover:text-amber-300 transition-colors">Tienda Oficial</Link>
            <span>•</span>
            <Link href="/web/cerraduras-smart" className="hover:text-amber-300 transition-colors">Kits con Instalación</Link>
            <span>•</span>
            <Link href="/web/anker-solix" className="hover:text-amber-300 transition-colors">Generador Anker SOLIX</Link>
            <span>•</span>
            <Link href="/web/cart" className="hover:text-amber-300 transition-colors">Ver Carrito</Link>
          </div>
          <p className="text-[11px] text-stone-600">
            Carapungo, Quito - Ecuador • Soporte WhatsApp: 098 031 9050
          </p>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════════════
          POP FLOTANTE PERSISTENTE: SELECCIÓN RÁPIDA & OFERTA DE FIN DE AÑO
          (Acompaña al usuario en todo el recorrido de la página)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <aside 
        aria-label="Oferta Cerraduras Fin de Año"
        className="fixed bottom-4 right-4 z-50 transition-all duration-300 max-w-[360px] w-[calc(100vw-32px)]"
      >
        {isFloatingMinimized ? (
          <button
            type="button"
            onClick={() => setIsFloatingMinimized(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black text-xs uppercase tracking-wider font-mono shadow-[0_0_25px_rgba(245,158,11,0.5)] border-2 border-white hover:scale-105 transition-transform ml-auto cursor-pointer"
          >
            <Lock size={15} />
            <span>OFERTA CERRADURAS (DESDE $89.80)</span>
            <ChevronRight size={14} />
          </button>
        ) : (
          <div className="rounded-3xl bg-[#091122]/95 backdrop-blur-xl border-2 border-amber-500/80 p-4 shadow-[0_0_35px_rgba(245,158,11,0.35)] space-y-3 relative text-stone-100">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[10px] font-mono font-black uppercase text-amber-300 tracking-wider">
                  OFERTA DE FINAL DE AÑO
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsFloatingMinimized(true)}
                className="w-5 h-5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Minimizar"
              >
                ✕
              </button>
            </div>

            {/* Model Selector Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl text-[10px] font-mono text-center">
              {CERRADURAS_MODELS.map((m, idx) => (
                <button
                  key={m.sku}
                  type="button"
                  onClick={() => setSelectedProductIndex(idx)}
                  className={`py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    selectedProductIndex === idx 
                      ? 'bg-amber-400 text-stone-950 shadow' 
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  ${m.price.toFixed(0)}
                </button>
              ))}
            </div>

            {/* Selected Product Snapshot */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black border border-amber-500/40 shrink-0">
                <Image
                  src={currentProduct.image}
                  alt={currentProduct.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 font-mono">
                <h4 className="text-[11px] font-black text-white truncate">
                  {currentProduct.title}
                </h4>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[10px] text-stone-400 line-through">
                    ${currentProduct.regularPrice.toFixed(0)}
                  </span>
                  <span className="text-lg font-black text-amber-400">
                    ${currentProduct.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* City Badge */}
            <div className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 border ${
              selectedCity.isFree 
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300' 
                : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
            }`}>
              <Truck size={13} />
              <span>
                {selectedCity.isFree 
                  ? "¡Entrega GRATIS en Quito Hoy!" 
                  : `Envío a ${selectedCity.name.split(' ')[0]} (+${shippingCost.toFixed(2)} USD)`}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleAddToCart(currentProduct)}
                className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 font-mono font-bold text-[10px] uppercase flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingCart size={13} />
                <span>Al Carrito</span>
              </button>

              <button
                type="button"
                onClick={() => handleWhatsAppBuy(currentProduct)}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-stone-950 font-mono font-black text-[10px] uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Phone size={13} className="stroke-[2.5]" />
                <span>WhatsApp</span>
              </button>
            </div>

          </div>
        )}
      </aside>

    </div>
  )
}
