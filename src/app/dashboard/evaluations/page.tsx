"use client"

import { useState, useEffect } from "react"
import {
    Users,
    Star,
    Search,
    BarChart3,
    ArrowUpRight,
    Target,
    Trash2
} from "lucide-react"

export default function EvaluationsPage() {
    const [view, setView] = useState<"list" | "detail">("list")
    const [selectedCollaborator, setSelectedCollaborator] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [collaborators, setCollaborators] = useState<any[]>([])
    const [evaluations, setEvaluations] = useState<any[]>([])

    // Fetch collaborators (users) and evaluations
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [usersRes, evalsRes] = await Promise.all([
                fetch("/api/admin/users"), // Assuming this exists or returns list
                fetch("/api/evaluations")
            ])
            const users = await usersRes.json()
            const evals = await evalsRes.json()

            // Map users to collaborator format
            setCollaborators(Array.isArray(users) ? users.map((u: any) => ({
                id: u.id,
                name: u.name || u.email,
                role: u.role,
                score: 0, // Should calculate from evals if needed
                status: "stable",
                quotes: 0,
                sales: 0,
                cycleDay: 1
            })) : [])
            setEvaluations(Array.isArray(evals) ? evals : [])
        } catch (e) {
            console.error("Error loading evaluations data", e)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveEvaluation = async (score: number, observations: string) => {
        if (!selectedCollaborator) return

        try {
            const res = await fetch("/api/evaluations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    evaluateeId: selectedCollaborator.id,
                    evaluatorId: "system", // Fallback
                    score,
                    observations,
                    rubricData: {}, // Detailed rubric
                    cycleDay: selectedCollaborator.cycleDay
                })
            })
            if (res.ok) {
                fetchData()
                setView("list")
            }
        } catch (e) {
            console.error("Error saving evaluation", e)
        }
    }

    const handleDeleteEvaluation = async (id: string) => {
        if (confirm("¿Está seguro de eliminar esta evaluación permanentemente?")) {
            try {
                const res = await fetch(`/api/evaluations/${id}`, { method: "DELETE" })
                if (res.ok) fetchData()
            } catch (e) {
                console.error("Error deleting evaluation", e)
            }
        }
    }

    const rubricItems = [
        { label: "Números Diarios (Llamadas/Contactos)", weight: "20%", max: 10 },
        { label: "Cotizaciones Efectivas", weight: "25%", max: 10 },
        { label: "Ventas Cerradas", weight: "30%", max: 10 },
        { label: "Publicaciones / RRSS", weight: "10%", max: 10 },
        { label: "Retargeting / Seguimiento", weight: "10%", max: 10 },
        { label: "Aporte Base de Datos", weight: "5%", max: 10 },
    ]

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">
                        Control de <span className="text-orange-600">Rúbricas</span>
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm mt-1">Evaluación técnica 360° bajo estándares de rendimiento industrial.</p>
                </div>
                {view === "detail" && (
                    <button
                        onClick={() => setView("list")}
                        className="bg-neutral-900 text-white font-bold text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-orange-600 transition-all"
                    >
                        ← Volver al Listado
                    </button>
                )}
            </div>

            {view === "list" ? (
                <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <EvalStatCard title="Promedio de Equipo" value="76%" icon={<Users />} color="orange" />
                        <EvalStatCard title="Efectividad Ventas" value="62%" icon={<Target />} color="orange" />
                        <EvalStatCard title="Meta de Cotizaciones" value="88%" icon={<BarChart3 />} color="green" />
                    </div>

                    {/* Collaborators List */}
                    <div className="bg-white border border-neutral-200 shadow-sm mt-12">
                        <div className="p-8 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6">
                            <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-tight">Personal en Evaluación</h2>
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o ID..."
                                    className="w-full pl-12 pr-4 py-4 border border-neutral-100 bg-neutral-50 text-xs font-bold uppercase focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-neutral-300"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] text-neutral-400 uppercase font-bold tracking-[0.2em] bg-neutral-50/50">
                                    <tr>
                                        <th className="px-8 py-5">Colaborador</th>
                                        <th className="px-6 py-5">Rendimiento Técnico</th>
                                        <th className="px-6 py-5 text-center">Día Ciclo</th>
                                        <th className="px-6 py-5 text-right">Cotizaciones</th>
                                        <th className="px-8 py-5 text-right">Dirección</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {collaborators.map((c) => (
                                        <tr key={c.id} className="hover:bg-neutral-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center font-bold text-lg group-hover:bg-orange-600 transition-all">
                                                        {c.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-neutral-900 text-sm tracking-tight">{c.name}</p>
                                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{c.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-bold text-neutral-900 text-sm tracking-tight">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-1 h-3 bg-neutral-100 w-32 border border-neutral-100">
                                                        <div className={`h-full ${c.score > 80 ? 'bg-green-500' : c.score > 60 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${c.score}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold w-12">{c.score}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-50 px-3 py-1.5 border border-neutral-100 uppercase tracking-widest">
                                                    {c.cycleDay} / 30 Días
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-right font-bold text-neutral-900">
                                                {c.quotes}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end space-x-3">
                                                    <button
                                                        onClick={() => { setSelectedCollaborator(c); setView("detail"); }}
                                                        className="bg-neutral-900 text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-orange-600"
                                                    >
                                                        Evaluar
                                                    </button>
                                                    <button
                                                        onClick={() => { if (confirm('¿ELIMINAR REGISTRO DE EVALUACIÓN?')) handleDeleteEvaluation(c.id); }}
                                                        className="p-2.5 text-neutral-300 hover:text-red-600 hover:bg-neutral-50 transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Rubric Detail */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white border border-neutral-200 p-10 shadow-sm">
                            <div className="flex justify-between items-center mb-10 border-b border-neutral-100 pb-10">
                                <div>
                                    <h2 className="text-3xl font-bold text-neutral-900 uppercase tracking-tight">Rúbrica Semanal</h2>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2 flex items-center">
                                        <span className="w-2 h-2 bg-orange-600 mr-2"></span>
                                        Colaborador: {selectedCollaborator.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-4 py-2 border border-orange-100 inline-block">CICLO: 30 DÍAS</p>
                                    <p className="text-lg font-bold text-neutral-400 mt-2 uppercase tracking-tighter">Día Operativo {selectedCollaborator.cycleDay}</p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                {rubricItems.map((item, idx) => (
                                    <div key={idx} className="bg-neutral-50 p-8 border border-neutral-100 group transition-all hover:border-orange-200">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                            <div>
                                                <h4 className="text-base font-bold text-neutral-900 uppercase tracking-tight leading-tight">{item.label}</h4>
                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1 block">Peso Operativo: {item.weight}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 bg-white p-2 border border-neutral-100 shadow-sm">
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                                                    <button key={star} className="text-neutral-100 hover:text-orange-500 transition-colors">
                                                        <Star size={18} fill={star <= 7 ? "#ea580c" : "transparent"} className={star <= 7 ? "text-orange-600" : ""} />
                                                    </button>
                                                ))}
                                                <span className="ml-4 font-bold text-2xl text-orange-600 w-12 text-center">7.0</span>
                                            </div>
                                        </div>
                                        <textarea
                                            placeholder="REGISTRAR OBSERVACIÓN DE DESEMPEÑO..."
                                            className="w-full bg-white border border-neutral-100 p-4 text-xs font-medium outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none h-24 uppercase placeholder:text-neutral-200 font-bold"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Final Grade Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-neutral-950 border border-neutral-900 text-white p-10 shadow-2xl sticky top-10 flex flex-col items-center text-center">
                            <div className="w-32 h-32 border-4 border-orange-600 flex items-center justify-center mb-8">
                                <span className="text-5xl font-bold tracking-tighter">8.4</span>
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-orange-500 mb-2">Evaluación Final</h3>
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] max-w-[200px] leading-relaxed">Promedio Ponderado de Eficiencia Operativa</p>

                            <div className="w-full mt-12 space-y-4">
                                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-5 transition-all shadow-xl shadow-orange-600/10 uppercase tracking-[0.3em] text-[10px]">
                                    Guardar Registro Master
                                </button>
                                <button className="w-full bg-transparent border border-neutral-800 text-neutral-400 font-bold py-5 transition-all hover:bg-neutral-900 uppercase tracking-[0.3em] text-[10px]">
                                    Generar Reporte PDF
                                </button>
                            </div>

                            <p className="text-[9px] text-neutral-700 mt-12 leading-relaxed font-bold uppercase tracking-widest border-t border-neutral-900 pt-8">
                                * Umbral de Aprobación Corporativa: 7.0 / 10.0
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function EvalStatCard({ title, value, icon, color }: any) {
    const colors: any = {
        orange: "text-orange-600 bg-orange-50 border-orange-100",
        green: "text-green-600 bg-green-50 border-green-100",
    }

    return (
        <div className={`bg-white p-8 border border-neutral-100 shadow-sm transition-all hover:border-orange-600 group`}>
            <div className="flex items-center space-x-6">
                <div className={`p-4 ${colors[color]} border transition-all group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-2">{title}</p>
                    <div className="flex items-baseline space-x-3">
                        <span className="text-4xl font-bold text-neutral-900 tracking-tighter">{value}</span>
                        <div className="flex items-center text-[10px] font-bold text-green-500 uppercase tracking-widest">
                            <ArrowUpRight size={14} className="mr-1" /> 5%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}






