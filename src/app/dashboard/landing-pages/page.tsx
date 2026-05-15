"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Map, Plus, Eye, Edit3, Trash2, ExternalLink, Globe, X, Check, Star, Layout } from "lucide-react"

const DEMO_LANDINGS = [
    { id: "1", title: "Catálogo Electrónica 2024", url: "#", status: "active", views: 1240, conversions: 43 },
    { id: "2", title: "Promoción Trabajo Desde Casa", url: "#", status: "active", views: 3870, conversions: 211 },
    { id: "3", title: "Kit Emprendedor Digital", url: "#", status: "draft", views: 0, conversions: 0 },
]

export default function LandingPagesPage() {
    const [landings, setLandings] = useState(DEMO_LANDINGS)
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ title: "", url: "", status: "draft" })

    const handleCreate = () => {
        if (!form.title.trim()) return
        setLandings(prev => [...prev, { id: Date.now().toString(), ...form, views: 0, conversions: 0 }])
        setForm({ title: "", url: "", status: "draft" })
        setShowModal(false)
    }

    const handleDelete = (id: string) => {
        if (!confirm("¿Eliminar esta landing page?")) return
        setLandings(prev => prev.filter(l => l.id !== id))
    }

    return (
        <div className="space-y-8 pb-32 animate-in fade-in duration-500 font-sans">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0F172A] flex items-center gap-3">
                        <Map className="text-indigo-600" /> Landing Pages
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Gestiona tus páginas de aterrizaje y campañas de conversión.
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
                >
                    <Plus size={18} /> Nueva Landing Page
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Landings Activas", value: landings.filter(l => l.status === "active").length, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                    { label: "Vistas Totales", value: landings.reduce((a, l) => a + l.views, 0).toLocaleString(), color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                    { label: "Conversiones", value: landings.reduce((a, l) => a + l.conversions, 0), color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} border ${s.border} p-6 rounded-2xl shadow-sm flex items-center justify-between`}>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
                            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                        </div>
                        <Globe size={32} className={`${s.color} opacity-30`} />
                    </div>
                ))}
            </div>

            {/* Landings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {landings.map(landing => (
                    <motion.div
                        key={landing.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-300 transition-all group"
                    >
                        {/* Preview Thumbnail */}
                        <div className="h-36 bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-100 flex items-center justify-center border-b border-slate-100 relative">
                            <Layout size={48} className="text-slate-300" />
                            <div className="absolute top-3 right-3">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${landing.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                    {landing.status === 'active' ? 'Activa' : 'Borrador'}
                                </span>
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="text-base font-black text-[#0F172A] mb-1 group-hover:text-indigo-600 transition-colors">{landing.title}</h3>

                            <div className="flex gap-4 mt-4 mb-5 text-xs font-bold text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Eye size={14} className="text-slate-400" />
                                    {landing.views.toLocaleString()} vistas
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Check size={14} className="text-emerald-500" />
                                    {landing.conversions} conversiones
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                <a href={landing.url} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
                                    <ExternalLink size={14} /> Ver
                                </a>
                                <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                                    <Edit3 size={16} />
                                </button>
                                <button onClick={() => handleDelete(landing.id)} className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Add New Card */}
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl h-64 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all group"
                >
                    <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-bold">Añadir Landing Page</p>
                </button>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white p-8 max-w-lg w-full rounded-2xl shadow-xl relative z-10 border border-slate-200">
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"><X size={20} /></button>
                            <h3 className="text-xl font-black text-[#0F172A] mb-6 flex items-center gap-2"><Map className="text-indigo-600" size={22} /> Nueva Landing Page</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre / Título</label>
                                    <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ej: Campaña Emprendedora Junio 2024" className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">URL de la Página</label>
                                    <input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm text-[#0F172A] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Estado</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 appearance-none">
                                        <option value="draft">Borrador</option>
                                        <option value="active">Activa</option>
                                    </select>
                                </div>
                                <button onClick={handleCreate} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors mt-2">
                                    Crear Landing Page
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
