"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Clock, CheckSquare, Save, Users, Calendar, 
    Video, MessageSquare, AlertCircle, FileText, Send, DollarSign, Download, Check, X, ChevronUp, ChevronDown, Sparkles, Filter, Database, UserCheck, ShieldCheck
} from "lucide-react"

export default function CoordinacionPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    
    const [loading, setLoading] = useState(true)
    const [dailyData, setDailyData] = useState<any>(null)
    const [advisors, setAdvisors] = useState<{id: string, name: string}[]>([])
    const [quotes, setQuotes] = useState<any[]>([])
    const [quotesLoading, setQuotesLoading] = useState(false)
    const [quotesError, setQuotesError] = useState<string | null>(null)
    const [quoteFilter, setQuoteFilter] = useState<"ALL" | "DRAFT" | "APPROVED" | "REJECTED">("ALL")
    
    const [activeTab, setActiveTab] = useState<"BITACORA" | "COTIZACIONES" | "SCRAPER">("BITACORA")
    
    const [notices, setNotices] = useState("")
    const [publishToSocial, setPublishToSocial] = useState(false)
    
    // Checklists
    const [showFollowUp, setShowFollowUp] = useState(false)
    const [showB2B, setShowB2B] = useState(false)
    const [showZoom, setShowZoom] = useState(false)
    
    // Forms
    const [followUpForm, setFollowUpForm] = useState({ clientName: "", phone: "", case: "", responsibleType: "ASESOR", advisorId: "" })
    const [b2bForm, setB2bForm] = useState({ q1: "", q2: "", q3: "", q4: "", notes: "" })
    const [zoomForm, setZoomForm] = useState({ notes: "" })
    const [assignmentForm, setAssignmentForm] = useState({ objective: "", amount: 10, advisorId: "", origin: "" })

    // New states for PDF Modal and Dynamic Contacts Assignment
    const [previewQuote, setPreviewQuote] = useState<any | null>(null)
    const [showContactsDetails, setShowContactsDetails] = useState(false)
    const [contactsList, setContactsList] = useState<{name: string, objective: string, businessType: string, phone: string}[]>([])

    // Sync contactsList size with assignmentForm.amount
    useEffect(() => {
        setContactsList(prev => {
            const newList = [...prev]
            if (newList.length < assignmentForm.amount) {
                while(newList.length < assignmentForm.amount) {
                    newList.push({ name: "", objective: assignmentForm.objective || "", businessType: "", phone: "" })
                }
            } else if (newList.length > assignmentForm.amount) {
                newList.length = assignmentForm.amount
            }
            return newList
        })
    }, [assignmentForm.amount, assignmentForm.objective])

    // Scraper States
    const [scrapedContacts, setScrapedContacts] = useState<any[]>([])
    const [scraperLoading, setScraperLoading] = useState(false)
    const [scraperCategory, setScraperCategory] = useState("Gimnasios")
    const [scraperCount, setScraperCount] = useState(5)
    
    const SCRAPER_CATEGORIES = [
        "Abogados", "Academias de Baile", "Agencias de Viajes", "Arquitectos", "Asesoría Contable", 
        "Autolavados", "Bancos", "Bares", "Bienes Raíces", "Boutiques", "Cafeterías", "Carnicerías", 
        "Carpinterías", "Catering", "Centros Comerciales", "Centros Médicos", "Clínicas Odontológicas", 
        "Colegios", "Consultorías", "Constructoras", "Cooperativas", "Cosméticos", "Cuidado de Mascotas", 
        "Decoración", "Dentistas", "Desarrollo de Software", "Diseño Gráfico", "Distribuidores", 
        "Educación Superior", "Electricistas", "Electrónica", "Empresas de Seguridad", "Estéticas", 
        "Estudios de Tatuajes", "Eventos", "Farmacias", "Ferreterías", "Floristerías", "Fotografía", 
        "Franquicias", "Fundaciones", "Gasolineras", "Gimnasios", "Guarderías", "Heladerías", 
        "Hospitales", "Hoteles", "Imprentas", "Inmobiliarias", "Ingeniería", "Joyerías", "Jugueterías", 
        "Laboratorios", "Lavanderías", "Librerías", "Licorerías", "Limpieza", "Logística", 
        "Mantenimiento", "Maquillaje", "Marketing Digital", "Mascotas", "Mecánicas", "Medicina Alternativa", 
        "Mueblerías", "Notarías", "Nutricionistas", "Odontólogos", "Ópticas", "Organización de Eventos", 
        "Panaderías", "Papelerías", "Peluquerías", "Perfumerías", "Pintores", "Pizzerías", "Plomería", 
        "Productores", "Publicidad", "Restaurantes", "Ropa Deportiva", "Salones de Belleza", 
        "Seguros", "Servicios de Limpieza", "Servicios Financieros", "Spas", "Supermercados", 
        "Talleres Automotrices", "Tecnología", "Telecomunicaciones", "Terapias", "Tiendas de Ropa", 
        "Tiendas Naturistas", "Transporte", "Turismo", "Universidades", "Veterinarias", "Videojuegos", 
        "Zapaterías", "Conjuntos Residenciales", "Edificios de Oficinas"
    ].sort();

    const fetchScrapedContacts = async () => {
        try {
            const res = await fetch('/api/admin/scraper')
            const data = await res.json()
            if (data.contacts) setScrapedContacts(data.contacts)
        } catch (error) {
            console.error("Error fetching scraped contacts:", error)
        }
    }

    const handleScrape = async () => {
        if (!scraperCategory || scraperCount < 1) return;
        setScraperLoading(true)
        try {
            const res = await fetch('/api/admin/scraper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: scraperCategory, count: scraperCount, source: "MAPS" })
            })
            const data = await res.json()
            if (data.success) {
                alert(`¡Éxito! Se extrajeron ${data.contacts.length} contactos de la categoría ${scraperCategory}.`)
                fetchScrapedContacts()
            } else {
                alert("Error: " + data.error)
            }
        } catch (error: any) {
            alert("Error: " + error.message)
        } finally {
            setScraperLoading(false)
        }
    }

    const handleAssignScrapedContact = async (contactId: string, advisorId: string) => {
        if (!advisorId) return;
        try {
            const res = await fetch('/api/admin/scraper', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contactId, advisorId })
            })
            const data = await res.json()
            if (data.success) {
                fetchScrapedContacts()
            } else {
                alert("Error al asignar: " + data.error)
            }
        } catch (error: any) {
            alert("Error: " + error.message)
        }
    }

    useEffect(() => {
        if (activeTab === "SCRAPER") {
            fetchScrapedContacts()
        }
    }, [activeTab])

    const [isTestMode, setIsTestMode] = useState(false)
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    })

    useEffect(() => {
        if (status === "loading") return
        if (!session || session.user.role !== "ADMIN") {
            router.push("/dashboard")
            return
        }
        
        const testDataTime = localStorage.getItem("testDataTime")
        if (testDataTime && (Date.now() - parseInt(testDataTime) > 20 * 60 * 1000)) {
            localStorage.removeItem("testDailyData")
            localStorage.removeItem("testDataTime")
        }

        fetchData()
        fetchAdvisors()
        fetchQuotes(true)
    }, [session, status, router, selectedDate])

    const fetchData = async () => {
        setLoading(true)
        try {
            if (isTestMode) {
                const savedTest = localStorage.getItem("testDailyData")
                if (savedTest) {
                    setDailyData(JSON.parse(savedTest))
                } else {
                    setDailyData({ daily: { notices: "" }, followUps: [], reports: [], assignments: [] })
                }
                setNotices("")
                setLoading(false)
                return;
            }
            const res = await fetch(`/api/admin/coordination?date=${selectedDate}`)
            if(res.ok) {
                const data = await res.json()
                setDailyData(data)
                setNotices(data.daily?.notices || "")
            }
        } catch(e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!loading) fetchData()
    }, [isTestMode])

    const fetchAdvisors = async () => {
        try {
            const res = await fetch("/api/admin/users?role=SALESPERSON")
            if(res.ok) {
                const data = await res.json()
                setAdvisors(data.users || [])
            }
        } catch(e) {
            console.error(e)
        }
    }

    const fetchQuotes = async (silent = false) => {
        if (!silent) setQuotesLoading(true)
        setQuotesError(null)
        try {
            const res = await fetch("/api/admin/quotes")
            if(res.ok) {
                const data = await res.json()
                setQuotes(data.quotes || [])
            } else {
                const err = await res.json().catch(() => ({}))
                setQuotesError(err.error || `Error ${res.status}`)
            }
        } catch(e) {
            console.error(e)
            setQuotesError("Error de conexión. Verifica tu sesión.")
        } finally {
            if (!silent) setQuotesLoading(false)
        }
    }

    useEffect(() => {
        if (activeTab !== "COTIZACIONES") return
        fetchQuotes()
        const interval = setInterval(() => fetchQuotes(true), 30000)
        return () => clearInterval(interval)
    }, [activeTab])

    const handleAction = async (action: string, payload: any = {}) => {
        try {
            if (isTestMode) {
                let newDailyData = { ...dailyData }
                if (!newDailyData.daily) newDailyData.daily = {}
                
                if (action === "OPEN_GROUP") newDailyData.daily.openTime = new Date()
                if (action === "CLOSE_GROUP") newDailyData.daily.closeTime = new Date()
                if (action === "SAVE_NOTICES") newDailyData.daily.notices = payload.notices
                if (action === "ADD_FOLLOW_UP") {
                    if (!newDailyData.followUps) newDailyData.followUps = []
                    newDailyData.followUps.push({ ...payload, id: Date.now().toString() })
                }
                if (action === "SAVE_REPORT") {
                    if (!newDailyData.reports) newDailyData.reports = []
                    newDailyData.reports.push({ ...payload, id: Date.now().toString() })
                }
                if (action === "ADD_ASSIGNMENT") {
                    if (!newDailyData.assignments) newDailyData.assignments = []
                    newDailyData.assignments.push({ ...payload, id: Date.now().toString() })
                }
                setDailyData(newDailyData)
                localStorage.setItem("testDailyData", JSON.stringify(newDailyData))
                localStorage.setItem("testDataTime", Date.now().toString())
                alert("Acción ejecutada en Modo Prueba (Guardado Temporal)")
                return;
            }

            const res = await fetch("/api/admin/coordination", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, date: selectedDate, ...payload })
            })
            if (res.ok) {
                fetchData()
                if (action === "ADD_FOLLOW_UP") setFollowUpForm({ clientName: "", phone: "", case: "", responsibleType: "ASESOR", advisorId: "" })
            } else {
                alert("Error al procesar la acción")
            }
        } catch (e) {
            console.error(e)
        }
    }

    const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/quotes", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quoteId, status: newStatus })
            })
            if (res.ok) {
                fetchQuotes(true)
            } else {
                alert("Error al actualizar el estado de la cotización")
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (status === "loading" || loading && !dailyData) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#030712] text-white">
                <div className="w-12 h-12 border-4 border-slate-800 border-t-cyan-400 rounded-full animate-spin" />
                <p className="mt-4 font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest">Cargando Panel de Coordinación...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-32 font-sans text-slate-100 bg-[#030712] p-6 lg:p-10 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800/80 pb-6 relative z-10">
                <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                        <Sparkles size={12} className="text-cyan-400" />
                        <span>MÓDULO DE SUPERVISIÓN & OPERACIONES</span>
                    </div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                        <Users className="text-cyan-400" /> Coordinación General & Bitácora
                    </h1>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Panel de control diario para gestión de asesores, aprobación de cotizaciones y prospección.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Date Selector */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-2">
                        <Calendar size={15} className="text-cyan-400" />
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">FECHA:</span>
                        <input 
                            type="date" 
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent text-xs font-mono font-bold text-white outline-none cursor-pointer"
                        />
                    </div>

                    {/* Test Mode Toggle */}
                    <button 
                        onClick={() => setIsTestMode(!isTestMode)}
                        className={`px-4 py-2.5 rounded-2xl font-mono text-xs font-bold border transition-all flex items-center gap-2 ${
                            isTestMode 
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                    >
                        <CheckSquare size={15} className={isTestMode ? "text-amber-400" : ""} />
                        <span>{isTestMode ? "✓ Modo Prueba Activo" : "Modo Prueba"}</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs Switcher */}
            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl w-full sm:w-auto overflow-x-auto">
                <button
                    onClick={() => setActiveTab("BITACORA")}
                    className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        activeTab === "BITACORA"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                >
                    <Clock size={16} />
                    <span>BITÁCORA DIARIA</span>
                </button>

                <button
                    onClick={() => setActiveTab("COTIZACIONES")}
                    className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 relative ${
                        activeTab === "COTIZACIONES"
                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-105"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                >
                    <FileText size={16} />
                    <span>GESTIÓN DE COTIZACIONES</span>
                    {quotes.filter(q => q.status === "DRAFT").length > 0 && (
                        <span className="w-5 h-5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                            {quotes.filter(q => q.status === "DRAFT").length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("SCRAPER")}
                    className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        activeTab === "SCRAPER"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                >
                    <Database size={16} />
                    <span>SCRAPER & PROSPECCIÓN</span>
                </button>
            </div>

            {/* ── TAB 1: BITÁCORA DIARIA ── */}
            {activeTab === "BITACORA" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* APERTURA Y CIERRE */}
                        <div className="bg-slate-900/90 border border-slate-800/80 p-6 rounded-3xl space-y-4 shadow-xl">
                            <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                                <Clock className="text-cyan-400" size={20} /> Apertura y Cierre de Jornada
                            </h2>
                            <div className="flex gap-4 pt-2">
                                <button 
                                    onClick={() => handleAction("OPEN_GROUP")}
                                    disabled={!!dailyData?.daily?.openTime}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-black py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                >
                                    {dailyData?.daily?.openTime ? `✓ Abierto (${new Date(dailyData.daily.openTime).toLocaleTimeString()})` : "▶ Abrir Grupo (9 AM)"}
                                </button>
                                <button 
                                    onClick={() => handleAction("CLOSE_GROUP")}
                                    disabled={!!dailyData?.daily?.closeTime}
                                    className="flex-1 bg-slate-950 border border-slate-700 hover:border-slate-500 disabled:opacity-50 text-slate-300 font-black py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all"
                                >
                                    {dailyData?.daily?.closeTime ? `✓ Cerrado (${new Date(dailyData.daily.closeTime).toLocaleTimeString()})` : "⏹ Cerrar Grupo (5 PM)"}
                                </button>
                            </div>
                        </div>

                        {/* AVISOS DEL DIA */}
                        <div className="bg-slate-900/90 border border-slate-800/80 p-6 rounded-3xl space-y-4 shadow-xl">
                            <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                                <AlertCircle className="text-amber-400" size={20} /> Avisos y Directivas del Día
                            </h2>
                            <textarea 
                                value={notices}
                                onChange={e => setNotices(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-amber-500/50 transition-colors min-h-[90px]"
                                placeholder="Escribe los avisos importantes para el equipo hoy..."
                            />
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                                <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                                    <input type="checkbox" checked={publishToSocial} onChange={e => setPublishToSocial(e.target.checked)} className="rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-0" />
                                    Publicar en Muro Social Interno
                                </label>
                                <button onClick={() => handleAction("SAVE_NOTICES", { notices, publishToSocial })} className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-5 py-2.5 rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                                    <Save size={15}/> Guardar Avisos
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ACTIVIDADES Y FORMULARIOS */}
                    <div className="bg-slate-900/90 border border-slate-800/80 p-6 lg:p-8 rounded-3xl space-y-6 shadow-xl">
                        <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                            <CheckSquare className="text-indigo-400" size={20} /> Actividades & Registro de Coordinación
                        </h2>
                        
                        <div className="space-y-4">
                            {/* SEGUIMIENTO FORM */}
                            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-4">
                                <label className="flex items-center justify-between cursor-pointer font-bold text-sm text-slate-200">
                                    <span className="flex items-center gap-3">
                                        <input type="checkbox" checked={showFollowUp} onChange={e => setShowFollowUp(e.target.checked)} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-400" />
                                        <span>Registrar Recordatorio de Seguimiento a Clientes</span>
                                    </span>
                                    <span className="text-xs font-mono text-cyan-400 font-normal">Formulario →</span>
                                </label>
                                
                                {showFollowUp && (
                                    <div className="pl-4 border-l-2 border-cyan-500/40 space-y-4 pt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <input type="text" placeholder="Nombre del Cliente" value={followUpForm.clientName} onChange={e => setFollowUpForm({...followUpForm, clientName: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-cyan-500/50" />
                                            <input type="text" placeholder="Teléfono" value={followUpForm.phone} onChange={e => setFollowUpForm({...followUpForm, phone: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-cyan-500/50" />
                                            <input type="text" placeholder="Detalle / Caso" value={followUpForm.case} onChange={e => setFollowUpForm({...followUpForm, case: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-cyan-500/50" />
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                            <select value={followUpForm.responsibleType} onChange={e => setFollowUpForm({...followUpForm, responsibleType: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 font-bold outline-none">
                                                <option value="ASESOR">Asignar a Asesor</option>
                                                <option value="DIRECTO">Contacto Directo (Coordinación)</option>
                                            </select>
                                            {followUpForm.responsibleType === "ASESOR" && (
                                                <select value={followUpForm.advisorId} onChange={e => setFollowUpForm({...followUpForm, advisorId: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white outline-none flex-1">
                                                    <option value="">Selecciona un Asesor...</option>
                                                    {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                                </select>
                                            )}
                                            <button onClick={() => handleAction("ADD_FOLLOW_UP", followUpForm)} className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 font-mono font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all">
                                                <Send size={14}/> Guardar Seguimiento
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* B2B REPORT FORM */}
                            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-4">
                                <label className="flex items-center justify-between cursor-pointer font-bold text-sm text-slate-200">
                                    <span className="flex items-center gap-3">
                                        <input type="checkbox" checked={showB2B} onChange={e => setShowB2B(e.target.checked)} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-400" />
                                        <span>Reporte Semanal Chat B2B con Asesores</span>
                                    </span>
                                    <span className="text-xs font-mono text-purple-400 font-normal">Formulario →</span>
                                </label>
                                {showB2B && (
                                    <div className="pl-4 border-l-2 border-purple-500/40 space-y-3 pt-2">
                                        <input type="text" placeholder="¿Cómo van los chicos?" value={b2bForm.q1} onChange={e => setB2bForm({...b2bForm, q1: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none w-full" />
                                        <input type="text" placeholder="¿Qué dudas tienen?" value={b2bForm.q2} onChange={e => setB2bForm({...b2bForm, q2: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none w-full" />
                                        <input type="text" placeholder="¿Qué imposibilidades tienen?" value={b2bForm.q3} onChange={e => setB2bForm({...b2bForm, q3: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none w-full" />
                                        <input type="text" placeholder="¿Qué recomendaciones tienen?" value={b2bForm.q4} onChange={e => setB2bForm({...b2bForm, q4: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none w-full" />
                                        <button onClick={() => handleAction("SAVE_REPORT", { ...b2bForm, type: "B2B" })} className="bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 font-mono font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all">
                                            <Save size={14}/> Guardar Reporte B2B
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* ZOOM REPORT FORM */}
                            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-4">
                                <label className="flex items-center justify-between cursor-pointer font-bold text-sm text-slate-200">
                                    <span className="flex items-center gap-3">
                                        <input type="checkbox" checked={showZoom} onChange={e => setShowZoom(e.target.checked)} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-400" />
                                        <span>Reporte Reunión Zoom Operativa</span>
                                    </span>
                                    <span className="text-xs font-mono text-indigo-400 font-normal">Formulario →</span>
                                </label>
                                {showZoom && (
                                    <div className="pl-4 border-l-2 border-indigo-500/40 space-y-3 pt-2">
                                        <textarea placeholder="Puntos acordados en la reunión Zoom..." value={zoomForm.notes} onChange={e => setZoomForm({...zoomForm, notes: e.target.value})} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none w-full min-h-[80px]" />
                                        <button onClick={() => handleAction("SAVE_REPORT", { ...zoomForm, type: "ZOOM" })} className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 font-mono font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all">
                                            <Save size={14}/> Guardar Reporte Zoom
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ASIGNACIÓN DE CONTACTOS */}
                    <div className="bg-slate-900/90 border border-slate-800/80 p-6 lg:p-8 rounded-3xl space-y-6 shadow-xl">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-2">
                                <Users className="text-cyan-400" size={20} /> Asignación de Contactos Directos (Semanal)
                            </h2>
                            <button 
                                onClick={() => setShowContactsDetails(!showContactsDetails)}
                                className="px-4 py-2 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs font-mono font-bold transition-all flex items-center gap-2"
                            >
                                {showContactsDetails ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                {showContactsDetails ? "Ocultar Detalle" : "Detallar Contactos (Nombres/Tel)"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                            <div>
                                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">Objetivo Asignado</label>
                                <input type="text" placeholder="Ej: Afiliar 10 prospectos" value={assignmentForm.objective} onChange={e => setAssignmentForm({...assignmentForm, objective: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none w-full" />
                            </div>
                            <div>
                                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">Cantidad</label>
                                <input type="number" min="1" max="100" value={assignmentForm.amount} onChange={e => setAssignmentForm({...assignmentForm, amount: parseInt(e.target.value) || 1})} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono font-bold text-cyan-300 outline-none w-full" />
                            </div>
                            <div>
                                <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">Asesor a Cargo</label>
                                <select value={assignmentForm.advisorId} onChange={e => setAssignmentForm({...assignmentForm, advisorId: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white outline-none w-full">
                                    <option value="">Seleccionar Asesor...</option>
                                    {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <button onClick={() => {
                                    handleAction("ADD_ASSIGNMENT", { ...assignmentForm, contactsData: showContactsDetails ? contactsList : null });
                                    if (showContactsDetails) {
                                        setContactsList(Array(assignmentForm.amount).fill({ name: "", objective: assignmentForm.objective, businessType: "", phone: "" }));
                                    }
                                    setAssignmentForm({ objective: "", amount: 10, advisorId: "", origin: "" });
                                }} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono font-black py-3 rounded-xl text-xs uppercase tracking-wider hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                    Asignar Carga
                                </button>
                            </div>
                        </div>

                        {showContactsDetails && (
                            <div className="mt-4 border-t border-slate-800 pt-4 space-y-3 max-h-[350px] overflow-y-auto pr-2">
                                <p className="text-xs font-mono text-cyan-400 font-bold">Detalle de los {assignmentForm.amount} contactos a entregar:</p>
                                {contactsList.map((c, i) => (
                                    <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl items-center relative">
                                        <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-md w-fit">#{i + 1}</span>
                                        <input type="text" placeholder="Nombre" value={c.name} onChange={e => { const n = [...contactsList]; n[i].name = e.target.value; setContactsList(n) }} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                                        <input type="text" placeholder="Tipo de Negocio" value={c.businessType} onChange={e => { const n = [...contactsList]; n[i].businessType = e.target.value; setContactsList(n) }} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white" />
                                        <input type="tel" placeholder="Teléfono" value={c.phone} onChange={e => { const n = [...contactsList]; n[i].phone = e.target.value; setContactsList(n) }} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── TAB 2: GESTIÓN DE COTIZACIONES (TABLE HIGH CONTRAST) ── */}
            {activeTab === "COTIZACIONES" && (
                <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <h2 className="text-xl font-black text-white flex items-center gap-3">
                                <FileText className="text-pink-400" size={22} /> Panel de Aprobación de Cotizaciones
                            </h2>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                                Revisa y aprueba cotizaciones formalizadas emitidas por la fuerza de ventas.
                            </p>
                        </div>

                        {/* Filter status buttons */}
                        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                            {(["ALL", "DRAFT", "APPROVED", "REJECTED"] as const).map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setQuoteFilter(st)}
                                    className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold uppercase transition-all ${
                                        quoteFilter === st
                                            ? "bg-pink-500/20 text-pink-300 border border-pink-500/40"
                                            : "text-slate-400 hover:text-white"
                                    }`}
                                >
                                    {st === "ALL" ? "Todas" : st === "DRAFT" ? "Pendientes" : st === "APPROVED" ? "Aprobadas" : "Rechazadas"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {quotesError && (
                        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl text-xs font-mono flex items-center gap-2">
                            <AlertCircle size={16}/> {quotesError}
                        </div>
                    )}

                    {/* HIGH CONTRAST DARK TABLE */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-800">
                        <table className="w-full text-left border-collapse font-mono text-xs">
                            <thead>
                                <tr className="bg-slate-950 text-cyan-400 font-bold uppercase tracking-wider border-b border-slate-800">
                                    <th className="py-3.5 px-4"># Cotización</th>
                                    <th className="py-3.5 px-4">Cliente</th>
                                    <th className="py-3.5 px-4">Asesor</th>
                                    <th className="py-3.5 px-4">Total USD</th>
                                    <th className="py-3.5 px-4">Fecha</th>
                                    <th className="py-3.5 px-4">Estado</th>
                                    <th className="py-3.5 px-4 text-right">Acciones Directivas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                                {quotesLoading && quotes.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-12 text-slate-400">Cargando cotizaciones...</td></tr>
                                ) : quotes.filter(q => quoteFilter === 'ALL' || q.status === quoteFilter).length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-slate-500">
                                            Sin cotizaciones encontradas.
                                        </td>
                                    </tr>
                                ) : (
                                    quotes.filter(q => quoteFilter === 'ALL' || q.status === quoteFilter).map(q => (
                                        <tr key={q.id} className="hover:bg-slate-900/80 transition-colors">
                                            <td className="py-4 px-4 font-bold text-cyan-300">{q.quoteNumber}</td>
                                            <td className="py-4 px-4 text-white font-sans font-medium">{q.clientName || 'Sin Nombre'}</td>
                                            <td className="py-4 px-4 text-slate-400 font-sans">{q.salesperson?.name || q.advisorName || '—'}</td>
                                            <td className="py-4 px-4 font-bold text-emerald-400 text-sm">${q.total?.toFixed(2)}</td>
                                            <td className="py-4 px-4 text-slate-400">{new Date(q.createdAt).toLocaleDateString('es-EC')}</td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                    q.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                                    : q.status === 'REJECTED' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                                                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                                }`}>
                                                    {q.status === 'APPROVED' ? '✓ Aprobada' : q.status === 'REJECTED' ? '✕ Rechazada' : '⏳ Pendiente'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    {q.status !== 'APPROVED' && (
                                                        <button onClick={() => updateQuoteStatus(q.id, 'APPROVED')} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl hover:bg-emerald-500/20 font-bold transition-all flex items-center gap-1">
                                                            <Check size={13}/> Aprobar
                                                        </button>
                                                    )}
                                                    {q.status !== 'REJECTED' && (
                                                        <button onClick={() => updateQuoteStatus(q.id, 'REJECTED')} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl hover:bg-rose-500/20 font-bold transition-all flex items-center gap-1">
                                                            <X size={13}/> Rechazar
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => setPreviewQuote(q)} 
                                                        className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-xl hover:bg-cyan-500/20 font-bold transition-all flex items-center gap-1"
                                                    >
                                                        <FileText size={13}/> Ver PDF
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── TAB 3: SCRAPER & PROSPECCIÓN ── */}
            {activeTab === "SCRAPER" && (
                <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <h2 className="text-xl font-black text-white flex items-center gap-3">
                                <Database className="text-emerald-400" size={22} /> Motor de Extracción & Prospección Inteligente
                            </h2>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                                Extrae empresas y prospectos directamente desde Google Maps y asigna automáticamente a tus asesores.
                            </p>
                        </div>
                    </div>

                    {/* Scraper Controls */}
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                        <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">NUEVA BÚSQUEDA DE PROSPECTOS</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Categoría / Nicho</label>
                                <select 
                                    value={scraperCategory} 
                                    onChange={(e) => setScraperCategory(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-white p-3 rounded-xl outline-none focus:border-emerald-500/50"
                                >
                                    {SCRAPER_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Cantidad de Contactos</label>
                                <select 
                                    value={scraperCount} 
                                    onChange={(e) => setScraperCount(Number(e.target.value))}
                                    className="w-full bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-cyan-300 p-3 rounded-xl outline-none focus:border-emerald-500/50"
                                >
                                    {[1,2,3,4,5,6,7,8,9,10,15,20].map(n => <option key={n} value={n}>{n} contactos</option>)}
                                </select>
                            </div>
                            <div>
                                <button 
                                    onClick={handleScrape}
                                    disabled={scraperLoading}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-mono font-black p-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
                                >
                                    {scraperLoading ? (
                                        <><div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" /> Extrayendo...</>
                                    ) : (
                                        <><Send size={15} /> Extraer Prospectos Ahora</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scraped Contacts List */}
                    <div className="space-y-4">
                        <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Base de Prospectos ({scrapedContacts.length})
                        </h3>

                        {scrapedContacts.length === 0 ? (
                            <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-800">
                                <Users className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                                <p className="text-xs font-mono text-slate-400">Sin prospectos extraídos aún. Selecciona un nicho arriba y presiona Extraer.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-2xl border border-slate-800">
                                <table className="w-full text-left border-collapse font-mono text-xs">
                                    <thead>
                                        <tr className="bg-slate-950 text-cyan-400 font-bold uppercase border-b border-slate-800">
                                            <th className="p-3.5">Empresa / Nombre</th>
                                            <th className="p-3.5">Teléfono</th>
                                            <th className="p-3.5">Categoría</th>
                                            <th className="p-3.5">Fecha</th>
                                            <th className="p-3.5 text-right">Asignación</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                                        {scrapedContacts.map((contact) => (
                                            <tr key={contact.id} className="hover:bg-slate-900/80 transition-colors">
                                                <td className="p-3.5 font-bold text-white">{contact.name}</td>
                                                <td className="p-3.5 text-slate-300 font-mono">{contact.phone}</td>
                                                <td className="p-3.5">
                                                    <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                                        {contact.category}
                                                    </span>
                                                </td>
                                                <td className="p-3.5 text-slate-400">
                                                    {new Date(contact.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-3.5 text-right">
                                                    {contact.status === "ASSIGNED" ? (
                                                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                                                            <Check size={13} /> {advisors.find(a => a.id === contact.advisorId)?.name || 'Asignado'}
                                                        </span>
                                                    ) : (
                                                        <select 
                                                            className="bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 p-1.5 rounded-xl outline-none focus:border-cyan-400"
                                                            onChange={(e) => {
                                                                if(e.target.value) handleAssignScrapedContact(contact.id, e.target.value)
                                                            }}
                                                            defaultValue=""
                                                        >
                                                            <option value="" disabled>Asignar Asesor...</option>
                                                            {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                                        </select>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Quote Preview Modal */}
            <AnimatePresence>
                {previewQuote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
                        onClick={() => setPreviewQuote(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full h-[85vh] overflow-hidden flex flex-col"
                            onClick={(e: any) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                                <h3 className="font-bold text-white font-mono text-sm">Vista Previa Cotización: {previewQuote.quoteNumber}</h3>
                                <button
                                    onClick={() => setPreviewQuote(null)}
                                    className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="flex-1 w-full bg-slate-950 p-6 overflow-auto">
                                {previewQuote.pdfUrl ? (
                                    <iframe src={previewQuote.pdfUrl} className="w-full h-full border-none rounded-2xl" />
                                ) : (
                                    <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 font-mono text-xs">
                                        <div className="flex justify-between border-b border-slate-800 pb-4">
                                            <div>
                                                <h4 className="text-xl font-black text-cyan-400">ATOMIC INDUSTRIES</h4>
                                                <p className="text-slate-400 mt-1">N° Cotización: {previewQuote.quoteNumber}</p>
                                            </div>
                                            <div className="text-right text-slate-300 space-y-1">
                                                <p><strong>Cliente:</strong> {previewQuote.clientName || 'Sin Nombre'}</p>
                                                <p><strong>Total:</strong> <span className="text-emerald-400 font-bold">${previewQuote.total?.toFixed(2)}</span></p>
                                            </div>
                                        </div>
                                        <p className="text-slate-400">Emitido el {new Date(previewQuote.createdAt).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
