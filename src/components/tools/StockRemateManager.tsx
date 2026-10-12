"use client"

import React, { useState, useEffect, useRef } from "react"
import { 
    Flame, Tag, Search, Plus, Trash2, Edit3, ArrowRight, 
    Camera, Upload, Image as ImageIcon, Check, RefreshCw, 
    AlertCircle, ExternalLink, MessageCircle, Barcode, Scan,
    Sparkles, DollarSign, Package, Percent, Layers, X, ShieldAlert
} from "lucide-react"
import BarcodeScannerModal, { ScannedProductItem } from "@/components/scanner/BarcodeScannerModal"

export interface RemateProductItem {
    id: string
    sku: string
    name: string
    description?: string
    price: number
    compareAtPrice: number
    discountPercent: number
    stock: number
    category: string
    provider?: string
    images: string[]
    keywords?: string
    isRemate?: boolean
    updatedAt?: string
}

interface StockRemateManagerProps {
    onClose?: () => void
}

export default function StockRemateManager({ onClose }: StockRemateManagerProps) {
    const [products, setProducts] = useState<RemateProductItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [isScannerOpen, setIsScannerOpen] = useState(false)
    const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

    // Form state for creating / editing clearance product
    const [formData, setFormData] = useState({
        id: "",
        sku: "",
        name: "",
        description: "Liquidación por últimas unidades disponibles en bodega. Garantía oficial ATOMIC.",
        regularPrice: "",
        rematePrice: "",
        stock: "3",
        categoryName: "Seguridad Electrónica",
        provider: "ATOMIC",
        imageUrl: "",
        reason: "Últimas Unidades"
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Camera capture state inside the modal
    const [isWebcamActive, setIsWebcamActive] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    // Fetch products from /api/stock-remate
    const fetchRemateProducts = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/stock-remate")
            const data = await res.json()
            if (data.success && Array.isArray(data.products)) {
                setProducts(data.products)
            }
        } catch (err) {
            console.error("Error loading clearance stock:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRemateProducts()
    }, [])

    // Handle Image file upload (Device -> Base64)
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64String = reader.result as string
                setImagePreview(base64String)
                setFormData(prev => ({ ...prev, imageUrl: base64String }))
            }
            reader.readAsDataURL(file)
        }
    }

    // Start Webcam Snapshot
    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "environment" }
            })
            streamRef.current = stream
            setIsWebcamActive(true)
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    videoRef.current.play()
                }
            }, 100)
        } catch (e) {
            alert("No se pudo acceder a la cámara para tomar la foto.")
            setIsWebcamActive(false)
        }
    }

    // Capture Webcam Snapshot to Base64
    const capturePhoto = () => {
        if (!videoRef.current) return
        const canvas = document.createElement("canvas")
        canvas.width = videoRef.current.videoWidth || 640
        canvas.height = videoRef.current.videoHeight || 480
        const ctx = canvas.getContext("2d")
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
            const photoUrl = canvas.toDataURL("image/jpeg", 0.85)
            setImagePreview(photoUrl)
            setFormData(prev => ({ ...prev, imageUrl: photoUrl }))
            stopWebcam()
        }
    }

    const stopWebcam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
        setIsWebcamActive(false)
    }

    // Open Form for Brand New Remate or from Barcode
    const openNewForm = (item?: Partial<RemateProductItem>) => {
        if (item) {
            const regPrice = item.compareAtPrice ? String(item.compareAtPrice) : (item.price ? String((item.price * 1.4).toFixed(2)) : "")
            setFormData({
                id: item.id || "",
                sku: item.sku || `REM-${Date.now().toString().slice(-5)}`,
                name: item.name || "",
                description: item.description || "Liquidación por últimas unidades disponibles en bodega.",
                regularPrice: regPrice,
                rematePrice: item.price ? String(item.price) : "",
                stock: item.stock ? String(item.stock) : "2",
                categoryName: item.category || "Seguridad Electrónica",
                provider: item.provider || "ATOMIC",
                imageUrl: item.images?.[0] || "",
                reason: "Últimas Unidades"
            })
            setImagePreview(item.images?.[0] || null)
        } else {
            setFormData({
                id: "",
                sku: `REM-${Date.now().toString().slice(-6)}`,
                name: "",
                description: "Liquidación por renovación de inventario. Precio irrepetible hasta agotar existencias.",
                regularPrice: "",
                rematePrice: "",
                stock: "3",
                categoryName: "Seguridad Electrónica",
                provider: "ATOMIC",
                imageUrl: "",
                reason: "Últimas Unidades"
            })
            setImagePreview(null)
        }
        setShowAddModal(true)
    }

    // Submit New or Updated Remate Item
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim() || !formData.rematePrice) {
            setStatusMessage({ text: "El nombre y el precio de remate son obligatorios", type: "error" })
            return
        }

        setIsSubmitting(true)
        setStatusMessage(null)

        try {
            const res = await fetch("/api/stock-remate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: formData.id || undefined,
                    sku: formData.sku,
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.rematePrice),
                    compareAtPrice: formData.regularPrice ? parseFloat(formData.regularPrice) : parseFloat(formData.rematePrice) * 1.5,
                    stock: parseInt(formData.stock) || 1,
                    categoryName: formData.categoryName,
                    provider: formData.provider,
                    images: formData.imageUrl ? [formData.imageUrl] : []
                })
            })

            const data = await res.json()
            if (data.success) {
                setStatusMessage({ text: "¡Producto añadido a Stock de Remate con éxito!", type: "success" })
                setShowAddModal(false)
                fetchRemateProducts()
            } else {
                setStatusMessage({ text: data.error || "Error al guardar producto", type: "error" })
            }
        } catch (err: any) {
            setStatusMessage({ text: "Error de red al guardar en Stock de Remate", type: "error" })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Adjust Stock Delta (+1 / -1)
    const handleAdjustStock = async (id: string, delta: number) => {
        try {
            const res = await fetch("/api/stock-remate", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, stockDelta: delta })
            })
            if (res.ok) {
                setProducts(prev => prev.map(p => {
                    if (p.id === id) {
                        return { ...p, stock: Math.max(0, p.stock + delta) }
                    }
                    return p
                }))
            }
        } catch (e) {
            console.error(e)
        }
    }

    // Remove from Clearance
    const handleRemoveFromRemate = async (id: string, name: string) => {
        if (!confirm(`¿Deseas retirar "${name}" de Stock de Remate? Dejará de aparecer en la página de liquidación.`)) return

        try {
            const res = await fetch(`/api/stock-remate?id=${id}`, {
                method: "DELETE"
            })
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id))
                setStatusMessage({ text: `"${name}" retirado de Stock de Remate.`, type: "success" })
            }
        } catch (e) {
            console.error(e)
        }
    }

    // Handler when barcode scanner detects or selects a product
    const handleScannerProductSelected = (scanned: ScannedProductItem) => {
        setIsScannerOpen(false)
        openNewForm({
            id: scanned.id,
            sku: scanned.sku,
            name: scanned.name,
            price: scanned.price ? Number((scanned.price * 0.7).toFixed(2)) : 0, // Suggest 30% off initial
            compareAtPrice: scanned.price,
            stock: scanned.stock || 2,
            category: scanned.category,
            provider: scanned.provider || "ATOMIC",
            images: scanned.images || []
        })
    }

    // Computed KPIs
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0)
    const avgDiscount = products.length > 0 
        ? Math.round(products.reduce((acc, curr) => acc + curr.discountPercent, 0) / products.length)
        : 0
    const totalLiquidationValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0)

    // Calculate real-time discount for the form
    const formReg = parseFloat(formData.regularPrice) || 0
    const formRem = parseFloat(formData.rematePrice) || 0
    const calculatedFormDiscount = formReg > formRem && formReg > 0 ? Math.round(((formReg - formRem) / formReg) * 100) : 0

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-in fade-in duration-200">
            {/* ── HEADER BANNER ── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border-2 border-rose-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(244,63,94,0.25)]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                                <Flame size={14} className="text-rose-400 animate-pulse" />
                                Módulo Exclusivo de Liquidación
                            </span>
                            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                                Conectado a Página /bienvenida & Códigos de Barras
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                            <span>Stock de Remate · % OFF</span>
                            <span className="text-rose-400 font-mono text-xl sm:text-2xl font-black">
                                [LIQUIDACIÓN]
                            </span>
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-mono">
                            Gestiona productos en remate con fotos reales, PVP tachado y cálculo automático de % OFF. 
                            Solo los artículos registrados aquí se sincronizan con la vitrina pública de liquidación de ATOMIC.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="px-4 py-3 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border-2 border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.2)] active:scale-95"
                            title="Escanear código de barras y pasar a Remate"
                        >
                            <Scan size={16} />
                            <span>Escanear a Remate</span>
                        </button>

                        <button
                            onClick={() => openNewForm()}
                            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-500/30 active:scale-95"
                        >
                            <Plus size={16} />
                            <span>+ Nuevo Producto en Remate</span>
                        </button>

                        <a
                            href="/bienvenida"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-2 transition-colors cursor-pointer"
                            title="Ver en vivo la vitrina en la Tarjeta de Presentación (/bienvenida)"
                        >
                            <ExternalLink size={16} />
                            <span className="hidden sm:inline font-mono">Ver en /bienvenida</span>
                        </a>
                    </div>
                </div>

                {/* Status message alert */}
                {statusMessage && (
                    <div className={`mt-4 p-3 rounded-2xl text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200 ${
                        statusMessage.type === "success" 
                            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300" 
                            : "bg-rose-500/20 border border-rose-500/40 text-rose-300"
                    }`}>
                        {statusMessage.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                        <span>{statusMessage.text}</span>
                    </div>
                )}
            </div>

            {/* ── METRICS SUMMARY CARDS ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                        <span>Items en Remate</span>
                        <Tag size={15} className="text-rose-400" />
                    </div>
                    <div className="text-2xl font-black text-white">{products.length}</div>
                    <p className="text-[10px] text-rose-400 font-mono">Vitrina activa 2026</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                        <span>Unidades Físicas</span>
                        <Package size={15} className="text-amber-400" />
                    </div>
                    <div className="text-2xl font-black text-amber-300">{totalStock}</div>
                    <p className="text-[10px] text-amber-400 font-mono">Stock de liquidación</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                        <span>Descuento Promedio</span>
                        <Percent size={15} className="text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black text-emerald-400">-{avgDiscount}% OFF</div>
                    <p className="text-[10px] text-emerald-300 font-mono">Ahorro clientes</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                        <span>Valoración Remate</span>
                        <DollarSign size={15} className="text-cyan-400" />
                    </div>
                    <div className="text-2xl font-black text-cyan-300">${totalLiquidationValue.toFixed(2)}</div>
                    <p className="text-[10px] text-cyan-400 font-mono">Recuperación de capital</p>
                </div>
            </div>

            {/* ── TOOLBAR: SEARCH & REFRESH ── */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[240px]">
                    <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por nombre, código de barras o categoría de remate..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchRemateProducts}
                        disabled={isLoading}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Recargar inventario de remate"
                    >
                        <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
                        <span>Actualizar</span>
                    </button>
                    <span className="text-[11px] font-mono text-slate-400">
                        {filteredProducts.length} productos mostrados
                    </span>
                </div>
            </div>

            {/* ── PRODUCT GRID (STOCK DE REMATE) ── */}
            {isLoading ? (
                <div className="p-12 text-center space-y-3">
                    <RefreshCw size={24} className="animate-spin text-rose-500 mx-auto" />
                    <p className="text-xs text-slate-400 font-mono">Cargando inventario de Stock de Remate...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="p-12 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-4">
                    <Flame size={36} className="text-slate-600 mx-auto" />
                    <div>
                        <h3 className="text-base font-bold text-white">No hay productos en Stock de Remate coincidentes</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                            Añade artículos con precio de liquidación, sube su foto real o usa el escáner de códigos de barras para asignarlos aquí.
                        </p>
                    </div>
                    <button
                        onClick={() => openNewForm()}
                        className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-black text-xs font-bold transition cursor-pointer"
                    >
                        + Añadir Primer Producto a Remate
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredProducts.map(item => {
                        const hasDiscount = item.discountPercent > 0
                        const mainImage = item.images?.[0] || "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"
                        const isLowStock = item.stock <= 2

                        return (
                            <div 
                                key={item.id} 
                                className="group relative rounded-3xl bg-[#090e1f] border-2 border-slate-800 hover:border-rose-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]"
                            >
                                {/* Image & Badges Container */}
                                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                                    <img 
                                        src={mainImage} 
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#090e1f] via-transparent to-transparent opacity-80" />

                                    {/* % OFF Ribbon */}
                                    {hasDiscount && (
                                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black text-xs font-mono shadow-lg flex items-center gap-1 border border-white/20">
                                            <Flame size={13} className="text-yellow-300" />
                                            <span>-{item.discountPercent}% OFF</span>
                                        </div>
                                    )}

                                    {/* Stock Remaining Badge */}
                                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border backdrop-blur-md ${
                                        isLowStock 
                                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40" 
                                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                    }`}>
                                        {item.stock} {item.stock === 1 ? "unidad" : "unidades"}
                                    </div>

                                    {/* Category pill */}
                                    <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-slate-300 text-[10px] font-mono">
                                        {item.category}
                                    </div>
                                </div>

                                {/* Body Info */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Barcode size={13} className="text-cyan-400" />
                                                <span>{item.sku}</span>
                                            </span>
                                            <span className="text-rose-400 font-bold">Liquidación</span>
                                        </div>

                                        <h3 className="text-xs font-extrabold text-white line-clamp-2 leading-snug group-hover:text-rose-300 transition-colors">
                                            {item.name}
                                        </h3>

                                        {item.description && (
                                            <p className="text-[10px] text-slate-400 font-mono line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Pricing Block */}
                                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-[10px] text-slate-500 uppercase font-mono">PVP Normal:</span>
                                            <span className="text-xs font-mono text-slate-400 line-through">
                                                ${item.compareAtPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline justify-between">
                                            <span className="text-[10px] text-rose-400 font-bold uppercase font-mono flex items-center gap-1">
                                                <Flame size={12} />
                                                Remate:
                                            </span>
                                            <span className="text-base font-black font-mono text-amber-400">
                                                ${item.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions Toolbar */}
                                    <div className="space-y-2 pt-1">
                                        {/* Quick Stock Controls */}
                                        <div className="flex items-center justify-between bg-slate-900 rounded-xl px-2 py-1 border border-slate-800">
                                            <span className="text-[10px] text-slate-400 font-mono">Stock físico:</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleAdjustStock(item.id, -1)}
                                                    className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center justify-center cursor-pointer"
                                                    title="Disminuir 1 unidad"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xs font-mono font-bold text-white w-6 text-center">
                                                    {item.stock}
                                                </span>
                                                <button
                                                    onClick={() => handleAdjustStock(item.id, 1)}
                                                    className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center justify-center cursor-pointer"
                                                    title="Aumentar 1 unidad"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Edit & Remove Buttons */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openNewForm(item)}
                                                className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                            >
                                                <Edit3 size={12} />
                                                <span>Editar</span>
                                            </button>
                                            <button
                                                onClick={() => handleRemoveFromRemate(item.id, item.name)}
                                                className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
                                                title="Quitar de Stock de Remate"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ── MODAL: AÑADIR / EDITAR PRODUCTO EN REMATE ── */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
                    <div className="relative w-full max-w-2xl bg-[#070b18] border-2 border-rose-500/40 rounded-3xl shadow-[0_0_60px_rgba(244,63,94,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
                        
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-rose-500/20 bg-slate-950/90 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-lg">
                                    <Flame size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                                        <span>{formData.id ? "Editar Producto en Remate" : "Nuevo Producto en Stock de Remate"}</span>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                            % OFF
                                        </span>
                                    </h3>
                                    <p className="text-[11px] font-mono text-slate-400">
                                        Se sincroniza directamente con la vitrina de liquidación de ATOMIC
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    stopWebcam()
                                    setShowAddModal(false)
                                }}
                                className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1">
                            
                            {/* PHOTO UPLOAD & PREVIEW SECTION */}
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                        <ImageIcon size={14} className="text-rose-400" />
                                        <span>Foto del Producto (Obligatoria para la vitrina)</span>
                                    </label>
                                    <span className="text-[10px] text-slate-400 font-mono">Dispositivo / Cámara / Web</span>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-center">
                                    {/* Preview Box */}
                                    <div className="relative w-36 h-36 rounded-2xl bg-slate-950 border-2 border-dashed border-rose-500/30 overflow-hidden shrink-0 flex items-center justify-center">
                                        {imagePreview ? (
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <div className="text-center p-2 text-slate-500 space-y-1">
                                                <Camera size={24} className="mx-auto" />
                                                <span className="text-[10px] block">Sin Foto</span>
                                            </div>
                                        )}
                                        {imagePreview && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null)
                                                    setFormData(prev => ({ ...prev, imageUrl: "" }))
                                                }}
                                                className="absolute top-1 right-1 p-1 rounded-lg bg-black/70 text-rose-400 hover:text-white cursor-pointer"
                                                title="Quitar foto"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Upload / Webcam Controls */}
                                    <div className="space-y-2 flex-1 w-full">
                                        <div className="flex flex-wrap gap-2">
                                            {/* File Picker from device */}
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
                                                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
                                            >
                                                <Upload size={13} />
                                                <span>Subir desde Archivo</span>
                                            </button>

                                            {/* Webcam photo */}
                                            <button
                                                type="button"
                                                onClick={isWebcamActive ? capturePhoto : startWebcam}
                                                className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer border border-rose-500/40"
                                            >
                                                <Camera size={13} />
                                                <span>{isWebcamActive ? "📸 Capturar Ahora" : "Tomar con Cámara"}</span>
                                            </button>

                                            {isWebcamActive && (
                                                <button
                                                    type="button"
                                                    onClick={stopWebcam}
                                                    className="px-2.5 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
                                                >
                                                    Cancelar
                                                </button>
                                            )}
                                        </div>

                                        {/* Camera active live video */}
                                        {isWebcamActive && (
                                            <div className="relative rounded-xl overflow-hidden border border-rose-500/50 bg-black mt-2">
                                                <video ref={videoRef} autoPlay playsInline className="w-full h-44 object-cover" />
                                                <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={capturePhoto}
                                                        className="px-4 py-1.5 rounded-full bg-rose-500 text-black font-black text-xs shadow-lg cursor-pointer flex items-center gap-1.5"
                                                    >
                                                        <Camera size={13} />
                                                        <span>Tomar Foto</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Or Image URL Input */}
                                        <div className="pt-1">
                                            <input
                                                type="url"
                                                value={formData.imageUrl}
                                                onChange={(e) => {
                                                    setFormData(prev => ({ ...prev, imageUrl: e.target.value }))
                                                    setImagePreview(e.target.value)
                                                }}
                                                placeholder="O pega URL de imagen (https://...)..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SKU / Code & Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                                        Código de Barras / SKU *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.sku}
                                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                                        placeholder="Ej. AT-REM-001"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-rose-400"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                                        Nombre del Producto *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Ej. Cerradura Digital Tuya WiFi Pro (Últimas Unidades)"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                                    />
                                </div>
                            </div>

                            {/* PRICES & DISCOUNT CALCULATOR */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                                        Precio Regular ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.regularPrice}
                                        onChange={(e) => setFormData(prev => ({ ...prev, regularPrice: e.target.value }))}
                                        placeholder="Ej. 120.00"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 line-through focus:outline-none focus:border-rose-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-rose-400 uppercase font-mono mb-1 flex items-center gap-1">
                                        <Flame size={12} />
                                        Precio Remate ($) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.rematePrice}
                                        onChange={(e) => setFormData(prev => ({ ...prev, rematePrice: e.target.value }))}
                                        placeholder="Ej. 65.00"
                                        className="w-full bg-slate-950 border border-rose-500/50 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-rose-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-emerald-400 uppercase font-mono mb-1">
                                        Descuento Calculado
                                    </label>
                                    <div className="h-9 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-mono font-black text-emerald-300 text-xs">
                                        {calculatedFormDiscount > 0 ? `-${calculatedFormDiscount}% OFF` : "Sin descuento"}
                                    </div>
                                </div>
                            </div>

                            {/* STOCK & CATEGORY */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                                        Unidades en Remate *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-rose-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                                        Categoría
                                    </label>
                                    <select
                                        value={formData.categoryName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, categoryName: e.target.value }))}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                                    >
                                        <option value="Cerraduras Inteligentes">Cerraduras Inteligentes</option>
                                        <option value="Cámaras de Seguridad & CCTV">Cámaras de Seguridad & CCTV</option>
                                        <option value="Alarmas & Sensores">Alarmas & Sensores</option>
                                        <option value="Intercomunicadores & Videoporteros">Intercomunicadores</option>
                                        <option value="Control de Acceso & Biométricos">Control de Acceso</option>
                                        <option value="Energía & Respaldo Eléctrico">Energía & Respaldo</option>
                                        <option value="Redes, Fibra & Conectividad">Redes & Conectividad</option>
                                        <option value="Automatización & Domótica IoT">Domótica IoT</option>
                                        <option value="Audio & Periféricos">Audio & Periféricos</option>
                                        <option value="Liquidación General">Liquidación General</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                                        Motivo de Remate
                                    </label>
                                    <select
                                        value={formData.reason}
                                        onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                                    >
                                        <option value="Últimas Unidades">Últimas Unidades</option>
                                        <option value="Liquidación Anual">Liquidación Anual</option>
                                        <option value="Equipo de Exhibición">Equipo de Exhibición</option>
                                        <option value="Renovación de Lote">Renovación de Lote</option>
                                        <option value="Caja Abierta / Demo">Caja Abierta / Demo</option>
                                    </select>
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase font-mono mb-1">
                                    Detalle / Condición del Producto
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe la condición, accesorios incluidos y garantía..."
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-400"
                                />
                            </div>

                            {/* Submit & Cancel Buttons */}
                            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => {
                                        stopWebcam()
                                        setShowAddModal(false)
                                    }}
                                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    <Check size={14} />
                                    <span>{isSubmitting ? "Guardando..." : "Publicar en Stock de Remate"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── BARCODE SCANNER MODAL INTEGRATION ── */}
            <BarcodeScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onProductSelected={handleScannerProductSelected}
            />
        </div>
    )
}
