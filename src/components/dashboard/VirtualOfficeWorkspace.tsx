'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, ShoppingCart, Share2, Target, DollarSign, 
  Users, Sparkles, CheckCircle2, ArrowRight, Activity, Laptop, Zap
} from 'lucide-react';
import Link from 'next/link';

type OfficeZone = 'ventas' | 'marketing' | 'coordinacion' | 'finanzas';

export default function VirtualOfficeWorkspace({ currentModule = 'ventas' }: { currentModule?: OfficeZone }) {
  const [activeZone, setActiveZone] = useState<OfficeZone>(currentModule);
  const [avatarPos, setAvatarPos] = useState<{ x: number; y: number }>({ x: 25, y: 35 });

  const zones = {
    ventas: {
      id: 'ventas',
      title: 'Módulo de Ventas & Cotizaciones',
      code: 'ZONE-01',
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      glow: 'shadow-[0_0_50px_rgba(59,130,246,0.3)]',
      icon: ShoppingCart,
      x: 22,
      y: 30,
      link: '/dashboard/quotes',
      stats: '14 Cotizaciones Activas • $12,450 en Cierre',
      desc: 'Área dedicada a la formulación de cotizaciones empresariales, atención comercial a clientes y cierre de ventas.',
      staff: ['Asesor Carlos V.', 'Ing. Elena M.']
    },
    marketing: {
      id: 'marketing',
      title: 'Módulo de Marketing & Redes Sociales',
      code: 'ZONE-02',
      color: 'from-purple-600 to-pink-600',
      badgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      glow: 'shadow-[0_0_50px_rgba(236,72,153,0.3)]',
      icon: Share2,
      x: 75,
      y: 30,
      link: '/dashboard/blogs',
      stats: '4 Redes Conectadas • 8 Publicaciones Programadas',
      desc: 'Centro neurálgico de automatización omni-canal: difusión simultánea en TikTok, YouTube, Instagram y Facebook.',
      staff: ['Social Media Lead', 'Diseñador IA']
    },
    coordinacion: {
      id: 'coordinacion',
      title: 'Módulo de Coordinación & Operaciones',
      code: 'ZONE-03',
      color: 'from-emerald-600 to-teal-600',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      glow: 'shadow-[0_0_50px_rgba(16,185,129,0.3)]',
      icon: Target,
      x: 22,
      y: 75,
      link: '/dashboard/coordinacion',
      stats: '6 Proyectos en Ejecución • 98% Eficiencia',
      desc: 'Gestión técnica de proyectos, logística de envíos de productos y asignación de tareas operativas.',
      staff: ['Coordinador General', 'Supervisora de Operaciones']
    },
    finanzas: {
      id: 'finanzas',
      title: 'Módulo de Finanzas & Cuentas',
      code: 'ZONE-04',
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      glow: 'shadow-[0_0_50px_rgba(245,158,11,0.3)]',
      icon: DollarSign,
      x: 75,
      y: 75,
      link: '/dashboard/finance',
      stats: 'Balance Positivo • Cierre Mensual al 85%',
      desc: 'Supervisión de tickets de facturación, libro diario, cobranzas y balances contables corporativos.',
      staff: ['Contador Principal', 'Analista Financiero']
    }
  };

  const handleSelectZone = (zoneKey: OfficeZone) => {
    setActiveZone(zoneKey);
    setAvatarPos({ x: zones[zoneKey].x, y: zones[zoneKey].y });
  };

  const current = zones[activeZone];

  return (
    <div className="w-full bg-slate-950 text-white rounded-3xl p-6 lg:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Dynamic Ambient Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>Entorno Interactivo Virtual ATOMIC v4.0</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Building2 className="text-indigo-400" />
            <span>Oficina Virtual Corporativa</span>
          </h2>
        </div>

        {/* Quick Nav Switches */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {(Object.keys(zones) as OfficeZone[]).map((key) => {
            const z = zones[key];
            const Icon = z.icon;
            const isSelected = activeZone === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectZone(key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  isSelected 
                    ? 'bg-gradient-to-r ' + z.color + ' text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline capitalize">{key}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Map & Details Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* 2.5D Animated Floorplan (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 relative min-h-[420px] flex flex-col justify-between overflow-hidden shadow-inner group">
          
          {/* Floorplan Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

          {/* Map Title Overlay */}
          <div className="relative z-10 flex justify-between items-center text-[11px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-3">
            <span className="flex items-center gap-2">
              <Activity size={14} className="text-emerald-400 animate-pulse" />
              <span>Mapa de Navegación 2.5D en Tiempo Real</span>
            </span>
            <span className="text-indigo-400 font-bold">4 Zonas Operativas</span>
          </div>

          {/* 4 Interactive Office Rooms */}
          <div className="relative z-10 grid grid-cols-2 gap-6 my-auto py-6">
            
            {(Object.keys(zones) as OfficeZone[]).map((key) => {
              const z = zones[key];
              const Icon = z.icon;
              const isActive = activeZone === key;

              return (
                <div
                  key={key}
                  onClick={() => handleSelectZone(key)}
                  className={`relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden group ${
                    isActive 
                      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-indigo-500 ' + z.glow
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  {/* Glowing Active Border Line */}
                  {isActive && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse"></div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${z.badgeColor}`}>
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">{z.code}</span>
                  </div>

                  <h3 className={`font-black text-sm md:text-base mb-1 transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {z.title.split('Módulo de ')[1] || z.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{z.stats}</p>

                  {/* Room Status Indicator */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
                      {isActive ? 'ZONA ACTIVA' : 'Módulo Listo'}
                    </span>
                    <span className="text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">Ver →</span>
                  </div>
                </div>
              );
            })}

          </div>

          {/* Animated Walking Avatar */}
          <motion.div 
            animate={{ x: `${avatarPos.x}%`, y: `${avatarPos.y}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5 z-30 pointer-events-none flex flex-col items-center"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 border-2 border-white flex items-center justify-center text-black font-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-bounce">
              👾
            </div>
            <span className="px-2 py-0.5 bg-black/90 text-[9px] font-mono font-bold text-amber-400 rounded-full border border-amber-500/40 whitespace-nowrap -mt-1 shadow-md">
              Tú (Operador)
            </span>
          </motion.div>

        </div>

        {/* Zone Details & Portal Link (4 Cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${current.badgeColor}`}>
                {current.code}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Conexión Segura v4</span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-white mb-6 shadow-lg">
              <current.icon size={28} className="text-indigo-400" />
            </div>

            <h3 className="text-xl font-black text-white mb-3 leading-tight">{current.title}</h3>
            <p className="text-slate-400 text-xs font-light leading-relaxed mb-6">{current.desc}</p>

            {/* Live Stats */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-6 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Estadística de Operación</span>
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <Sparkles size={14} />
                <span>{current.stats}</span>
              </p>
            </div>

            {/* Staff On Duty */}
            <div className="mb-6">
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-2">Personal Asignado en Zona</span>
              <div className="flex items-center space-x-2">
                {current.staff.map((name, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-[10px] font-medium text-slate-300">
                    👤 {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Portal Button */}
          <Link
            href={current.link}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-gradient-to-r ${current.color} shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 group`}
          >
            <span>Ingresar a {current.title.split('Módulo de ')[1] || 'Módulo'}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>

      </div>

    </div>
  );
}
