"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Folder, FileText, ChevronRight, Upload, FolderPlus, Plus,
    Database, MoreVertical, Trash2, List, LayoutGrid, Filter, HardDrive, ShieldCheck, X
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
        <div className="space-y-8 pb-32 animate-in fade-in duration-500 font-sans">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-[#0F172A] flex items-center gap-3">
                        <HardDrive className="text-indigo-600" /> Almacenamiento
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Gestión centralizada de documentos y activos digitales.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowNewFolder(true)} 
                        className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 text-slate-600 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                    >
                        <FolderPlus size={18} /> Nueva Carpeta
                    </button>
                    <button 
                        onClick={() => setShowUpload(true)} 
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                    >
                        <Upload size={18} /> Subir Archivo
                    </button>
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 p-4 rounded-xl flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <button
                    onClick={() => fetchContents(null)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all ${!currentFolderId ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 hover:text-slate-700'}`}
                >
                    <Database size={16} />
                    <span>Raíz</span>
                </button>
                
                {currentFolder && (
                    <>
                        <ChevronRight size={16} className="text-slate-300" />
                        {currentFolder.parentId && (
                            <>
                                <button className="hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors" onClick={() => fetchContents(currentFolder.parentId)}>...</button>
                                <ChevronRight size={16} className="text-slate-300" />
                            </>
                        )}
                        <span className="text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md flex items-center space-x-2 border border-indigo-100">
                            <Folder size={16} className="fill-indigo-100" />
                            <span>{currentFolder.name}</span>
                        </span>
                    </>
                )}
                
                {/* Storage Meter */}
                <div className="ml-auto hidden md:flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Espacio Utilizado</p>
                        <p className="text-slate-700 text-xs font-black">45.2 GB <span className="text-slate-300 mx-1">/</span> 100 GB</p>
                    </div>
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                         <div className="h-full bg-indigo-500 w-[45.2%] rounded-full" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] overflow-hidden min-h-[500px]">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        Contenido del Directorio
                    </h2>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><List size={18} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><LayoutGrid size={18} /></button>
                    </div>
                </div>

                <div>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-80 space-y-4">
                            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Cargando directorio...</p>
                        </div>
                    ) : folders.length === 0 && files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-80 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                                <Folder size={40} className="text-slate-300" />
                            </div>
                            <p className="text-lg font-black text-[#0F172A]">Carpeta Vacía</p>
                            <p className="text-sm text-slate-500 font-medium mt-1">Sube archivos o crea carpetas aquí.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                            {folders.map(folder => (
                                <div
                                    key={folder.id}
                                    onClick={() => fetchContents(folder.id)}
                                    className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 hover:border-indigo-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer group transition-all rounded-xl"
                                >
                                    <div className="flex items-center space-x-4 overflow-hidden">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:scale-105 transition-transform">
                                            <Folder size={24} className="fill-indigo-100" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-[#0F172A] truncate">{folder.name}</h3>
                                            <p className="text-xs text-slate-400 font-medium truncate mt-0.5">Carpeta</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {files.map(file => (
                                <div 
                                    key={file.id} 
                                    className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 hover:border-emerald-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] group transition-all rounded-xl"
                                >
                                    <div className="flex items-center space-x-4 overflow-hidden">
                                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-105 transition-transform">
                                            <FileText size={24} />
                                        </div>
                                        <div className="min-w-0">
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#0F172A] hover:text-indigo-600 truncate block">
                                                {file.name}
                                            </a>
                                            <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                                                {formatSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showNewFolder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowNewFolder(false)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 w-full max-w-md p-8 rounded-2xl shadow-xl relative z-10 border border-slate-200"
                        >
                            <button onClick={() => setShowNewFolder(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                            <h3 className="text-xl font-black text-[#0F172A] mb-6 flex items-center gap-3">
                                <FolderPlus className="text-indigo-600" /> Nueva Carpeta
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nombre de la carpeta"
                                    value={newFolderName}
                                    onChange={e => setNewFolderName(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleCreateFolder()}
                                    autoFocus
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm font-bold text-[#0F172A] focus:border-indigo-500 outline-none"
                                />
                                <button onClick={handleCreateFolder} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors">
                                    Crear Carpeta
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
                
                {showUpload && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowUpload(false)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 w-full max-w-lg p-8 rounded-2xl shadow-xl relative z-10 border border-slate-200"
                        >
                            <button onClick={() => setShowUpload(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                            <h3 className="text-xl font-black text-[#0F172A] mb-2 flex items-center gap-3">
                                <Upload className="text-indigo-600" /> Subir Archivo
                            </h3>
                            <p className="text-sm text-slate-500 mb-6">Ingresa los detalles del archivo almacenado en S3/CDN.</p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Nombre del Archivo</label>
                                    <input
                                        type="text" placeholder="Ej: Reporte_2024.pdf"
                                        value={uploadData.name} onChange={e => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm font-bold text-[#0F172A] focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">URL (CDN/S3)</label>
                                    <input
                                        type="url" placeholder="https://..."
                                        value={uploadData.url} onChange={e => setUploadData(prev => ({ ...prev, url: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm text-[#0F172A] focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">Tamaño Estimado (MB)</label>
                                    <input
                                        type="number" placeholder="0.00"
                                        onChange={e => setUploadData(prev => ({ ...prev, size: parseFloat(e.target.value) * 1024 * 1024 }))}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm font-bold text-[#0F172A] focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <button onClick={handleUploadFile} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors mt-4">
                                    Registrar Archivo
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
