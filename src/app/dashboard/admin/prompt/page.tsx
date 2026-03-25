"use client"

import { useState, useEffect } from "react"
import { 
    Save, BrainCircuit, CheckCircle2, AlertCircle, History, 
    UserCircle, Bot, Copy, Users, Search, 
    ChevronRight, Layout, Trash2, Cpu, Sparkles, 
    Zap, Settings2, ShieldCheck, Mail
} from "lucide-react"

type SavedPrompt = {
    id: string
    name: string
    type: string
    content: string
}

type User = {
    id: string
    name: string
    email: string
}

type ActiveConfig = {
    id: string
    userId: string
    type: string
    prompt: string
    user?: User
}

export default function AdminPromptPage() {
    const [prompt, setPrompt] = useState("")
    const [users, setUsers] = useState<User[]>([])
    const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([])
    const [activeConfigs, setActiveConfigs] = useState<ActiveConfig[]>([])

    // Form Selection State
    const [selectedUser, setSelectedUser] = useState<string>("")
    const [selectedType, setSelectedType] = useState<string>("CAPACITADOR")
    const [searchTerm, setSearchTerm] = useState("")

    // Save to Template State
    const [saveAsTemplate, setSaveAsTemplate] = useState(false)
    const [templateName, setTemplateName] = useState("")

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState({ text: "", type: "" })

    const fetchConfig = async () => {
        setIsLoading(true)
        try {
            const url = new URL("/api/admin/prompt", window.location.origin)
            if (selectedUser) {
                url.searchParams.append("userId", selectedUser)
            }
            url.searchParams.append("type", selectedType)

            const res = await fetch(url.toString())
            if (res.ok) {
                const data = await res.json()
                setPrompt(data.prompt || "")
                setUsers(data.users || [])
                setSavedPrompts(data.savedPrompts || [])
                setActiveConfigs(data.activeConfigs || [])

                if (!selectedUser && data.users && data.users.length > 0) {
                    setSelectedUser(data.users[0].id)
                }
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchConfig()
        setMessage({ text: "", type: "" })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUser, selectedType])

    const handleSave = async () => {
        if (!selectedUser) {
            setMessage({ text: "Selecciona un asesor primero.", type: "error" })
            return
        }

        if (saveAsTemplate && !templateName.trim()) {
            setMessage({ text: "Otorga un nombre a la plantilla si deseas guardarla.", type: "error" })
            return
        }

        setIsSaving(true)
        setMessage({ text: "", type: "" })
        try {
            const res = await fetch("/api/admin/prompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedUser,
                    type: selectedType,
                    prompt,
                    saveAsTemplate,
                    templateName
                })
            })

            if (res.ok) {
                setMessage({ text: "Núcleo Cognitivo actualizado exitosamente.", type: "success" })
                setSaveAsTemplate(false)
                setTemplateName("")
                fetchConfig()
            } else {
                setMessage({ text: "Error en la sincronización neuronal.", type: "error" })
            }
        } catch (err) {
            setMessage({ text: "Error de conexión con el servidor IA.", type: "error" })
        } finally {
            setIsSaving(false)
        }
    }

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const currentUser = users.find(u => u.id === selectedUser)

    const handleDeleteTemplate = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta plantilla cognitiva?")) return
        
        try {
            const res = await fetch(`/api/admin/prompt?id=${id}`, {
                method: "DELETE"
            })
            if (res.ok) {
                setMessage({ text: "Plantilla eliminada del núcleo.", type: "success" })
                fetchConfig()
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (isLoading && users.length === 0) {
        return (
            <div className="flex h-[80vh] items-center justify-center p-20 bg-slate-950 rounded-3xl border border-slate-900 shadow-2xl">
                <div className="text-center space-y-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                        <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse" size={24} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-black uppercase tracking-[0.4em] text-indigo-400">Iniciando Sincronización</p>
                        <p className="text-xs text-slate-500 font-medium">Cargando modelos cognitivos y datos de asesores...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 rounded-3xl overflow-hidden border border-slate-900 shadow-2xl flex flex-col lg:flex-row">
            
            {/* LEFT SIDEBAR: Advisors List */}
            <div className="w-full lg:w-80 bg-slate-900/30 border-r border-slate-800/50 backdrop-blur-md flex flex-col pt-4">
                <div className="p-8 pb-6 border-b border-slate-800/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
                            <Users className="text-white" size={18} />
                        </div>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Asesores Activos</h2>
                    </div>
                    
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar asesor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs pl-10 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-medium"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
                    {filteredUsers.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800 opacity-50">
                                <Users size={16} className="text-slate-600" />
                            </div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-600">Sin resultados</p>
                        </div>
                    ) : (
                        filteredUsers.map(u => (
                            <button
                                key={u.id}
                                onClick={() => setSelectedUser(u.id)}
                                className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group relative overflow-hidden ${
                                    selectedUser === u.id 
                                    ? 'bg-gradient-to-r from-indigo-600/10 to-transparent border border-indigo-500/20' 
                                    : 'hover:bg-slate-900/50 border border-transparent'
                                }`}
                            >
                                <div className="z-10 flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors duration-300 ${
                                        selectedUser === u.id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                                    }`}>
                                        {u.name?.[0].toUpperCase() || '?'}
                                    </div>
                                    <div className="truncate">
                                        <p className={`text-xs font-bold truncate transition-colors ${selectedUser === u.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                            {u.name || 'Sin Nombre'}
                                        </p>
                                        <p className="text-[10px] text-slate-600 truncate font-medium flex items-center gap-1 mt-0.5">
                                            <Mail size={10} className="shrink-0" />
                                            {u.email}
                                        </p>
                                    </div>
                                </div>
                                {selectedUser === u.id && (
                                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col bg-slate-950 relative overflow-y-auto custom-scrollbar">
                
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none -ml-40 -mb-20"></div>

                <div className="p-8 lg:p-14 z-10 max-w-6xl mx-auto w-full">
                    
                    {/* Header Section */}
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="h-px w-8 bg-indigo-500"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Nucleus AI Control</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div>
                                <h1 className="text-5xl font-black uppercase text-white tracking-tighter leading-none mb-4">
                                    Cognitive <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">Engine</span>
                                </h1>
                                {currentUser && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full backdrop-blur-md">
                                        <Sparkles className="text-yellow-500" size={14} />
                                        <p className="text-xs text-slate-400 font-medium">
                                            Sincronizando modelos para <span className="text-indigo-400 font-bold">{currentUser.name || 'Asesor'}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
                                <button
                                    onClick={() => setSelectedType("CAPACITADOR")}
                                    className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                        selectedType === "CAPACITADOR" 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    <Bot size={14} /> Capacitador
                                </button>
                                <button
                                    onClick={() => setSelectedType("TUTOR")}
                                    className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                        selectedType === "TUTOR" 
                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' 
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                >
                                    <BrainCircuit size={14} /> Tutor del día
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Main Editor Card */}
                    <div className="relative mb-16">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl blur opacity-[0.07] group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                            
                            {/* Editor Status Bar */}
                            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-900 bg-slate-900/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Neural Network Ready</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                        {prompt.length} Tokens Sim.
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 lg:p-10">
                                {message.text && (
                                    <div className={`mb-8 p-5 flex items-center gap-4 text-xs font-bold uppercase tracking-widest rounded-2xl border backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 ${
                                        message.type === 'success' 
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                    }`}>
                                        <div className={`p-2 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                                            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                        </div>
                                        <span>{message.text}</span>
                                    </div>
                                )}

                                <div className="relative">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder={`Escribe las instrucciones de comportamiento para el ${selectedType === 'CAPACITADOR' ? 'Capacitador' : 'Tutor'}...`}
                                        rows={14}
                                        className={`w-full p-10 text-sm font-mono text-slate-100 bg-slate-900/10 border border-slate-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all resize-none shadow-inner leading-relaxed placeholder:text-slate-800 ${isLoading ? 'animate-pulse' : ''}`}
                                    />
                                    <div className="absolute top-5 left-5 pointer-events-none opacity-20">
                                        <Cpu size={24} className="text-indigo-500" />
                                    </div>
                                </div>

                                <div className="mt-10 flex flex-col xl:flex-row gap-6 items-center justify-between">
                                    <div className="flex items-center gap-6 bg-slate-900/30 px-6 py-4 rounded-2xl border border-slate-800/50 w-full xl:w-auto backdrop-blur-md">
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                id="saveTemplate"
                                                checked={saveAsTemplate}
                                                onChange={(e) => setSaveAsTemplate(e.target.checked)}
                                                className="w-5 h-5 accent-indigo-500 cursor-pointer rounded-lg border-slate-700 bg-slate-950"
                                            />
                                            <label htmlFor="saveTemplate" className="text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer select-none">Preservar como Plantilla</label>
                                        </div>
                                        {saveAsTemplate && (
                                            <div className="h-8 w-px bg-slate-800 mx-2"></div>
                                        )}
                                        {saveAsTemplate && (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Nombre de la plantilla..."
                                                    value={templateName}
                                                    onChange={(e) => setTemplateName(e.target.value)}
                                                    className="bg-slate-950 border border-slate-800 p-3 text-xs rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-56 text-white font-medium placeholder:text-slate-700"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving || !selectedUser}
                                        className="w-full xl:w-auto relative group overflow-hidden"
                                    >
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                                        <div className="relative flex items-center justify-center gap-3 bg-white text-black px-12 py-5 text-xs font-black uppercase tracking-[0.25em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:grayscale">
                                            {isSaving 
                                                ? <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> 
                                                : <Sparkles size={16} className="text-indigo-600" />
                                            }
                                            {isSaving ? "Codificando..." : "Inyectar Prompt"}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TWO-COLUMN GRID: History and Library */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* ACTIVE CONFIGS: Modern Card List */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">
                                        <ShieldCheck className="text-emerald-500" size={18} />
                                    </div>
                                    <div>
                                        <h2 className="text-xs font-black uppercase tracking-widest text-white">Sistemas Activos</h2>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Configuraciones en producción</p>
                                    </div>
                                </div>
                                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20">
                                    {activeConfigs.length} ONLINE
                                </span>
                            </div>

                            <div className="space-y-4">
                                {activeConfigs.length === 0 ? (
                                    <div className="p-12 border-2 border-dashed border-slate-900 rounded-3xl text-center">
                                        <Zap size={24} className="mx-auto mb-4 text-slate-800 opacity-50" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">Sin despliegues activos</p>
                                    </div>
                                ) : (
                                    activeConfigs.map(config => (
                                        <div key={config.id} className="group bg-slate-900/20 border border-slate-900 hover:border-indigo-500/30 p-6 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 backdrop-blur-sm">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center font-black text-xs text-indigo-400 border border-slate-800 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                                        {config.user?.name?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-tight text-white">{config.user?.name || 'Asesor'}</h4>
                                                        <span className={`inline-block mt-1.5 text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${
                                                            config.type === 'CAPACITADOR' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'bg-violet-500/10 text-violet-500 border border-violet-500/20'
                                                        }`}>
                                                            {config.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedUser(config.userId)
                                                        setSelectedType(config.type)
                                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                                    }}
                                                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-600 hover:text-indigo-400 hover:border-indigo-400/50 transition-all active:scale-95"
                                                    title="Editar Configuración"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <p className="text-[11px] text-slate-500 font-mono leading-relaxed line-clamp-2 italic italic opacity-60 group-hover:opacity-100 transition-opacity">
                                                    "{config.prompt}"
                                                </p>
                                                <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-slate-950 to-transparent rounded-r-3xl group-hover:hidden"></div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* TEMPLATE LIBRARY: Grid of Cards */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">
                                        <History className="text-indigo-400" size={18} />
                                    </div>
                                    <div>
                                        <h2 className="text-xs font-black uppercase tracking-widest text-white">Librería Cognitiva</h2>
                                        <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Plantillas optimizadas</p>
                                    </div>
                                </div>
                                <span className="bg-indigo-500/10 text-indigo-500 text-[10px] font-black px-3 py-1 rounded-full border border-indigo-500/20">
                                    {savedPrompts.length} READY
                                </span>
                            </div>

                            {savedPrompts.length === 0 ? (
                                <div className="p-12 border-2 border-dashed border-slate-900 rounded-3xl text-center">
                                    <Copy size={24} className="mx-auto mb-4 text-slate-800 opacity-50" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">Biblioteca vacía</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {savedPrompts.map(sp => (
                                        <div key={sp.id} className="group relative bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl hover:bg-slate-900 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-900/50 hover:-translate-y-1">
                                            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleDeleteTemplate(sp.id)}
                                                    className="p-1.5 bg-slate-950 border border-slate-800 text-slate-600 hover:text-rose-500 hover:border-rose-500/50 rounded-lg transition-all"
                                                    title="Eliminar Plantilla"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                <Bot size={12} className={sp.type === 'CAPACITADOR' ? 'text-indigo-500' : 'text-violet-500'} />
                                            </div>
                                            <div>
                                                <div className="mb-4">
                                                    <h4 className="text-[11px] font-black uppercase tracking-tight text-white mb-1">{sp.name}</h4>
                                                    <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase border ${
                                                        sp.type === 'CAPACITADOR' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 'bg-violet-500/10 text-violet-500 border-violet-500/20'
                                                    }`}>
                                                        {sp.type}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-mono leading-relaxed line-clamp-4 italic border-l-2 border-slate-800 pl-3">
                                                    {sp.content}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setPrompt(sp.content)
                                                    setSelectedType(sp.type)
                                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                                }}
                                                className="mt-6 w-full py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-950 text-slate-400 hover:bg-indigo-600 hover:text-white border border-slate-800 hover:border-indigo-500 transition-all rounded-2xl shadow-sm"
                                            >
                                                <Copy size={14} /> Aplicar Patrón
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    <footer className="mt-24 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
                        <div className="flex items-center gap-4">
                            <BrainCircuit size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Atomic Cognitive Services v2.0</span>
                        </div>
                        <p className="text-[9px] font-medium text-slate-500">Asegúrate de revisar los parámetros técnicos antes de inyectar nuevos modelos de comportamiento neuronal.</p>
                    </footer>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1e293b;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #334155;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    )
}

function Edit({ size, ...props }: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    )
}
