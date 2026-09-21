"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Users, Search, Filter, Plus, Tag, Briefcase, 
    MoreVertical, Check, X, Download, MessageSquare, 
    Phone, Mail, FileText, CheckCircle2, Shield, AlertCircle, Sparkles, ExternalLink
} from "lucide-react"
import { 
    downloadAtomicContractPDF, 
    getWhatsAppContractLink, 
    ContractData 
} from "@/lib/pdf/contractPdfGenerator"

export const ATOMIC_CATEGORIES = [
    "Cámaras & CCTV Inteligente",
    "Control de Acceso & Biometría",
    "Redes, Fibra Óptica & Telecom",
    "Domótica & Casas Inteligentes",
    "Energía Solar & Respaldo Eléctrico",
    "Ciberseguridad & Servidores",
    "Ventas Corporativas & B2B",
    "Tienda Retail & Consumo"
]

export default function AdvisorsTabContent({
    advisors,
    onRefreshAdvisors
}: {
    advisors: any[]
    onRefreshAdvisors: () => void
}) {
    const [search, setSearch] = useState("")
    const [modalityFilter, setModalityFilter] = useState<"ALL" | "FIJO" | "FREELANCE" | "INACTIVE">("ALL")
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    // Category Modal State
    const [showCategoryModal, setShowCategoryModal] = useState(false)
    const [selectedAdvisorIds, setSelectedAdvisorIds] = useState<string[]>([])
    const [targetCategory, setTargetCategory] = useState(ATOMIC_CATEGORIES[0])

    // Concept & Contract Modal State
    const [showConceptModal, setShowConceptModal] = useState(false)
    const [conceptAdvisorId, setConceptAdvisorId] = useState<string>("")
    const [conceptRoleTitle, setConceptRoleTitle] = useState("Asesor Comercial de Ventas")
    const [conceptCategory, setConceptCategory] = useState(ATOMIC_CATEGORIES[0])
    const [conceptModality, setConceptModality] = useState<"FIJO_30_DIAS" | "FREELANCE">("FIJO_30_DIAS")
    const [conceptBaseSalary, setConceptBaseSalary] = useState<number>(100)
    const [conceptBillingCycle, setConceptBillingCycle] = useState<"Semanal" | "Quincenal" | "Mensual">("Mensual")
    const [conceptBonuses, setConceptBonuses] = useState<string[]>([
        "Bono de Asistencia y Puntualidad ($20)",
        "Bono de Cumplimiento de Metas ($50)"
    ])
    const [conceptFileNote, setConceptFileNote] = useState("")

    // Helper to extract parsed profileData
    const getParsedProfile = (advisor: any) => {
        try {
            if (!advisor?.profileData) return {}
            return typeof advisor.profileData === "string" 
                ? JSON.parse(advisor.profileData) 
                : advisor.profileData
        } catch (e) {
            return {}
        }
    }

    // Filter Advisors
    const filteredAdvisors = advisors.filter(advisor => {
        const profile = getParsedProfile(advisor)
        const name = (advisor.name || "").toLowerCase()
        const email = (advisor.email || "").toLowerCase()
        const category = (profile.category || profile.area || "").toLowerCase()
        const role = (advisor.role || "").toLowerCase()
        const query = search.toLowerCase()

        const matchesSearch = name.includes(query) || email.includes(query) || category.includes(query) || role.includes(query)
        
        const modality = profile.modality || profile.laborConcept?.modality
        if (modalityFilter === "FIJO") return matchesSearch && modality === "FIJO_30_DIAS"
        if (modalityFilter === "FREELANCE") return matchesSearch && modality === "FREELANCE"
        if (modalityFilter === "INACTIVE") return matchesSearch && (advisor.status === "INACTIVE" || advisor.isActive === false)
        return matchesSearch
    })

    // Quick Modality Action
    const handleSetModality = async (advisor: any, modality: "FIJO_30_DIAS" | "FREELANCE") => {
        setActionLoading(advisor.id)
        try {
            const currentProfile = getParsedProfile(advisor)
            const updatedProfile = {
                ...currentProfile,
                modality,
                category: currentProfile.category || ATOMIC_CATEGORIES[0],
                laborConcept: {
                    modality,
                    roleTitle: advisor.role || "Asesor Comercial de Ventas",
                    category: currentProfile.category || ATOMIC_CATEGORIES[0],
                    baseSalary: modality === "FIJO_30_DIAS" ? 100 : 0,
                    billingCycle: modality === "FIJO_30_DIAS" ? "Mensual" : "Quincenal",
                    bonuses: modality === "FIJO_30_DIAS" 
                        ? ["Bono de Asistencia y Puntualidad ($20)", "Bono de Cumplimiento de Metas ($50)"]
                        : ["Bono Meta 10 ventas ($50)"],
                    startDate: new Date().toLocaleDateString("es-EC")
                }
            }

            const res = await fetch(`/api/admin/users/${advisor.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profileData: JSON.stringify(updatedProfile),
                    status: "APPROVED",
                    isActive: true
                })
            })

            if (res.ok) {
                onRefreshAdvisors()
                // Auto generate and download contract
                const contractData: ContractData = {
                    advisorName: advisor.name || "Asesor Comercial",
                    advisorEmail: advisor.email,
                    advisorPhone: advisor.phoneNumber,
                    advisorCedula: advisor.cedula,
                    modality,
                    categoryName: updatedProfile.category,
                    roleTitle: advisor.role || "Asesor Comercial de Ventas",
                    baseSalary: modality === "FIJO_30_DIAS" ? 100 : 0,
                    billingCycle: modality === "FIJO_30_DIAS" ? "Mensual" : "Quincenal",
                    bonuses: updatedProfile.laborConcept.bonuses
                }
                downloadAtomicContractPDF(contractData)
                alert(`¡Plan Laboral (${modality === "FIJO_30_DIAS" ? "Plan 30 Días" : "Freelance"}) establecido con éxito! Se ha descargado el contrato oficial.`)
            } else {
                alert("Error al actualizar la modalidad del asesor.")
            }
        } catch (e) {
            console.error(e)
            alert("Error de conexión al asignar modalidad.")
        } finally {
            setActionLoading(null)
            setActiveMenuId(null)
        }
    }

    // Deactivate / Terminate Advisor
    const handleToggleStatus = async (advisor: any, newStatus: string) => {
        setActionLoading(advisor.id)
        try {
            const res = await fetch(`/api/admin/users/${advisor.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: newStatus,
                    isActive: newStatus === "APPROVED"
                })
            })
            if (res.ok) {
                onRefreshAdvisors()
                alert(`Estado del asesor actualizado a ${newStatus}.`)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setActionLoading(null)
            setActiveMenuId(null)
        }
    }

    // Batch Category Assignment
    const handleSaveCategories = async () => {
        if (selectedAdvisorIds.length === 0) return
        setActionLoading("batch-category")
        try {
            for (const id of selectedAdvisorIds) {
                const advisor = advisors.find(a => a.id === id)
                const currentProfile = getParsedProfile(advisor)
                const updatedProfile = { ...currentProfile, category: targetCategory, area: targetCategory }
                await fetch(`/api/admin/users/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profileData: JSON.stringify(updatedProfile) })
                })
            }
            onRefreshAdvisors()
            setShowCategoryModal(false)
            setSelectedAdvisorIds([])
            alert(`Categoría "${targetCategory}" asignada exitosamente a ${selectedAdvisorIds.length} asesores.`)
        } catch (e) {
            console.error(e)
            alert("Error al asignar categorías en lote.")
        } finally {
            setActionLoading(null)
        }
    }

    // Save Labor Concept & Generate Contract
    const handleSaveConceptAndContract = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!conceptAdvisorId) return

        const advisor = advisors.find(a => a.id === conceptAdvisorId)
        if (!advisor) return

        setActionLoading("concept")
        try {
            const currentProfile = getParsedProfile(advisor)
            const laborConcept = {
                modality: conceptModality,
                roleTitle: conceptRoleTitle,
                category: conceptCategory,
                baseSalary: conceptBaseSalary,
                billingCycle: conceptBillingCycle,
                bonuses: conceptBonuses,
                fileNote: conceptFileNote || "Radicación digital automática",
                updatedAt: new Date().toISOString()
            }

            const updatedProfile = {
                ...currentProfile,
                modality: conceptModality,
                category: conceptCategory,
                laborConcept
            }

            const res = await fetch(`/api/admin/users/${advisor.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profileData: JSON.stringify(updatedProfile),
                    status: "APPROVED",
                    isActive: true
                })
            })

            if (res.ok) {
                onRefreshAdvisors()
                setShowConceptModal(false)

                const contractData: ContractData = {
                    advisorName: advisor.name || "Asesor Comercial",
                    advisorEmail: advisor.email,
                    advisorPhone: advisor.phoneNumber,
                    advisorCedula: advisor.cedula,
                    modality: conceptModality,
                    categoryName: conceptCategory,
                    roleTitle: conceptRoleTitle,
                    baseSalary: conceptBaseSalary,
                    billingCycle: conceptBillingCycle,
                    bonuses: conceptBonuses
                }
                downloadAtomicContractPDF(contractData)
                alert(`¡Concepto laboral establecido para ${advisor.name || advisor.email}! El contrato PDF ha sido generado.`)
            }
        } catch (e) {
            console.error(e)
            alert("Error al guardar concepto laboral.")
        } finally {
            setActionLoading(null)
        }
    }

    // Toggle Bonus
    const toggleBonus = (bonus: string) => {
        if (conceptBonuses.includes(bonus)) {
            setConceptBonuses(conceptBonuses.filter(b => b !== bonus))
        } else {
            setConceptBonuses([...conceptBonuses, bonus])
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Toolbar Header */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
                
                {/* Search & Modality Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-1 max-w-2xl">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar asesor por nombre, email, categoría o rol..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {[
                            { id: "ALL", label: "Todos" },
                            { id: "FIJO", label: "Plan 30 Días" },
                            { id: "FREELANCE", label: "Comisión" },
                            { id: "INACTIVE", label: "Inactivos" },
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setModalityFilter(f.id as any)}
                                className={`px-3 py-2 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                    modalityFilter === f.id
                                        ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    <button
                        onClick={() => setShowCategoryModal(true)}
                        className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <Tag size={14} className="text-cyan-400" />
                        <span>Asignar Categoría</span>
                    </button>

                    <button
                        onClick={() => {
                            if (advisors.length > 0) setConceptAdvisorId(advisors[0].id)
                            setShowConceptModal(true)
                        }}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:scale-105 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                    >
                        <Briefcase size={14} />
                        <span>+ Establecer Concepto Laboral</span>
                    </button>
                </div>
            </div>

            {/* Advisors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredAdvisors.length === 0 ? (
                    <div className="col-span-full py-20 text-center space-y-3 bg-slate-900/40 border border-slate-800 rounded-3xl">
                        <Users size={36} className="mx-auto text-slate-600" />
                        <p className="text-slate-400 text-sm font-medium">No se encontraron asesores con ese criterio.</p>
                    </div>
                ) : (
                    filteredAdvisors.map(advisor => {
                        const profile = getParsedProfile(advisor)
                        const modality = profile.modality || profile.laborConcept?.modality
                        const category = profile.category || profile.area || "General Ecosistema"
                        const roles = (advisor.role || "SALESPERSON").split(",").map((r: string) => r.trim()).filter(Boolean)
                        const isInactive = advisor.status === "INACTIVE" || advisor.isActive === false
                        const firstLetter = (advisor.name || advisor.email)?.[0]?.toUpperCase() || "A"

                        const contractData: ContractData = {
                            advisorName: advisor.name || "Asesor Comercial",
                            advisorEmail: advisor.email,
                            advisorPhone: advisor.phoneNumber,
                            advisorCedula: advisor.cedula,
                            modality: modality === "FIJO_30_DIAS" ? "FIJO_30_DIAS" : "FREELANCE",
                            categoryName: category,
                            roleTitle: advisor.role || "Asesor Comercial de Ventas",
                            baseSalary: modality === "FIJO_30_DIAS" ? 100 : 0,
                            billingCycle: profile.laborConcept?.billingCycle || "Mensual",
                            bonuses: profile.laborConcept?.bonuses || ["Bono Asistencia ($20)"]
                        }

                        const waContractLink = getWhatsAppContractLink(contractData)

                        return (
                            <div
                                key={advisor.id}
                                className="bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/40 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all group relative"
                            >
                                {/* Card Top: Avatar, Name & 3-Dots */}
                                <div>
                                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative shrink-0">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center font-black text-cyan-300 text-base overflow-hidden">
                                                    {advisor.profilePicture ? (
                                                        <img src={advisor.profilePicture} alt="User" className="w-full h-full object-cover" />
                                                    ) : (
                                                        firstLetter
                                                    )}
                                                </div>
                                                <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                                                    isInactive ? 'bg-rose-500' : modality === 'FIJO_30_DIAS' ? 'bg-emerald-400' : 'bg-amber-400'
                                                }`} />
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="text-white font-bold text-sm truncate">{advisor.name || "Asesor Comercial"}</h3>
                                                <p className="text-slate-400 text-xs truncate mt-0.5">{advisor.email}</p>
                                                {advisor.phoneNumber && (
                                                    <p className="text-[11px] text-cyan-400/90 font-mono mt-0.5 flex items-center gap-1">
                                                        <Phone size={10} /> {advisor.phoneNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* 3-Dots Dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setActiveMenuId(activeMenuId === advisor.id ? null : advisor.id)}
                                                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                            >
                                                <MoreVertical size={16} />
                                            </button>

                                            {activeMenuId === advisor.id && (
                                                <div className="absolute right-0 top-10 w-48 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-30 space-y-1">
                                                    <button
                                                        onClick={() => {
                                                            setConceptAdvisorId(advisor.id)
                                                            setShowConceptModal(true)
                                                            setActiveMenuId(null)
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl flex items-center gap-2"
                                                    >
                                                        <Briefcase size={13} className="text-cyan-400" />
                                                        <span>Establecer Concepto</span>
                                                    </button>

                                                    {isInactive ? (
                                                        <button
                                                            onClick={() => handleToggleStatus(advisor, "APPROVED")}
                                                            className="w-full text-left px-3 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded-xl flex items-center gap-2"
                                                        >
                                                            <CheckCircle2 size={13} />
                                                            <span>Reactivar Asesor</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleToggleStatus(advisor, "INACTIVE")}
                                                            className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2"
                                                        >
                                                            <X size={13} />
                                                            <span>Dar de Baja / Pausar</span>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Roles & Category Tags */}
                                    <div className="py-3 space-y-2 border-b border-slate-800/80">
                                        <div className="flex flex-wrap gap-1.5">
                                            {roles.map((r: string, idx: number) => (
                                                <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-mono text-[9px] font-bold uppercase">
                                                    {r}
                                                </span>
                                            ))}
                                            <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-[10px] flex items-center gap-1">
                                                <Tag size={10} /> {category}
                                            </span>
                                        </div>

                                        {/* Modality Status Box */}
                                        <div className={`p-2.5 rounded-2xl border ${
                                            isInactive 
                                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                                : modality === 'FIJO_30_DIAS'
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                                    : modality === 'FREELANCE'
                                                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                                        : 'bg-slate-950 border-slate-800 text-slate-400'
                                        }`}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                    <Sparkles size={11} />
                                                    {isInactive 
                                                        ? "ESTADO: INACTIVO / DE BAJA" 
                                                        : modality === 'FIJO_30_DIAS' 
                                                            ? "PLAN FIJO 30 DÍAS • $100 -> $450" 
                                                            : modality === 'FREELANCE' 
                                                                ? "BAJO COMISIÓN FREELANCE" 
                                                                : "MODALIDAD SIN DEFINIR"}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1 font-sans">
                                                {modality === 'FIJO_30_DIAS' 
                                                    ? "7 Actividades Diarias • Máx 2h/día • Evidencia WhatsApp & Web" 
                                                    : modality === 'FREELANCE' 
                                                        ? "Asistencia >4x/sem • >=1 venta en 3 meses • Comisiones puras" 
                                                        : "Haz clic en 'Iniciar Plan Laboral' o 'Bajo Comisión' para activar."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions Bottom */}
                                <div className="pt-3 space-y-2.5">
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleSetModality(advisor, "FIJO_30_DIAS")}
                                            disabled={actionLoading === advisor.id}
                                            className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] disabled:opacity-50 flex items-center justify-center gap-1"
                                        >
                                            <CheckCircle2 size={12} />
                                            <span>Iniciar Plan 30D</span>
                                        </button>

                                        <button
                                            onClick={() => handleSetModality(advisor, "FREELANCE")}
                                            disabled={actionLoading === advisor.id}
                                            className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-[10px] uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                                        >
                                            <span>Bajo Comisión</span>
                                        </button>
                                    </div>

                                    {/* Contract PDF & WhatsApp Actions */}
                                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                                        <button
                                            onClick={() => downloadAtomicContractPDF(contractData)}
                                            className="flex-1 py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
                                            title="Descargar Contrato PDF Oficial"
                                        >
                                            <Download size={12} className="text-cyan-400" />
                                            <span>Contrato PDF</span>
                                        </button>

                                        <a
                                            href={waContractLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
                                            title="Enviar formalmente por WhatsApp"
                                        >
                                            <MessageSquare size={12} className="text-emerald-400" />
                                            <span>WhatsApp</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* ── MODAL 1: ASIGNAR CATEGORÍA ── */}
            <AnimatePresence>
                {showCategoryModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
                        >
                            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                <h3 className="text-white font-bold text-base flex items-center gap-2">
                                    <Tag className="text-cyan-400" size={18} /> Asignar Categoría a Asesores
                                </h3>
                                <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Seleccionar Categoría ATOMIC:</label>
                                <select
                                    value={targetCategory}
                                    onChange={e => setTargetCategory(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white outline-none focus:border-cyan-400"
                                >
                                    {ATOMIC_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Seleccionar Asesores ({selectedAdvisorIds.length}):</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (selectedAdvisorIds.length === advisors.length) setSelectedAdvisorIds([])
                                            else setSelectedAdvisorIds(advisors.map(a => a.id))
                                        }}
                                        className="text-[10px] text-cyan-400 font-mono hover:underline"
                                    >
                                        {selectedAdvisorIds.length === advisors.length ? "Deseleccionar Todos" : "Seleccionar Todos"}
                                    </button>
                                </div>
                                
                                <div className="max-h-56 overflow-y-auto space-y-1.5 p-2 bg-slate-950 border border-slate-800 rounded-2xl">
                                    {advisors.map(advisor => {
                                        const isSelected = selectedAdvisorIds.includes(advisor.id)
                                        return (
                                            <div
                                                key={advisor.id}
                                                onClick={() => {
                                                    if (isSelected) setSelectedAdvisorIds(selectedAdvisorIds.filter(id => id !== advisor.id))
                                                    else setSelectedAdvisorIds([...selectedAdvisorIds, advisor.id])
                                                }}
                                                className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                                                    isSelected ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' : 'border-slate-800/80 text-slate-300 hover:bg-slate-900'
                                                }`}
                                            >
                                                <span className="font-bold">{advisor.name || advisor.email}</span>
                                                {isSelected && <Check size={14} className="text-cyan-400" />}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                                <button
                                    onClick={() => setShowCategoryModal(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveCategories}
                                    disabled={selectedAdvisorIds.length === 0 || actionLoading === "batch-category"}
                                    className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-40"
                                >
                                    Aplicar Categoría
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── MODAL 2: + ESTABLECER CONCEPTO LABORAL & GENERADOR DE CONTRATO ── */}
            <AnimatePresence>
                {showConceptModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
                        <motion.form
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onSubmit={handleSaveConceptAndContract}
                            className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 my-auto"
                        >
                            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                <div>
                                    <h3 className="text-white font-black text-base flex items-center gap-2">
                                        <Briefcase className="text-cyan-400" size={18} /> Establecer Concepto Laboral & Contrato Oficial
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Define condiciones, bonos, escala y descarga el documento contractual oficial.</p>
                                </div>
                                <button type="button" onClick={() => setShowConceptModal(false)} className="text-slate-400 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Colaborador / Asesor:</label>
                                    <select
                                        value={conceptAdvisorId}
                                        onChange={e => setConceptAdvisorId(e.target.value)}
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                                    >
                                        {advisors.map(a => (
                                            <option key={a.id} value={a.id}>{a.name || a.email}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Cargo / Título Oficial:</label>
                                    <input
                                        type="text"
                                        value={conceptRoleTitle}
                                        onChange={e => setConceptRoleTitle(e.target.value)}
                                        required
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Categoría Asignada:</label>
                                    <select
                                        value={conceptCategory}
                                        onChange={e => setConceptCategory(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                                    >
                                        {ATOMIC_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Modalidad de Vinculación:</label>
                                    <select
                                        value={conceptModality}
                                        onChange={e => {
                                            const mod = e.target.value as any
                                            setConceptModality(mod)
                                            if (mod === "FIJO_30_DIAS") setConceptBaseSalary(100)
                                            else setConceptBaseSalary(0)
                                        }}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                                    >
                                        <option value="FIJO_30_DIAS">{"Plan Fijo 30 Días ($100 -> $450 - 7 Actividades)"}</option>
                                        <option value="FREELANCE">{"Freelance Bajo Comisión (Asistencia > 4x/sem)"}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Sueldo Base Inicial ($ USD):</label>
                                    <input
                                        type="number"
                                        value={conceptBaseSalary}
                                        onChange={e => setConceptBaseSalary(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Ciclo de Liquidación:</label>
                                    <select
                                        value={conceptBillingCycle}
                                        onChange={e => setConceptBillingCycle(e.target.value as any)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                                    >
                                        <option value="Semanal">Semanal</option>
                                        <option value="Quincenal">Quincenal</option>
                                        <option value="Mensual">Mensual</option>
                                    </select>
                                </div>
                            </div>

                            {/* Bonus Checklist */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-2">Bonos e Incentivos Aplicables:</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {[
                                        "Bono de Asistencia y Puntualidad ($20)",
                                        "Bono de Cumplimiento de Metas ($50)",
                                        "Bono por Prospección Activa ($30)",
                                        "Bono Fidelidad de Cartera ($25)"
                                    ].map(b => (
                                        <label key={b} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs flex items-center gap-2 cursor-pointer text-slate-300">
                                            <input
                                                type="checkbox"
                                                checked={conceptBonuses.includes(b)}
                                                onChange={() => toggleBonus(b)}
                                                className="rounded border-slate-700 bg-slate-900 text-cyan-400"
                                            />
                                            <span>{b}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* File / Digital Radication Note */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Nota de Radicación / Archivo Adjunto (Opcional):</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Contrato firmado recibido por WhatsApp o expediente digital..."
                                    value={conceptFileNote}
                                    onChange={e => setConceptFileNote(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowConceptModal(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading === "concept"}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                                >
                                    <Sparkles size={14} />
                                    <span>Guardar y Generar Contrato PDF</span>
                                </button>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>

        </div>
    )
}
