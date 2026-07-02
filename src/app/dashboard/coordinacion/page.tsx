"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
    Clock, CheckSquare, Save, Users, Calendar, 
    Video, MessageSquare, AlertCircle, FileText, Send, DollarSign, Download, Check, X
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
    
    const [activeTab, setActiveTab] = useState<"BITACORA" | "COTIZACIONES">("BITACORA")
    
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
    const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null)
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
        <div className="max-w-6xl mx-auto space-y-8 p-6 text-slate-800">
            {isTestMode && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded shadow-sm">
                    <h3 className="font-bold flex items-center gap-2"><AlertCircle className="w-5 h-5"/> Modo Prueba Activo</h3>
                    <p className="text-sm mt-1">
                        Estás en un entorno de ensayo. Puedes usar esta interfaz para simular un día laboral como coordinadora. 
                        <strong> Ningún dato será guardado en el servidor</strong>. El registro se mantendrá de forma local durante máximo un rato y se borrará si cierras o recargas la página.
                    </p>
                </div>
            )}
            
            <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="text-blue-600" /> Coordinación General
                    </h1>
                    <p className="text-slate-500 mt-2">Panel de control diario para gestión de asesores, reportes y cotizaciones.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-slate-500 mb-1">Fecha de Bitácora</label>
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border border-slate-300 rounded px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                            disabled={isTestMode}
                        />
                    </div>
                    <button 
                        onClick={() => setIsTestMode(!isTestMode)}
                        className={`mt-5 px-4 py-2 rounded font-bold text-sm transition-all flex items-center gap-2 ${
                            isTestMode 
                                ? "bg-red-100 text-red-700 hover:bg-red-200 border border-red-300" 
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                        }`}
                    >
                        {isTestMode ? <X className="w-4 h-4"/> : <CheckSquare className="w-4 h-4"/>}
                        {isTestMode ? "Salir de Prueba" : "Modo Prueba"}
                    </button>
                </div>
            </div>
            
            <div className="flex gap-4 border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab("BITACORA")} 
                    className={`pb-3 px-4 font-bold text-sm ${activeTab === "BITACORA" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                    BITÁCORA DIARIA
                </button>
                <button 
                    onClick={() => setActiveTab("COTIZACIONES")} 
                    className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 ${activeTab === "COTIZACIONES" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                    COTIZACIONES
                    {quotes.filter(q => q.status === 'DRAFT').length > 0 && (
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {quotes.filter(q => q.status === 'DRAFT').length} pendiente{quotes.filter(q => q.status === 'DRAFT').length !== 1 ? 's' : ''}
                        </span>
                    )}
                </button>
            </div>

            {activeTab === "COTIZACIONES" && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
                                                    {q.pdfUrl && (
                                                        <button 
                                                            onClick={() => setPreviewPdfUrl(q.pdfUrl!)} 
                                                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200 flex items-center gap-1"
                                                        >
                                                            <Download size={14}/> PDF
                                                        </button>
                                                    )}
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
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
                                <button onClick={() => handleAction("SAVE_NOTICES", { notices, publishToSocial })} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                                    <Save size={16}/> Guardar Avisos
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
                                            <button onClick={() => handleAction("ADD_FOLLOW_UP", followUpForm)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"><Send size={16}/> Guardar Seguimiento</button>
                                        </div>
                                        {/* List saved followups */}
                                        {dailyData?.followUps?.length > 0 && (
                                            <ul className="text-sm bg-slate-50 p-3 rounded mt-2 space-y-1">
                                                {dailyData.followUps.map((f: any) => <li key={f.id}>• {f.clientName} - {f.responsibleType}</li>)}
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
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
                            }} className="bg-blue-600 text-white px-6 py-2 rounded font-bold h-[42px]">Asignar</button>
                        </div>

                        {showContactsDetails && (
                            <div className="mt-4 border-t border-slate-100 pt-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                <h3 className="text-sm font-bold text-slate-700 bg-slate-50 p-2 rounded mb-3">Detalle de los {assignmentForm.amount} contactos a asignar</h3>
                                {contactsList.map((c, i) => (
                                    <div key={i} className="flex flex-wrap md:flex-nowrap gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg items-center relative group mt-2">
                                        <div className="absolute -left-2.5 -top-2.5 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">{i + 1}</div>
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
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-8">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2"><FileText /> Resumen de Bitácora (Registros Guardados)</h2>
                        
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                            
                            {/* Apertura */}
                            {dailyData?.daily?.openTime && (
                                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        <Clock size={18} />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
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
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
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
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
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
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
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
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
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

            {/* PDF Preview Modal */}
            <AnimatePresence>
                {previewPdfUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
                        onClick={() => setPreviewPdfUrl(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[90vh] overflow-hidden flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-800">Visualización de Cotización</h3>
                                <button
                                    onClick={() => setPreviewPdfUrl(null)}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors ml-4"
                                >
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>
                            <div className="flex-1 w-full bg-slate-100">
                                <iframe src={previewPdfUrl} className="w-full h-full border-none" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

