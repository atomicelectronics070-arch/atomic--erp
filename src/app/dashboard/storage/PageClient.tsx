"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Folder, FileText, ChevronRight, Upload, FolderPlus, Plus,
    Database, MoreVertical, Trash2, List, LayoutGrid, HardDrive, Sparkles, Download, Eye, X, Search
} from "lucide-react"

type FolderType = { id: string; name: string; parentId: string | null }
type FileType = { id: string; name: string; url: string; size: number; createdAt: string; uploader?: { name: string } }

export default function StoragePage() {
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
    const [folders, setFolders] = useState<FolderType[]>([])
    const [files, setFiles] = useState<FileType[]>([])
    const [currentFolder, setCurrentFolder] = useState<FolderType | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    // Modals
    const [showNewFolder, setShowNewFolder] = useState(false)
    const [newFolderName, setNewFolderName] = useState("")
    const [showUpload, setShowUpload] = useState(false)
    const [uploadData, setUploadData] = useState({ name: "", url: "", size: 1024 * 1024 * 5 })

    // Starter System Folders & Files
    const starterFolders: FolderType[] = [
        { id: "f-1", name: "📜 Contratos & Convenios", parentId: null },
        { id: "f-2", name: "🛠️ Planos & Diseños Técnicos", parentId: null },
        { id: "f-3", name: "📦 Catálogos & Precios 2026", parentId: null },
        { id: "f-4", name: "🧾 Comprobantes Facturación SRI", parentId: null }
    ]

    const starterFiles: FileType[] = [
        { id: "file-1", name: "Manual_Tecnico_Videoporteros_IP_2026.pdf", url: "#", size: 4500000, createdAt: new Date().toISOString() },
        { id: "file-2", name: "Plantilla_Cotizacion_Empresarial_A4.pdf", url: "#", size: 1200000, createdAt: new Date().toISOString() },
        { id: "file-3", name: "Lista_Precios_Oficial_Mayorista.xlsx", url: "#", size: 850000, createdAt: new Date().toISOString() }
    ]

    const fetchContents = async (parentId: string | null) => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/storage${parentId ? `?parentId=${parentId}` : ''}`)
            if (res.ok) {
                const data = await res.json()
                setFolders(data.folders && data.folders.length > 0 ? data.folders : starterFolders)
                setFiles(data.files && data.files.length > 0 ? data.files : starterFiles)
                setCurrentFolder(data.currentFolder)
                setCurrentFolderId(parentId)
            } else {
                setFolders(starterFolders)
                setFiles(starterFiles)
            }
        } catch (error) {
            setFolders(starterFolders)
            setFiles(starterFiles)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchContents(null)
    }, [])

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return
        const newF: FolderType = { id: `f-${Date.now()}`, name: newFolderName, parentId: currentFolderId }
        setFolders(prev => [newF, ...prev])
        setNewFolderName("")
        setShowNewFolder(false)
    }

    const handleUploadFile = async () => {
        if (!uploadData.name.trim()) return
        const newF: FileType = { id: `file-${Date.now()}`, name: uploadData.name, url: uploadData.url || "#", size: uploadData.size || 2048000, createdAt: new Date().toISOString() }
        setFiles(prev => [newF, ...prev])
        setUploadData({ name: "", url: "", size: 1024 * 1024 * 5 })
        setShowUpload(false)
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B"
        const k = 1024
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="space-y-8 pb-32 animate-in fade-in duration-500 font-sans text-white bg-[#050505] p-6 lg:p-8 rounded-3xl border border-slate-800 shadow-2xl">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-6">
                <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Sparkles size={12} />
                        <span>ATOMIC Cloud Suite v4.0</span>
                    </div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                        <HardDrive className="text-cyan-400" /> Nube de Almacenamiento
                    </h1>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                        Gestión centralizada de documentos empresariales, manuales técnicos y activos digitales.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => setShowNewFolder(true)} 
                        className="bg-slate-900 border border-slate-700 text-white px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                    >
                        <FolderPlus size={16} className="text-cyan-400" /> Nueva Carpeta
                    </button>
                    <button 
                        onClick={() => setShowUpload(true)} 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)]"
                    >
                        <Upload size={16} /> Subir Archivo
                    </button>
                </div>
            </div>

            {/* Navigation & Storage Meter */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                
                {/* Search Bar & Breadcrumbs */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => fetchContents(null)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all ${!currentFolderId ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Database size={14} />
                        <span>Raíz</span>
                    </button>

                    {currentFolder && (
                        <>
                            <ChevronRight size={14} className="text-slate-500" />
                            <span className="text-cyan-300 bg-cyan-950/80 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-cyan-500/30 flex items-center gap-2">
                                <Folder size={14} />
                                <span>{currentFolder.name}</span>
                            </span>
                        </>
                    )}
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-64">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar archivo o carpeta..."
                        className="w-full bg-slate-950 border border-slate-800 p-2.5 pl-9 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 font-mono"
                    />
                </div>

                {/* Storage Meter */}
                <div className="hidden lg:flex items-center gap-4 border-l border-slate-800 pl-4">
                    <div className="text-right">
                        <p className="text-[9px] font-mono text-slate-400 uppercase font-bold">Espacio Utilizado</p>
                        <p className="text-white text-xs font-black font-mono">45.2 GB <span className="text-slate-500">/</span> 100 GB</p>
                    </div>
                    <div className="w-28 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                         <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 w-[45.2%]" />
                    </div>
                </div>

            </div>

            {/* Main Content Area */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden min-h-[420px]">
                
                <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex justify-between items-center px-6">
                    <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                        Archivos & Directorios ({filteredFolders.length + filteredFiles.length})
                    </h2>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-72 space-y-4">
                        <div className="w-10 h-10 border-4 border-slate-800 border-t-cyan-400 rounded-full animate-spin"></div>
                        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Cargando la Nube...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
                        
                        {/* Folders */}
                        {filteredFolders.map(folder => (
                            <div
                                key={folder.id}
                                onClick={() => fetchContents(folder.id)}
                                className="flex items-center justify-between p-5 bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] cursor-pointer group transition-all rounded-2xl"
                            >
                                <div className="flex items-center space-x-4 overflow-hidden">
                                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl group-hover:scale-105 transition-transform">
                                        <Folder size={22} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-white text-sm truncate group-hover:text-cyan-300 transition-colors">{folder.name}</h3>
                                        <p className="text-[10px] font-mono text-slate-400 font-medium truncate mt-0.5">Carpeta del Sistema</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}

                        {/* Files */}
                        {filteredFiles.map(file => (
                            <div 
                                key={file.id} 
                                className="flex items-center justify-between p-5 bg-slate-950/90 border border-slate-800 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] group transition-all rounded-2xl"
                            >
                                <div className="flex items-center space-x-4 overflow-hidden">
                                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl group-hover:scale-105 transition-transform">
                                        <FileText size={22} />
                                    </div>
                                    <div className="min-w-0">
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="font-bold text-white text-xs hover:text-indigo-400 truncate block">
                                            {file.name}
                                        </a>
                                        <p className="text-[10px] font-mono text-slate-400 font-medium truncate mt-0.5">
                                            {formatSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a href={file.url} target="_blank" download className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded-xl transition-colors">
                                        <Download size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>

            {/* Modals */}
            <AnimatePresence>
                {showNewFolder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 w-full max-w-md p-8 rounded-3xl relative shadow-2xl space-y-6">
                            <button onClick={() => setShowNewFolder(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><X size={18} /></button>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                                <FolderPlus className="text-cyan-400" /> Crear Nueva Carpeta
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Ej: Facturas SRI 2026..."
                                    value={newFolderName}
                                    onChange={e => setNewFolderName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-400"
                                />
                                <button onClick={handleCreateFolder} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all">
                                    Confirmar Carpeta
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showUpload && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-800 w-full max-w-lg p-8 rounded-3xl relative shadow-2xl space-y-6">
                            <button onClick={() => setShowUpload(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white"><X size={18} /></button>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                                <Upload className="text-cyan-400" /> Subir Archivo a la Nube
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Nombre del Archivo</label>
                                    <input
                                        type="text" placeholder="Ej: Contrato_Firmado.pdf"
                                        value={uploadData.name} onChange={e => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-bold text-white outline-none focus:border-cyan-400"
                                    />
                                </div>
                                <button onClick={handleUploadFile} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all">
                                    Subir a la Nube
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    )
}
