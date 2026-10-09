"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    X, Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, 
    MessageSquare, Users, Sparkles, Volume2, ShieldCheck, 
    Maximize2, Minimize2, Send, CheckCircle2, User, PhoneCall
} from "lucide-react"

interface Participant {
    id: string
    name: string
    roleName: string
    department?: string
    avatar?: string
    isHost?: boolean
    isMuted?: boolean
    isVideoOff?: boolean
}

export default function AtomicMeetModal({
    isOpen,
    onClose,
    targetMember,
    embedded = false
}: {
    isOpen: boolean
    onClose: () => void
    targetMember?: { id?: string; name: string; roleName?: string; phone?: string; email?: string } | null
    embedded?: boolean
}) {
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [callDuration, setCallDuration] = useState(0)
    const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
        { sender: "Sistema ATOMIC", text: "Canal P2P encriptado establecido con éxito. Videollamada ilimitada activa.", time: "00:01" }
    ])
    const [inputMessage, setInputMessage] = useState("")

    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const mediaStreamRef = useRef<MediaStream | null>(null)
    const screenStreamRef = useRef<MediaStream | null>(null)

    // Call timer
    useEffect(() => {
        let interval: any
        if (isOpen) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1)
            }, 1000)
        } else {
            setCallDuration(0)
        }
        return () => clearInterval(interval)
    }, [isOpen])

    // Initialize Camera & Microphone Stream
    useEffect(() => {
        if (!isOpen) {
            stopAllStreams()
            return
        }

        const startLocalMedia = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                        audio: true
                    })
                    mediaStreamRef.current = stream
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream
                    }
                }
            } catch (err) {
                console.warn("Camera/Mic permissions not granted or running in headless mode:", err)
            }
        }

        startLocalMedia()

        return () => {
            stopAllStreams()
        }
    }, [isOpen])

    const stopAllStreams = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop())
            mediaStreamRef.current = null
        }
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop())
            screenStreamRef.current = null
        }
    }

    const toggleMute = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = isMuted
            })
        }
        setIsMuted(!isMuted)
    }

    const toggleVideo = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getVideoTracks().forEach(track => {
                track.enabled = isVideoOff
            })
        }
        setIsVideoOff(!isVideoOff)
    }

    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach(track => track.stop())
                screenStreamRef.current = null
            }
            if (localVideoRef.current && mediaStreamRef.current) {
                localVideoRef.current.srcObject = mediaStreamRef.current
            }
            setIsScreenSharing(false)
        } else {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
                    const screenStream = await navigator.mediaDevices.getDisplayMedia({
                        video: true,
                        audio: true
                    })
                    screenStreamRef.current = screenStream
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = screenStream
                    }
                    screenStream.getVideoTracks()[0].onended = () => {
                        toggleScreenShare()
                    }
                    setIsScreenSharing(true)
                }
            } catch (err) {
                console.warn("Screen share cancelled or failed:", err)
            }
        }
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputMessage.trim()) return
        const now = new Date()
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
        setChatMessages(prev => [...prev, { sender: "Tú", text: inputMessage.trim(), time: timeStr }])
        setInputMessage("")
    }

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60)
        const s = secs % 60
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    }

    const callerName = targetMember?.name || "Colaborador de Equipo"
    const callerRole = targetMember?.roleName || "Área Operativa"

    if (!isOpen) return null

    const modalBody = (
        <div
            className={`relative w-full ${embedded ? "h-full" : isMinimized ? "max-w-md h-72" : "max-w-6xl h-[88vh]"} bg-[#070a14] border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden transition-all duration-300`}
        >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                <Video size={20} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white text-sm sm:text-base tracking-tight">
                                        ATOMIC Meet · Zoom Interno
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                        EN VIVO {formatTime(callDuration)}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 font-mono">
                                    Videollamada P2P ilimitada con <span className="text-cyan-300 font-bold">{callerName}</span> ({callerRole})
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                                title={isMinimized ? "Expandir" : "Minimizar (PiP)"}
                            >
                                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                                title="Cerrar ventana"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Main Video Arena */}
                    <div className="flex-1 relative flex overflow-hidden">
                        {/* Video Grid */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#05070e] relative">
                            {/* Local Video Stream */}
                            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-center group">
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={`w-full h-full object-cover transition-opacity ${isVideoOff ? "opacity-0" : "opacity-100"}`}
                                />
                                {isVideoOff && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-950">
                                        <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-2xl font-black mb-2">
                                            Tú
                                        </div>
                                        <span className="text-xs font-mono text-slate-400">Cámara Desactivada</span>
                                    </div>
                                )}
                                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-mono text-white">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                    <span>Tú {isScreenSharing ? "(Compartiendo Pantalla)" : ""}</span>
                                    {isMuted && <MicOff size={13} className="text-rose-400" />}
                                </div>
                            </div>

                            {/* Remote Video Stream (Simulated / P2P Partner) */}
                            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-center group">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-cyan-950/30 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="relative mb-4">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-1 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white text-3xl font-black">
                                                {callerName.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-white">
                                            <CheckCircle2 size={14} />
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-bold text-white">{callerName}</h4>
                                    <p className="text-xs font-mono text-cyan-400 mt-1 uppercase tracking-wider">{callerRole}</p>
                                    <div className="mt-4 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-slate-300 flex items-center gap-2">
                                        <Volume2 size={13} className="text-cyan-400 animate-pulse" />
                                        <span>Conexión de Alta Fidelidad · Audio 320kbps</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-mono text-white">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span>{callerName}</span>
                                </div>
                            </div>
                        </div>

                        {/* In-Call Side Chat */}
                        <AnimatePresence>
                            {showChat && !isMinimized && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 320 }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="border-l border-white/10 bg-[#060812] flex flex-col h-full"
                                >
                                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                        <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
                                            <MessageSquare size={14} className="text-cyan-400" />
                                            Chat de la Llamada
                                        </span>
                                        <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-white">
                                            <X size={15} />
                                        </button>
                                    </div>
                                    <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs">
                                        {chatMessages.map((m, idx) => (
                                            <div key={idx} className={`p-2.5 rounded-xl ${m.sender === "Tú" ? "bg-cyan-500/20 border border-cyan-500/30 text-white ml-4" : "bg-slate-900 border border-slate-800 text-slate-300 mr-4"}`}>
                                                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                                                    <span className="font-bold text-cyan-300">{m.sender}</span>
                                                    <span>{m.time}</span>
                                                </div>
                                                <p>{m.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            placeholder="Mensaje en llamada..."
                                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                                        />
                                        <button
                                            type="submit"
                                            className="p-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Control Bar */}
                    <div className="px-6 py-4 bg-slate-950 border-t border-white/10 flex items-center justify-between">
                        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <span>P2P WebRTC Seguro</span>
                        </div>

                        <div className="flex items-center gap-3 mx-auto sm:mx-0">
                            {/* Mic Toggle */}
                            <button
                                onClick={toggleMute}
                                className={`p-3.5 rounded-2xl font-bold transition-all ${
                                    isMuted 
                                        ? "bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30" 
                                        : "bg-slate-900 border border-slate-800 text-white hover:bg-slate-800"
                                }`}
                                title={isMuted ? "Activar micrófono" : "Silenciar micrófono"}
                            >
                                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>

                            {/* Camera Toggle */}
                            <button
                                onClick={toggleVideo}
                                className={`p-3.5 rounded-2xl font-bold transition-all ${
                                    isVideoOff 
                                        ? "bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30" 
                                        : "bg-slate-900 border border-slate-800 text-white hover:bg-slate-800"
                                }`}
                                title={isVideoOff ? "Encender cámara" : "Apagar cámara"}
                            >
                                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                            </button>

                            {/* Screen Share */}
                            <button
                                onClick={toggleScreenShare}
                                className={`p-3.5 rounded-2xl font-bold transition-all ${
                                    isScreenSharing 
                                        ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]" 
                                        : "bg-slate-900 border border-slate-800 text-white hover:bg-slate-800"
                                }`}
                                title={isScreenSharing ? "Detener pantalla compartida" : "Compartir pantalla"}
                            >
                                <ScreenShare size={20} />
                            </button>

                            {/* Toggle Chat */}
                            <button
                                onClick={() => setShowChat(!showChat)}
                                className={`p-3.5 rounded-2xl font-bold transition-all ${
                                    showChat 
                                        ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300" 
                                        : "bg-slate-900 border border-slate-800 text-white hover:bg-slate-800"
                                }`}
                                title="Chat de la llamada"
                            >
                                <MessageSquare size={20} />
                            </button>

                            {/* End Call Button */}
                            <button
                                onClick={onClose}
                                className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(225,29,72,0.4)] transition-all active:scale-95 cursor-pointer"
                                title="Finalizar llamada"
                            >
                                <PhoneOff size={20} />
                                <span className="hidden sm:inline text-xs font-mono uppercase tracking-wider">Finalizar</span>
                            </button>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
                            <span>Duración:</span>
                            <span className="text-white font-bold">{formatTime(callDuration)}</span>
                        </div>
                    </div>
        </div>
    )

    if (embedded) {
        return modalBody
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full flex items-center justify-center"
                >
                    {modalBody}
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
