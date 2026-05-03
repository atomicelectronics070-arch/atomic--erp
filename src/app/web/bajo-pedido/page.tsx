"use client"

import { motion } from "framer-motion"
import { ShoppingBag, Clock, ShieldCheck, ArrowRight, Package } from "lucide-react"
import Link from "next/link"

export default function BajoPedidoPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center mb-20 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 bg-blue-600 flex items-center justify-center rounded-3xl shadow-xl shadow-blue-100 text-white"
                    >
                        <Package size={32} />
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-black text-[#1E3A8A] uppercase tracking-tighter italic">
                            BAJO <span className="text-blue-600">PEDIDO</span>
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] italic">Servicio de Importación y Proyectos Especiales</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { icon: <Clock />, title: "Tiempos de Entrega", desc: "Gestión logística optimizada para importaciones de 15 a 30 días." },
                        { icon: <ShieldCheck />, title: "Garantía Atomic", desc: "Todos los pedidos especiales cuentan con respaldo técnico total." },
                        { icon: <ShoppingBag />, title: "Exclusividad", desc: "Acceso a hardware y tecnología no disponible en stock local." }
                    ].map((f, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group"
                        >
                            <div className="text-blue-600 mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
                            <h3 className="text-lg font-black text-[#1E3A8A] uppercase tracking-tight mb-4 italic">{f.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed font-semibold">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 py-20 bg-[#1E3A8A] rounded-[4rem] text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">¿Buscas algo específico?</h2>
                        <p className="text-blue-100 text-sm font-medium max-w-lg mx-auto opacity-80 italic">
                            Nuestro equipo de compras globales puede localizar cualquier activo tecnológico que tu empresa necesite.
                        </p>
                        <Link href="/web/contact" className="inline-flex items-center gap-4 bg-white text-[#1E3A8A] px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-2xl">
                            SOLICITAR COTIZACIÓN <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
