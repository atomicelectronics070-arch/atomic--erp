"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { FileText, Plus, Search, Trash2, Pin, PinOff, Save, X, MoreVertical } from "lucide-react"
import { getNotes, saveNote, deleteNote } from "@/lib/actions/productivity"

export default function NotesPage() {
    const { data: session } = useSession()
    const [notes, setNotes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [editingNote, setEditingNote] = useState<any>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    useEffect(() => {
        if (session?.user?.id) refreshNotes()
    }, [session])

    const refreshNotes = async () => {
        setLoading(true)
        const n = await getNotes(session!.user.id)
        setNotes(n)
        setLoading(false)
    }

    const handleSave = async (data: any) => {
        await saveNote({ ...data, userId: session!.user.id })
        setIsFormOpen(false)
        setEditingNote(null)
        refreshNotes()
    }

    const handleDelete = async (id: string) => {
        if (confirm("¿Eliminar esta nota?")) {
            await deleteNote(id)
            refreshNotes()
        }
    }

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-neutral-100 pb-8 gap-6">
                <div>
                    <div className="flex items-center space-x-2 text-orange-600 mb-2">
                        <FileText size={20} />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Personal Workspace</span>
                    </div>
                    <h1 className="text-4xl font-light text-neutral-800 tracking-tight">Bloc de Notas</h1>
                    <p className="text-neutral-500 text-sm mt-2">Tus ideas, recordatorios y apuntes importantes en un solo lugar.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar notas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-neutral-50 border-none pl-12 pr-6 py-3 text-xs outline-none focus:ring-2 focus:ring-orange-500/10 transition-all w-64"
                        />
                    </div>
                    <button
                        onClick={() => { setEditingNote(null); setIsFormOpen(true); }}
                        className="bg-neutral-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-neutral-100 flex items-center space-x-2"
                    >
                        <Plus size={16} /> <span>Nueva Nota</span>
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-neutral-50 animate-pulse border border-neutral-100"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                    {filteredNotes.map((note) => (
                        <div
                            key={note.id}
                            style={{ backgroundColor: note.color || '#ffffff' }}
                            className="p-8 border border-neutral-100 shadow-sm hover:shadow-md transition-all group relative flex flex-col h-64 overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-tight line-clamp-2">{note.title}</h3>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingNote(note); setIsFormOpen(true); }} className="p-1.5 text-neutral-400 hover:text-neutral-800"><Save size={14} /></button>
                                    <button onClick={() => handleDelete(note.id)} className="p-1.5 text-neutral-400 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-500 leading-relaxed overflow-hidden text-ellipsis flex-1 mb-4">
                                {note.content}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-black/5">
                                <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                                {note.pinned && <Pin size={12} className="text-orange-500" />}
                            </div>
                        </div>
                    ))}
                    {filteredNotes.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-neutral-100">
                            <p className="font-black text-neutral-300 uppercase tracking-widest">No hay notas que coincidan</p>
                        </div>
                    )}
                </div>
            )}

            {isFormOpen && (
                <NoteForm
                    initialData={editingNote}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}

function NoteForm({ initialData, onClose, onSave }: any) {
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        title: initialData?.title || '',
        content: initialData?.content || '',
        color: initialData?.color || '#ffffff',
        pinned: initialData?.pinned || false
    })

    const colors = ['#ffffff', '#fff9c4', '#f8bbd0', '#c8e6c9', '#bbdefb', '#ffe0b2']

    return (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                    <div className="flex items-center space-x-3 text-orange-600">
                        <FileText size={18} />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em]">{formData.id ? 'Editar Nota' : 'Nueva Nota'}</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-300 hover:text-neutral-800 transition-colors">
                        <X size={20} />
                    </button>
                </header>
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Título de la Nota</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Escribe un título..."
                            className="w-full bg-neutral-50 border-none px-6 py-4 text-sm font-bold outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Contenido</label>
                        <textarea
                            rows={10}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Vierte tus pensamientos aquí..."
                            className="w-full bg-neutral-50 border-none px-6 py-4 text-sm outline-none resize-none leading-relaxed"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div className="flex space-x-2">
                            {colors.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setFormData({ ...formData, color: c })}
                                    className={`w-6 h-6 border ${formData.color === c ? 'border-neutral-800 ring-2 ring-neutral-100' : 'border-neutral-100'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => setFormData({ ...formData, pinned: !formData.pinned })}
                            className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest ${formData.pinned ? 'text-orange-600' : 'text-neutral-300'}`}
                        >
                            {formData.pinned ? <Pin size={14} /> : <PinOff size={14} />}
                            <span>{formData.pinned ? 'Fijado' : 'Fijar Nota'}</span>
                        </button>
                    </div>
                </div>
                <footer className="p-8 border-t border-neutral-100 flex justify-end space-x-4">
                    <button onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-800 transition-colors">Cerrar</button>
                    <button
                        onClick={() => onSave(formData)}
                        className="bg-neutral-900 text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-neutral-100 flex items-center space-x-2"
                    >
                        <Save size={16} /> <span>Guardar en Bloc</span>
                    </button>
                </footer>
            </div>
        </div>
    )
}
