"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, Upload, CheckCircle2, AlertCircle, FileSignature, Timer, UserCheck, ShieldAlert, ChevronRight } from "lucide-react"

export default function ContractsEvidencePage() {
    // Role simulation (Admin vs Salesperson)
    const isAdmin = true // In a real app, this would come from session

    const [contracts, setContracts] = useState([
        { id: 1, user: "Carlos Rodriguez", status: "pending", date: "2026-03-05", file: "contrato_carlos.pdf" },
        { id: 2, user: "Ana Martinez", status: "approved", date: "2026-02-15", cycleStart: "2026-02-16", file: "contrato_ana.pdf" },
    ])

    const [weeks] = useState([
        { id: 1, start: "Día 1", end: "Día 7", status: "completed", type: "Inducción" },
        { id: 2, start: "Día 8", end: "Día 14", status: "pending", type: "Prospección" },
        { id: 3, start: "Día 15", end: "Día 21", status: "upcoming", type: "Ventas" },
        { id: 4, start: "Día 22", end: "Día 30", status: "upcoming", type: "Cierre" },
    ])

    const handleApprove = (id: number) => {
        setContracts(contracts.map(c =>
            c.id === id ? { ...c, status: "approved", cycleStart: new Date().toISOString().split('T')[0] } : c
        ))
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900  uppercase ">
                        Contratos & <span className="text-orange-600">Ciclo Laboral</span>
                    </h1>
                    <p className="text-neutral-500  font-medium">Gestión de vinculación legal y seguimiento del programa de 30 días.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Panel: Contract Management */}
                <div className="lg:col-span-1 space-y-6">
                    {isAdmin ? (
                        <div className="bg-white  rounded-none border border-neutral-200  shadow-sm overflow-hidden flex flex-col">
                            <div className="p-8 border-b border-neutral-50 ">
                                <h2 className="text-xl font-bold text-neutral-900  uppercase tracking-tight flex items-center">
                                    <ShieldAlert size={22} className="mr-3 text-orange-600" /> Solicitudes Pendientes
                                </h2>
                            </div>
                            <div className="p-4 space-y-4">
                                {contracts.filter(c => c.status === "pending").map(contract => (
                                    <div key={contract.id} className="bg-neutral-50  p-6 rounded-none border border-neutral-100 ">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 bg-orange-100 rounded-none flex items-center justify-center text-orange-600 font-bold">{contract.user[0]}</div>
                                            <div>
                                                <p className="text-sm font-bold text-neutral-900 ">{contract.user}</p>
                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{contract.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <button className="w-full bg-neutral-200  hover:bg-neutral-300 :bg-neutral-700 text-neutral-700  py-2 rounded-none text-xs font-bold transition-all flex items-center justify-center">
                                                <FileSignature size={14} className="mr-2" /> Revisar Documento
                                            </button>
                                            <button
                                                onClick={() => handleApprove(contract.id)}
                                                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-none text-xs font-bold transition-all shadow-lg shadow-orange-500/20"
                                            >
                                                Aprobar y Activar Ciclo
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white  rounded-none border border-neutral-200  shadow-sm p-8 text-center">
                            <div className="w-20 h-20 bg-orange-50  text-orange-600 rounded-none flex items-center justify-center mx-auto mb-6">
                                <FileSignature size={40} />
                            </div>
                            <h2 className="text-xl font-bold text-neutral-900  uppercase mb-2">Mi Contrato</h2>
                            <p className="text-sm text-neutral-500 mb-8 font-medium">Sube tu contrato firmado para iniciar tu ciclo de 30 días.</p>
                            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-none flex items-center justify-center transition-all shadow-xl shadow-orange-500/20 active:scale-95 text-xs uppercase tracking-[0.2em]">
                                <Upload size={18} className="mr-2" /> Cargar PDF
                            </button>
                        </div>
                    )}

                    {/* Cycle Indicator for Salesperson */}
                    {!isAdmin && (
                        <div className="bg-neutral-950 rounded-none p-8 text-white border border-neutral-800">
                            <div className="flex items-center space-x-2 text-orange-500 mb-4">
                                <Timer size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Estado del Ciclo</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">Día 14 <span className="text-xs text-neutral-500">/ 30</span></h3>
                            <div className="w-full bg-neutral-800 h-2 rounded-none overflow-hidden mt-4">
                                <div className="bg-orange-600 h-full" style={{ width: '46%' }}></div>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-4 uppercase font-bold tracking-widest">Faltan 16 días para revisión final</p>
                        </div>
                    )}
                </div>

                {/* Right Panel: 30-Day Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white  rounded-none border border-neutral-200  shadow-sm p-8">
                        <div className="flex justify-between items-center mb-8 border-b border-neutral-50  pb-4">
                            <h2 className="text-2xl font-bold text-neutral-900  uppercase tracking-tight flex items-center">
                                <CalendarIcon size={24} className="mr-3 text-orange-600" /> Plan de Desarrollo (30 días)
                            </h2>
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50  px-3 py-1.5 rounded-none uppercase tracking-widest">
                                Inicio: {contracts.find(c => c.status === 'approved')?.cycleStart || 'Pendiente'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {weeks.map((week) => (
                                <div key={week.id} className={`p-6 rounded-none border-2 transition-all flex flex-col justify-between ${week.status === 'completed' ? 'border-green-100 bg-green-50/20  ' :
                                    week.status === 'pending' ? 'border-orange-200 bg-orange-50/50  shadow-lg shadow-orange-500/10 scale-105' :
                                        'border-neutral-100 bg-neutral-50/50   opacity-40 grayscale'
                                    }`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-none ${week.status === 'completed' ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'}`}>
                                                {week.type}
                                            </span>
                                            <h4 className="text-xl font-bold text-neutral-900  mt-2">Semana {week.id}</h4>
                                            <p className="text-xs font-bold text-neutral-500  uppercase tracking-widest">{week.start} - {week.end}</p>
                                        </div>
                                        {week.status === 'completed' ? (
                                            <div className="w-10 h-10 bg-green-500 rounded-none flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                                                <CheckCircle2 size={24} />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 bg-orange-100 rounded-none flex items-center justify-center text-orange-600">
                                                <CalendarIcon size={24} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-neutral-100  flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                            {week.status === 'completed' ? 'Verificado' : week.status === 'pending' ? 'Acción Requerida' : 'Bloqueado'}
                                        </span>
                                        {week.status === 'pending' && (
                                            <button className="text-orange-600 hover:text-orange-700 font-bold text-sm uppercase flex items-center transition-all hover:translate-x-1">
                                                Subir <ChevronRight size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}







