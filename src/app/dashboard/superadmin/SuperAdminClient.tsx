"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { 
    Shield, Key, Users, Layers, Cpu, Wrench, ShoppingBag, 
    Sparkles, CheckCircle2, XCircle, Search, Edit3, Trash2, 
    Plus, Download, RefreshCw, Eye, EyeOff, Bot, Globe, 
    FileText, DollarSign, BarChart3, GraduationCap, ChevronRight,
    Lock, Unlock, ArrowDown, Network, Box, X, UserPlus, UserMinus
} from "lucide-react"

export interface RolePermissionSchema {
    roleId: string
    roleName: string
    department: string
    color: string
    badge: string
    description: string
    canRead: boolean
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
    canExport: boolean
    canViewCostsAndRoi: boolean
    hasDedicatedBot: boolean
    activeUsersCount: number
    keyModules: string[]
}

const INITIAL_ROLES_PERMISSIONS: RolePermissionSchema[] = [
    {
        roleId: "SUPER_ADMIN",
        roleName: "Super Administrador (Admin Central)",
        department: "Dirección General",
        color: "from-rose-500/20 to-red-600/20 border-rose-500/40 text-rose-300",
        badge: "CONTROL TOTAL",
        description: "Acceso irrestricto a todas las bases de datos, tokens de Meta, servidores, finanzas y control de usuarios.",
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canExport: true,
        canViewCostsAndRoi: true,
        hasDedicatedBot: true,
        activeUsersCount: 1,
        keyModules: ["Todos los Módulos", "Tokens Meta", "Base de Datos Supabase", "Finanzas Globales"]
    },
    {
        roleId: "GERENCIA",
        roleName: "Gerencia General (Management)",
        department: "Dirección General",
        color: "from-purple-500/20 to-indigo-600/20 border-purple-500/40 text-purple-300",
        badge: "ALTA DIRECCIÓN",
        description: "Supervisión estratégica de ventas, finanzas, métricas de cumplimiento, balance de comisiones y presupuestos.",
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canExport: true,
        canViewCostsAndRoi: true,
        hasDedicatedBot: true,
        activeUsersCount: 2,
        keyModules: ["Analytics", "Finanzas", "Evaluaciones RRHH", "Planes Trimestrales"]
    },
    {
        roleId: "COORDINACION",
        roleName: "Coordinación Operativa",
        department: "Nivel Táctico & Control",
        color: "from-amber-500/20 to-orange-600/20 border-amber-500/40 text-amber-300",
        badge: "GESTIÓN DE EQUIPOS",
        description: "Asignación de prospectos y leads de pauta a asesores, apertura/cierre de jornada, control de metas semanales.",
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canExport: true,
        canViewCostsAndRoi: true,
        hasDedicatedBot: true,
        activeUsersCount: 3,
        keyModules: ["Coordinación Diaria", "Asistencia & Metas", "Matriz Precios Admin", "CRM WhatsApp"]
    },
    {
        roleId: "SUPERVISION",
        roleName: "Supervisión & Calidad",
        department: "Nivel Táctico & Control",
        color: "from-blue-500/20 to-cyan-600/20 border-blue-500/40 text-blue-300",
        badge: "AUDITORÍA EN VIVO",
        description: "Auditoría en tiempo real de chats de WhatsApp, proformas emitidas, cumplimiento de políticas y calidad de atención.",
        canRead: true,
        canCreate: false,
        canEdit: true,
        canDelete: false,
        canExport: true,
        canViewCostsAndRoi: false,
        hasDedicatedBot: false,
        activeUsersCount: 2,
        keyModules: ["Supervisión en Vivo", "Auditoría CRM", "Historial de Clientes"]
    },
    {
        roleId: "VENTAS",
        roleName: "Asesores de Ventas (Comercial)",
        department: "Célula Comercial",
        color: "from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300",
        badge: "VENTA DIRECTA",
        description: "Generación de propuestas formales en PDF, atención por WhatsApp CRM, radar satelital y catálogo de precios PVP.",
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canExport: true,
        canViewCostsAndRoi: false,
        hasDedicatedBot: true,
        activeUsersCount: 14,
        keyModules: ["Cotizador PDF", "CRM WhatsApp", "Matriz Precios PVP", "Radar Prospección"]
    },
    {
        roleId: "TECNICOS",
        roleName: "Técnicos & Soporte de Campo",
        department: "Célula de Campo",
        color: "from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-300",
        badge: "INSTALACIONES",
        description: "Agenda de visitas técnicas, protocolos de montaje de torniquetes, cercos y citofonía, levantamientos técnicos.",
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canExport: true,
        canViewCostsAndRoi: false,
        hasDedicatedBot: true,
        activeUsersCount: 4,
        keyModules: ["Portal Técnicos", "Agenda de Visitas", "Checklists de Calidad", "Escáner Bodega"]
    },
    {
        roleId: "EDICION",
        roleName: "Edición & Media Multimedia",
        department: "Célula de Crecimiento & Media",
        color: "from-pink-500/20 to-rose-600/20 border-pink-500/40 text-pink-300",
        badge: "CONTENIDO SOCIAL",
        description: "Social Command Center para redes (FB/IG/TikTok/YT), redacción de artículos de blog, fotografía y fichas técnicas.",
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canExport: false,
        canViewCostsAndRoi: false,
        hasDedicatedBot: false,
        activeUsersCount: 2,
        keyModules: ["Social Command", "Blogs & SEO", "Gestión de Fichas", "Nube & Archivos"]
    },
    {
        roleId: "PUBLICIDAD",
        roleName: "Publicidad & Pauta Meta/Google",
        department: "Célula de Crecimiento & Media",
        color: "from-yellow-500/20 to-amber-600/20 border-yellow-500/40 text-yellow-300",
        badge: "TRÁFICO PAGADO",
        description: "Control de presupuesto mensual publicitario, campañas de pauta Meta Ads, cálculo de CPA, ROAS y derivación de leads.",
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canExport: true,
        canViewCostsAndRoi: true,
        hasDedicatedBot: false,
        activeUsersCount: 2,
        keyModules: ["Marketing Pauta", "Leads Meta", "Presupuestos Ads", "Métricas ROI"]
    },
    {
        roleId: "SOFTWARE",
        roleName: "Software, Infraestructura & IA",
        department: "Célula de Tecnología & Sistemas",
        color: "from-emerald-500/20 to-cyan-600/20 border-emerald-500/40 text-emerald-300",
        badge: "ARQUITECTURA IT",
        description: "Consola de software, conexión a NVIDIA NIM Llama 90B, monitoreo de servidor Render, webhooks Meta y bases de datos.",
        canRead: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canExport: true,
        canViewCostsAndRoi: true,
        hasDedicatedBot: true,
        activeUsersCount: 2,
        keyModules: ["Portal Software", "Consola NVIDIA", "Servidores Render", "Supabase DB"]
    },
    {
        roleId: "ASPIRANTES",
        roleName: "Aspirantes a Ventas (Reclutamiento)",
        department: "Célula Externa & Onboarding",
        color: "from-slate-700/30 to-slate-800/30 border-slate-700 text-slate-300",
        badge: "EN CAPACITACIÓN",
        description: "Acceso exclusivo a lecciones de inducción en Academia ATOMIC, Plan Laboral 30 Días y exámenes de certificación.",
        canRead: true,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canExport: false,
        canViewCostsAndRoi: false,
        hasDedicatedBot: true,
        activeUsersCount: 28,
        keyModules: ["Academia Cursos", "Plan 30 Días", "Certificaciones"]
    },
    {
        roleId: "CLIENTES",
        roleName: "Clientes Web & B2B",
        department: "Célula Externa & Onboarding",
        color: "from-teal-500/20 to-cyan-700/20 border-teal-500/40 text-teal-300",
        badge: "COMPRADORES",
        description: "Navegación en catálogo público, cotizador online express, carritos de compras y seguimiento de facturación.",
        canRead: true,
        canCreate: true,
        canEdit: false,
        canDelete: false,
        canExport: true,
        canViewCostsAndRoi: false,
        hasDedicatedBot: false,
        activeUsersCount: 450,
        keyModules: ["Tienda Web", "Cotizador Público", "Catálogo B2B"]
    }
]

