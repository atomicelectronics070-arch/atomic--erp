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
        fetchQuotes()
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

    const fetchQuotes = async () => {
        try {
            // Assume we have an endpoint that returns all quotes
            const res = await fetch("/api/admin/quotes")
            if(res.ok) {
                const data = await res.json()
                setQuotes(data.quotes || [])
            }
        } catch(e) {
            console.error(e)
        }
    }

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
                    className={`pb-3 px-4 font-bold text-sm ${activeTab === "COTIZACIONES" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                    COTIZACIONES APROBADAS
                </button>
            </div>

            {activeTab === "COTIZACIONES" && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><DollarSign /> Gestión de Cotizaciones</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-y border-slate-200">
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Cotización</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Cliente</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Total</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotes.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-slate-500">No hay cotizaciones para mostrar.</td></tr>
                                ) : (
                                    quotes.map(q => (
                                        <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4 font-medium">{q.quoteNumber}</td>
                                            <td className="py-3 px-4">{q.clientName || 'Sin Nombre'}</td>
                                            <td className="py-3 px-4 font-bold text-green-600">${q.total?.toFixed(2)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${q.status === 'APPROVED' ? 'bg-green-100 text-green-700' : q.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                                                    {q.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 flex justify-end gap-2">
                                                <button onClick={() => updateQuoteStatus(q.id, 'APPROVED')} className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Aprobar"><Check size={16}/></button>
                                                <button onClick={() => updateQuoteStatus(q.id, 'REJECTED')} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Rechazar"><X size={16}/></button>
                                                <button className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="Exportar (Próximamente)"><Download size={16}/></button>
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
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Users /> Asignar Contactos (Inicio de semana)</h2>
                        <div className="flex flex-wrap gap-4 items-end">
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-sm font-semibold text-slate-500">Objetivo</label>
                                <input type="text" value={assignmentForm.objective} onChange={e => setAssignmentForm({...assignmentForm, objective: e.target.value})} className="border p-2 rounded w-full" />
                            </div>
                            <div className="w-24">
                                <label className="text-sm font-semibold text-slate-500">Cantidad</label>
                                <input type="number" value={assignmentForm.amount} onChange={e => setAssignmentForm({...assignmentForm, amount: parseInt(e.target.value)})} className="border p-2 rounded w-full" />
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
                            <button onClick={() => handleAction("ADD_ASSIGNMENT", assignmentForm)} className="bg-blue-600 text-white px-6 py-2 rounded font-bold h-[42px]">Asignar</button>
                        </div>
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
        </div>
    )
}

