"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Instagram, Facebook, Youtube, Share2, Sparkles, ChevronLeft, ChevronRight, ChevronUp, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// TikTok custom SVG icon
export function TikTokIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-3.6.04-7.2.06-10.8z" />
    </svg>
  );
}

export interface SocialLinkItem {
  id: string;
  name: string;
  account: string;
  url: string;
  description: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  hoverGlow: string;
  tag: string;
}

export const ATOMIC_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: "tiktok-tecnico",
    name: "TikTok Técnico",
    account: "@santiagoguzman216",
    url: "https://www.tiktok.com/@santiagoguzman216?_r=1&_t=ZS-9AU9OLRgZkY",
    description: "Pruebas de campo, instalación y calibración por el Jefe Técnico",
    icon: <TikTokIcon className="w-5 h-5 text-white" />,
    bgGradient: "from-slate-900 to-black",
    borderColor: "border-slate-700/80 hover:border-cyan-400",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
    tag: "TÉCNICO & CCTV"
  },
  {
    id: "tiktok-unboxing",
    name: "TikTok Unboxing",
    account: "@juanguzman35886",
    url: "https://www.tiktok.com/@juanguzman35886?_r=1&_t=ZS-9AU9ov9ihow",
    description: "Desempaque real, cerraduras inteligentes y gadgets para el hogar",
    icon: <TikTokIcon className="w-5 h-5 text-white" />,
    bgGradient: "from-cyan-950 to-blue-900",
    borderColor: "border-blue-600/60 hover:border-blue-400",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]",
    tag: "UNBOXING & SMART HOME"
  },
  {
    id: "instagram-atomic",
    name: "Instagram Oficial",
    account: "@atomic_industries_26",
    url: "https://www.instagram.com/atomic_industries_26?cplk=bDczYW9xN2F6NXFs",
    description: "Novedades, entregas en todo el Ecuador y catálogo visual",
    icon: <Instagram className="w-5 h-5 text-white" />,
    bgGradient: "from-purple-900 via-pink-700 to-amber-600",
    borderColor: "border-pink-500/60 hover:border-pink-300",
    hoverGlow: "hover:shadow-[0_0_25px_rgba(236,72,153,0.6)]",
    tag: "INSTAGRAM OFICIAL"
  },
  {
    id: "facebook-atomic",
    name: "Facebook Oficial",
    account: "Atomic Electronics Ecuador",
    url: "https://www.facebook.com/share/14uWsX16BQH/",
    description: "Comunidad, testimonios, despachos diarios y soporte técnico",
    icon: <Facebook className="w-5 h-5 text-white" />,
    bgGradient: "from-blue-950 to-blue-800",
    borderColor: "border-blue-500/60 hover:border-blue-300",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]",
    tag: "COMUNIDAD & PROYECTOS"
  },
  {
    id: "youtube-atomic",
    name: "YouTube Capacitaciones",
    account: "@atomicmenquantum",
    url: "https://youtube.com/@atomicmenquantum?si=jScgTmF2FBGTrObU",
    description: "Videos demostrativos, tutoriales de configuración y reviews",
    icon: <Youtube className="w-5 h-5 text-white" />,
    bgGradient: "from-red-950 to-red-800",
    borderColor: "border-red-600/60 hover:border-red-400",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]",
    tag: "VIDEOS & TUTORIALES"
  },
  {
    id: "whatsapp-atomic",
    name: "WhatsApp Asesoría",
    account: "+593 96 904 3453",
    url: "https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n%20sobre%20sus%20productos.",
    description: "Atención comercial inmediata y cotizaciones personalizadas",
    icon: <MessageCircle className="w-5 h-5 text-white" />,
    bgGradient: "from-emerald-950 to-teal-800",
    borderColor: "border-emerald-500/60 hover:border-emerald-300",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]",
    tag: "CANAL DIRECTO"
  }
];

export interface PermanentSocialBarProps {
  variant?: "floating" | "inline" | "header" | "profileCard";
  className?: string;
}

