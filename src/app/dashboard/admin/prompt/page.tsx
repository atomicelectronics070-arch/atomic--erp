"use client"

import { useState, useEffect } from "react"
import { Save, BrainCircuit, CheckCircle2, AlertCircle, History, UserCircle, Bot, Copy, Users, Search, ChevronRight, Layout, Trash2 } from "lucide-react"

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
            // If we have a selected user, ask for their specific config. 
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

                // Auto-select first user if none selected and we have users loaded
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

    // Load data on start and when type/user changes
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
                setMessage({ text: "Configuración Cognitiva guardada correctamente.", type: "success" })
                setSaveAsTemplate(false)
                setTemplateName("")
                fetchConfig()
            } else {
                setMessage({ text: "Hubo un error al guardar el prompt.", type: "error" })
            }
        } catch (err) {
            setMessage({ text: "Error de conexión.", type: "error" })
        } finally {
            setIsSaving(false)
        }
    }

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const currentUser = users.find(u => u.id === selectedUser)

    if (isLoading && users.length === 0) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Cargando Asesores y Prompts...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[800px] -m-10 lg:-m-14 bg-neutral-50 overflow-hidden border-t border-neutral-200">

            {/* LEFT SIDEBAR: Advisors List */}
            <div className="w-full lg:w-72 bg-white border-r border-neutral-200 flex flex-col shadow-sm">
                <div className="p-6 border-b border-neutral-100 bg-neutral-900 text-white">
                    <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-4">
                        <Users className="text-orange-500" size={16} /> Asesores
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-800 border-none p-2 rounded text-xs pl-9 focus:ring-1 focus:ring-orange-500 outline-none placeholder:text-neutral-600"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-neutral-50/50">
                    {filteredUsers.length === 0 ? (
                        <div className="p-10 text-center text-neutral-300">
                            <Users size={24} className="mx-auto mb-2 opacity-20" />
                            <p className="text-[10px] uppercase font-bold tracking-tight">Vacio</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-100">
                            {filteredUsers.map(u => (
                                <button
                                    key={u.id}
                                    onClick={() => setSelectedUser(u.id)}
                                    className={`w-full text-left p-4 pr-3 transition-all flex items-center justify-between group ${selectedUser === u.id ? 'bg-white border-l-4 border-l-orange-600 shadow-sm' : 'hover:bg-neutral-100/50 opacity-70 hover:opacity-100'}`}
                                >
                                    <div className="truncate">
                                        <p className={`text-xs font-bold truncate ${selectedUser === u.id ? 'text-neutral-900' : 'text-neutral-600'}`}>{u.name || 'Sin Nombre'}</p>
                                        <p className="text-[10px] text-neutral-400 truncate opacity-60 font-medium">{u.email}</p>
                                    </div>
                                    <ChevronRight size={14} className={`text-orange-600 transition-transform ${selectedUser === u.id ? 'translate-x-0' : 'translate-x-4 opacity-0 group-hover:opacity-100'}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CENTER: Editor */}
            <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-orange-600 h-1 w-8"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Cognitive Engine</span>
                    </div>
                    <h1 className="text-4xl font-black uppercase text-neutral-900 tracking-tighter">
                        Configuración <span className="text-neutral-400">IA</span>
                    </h1>
                    {currentUser && (
                        <p className="mt-2 text-neutral-500 font-medium flex items-center gap-2">
                            Editando comportamiento para <span className="text-neutral-900 font-bold underline decoration-orange-500 underline-offset-4">{currentUser.name || 'Asesor'}</span>
                        </p>
                    )}
                </div>

                <div className="bg-white border border-neutral-200 shadow-xl shadow-neutral-200/50 rounded-lg overflow-hidden flex flex-col">
                    {/* Bot Selector Tabs */}
                    <div className="flex border-b border-neutral-100">
                        <button
                            onClick={() => setSelectedType("CAPACITADOR")}
                            className={`flex-1 p-5 flex items-center justify-center gap-3 transition-all border-b-2 ${selectedType === "CAPACITADOR" ? 'bg-white border-orange-600 text-orange-600' : 'bg-neutral-50 border-transparent text-neutral-400 hover:text-neutral-700'}`}
                        >
                            <Bot size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Capacitador Corporativo</span>
                        </button>
                        <button
                            onClick={() => setSelectedType("TUTOR")}
                            className={`flex-1 p-5 flex items-center justify-center gap-3 transition-all border-b-2 ${selectedType === "TUTOR" ? 'bg-white border-orange-600 text-orange-600' : 'bg-neutral-50 border-transparent text-neutral-400 hover:text-neutral-700'}`}
                        >
                            <BrainCircuit size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Tutor del Día</span>
                        </button>
                    </div>

                    <div className="p-8 space-y-6">
                        {message.text && (
                            <div className={`p-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                <span>{message.text}</span>
                            </div>
                        )}

                        <div className="relative group">
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className="bg-neutral-100 text-[9px] font-bold text-neutral-400 px-2 py-1 rounded-sm uppercase tracking-tighter">
                                    {prompt.length} Caracteres
                                </span>
                            </div>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={`Instrucciones específicas para el ${selectedType.toLowerCase()}...`}
                                rows={12}
                                className={`w-full p-8 pt-12 text-sm font-mono text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all resize-none ${isLoading ? 'animate-pulse' : ''}`}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4 border-t border-neutral-100">
                            <div className="flex items-center gap-4 bg-neutral-50 px-4 py-3 rounded-lg border border-neutral-100 w-full md:w-auto">
                                <input
                                    type="checkbox"
                                    id="saveTemplate"
                                    checked={saveAsTemplate}
                                    onChange={(e) => setSaveAsTemplate(e.target.checked)}
                                    className="w-4 h-4 accent-orange-600"
                                />
                                <label htmlFor="saveTemplate" className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 cursor-pointer">Guardar Plantilla</label>
                                {saveAsTemplate && (
                                    <input
                                        type="text"
                                        placeholder="Nombre..."
                                        value={templateName}
                                        onChange={(e) => setTemplateName(e.target.value)}
                                        className="bg-white border border-neutral-200 p-2 text-xs rounded focus:ring-1 focus:ring-orange-500 outline-none w-32"
                                    />
                                )}
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving || !selectedUser}
                                className="w-full md:w-auto bg-neutral-900 text-white px-10 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                            >
                                <Save size={16} />
                                {isSaving ? "Guardando..." : "Asignar Configuración"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* HISTORIAL: Bottom of Center Column */}
                <div className="mt-16 space-y-6">
                    <div className="flex items-center gap-3">
                        <History className="text-neutral-400" size={18} />
                        <h2 className="text-xs font-black uppercase tracking-widest text-neutral-500">Plantillas Históricas</h2>
                    </div>
                    {savedPrompts.length === 0 ? (
                        <div className="p-10 border border-dashed border-neutral-200 rounded-lg text-center text-neutral-400 text-xs">No hay plantillas guardadas.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {savedPrompts.map(sp => (
                                <div key={sp.id} className="bg-white p-6 border border-neutral-200 rounded-lg hover:border-orange-500 transition-all group shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="text-xs font-black uppercase tracking-tight text-neutral-900">{sp.name}</h4>
                                            <span className={`text-[8px] font-bold px-2 py-1 rounded-full uppercase ${sp.type === 'CAPACITADOR' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {sp.type}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-neutral-500 line-clamp-3 font-mono leading-relaxed">{sp.content}</p>
                                    </div>
                                    <button
                                        onClick={() => setPrompt(sp.content)}
                                        className="mt-4 w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-neutral-50 text-neutral-400 group-hover:bg-orange-600 group-hover:text-white transition-all rounded"
                                    >
                                        <Copy size={12} /> Cargar este Prompt
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR: Live Dashboard */}
            <div className="w-full lg:w-96 bg-white border-l border-neutral-200 p-8 overflow-y-auto">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 mb-8 border-b border-neutral-100 pb-4 flex items-center gap-3">
                    <Layout size={18} className="text-orange-600" /> Prompts <span className="text-neutral-400">Activos</span>
                </h3>

                <div className="space-y-4">
                    {activeConfigs.length === 0 ? (
                        <p className="text-[10px] text-neutral-400 uppercase font-bold text-center p-10 bg-neutral-50 border border-dashed border-neutral-200 rounded-lg">Ninguno asignado aún.</p>
                    ) : (
                        activeConfigs.map(config => (
                            <div key={config.id} className="p-5 bg-neutral-50/50 border border-neutral-100 rounded-xl hover:bg-white hover:shadow-xl hover:shadow-neutral-200/50 transition-all cursor-pointer group" onClick={() => {
                                setSelectedUser(config.userId)
                                setSelectedType(config.type)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold">
                                            {config.user?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tight text-neutral-900 truncate max-w-[120px]">{config.user?.name || 'Asesor'}</p>
                                            <p className={`text-[8px] font-bold uppercase tracking-widest ${config.type === 'CAPACITADOR' ? 'text-blue-500' : 'text-purple-500'}`}>{config.type}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-neutral-300 group-hover:text-orange-600 transition-colors" />
                                </div>
                                <div className="p-4 bg-white border border-neutral-100 rounded-lg">
                                    <p className="text-[10px] text-neutral-500 font-mono line-clamp-2 leading-relaxed italic">"{config.prompt}"</p>
                                </div>
                                <div className="mt-3 flex items-center justify-end gap-2 text-[8px] font-black uppercase text-neutral-300">
                                    <span>Ver más</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    )
}
