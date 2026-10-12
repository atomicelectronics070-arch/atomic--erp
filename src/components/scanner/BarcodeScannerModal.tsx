"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { 
    Camera, X, Scan, Flashlight, RefreshCw, Plus, Minus, Check, 
    AlertCircle, ShoppingBag, Download, Trash2, ArrowRight, 
    FileSpreadsheet, Sparkles, Layers, Box, Tag, DollarSign, Search,
    Flame, Upload, Image as ImageIcon
} from "lucide-react"

export interface ScannedProductItem {
    id?: string
    sku: string
    name: string
    price: number
    compareAtPrice?: number
    discountPercent?: number
    isRemate?: boolean
    stock: number
    category: string
    provider?: string
    description?: string
    images?: string[]
    scannedAt: string
    isNew?: boolean
}

interface BarcodeScannerModalProps {
    isOpen: boolean
    onClose: () => void
    onProductSelected?: (product: ScannedProductItem) => void
}

export default function BarcodeScannerModal({
    isOpen,
    onClose,
    onProductSelected
}: BarcodeScannerModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationFrameRef = useRef<number | null>(null)

    // State
    const [cameraActive, setCameraActive] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment")
    const [torchOn, setTorchOn] = useState(false)
    const [hasTorch, setHasTorch] = useState(false)
    const [manualCode, setManualCode] = useState("")
    const [isLookingUp, setIsLookingUp] = useState(false)
    const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)
    
    // Result & Form state
    const [activeResult, setActiveResult] = useState<ScannedProductItem | null>(null)
    const [isNewProductForm, setIsNewProductForm] = useState(false)
    const [newProductData, setNewProductData] = useState({
        sku: "",
        name: "",
        price: "",
        compareAtPrice: "",
        stock: "1",
        categoryName: "Seguridad Electrónica",
        provider: "ATOMIC",
        description: ""
    })
    const [productImage, setProductImage] = useState<string | null>(null)
    const [isRemateSelected, setIsRemateSelected] = useState(false)
    const [listFilter, setListFilter] = useState<"all" | "general" | "remate">("all")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [isSavingProduct, setIsSavingProduct] = useState(false)
    const [saveMessage, setSaveMessage] = useState<string | null>(null)

    // Capture photo from active camera stream
    const capturePhotoFromStream = () => {
        if (!videoRef.current) return
        try {
            const canvas = document.createElement("canvas")
            canvas.width = videoRef.current.videoWidth || 640
            canvas.height = videoRef.current.videoHeight || 480
            const ctx = canvas.getContext("2d")
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
                const dataUrl = canvas.toDataURL("image/jpeg", 0.85)
                setProductImage(dataUrl)
            }
        } catch (e) {
            console.error("Error capturing photo from stream", e)
        }
    }

    // Handle file upload from device
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProductImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    // Toggle product between General list and Stock de Remate
    const toggleRemateStatus = async (item: ScannedProductItem) => {
        if (!item.id) return
        const willBeRemate = !item.isRemate
        try {
            const res = await fetch("/api/stock-remate", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: item.id,
                    addToRemate: willBeRemate,
                    removeFromRemate: !willBeRemate
                })
            })
            if (res.ok) {
                setActiveResult(prev => prev && prev.id === item.id ? { ...prev, isRemate: willBeRemate } : prev)
                setScannedList(prev => prev.map(p => p.id === item.id ? { ...p, isRemate: willBeRemate } : p))
            }
        } catch (e) {
            console.error("Error toggling remate status:", e)
        }
    }

    // Session Scanned History List
    const [scannedList, setScannedList] = useState<ScannedProductItem[]>([])
    const [activeTab, setActiveTab] = useState<"scanner" | "list">("scanner")

    // Beep synthesizer
    const playScanBeep = useCallback(() => {
        if (typeof window === "undefined") return
        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
            if (!AudioCtx) return
            const ctx = new AudioCtx()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = "sine"
            osc.frequency.setValueAtTime(880, ctx.currentTime) // A5 note
            osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08) // quick sweep up
            gain.gain.setValueAtTime(0.15, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start()
            osc.stop(ctx.currentTime + 0.12)
        } catch (e) {
            // AudioContext not allowed or not supported
        }

        if (typeof navigator !== "undefined" && navigator.vibrate) {
            try {
                navigator.vibrate(80)
            } catch (_) {}
        }
    }, [])

    // Start Camera Stream
    const startCamera = useCallback(async () => {
        setCameraError(null)
        try {
            // Stop existing stream if any
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop())
            }

            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            }

            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            streamRef.current = stream

            if (videoRef.current) {
                videoRef.current.srcObject = stream
                await videoRef.current.play()
                setCameraActive(true)

                // Check for torch capability
                const track = stream.getVideoTracks()[0]
                const capabilities = track.getCapabilities ? (track.getCapabilities() as any) : {}
                if (capabilities && capabilities.torch) {
                    setHasTorch(true)
                } else {
                    setHasTorch(false)
                }
            }
        } catch (err: any) {
            console.warn("Camera access failed:", err)
            setCameraError(
                err.name === "NotAllowedError" 
                    ? "Permiso de cámara denegado. Puedes ingresar el código manualmente abajo." 
                    : "No se pudo acceder a la cámara. Prueba el ingreso manual o verifica que otra app no la esté usando."
            )
            setCameraActive(false)
        }
    }, [facingMode])

    // Stop Camera Stream
    const stopCamera = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
            animationFrameRef.current = null
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
        setCameraActive(false)
        setTorchOn(false)
    }, [])

    // Toggle Torch
    const toggleTorch = async () => {
        if (!streamRef.current) return
        const track = streamRef.current.getVideoTracks()[0]
        if (!track) return

        try {
            const newTorchState = !torchOn
            await track.applyConstraints({
                advanced: [{ torch: newTorchState } as any]
            })
            setTorchOn(newTorchState)
        } catch (e) {
            console.error("Torch error", e)
        }
    }

    // Lookup code in database
    const handleCodeDetected = useCallback(async (code: string) => {
        const cleanCode = code.trim()
        if (!cleanCode || cleanCode === lastScannedCode || isLookingUp) return

        setLastScannedCode(cleanCode)
        setIsLookingUp(true)
        playScanBeep()

        try {
            const res = await fetch(`/api/scanner?code=${encodeURIComponent(cleanCode)}`)
            const data = await res.json()

            if (data.found && data.product) {
                const item: ScannedProductItem = {
                    ...data.product,
                    scannedAt: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
                    isNew: false
                }
                setActiveResult(item)
                setIsNewProductForm(false)

                // Add to history list (avoid immediate duplicate)
                setScannedList(prev => {
                    const filtered = prev.filter(p => p.sku !== item.sku)
                    return [item, ...filtered]
                })

                if (onProductSelected) onProductSelected(item)
            } else {
                // Not found -> open registration form
                setActiveResult(null)
                setIsNewProductForm(true)
                setNewProductData({
                    sku: cleanCode,
                    name: "",
                    price: "",
                    compareAtPrice: "",
                    stock: "1",
                    categoryName: "Seguridad Electrónica",
                    provider: "ATOMIC",
                    description: ""
                })
            }
        } catch (e) {
            console.error("Scanner lookup error", e)
        } finally {
            setIsLookingUp(false)
            // Allow re-scanning after 2 seconds
            setTimeout(() => {
                setLastScannedCode(null)
            }, 2000)
        }
    }, [lastScannedCode, isLookingUp, playScanBeep, onProductSelected])

    // Scan loop using BarcodeDetector API if available
    useEffect(() => {
        if (!cameraActive || !isOpen) return

        let isRunning = true
        let barcodeDetector: any = null

        if (typeof window !== "undefined" && "BarcodeDetector" in window) {
            try {
                barcodeDetector = new (window as any).BarcodeDetector({
                    formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "code_93", "qr_code", "data_matrix"]
                })
            } catch (e) {
                barcodeDetector = null
            }
        }

        const detectFrame = async () => {
            if (!isRunning) return

            if (videoRef.current && videoRef.current.readyState >= 2 && barcodeDetector) {
                try {
                    const barcodes = await barcodeDetector.detect(videoRef.current)
                    if (barcodes.length > 0 && barcodes[0].rawValue) {
                        handleCodeDetected(barcodes[0].rawValue)
                    }
                } catch (_) {}
            }

            animationFrameRef.current = requestAnimationFrame(detectFrame)
        }

        animationFrameRef.current = requestAnimationFrame(detectFrame)

        return () => {
            isRunning = false
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [cameraActive, isOpen, handleCodeDetected])

    // Modal lifecycle: start/stop camera
    useEffect(() => {
        if (isOpen) {
            startCamera()
        } else {
            stopCamera()
            setActiveResult(null)
            setIsNewProductForm(false)
            setLastScannedCode(null)
        }

        return () => {
            stopCamera()
        }
    }, [isOpen, startCamera, stopCamera])

    // Handle Manual Code Submission
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (manualCode.trim()) {
            handleCodeDetected(manualCode.trim())
            setManualCode("")
        }
    }

    // Handle Quick Stock Adjust (+1 / -1)
    const handleStockDelta = async (delta: number) => {
        if (!activeResult?.id) return
        try {
            const res = await fetch("/api/scanner", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: activeResult.id, stockDelta: delta })
            })
            const data = await res.json()
            if (data.success) {
                const updatedStock = data.stock
                setActiveResult(prev => prev ? { ...prev, stock: updatedStock } : null)
                setScannedList(prev => prev.map(p => p.id === activeResult.id ? { ...p, stock: updatedStock } : p))
            }
        } catch (e) {
            console.error("Stock adjust failed", e)
        }
    }

    // Save Brand New Product Form
    const handleSaveNewProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSavingProduct(true)
        setSaveMessage(null)

        try {
            const res = await fetch("/api/scanner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newProductData,
                    images: productImage ? [productImage] : undefined,
                    isRemate: isRemateSelected
                })
            })
            const data = await res.json()

            if (!res.ok || data.error) {
                setSaveMessage(`❌ ${data.error || "Error al guardar el producto"}`)
            } else {
                const saved = data.product
                const item: ScannedProductItem = {
                    id: saved.id,
                    sku: saved.sku || newProductData.sku,
                    name: saved.name,
                    price: saved.price,
                    compareAtPrice: saved.compareAtPrice,
                    discountPercent: saved.compareAtPrice && saved.compareAtPrice > saved.price 
                        ? Math.round(((saved.compareAtPrice - saved.price) / saved.compareAtPrice) * 100) 
                        : 0,
                    isRemate: isRemateSelected,
                    stock: saved.stock,
                    category: saved.category?.name || newProductData.categoryName,
                    provider: saved.provider || newProductData.provider,
                    description: saved.description || "",
                    images: productImage ? [productImage] : (saved.images ? (typeof saved.images === 'string' && saved.images.startsWith('[') ? JSON.parse(saved.images) : [saved.images]) : []),
                    scannedAt: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
                    isNew: false
                }

                setActiveResult(item)
                setIsNewProductForm(false)
                setProductImage(null)
                setIsRemateSelected(false)
                setScannedList(prev => [item, ...prev.filter(p => p.sku !== item.sku)])
                setSaveMessage("✅ ¡Producto registrado exitosamente en el catálogo ATOMIC!")

                if (onProductSelected) onProductSelected(item)
            }
        } catch (err: any) {
            setSaveMessage("❌ Error de conexión al registrar producto.")
        } finally {
            setIsSavingProduct(false)
        }
    }

    // Export Scanned History to CSV
    const exportHistoryCSV = () => {
        if (scannedList.length === 0) return
        const headers = ["SKU / CODIGO", "PRODUCTO", "CATEGORIA", "PVP VENTA ($)", "STOCK", "HORA ESCANEO"]
        const rows = scannedList.map(p => [
            `"${p.sku}"`,
            `"${p.name.replace(/"/g, '""')}"`,
            `"${p.category}"`,
            p.price.toFixed(2),
            p.stock,
            `"${p.scannedAt}"`
        ])
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `INVENTARIO_ESCANEADO_ATOMIC_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Total valuation of current scanned list
    const totalInventoryValue = scannedList.reduce((acc, curr) => acc + curr.price * (curr.stock > 0 ? curr.stock : 1), 0)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-[#070b18] border border-cyan-500/40 rounded-[32px] shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
                
                {/* ── TOP HEADER ── */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                            <Scan size={22} className="animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                                <span>Escáner de Códigos de Barras</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                    Móvil & Cámara
                                </span>
                            </h2>
                            <p className="text-[11px] font-mono text-slate-400">
                                Detección óptica en vivo · Registro de inventario ATOMIC
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/5"
                        title="Cerrar Escáner"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ── TABS: SCANNER vs LISTA ESCANEADA ── */}
                <div className="flex border-b border-white/10 bg-black/40 px-6 pt-2 shrink-0">
                    <button
                        onClick={() => setActiveTab("scanner")}
                        className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                            activeTab === "scanner" 
                                ? "border-cyan-400 text-cyan-300 bg-cyan-500/10 rounded-t-xl" 
                                : "border-transparent text-slate-400 hover:text-white"
                        }`}
                    >
                        <Camera size={15} />
                        <span>Cámara Escáner</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("list")}
                        className={`px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                            activeTab === "list" 
                                ? "border-cyan-400 text-cyan-300 bg-cyan-500/10 rounded-t-xl" 
                                : "border-transparent text-slate-400 hover:text-white"
                        }`}
                    >
                        <FileSpreadsheet size={15} />
                        <span>Lista Escaneada ({scannedList.length})</span>
                    </button>
                </div>

                {/* ── BODY CANVAS ── */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
                    
                    {/* VIEW TAB 1: SCANNER */}
                    {activeTab === "scanner" && (
                        <div className="space-y-6">
                            
                            {/* CAMERA VIEWFINDER CONTAINER */}
                            <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full rounded-3xl bg-black border border-cyan-500/30 overflow-hidden shadow-2xl flex items-center justify-center group">
                                <video 
                                    ref={videoRef} 
                                    playsInline 
                                    muted 
                                    className="w-full h-full object-cover"
                                />
                                <canvas ref={canvasRef} className="hidden" />

                                {/* Viewfinder Overlays & Reticle */}
                                {cameraActive && (
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                                        {/* Corner brackets */}
                                        <div className="relative w-64 h-44 sm:w-80 sm:h-52 border-2 border-dashed border-cyan-400/50 rounded-2xl flex items-center justify-center">
                                            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl" />
                                            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl" />
                                            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl" />
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-xl" />

                                            {/* Glowing Laser Scanline */}
                                            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-[bounce_2s_infinite]" />
                                            
                                            <span className="absolute bottom-2 text-[10px] font-mono font-bold text-cyan-300/80 bg-black/60 px-2 py-0.5 rounded-full">
                                                Apunta el código aquí
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Camera Controls Top Right */}
                                <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                                    {hasTorch && (
                                        <button
                                            onClick={toggleTorch}
                                            className={`p-2.5 rounded-2xl backdrop-blur-md transition-all cursor-pointer border ${
                                                torchOn 
                                                    ? "bg-amber-400 text-black border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)]" 
                                                    : "bg-black/60 text-white border-white/20 hover:bg-black/80"
                                            }`}
                                            title="Linterna / Flash"
                                        >
                                            <Flashlight size={18} />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            setFacingMode(prev => prev === "environment" ? "user" : "environment")
                                            startCamera()
                                        }}
                                        className="p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-all cursor-pointer"
                                        title="Cambiar Cámara (Frontal / Trasera)"
                                    >
                                        <RefreshCw size={18} />
                                    </button>
                                </div>

                                {/* Loading Indicator */}
                                {isLookingUp && (
                                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30">
                                        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.6)]" />
                                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
                                            Consultando Base de Datos...
                                        </span>
                                    </div>
                                )}

                                {/* Camera Error Fallback */}
                                {cameraError && (
                                    <div className="absolute inset-0 bg-slate-950/95 p-6 flex flex-col items-center justify-center text-center gap-3 z-10">
                                        <AlertCircle size={32} className="text-amber-400" />
                                        <p className="text-xs text-slate-300 max-w-sm">{cameraError}</p>
                                        <button
                                            onClick={startCamera}
                                            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-mono font-bold hover:bg-cyan-500/30"
                                        >
                                            Reintentar Cámara
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* MANUAL INPUT FORM */}
                            <form onSubmit={handleManualSubmit} className="flex gap-2">
                                <div className="relative flex-1">
                                    <Tag size={16} className="absolute left-4 top-3.5 text-slate-500" />
                                    <input
                                        type="text"
                                        value={manualCode}
                                        onChange={e => setManualCode(e.target.value)}
                                        placeholder="O escribe / pega el código de barras aquí..."
                                        className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 text-sm font-mono text-white placeholder:text-slate-500 rounded-2xl pl-11 pr-4 py-3 outline-none transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!manualCode.trim() || isLookingUp}
                                    className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                                >
                                    <Search size={15} />
                                    <span>Buscar</span>
                                </button>
                            </form>

                            {/* ── SCAN RESULT: FOUND IN DATABASE ── */}
                            {activeResult && !isNewProductForm && (
                                <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-slate-900 border border-emerald-500/40 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-[10px] font-mono font-black uppercase text-emerald-400 tracking-wider">
                                                Producto Registrado en ATOMIC
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-400">
                                            SKU: <strong className="text-white">{activeResult.sku}</strong>
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 text-cyan-400 overflow-hidden">
                                            {activeResult.images && activeResult.images[0] ? (
                                                <img 
                                                    src={activeResult.images[0]} 
                                                    alt={activeResult.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <Box size={28} />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-bold text-white truncate">{activeResult.name}</h3>
                                            <p className="text-xs font-mono text-cyan-400 mt-0.5">{activeResult.category}</p>
                                            
                                            <div className="flex items-center gap-4 mt-2">
                                                <div>
                                                    <span className="text-[9px] font-mono uppercase text-slate-400 block">PVP Venta</span>
                                                    <span className="text-lg font-black text-white">${activeResult.price.toFixed(2)} USD</span>
                                                </div>

                                                <div className="border-l border-slate-800 pl-4">
                                                    <span className="text-[9px] font-mono uppercase text-slate-400 block">Stock Actual</span>
                                                    <span className={`text-base font-bold font-mono ${activeResult.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {activeResult.stock} unid.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stock Controls & Remate Toggle */}
                                    <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-slate-400">Stock:</span>
                                            <button
                                                type="button"
                                                onClick={() => handleStockDelta(-1)}
                                                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-400 text-rose-300 flex items-center justify-center cursor-pointer transition-all"
                                                title="Restar 1 de stock"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleStockDelta(1)}
                                                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400 text-emerald-300 flex items-center justify-center cursor-pointer transition-all"
                                                title="Sumar 1 a stock"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => toggleRemateStatus(activeResult)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                                                    activeResult.isRemate
                                                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
                                                        : "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                                                }`}
                                                title={activeResult.isRemate ? "Quitar de Stock de Remate" : "Asignar a Stock de Remate"}
                                            >
                                                <Flame size={13} className={activeResult.isRemate ? "text-rose-400" : "text-amber-400"} />
                                                <span>{activeResult.isRemate ? "🔥 En Remate (Quitar)" : "🔥 Pasar a Remate"}</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (onProductSelected) onProductSelected(activeResult)
                                                    onClose()
                                                }}
                                                className="px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                            >
                                                <span>Cotizar</span>
                                                <ArrowRight size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── SCAN RESULT: NEW CODE (FORM TO REGISTER) ── */}
                            {isNewProductForm && (
                                <form onSubmit={handleSaveNewProduct} className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900 border border-amber-500/40 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={16} className="text-amber-400" />
                                            <span className="text-[11px] font-mono font-black uppercase text-amber-400 tracking-wider">
                                                Nuevo Código Escaneado · Crear Ficha
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-400">
                                            Código: <strong className="text-amber-300">{newProductData.sku}</strong>
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                        {/* FOTO DEL PRODUCTO (CÁMARA / ARCHIVO) */}
                                        <div className="sm:col-span-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-mono uppercase text-slate-300 font-bold flex items-center gap-1.5">
                                                    <ImageIcon size={13} className="text-cyan-400" />
                                                    <span>Foto del Producto</span>
                                                </label>
                                                <span className="text-[10px] font-mono text-slate-500">Captura en vivo o sube archivo</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-16 rounded-xl bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                                    {productImage ? (
                                                        <img src={productImage} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Camera size={22} className="text-slate-600" />
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={capturePhotoFromStream}
                                                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                                                        title="Captura el fotograma actual de la cámara"
                                                    >
                                                        <Camera size={13} />
                                                        <span>📸 Capturar Foto de Cámara</span>
                                                    </button>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleFileUpload}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer"
                                                    >
                                                        <Upload size={13} />
                                                        <span>📁 Subir Foto</span>
                                                    </button>
                                                    {productImage && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setProductImage(null)}
                                                            className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs cursor-pointer hover:bg-rose-500/30"
                                                            title="Eliminar foto"
                                                        >
                                                            <X size={13} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* NOMBRE */}
                                        <div className="sm:col-span-2">
                                            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                                                Nombre del Producto *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={newProductData.name}
                                                onChange={e => setNewProductData(p => ({ ...p, name: e.target.value }))}
                                                placeholder="Ej: Torniquete Trípode TS1000 Pro / Cámara IMOU 360"
                                                className="w-full bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-600 rounded-xl px-3 py-2.5 outline-none focus:border-amber-400"
                                            />
                                        </div>

                                        {/* TOGGLE REMATE */}
                                        <div className="sm:col-span-2 p-3 rounded-2xl bg-gradient-to-r from-rose-950/40 to-amber-950/40 border border-rose-500/40 space-y-2">
                                            <label className="flex items-center justify-between cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <Flame size={16} className="text-rose-400" />
                                                    <div>
                                                        <span className="text-xs font-bold text-white uppercase font-mono block">
                                                            🔥 Asignar a Stock de Remate (% OFF)
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            Aparecerá en la sección de liquidación de la tarjeta /bienvenida
                                                        </span>
                                                    </div>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={isRemateSelected}
                                                    onChange={(e) => setIsRemateSelected(e.target.checked)}
                                                    className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                                                />
                                            </label>

                                            {isRemateSelected && (
                                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-rose-500/20">
                                                    <div>
                                                        <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                                                            Precio Regular Original ($)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={newProductData.compareAtPrice}
                                                            onChange={e => setNewProductData(p => ({ ...p, compareAtPrice: e.target.value }))}
                                                            placeholder="PVP normal..."
                                                            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 line-through rounded-xl px-3 py-1.5 outline-none focus:border-rose-400"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-mono uppercase text-rose-300 block mb-1">
                                                            % Descuento OFF
                                                        </label>
                                                        <div className="h-8 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center font-mono font-bold text-rose-300 text-xs">
                                                            {parseFloat(newProductData.compareAtPrice) > parseFloat(newProductData.price) && parseFloat(newProductData.compareAtPrice) > 0
                                                                ? `-${Math.round(((parseFloat(newProductData.compareAtPrice) - parseFloat(newProductData.price)) / parseFloat(newProductData.compareAtPrice)) * 100)}% OFF`
                                                                : "Define PVP regular"}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* PRECIO PVP / REMATE */}
                                        <div>
                                            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                                                {isRemateSelected ? "Precio de Remate ($USD) *" : "Precio PVP ($USD) *"}
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={newProductData.price}
                                                onChange={e => setNewProductData(p => ({ ...p, price: e.target.value }))}
                                                placeholder="0.00"
                                                className={`w-full bg-slate-950 border text-sm font-mono placeholder:text-slate-600 rounded-xl px-3 py-2 outline-none ${
                                                    isRemateSelected 
                                                        ? "border-rose-500/50 text-amber-300 font-bold focus:border-rose-400" 
                                                        : "border-slate-800 text-emerald-400 focus:border-amber-400"
                                                }`}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                                                Stock Inicial *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={newProductData.stock}
                                                onChange={e => setNewProductData(p => ({ ...p, stock: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-800 text-sm font-mono text-white rounded-xl px-3 py-2 outline-none focus:border-amber-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                                                Categoría
                                            </label>
                                            <input
                                                type="text"
                                                value={newProductData.categoryName}
                                                onChange={e => setNewProductData(p => ({ ...p, categoryName: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-amber-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                                                Proveedor
                                            </label>
                                            <input
                                                type="text"
                                                value={newProductData.provider}
                                                onChange={e => setNewProductData(p => ({ ...p, provider: e.target.value }))}
                                                className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-xl px-3 py-2 outline-none focus:border-amber-400"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                                                Descripción / Especificaciones
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={newProductData.description}
                                                onChange={e => setNewProductData(p => ({ ...p, description: e.target.value }))}
                                                placeholder="Detalles técnicos, garantía o compatibilidad..."
                                                className="w-full bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 rounded-xl px-3 py-2 outline-none focus:border-amber-400"
                                            />
                                        </div>
                                    </div>

                                    {saveMessage && (
                                        <div className="text-xs font-mono font-bold p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                                            {saveMessage}
                                        </div>
                                    )}

                                    <div className="pt-2 flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsNewProductForm(false)}
                                            className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSavingProduct}
                                            className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:scale-105 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                                        >
                                            <Plus size={15} />
                                            <span>{isSavingProduct ? "Guardando..." : "Guardar en Base de Datos"}</span>
                                        </button>
                                    </div>
                                </form>
                            )}

                        </div>
                    )}

                    {/* VIEW TAB 2: SCANNED LIST & INVENTORY VALUATION */}
                    {activeTab === "list" && (
                        <div className="space-y-6">
                            {/* Filter Bar: General vs Stock de Remate */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => setListFilter("all")}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                                        listFilter === "all"
                                            ? "bg-cyan-500 text-black shadow-md"
                                            : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                                    }`}
                                >
                                    Todos ({scannedList.length})
                                </button>
                                <button
                                    onClick={() => setListFilter("general")}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                        listFilter === "general"
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                                    }`}
                                >
                                    <span>📦 Lista General</span>
                                    <span>({scannedList.filter(p => !p.isRemate).length})</span>
                                </button>
                                <button
                                    onClick={() => setListFilter("remate")}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                        listFilter === "remate"
                                            ? "bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md shadow-rose-500/20"
                                            : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                                    }`}
                                >
                                    <Flame size={12} className="text-yellow-400" />
                                    <span>🔥 Stock de Remate</span>
                                    <span>({scannedList.filter(p => p.isRemate).length})</span>
                                </button>
                            </div>

                            {/* Stats bar */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Artículos Mostrados</span>
                                    <span className="text-2xl font-black text-white">
                                        {scannedList.filter(p => listFilter === "all" ? true : listFilter === "remate" ? p.isRemate : !p.isRemate).length}
                                    </span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Unidades Físicas</span>
                                    <span className="text-2xl font-black text-cyan-400">
                                        {scannedList.filter(p => listFilter === "all" ? true : listFilter === "remate" ? p.isRemate : !p.isRemate).reduce((acc, p) => acc + (p.stock || 1), 0)}
                                    </span>
                                </div>
                                <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Valoración Total</span>
                                    <span className="text-2xl font-black text-emerald-400">
                                        ${scannedList
                                            .filter(p => listFilter === "all" ? true : listFilter === "remate" ? p.isRemate : !p.isRemate)
                                            .reduce((acc, p) => acc + (p.price * (p.stock || 1)), 0)
                                            .toFixed(2)} USD
                                    </span>
                                </div>
                            </div>

                            {/* Export / Clear buttons */}
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                                    Gestión de Inventario Escaneado
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={exportHistoryCSV}
                                        disabled={scannedList.length === 0}
                                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                                    >
                                        <Download size={13} />
                                        <span>Exportar CSV</span>
                                    </button>
                                    <button
                                        onClick={() => setScannedList([])}
                                        disabled={scannedList.length === 0}
                                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                                    >
                                        <Trash2 size={13} />
                                        <span>Limpiar</span>
                                    </button>
                                </div>
                            </div>

                            {/* Table of items */}
                            {scannedList.length === 0 ? (
                                <div className="text-center py-16 text-slate-500 font-mono text-xs">
                                    No hay productos escaneados todavía en esta sesión.
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-slate-800 overflow-hidden">
                                    <table className="w-full text-left text-xs font-mono">
                                        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                                            <tr>
                                                <th className="px-3 py-3">Foto / SKU</th>
                                                <th className="px-3 py-3">Producto</th>
                                                <th className="px-3 py-3">Lista</th>
                                                <th className="px-3 py-3 text-right">Precio</th>
                                                <th className="px-3 py-3 text-center">Stock</th>
                                                <th className="px-3 py-3 text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                                            {scannedList
                                                .filter(p => listFilter === "all" ? true : listFilter === "remate" ? p.isRemate : !p.isRemate)
                                                .map((item, idx) => {
                                                    const mainImg = item.images?.[0]
                                                    return (
                                                        <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                                            <td className="px-3 py-3">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                                                                        {mainImg ? (
                                                                            <img src={mainImg} alt={item.name} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <Box size={14} className="text-slate-600" />
                                                                        )}
                                                                    </div>
                                                                    <span className="font-bold text-cyan-300 text-[11px]">{item.sku}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <div className="text-white font-sans font-medium line-clamp-1">{item.name}</div>
                                                                <div className="text-[10px] text-slate-500">{item.category}</div>
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                {item.isRemate ? (
                                                                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold flex items-center gap-1 w-max">
                                                                        <Flame size={10} />
                                                                        <span>Stock Remate</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-bold w-max block">
                                                                        General
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-3 text-right">
                                                                <div className="font-bold text-emerald-400">${item.price.toFixed(2)}</div>
                                                                {item.compareAtPrice && item.compareAtPrice > item.price && (
                                                                    <div className="text-[10px] text-slate-500 line-through">
                                                                        ${item.compareAtPrice.toFixed(2)}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-3 text-center font-bold">{item.stock}</td>
                                                            <td className="px-3 py-3 text-right">
                                                                <button
                                                                    onClick={() => toggleRemateStatus(item)}
                                                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                                                                        item.isRemate 
                                                                            ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700" 
                                                                            : "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40"
                                                                    }`}
                                                                    title={item.isRemate ? "Mover a Inventario General" : "Mover a Stock de Remate"}
                                                                >
                                                                    {item.isRemate ? "Mover a General" : "🔥 A Remate"}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                </div>

            </div>
        </div>
    )
}
