"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Zap, ShieldCheck, Sparkles, ShoppingCart, Phone, ArrowRight, 
  CheckCircle2, Sun, VolumeX, BatteryCharging, Truck, Clock, 
  Award, Cpu, Home, Laptop, Tent, HeartPulse, ChevronRight, 
  Lightbulb, Tv, Wifi, Check, X, Tag, AlertTriangle, Layers,
  Compass, Radio, Flame, Shield, MapPin, Gauge
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
}

export default function AnkerSolixClient({ dbProduct }: { dbProduct: DbProduct | null }) {
  const { addToCart } = useCart()
  const [addedItem, setAddedItem] = useState<boolean>(false)
  const [activeImage, setActiveImage] = useState<number>(0)
  const [activeUseCase, setActiveUseCase] = useState<number>(0)
  const [activeAppliance, setActiveAppliance] = useState<number>(0)
  const [isFloatingPopMinimized, setIsFloatingPopMinimized] = useState<boolean>(false)

  // Pricing from user request
  const regularPrice = 420.00
  const offerPrice = 380.00
  const savings = regularPrice - offerPrice // $40 OFF

  const officialPhone = "593980319050"
  const formattedPhone = "098 031 9050"

  const IMAGES = [
    {
      src: "/images/anker-solix/anker-solix-c300-hero-hogar.jpg",
      title: "Generador 100% Eléctrico Anker SOLIX C300 en Terraza",
      alt: "Anker SOLIX C300 Respaldo Eléctrico Hogar"
    },
    {
      src: "/images/anker-solix/anker-solix-c300-precios-specs.jpg",
      title: "Anker C300 Autonomía Total & Acabado Titanium",
      alt: "Anker SOLIX C300 Puertos y Pantalla Inteligente"
    },
    {
      src: "/images/anker-solix/anker-solix-c300-blueprint-specs.jpg",
      title: "Blueprint Técnico y Medidas Milimétricas",
      alt: "Anker SOLIX C300 Blueprint 235x135x302 mm"
    },
    {
      src: "/images/anker-solix/anker-solix-c300-strap-white.jpg",
      title: "Diseño Portátil con Correa de Hombro Incluida",
      alt: "Anker SOLIX C300 con Correa Bandolera"
    }
  ]

  const APPLIANCES = [
    { name: "Router WiFi / Fibra", watts: 10, icon: <Wifi size={18} />, hours: "24 a 28 horas", note: "Internet continuo durante todo el apagón" },
    { name: "Laptop / MacBook Pro", watts: 45, icon: <Laptop size={18} />, hours: "5 a 6 recargas", note: "Carga rápida vía USB-C 140W bidireccional" },
    { name: "Smart TV 43\" LED", watts: 60, icon: <Tv size={18} />, hours: "4 a 4.5 horas", note: "Sin ruido de motor ni interrupción de señal" },
    { name: "Máquina CPAP Médica", watts: 30, icon: <HeartPulse size={18} />, hours: "8 a 9 horas", note: "Noche completa de descanso 100% silencioso" },
    { name: "Bombillo / Lámpara LED", watts: 8, icon: <Lightbulb size={18} />, hours: "Más de 32 horas", note: "Iluminación esencial de sala o consultorio" },
    { name: "Mini Nevera / Cooler 12V", watts: 40, icon: <Gauge size={18} />, hours: "6 a 7 horas", note: "Conserva medicamentos o alimentos frescos" }
  ]

  const USE_CASES = [
    {
      id: "hogar-apagones",
      title: "Respaldo Contra Apagones en el Hogar",
      icon: <Home className="text-amber-400" size={20} />,
      tag: "EMERGENCIAS RESIDENCIALES",
      headline: "Continúa tu vida sin darte cuenta de que se fue la luz.",
      desc: "A diferencia de los ruidosos generadores a gasolina que despiden monóxido de carbono venenoso, el Anker SOLIX C300 es 100% eléctrico y silencioso (<25 dB). Puedes tenerlo sobre la mesa de la sala o al lado de tu cama sin olores, humos ni molestias.",
      points: [
        "Mantiene tu Router WiFi encendido por más de 24 horas ininterrumpidas.",
        "Alimenta tu televisor, computadoras y lámparas con 3 salidas AC 110V de onda senoidal pura.",
        "Barra de luz LED ambiental integrada en el chasis para iluminar la habitación de inmediato.",
        "Activa el modo de protección UPS para conmutación casi instantánea."
      ]
    },
    {
      id: "trabajo-remoto",
      title: "Teletrabajo, Oficina & Creadores",
      icon: <Laptop className="text-cyan-400" size={20} />,
      tag: "PRODUCTIVIDAD NON-STOP",
      headline: "Cero reuniones caídas. Cero proyectos perdidos.",
      desc: "Equipado con un puerto USB-C bidireccional de 140W (Power Delivery 3.1), capaz de alimentar al 100% de velocidad incluso la MacBook Pro de 16 pulgadas más exigente. Cuenta además con 2 puertos USB-C adicionales de 100W y tomas AC para pantallas secundarias.",
      points: [
        "Puerto USB-C de 140W PD 3.1: recarga tu laptop a máxima velocidad.",
        "Alimenta simultáneamente laptop, teléfono, tablet, cámara y monitor externo.",
        "Display inteligente LCD con indicación en tiempo real de minutos restantes de batería.",
        "Se recarga del 0 al 80% en apenas 50 minutos conectado a la pared o vía USB-C."
      ]
    },
    {
      id: "camping-outdoor",
      title: "Camping, Viajes & Fotografía Outdoor",
      icon: <Tent className="text-emerald-400" size={20} />,
      tag: "AVENTURA & MOVILIDAD",
      headline: "Lleva un enchufe de pared a cualquier rincón de la naturaleza.",
      desc: "Con solo 4.1 kg y su correa para hombro incluida, el C300 es la estación de energía más portátil de su clase. Conéctale un panel solar de hasta 100W y obtén energía ilimitada y gratuita en la montaña, playa o carretera.",
      points: [
        "Correa de hombro reforzada para transportarlo con una sola mano.",
        "Recarga solar rápida hasta 100W (recarga completa en 3.2 horas de sol).",
        "Toma vehicular de 12V para infladores de llantas, mini neveras de camping y proyectores.",
        "Luz frontal con modo baliza SOS para emergencias nocturnas."
      ]
    },
    {
      id: "salud-cpap",
      title: "Salud, CPAP & Equipamiento Sensible",
      icon: <HeartPulse className="text-red-400" size={20} />,
      tag: "EQUIPOS CRÍTICOS & CPAP",
      headline: "Tranquilidad para pacientes con apnea del sueño y medicación.",
      desc: "Los pacientes dependientes de máquinas CPAP no pueden arriesgarse a interrupciones eléctricas nocturnas. El Anker SOLIX C300 entrega onda senoidal pura idéntica a la red de casa, cuidando los motores sensibles con cero ruido.",
      points: [
        "Onda senoidal pura 110V que no daña motores delicados ni compresores.",
        "Operación inaudible que permite un sueño profundo sin ruidos mecánicos.",
        "Baterías de química LiFePO4: químicamente estables, no explotan ni se incendian.",
        "Garantía oficial de 3 años con servicio técnico local."
      ]
    }
  ]

  const handleAddToCart = () => {
    addToCart({
      id: dbProduct?.id || "anker-solix-c300-promo",
      name: "Generador Eléctrico Anker SOLIX C300 (288Wh • 300W • LiFePO4)",
      price: offerPrice,
      quantity: 1,
      image: "/images/anker-solix/anker-solix-c300-hero-hogar.jpg"
    })
    setAddedItem(true)
    setTimeout(() => setAddedItem(false), 2500)
  }

  const handleWhatsAppBuy = () => {
    const msg = `Hola ATOMIC, deseo comprar el GENERADOR ELÉCTRICO ANKER SOLIX C300 con la OFERTA de $380 (Precio normal $420) y ENTREGA TOTALMENTE GRATIS EN QUITO. ¿Tienen disponible para entrega hoy mismo?`
    window.open(`https://wa.me/${officialPhone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-stone-100 font-sans selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      
      {/* ── AMBIENT ARCHITECTURAL LIGHTING (WARM GOLD & ELECTRIC TEAL) ── */}
      <div className="fixed inset-0 bg-[radial-gradient(#151e2e_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />
      <div className="fixed -top-40 left-1/3 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[240px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[220px] pointer-events-none" />

      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="relative z-50 bg-gradient-to-r from-[#17140b] via-[#2d240d] to-[#17140b] border-b border-amber-500/40 text-amber-300 px-4 py-2.5 text-center text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm">
        <Sparkles size={14} className="text-yellow-400 animate-pulse" />
        <span>OFERTA ESPECIAL: $380 (REGULAR $420) • EN QUITO LA ENTREGA ES TOTALMENTE GRATIS • GARANTÍA HASTA 3 AÑOS</span>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-2xl border-b border-stone-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 via-yellow-600 to-stone-900 border border-amber-400/50 flex items-center justify-center text-stone-950 font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform">
              <Zap size={22} className="fill-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl font-black tracking-tight text-white uppercase font-sans">ANKER</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 uppercase font-mono">
                  SOLIX C300
                </span>
              </div>
              <p className="text-[10px] text-amber-300/80 font-bold tracking-widest uppercase mt-0.5 font-mono">
                Generador 100% Eléctrico • Respaldo Hogar
              </p>
            </div>
          </Link>

          {/* Quick Direct Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
              <Truck size={14} className="text-emerald-400" />
              <span>Entrega Gratis en Quito</span>
            </div>

            <a
              href={`https://wa.me/${officialPhone}?text=${encodeURIComponent('Hola ATOMIC, deseo comprar el Anker SOLIX C300 en oferta a $380 con Entrega Gratis en Quito.')}`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f172a] border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-mono font-bold transition-all"
            >
              <Phone size={14} className="text-amber-400" />
              <span>{formattedPhone}</span>
            </a>

            <Link
              href="/web/cart"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f172a] border border-stone-800 hover:border-amber-500 text-stone-200 text-xs font-mono transition-all"
            >
              <ShoppingCart size={15} className="text-amber-400" />
              <span className="hidden sm:inline">Carrito</span>
            </Link>

            <Link
              href="/web"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-stone-950 text-xs font-black uppercase tracking-wider font-mono transition-all shadow-md"
            >
              Tienda General
            </Link>
          </div>

        </div>
      </header>

      {/* ── HERO BANNER: GENERADORES 100% ELÉCTRICOS CON BATERÍAS ── */}
      <section className="relative pt-10 pb-14 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Sales Copy & Official Offer Badges */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Truck size={13} />
                <span>En Quito la Entrega es Totalmente Gratis</span>
              </span>

              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={13} />
                <span>Garantía hasta 3 Años</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans leading-[1.05]">
              Generadores 100% Eléctricos <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                con Baterías LiFePO4
              </span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              <strong>Revoluciona el respaldo energético de tu hogar.</strong> Protege lo que más importa con energía limpia, 100% silenciosa y confiable. Olvídate de la gasolina apestosa, los motores ruidosos y el peligro del monóxido de carbono en interiores.
            </p>

            {/* Price Cards Highlight Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#17140b] via-[#1f1b0f] to-[#121008] border-2 border-amber-500/50 shadow-xl space-y-3">
              <div className="flex items-baseline justify-between flex-wrap gap-2 border-b border-amber-500/30 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-stone-400 line-through block">
                    Precio Regular: $420.00 USD
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono">
                      $380
                    </span>
                    <span className="text-sm font-black text-stone-300 font-mono">USD Oferta Especial</span>
                    <span className="text-xs bg-red-600 text-white font-mono font-black px-2 py-0.5 rounded-full shadow-md">
                      -$40 OFF
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                    Beneficio Exclusivo:
                  </span>
                  <span className="text-xs font-mono font-black text-white bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700 inline-block mt-0.5">
                    🚚 FLETE $0.00 EN QUITO
                  </span>
                </div>
              </div>

              {/* Quick specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono text-stone-300">
                <div className="flex items-center gap-1.5">
                  <VolumeX size={14} className="text-amber-400 shrink-0" />
                  <span>0 dB Silencioso</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sun size={14} className="text-amber-400 shrink-0" />
                  <span>Solar 100W</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu size={14} className="text-amber-400 shrink-0" />
                  <span>140W USB-C</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-amber-400 shrink-0" />
                  <span>3 Años Garantía</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider font-mono transition-all cursor-pointer shadow-lg active:scale-95 ${
                  addedItem 
                    ? 'bg-emerald-500 text-stone-950'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-stone-950 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                }`}
              >
                <ShoppingCart size={16} />
                <span>{addedItem ? "¡Añadido al Carrito!" : "Comprar Ahora por $380"}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppBuy}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider font-mono transition-all cursor-pointer"
              >
                <Phone size={15} className="text-amber-400" />
                <span>Pedir por WhatsApp (Entrega Gratis)</span>
              </button>
            </div>

          </div>

          {/* Right Column: Interactive Image Gallery */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] bg-[#0d111a] aspect-square group">
              <Image
                src={IMAGES[activeImage].src}
                alt={IMAGES[activeImage].alt}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/20" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider font-mono shadow-md">
                  ANKER SOLIX C300 • 288Wh
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-[#07090e]/90 backdrop-blur-md border border-amber-900/60 text-left">
                <p className="text-xs font-black text-white uppercase font-sans">
                  {IMAGES[activeImage].title}
                </p>
                <span className="text-[10px] text-amber-400 font-mono block mt-0.5">
                  Haz clic en las miniaturas de abajo para rotar vistas
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === idx
                      ? 'border-amber-400 scale-105 shadow-md'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img.src} alt={img.title} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 1: EN QUITO LA ENTREGA ES TOTALMENTE GRATIS (DESTACADO OBLIGATORIO)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/70 via-[#0a2318] to-emerald-950/70 border-2 border-emerald-500/50 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500 text-stone-950 text-[10px] font-mono font-black uppercase tracking-wider">
                <Truck size={13} />
                <span>BENEFICIO EXCLUSIVO CAPITALINO</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
                En Quito la Entrega es Totalmente Gratis
              </h2>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Te entregamos tu Anker SOLIX C300 directamente en la puerta de tu domicilio u oficina en <strong>Quito Norte, Centro, Sur y Valles (Cumbayá, Tumbaco, Los Chillos, Carapungo, Calderón)</strong> sin ningún costo de envío. Puedes pagar al momento de recibir o mediante transferencia bancaria.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-center md:items-end justify-center gap-3">
              <button
                type="button"
                onClick={handleWhatsAppBuy}
                className="w-full sm:w-auto md:w-full px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider font-mono shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Phone size={15} className="stroke-[2.5]" />
                <span>Coordinar Entrega Gratis en Quito</span>
              </button>
              <span className="text-[10px] font-mono text-emerald-300">
                ✓ Despacho el mismo día si pides antes de las 4 PM
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 2: CASOS DE USO REALES & VENTAJAS
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto border-t border-stone-800">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-amber-400 text-xs font-mono uppercase tracking-widest font-black">
            Versatilidad Absoluta • 300W Potencia & 288Wh
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1 font-sans">
            ¿En Qué Situaciones Revoluciona Tu Día a Día?
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            Diseñado para respaldar tus electrodomésticos y dispositivos de trabajo sin complicaciones ni mantenimiento.
          </p>
        </div>

        {/* Use-Case Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {USE_CASES.map((uc, idx) => (
            <button
              key={uc.id}
              type="button"
              onClick={() => setActiveUseCase(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeUseCase === idx
                  ? 'bg-amber-400 text-stone-950 shadow-lg scale-105 font-black'
                  : 'bg-[#0f172a] hover:bg-[#1a253f] text-stone-300 border border-slate-800'
              }`}
            >
              {uc.icon}
              <span>{uc.title}</span>
            </button>
          ))}
        </div>

        {/* Active Use-Case Display */}
        {(() => {
          const uc = USE_CASES[activeUseCase]
          return (
            <div className="rounded-3xl bg-[#0c1322] border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider border border-amber-500/30">
                  <span>{uc.tag}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
                  {uc.headline}
                </h3>

                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                  {uc.desc}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  {uc.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-stone-300">
                      <CheckCircle2 size={15} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-slate-700">
                <Image
                  src={IMAGES[activeUseCase % IMAGES.length].src}
                  alt={uc.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-md text-[11px] font-mono text-amber-300 border border-slate-700">
                  💡 Autonomía limpia de 288Wh para {uc.title}
                </div>
              </div>

            </div>
          )
        })()}

      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 3: SIMULADOR DE AUTONOMÍA DE ARTEFACTOS
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto border-t border-stone-800">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#09101d] to-[#0c1424] border border-cyan-500/30 shadow-2xl">
          
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-8">
            <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest font-black">
              Cálculo Real de Consumo • Batería de 288Wh
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
              ¿Cuánto Tiempo Funciona Cada Artefacto?
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm">
              Haz clic en tus aparatos cotidianos para ver las horas exactas de funcionamiento continuo con el C300.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {APPLIANCES.map((app, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveAppliance(idx)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                  activeAppliance === idx
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg scale-105'
                    : 'bg-[#060c18] border-slate-800 text-stone-400 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#0e172a] flex items-center justify-center text-cyan-400 mb-2">
                  {app.icon}
                </div>
                <span className="text-[11px] font-bold block uppercase leading-tight font-sans">
                  {app.name}
                </span>
                <span className="text-[10px] text-stone-500 font-mono mt-1">
                  ~{app.watts}W
                </span>
              </button>
            ))}
          </div>

          {/* Active Appliance Feature Box */}
          {(() => {
            const app = APPLIANCES[activeAppliance]
            return (
              <div className="p-6 rounded-2xl bg-[#060b17] border border-cyan-900 text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                  {app.name} ({app.watts} Watts de Consumo)
                </span>
                <div className="text-4xl sm:text-5xl font-black text-white font-mono">
                  {app.hours}
                </div>
                <p className="text-xs text-stone-300 font-mono">
                  {app.note}
                </p>
              </div>
            )
          })()}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 4: BLUEPRINT TÉCNICO & 8 PUERTOS VERSÁTILES
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto border-t border-stone-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-black border-2 border-slate-700 shadow-2xl">
            <Image
              src="/images/anker-solix/anker-solix-c300-blueprint-specs.jpg"
              alt="Anker SOLIX C300 Blueprint Dimensiones"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-amber-400 text-xs font-mono uppercase tracking-widest font-black">
                Medidas & Conectores
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans mt-0.5">
                8 Puertos Versátiles & Carga Rápida 140W
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 leading-relaxed">
                Diseño compacto ultra-premium: mide solo <strong>23.5 cm de ancho × 13.5 cm de fondo × 30.2 cm de alto</strong>. Ocupa menos espacio que una cafetera y puedes alimentarlo con paneles solares, tomacorriente de pared o cargador de auto.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-slate-800">
                <span className="text-amber-400 font-bold block">3 Salidas AC 110V</span>
                <span className="text-stone-300 text-[11px]">300W continuos (600W SurgePad para electrodomésticos)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-slate-800">
                <span className="text-cyan-400 font-bold block">1 USB-C Bidireccional 140W</span>
                <span className="text-stone-300 text-[11px]">Power Delivery 3.1 para recargar laptops a full velocidad</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-slate-800">
                <span className="text-blue-400 font-bold block">2 USB-C 100W + 1 USB-A</span>
                <span className="text-stone-300 text-[11px]">Carga teléfonos, tablets y cámaras al mismo tiempo</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-slate-800">
                <span className="text-emerald-400 font-bold block">Recarga Solar hasta 100W</span>
                <span className="text-stone-300 text-[11px]">Puerto XT60 para paneles solares portátiles en camping</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-stone-950 font-black text-xs uppercase tracking-wider font-mono shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingCart size={15} />
                <span>Comprar Anker C300 por $380 (Normal $420)</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-12 border-t border-stone-800 bg-[#04060a] py-8 px-4 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ATOMIC • Distribución Anker SOLIX C300 Ecuador.</p>
          <div className="flex items-center gap-4">
            <Link href="/web" className="hover:text-amber-300 transition-colors">Tienda Oficial</Link>
            <span>•</span>
            <Link href="/web/gaming" className="hover:text-amber-300 transition-colors">ATOMIC Gaming</Link>
            <span>•</span>
            <Link href="/web/1hora" className="hover:text-amber-300 transition-colors">1Hora Powerbanks</Link>
            <span>•</span>
            <Link href="/web/cart" className="hover:text-amber-300 transition-colors">Carrito</Link>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════════════
          POP FLOTANTE PERSISTENTE: OFERTA $380 / REGULAR $420 + ENTREGA GRATIS QUITO
          (Sigue al usuario a todas partes de la página)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <aside 
        aria-label="Oferta Flotante Anker SOLIX C300"
        className="fixed bottom-4 right-4 z-50 transition-all duration-300 max-w-[360px] w-[calc(100vw-32px)]"
      >
        {isFloatingPopMinimized ? (
          // Minimized Floating Pill
          <button
            type="button"
            onClick={() => setIsFloatingPopMinimized(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black text-xs uppercase tracking-wider font-mono shadow-[0_0_25px_rgba(245,158,11,0.5)] border-2 border-white hover:scale-105 transition-transform ml-auto cursor-pointer"
          >
            <Zap size={15} className="fill-stone-950" />
            <span>OFERTA $380 (Normal $420)</span>
            <ChevronRight size={14} />
          </button>
        ) : (
          // Expanded High-Conversion Floating Card
          <div className="rounded-3xl bg-[#0c1424]/95 backdrop-blur-xl border-2 border-amber-500/80 p-4 shadow-[0_0_40px_rgba(245,158,11,0.35)] space-y-3 relative text-stone-100">
            
            {/* Header with Minimize Button */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[10px] font-mono font-black uppercase text-amber-300 tracking-wider">
                  OFERTA ESPECIAL ACTIVA
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsFloatingPopMinimized(true)}
                className="w-5 h-5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Minimizar pop flotante"
              >
                ✕
              </button>
            </div>

            {/* Product Snapshot & Prices */}
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-black border border-amber-500/40 shrink-0">
                <Image
                  src="/images/anker-solix/anker-solix-c300-hero-hogar.jpg"
                  alt="Anker SOLIX C300"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 font-mono">
                <h4 className="text-xs font-black text-white uppercase truncate">
                  Anker SOLIX C300 (288Wh)
                </h4>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-[11px] text-stone-400 line-through">
                    ${regularPrice.toFixed(0)}
                  </span>
                  <span className="text-xl font-black text-amber-400">
                    ${offerPrice.toFixed(0)}
                  </span>
                  <span className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded">
                    -$40 OFF
                  </span>
                </div>
              </div>
            </div>

            {/* Gratis Quito Badge */}
            <div className="px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold flex items-center justify-center gap-1.5">
              <Truck size={13} className="text-emerald-400 shrink-0" />
              <span>¡En Quito la Entrega es Totalmente Gratis!</span>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-black text-[11px] uppercase tracking-wider font-mono transition-all cursor-pointer ${
                  addedItem
                    ? 'bg-emerald-500 text-stone-950 shadow-md'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600'
                }`}
              >
                <ShoppingCart size={13} />
                <span>{addedItem ? "¡Listo!" : "Al Carrito"}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppBuy}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-stone-950 font-black text-[11px] uppercase tracking-wider font-mono shadow-md transition-all cursor-pointer"
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