export default function SuperAdminClient() {
    const { data: session } = useSession()
    const [roles, setRoles] = useState<RolePermissionSchema[]>(INITIAL_ROLES_PERMISSIONS)
    const [search, setSearch] = useState("")
    const [activeTab, setActiveTab] = useState<"permissions" | "org_tree">("permissions")
    const [savedNotification, setSavedNotification] = useState<string | null>(null)

    // Modal Create Role / Profile
    const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
    const [newRoleForm, setNewRoleForm] = useState({
        roleId: "",
        roleName: "",
        department: "Célula Comercial",
        badge: "NUEVA FUNCIÓN",
        description: "",
        canRead: true,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canExport: false,
        canViewCostsAndRoi: false,
        hasDedicatedBot: false,
        initialModules: "Dashboard, Reportes"
    })

    // Drawer / Modal Edit Role Functions
    const [editingRole, setEditingRole] = useState<RolePermissionSchema | null>(null)
    const [newModuleInput, setNewModuleInput] = useState("")

    // Load custom roles from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("atomic_superadmin_roles")
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setRoles(parsed)
                    }
                } catch (_) {}
            }
        }
    }, [])

    const persistRoles = (updated: RolePermissionSchema[]) => {
        setRoles(updated)
        if (typeof window !== "undefined") {
            localStorage.setItem("atomic_superadmin_roles", JSON.stringify(updated))
        }
    }

    const showToast = (msg: string) => {
        setSavedNotification(msg)
        setTimeout(() => setSavedNotification(null), 3500)
    }

    // Toggle Permission boolean
    const togglePermission = (roleId: string, field: keyof RolePermissionSchema) => {
        const updated = roles.map(r => {
            if (r.roleId === roleId) {
                return { ...r, [field]: !r[field] }
            }
            return r
        })
        persistRoles(updated)
        showToast("Permiso actualizado en tiempo real")
    }

    // Adjust Member Count (+1 / -1)
    const adjustMemberCount = (roleId: string, delta: number) => {
        const updated = roles.map(r => {
            if (r.roleId === roleId) {
                const nextCount = Math.max(0, r.activeUsersCount + delta)
                return { ...r, activeUsersCount: nextCount }
            }
            return r
        })
        persistRoles(updated)
        showToast(delta > 0 ? "Miembro añadido al organigrama" : "Miembro removido del organigrama")
    }

    // Delete Role
    const handleDeleteRole = (roleId: string, roleName: string) => {
        if (roleId === "SUPER_ADMIN") {
            alert("No se puede eliminar la cuenta matriz SUPER_ADMIN.")
            return
        }
        if (!confirm(`¿Estás seguro de eliminar el perfil "${roleName}" del organigrama y de los permisos?`)) {
            return
        }
        const updated = roles.filter(r => r.roleId !== roleId)
        persistRoles(updated)
        if (editingRole?.roleId === roleId) setEditingRole(null)
        showToast(`Perfil "${roleName}" eliminado del organigrama en vivo`)
    }

    // Add function/module tag to role
    const handleAddModule = (roleId: string) => {
        if (!newModuleInput.trim()) return
        const tag = newModuleInput.trim()
        const updated = roles.map(r => {
            if (r.roleId === roleId) {
                if (!r.keyModules.includes(tag)) {
                    return { ...r, keyModules: [...r.keyModules, tag] }
                }
            }
            return r
        })
        persistRoles(updated)
        if (editingRole && editingRole.roleId === roleId) {
            setEditingRole(prev => prev ? { ...prev, keyModules: [...prev.keyModules, tag] } : null)
        }
        setNewModuleInput("")
        showToast(`Función "${tag}" añadida al perfil`)
    }

    // Remove function/module tag from role
    const handleRemoveModule = (roleId: string, tag: string) => {
        const updated = roles.map(r => {
            if (r.roleId === roleId) {
                return { ...r, keyModules: r.keyModules.filter(m => m !== tag) }
            }
            return r
        })
        persistRoles(updated)
        if (editingRole && editingRole.roleId === roleId) {
            setEditingRole(prev => prev ? { ...prev, keyModules: prev.keyModules.filter(m => m !== tag) } : null)
        }
        showToast(`Función "${tag}" retirada del perfil`)
    }

    // Handle Create New Role
    const handleCreateRole = (e: React.FormEvent) => {
        e.preventDefault()
        const cleanId = (newRoleForm.roleId || newRoleForm.roleName).trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_")
        
        if (roles.some(r => r.roleId === cleanId)) {
            alert("Ya existe un perfil con este identificador.")
            return
        }

        const modulesArr = newRoleForm.initialModules
            .split(",")
            .map(m => m.trim())
            .filter(Boolean)

        const created: RolePermissionSchema = {
            roleId: cleanId,
            roleName: newRoleForm.roleName.trim(),
            department: newRoleForm.department,
            color: "from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-300",
            badge: newRoleForm.badge.trim().toUpperCase(),
            description: newRoleForm.description.trim() || `Perfil operativo de ${newRoleForm.roleName}`,
            canRead: newRoleForm.canRead,
            canCreate: newRoleForm.canCreate,
            canEdit: newRoleForm.canEdit,
            canDelete: newRoleForm.canDelete,
            canExport: newRoleForm.canExport,
            canViewCostsAndRoi: newRoleForm.canViewCostsAndRoi,
            hasDedicatedBot: newRoleForm.hasDedicatedBot,
            activeUsersCount: 1,
            keyModules: modulesArr.length > 0 ? modulesArr : ["Acceso Básico"]
        }

        const updated = [...roles, created]
        persistRoles(updated)
        setIsCreateRoleOpen(false)
        setNewRoleForm({
            roleId: "",
            roleName: "",
            department: "Célula Comercial",
            badge: "NUEVA FUNCIÓN",
            description: "",
            canRead: true,
            canCreate: false,
            canEdit: false,
            canDelete: false,
            canExport: false,
            canViewCostsAndRoi: false,
            hasDedicatedBot: false,
            initialModules: "Dashboard, Reportes"
        })
        showToast(`✅ Nuevo perfil "${created.roleName}" integrado en vivo al organigrama`)
    }

    const exportPermissionsJSON = () => {
        const json = JSON.stringify(roles, null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `ORGANIGRAMA_PERMISOS_ATOMIC_${new Date().toISOString().split("T")[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
        showToast("Esquema descargado exitosamente")
    }

    const filteredRoles = roles.filter(r => 
        r.roleName.toLowerCase().includes(search.toLowerCase()) || 
        r.department.toLowerCase().includes(search.toLowerCase()) ||
        r.roleId.toLowerCase().includes(search.toLowerCase())
    )

    // Group roles by department for the conceptual tree
    const departments = Array.from(new Set(roles.map(r => r.department)))

    return (
        <div className="min-h-screen bg-[#050914] text-white p-4 md:p-8 space-y-8 font-sans">
            
            {/* Toast Notification */}
            {savedNotification && (
                <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-cyan-500 text-slate-950 text-xs font-mono font-black uppercase shadow-2xl animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
                    <Sparkles size={16} />
                    <span>{savedNotification}</span>
                </div>
            )}

            {/* Header */}
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.3)]">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                            <span>SUPER ADMIN · Control Maestro & Mapa Conceptual</span>
                            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                ROOT CONTROL
                            </span>
                        </h1>
                        <p className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest mt-1">
                            Edición en Vivo de Perfiles · Asignación de Funciones · Organigrama Dinámico
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCreateRoleOpen(true)}
                        className="px-6 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Crear Nuevo Perfil</span>
                    </button>

                    <button
                        onClick={exportPermissionsJSON}
                        className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <Download size={15} />
                        <span>Exportar JSON</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-3 border-b border-slate-800 pb-3">
                <button
                    onClick={() => setActiveTab("permissions")}
                    className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                        activeTab === "permissions"
                            ? "bg-rose-500/20 border border-rose-500/40 text-rose-300 shadow-lg"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                >
                    <Key size={16} />
                    <span>Matriz de Permisos & Control ({roles.length} Roles)</span>
                </button>

                <button
                    onClick={() => setActiveTab("org_tree")}
                    className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                        activeTab === "org_tree"
                            ? "bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-lg"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                >
                    <Network size={16} />
                    <span>Organigrama Dinámico en Vivo (Mapa Conceptual)</span>
                </button>
            </div>

            {/* TAB 1: MATRIZ DE PERMISOS */}
            {activeTab === "permissions" && (
                <div className="space-y-6">
                    {/* Search bar */}
                    <div className="flex gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-3 text-slate-500" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar por rol, departamento o funciones..."
                                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl pl-11 pr-4 py-2.5 outline-none focus:border-rose-400 transition-all"
                            />
                        </div>
                    </div>

                    {/* Master Permissions Table */}
                    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-sans">
                                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4">Rol & Departamento</th>
                                        <th className="px-4 py-4 text-center">Miembros</th>
                                        <th className="px-4 py-4 text-center">Ver</th>
                                        <th className="px-4 py-4 text-center">Crear</th>
                                        <th className="px-4 py-4 text-center">Editar</th>
                                        <th className="px-4 py-4 text-center">Eliminar</th>
                                        <th className="px-4 py-4 text-center">Exportar</th>
                                        <th className="px-4 py-4 text-center">Costos/ROI</th>
                                        <th className="px-4 py-4 text-center">Bot IA</th>
                                        <th className="px-6 py-4">Funciones Asignadas</th>
                                        <th className="px-4 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {filteredRoles.map(role => (
                                        <tr key={role.roleId} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-white text-xs">
                                                        {role.roleId.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm">{role.roleName}</div>
                                                        <div className="text-[10px] font-mono text-cyan-400">{role.department} · {role.badge}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Members count */}
                                            <td className="px-4 py-4 text-center">
                                                <div className="inline-flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                                                    <button
                                                        onClick={() => adjustMemberCount(role.roleId, -1)}
                                                        className="text-slate-500 hover:text-rose-400 p-0.5"
                                                        title="Restar miembro"
                                                    >
                                                        <UserMinus size={12} />
                                                    </button>
                                                    <span className="font-mono font-bold text-white text-xs min-w-[16px]">
                                                        {role.activeUsersCount}
                                                    </span>
                                                    <button
                                                        onClick={() => adjustMemberCount(role.roleId, 1)}
                                                        className="text-slate-500 hover:text-emerald-400 p-0.5"
                                                        title="Añadir miembro"
                                                    >
                                                        <UserPlus size={12} />
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Permission Toggles */}
                                            <td className="px-4 py-4 text-center">
                                                <button 
                                                    onClick={() => togglePermission(role.roleId, "canRead")}
                                                    className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                                                >
                                                    {role.canRead ? <CheckCircle2 size={18} className="text-emerald-400 mx-auto" /> : <XCircle size={18} className="text-slate-600 mx-auto" />}
                                                </button>
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <button 
                                                    onClick={() => togglePermission(role.roleId, "canCreate")}
                                                    className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                                                >
                                                    {role.canCreate ? <CheckCircle2 size={18} className="text-emerald-400 mx-auto" /> : <XCircle size={18} className="text-slate-600 mx-auto" />}
                                                </button>
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <button 
                                                    onClick={() => togglePermission(role.roleId, "canEdit")}
                                                    className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                                                >
                                                    {role.canEdit ? <CheckCircle2 size={18} className="text-emerald-400 mx-auto" /> : <XCircle size={18} className="text-slate-600 mx-auto" />}
                                                </button>
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <button 
                                                    onClick={() => togglePermission(role.roleId, "canDelete")}
                                                    className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                                                >
                                                    {role.canDelete ? <CheckCircle2 size={18} className="text-emerald-400 mx-auto" /> : <XCircle size={18} className="text-slate-600 mx-auto" />}
                                                </button>
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <button 
                                                    onClick={() => togglePermission(role.roleId, "canExport")}
                                                    className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                                                >
                                                    {role.canExport ? <CheckCircle2 size={18} className="text-emerald-400 mx-auto" /> : <XCircle size={18} className="text-slate-600 mx-auto" />}
                                                </button>
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <button 
                                                    onClick={() => togglePermission(role.roleId, "canViewCostsAndRoi")}
                                                    className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                                                >
                                                    {role.canViewCostsAndRoi ? <CheckCircle2 size={18} className="text-amber-400 mx-auto" /> : <XCircle size={18} className="text-slate-600 mx-auto" />}
                                                </button>
                                            </td>

                                            <td className="px-4 py-4 text-center">
                                                <button 
                                                    onClick={() => togglePermission(role.roleId, "hasDedicatedBot")}
                                                    className="p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                                                >
                                                    {role.hasDedicatedBot ? <Bot size={18} className="text-cyan-400 mx-auto" /> : <XCircle size={18} className="text-slate-600 mx-auto" />}
                                                </button>
                                            </td>

                                            {/* Key Modules / Functions */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 items-center">
                                                    {role.keyModules.map((m, i) => (
                                                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
                                                            <span>{m}</span>
                                                            <button 
                                                                onClick={() => handleRemoveModule(role.roleId, m)}
                                                                className="text-slate-500 hover:text-rose-400"
                                                                title="Quitar función"
                                                            >
                                                                ✕
                                                            </button>
                                                        </span>
                                                    ))}
                                                    <button
                                                        onClick={() => setEditingRole(role)}
                                                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
                                                    >
                                                        + Añadir
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => setEditingRole(role)}
                                                        className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                                                        title="Editar funciones y detalles"
                                                    >
                                                        <Edit3 size={15} />
                                                    </button>
                                                    {role.roleId !== "SUPER_ADMIN" && (
                                                        <button
                                                            onClick={() => handleDeleteRole(role.roleId, role.roleName)}
                                                            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                                                            title="Eliminar perfil del sistema"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: ORGANIGRAMA VISUAL DINÁMICO & MAPA CONCEPTUAL EN VIVO */}
            {activeTab === "org_tree" && (
                <div className="space-y-8">
                    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <Network size={20} className="text-purple-400" />
                                <span>Organigrama Dinámico Corporativo ATOMIC (Mapa Conceptual)</span>
                            </h2>
                            <p className="text-xs font-mono text-slate-400 mt-1">
                                El mapa se actualiza en vivo al crear perfiles, asignar funciones o modificar miembros.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold rounded-full">
                                {roles.length} Nodos Activos
                            </span>
                            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold rounded-full">
                                {roles.reduce((a, b) => a + b.activeUsersCount, 0)} Integrantes Totales
                            </span>
                        </div>
                    </div>

                    {/* Hierarchy Conceptual Map Canvas */}
                    <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-950 via-[#070b18] to-slate-950 border border-slate-800 relative shadow-2xl space-y-12 overflow-x-auto">
                        
                        {/* ── NIVEL 1: CÚSPIDE (SUPER ADMIN / GERENCIA) ── */}
                        <div className="flex flex-wrap justify-center gap-8">
                            {roles.filter(r => r.department === "Dirección General").map(r => (
                                <div 
                                    key={r.roleId}
                                    className="p-6 rounded-3xl bg-gradient-to-br from-rose-500/20 via-purple-500/20 to-slate-900 border-2 border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.3)] max-w-sm w-full text-center space-y-3 relative group"
                                >
                                    <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                        <Shield size={24} />
                                    </div>
                                    <h3 className="text-base font-black text-white uppercase">{r.roleName}</h3>
                                    <p className="text-xs font-mono text-rose-300">{r.badge} · {r.activeUsersCount} Titular(es)</p>
                                    
                                    <div className="flex flex-wrap justify-center gap-1 pt-1">
                                        {r.keyModules.map((m, i) => (
                                            <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                                                {m}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-2 flex items-center justify-center gap-2 border-t border-slate-800/80">
                                        <button
                                            onClick={() => adjustMemberCount(r.roleId, 1)}
                                            className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700"
                                            title="Añadir miembro"
                                        >
                                            +1 Miembro
                                        </button>
                                        <button
                                            onClick={() => setEditingRole(r)}
                                            className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs font-mono text-rose-300 border border-rose-500/40"
                                        >
                                            Editar Funciones
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Connector Line Down */}
                        <div className="flex justify-center -my-6">
                            <div className="w-0.5 h-12 bg-gradient-to-b from-rose-500 to-amber-500" />
                        </div>

                        {/* ── NIVEL 2: COORDINACIÓN & SUPERVISIÓN ── */}
                        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
                            {roles.filter(r => r.department === "Nivel Táctico & Control").map(r => (
                                <div 
                                    key={r.roleId}
                                    className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 max-w-sm w-full text-center space-y-3 shadow-xl relative"
                                >
                                    <div className="inline-flex p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                        <Layers size={20} />
                                    </div>
                                    <h4 className="font-bold text-white text-base">{r.roleName}</h4>
                                    <p className="text-xs font-mono text-amber-300">{r.badge} · {r.activeUsersCount} Miembros</p>
                                    
                                    <div className="flex flex-wrap justify-center gap-1">
                                        {r.keyModules.map((m, i) => (
                                            <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                                                {m}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-2 flex items-center justify-center gap-2 border-t border-slate-800">
                                        <button
                                            onClick={() => adjustMemberCount(r.roleId, 1)}
                                            className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700"
                                        >
                                            + Miembro
                                        </button>
                                        <button
                                            onClick={() => setEditingRole(r)}
                                            className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-xs font-mono text-amber-300 border border-amber-500/40"
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Connector Line Down */}
                        <div className="flex justify-center -my-6">
                            <div className="w-0.5 h-12 bg-gradient-to-b from-amber-500 to-cyan-500" />
                        </div>

                        {/* ── NIVEL 3: CÉLULAS OPERATIVAS (COMERCIAL, CAMPO, CRECIMIENTO, TECNOLOGÍA, EXTERNA) ── */}
                        <div className="space-y-6">
                            <div className="text-center font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold">
                                ── CÉLULAS OPERACIONALES EN EJECUCIÓN CONTINUA ──
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {departments
                                    .filter(d => d !== "Dirección General" && d !== "Nivel Táctico & Control")
                                    .map(dept => {
                                        const deptRoles = roles.filter(r => r.department === dept)
                                        return (
                                            <div 
                                                key={dept}
                                                className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl"
                                            >
                                                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                                    <h5 className="font-black text-sm text-cyan-300 uppercase">{dept}</h5>
                                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400">
                                                        {deptRoles.length} Puestos
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    {deptRoles.map(r => (
                                                        <div 
                                                            key={r.roleId}
                                                            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 hover:border-cyan-500/30 transition-all"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-bold text-white text-xs">{r.roleName}</span>
                                                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400">
                                                                    {r.activeUsersCount} pers.
                                                                </span>
                                                            </div>

                                                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                                                {r.description}
                                                            </p>

                                                            <div className="flex flex-wrap gap-1 pt-1">
                                                                {r.keyModules.slice(0, 3).map((m, i) => (
                                                                    <span key={i} className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                                                        {m}
                                                                    </span>
                                                                ))}
                                                                {r.keyModules.length > 3 && (
                                                                    <span className="text-[8px] font-mono text-cyan-400">
                                                                        +{r.keyModules.length - 3}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] font-mono">
                                                                <button
                                                                    onClick={() => adjustMemberCount(r.roleId, 1)}
                                                                    className="text-emerald-400 hover:underline cursor-pointer"
                                                                >
                                                                    + Integrante
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingRole(r)}
                                                                    className="text-cyan-400 hover:underline cursor-pointer"
                                                                >
                                                                    Editar Funciones →
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* ── MODAL: CREAR NUEVO PERFIL / ROL ── */}
            {isCreateRoleOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <form onSubmit={handleCreateRole} className="p-8 rounded-3xl bg-[#070b18] border border-cyan-500/40 max-w-xl w-full space-y-5 shadow-2xl animate-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <Plus size={18} className="text-cyan-400" />
                                <h3 className="font-black text-white text-base uppercase">Crear Nuevo Perfil en el Organigrama</h3>
                            </div>
                            <button type="button" onClick={() => setIsCreateRoleOpen(false)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                            <div className="sm:col-span-2">
                                <label className="text-slate-400 uppercase text-[10px] block mb-1">Nombre del Puesto / Perfil *</label>
                                <input
                                    type="text"
                                    required
                                    value={newRoleForm.roleName}
                                    onChange={e => setNewRoleForm(p => ({ ...p, roleName: e.target.value }))}
                                    placeholder="Ej: Supervisor de Pauta / Analista de Soporte"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-slate-400 uppercase text-[10px] block mb-1">Departamento / Célula *</label>
                                <select
                                    value={newRoleForm.department}
                                    onChange={e => setNewRoleForm(p => ({ ...p, department: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                                >
                                    <option value="Célula Comercial">Célula Comercial</option>
                                    <option value="Célula de Campo">Célula de Campo (Técnicos)</option>
                                    <option value="Célula de Crecimiento & Media">Célula Crecimiento & Media</option>
                                    <option value="Célula de Tecnología & Sistemas">Célula Tecnología & Sistemas</option>
                                    <option value="Nivel Táctico & Control">Nivel Táctico & Control</option>
                                    <option value="Dirección General">Dirección General</option>
                                    <option value="Célula Externa & Onboarding">Célula Externa</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-slate-400 uppercase text-[10px] block mb-1">Insignia / Rango</label>
                                <input
                                    type="text"
                                    value={newRoleForm.badge}
                                    onChange={e => setNewRoleForm(p => ({ ...p, badge: e.target.value }))}
                                    placeholder="OPERATIVO / ESPECIALISTA"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-slate-400 uppercase text-[10px] block mb-1">Funciones / Módulos Iniciales (separados por coma)</label>
                                <input
                                    type="text"
                                    value={newRoleForm.initialModules}
                                    onChange={e => setNewRoleForm(p => ({ ...p, initialModules: e.target.value }))}
                                    placeholder="Cotizaciones, CRM, Reportes, Soporte"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-slate-400 uppercase text-[10px] block mb-1">Descripción del Rol</label>
                                <textarea
                                    rows={2}
                                    value={newRoleForm.description}
                                    onChange={e => setNewRoleForm(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Objetivos clave del puesto y responsabilidades..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-cyan-400 text-xs"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={() => setIsCreateRoleOpen(false)}
                                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer"
                            >
                                Integrar al Organigrama
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── MODAL: EDITAR FUNCIONES DE UN PERFIL ── */}
            {editingRole && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="p-8 rounded-3xl bg-[#070b18] border border-cyan-500/40 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div>
                                <h3 className="font-black text-white text-base">{editingRole.roleName}</h3>
                                <p className="text-xs font-mono text-cyan-400">{editingRole.department} · {editingRole.roleId}</p>
                            </div>
                            <button onClick={() => setEditingRole(null)} className="text-slate-400 hover:text-white">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-2">
                                    Funciones y Módulos Activos
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {editingRole.keyModules.map((m, idx) => (
                                        <span 
                                            key={idx}
                                            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 flex items-center gap-2"
                                        >
                                            <span>{m}</span>
                                            <button 
                                                onClick={() => handleRemoveModule(editingRole.roleId, m)}
                                                className="text-slate-500 hover:text-rose-400 cursor-pointer"
                                                title="Eliminar función"
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Add new function input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newModuleInput}
                                    onChange={e => setNewModuleInput(e.target.value)}
                                    placeholder="Nombre de la nueva función o módulo..."
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                                />
                                <button
                                    onClick={() => handleAddModule(editingRole.roleId)}
                                    disabled={!newModuleInput.trim()}
                                    className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-mono font-bold transition-all disabled:opacity-40"
                                >
                                    + Añadir Función
                                </button>
                            </div>

                            {/* Toggles */}
                            <div className="pt-3 border-t border-slate-800 space-y-2">
                                <label className="text-[10px] font-mono uppercase text-slate-400 block">
                                    Configuraciones Rápidas
                                </label>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                                    <span className="text-xs font-mono text-slate-300">Bot de Inteligencia Artificial Interino:</span>
                                    <button 
                                        onClick={() => togglePermission(editingRole.roleId, "hasDedicatedBot")}
                                        className="px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer"
                                    >
                                        {editingRole.hasDedicatedBot ? (
                                            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">ACTIVO</span>
                                        ) : (
                                            <span className="text-slate-500 bg-slate-900 px-2 py-0.5 rounded">INACTIVO</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-3 border-t border-slate-800">
                            <button
                                onClick={() => setEditingRole(null)}
                                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold"
                            >
                                Listo / Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
