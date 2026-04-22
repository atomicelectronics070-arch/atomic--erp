"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Folder, FileText, ChevronRight, Upload, FolderPlus, Plus,
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
        <div className="space-y-16 pb-40 animate-in fade-in duration-1000 relative">
            {/* Background Orbs - Enhanced Depth */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] right-[-15%] w-[45%] h-[45%] rounded-none bg-azure-500/5 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[10%] left-[-15%] w-[40%] h-[40%] rounded-none bg-tomato-500/5 blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header - Industrial Mastery */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 border-b border-white/10 pb-20 relative z-10">
                <div>
                     <div className="flex items-center space-x-6 mb-6 text-secondary">
                        <HardDrive size={24} className="drop-shadow-[0_0_12px_rgba(255,99,71,0.6)]" />
                        <span className="text-[11px] uppercase font-black tracking-[0.8em] italic">ESTRUCTURA DE DATOS v4.0</span>
                    </div>
                    <h1 className="text-7xl font-black tracking-tighter text-white uppercase italic leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                        BANCO DE <span className="text-secondary underline decoration-secondary/40 underline-offset-[12px] decoration-4">ALMACENAMIENTO</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.4em] mt-7 max-w-2xl italic leading-relaxed opacity-80">
                        Protocolo centralizado para la gestión, auditoría y encriptación de activos digitales corporativos de alto nivel.
                    </p>
                </div>
                <div className="flex flex-wrap gap-10">
                    <button 
                        onClick={() => setShowNewFolder(true)} 
                        className="px-10 py-6 glass-panel text-slate-500 hover:text-white transition-all rounded-none-[1.8rem] border-white/10 group flex items-center gap-6 bg-slate-900/60 shadow-2xl active:scale-95"
                    >
                        <FolderPlus size={30} className="group-hover:rotate-12 transition-transform duration-500" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] hidden md:block italic">SISTEMA_DIR</span>
                    </button>
                    <button 
                        onClick={() => setShowUpload(true)} 
                        className="bg-secondary text-white px-16 py-6 font-black uppercase tracking-[0.4em] text-[11px] flex items-center shadow-[0_35px_80px_-15px_rgba(255,99,71,0.6)] transition-all hover:scale-105 rounded-none-[2.2rem] active:scale-95 group italic skew-x-[-15deg]"
                    >
                        <div className="flex items-center gap-8 skew-x-[15deg]">
                            <Upload size={30} className="group-hover:translate-y-[-4px] transition-transform" />
                            <span>INYECTAR_ACTIVO</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Breadcrumb Navigation - Glass Node */}
            <div className="glass-panel !bg-slate-950/70 p-8 flex flex-wrap items-center gap-6 text-[11px] font-black uppercase tracking-[0.5em] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative z-10 rounded-none-[2.5rem] border-white/10 backdrop-blur-[50px] italic ring-1 ring-white/5">
                <button
                    onClick={() => fetchContents(null)}
                    className={`flex items-center space-x-4 px-8 py-3.5 rounded-none-[1.2rem] transition-all duration-500 ${!currentFolderId ? 'bg-secondary text-white shadow-3xl shadow-secondary/30 scale-105' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}
                >
                    <Database size={20} className={!currentFolderId ? 'animate-pulse' : ''} />
                    <span>NODO_RAÍZ</span>
                </button>
                {currentFolder && (
                    <>
                        <ChevronRight size={18} className="text-slate-800" />
                        {currentFolder.parentId && (
                            <>
                                <button className="text-slate-700 hover:text-secondary transition-all px-4 py-2 hover:bg-white/5 rounded-none" onClick={() => fetchContents(currentFolder.parentId)}>...</button>
                                <ChevronRight size={18} className="text-slate-800" />
                            </>
                        )}
                        <span className="text-azure-400 bg-azure-500/10 px-8 py-3.5 rounded-none-[1.2rem] border border-azure-500/30 flex items-center space-x-4 shadow-3xl shadow-azure-500/5 ring-1 ring-azure-500/20">
                            <Folder size={18} className="fill-azure-400/20" />
                            <span>{currentFolder.name}</span>
                        </span>
                    </>
                )}
                
                {/* Visual Storage Meter - Industrial */}
                <div className="ms-auto hidden lg:flex items-center gap-10 py-2 px-12 border-s border-white/10">
                    <div className="text-right space-y-2">
                        <p className="text-[9px] text-slate-700 font-black tracking-widest">SATURACIÓN_NODO</p>
                        <p className="text-white text-sm font-black italic">45.2 GB <span className="text-slate-700 mx-2">/</span> 100 GB</p>
                    </div>
                    <div className="w-56 h-3 bg-slate-900/80 rounded-none overflow-hidden border border-white/10 shadow-inner p-[2px] ring-1 ring-white/5">
                         <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: '45.2%' }} 
                            transition={{ duration: 2, ease: "easeOut" }} 
                            className="h-full bg-gradient-to-r from-azure-600 to-azure-400 rounded-none shadow-[0_0_20px_rgba(45,212,191,0.6)] relative"
                         >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                         </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Command Center */}
            <div className="glass-panel !bg-slate-950/70 border-white/10 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.9)] min-h-[600px] relative z-10 rounded-none-[4.5rem] backdrop-blur-[60px] overflow-hidden ring-1 ring-white/5">
                <div className="p-12 border-b border-white/10 bg-white/[0.02] flex justify-between items-center backdrop-blur-xl">
                    <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.8em] italic flex items-center gap-4">
                        <div className="w-2 h-2 rounded-none bg-secondary shadow-[0_0_10px_rgba(255,99,71,0.8)]" />
                        NÚCLEO DE ESTRUCTURA INTERNA
                    </h2>
                    <div className="flex items-center gap-8">
                        <button className="text-slate-700 hover:text-white transition-all hover:scale-110 active:scale-90"><List size={24} /></button>
                        <button className="text-slate-700 hover:text-secondary transition-all hover:scale-110 active:scale-90"><LayoutGrid size={24} /></button>
                        <div className="h-8 w-[1px] bg-white/10 mx-2" />
                        <button className="text-slate-700 hover:text-white transition-all hover:scale-110 active:scale-90"><Filter size={24} /></button>
                    </div>
                </div>

                <div className="p-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-96 space-y-10">
                            <div className="w-16 h-16 border-4 border-white/5 border-t-secondary rounded-none animate-spin shadow-[0_0_30px_rgba(255,99,71,0.3)]"></div>
                            <p className="text-[11px] font-black text-slate-700 uppercase tracking-[1em] italic animate-pulse">AUDITORÍA DE DIRECTORIO v4.0...</p>
                        </div>
                    ) : folders.length === 0 && files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 text-slate-800 opacity-30 group">
                            <div className="p-16 bg-slate-900 rounded-none-[4rem] mb-12 border border-white/10 shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                                <Folder size={100} className="text-slate-950" />
                            </div>
                            <p className="text-[14px] font-black uppercase tracking-[1em] italic">NODO DESIERTO</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-5 italic">Protocolo Cero: Ningún Activo Detectado</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 p-8">
                            {folders.map(folder => (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={folder.id}
                                    onClick={() => fetchContents(folder.id)}
                                    className="flex items-center justify-between p-10 glass-panel !bg-slate-900/60 border-white/10 hover:!bg-white/[0.05] hover:border-secondary/50 cursor-pointer group transition-all rounded-none-[3rem] shadow-3xl relative overflow-hidden ring-1 ring-white/5"
                                >
                                    <div className="absolute left-0 top-0 w-2 h-full bg-slate-950 group-hover:bg-secondary transition-all duration-500 shadow-[2px_0_15px_rgba(0,0,0,0.5)]" />
                                    <div className="flex items-center space-x-12">
                                        <div className="p-7 bg-slate-950 text-slate-700 group-hover:text-secondary group-hover:rotate-[15deg] group-hover:scale-110 transition-all rounded-none-[1.8rem] shadow-inner border border-white/10 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <Folder size={36} className="fill-current opacity-10 group-hover:opacity-40 transition-opacity relative z-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic group-hover:translate-x-4 transition-all duration-500">{folder.name}</h3>
                                            <div className="flex items-center gap-4 text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] italic group-hover:translate-x-4 transition-all duration-500 delay-100">
                                                <span className="text-secondary/60">CONTENEDOR_ACTIVO</span>
                                                <span className="text-slate-800">•</span>
                                                <span>UID_{folder.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-slate-800 group-hover:text-secondary group-hover:translate-x-5 transition-all duration-700 p-4">
                                        <ChevronRight size={32} />
                                    </div>
                                </motion.div>
                            ))}
                            {files.map(file => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={file.id} 
                                    className="flex items-center justify-between p-10 glass-panel !bg-slate-950/60 border-white/10 hover:!bg-white/[0.05] hover:border-azure-500/50 group transition-all rounded-none-[3rem] shadow-3xl relative overflow-hidden ring-1 ring-white/5"
                                >
                                    <div className="absolute left-0 top-0 w-2 h-full bg-slate-950 group-hover:bg-azure-500 transition-all duration-500 shadow-[2px_0_15px_rgba(0,0,0,0.5)]" />
                                    <div className="flex items-center space-x-12">
                                        <div className="p-7 bg-slate-950 text-slate-700 group-hover:text-azure-400 group-hover:scale-110 group-hover:rotate-[-10deg] transition-all rounded-none-[1.8rem] shadow-inner border border-white/10 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-azure-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <FileText size={36} className="relative z-10" />
                                        </div>
                                        <div className="space-y-3">
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-2xl font-black text-white hover:text-azure-400 transition-all uppercase tracking-tighter italic block group-hover:translate-x-4 duration-500">
                                                {file.name}
                                            </a>
                                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic group-hover:translate-x-4 transition-all duration-500 delay-100">
                                                <span className="text-azure-500/60 bg-azure-500/5 px-4 py-1.5 rounded-none border border-azure-500/10 shadow-inner">{formatSize(file.size)}</span>
                                                <span className="text-slate-800">•</span>
                                                <span className="flex items-center gap-2">CALENDARIO: {new Date(file.createdAt).toLocaleDateString()}</span>
                                                <span className="text-slate-800">•</span>
                                                <span className="bg-white/5 px-4 py-1.5 rounded-none text-slate-500 border border-white/10">AUTOR: {file.uploader.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10 opacity-0 group-hover:opacity-100 transition-all translate-x-16 group-hover:translate-x-0 duration-700 p-4">
                                        <button className="p-6 glass-panel !bg-slate-900 border border-white/10 text-slate-600 hover:text-azure-400 hover:scale-110 transition-all rounded-none shadow-3xl shadow-azure-500/5">
                                            <MoreVertical size={28} />
                                        </button>
                                        <button className="p-6 glass-panel !bg-slate-900 border border-white/10 text-slate-600 hover:text-red-500 hover:scale-110 transition-all rounded-none shadow-3xl shadow-red-500/5">
                                            <Trash2 size={28} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: New Folder - Industrial Redesign */}
            <AnimatePresence>
                {showNewFolder && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center p-12">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/98 backdrop-blur-[100px]" 
                            onClick={() => setShowNewFolder(false)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 50 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="glass-panel !bg-slate-950/40 w-full max-w-2xl shadow-[0_0_300px_rgba(0,0,0,1)] border border-white/10 overflow-hidden rounded-none-[5rem] relative z-10 backdrop-blur-[150px] p-20 ring-1 ring-white/10"
                        >
                            <div className="flex items-center gap-8 mb-16">
                                <div className="p-8 bg-secondary rounded-none-[2.5rem] shadow-[0_0_40px_rgba(255,99,71,0.4)] animate-pulse">
                                    <FolderPlus size={40} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                                        CREAR <span className="text-secondary">NODO</span>
                                    </h3>
                                    <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.6em] mt-4 italic">Protocolo de Directorio Industrial v4.0</p>
                                </div>
                            </div>

                            <div className="space-y-6 mb-16">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] ml-4 italic flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-none bg-secondary" />
                                    Identificador del Canal
                                </label>
                                <input
                                    type="text"
                                    placeholder="NOMBRE DEL DIRECTORIO..."
                                    value={newFolderName}
                                    onChange={e => setNewFolderName(e.target.value.toUpperCase())}
                                    onKeyDown={e => e.key === "Enter" && handleCreateFolder()}
                                    autoFocus
                                    className="w-full bg-slate-900/60 border border-white/10 p-10 rounded-none-[3rem] text-[14px] font-black uppercase tracking-[0.3em] text-white focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all outline-none shadow-inner placeholder:text-slate-800 italic"
                                />
                            </div>

                            <div className="flex gap-12">
                                <button onClick={() => setShowNewFolder(false)} className="flex-1 py-8 text-[11px] font-black uppercase tracking-[0.8em] border border-white/10 text-slate-600 hover:text-white hover:bg-white/5 transition-all rounded-none-[2.5rem] italic skew-x-[-15deg]">
                                    ABORTAR
                                </button>
                                <button onClick={handleCreateFolder} className="flex-1 py-8 text-[11px] font-black uppercase tracking-[0.8em] bg-secondary text-white shadow-[0_40px_100px_-20px_rgba(255,99,71,0.6)] rounded-none-[2.5rem] italic skew-x-[-15deg] group hover:scale-105 active:scale-95 transition-all">
                                    <div className="skew-x-[15deg] flex items-center justify-center gap-6">
                                        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" />
                                        <span>CONFIRMAR_NODO</span>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal: Upload File (Simulated) - Industrial Redesign */}
            <AnimatePresence>
                {showUpload && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center p-12">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/98 backdrop-blur-[100px]" 
                            onClick={() => setShowUpload(false)} 
                        />
                        <motion.div 
                             initial={{ opacity: 0, scale: 0.8, y: 50 }}
                             animate={{ opacity: 1, scale: 1, y: 0 }}
                             exit={{ opacity: 0, scale: 0.8, y: 50 }}
                             transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                             className="glass-panel !bg-slate-950/40 w-full max-w-3xl shadow-[0_0_300px_rgba(0,0,0,1)] border border-white/10 overflow-hidden rounded-none-[6rem] relative z-10 backdrop-blur-[150px] p-20 ring-1 ring-white/10"
                        >
                            <div className="flex items-center gap-10 mb-12">
                                <div className="p-10 bg-azure-500 rounded-none-[3rem] shadow-[0_0_50px_rgba(45,212,191,0.4)] animate-pulse">
                                    <Upload size={48} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                                        INYECTAR <span className="text-azure-400">ACTIVO</span>
                                    </h3>
                                    <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.6em] mt-5 italic">Protocolo de Carga Masiva S3 Linkage</p>
                                </div>
                            </div>
                            
                            <p className="text-[11px] text-slate-500 mb-16 uppercase tracking-[0.4em] italic font-bold leading-relaxed border-l-4 border-azure-500/30 pl-8 bg-azure-500/5 py-6 rounded-none">
                                <span className="text-azure-400">AUDIT:</span> EL SOPORTE PARA CARGA DIRECTA S3 ESTÁ EN SINTONÍA. INGRESE URL REFERENCIAL DEL NODO DIGITAL PARA ENCRIPTACIÓN.
                            </p>

                            <div className="space-y-12 mb-20">
                                <div className="space-y-5">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] ml-6 italic flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-none bg-azure-400" />
                                        Identificador del Activo
                                    </label>
                                    <input
                                        type="text" placeholder="EJ: MANUAL_TECNICO_V1.PDF"
                                        value={uploadData.name} onChange={e => setUploadData(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                                        className="w-full bg-slate-900/60 border border-white/10 p-10 rounded-none-[3rem] text-[15px] font-black text-white focus:border-azure-500 focus:ring-4 focus:ring-azure-500/5 transition-all outline-none shadow-inner italic uppercase tracking-widest placeholder:text-slate-800"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-5">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] ml-6 italic flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-none bg-azure-400" />
                                            Enlace S3/CDN
                                        </label>
                                        <input
                                            type="url" placeholder="https://cdn.atomic.co/..."
                                            value={uploadData.url} onChange={e => setUploadData(prev => ({ ...prev, url: e.target.value }))}
                                            className="w-full bg-slate-900/60 border border-white/10 p-10 rounded-none-[3rem] text-[13px] font-black text-white focus:border-azure-500 outline-none shadow-inner transition-all placeholder:text-slate-800 italic"
                                        />
                                    </div>
                                    <div className="space-y-5">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] ml-6 italic flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-none bg-azure-400" />
                                            Volumen MB
                                        </label>
                                        <div className="relative">
                                            <span className="absolute right-12 top-1/2 -translate-y-1/2 text-[14px] font-black text-slate-700 italic">MB</span>
                                            <input
                                                type="number" placeholder="0.00"
                                                onChange={e => setUploadData(prev => ({ ...prev, size: parseFloat(e.target.value) * 1024 * 1024 }))}
                                                className="w-full bg-slate-900/60 border border-white/10 p-10 rounded-none-[3rem] text-[24px] font-black text-azure-400 focus:border-azure-500 transition-all outline-none shadow-inner italic"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-12">
                                <button onClick={() => setShowUpload(false)} className="flex-1 py-10 text-[11px] font-black uppercase tracking-[0.8em] border border-white/10 text-slate-600 hover:text-white hover:bg-white/5 transition-all rounded-none-[3rem] italic skew-x-[-15deg]">
                                    ABORTAR
                                </button>
                                <button onClick={handleUploadFile} className="flex-1 py-10 text-[11px] font-black uppercase tracking-[0.8em] bg-azure-600 text-white shadow-[0_50px_100px_-20px_rgba(45,212,191,0.6)] rounded-none-[3rem] italic skew-x-[-15deg] group hover:scale-[1.03] active:scale-95 transition-all">
                                    <div className="skew-x-[15deg] flex items-center justify-center gap-8">
                                        <ShieldCheck size={32} className="group-hover:scale-125 transition-transform duration-500" />
                                        <span>INYECTAR_AL_NODO</span>
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