export default function PermanentSocialBar({
  variant = "floating",
  className = ""
}: PermanentSocialBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      const shareUrl = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: "ATOMIC Ecuador • Tecnología, Hardware & Seguridad",
            text: "Descubre el ecosistema comercial y tecnológico de ATOMIC Ecuador",
            url: shareUrl,
          });
          return;
        } catch (e) {}
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    }
  };

  // 1. MODO FLOTANTE: Botón Desplegable elegante con Redes Sociales, Botón Compartir y Chat a WhatsApp
  if (variant === "floating") {
    return (
      <aside 
        ref={dropdownRef}
        aria-label="Redes Sociales Oficiales de ATOMIC"
        className={`fixed left-3 sm:left-6 bottom-5 z-50 transition-all duration-300 ${className}`}
      >
        <div className="relative">
          {/* Card Desplegable (Popup) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-0 mb-3 w-80 sm:w-96 rounded-3xl bg-[#070b18]/95 backdrop-blur-2xl border border-white/20 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-white text-left space-y-4"
              >
                {/* Header Card */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                      Redes Sociales & Canales
                    </span>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Cerrar"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Acciones Rápidas: WhatsApp y Compartir */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="https://wa.me/593969043453?text=Hola%20ATOMIC!%20Deseo%20informaci%C3%B3n%20sobre%20sus%20productos."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <MessageCircle size={15} />
                    <span>Chat WhatsApp</span>
                  </a>

                  <button
                    onClick={handleShare}
                    className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check size={15} className="text-emerald-400" />
                        <span className="text-emerald-300">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={15} className="text-cyan-400" />
                        <span>Compartir</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Lista de Canales Oficiales */}
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                  {ATOMIC_SOCIAL_LINKS.filter(item => item.id !== 'whatsapp-atomic').map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2.5 rounded-2xl bg-gradient-to-r ${item.bgGradient} border ${item.borderColor} ${item.hoverGlow} flex items-center justify-between group transition-all duration-200 hover:scale-[1.01]`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400 truncate">
                            {item.account}
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-cyan-300/80 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                        {item.tag}
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trigger Pill Button (Discreet & Collapsed by default) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/90 hover:bg-slate-900 text-white border border-white/20 hover:border-cyan-400 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
            title="Redes Sociales & Canales Oficiales de ATOMIC"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors">
              Redes Sociales
            </span>
            <ChevronUp
              size={14}
              className={`text-cyan-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : "group-hover:-translate-y-0.5"}`}
            />
          </button>
        </div>
      </aside>
    );
  }

  // 2. MODO TARJETA PARA PERFILES (Visible permanentemente en el perfil de usuario y asesores)
  if (variant === "profileCard") {
    return (
      <div className={`p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-xl space-y-5 text-white ${className}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Share2 size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 text-white">
                <span>Canales & Redes Oficiales de ATOMIC</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold">
                  VERIFICADOS
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Comparte, sigue y accede a los contenidos oficiales, unboxings y testeos en vivo del equipo.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ATOMIC_SOCIAL_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3.5 rounded-2xl bg-gradient-to-br ${item.bgGradient} border ${item.borderColor} ${item.hoverGlow} transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-start gap-3 group`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>
                <h4 className="text-xs font-black text-white truncate mt-0.5 group-hover:text-cyan-200 transition-colors">
                  {item.name}
                </h4>
                <p className="text-[11px] font-mono text-slate-300 truncate">
                  {item.account}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // 3. MODO INLINE (Para la Web Principal Fría / Landings)
  return (
    <div className={`w-full py-8 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-[#070b18]/80 border border-white/15 backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.15)] space-y-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest">
              <Sparkles size={13} className="text-cyan-400" />
              <span>Ecosistema de Medios & Redes Oficiales</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Conéctate con ATOMIC en Redes Sociales
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Descubre tutoriales técnicos, desempaque de productos, demostraciones nocturnas y reseñas de clientes reales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ATOMIC_SOCIAL_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-2xl bg-gradient-to-br ${item.bgGradient} border ${item.borderColor} ${item.hoverGlow} transition-all duration-300 hover:scale-[1.02] flex items-center justify-between group shadow-md`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest block">
                      {item.tag}
                    </span>
                    <h3 className="text-sm font-black text-white truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-300 truncate">
                      {item.account}
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:translate-x-1 transition-transform border border-white/20">
                  <ChevronRight size={14} />
                </div>
              </a>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
