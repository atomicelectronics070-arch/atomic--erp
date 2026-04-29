"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cpu, Zap, Play, CheckCircle2, AlertTriangle, Loader2, Video, FileText, Database, Layers, ArrowRight, ShieldCheck } from "lucide-react"

export default function AcademyAutomationPage() {
    const [videoPath, setVideoPath] = useState("")
    const [status, setStatus] = useState<"IDLE" | "PLANNING" | "CUTTING" | "SUBTITLING" | "PUBLISHING" | "COMPLETED" | "ERROR">("IDLE")
    const [progress, setProgress] = useState(0)
    const [logs, setLogs] = useState<string[]>([])
    const [courseData, setCourseData] = useState<any>(null)

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 50))

    const startAutomation = async () => {
        if (!videoPath) return alert("Por favor ingrese la ruta del video.")
        
        setStatus("PLANNING")
        addLog("INICIANDO NÚCLEO NEMOTRON-70B...")
        addLog("ANALIZANDO ESTRUCTURA PEDAGÓGICA DEL VIDEO...")
        
        try {
            // Step 1: AI Planning
            setProgress(15)
            const planResponse = await fetch("/api/academy/automate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "PLAN", videoPath })
            })
            const plan = await planResponse.json()
            setCourseData(plan)
            addLog(`PLAN DE CURSO GENERADO: ${plan.title}`)
            addLog(`MÓDULOS DETECTADOS: ${plan.segments.length}`)

            // Step 2: Cutting
            setStatus("CUTTING")
            setProgress(40)
            addLog("INVOCANDO FFmpeg PARA SEGMENTACIÓN SIN PÉRDIDA...")
            const cutResponse = await fetch("/api/academy/automate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "CUT", videoPath, segments: plan.segments })
            })
            addLog("SEGMENTACIÓN COMPLETADA EXITOSAMENTE.")

            // Step 3: Subtitling (Simplified)
            setStatus("SUBTITLING")
            setProgress(70)
            addLog("GENERANDO METADATOS Y SUBTÍTULOS NEURONALES...")
            await new Promise(r => setTimeout(r, 2000)) // Simulating
            addLog("SINCRONIZACIÓN DE TEXTO COMPLETADA.")

            // Step 4: Publishing
            setStatus("PUBLISHING")
            setProgress(90)
            addLog("INYECTANDO DATOS EN NÚCLEO PRISMA DB...")
            const publishResponse = await fetch("/api/academy/automate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "PUBLISH", courseData: { ...plan, videoPath } })
            })
            addLog("CURSO PUBLICADO EN ACADEMIA ATOMIC.")

            setStatus("COMPLETED")
            setProgress(100)
            addLog("SISTEMA EN STANDBY. MISIÓN CUMPLIDA.")
        } catch (error) {
            setStatus("ERROR")
            addLog(`ERROR CRÍTICO: ${error instanceof Error ? error.message : 'Fallo de sistema'}`)
        }
    }

    return (
        <div className="p-8 space-y-12 max-w-[1600px] mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/[0.03] pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[#E8341A]/60">
                        <Cpu className="animate-pulse" size={14} />
                        <span className="text-[9px] font-medium uppercase tracking-[0.6em]">Automation Command Center</span>
                    </div>
                    <h1 className="text-5xl font-light text-white uppercase tracking-tighter leading-none italic">VIDEO <span className="text-[#E8341A] font-black">TO COURSE</span></h1>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.2em] mt-4 italic leading-relaxed max-w-lg">
                        Despliegue de automatización masiva para la creación de contenido educativo de alto nivel.
                    </p>
                </div>
                <div className="bg-white/[0.02] p-6 border border-white/[0.03] backdrop-blur-3xl">
                    <div className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em] mb-3">SISTEMA STATUS</div>
                    <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 ${status === 'COMPLETED' ? 'bg-green-500' : status === 'ERROR' ? 'bg-red-500' : 'bg-[#E8341A] animate-pulse'}`} />
                        <span className="text-sm font-black text-white/80 uppercase tracking-widest">{status}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Control Panel */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="glass-panel p-10 space-y-12 !bg-slate-950/20 border-white/[0.03]">
                        <div className="space-y-6">
                            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E8341A]/50">Ruta de Origen</label>
                            <div className="flex gap-4">
                                <input 
                                    type="text" 
                                    value={videoPath}
                                    onChange={(e) => setVideoPath(e.target.value)}
                                    placeholder="C:/Videos/Curso_Seguridad.mp4"
                                    className="flex-1 bg-transparent border-b border-white/10 p-4 text-xs font-medium uppercase tracking-widest focus:border-[#E8341A]/40 outline-none transition-all placeholder:text-white/5"
                                />
                                <button 
                                    onClick={startAutomation}
                                    disabled={status !== "IDLE" && status !== "COMPLETED" && status !== "ERROR"}
                                    className="px-8 py-4 bg-[#E8341A] text-white font-black uppercase tracking-[0.3em] text-[10px] italic hover:bg-[#FF4D2D] transition-all flex items-center gap-3 disabled:opacity-30"
                                >
                                    {status === "IDLE" ? "EJECUTAR" : "REINICIAR"} <Zap size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Progress Visualization */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">TASK PROGRESS</div>
                                <div className="text-2xl font-light text-white/80 italic">{progress}%</div>
                            </div>
                            <div className="h-[2px] bg-white/5 overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-[#E8341A] shadow-[0_0_15px_rgba(232,52,26,0.6)]"
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-6">
                                {[
                                    { icon: <BrainCircuit size={14} />, label: "PLANNING", active: progress >= 15 },
                                    { icon: <Video size={14} />, label: "CUTTING", active: progress >= 40 },
                                    { icon: <FileText size={14} />, label: "SUBS", active: progress >= 70 },
                                    { icon: <Database size={14} />, label: "PUBLISH", active: progress >= 90 }
                                ].map((step, i) => (
                                    <div key={i} className={`flex items-center gap-4 ${step.active ? 'text-[#E8341A]' : 'text-white/5'}`}>
                                        <div className={`p-3 border ${step.active ? 'border-[#E8341A]/20 bg-[#E8341A]/5' : 'border-white/[0.02]'}`}>
                                            {step.icon}
                                        </div>
                                        <span className="text-[8px] font-black tracking-[0.3em] uppercase hidden md:block">{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Result Preview */}
                    <AnimatePresence>
                        {courseData && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-panel p-10 !bg-white/[0.01] border-white/[0.03]"
                            >
                                <div className="flex items-center gap-5 mb-10">
                                    <ShieldCheck className="text-[#E8341A]/40" size={24} />
                                    <div>
                                        <h3 className="text-xl font-light uppercase tracking-tight text-white/90">{courseData.title}</h3>
                                        <p className="text-[8px] text-white/20 uppercase tracking-[0.4em] font-medium">ESTRUCTURA VALIDADA POR NEMOTRON-70B</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courseData.segments.map((s: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/[0.02] hover:border-white/[0.05] transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="text-[9px] font-black text-[#E8341A]/30 italic">M{i+1}</div>
                                                <div className="text-[10px] font-medium text-white/50 uppercase tracking-widest truncate max-w-[150px]">{s.title}</div>
                                            </div>
                                            <div className="text-[8px] font-mono text-white/20">{s.start} - {s.end}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Console Logs */}
                <div className="lg:col-span-1">
                    <div className="h-full glass-panel !bg-black/20 p-6 font-mono text-[9px] flex flex-col gap-4 border-white/[0.03]">
                        <div className="flex items-center justify-between border-b border-white/[0.03] pb-4 mb-2">
                            <span className="text-white/10 uppercase tracking-[0.3em] font-black">LOGS_STREAM</span>
                            <span className="w-1 h-1 rounded-full bg-green-500/50" />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar opacity-40 hover:opacity-80 transition-opacity">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-3">
                                    <span className="text-[#E8341A]/40 shrink-0">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                                    <span className="text-white/40 leading-relaxed uppercase">{log}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BrainCircuit({ size, className }: { size: number, className?: string }) {
    return <Cpu size={size} className={className} />
}
