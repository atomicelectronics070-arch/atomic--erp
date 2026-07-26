"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Clock, CheckSquare, Save, Users, Calendar, 
    Video, MessageSquare, AlertCircle, FileText, Send, DollarSign, Download, Check, X, ChevronUp, ChevronDown
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
                fetchScrapedContacts() // refresh list
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

    // Test Mode and Date Selector
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
        
        // Auto-clear test mode data if it's older than 20 minutes
        const testDataTime = localStorage.getItem("testDataTime")
        if (testDataTime && (Date.now() - parseInt(testDataTime) > 20 * 60 * 1000)) {
            localStorage.removeItem("testDailyData")
            localStorage.removeItem("testDataTime")
        }

        fetchData()
        fetchAdvisors()
        fetchQuotes(true) // silent initial load to show badge count
    }, [session, status, router, selectedDate])

    const fetchData = async () => {
        setLoading(true)
        try {
            if (isTestMode) {
                // If in test mode, load from localStorage if exists
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

    // React to test mode toggle
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

    // Auto-refresh quotes every 30 seconds when on COTIZACIONES tab
    useEffect(() => {
        if (activeTab !== "COTIZACIONES") return
        fetchQuotes()
        const interval = setInterval(() => fetchQuotes(true), 30000)
        return () => clearInterval(interval)
    }, [activeTab])

    const handleAction = async (action: string, payload: any = {}) => {
        try {
            if (isTestMode) {
                // In test mode, fake the UI updates locally without calling API
                let newDailyData = { ...dailyData }
                if (!newDailyData.daily) newDailyData.daily = {}
                
                if (action === "OPEN_GROUP") newDailyData.daily.openTime = new Date()
                if (action === "CLOSE_GROUP") newDailyData.daily.closeTime = new Date()
                if (action === "SAVE_NOTICES") newDailyData.daily.notices = payload.notices
                if (action === "ADD_FOLLOW_UP") {
                    newDailyData.followUps = [...(newDailyData.followUps || []), { ...payload, id: Date.now() }]
                }
                if (action === "SAVE_REPORT") {
                    newDailyData.reports = [...(newDailyData.reports || []), { ...payload, id: Date.now() }]
                }
                if (action === "ADD_ASSIGNMENT") {
                    newDailyData.assignments = [...(newDailyData.assignments || []), { ...payload, id: Date.now() }]
                }
                
                setDailyData(newDailyData)
                localStorage.setItem("testDailyData", JSON.stringify(newDailyData))
                localStorage.setItem("testDataTime", Date.now().toString())
                
                alert("Guardado (Modo Prueba - el registro se conservará por máximo 20 minutos)")
                return
            }

            const res = await fetch("/api/admin/coordination", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, payload })
            })
            if(res.ok) {
                fetchData() // Refresh data
                alert("Guardado correctamente")
            } else {
                alert("Error al guardar")
            }
        } catch(e) {
            alert("Error de red")
        }
    }
    
    const updateQuoteStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/quotes`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status })
            })
            if(res.ok) {
                fetchQuotes()
                alert(`Cotización marcada como ${status}`)
            }
        } catch(e) {
            alert("Error al actualizar cotización")
        }
    }

    if (loading) return <div className="p-10 text-center">Cargando módulo de coordinación...</div>

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6 text-white bg-[#050505] min-h-screen rounded-3xl border border-slate-800 shadow-2xl">
            {isTestMode && (
                <div className="bg-amber-950/80 border-l-4 border-amber-500 text-amber-200 p-4 rounded-xl shadow-xl">
                    <h3 className="font-bold flex items-center gap-2 text-white"><AlertCircle className="w-5 h-5 text-amber-400"/> Modo Prueba Activo</h3>
                    <p className="text-xs mt-1 text-slate-300">
                        Estás en un entorno de ensayo. Puedes usar esta interfaz para simular un día laboral como coordinadora. 
                        <strong> Ningún dato será guardado en el servidor</strong>. El registro se mantendrá de forma local durante máximo 20 minutos.
                    </p>
                </div>
            )}
            
            <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Calendar className="text-cyan-400" /> Coordinación General
                    </h1>
                    <p className="text-slate-300 text-xs mt-1 font-medium">Panel de control diario para gestión de asesores, reportes y cotizaciones.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Fecha de Bitácora</label>
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-cyan-400 outline-none"
                            disabled={isTestMode}
                        />
                    </div>
                    <button 
                        onClick={() => setIsTestMode(!isTestMode)}
                        className={`mt-5 px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                            isTestMode 
                                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40" 
                                : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
                        }`}
                    >
                        {isTestMode ? <X className="w-4 h-4"/> : <CheckSquare className="w-4 h-4"/>}
                        {isTestMode ? "Salir de Prueba" : "Modo Prueba"}
                    </button>
                </div>
            </div>
            
            <div className="flex gap-4 border-b border-slate-800 pb-2">
                <button 
                    onClick={() => setActiveTab("BITACORA")} 
                    className={`pb-3 px-5 font-black text-xs uppercase tracking-widest transition-all ${activeTab === "BITACORA" ? "border-b-2 border-cyan-400 text-cyan-300" : "text-slate-400 hover:text-white"}`}
                >
                    BITÁCORA DIARIA
                </button>
                <button 
                    onClick={() => setActiveTab("COTIZACIONES")} 
                    className={`pb-3 px-5 font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === "COTIZACIONES" ? "border-b-2 border-cyan-400 text-cyan-300" : "text-slate-400 hover:text-white"}`}
                >
                    COTIZACIONES
                    {quotes.filter(q => q.status === 'DRAFT').length > 0 && (
                        <span className="bg-orange-500 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-md">
                            {quotes.filter(q => q.status === 'DRAFT').length}
                        </span>
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab("SCRAPER")} 
                    className={`pb-3 px-5 font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === "SCRAPER" ? "border-b-2 border-cyan-400 text-cyan-300" : "text-slate-400 hover:text-white"}`}
                >
                    <Users size={14} /> SCRAPER (LEADS)
                </button>
            </div>

            {activeTab === "COTIZACIONES" && (
                <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-6 rounded-xl border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                        <div>
                            <h2 className="text-xl font-semibold flex items-center gap-2"><DollarSign /> Gestión de Cotizaciones</h2>
                            <p className="text-sm text-slate-500 mt-1">Aquí aparecen todas las cotizaciones del sistema. Se actualiza automáticamente cada 30 segundos.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <select 
                                value={quoteFilter} 
                                onChange={e => setQuoteFilter(e.target.value as any)}
                                className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="ALL">Todas ({quotes.length})</option>
                                <option value="DRAFT">Pendientes ({quotes.filter(q => q.status === 'DRAFT').length})</option>
                                <option value="APPROVED">Aprobadas ({quotes.filter(q => q.status === 'APPROVED').length})</option>
                                <option value="REJECTED">Rechazadas ({quotes.filter(q => q.status === 'REJECTED').length})</option>
                            </select>
                            <button 
                                onClick={() => fetchQuotes()}
                                disabled={quotesLoading}
                                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Download size={14} className={quotesLoading ? 'animate-spin' : ''}/>
                                {quotesLoading ? 'Cargando...' : 'Actualizar'}
                            </button>
                        </div>
                    </div>

                    {quotesError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                            <AlertCircle size={16}/> {quotesError}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-y border-slate-200">
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase"># Cotización</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Cliente</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Asesor</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Total</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Fecha</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotesLoading && quotes.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-10 text-slate-400">Cargando cotizaciones...</td></tr>
                                ) : quotes.filter(q => quoteFilter === 'ALL' || q.status === quoteFilter).length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-10">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <DollarSign size={32} className="opacity-30"/>
                                            <span className="font-medium">No hay cotizaciones {quoteFilter !== 'ALL' ? 'con este estado' : 'en el sistema aún'}.</span>
                                            <span className="text-xs">Cuando alguien genere y exporte una cotización, aparecerá aquí.</span>
                                        </div>
                                    </td></tr>
                                ) : (
                                    quotes.filter(q => quoteFilter === 'ALL' || q.status === quoteFilter).map(q => (
                                        <tr key={q.id} className={`border-b border-slate-100 hover:bg-slate-50 ${ q.status === 'DRAFT' ? 'bg-orange-50/40' : ''}`}>
                                            <td className="py-3 px-4 font-bold text-slate-800">{q.quoteNumber}</td>
                                            <td className="py-3 px-4">{q.clientName || 'Sin Nombre'}</td>
                                            <td className="py-3 px-4 text-slate-600 text-sm">{q.salesperson?.name || q.advisorName || '—'}</td>
                                            <td className="py-3 px-4 font-bold text-emerald-700">${q.total?.toFixed(2)}</td>
                                            <td className="py-3 px-4 text-slate-500 text-sm">{new Date(q.createdAt).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    q.status === 'APPROVED' ? 'bg-green-100 text-green-700' 
                                                    : q.status === 'REJECTED' ? 'bg-red-100 text-red-700' 
                                                    : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {q.status === 'APPROVED' ? '✓ Aprobada' : q.status === 'REJECTED' ? '✕ Rechazada' : '⏳ Pendiente'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex justify-end gap-2">
                                                    {q.status !== 'APPROVED' && (
                                                        <button onClick={() => updateQuoteStatus(q.id, 'APPROVED')} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 flex items-center gap-1" title="Aprobar">
                                                            <Check size={14}/> Aprobar
                                                        </button>
                                                    )}
                                                    {q.status !== 'REJECTED' && (
                                                        <button onClick={() => updateQuoteStatus(q.id, 'REJECTED')} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 flex items-center gap-1" title="Rechazar">
                                                            <X size={14}/> Rechazar
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => setPreviewQuote(q)} 
                                                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200 flex items-center gap-1"
                                                        title="Ver Cotización"
                                                    >
                                                        <FileText size={14}/> Ver
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

            {activeTab === "BITACORA" && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* APERTURA Y CIERRE */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-6 rounded-xl border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Clock /> Apertura y Cierre</h2>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleAction("OPEN_GROUP")}
                                    disabled={!!dailyData?.daily?.openTime}
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-200 text-white font-bold py-3 rounded-lg transition-colors"
                                >
                                    {dailyData?.daily?.openTime ? `Abierto (${new Date(dailyData.daily.openTime).toLocaleTimeString()})` : "Abrir Grupo (9 AM)"}
                                </button>
                                <button 
                                    onClick={() => handleAction("CLOSE_GROUP")}
                                    disabled={!!dailyData?.daily?.closeTime}
                                    className="flex-1 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg transition-colors"
                                >
                                    {dailyData?.daily?.closeTime ? `Cerrado (${new Date(dailyData.daily.closeTime).toLocaleTimeString()})` : "Cerrar Grupo (5 PM)"}
                                </button>
                            </div>
                        </div>

                        {/* AVISOS DEL DIA */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-6 rounded-xl border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><AlertCircle /> Avisos del Día</h2>
                            <textarea 
                                value={notices}
                                onChange={e => setNotices(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-3 min-h-[100px] mb-3 focus:border-blue-500 outline-none"
                                placeholder="Escribe los avisos importantes para hoy..."
                            />
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                    <input type="checkbox" checked={publishToSocial} onChange={e => setPublishToSocial(e.target.checked)} className="rounded text-blue-600" />
                                    Publicar en Red Social del Sistema
                                </label>
                                <button onClick={() => handleAction("SAVE_NOTICES", { notices, publishToSocial })} className="bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-all hover:from-cyan-400 hover:to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                                    <Save size={16}/> Guardar Avisos
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-6 rounded-xl border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><CheckSquare /> Actividades y Recordatorios</h2>
                        
                        <div className="space-y-6">
                            {/* SEGUIMIENTO */}
                            <div className="border border-slate-200 rounded-lg p-4">
                                <label className="flex items-center gap-3 font-semibold text-lg cursor-pointer">
                                    <input type="checkbox" checked={showFollowUp} onChange={e => setShowFollowUp(e.target.checked)} className="w-5 h-5 rounded text-blue-600" />
                                    Envío recordatorios de seguimiento a clientes
                                </label>
                                
                                {showFollowUp && (
                                    <div className="mt-4 pl-8 border-l-2 border-blue-200 space-y-4">
                                        <h3 className="font-bold text-slate-700 uppercase text-sm bg-blue-50 p-2 rounded">Llena aquí los clientes que quedaron en seguimiento para mañana</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <input type="text" placeholder="Nombre del Cliente" value={followUpForm.clientName} onChange={e => setFollowUpForm({...followUpForm, clientName: e.target.value})} className="border p-2 rounded w-full" />
                                            <input type="text" placeholder="Número" value={followUpForm.phone} onChange={e => setFollowUpForm({...followUpForm, phone: e.target.value})} className="border p-2 rounded w-full" />
                                            <input type="text" placeholder="Caso" value={followUpForm.case} onChange={e => setFollowUpForm({...followUpForm, case: e.target.value})} className="border p-2 rounded w-full" />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <select value={followUpForm.responsibleType} onChange={e => setFollowUpForm({...followUpForm, responsibleType: e.target.value})} className="border p-2 rounded font-semibold bg-slate-50">
                                                <option value="ASESOR">Asesor</option>
                                                <option value="DIRECTO">Contacto Directo (Coordinación)</option>
                                            </select>
                                            {followUpForm.responsibleType === "ASESOR" && (
                                                <select value={followUpForm.advisorId} onChange={e => setFollowUpForm({...followUpForm, advisorId: e.target.value})} className="border p-2 rounded flex-1">
                                                    <option value="">Selecciona un asesor...</option>
                                                    {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                                </select>
                                            )}
                                            <button onClick={() => handleAction("ADD_FOLLOW_UP", followUpForm)} className="bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-all text-white px-4 py-2 rounded flex items-center gap-2"><Send size={16}/> Guardar Seguimiento</button>
                                        </div>
                                        {/* List saved followups */}
                                        {dailyData?.followUps?.length > 0 && (
                                            <ul className="text-sm bg-slate-50 p-3 rounded mt-2 space-y-1">
                                                {dailyData.followUps.map((f: any) => {
                                                    const advisorName = f.advisorId ? advisors.find(a => a.id === f.advisorId)?.name : null;
                                                    const responsible = advisorName || (f.responsibleType === "ASESOR" ? "Asesor" : "Contacto Directo");
                                                    return (
                                                        <li key={f.id} className="flex flex-col border-b border-slate-200 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
                                                            <span className="font-semibold text-slate-800">{f.clientName}</span>
                                                            <span className="text-slate-600 text-xs mt-0.5">
                                                                <span className="font-medium text-blue-700">Asignado a: {responsible}</span>
                                                                {f.phone && <span className="ml-2">| Tel: {f.phone}</span>}
                                                                {f.case && <span className="ml-2">| Caso: {f.case}</span>}
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* RENDIMIENTO */}
                            <div className="border border-slate-200 rounded-lg p-4">
                                <label className="flex items-center gap-3 font-semibold text-lg cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 rounded text-blue-600" />
                                    Recordatorio de Rendimiento
                                </label>
                            </div>

                            {/* B2B */}
                            <div className="border border-slate-200 rounded-lg p-4">
                                <label className="flex items-center gap-3 font-semibold text-lg cursor-pointer">
                                    <input type="checkbox" checked={showB2B} onChange={e => setShowB2B(e.target.checked)} className="w-5 h-5 rounded text-blue-600" />
                                    Una vez a la semana cumplir chat B2B con asesores
                                </label>
                                {showB2B && (
                                    <div className="mt-4 pl-8 border-l-2 border-purple-200 space-y-3">
                                        <input type="text" placeholder="¿Cómo van los chicos?" value={b2bForm.q1} onChange={e => setB2bForm({...b2bForm, q1: e.target.value})} className="border p-2 rounded w-full" />
                                        <input type="text" placeholder="¿Qué dudas tienen?" value={b2bForm.q2} onChange={e => setB2bForm({...b2bForm, q2: e.target.value})} className="border p-2 rounded w-full" />
                                        <input type="text" placeholder="¿Qué imposibilidades tienen?" value={b2bForm.q3} onChange={e => setB2bForm({...b2bForm, q3: e.target.value})} className="border p-2 rounded w-full" />
                                        <input type="text" placeholder="¿Qué recomendaciones tienen?" value={b2bForm.q4} onChange={e => setB2bForm({...b2bForm, q4: e.target.value})} className="border p-2 rounded w-full" />
                                        <button onClick={() => handleAction("SAVE_REPORT", { ...b2bForm, type: "B2B" })} className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"><Save size={16}/> Guardar Reporte B2B</button>
                                    </div>
                                )}
                            </div>

                            {/* ZOOM */}
                            <div className="border border-slate-200 rounded-lg p-4">
                                <label className="flex items-center gap-3 font-semibold text-lg cursor-pointer">
                                    <input type="checkbox" checked={showZoom} onChange={e => setShowZoom(e.target.checked)} className="w-5 h-5 rounded text-blue-600" />
                                    Reunión Zoom
                                </label>
                                {showZoom && (
                                    <div className="mt-4 pl-8 border-l-2 border-indigo-200 space-y-3">
                                        <textarea placeholder="Reporte de la reunión Zoom..." value={zoomForm.notes} onChange={e => setZoomForm({...zoomForm, notes: e.target.value})} className="border p-2 rounded w-full min-h-[80px]" />
                                        <button onClick={() => handleAction("SAVE_REPORT", { ...zoomForm, type: "ZOOM" })} className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"><Save size={16}/> Guardar Reporte Zoom</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ASIGNACION CONTACTOS */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-6 rounded-xl border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                            <h2 className="text-xl font-semibold flex items-center gap-2"><Users /> Asignar Contactos (Inicio de semana)</h2>
                            <button 
                                onClick={() => setShowContactsDetails(!showContactsDetails)}
                                className="flex items-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded text-sm font-bold transition-colors"
                            >
                                {showContactsDetails ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                {showContactsDetails ? "Ocultar Detalle" : "Detallar Contactos"}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-4 items-end mb-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-sm font-semibold text-slate-500">Objetivo</label>
                                <input type="text" value={assignmentForm.objective} onChange={e => setAssignmentForm({...assignmentForm, objective: e.target.value})} className="border p-2 rounded w-full" />
                            </div>
                            <div className="w-24">
                                <label className="text-sm font-semibold text-slate-500">Cantidad</label>
                                <input type="number" min="1" max="100" value={assignmentForm.amount} onChange={e => setAssignmentForm({...assignmentForm, amount: parseInt(e.target.value) || 1})} className="border p-2 rounded w-full" />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-sm font-semibold text-slate-500">Asesor a cargo</label>
                                <select value={assignmentForm.advisorId} onChange={e => setAssignmentForm({...assignmentForm, advisorId: e.target.value})} className="border p-2 rounded w-full">
                                    <option value="">Seleccionar...</option>
                                    {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-sm font-semibold text-slate-500">Origen</label>
                                <input type="text" value={assignmentForm.origin} onChange={e => setAssignmentForm({...assignmentForm, origin: e.target.value})} className="border p-2 rounded w-full" />
                            </div>
                            <button onClick={() => {
                                handleAction("ADD_ASSIGNMENT", { ...assignmentForm, contactsData: showContactsDetails ? contactsList : null });
                                if (showContactsDetails) {
                                    setContactsList(Array(assignmentForm.amount).fill({ name: "", objective: assignmentForm.objective, businessType: "", phone: "" }));
                                }
                                setAssignmentForm({ objective: "", amount: 10, advisorId: "", origin: "" });
                            }} className="bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-all text-white px-6 py-2 rounded font-bold h-[42px]">Asignar</button>
                        </div>

                        {showContactsDetails && (
                            <div className="mt-4 border-t border-slate-100 pt-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                <h3 className="text-sm font-bold text-slate-700 bg-slate-50 p-2 rounded mb-3">Detalle de los {assignmentForm.amount} contactos a asignar</h3>
                                {contactsList.map((c, i) => (
                                    <div key={i} className="flex flex-wrap md:flex-nowrap gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg items-center relative group mt-2">
                                        <div className="absolute -left-2.5 -top-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-all text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-[0_4px_15px_rgba(0,0,0,0.3)]">{i + 1}</div>
                                        <input 
                                            type="text" placeholder="Nombre del Contacto" value={c.name} 
                                            onChange={e => { const n = [...contactsList]; n[i].name = e.target.value; setContactsList(n) }} 
                                            className="border p-2 rounded flex-1 text-sm min-w-[150px]" 
                                        />
                                        <input 
                                            type="text" placeholder="Objetivo (Ej: Vender plan, Afiliar)" value={c.objective} 
                                            onChange={e => { const n = [...contactsList]; n[i].objective = e.target.value; setContactsList(n) }} 
                                            className="border p-2 rounded flex-1 text-sm min-w-[150px]" 
                                        />
                                        <input 
                                            type="text" placeholder="Tipo de Negocio" value={c.businessType} 
                                            onChange={e => { const n = [...contactsList]; n[i].businessType = e.target.value; setContactsList(n) }} 
                                            className="border p-2 rounded flex-1 text-sm min-w-[150px]" 
                                        />
                                        <input 
                                            type="tel" placeholder="Número Telefónico" value={c.phone} 
                                            onChange={e => { const n = [...contactsList]; n[i].phone = e.target.value; setContactsList(n) }} 
                                            className="border p-2 rounded flex-1 text-sm min-w-[150px]" 
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* RESUMEN DE LA BITACORA */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-6 rounded-xl border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.3)] mt-8">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><FileText /> Resumen de Bitácora (Registros Guardados)</h2>
                        
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            
                            {/* Apertura */}
                            {dailyData?.daily?.openTime && (
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        <Clock size={18} />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-900">Apertura de Grupo</div>
                                            <time className="text-xs font-medium text-emerald-500">{new Date(dailyData.daily.openTime).toLocaleTimeString()}</time>
                                        </div>
                                        <div className="text-slate-500 text-sm">Se registró la apertura del día.</div>
                                    </div>
                                </div>
                            )}

                            {/* Seguimientos */}
                            {dailyData?.followUps?.map((f: any, i: number) => (
                                <div key={`f-${f.id || i}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        <Send size={18} />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-900">Seguimiento: {f.clientName}</div>
                                            <time className="text-xs font-medium text-blue-500">Registrado</time>
                                        </div>
                                        <div className="text-slate-500 text-sm">
                                            <strong>Tel:</strong> {f.phone} <br/>
                                            <strong>Caso:</strong> {f.case} <br/>
                                            <strong>Responsable:</strong> {f.responsibleType}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Reportes */}
                            {dailyData?.reports?.map((r: any, i: number) => (
                                <div key={`r-${r.id || i}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-purple-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        {r.type === 'ZOOM' ? <Video size={18} /> : <MessageSquare size={18} />}
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-900">Reporte {r.type}</div>
                                            <time className="text-xs font-medium text-purple-500">Registrado</time>
                                        </div>
                                        <div className="text-slate-500 text-sm">
                                            {r.type === 'ZOOM' ? r.notes : (
                                                <ul className="list-disc pl-4 space-y-1">
                                                    {r.q1 && <li>{r.q1}</li>}
                                                    {r.q2 && <li>{r.q2}</li>}
                                                    {r.q3 && <li>{r.q3}</li>}
                                                    {r.q4 && <li>{r.q4}</li>}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Asignaciones */}
                            {dailyData?.assignments?.map((a: any, i: number) => (
                                <div key={`a-${a.id || i}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-orange-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        <Users size={18} />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-900">Asignación: {a.objective}</div>
                                            <time className="text-xs font-medium text-orange-500">Registrado</time>
                                        </div>
                                        <div className="text-slate-500 text-sm">
                                            <strong>Cantidad:</strong> {a.amount} <br/>
                                            <strong>Origen:</strong> {a.origin}
                                            {a.contactsData && (
                                                <div className="mt-2">
                                                    <strong className="text-slate-700 block mb-1">Contactos Detallados:</strong>
                                                    <div className="max-h-40 overflow-y-auto custom-scrollbar pr-1 space-y-1">
                                                        {(() => {
                                                            try {
                                                                const parsed = typeof a.contactsData === 'string' ? JSON.parse(a.contactsData) : a.contactsData;
                                                                return Array.isArray(parsed) && parsed.map((c: any, idx: number) => (
                                                                    <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200 text-xs">
                                                                        <div className="font-bold text-slate-800">{c.name || "Sin nombre"}</div>
                                                                        <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                                                                            <span title="Teléfono">📞 {c.phone || "S/N"}</span>
                                                                            <span title="Objetivo">🎯 {c.objective || "-"}</span>
                                                                            <span title="Negocio">🏢 {c.businessType || "-"}</span>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            } catch { return null }
                                                        })()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Cierre */}
                            {dailyData?.daily?.closeTime && (
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-800 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        <CheckSquare size={18} />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                            <div className="font-bold text-slate-900">Cierre de Grupo</div>
                                            <time className="text-xs font-medium text-slate-500">{new Date(dailyData.daily.closeTime).toLocaleTimeString()}</time>
                                        </div>
                                        <div className="text-slate-500 text-sm">Se registró el cierre del día.</div>
                                    </div>
                                </div>
                            )}
                            
                            {(!dailyData?.daily?.openTime && !dailyData?.daily?.closeTime && !dailyData?.followUps?.length && !dailyData?.reports?.length && !dailyData?.assignments?.length) && (
                                <div className="text-center text-slate-500 py-6 italic">Aún no hay registros en la bitácora de este día.</div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {activeTab === "SCRAPER" && (
                <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-6 rounded-xl border border-slate-200 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-b pb-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Users className="text-blue-600" /> Motor Scraper de Leads</h2>
                            <p className="text-sm text-slate-500 mt-1">Busca y extrae contactos inteligentes para asignarlos a los asesores comerciales.</p>
                        </div>
                    </div>

                    {/* Scraper Controls */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8">
                        <h3 className="font-semibold text-slate-700 mb-3 text-sm uppercase">Nueva Búsqueda Inteligente</h3>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Categoría / Nicho</label>
                                <select 
                                    value={scraperCategory} 
                                    onChange={(e) => setScraperCategory(e.target.value)}
                                    className="w-full border p-2 rounded-md bg-slate-900/50 backdrop-blur-xl border-slate-700/50 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    {SCRAPER_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="w-full md:w-48">
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Cantidad a extraer</label>
                                <select 
                                    value={scraperCount} 
                                    onChange={(e) => setScraperCount(Number(e.target.value))}
                                    className="w-full border p-2 rounded-md bg-slate-900/50 backdrop-blur-xl border-slate-700/50 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} contactos</option>)}
                                </select>
                            </div>
                            <button 
                                onClick={handleScrape}
                                disabled={scraperLoading}
                                className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-all hover:from-cyan-400 hover:to-indigo-500 text-white font-bold py-2 px-6 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70 h-[42px]"
                            >
                                {scraperLoading ? (
                                    <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Buscando...</>
                                ) : (
                                    <><Send size={16} /> Extraer Contactos</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Extracted Contacts List */}
                    <div>
                        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">Contactos Guardados ({scrapedContacts.length})</h3>
                        
                        {scrapedContacts.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                <Users className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                                <p className="text-slate-500">No hay contactos extraídos aún. Inicia una búsqueda arriba.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-600 text-xs uppercase border-y border-slate-200">
                                            <th className="p-3 font-semibold w-1/4">Nombre / Entidad</th>
                                            <th className="p-3 font-semibold">Celular</th>
                                            <th className="p-3 font-semibold">Categoría</th>
                                            <th className="p-3 font-semibold">Fecha</th>
                                            <th className="p-3 font-semibold text-right">Asignación</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {scrapedContacts.map((contact) => (
                                            <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-3 font-medium text-slate-800">{contact.name}</td>
                                                <td className="p-3 text-slate-600">{contact.phone}</td>
                                                <td className="p-3">
                                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                                                        {contact.category}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-slate-500 text-sm">
                                                    {new Date(contact.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-3 text-right">
                                                    {contact.status === "ASSIGNED" ? (
                                                        <span className="inline-flex items-center gap-1 text-green-600 font-semibold text-sm bg-green-50 px-3 py-1 rounded-full">
                                                            <Check size={14} /> 
                                                            Asignado a: {advisors.find(a => a.id === contact.advisorId)?.name || 'Asesor'}
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <select 
                                                                className="border p-1.5 rounded text-sm bg-slate-900/50 backdrop-blur-xl border-slate-700/50 min-w-[150px]"
                                                                onChange={(e) => {
                                                                    if(e.target.value) handleAssignScrapedContact(contact.id, e.target.value)
                                                                }}
                                                                defaultValue=""
                                                            >
                                                                <option value="" disabled>Seleccionar Asesor...</option>
                                                                {advisors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                                            </select>
                                                        </div>
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
                        onClick={() => setPreviewQuote(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] overflow-hidden flex flex-col"
                            onClick={(e: any) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-800">Vista Previa: {previewQuote.quoteNumber}</h3>
                                <button
                                    onClick={() => setPreviewQuote(null)}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors ml-4"
                                >
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>
                            <div className="flex-1 w-full bg-slate-100 overflow-auto relative">
                                {previewQuote.pdfUrl ? (
                                    <iframe src={previewQuote.pdfUrl} className="w-full h-full border-none" />
                                ) : (
                                    <div className="max-w-3xl mx-auto my-8 p-10 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200 rounded">
                                        <div className="flex justify-between items-start mb-8 border-b pb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">ATOMIC INDUSTRIES</h2>
                                                <p className="text-slate-500 text-sm mt-1">Doc No.: <span className="font-medium text-slate-700">{previewQuote.quoteNumber}</span></p>
                                            </div>
                                            <div className="text-right text-sm text-slate-600 space-y-1">
                                                <p><strong>Cliente:</strong> {previewQuote.clientName || 'Sin Nombre'}</p>
                                                <p><strong>Asesor:</strong> {previewQuote.salesperson?.name || previewQuote.advisorName || '—'}</p>
                                                <p><strong>Fecha:</strong> {new Date(previewQuote.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        
                                        <table className="w-full text-sm mb-8 text-left">
                                            <thead>
                                                <tr className="border-b-2 border-slate-200 text-slate-600">
                                                    <th className="py-2">Descripción</th>
                                                    <th className="py-2 text-center">Cant.</th>
                                                    <th className="py-2 text-right">P. Unitario</th>
                                                    <th className="py-2 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previewQuote.itemsData && JSON.parse(previewQuote.itemsData).length > 0 ? (
                                                    JSON.parse(previewQuote.itemsData).map((item: any, idx: number) => {
                                                        const subtotal = (item.quantity || 0) * (item.unitPrice || 0);
                                                        const discount = subtotal * ((item.discountPercent || 0) / 100);
                                                        const total = subtotal - discount;
                                                        return (
                                                            <tr key={idx} className="border-b border-slate-100 text-slate-700">
                                                                <td className="py-3 pr-4">{item.description}</td>
                                                                <td className="py-3 text-center">{item.quantity}</td>
                                                                <td className="py-3 text-right">${item.unitPrice?.toFixed(2)}</td>
                                                                <td className="py-3 text-right">${total.toFixed(2)}</td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr><td colSpan={4} className="py-6 text-center text-slate-400">Detalles no disponibles en sistema (Cotización antigua o importada)</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                        
                                        <div className="flex justify-end">
                                            <div className="w-64">
                                                <div className="flex justify-between py-2 border-b text-sm">
                                                    <span className="font-semibold text-slate-600">Subtotal:</span>
                                                    <span className="text-slate-800">${(previewQuote.subtotal || 0).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b text-sm">
                                                    <span className="font-semibold text-slate-600">IVA (15%):</span>
                                                    <span className="text-slate-800">${(previewQuote.tax || 0).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between py-3 font-bold text-lg text-emerald-700">
                                                    <span>TOTAL:</span>
                                                    <span>${(previewQuote.total || 0).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
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

