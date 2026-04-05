"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Folder, FileText, ChevronRight, Upload, FolderPlus, 
    ArrowLeft, Database, MoreVertical, Trash2, Search,
    Filter, LayoutGrid, List, HardDrive, ShieldCheck
} from "lucide-react"

type FolderType = { id: string; name: string; parentId: string | null }
type FileType = { id: string; name: string; url: string; size: number; createdAt: string; uploader: { name: string } }

export default function StoragePage() {
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
    const [folders, setFolders] = useState<FolderType[]>([])
    const [files, setFiles] = useState<FileType[]>([])
    const [currentFolder, setCurrentFolder] = useState<FolderType | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Modals
    const [showNewFolder, setShowNewFolder] = useState(false)
    const [newFolderName, setNewFolderName] = useState("")
    const [showUpload, setShowUpload] = useState(false)
    const [uploadData, setUploadData] = useState({ name: "", url: "", size: 0 })

    const fetchContents = async (parentId: string | null) => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/storage${parentId ? `?parentId=${parentId}` : ''}`)
            if (res.ok) {
                const data = await res.json()
                setFolders(data.folders)
                setFiles(data.files)
                setCurrentFolder(data.currentFolder)
                setCurrentFolderId(parentId)
            }
        } catch (error) {
            console.error("Failed to fetch storage", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchContents(null)
    }, [])

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return
        try {
            const res = await fetch("/api/storage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "folder", name: newFolderName, folderId: currentFolderId })
            })
            if (res.ok) {
                setNewFolderName("")
                setShowNewFolder(false)
                fetchContents(currentFolderId)
            }
        } catch (error) {
            console.error("Failed to create folder", error)
        }
    }

    const handleUploadFile = async () => {
        if (!uploadData.name.trim() || !uploadData.url.trim()) return
        try {
            const res = await fetch("/api/storage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "file", folderId: currentFolderId, ...uploadData })
            })
            if (res.ok) {
                setUploadData({ name: "", url: "", size: 0 })
                setShowUpload(false)
                fetchContents(currentFolderId)
            }
        } catch (error) {
            console.error("Failed to fake upload file", error)
        }
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B"
        const k = 1024
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[15%] right-[-10%] w-[35%] h-[35%] rounded-full bg-azure-500/5 blur-[120px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] rounded-full bg-tomato-500/5 blur-[100px]" />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-16 relative z-10">
                <div>
                     <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <HardDrive size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em]">ESTRUCTURA DE DATOS</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                        BANCO DE <span className="text-secondary underline decoration-secondary/30 underline-offset-8">ALMACENAMIENTO</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Protocolo centralizado para la gestión y auditoría de activos digitales corporativos.
                    </p>
                </div>
                <div className="flex flex-wrap gap-6">
                    <button 
                        onClick={() => setShowNewFolder(true)} 
                        className="p-6 glass-panel text-slate-500 hover:text-white transition-all rounded-2xl border-white/5 group flex items-center gap-4 bg-slate-900/40"
                    >
                        <FolderPlus size={24} className="group-hover:rotate-12 transition-transform duration-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Sistema de Directorio</span>
                    </button>
                    <button 
                        onClick={() => setShowUpload(true)} 
                        className="bg-secondary text-white px-12 py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] transition-all hover:bg-white hover:text-secondary rounded-2xl active:scale-95 group italic skew-x-[-12deg]"
                    >
                        <div className="flex items-center gap-6 skew-x-[12deg]">
                            <Upload size={24} className="group-hover:translate-y-[-2px] transition-transform" />
                            <span>Inyectar Activo</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="glass-panel !bg-slate-950/60 p-6 flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] shadow-inner relative z-10 rounded-[2rem] border-white/5 backdrop-blur-3xl italic">
                <button
                    onClick={() => fetchContents(null)}
                    className={`flex items-center space-x-3 px-6 py-2.5 rounded-xl transition-all ${!currentFolderId ? 'bg-secondary text-white shadow-2xl' : 'text-slate-600 hover:text-white'}`}
                >
                    <Database size={16} />
                    <span>NODO_RAÍZ</span>
                </button>
                {currentFolder && (
                    <>
                        <ChevronRight size={14} className="text-slate-800" />
                        {currentFolder.parentId && (
                            <>
                                <button className="text-slate-600 hover:text-secondary transition-colors" onClick={() => fetchContents(currentFolder.parentId)}>...</button>
                                <ChevronRight size={14} className="text-slate-800" />
                            </>
                        )}
                        <span className="text-azure-400 bg-azure-500/10 px-6 py-2.5 rounded-xl border border-azure-500/20 flex items-center space-x-3 shadow-2xl">
                            <Folder size={14} className="fill-azure-400/20" />
                            <span>{currentFolder.name}</span>
                        </span>
                    </>
                )}
                
                {/* Visual Storage Meter */}
                <div className="ms-auto hidden lg:flex items-center gap-8 py-2 px-10 border-s border-white/10">
                    <div className="text-right">
                        <p className="text-[8px] text-slate-700">SATURACIÓN DE NODO</p>
                        <p className="text-white">45.2 GB / 100 GB</p>
                    </div>
                    <div className="w-40 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner p-[1px]">
                         <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 1.5 }} className="h-full bg-azure-500 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="glass-panel border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] min-h-[500px] relative z-10 rounded-[3.5rem] backdrop-blur-3xl overflow-hidden">
                <div className="p-10 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                    <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em] italic">Estructura Interna del Nodo</h2>
                    <div className="flex items-center gap-6">
                        <button className="text-slate-700 hover:text-secondary transition-colors"><List size={20} /></button>
                        <button className="text-slate-700 hover:text-secondary transition-colors"><LayoutGrid size={20} /></button>
                        <div className="h-6 w-[1px] bg-white/5 mx-2" />
                        <button className="text-slate-700 hover:text-secondary transition-colors"><Filter size={20} /></button>
                    </div>
                </div>

                <div className="p-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-80 space-y-6">
                            <div className="w-12 h-12 border-4 border-white/5 border-t-azure-500 rounded-full animate-spin shadow-2xl"></div>
                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] italic">Auditoría de Directorio en Progreso...</p>
                        </div>
                    ) : folders.length === 0 && files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-80 text-slate-800">
                            <div className="p-10 bg-slate-900 rounded-full mb-8 border border-white/5 shadow-inner">
                                <Folder size={64} className="text-slate-900" />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.6em] italic">Nodo Desierto: Sin registros detectados</p>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] mt-3 opacity-30">Protocolo Cero Activo</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 p-6">
                            {folders.map(folder => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={folder.id}
                                    onClick={() => fetchContents(folder.id)}
                                    className="flex items-center justify-between p-8 glass-panel !bg-slate-900/40 border-white/5 hover:!bg-white/[0.04] hover:border-secondary/40 cursor-pointer group transition-all rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 w-1.5 h-full bg-slate-950 group-hover:bg-secondary transition-colors" />
                                    <div className="flex items-center space-x-10">
                                        <div className="p-5 bg-slate-950 text-slate-700 group-hover:text-secondary group-hover:rotate-6 transition-all rounded-2xl shadow-inner border border-white/5">
                                            <Folder size={28} className="fill-current opacity-5 group-hover:opacity-20 transition-opacity" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tighter italic group-hover:translate-x-2 transition-transform">{folder.name}</h3>
                                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] mt-2 italic group-hover:translate-x-2 transition-transform delay-75">Contenedor de Activos</p>
                                        </div>
                                    </div>
                                    <div className="text-slate-800 group-hover:text-secondary group-hover:translate-x-3 transition-all duration-500">
                                        <ChevronRight size={24} />
                                    </div>
                                </motion.div>
                            ))}
                            {files.map(file => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={file.id} 
                                    className="flex items-center justify-between p-8 glass-panel !bg-slate-950/40 border-white/5 hover:!bg-white/[0.04] hover:border-azure-500/40 group transition-all rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 w-1.5 h-full bg-slate-950 group-hover:bg-azure-500 transition-colors" />
                                    <div className="flex items-center space-x-10">
                                        <div className="p-5 bg-slate-950 text-slate-700 group-hover:text-azure-400 group-hover:scale-105 transition-all rounded-2xl shadow-inner border border-white/5">
                                            <FileText size={28} />
                                        </div>
                                        <div>
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-lg font-black text-white hover:text-azure-400 transition-all uppercase tracking-tighter italic block group-hover:translate-x-2">
                                                {file.name}
                                            </a>
                                            <div className="flex items-center space-x-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mt-3 italic group-hover:translate-x-2 transition-transform delay-75">
                                                <span className="text-azure-500/60">{formatSize(file.size)}</span>
                                                <span className="text-slate-800">•</span>
                                                <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                                                <span className="text-slate-800">•</span>
                                                <span className="bg-white/5 px-3 py-1 rounded text-slate-500">AUTOR: {file.uploader.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0">
                                        <button className="p-4 glass-panel !bg-slate-900 text-slate-600 hover:text-azure-400 transition-all rounded-2xl border-white/5 shadow-2xl">
                                            <MoreVertical size={20} />
                                        </button>
                                        <button className="p-4 glass-panel !bg-slate-900 text-slate-600 hover:text-red-500 transition-all rounded-2xl border-white/5 shadow-2xl">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: New Folder */}
            <AnimatePresence>
                {showNewFolder && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" 
                            onClick={() => setShowNewFolder(false)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="glass-panel !bg-slate-950/60 w-full max-w-xl shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/10 overflow-hidden rounded-[4rem] relative z-10 backdrop-blur-3xl p-14 border"
                        >
                            <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-10">
                                CREAR <span className="text-secondary">NODO</span>
                            </h3>
                            <div className="space-y-4 mb-12">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] ml-2 italic">Identificador del Directorio</label>
                                <input
                                    type="text"
                                    placeholder="NOMBRE DE LA CARPETA..."
                                    value={newFolderName}
                                    onChange={e => setNewFolderName(e.target.value.toUpperCase())}
                                    onKeyDown={e => e.key === "Enter" && handleCreateFolder()}
                                    autoFocus
                                    className="w-full bg-slate-950/60 border border-white/5 p-6 rounded-[2rem] text-[12px] font-black uppercase tracking-widest text-white focus:border-secondary transition-all outline-none shadow-inner"
                                />
                            </div>
                            <div className="flex gap-8">
                                <button onClick={() => setShowNewFolder(false)} className="flex-1 py-6 text-[10px] font-black uppercase tracking-[0.4em] border border-white/5 text-slate-600 hover:text-white transition-all rounded-2xl italic">CERRAR</button>
                                <button onClick={handleCreateFolder} className="flex-1 py-6 text-[10px] font-black uppercase tracking-[0.4em] bg-secondary text-white shadow-[0_15px_40px_-5px_rgba(255,99,71,0.5)] rounded-2xl italic skew-x-[-12deg] group">
                                    <div className="skew-x-[12deg] flex items-center justify-center gap-4">
                                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                                        <span>CONFIRMAR</span>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal: Upload File (Simulated) */}
            <AnimatePresence>
                {showUpload && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" 
                            onClick={() => setShowUpload(false)} 
                        />
                        <motion.div 
                             initial={{ opacity: 0, scale: 0.9, y: 30 }}
                             animate={{ opacity: 1, scale: 1, y: 0 }}
                             exit={{ opacity: 0, scale: 0.9, y: 30 }}
                             className="glass-panel !bg-slate-950/60 w-full max-w-2xl shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/10 overflow-hidden rounded-[4rem] relative z-10 backdrop-blur-3xl p-14 border"
                        >
                            <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-4">
                                INYECTAR <span className="text-secondary">ACTIVO</span>
                            </h3>
                            <p className="text-[10px] text-slate-500 mb-12 uppercase tracking-[0.4em] italic font-bold">El soporte para carga directa S3 está en sintonía. Ingrese URL referencial del nodo.</p>
                            <div className="space-y-8 mb-12">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Nombre del Activo (Ej. Manual_V1.pdf)</label>
                                    <input
                                        type="text" placeholder="IDENTIFICADOR DEL ARCHIVO..."
                                        value={uploadData.name} onChange={e => setUploadData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                                        className="w-full bg-slate-950/60 border border-white/5 p-6 rounded-[2rem] text-[12px] font-black text-white focus:border-secondary transition-all outline-none shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Enlace de Origen (S3 / CDN)</label>
                                    <input
                                        type="url" placeholder="https://cdn.atomic.com/node-01/..."
                                        value={uploadData.url} onChange={e => setUploadData(prev => ({ ...prev, url: e.target.value }))}
                                        className="w-full bg-slate-950/60 border border-white/5 p-6 rounded-[2rem] text-[12px] font-black text-white focus:border-secondary transition-all outline-none shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2 italic">Volumen de Datos</label>
                                    <div className="relative">
                                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-black text-slate-700 italic">MB</span>
                                        <input
                                            type="number" placeholder="0.0"
                                            onChange={e => setUploadData(prev => ({ ...prev, size: parseFloat(e.target.value) * 1024 * 1024 }))}
                                            className="w-full bg-slate-950/60 border border-white/5 p-6 rounded-[2rem] text-[15px] font-black text-azure-400 focus:border-azure-500 transition-all outline-none shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-8">
                                <button onClick={() => setShowUpload(false)} className="flex-1 py-6 text-[10px] font-black uppercase tracking-[0.4em] border border-white/5 text-slate-600 hover:text-white transition-all rounded-2xl italic">ABORTAR</button>
                                <button onClick={handleUploadFile} className="flex-1 py-6 text-[10px] font-black uppercase tracking-[0.4em] bg-secondary text-white shadow-[0_15px_40px_-5px_rgba(255,99,71,0.5)] rounded-2xl italic skew-x-[-12deg] group">
                                    <div className="skew-x-[12deg] flex items-center justify-center gap-4">
                                        <ShieldCheck size={20} className="group-hover:scale-125 transition-transform" />
                                        <span>FINALIZAR CARGA</span>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
