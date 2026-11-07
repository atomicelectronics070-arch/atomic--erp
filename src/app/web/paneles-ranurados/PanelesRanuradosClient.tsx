"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Sparkles, CheckCircle2, ArrowRight, Phone, ShoppingCart, 
  ExternalLink, ShieldCheck, MapPin, Truck, Ruler, Layers, 
  Droplet, Flame, Sun, Hammer, Check, Calculator, Eye, HelpCircle,
  Home, Building, Palette, Star, ChevronRight, Gem, Tag
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

interface ProductItem {
  id: string
  sku: string
  categoryType: 'wpc' | 'pvc' | 'combo'
  name: string
  subtitle: string
  badge: string
  price: number
  regularPrice: number
  image: string
  dimensions: string
  tagColor: string
  idealFor: string
  description: string
  benefits: string[]
  whatsappMsg: string
}

export default function PanelesRanuradosClient({ initialProducts }: { initialProducts: DbProduct[] }) {
  const { addToCart } = useCart()
  const [addedItem, setAddedItem] = useState<string | null>(null)
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'wpc' | 'pvc' | 'combo'>('all')
  
  // Interactive Wall Calculator State
  const [calcProductType, setCalcProductType] = useState<'wpc' | 'pvc'>('wpc')
  const [wallWidthMeters, setWallWidthMeters] = useState<number>(3.2)
  
  // WPC = 16cm (0.16m), $9.09
  // PVC = 1.22m, $29.00
  const unitWidth = calcProductType === 'wpc' ? 0.16 : 1.22
  const unitPrice = calcProductType === 'wpc' ? 9.09 : 29.00
  const unitsNeeded = Math.ceil(wallWidthMeters / unitWidth)
  const calculatedTotal = (unitsNeeded * unitPrice).toFixed(2)

  // Official contact from user banners
  const officialPhone = "593980319050"
  const formattedPhone = "098 031 9050"

  const ALL_PRODUCTS: ProductItem[] = [
    // ── LÍNEA 1: PANELES RANURADOS WPC ──
    {
      id: "cmw6rprh70002jtatw5h4oocv",
      sku: "WPC-PANEL-NEGRO",
      categoryType: 'wpc',
      name: "Panel Ranurado WPC Color Negro",
      subtitle: "Negro Mate Modernista / Dark Slate",
      badge: "MÁXIMA ELEGANCIA & LUJO",
      price: 9.09,
      regularPrice: 14.50,
      image: "/images/paneles-wpc/panel-wpc-negro.jpg",
      dimensions: "2.90m alto × 16cm ancho",
      tagColor: "bg-stone-900 text-stone-200 border-stone-700",
      idealFor: "Paredes de TV (Media Walls), salas modernas, dormitorios principales y oficinas ejecutivas.",
      description: "Acabado negro mate texturizado de vanguardia. Crea un contraste visual espectacular con muebles de madera clara, sofás beige y tiras de iluminación LED indirecta.",
      benefits: [
        "100% impermeable y resistente al vapor (no se hincha ni deforma)",
        "Longitud arquitectónica de 2.90m: cubre de piso a techo sin uniones visibles",
        "Alta durabilidad ante roces, impactos y humedad ambiente",
        "Material ecológico WPC retardante de llama y cero mantenimiento"
      ],
      whatsappMsg: "Hola ATOMIC, deseo cotizar Paneles Ranurados WPC COLOR NEGRO (2.90m x 16cm) a $9.09. ¿Tienen stock para retiro en Carapungo?"
    },
    {
      id: "cmw6rpser0004jtattbz901l1",
      sku: "WPC-PANEL-BICOLOR",
      categoryType: 'wpc',
      name: "Panel Ranurado WPC Bicolor Madera",
      subtitle: "Bicolor Teca & Nogal Veteado Natural",
      badge: "CALIDEZ ORGÁNICA NATURAL",
      price: 9.09,
      regularPrice: 14.50,
      image: "/images/paneles-wpc/panel-wpc-bicolor-madera.jpg",
      dimensions: "2.90m alto × 16cm ancho",
      tagColor: "bg-amber-950 text-amber-200 border-amber-800",
      idealFor: "Comedores, recepciones, dormitorios, pasillos de ingreso y locales comerciales acogedores.",
      description: "Patrón bicolor con vetas orgánicas de madera noble sobre fondo oscuro. Brinda la calidez del listón de madera natural sin necesidad de lijado ni barniz.",
      benefits: [
        "Veteado hiperrealista con textura háptica de madera real",
        "Protección UV que conserva el tono cálido con los años",
        "Inmune a polillas, humedad, salitre y hongos",
        "Instalación limpia y rápida con clips invisibles"
      ],
      whatsappMsg: "Hola ATOMIC, me interesan los Paneles Ranurados WPC BICOLOR MADERA a $9.09. ¿Cuál es la dirección en Carapungo para retirar?"
    },
    {
      id: "cmw6rptb40006jtato3inqzrm",
      sku: "WPC-PANEL-CAFE",
      categoryType: 'wpc',
      name: "Panel Ranurado WPC Color Café Cálido",
      subtitle: "Café Tostado / Roble Nórdico",
      badge: "ESTILO JAPANDI & NÓRDICO",
      price: 9.09,
      regularPrice: 14.50,
      image: "/images/paneles-wpc/panel-wpc-cafe.jpg",
      dimensions: "2.90m alto × 16cm ancho",
      tagColor: "bg-amber-900 text-amber-100 border-amber-700",
      idealFor: "Salas de estar, cabeceras de cama, barras de cocina y cafeterías boutique.",
      description: "Tono café cálido refinado que armoniza espacios contemporáneos. Absorbe reverberaciones acústicas y crea ambientes acogedores y serenos.",
      benefits: [
        "Aislamiento acústico que absorbe ecos en habitaciones amplias",
        "Resistente a la humedad y vapor de agua",
        "Se corta fácilmente con sierra de mano o caladora",
        "Superficie lavable con paño húmedo y jabón suave"
      ],
      whatsappMsg: "Hola ATOMIC, deseo comprar Paneles Ranurados WPC COLOR CAFÉ por $9.09 el panel. ¿Cuánto cuesta el despacho a mi dirección?"
    },

    // ── LÍNEA 2: PLANCHAS PVC ESTILO MÁRMOL ──
    {
      id: "pvc-mar-neg-27",
      sku: "PVC-MAR-NEG-27",
      categoryType: 'pvc',
      name: "Plancha PVC Estilo Mármol Negro Marquina",
      subtitle: "Acabado Negro Brillante con Vetas Blancas & Oro",
      badge: "PRECIO DE LIQUIDACIÓN: $27.00",
      price: 27.00,
      regularPrice: 38.00,
      image: "/images/paneles-wpc/plancha-pvc-marmol-negro-liquidacion.jpg",
      dimensions: "1.22m ancho × 2.44m alto",
      tagColor: "bg-red-950 text-red-200 border-red-700",
      idealFor: "Muros de impacto en salas de estar, baños modernos de lujo y centros de TV.",
      description: "Plancha arquitectónica de PVC con brillo espejo efecto mármol Negro Marquina. Precio de liquidación exclusivo ATOMIC. 100% impermeable y liviana.",
      benefits: [
        "Precio especial de liquidación $27.00 por plancha de 1.22m",
        "Superficie de alto brillo ultra resistente a rayones y humedad",
        "Instalación limpia sin polvo de picar paredes: se pega directamente",
        "Fácil de limpiar con limpiavidrios o agua jabonosa"
      ],
      whatsappMsg: "Hola ATOMIC, quiero aprovechar la LIQUIDACIÓN de la Plancha PVC Estilo Mármol Negro Marquina a $27.00. ¿Tienen stock disponible?"
    },
    {
      id: "pvc-mar-bla-29",
      sku: "PVC-MAR-BLA-29",
      categoryType: 'pvc',
      name: "Plancha PVC Estilo Mármol Blanco Carrara Veteado Oro",
      subtitle: "Fondo Blanco Puro con Veteado Cálido Dorado",
      badge: "TOP VENTAS EN SALAS",
      price: 29.00,
      regularPrice: 42.00,
      image: "/images/paneles-wpc/plancha-pvc-marmol-blanco-dorado.jpg",
      dimensions: "1.22m ancho × 2.44m alto",
      tagColor: "bg-amber-950 text-amber-200 border-amber-800",
      idealFor: "Muros principales de salas, centros multimedia de TV y halls de entrada.",
      description: "La lámina decorativa más solicitada. Replica fielmente los bloques de mármol Carrara con sutiles vetas doradas que reflejan la luz natural y aportan sofisticación inmediata.",
      benefits: [
        "Acabado vitrificado de lujo con vetas doradas luminosas",
        "Resistente a la humedad y cambios bruscos de temperatura",
        "Combina perfectamente al centro con paneles ranurados WPC laterales",
        "Despacho directo desde bodega Carapungo"
      ],
      whatsappMsg: "Hola ATOMIC, me interesa la Plancha PVC Estilo Mármol Blanco Carrara con vetas doradas a $29.00. ¿Cómo coordino la entrega?"
    },
    {
      id: "pvc-mar-dor-29",
      sku: "PVC-MAR-DOR-29",
      categoryType: 'pvc',
      name: "Plancha PVC Estilo Mármol Blanco Dormitorio",
      subtitle: "Blanco Estatuario de Grano Fino",
      badge: "IDEAL RESPALDOS & SUITES",
      price: 29.99,
      regularPrice: 44.00,
      image: "/images/paneles-wpc/plancha-pvc-marmol-blanco-dormitorio.jpg",
      dimensions: "1.22m ancho × 2.44m alto",
      tagColor: "bg-stone-900 text-stone-200 border-stone-700",
      idealFor: "Respaldos de cama, habitaciones de hotel, vestidores y suites principales.",
      description: "Diseño sobrio y elegante de mármol blanco estatuario que brinda serenidad y amplitud visual en dormitorios y áreas de descanso.",
      benefits: [
        "Acabado antibacteriano no poroso que evita ácaros y hongos",
        "Ligero y seguro para instalar sobre cabeceras de cama",
        "Cero juntas sucias ni fraguado: estética monolítica limpia",
        "Garantía oficial ATOMIC de durabilidad"
      ],
      whatsappMsg: "Hola ATOMIC, deseo comprar la Plancha PVC Mármol Blanco para Dormitorio a $29.99. ¿Hacen envíos a mi ciudad?"
    },
    {
      id: "pvc-mar-gri-29",
      sku: "PVC-MAR-GRI-29",
      categoryType: 'pvc',
      name: "Plancha PVC Estilo Mármol Gris Piedra & Baño",
      subtitle: "Gris Mineral Texturizado / Spa Moderno",
      badge: "100% IMPERMEABLE PARA BAÑOS",
      price: 29.10,
      regularPrice: 40.00,
      image: "/images/paneles-wpc/plancha-pvc-marmol-gris-bano.jpg",
      dimensions: "1.22m ancho × 2.44m alto",
      tagColor: "bg-slate-900 text-slate-200 border-slate-700",
      idealFor: "Duchas, paredes de baño, lavanderías, salpicaderos de cocina y spas.",
      description: "Textura mineral gris piedra contemporánea. Ideal para revestir baños y duchas sin picar azulejos viejos. Resistente al chorro directo de agua y vapor constante.",
      benefits: [
        "100% impermeable apto para zonas de ducha y alta humedad",
        "Se aplica directamente sobre azulejos existentes con silicona neutra",
        "No genera hongos en las uniones ni acumula sarro",
        "Retiro inmediato en Carapungo"
      ],
      whatsappMsg: "Hola ATOMIC, me gustaría cotizar Planchas PVC Estilo Mármol Gris para remodelar mi baño a $29.10. ¿Cuántas planchas recomiendan?"
    },
    {
      id: "pvc-mar-cal-29",
      sku: "PVC-MAR-CAL-29",
      categoryType: 'pvc',
      name: "Plancha PVC Estilo Mármol Calacatta Sala & TV Wall",
      subtitle: "Veteado Calacatta Gris Suave sobre Fondo Marfil",
      badge: "CLÁSICO ARQUITECTÓNICO",
      price: 29.30,
      regularPrice: 42.00,
      image: "/images/paneles-wpc/plancha-pvc-marmol-calacatta-sala.jpg",
      dimensions: "1.22m ancho × 2.44m alto",
      tagColor: "bg-stone-900 text-stone-200 border-stone-700",
      idealFor: "Muros de sala, recepciones corporativas, consultorios y locales comerciales.",
      description: "Patrón clásico Calacatta de gran formato. Aporta una apariencia de lujo atemporal a cualquier espacio residencial o corporativo.",
      benefits: [
        "Veteado continuo que amplía visualmente la altura del espacio",
        "Resistente al uso diario, manchas de café o grasa",
        "Instalación en menos de 2 horas",
        "Calidad garantizada ATOMIC"
      ],
      whatsappMsg: "Hola ATOMIC, deseo adquirir la Plancha PVC Mármol Calacatta a $29.30. ¿Tienen entrega inmediata en Quito?"
    },

    // ── LÍNEA 3: COMBOS Y MUROS COMPLETOS ──
    {
      id: "wpc-combo-wall",
      sku: "WPC-COMBO-WALL",
      categoryType: 'combo',
      name: "Combo Muro TV: 1 Plancha PVC Mármol + 6 Paneles Ranurados WPC",
      subtitle: "El Diseño Favorito de Arquitectos para Sala de Estar",
      badge: "AHORRA $15 EN COMBO",
      price: 79.99,
      regularPrice: 95.00,
      image: "/images/paneles-wpc/plancha-pvc-marmol-calacatta-sala.jpg",
      dimensions: "Cubre hasta 2.20m de ancho × 2.90m alto",
      tagColor: "bg-amber-900 text-yellow-300 border-amber-600",
      idealFor: "Centros de TV y salas modernas completas.",
      description: "Incluye 1 Plancha PVC Mármol de 1.22m para el área central de la pantalla + 6 Paneles Ranurados WPC de 2.90m en color a elección (Negro, Bicolor o Café) para los laterales.",
      benefits: [
        "Centro de mármol reflectivo + laterales cálidos de listones de madera",
        "La tendencia decorativa #1 en interiorismo actual",
        "Todo lo necesario para transformar una pared en una tarde",
        "Ahorro de $15 versus compra individual de piezas"
      ],
      whatsappMsg: "Hola ATOMIC, deseo pedir el COMBO MURO TV (1 Plancha PVC Mármol + 6 Paneles Ranurados WPC) por $79.99. ¿Puedo elegir el color de los paneles laterales?"
    },
    {
      id: "cmw6rpv36000ajtatdw1eczc5",
      sku: "WPC-PACK-10P",
      categoryType: 'combo',
      name: "Pack Remodelación Muro Completo (10 Paneles WPC 2.90m + Kit)",
      subtitle: "10 Paneles WPC + Kit de Perfilería y Clips",
      badge: "PACK MAYORISTA AHORRO",
      price: 99.99,
      regularPrice: 119.00,
      image: "/images/paneles-wpc/panel-wpc-bicolor-madera.jpg",
      dimensions: "Cubre 1.60m ancho × 2.90m alto",
      tagColor: "bg-stone-900 text-stone-200 border-stone-700",
      idealFor: "Paredes completas de dormitorios, pasillos o salas de juntas.",
      description: "Pack integral con 10 paneles ranurados WPC de 2.90m en el color que prefieras más el kit de clips inoxidables para una instalación firme y sin tornillos a la vista.",
      benefits: [
        "10 Paneles de 2.90m cubren 1.60 metros lineales de pared",
        "Incluye clips de acero inoxidable para fijación oculta",
        "Precio preferencial por volumen",
        "Envío disponible a todo el Ecuador"
      ],
      whatsappMsg: "Hola ATOMIC, me interesa el PACK DE 10 PANELES WPC + KIT por $99.99. ¿Tienen disponible para entrega inmediata?"
    },
    {
      id: "cmw6rpu880008jtat9vivwrdo",
      sku: "WPC-KIT-01",
      categoryType: 'combo',
      name: "Kit de Remodelación & Perfilería WPC",
      subtitle: "Clips Inoxidables + Terminal de Remate en L",
      badge: "ACCESORIO DE INSTALACIÓN",
      price: 12.50,
      regularPrice: 18.00,
      image: "/images/paneles-wpc/panel-wpc-negro.jpg",
      dimensions: "20 Clips + Perfil Terminal L",
      tagColor: "bg-stone-900 text-stone-200 border-stone-700",
      idealFor: "Rematar bordes e instalar paneles ranurados WPC con fijación oculta.",
      description: "Accesorios indispensables para un acabado profesional: 20 clips de fijación que quedan ocultos entre ranuras y un perfil terminal para los extremos del muro.",
      benefits: [
        "Clips de acero inoxidable resistentes al óxido",
        "Fijación oculta sin tornillos visibles en el frente",
        "Terminación limpia en esquinas y filos libres",
        "Compatible con todos los modelos WPC ATOMIC"
      ],
      whatsappMsg: "Hola ATOMIC, requiero Kits de Perfilería y Clips WPC ($12.50). ¿Cuántos kits necesito para mi instalación?"
    }
  ]

  const filteredProducts = activeCategoryTab === 'all'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter(p => p.categoryType === activeCategoryTab)

  const handleAddToCart = (id: string, name: string, price: number, image: string) => {
    addToCart({
      id,
      name,
      price,
      quantity: 1,
      image
    })
    setAddedItem(id)
    setTimeout(() => setAddedItem(null), 2500)
  }

  const handleCalculatorWhatsApp = () => {
    const typeLabel = calcProductType === 'wpc' 
      ? 'Paneles Ranurados WPC (16cm x 2.90m)' 
      : 'Planchas PVC Estilo Mármol (1.22m x 2.44m)'
    
    const msg = `Hola ATOMIC, utilicé la calculadora de remodelación en la web:
- Material elegido: ${typeLabel}
- Ancho de mi pared: ${wallWidthMeters} metros
- Cantidad calculada: ${unitsNeeded} unidades
- Presupuesto estimado: $${calculatedTotal} USD
¿Tienen stock disponible en bodega Carapungo para retirar o coordinar envío?`

    window.open(`https://wa.me/${officialPhone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0e0f12] text-stone-100 font-sans selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      
      {/* ── LUXURY WARM AMBIENT LIGHTING ── */}
      <div className="fixed inset-0 bg-[radial-gradient(#26272e_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />
      <div className="fixed -top-40 left-1/3 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed top-1/2 -right-40 w-[650px] h-[650px] bg-amber-700/10 rounded-full blur-[220px] pointer-events-none" />

      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div className="relative z-50 bg-gradient-to-r from-[#21160e] via-[#332215] to-[#21160e] border-b border-amber-500/30 text-amber-300 px-4 py-2 text-center text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm">
        <Sparkles size={14} className="text-amber-400 animate-pulse" />
        <span>PANELES RANURADOS WPC A $9.09 • PLANCHAS PVC MÁRMOL DESDE $27.00 • RETIRO EN CARAPUNGO (QUITO) • ENVÍOS NACIONALES</span>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#121318]/90 backdrop-blur-2xl border-b border-stone-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <Link href="/web" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3d2719] via-[#21140c] to-[#0e0805] border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xl shadow-[0_0_20px_rgba(217,119,6,0.3)] group-hover:scale-105 transition-transform">
              <span>W</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black tracking-tight text-white uppercase font-sans">ATOMIC</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-950 uppercase font-mono">
                  REMODELACIONES
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-bold tracking-widest uppercase mt-0.5 font-mono">
                Paneles Ranurados WPC & Planchas PVC Mármol
              </p>
            </div>
          </Link>

          {/* Quick Direct WhatsApp from Banner */}
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC,%20deseo%20asesoria%20sobre%20los%20Paneles%20Ranurados%20WPC%20y%20Planchas%20PVC%20Marmol.`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-xs font-mono font-bold transition-all"
            >
              <Phone size={14} className="text-amber-400" />
              <span>{formattedPhone}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">Carapungo</span>
            </a>

            <Link
              href="/web/cart"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 text-xs font-mono transition-all"
            >
              <ShoppingCart size={15} />
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

      {/* ── HERO BANNER PRINCIPAL ── */}
      <section className="relative pt-12 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & High-Value Pitch */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles size={14} />
              <span>Importación Directa • Sin Intermediarios</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans leading-[1.08]">
              Paneles Ranurados <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">WPC & Mármol PVC</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Transforma tus salas, dormitorios, baños y locales comerciales con el look de revista arquitectónica. Paneles ranurados de <strong>2.90m a solo $9.09</strong> y planchas de PVC tipo mármol desde <strong>$27.00</strong>. 100% impermeables, sin obra sucia ni mantenimiento.
            </p>

            {/* Price Cards Highlight Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-500/30">
                <span className="text-[10px] font-mono text-stone-400 uppercase block">Paneles WPC (2.90m)</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">$9.09</div>
                <span className="text-[10px] text-stone-400 font-mono block">por panel de 16cm</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-red-500/30">
                <span className="text-[10px] font-mono text-stone-400 uppercase block">Plancha Mármol PVC</span>
                <div className="text-2xl sm:text-3xl font-black text-red-400 font-mono">$27.00</div>
                <span className="text-[10px] text-red-300 font-mono block">liquidación 1.22m</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-700 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono text-stone-400 uppercase block">Bodega & Retiro</span>
                <div className="text-lg font-black text-white font-mono flex items-center gap-1 mt-1">
                  <MapPin size={16} className="text-amber-400" />
                  <span>Carapungo</span>
                </div>
                <span className="text-[10px] text-amber-300 font-mono block">Quito • Envíos país</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC,%20deseo%20comprar%20paneles%20ranurados%20WPC%20y%20planchas%20PVC%20en%20Carapungo.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all active:scale-95 font-mono cursor-pointer"
              >
                <Phone size={16} className="stroke-[2.5]" />
                <span>Pedir Asesoría al 098 031 9050</span>
              </a>

              <a
                href="#catalogo-seccion"
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold uppercase tracking-wider font-mono transition-all"
              >
                <span>Ver Catálogo Completo (11)</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Quick Guarantees Badge */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400 pt-2 border-t border-stone-800">
              <div className="flex items-center gap-1.5">
                <Droplet size={14} className="text-amber-400" />
                <span>100% Impermeable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-amber-400" />
                <span>Calidad Garantizada ATOMIC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-amber-400" />
                <span>Envíos a todo el Ecuador</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] bg-stone-900 aspect-[4/3] group">
              <Image
                src="/images/paneles-wpc/plancha-pvc-marmol-calacatta-sala.jpg"
                alt="Remodelación Moderna Mármol PVC y Paneles Ranurados WPC ATOMIC"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/20" />
              
              {/* Overlay Badges */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider font-mono shadow-md">
                  TENDENCIA MURO TV 2026
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-[#0e0f12]/90 backdrop-blur-md border border-stone-700 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold uppercase block">Diseño Combinado</span>
                    <h4 className="text-xs font-black text-white uppercase">Mármol PVC al Centro + Paneles WPC Laterales</h4>
                  </div>
                  <span className="text-sm font-black text-amber-400 font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    Combo $79.99
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 1: CALCULADORA INTERACTIVA DE MUROS (WPC & PVC)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto border-t border-stone-800">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-stone-900/90 via-[#181920] to-stone-900/90 border border-amber-500/30 shadow-2xl">
          
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider border border-amber-500/30">
              <Calculator size={13} />
              <span>Calculadora de Presupuesto Express</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
              Calcula Cuántos Paneles o Planchas Necesitas
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm">
              Ingresa el ancho de tu pared en metros. La herramienta calculará automáticamente las piezas exactas y el presupuesto estimado en base a los precios oficiales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            
            {/* Input & Product Type Selector */}
            <div className="space-y-5 bg-[#0e0f12] p-6 rounded-3xl border border-stone-800">
              
              <div>
                <label className="text-xs font-mono font-bold text-stone-300 uppercase block mb-2">
                  1. Selecciona el Material a Instalar:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcProductType('wpc')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      calcProductType === 'wpc'
                        ? 'bg-amber-500/15 border-amber-400 text-amber-200'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold block uppercase text-amber-400">Paneles Ranurados WPC</span>
                    <span className="text-sm font-black text-white block">$9.09 / panel</span>
                    <span className="text-[10px] text-stone-400 block font-mono">2.90m alto × 16cm ancho</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcProductType('pvc')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      calcProductType === 'pvc'
                        ? 'bg-red-500/15 border-red-400 text-red-200'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold block uppercase text-red-400">Planchas PVC Mármol</span>
                    <span className="text-sm font-black text-white block">Desde $27.00 / plancha</span>
                    <span className="text-[10px] text-stone-400 block font-mono">2.44m alto × 1.22m ancho</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="wall-width-slider" className="text-xs font-mono font-bold text-stone-300 uppercase">
                    2. Ancho de tu Pared:
                  </label>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    {wallWidthMeters.toFixed(2)} metros
                  </span>
                </div>
                
                <input
                  id="wall-width-slider"
                  type="range"
                  min="0.8"
                  max="10.0"
                  step="0.1"
                  value={wallWidthMeters}
                  onChange={(e) => setWallWidthMeters(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                  aria-label="Ancho de pared en metros"
                />
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-mono text-stone-400">Medidas típicas:</span>
                {[
                  { label: "1.60 m", val: 1.6 },
                  { label: "2.40 m", val: 2.4 },
                  { label: "3.20 m", val: 3.2 },
                  { label: "4.80 m", val: 4.8 },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setWallWidthMeters(preset.val)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Result Card */}
            <div className="p-6 rounded-3xl bg-[#0b0c0e] border border-amber-500/30 text-center space-y-4 shadow-xl">
              
              <div className="grid grid-cols-2 gap-3 border-b border-stone-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase block">Piezas Requeridas</span>
                  <span className="text-3xl font-black text-white font-mono">{unitsNeeded}</span>
                  <span className="text-[10px] text-amber-400 font-mono block">
                    {calcProductType === 'wpc' ? 'Paneles de 16cm' : 'Planchas de 1.22m'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase block">Cobertura Total</span>
                  <span className="text-3xl font-black text-white font-mono">
                    {calcProductType === 'wpc' 
                      ? (unitsNeeded * 0.464).toFixed(1) 
                      : (unitsNeeded * 2.97).toFixed(1)}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono block">m² aproximados</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase block">Presupuesto Estimado</span>
                <span className="text-4xl font-black text-amber-400 font-mono">${calculatedTotal}</span>
                <span className="text-xs text-stone-400 font-mono"> USD con IVA</span>
              </div>

              <button
                type="button"
                onClick={handleCalculatorWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer font-mono"
              >
                <Phone size={15} className="stroke-[2.5]" />
                <span>Pedir estas {unitsNeeded} Piezas por WhatsApp</span>
              </button>

            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 2: CATÁLOGO COMPLETO DE PRODUCTOS (PANELES WPC + PLANCHAS PVC + COMBOS)
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-8 max-w-7xl mx-auto" id="catalogo-seccion">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 pb-4 border-b border-stone-800">
          <div>
            <span className="text-amber-400 text-xs font-mono uppercase tracking-widest font-black">
              Catálogo Oficial ATOMIC 2026
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1 font-sans">
              Colección Paneles & Planchas PVC Mármol
            </h2>
          </div>
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Todos los Productos (11)' },
              { id: 'wpc', label: '🪵 Paneles WPC ($9.09)' },
              { id: 'pvc', label: '🏛️ Planchas PVC Mármol ($27-$29)' },
              { id: 'combo', label: '⭐ Combos Muro TV' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeCategoryTab === tab.id
                    ? "bg-amber-400 text-stone-950 shadow-md scale-105"
                    : "bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => {
            const isAdded = addedItem === prod.id

            return (
              <div 
                key={prod.id}
                className="rounded-3xl bg-[#14151b] border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] w-full bg-stone-900 overflow-hidden">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14151b] via-transparent to-black/20" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-amber-500 text-stone-950 shadow-md">
                        {prod.badge}
                      </span>
                    </div>

                    {/* Dimensions Pill */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-black/80 backdrop-blur-md text-stone-200 border border-stone-700">
                        {prod.dimensions}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                        SKU: {prod.sku}
                      </div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight leading-snug group-hover:text-amber-300 transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-stone-400 font-mono mt-0.5">
                        {prod.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed">
                      {prod.description}
                    </p>

                    {/* Benefits List */}
                    <ul className="space-y-1.5 pt-1 border-t border-stone-800/80">
                      {prod.benefits.slice(0, 3).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-stone-400">
                          <CheckCircle2 size={13} className="text-amber-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                  </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-5 pt-0 border-t border-stone-800/60 mt-3 space-y-3">
                  <div className="flex items-baseline justify-between pt-3">
                    <div>
                      <span className="text-[10px] font-mono text-stone-400 line-through block">
                        Reg: ${prod.regularPrice.toFixed(2)}
                      </span>
                      <span className="text-2xl font-black text-amber-400 font-mono">
                        ${prod.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 ml-1">USD c/u</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                      Stock Inmediato
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod.id, prod.name, prod.price, prod.image)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider font-mono transition-all cursor-pointer ${
                        isAdded 
                          ? 'bg-emerald-500 text-stone-950'
                          : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                      }`}
                    >
                      <ShoppingCart size={13} />
                      <span>{isAdded ? "¡Añadido!" : "Al Carrito"}</span>
                    </button>

                    <a
                      href={`https://wa.me/${officialPhone}?text=${encodeURIComponent(prod.whatsappMsg)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-stone-950 font-black text-xs uppercase tracking-wider font-mono transition-all shadow-md"
                    >
                      <Phone size={13} className="stroke-[2.5]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                </div>

              </div>
            )
          })}
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 3: GUÍA RÁPIDA DE INSTALACIÓN
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto border-t border-stone-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-amber-400 text-xs font-mono uppercase tracking-widest font-black">
            Cero Obras Sucias • Listo en Horas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1 font-sans">
            ¿Cómo se Instalan los Paneles y Planchas?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Nivelación & Trazo",
              desc: "Limpia la pared de polvo o grasa. Traza con nivel láser la línea guía vertical u horizontal de inicio."
            },
            {
              step: "02",
              title: "Corte a Medida",
              desc: "Los paneles WPC (2.90m) y planchas PVC (2.44m) se cortan limpiamente con sierra de mano, caladora o estilete reforzado."
            },
            {
              step: "03",
              title: "Fijación Rápida",
              desc: "Aplica silicona neutra o adhesivo de montaje al reverso y asegura los paneles ranurados con clips invisibles de acero."
            },
            {
              step: "04",
              title: "Remate & Disfrute",
              desc: "Coloca perfiles terminales en las esquinas. Pasa un paño limpio y disfruta de un muro de lujo moderno sin esperar secados."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 relative space-y-2">
              <span className="text-3xl font-black text-amber-500/40 font-mono block">{item.step}</span>
              <h3 className="text-base font-black text-white uppercase tracking-tight font-sans">{item.title}</h3>
              <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════════
          APARTADO 4: BODEGA CARAPUNGO & ASESORÍA DIRECTA
      ══════════════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto border-t border-stone-800">
        
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#21160e] via-[#1a120c] to-[#121318] border-2 border-amber-500/40 text-center space-y-4 shadow-2xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-mono font-black uppercase tracking-wider">
            <MapPin size={13} />
            <span>Bodega Principal: Carapungo, Quito - Ecuador</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-sans">
            ¿Deseas Retirar Hoy Mismo o Necesitas Cotización para tu Proyecto?
          </h3>

          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Puedes retirar tus paneles WPC o planchas PVC directamente en nuestra bodega en Carapungo (Quito) o te los enviamos a domicilio en cualquier provincia del Ecuador. Escríbenos directamente al número oficial:
          </p>

          <div className="pt-2">
            <a
              href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC,%20deseo%20visitar%20la%20bodega%20en%20Carapungo%20o%20cotizar%20Paneles%20WPC%20y%20Planchas%20PVC.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-95 font-mono"
            >
              <Phone size={18} className="stroke-[2.5]" />
              <span>Chatear al {formattedPhone} por WhatsApp</span>
            </a>
          </div>

        </div>

      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-12 border-t border-stone-800 bg-[#090a0d] py-8 px-4 text-center text-xs text-stone-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ATOMIC • División Paneles Ranurados WPC & Planchas PVC Mármol.</p>
          <div className="flex items-center gap-4">
            <Link href="/web" className="hover:text-stone-300 transition-colors">Tienda Oficial</Link>
            <span>•</span>
            <Link href="/web/carros-industriales" className="hover:text-stone-300 transition-colors">Carros Industriales</Link>
            <span>•</span>
            <Link href="/web/creacion-contenido" className="hover:text-stone-300 transition-colors">Studio Contenido</Link>
            <span>•</span>
            <Link href="/web/cart" className="hover:text-stone-300 transition-colors">Carrito</Link>
          </div>
        </div>
      </footer>

      {/* ── STICKY MOBILE CONVERSION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121318]/95 backdrop-blur-xl border-t border-stone-800 p-2.5 flex items-center justify-between gap-2 sm:hidden shadow-2xl">
        <div className="flex-1 min-w-0 pl-1 font-mono">
          <span className="text-[10px] text-amber-400 font-black uppercase block leading-none truncate">
            WPC & Mármol PVC
          </span>
          <span className="text-[11px] text-white font-bold">
            Desde $9.09 • Carapungo
          </span>
        </div>

        <a
          href={`https://wa.me/${officialPhone}?text=Hola%20ATOMIC,%20deseo%20comprar%20Paneles%20Ranurados%20WPC%20o%20Planchas%20PVC.`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg shrink-0 font-mono"
        >
          <Phone size={14} className="stroke-[2.5]" />
          <span>WhatsApp 098 031 9050</span>
        </a>
      </div>

    </div>
  )
}
