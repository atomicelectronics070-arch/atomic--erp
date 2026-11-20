"use client";

import React, { useState } from "react";
import { MessageCircle, Instagram, Facebook, Youtube, Share2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

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

  // 1. MODO FLOTANTE PERMANENTE (Siempre visible en el costado o esquina de todas las páginas)
  if (variant === "floating") {
    return (
      <aside 
        aria-label="Redes Sociales Oficiales de ATOMIC"
        className={`fixed left-2 sm:left-4 bottom-20 sm:bottom-6 z-50 transition-all duration-300 ${className}`}
      >
        <div className="relative group">
          
          {/* Main Floating Dock */}
          <div className="flex flex-col items-center bg-[#070b18]/90 backdrop-blur-xl border border-white/15 hover:border-cyan-400/50 rounded-2xl p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all duration-300 gap-1.5">
            
            {/* Header / Expand Toggle Indicator */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title="Redes Sociales Oficiales de ATOMIC"
            >
              <Share2 size={16} />
            </button>

            {/* Quick Icon Links */}
            <div className={`flex flex-col gap-1.5 transition-all duration-300 ${isExpanded ? "max-h-[350px] opacity-100 mt-1" : "max-h-[300px] opacity-100"}`}>
              {ATOMIC_SOCIAL_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.bgGradient} border ${item.borderColor} ${item.hoverGlow} flex items-center justify-center transition-all duration-300 hover:scale-110 group/btn relative`}
                  title={`${item.name} (${item.account})`}
                >
                  <span className="scale-85 group-hover/btn:scale-100 transition-transform">
                    {item.icon}
                  </span>

                  {/* Tooltip on Desktop hover */}
                  <div className="hidden sm:group-hover/btn:flex absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-950/95 border border-white/20 text-white text-xs font-mono font-bold whitespace-nowrap shadow-xl z-50 pointer-events-none items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{item.name}</span>
                    <span className="text-[10px] text-cyan-300 font-normal">({item.account})</span>
                  </div>
                </a>
              ))}
            </div>

          </div>
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
