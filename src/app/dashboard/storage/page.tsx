"use client"

import { useState, useEffect } from "react"
import { Folder, FileText, ChevronRight, Upload, FolderPlus, ArrowLeft, Database, MoreVertical, Trash2 } from "lucide-react"

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
        <div className="space-y-8 pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 uppercase">
                        Banco de <span className="text-orange-600">Almacenamiento</span>
                    </h1>
                    <p className="text-neutral-400 font-medium text-sm mt-1">Gestión centralizada de documentos corporativos.</p>
                </div>
                <div className="flex space-x-3">
                    <button onClick={() => setShowNewFolder(true)} className="bg-white border border-neutral-200 text-neutral-800 px-6 py-3 font-bold uppercase tracking-widest text-[10px] flex items-center space-x-2 transition-all hover:border-orange-600 hover:text-orange-600">
                        <FolderPlus size={16} />
                        <span>Nueva Carpeta</span>
                    </button>
                    <button onClick={() => setShowUpload(true)} className="bg-orange-600 text-white px-6 py-3 font-bold uppercase tracking-widest text-[10px] flex items-center space-x-2 transition-all hover:bg-neutral-900 shadow-lg shadow-orange-600/20">
                        <Upload size={16} />
                        <span>Subir Archivo</span>
                    </button>
                </div>
            </div>

            {/* Breadcrumb Navigation */}
            <div className="bg-white border border-neutral-200 p-4 flex items-center space-x-2 text-sm font-bold uppercase tracking-widest shadow-sm">
                <button
                    onClick={() => fetchContents(null)}
                    className={`flex items-center space-x-2 ${!currentFolderId ? 'text-orange-600' : 'text-neutral-400 hover:text-neutral-800'} transition-colors`}
                >
                    <Database size={16} />
                    <span>Raíz</span>
                </button>
                {currentFolder && (
                    <>
                        <ChevronRight size={14} className="text-neutral-300" />
                        {currentFolder.parentId && (
                            <>
                                <button className="text-neutral-400 hover:text-neutral-800 transition-colors" onClick={() => fetchContents(currentFolder.parentId)}>...</button>
                                <ChevronRight size={14} className="text-neutral-300" />
                            </>
                        )}
                        <span className="text-orange-600 flex items-center space-x-2">
                            <Folder size={14} />
                            <span>{currentFolder.name}</span>
                        </span>
                    </>
                )}
            </div>

            {/* Content Area */}
            <div className="bg-white border border-neutral-200 shadow-sm min-h-[400px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-8 h-8 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                    </div>
                ) : folders.length === 0 && files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
                        <Folder size={48} className="mb-4 text-neutral-200" />
                        <p className="text-xs font-bold uppercase tracking-widest">Carpeta Vacía</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {folders.map(folder => (
                            <div
                                key={folder.id}
                                onClick={() => fetchContents(folder.id)}
                                className="flex items-center justify-between p-4 hover:bg-neutral-50 cursor-pointer group transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                        <Folder size={20} className="fill-current opacity-20 group-hover:opacity-100" />
                                    </div>
                                    <span className="font-bold text-neutral-800">{folder.name}</span>
                                </div>
                                <div className="text-neutral-400">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        ))}
                        {files.map(file => (
                            <div key={file.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 group transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-neutral-100 text-neutral-500 group-hover:bg-neutral-800 group-hover:text-white transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="font-bold text-neutral-800 hover:text-orange-600 transition-colors">
                                            {file.name}
                                        </a>
                                        <div className="flex items-center space-x-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                                            <span>{formatSize(file.size)}</span>
                                            <span>•</span>
                                            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>Por: {file.uploader.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 text-neutral-300 hover:text-red-600 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal: New Folder */}
            {showNewFolder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
                    <div className="bg-white p-8 max-w-md w-full border border-neutral-200 shadow-2xl">
                        <h3 className="text-lg font-bold uppercase tracking-tight mb-6">Crear Nueva Carpeta</h3>
                        <input
                            type="text"
                            placeholder="Nombre de la carpeta"
                            value={newFolderName}
                            onChange={e => setNewFolderName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleCreateFolder()}
                            autoFocus
                            className="w-full bg-neutral-50 border border-neutral-200 p-4 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all mb-6"
                        />
                        <div className="flex space-x-4">
                            <button onClick={() => setShowNewFolder(false)} className="flex-1 py-4 text-xs font-bold uppercase tracking-widest border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">Cancelar</button>
                            <button onClick={handleCreateFolder} className="flex-1 py-4 text-xs font-bold uppercase tracking-widest bg-orange-600 text-white hover:bg-orange-700 transition-colors">Crear</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Upload File Info (Simulated) */}
            {showUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
                    <div className="bg-white p-8 max-w-md w-full border border-neutral-200 shadow-2xl">
                        <h3 className="text-lg font-bold uppercase tracking-tight mb-2">Registrar Archivo</h3>
                        <p className="text-xs text-neutral-500 mb-6">El soporte para carga directa S3 está en desarrollo. Ingrese URL referencial por ahora.</p>
                        <div className="space-y-4 mb-6">
                            <input
                                type="text" placeholder="Nombre completo del archivo (Ej. Manual.pdf)"
                                value={uploadData.name} onChange={e => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-neutral-50 border border-neutral-200 p-4 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            />
                            <input
                                type="url" placeholder="URL externa (Ej. https://.../manual.pdf)"
                                value={uploadData.url} onChange={e => setUploadData(prev => ({ ...prev, url: e.target.value }))}
                                className="w-full bg-neutral-50 border border-neutral-200 p-4 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            />
                            <div className="relative">
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">MB</span>
                                <input
                                    type="number" placeholder="Tamaño aproximado"
                                    onChange={e => setUploadData(prev => ({ ...prev, size: parseFloat(e.target.value) * 1024 * 1024 }))}
                                    className="w-full bg-neutral-50 border border-neutral-200 p-4 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button onClick={() => setShowUpload(false)} className="flex-1 py-4 text-xs font-bold uppercase tracking-widest border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">Cancelar</button>
                            <button onClick={handleUploadFile} className="flex-1 py-4 text-xs font-bold uppercase tracking-widest bg-orange-600 text-white hover:bg-orange-700 transition-colors">Registrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
