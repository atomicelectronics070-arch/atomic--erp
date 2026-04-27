"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    FileText, Plus, Search, Trash2, Pin, PinOff, Save, 
    X, MoreVertical, Sparkles, Target, Zap, ShieldCheck, 
    ArrowUpRight, LayoutGrid, StickyNote 
} from "lucide-react"
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
        try {
            const n = await getNotes(session!.user.id)
            setNotes(n)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (data: any) => {
        await saveNote({ ...data, userId: session!.user.id })
        setIsFormOpen(false)
        setEditingNote(null)
        refreshNotes()
    }

    const handleDelete = async (id: string) => {
        if (confirm("⚠️ Confirmación Crítica: ¿Eliminar esta nota permanentemente?")) {
            await deleteNote(id)
            refreshNotes()
        }
    }

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-1000 relative">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[5%] left-[-10%] w-[45%] h-[45%] rounded-none bg-secondary/5 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[35%] h-[35%] rounded-none bg-azure-500/5 blur-[100px]" />
            </div>

            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/5 pb-16 relative z-10 gap-10">
                <div>
                     <div className="flex items-center space-x-4 mb-4 text-secondary">
                        <StickyNote size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                        <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Knowledge Storage v3.0</span>
                    </div>
                    <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none italic">
                        BLOC DE <span className="text-secondary underline decoration-secondary/30 underline-offset-8">NOTAS</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-5 max-w-xl italic leading-relaxed">
                        Repositorio táctico de ideas, metadata operativa y recordatorios de alto impacto para la gestión diaria.
                    </p>
                </div>

                <div className="flex items-center gap-8">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-azure-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="FILTRAR METADATA..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-950/60 border border-white/5 pl-14 pr-8 py-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-azure-500/50 transition-all w-72 rounded-none shadow-inner placeholder:text-slate-900 italic focus:ring-4 focus:ring-azure-500/5"
                        />
                    </div>
                    <button
                        onClick={() => { setEditingNote(null); setIsFormOpen(true); }}
                        className="bg-secondary text-white px-12 py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] transition-all hover:bg-white hover:text-secondary rounded-none active:scale-95 group italic skew-x-[-12deg]"
                    >
                         <div className="skew-x-[12deg] flex items-center gap-4">
                            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                            <span>Crear Elemento</span>
                        </div>
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-72 glass-panel !bg-slate-950/40 rounded-none-[3rem] border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10 animate-in fade-in duration-700">
                    {filteredNotes.map((note) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={note.id}
                            className="glass-panel !bg-slate-950/40 p-10 rounded-none-[3rem] border border-white/5 hover:border-white/10 transition-all group relative flex flex-col h-80 overflow-hidden shadow-2xl backdrop-blur-3xl"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-white pointer-events-none group-hover:scale-110 transition-transform -rotate-12">
                                <FileText size={150} />
                            </div>

                            {/* Color Bar / Indicator */}
                            <div 
                                className="absolute left-0 top-0 w-1.5 h-full opacity-40 group-hover:opacity-100 transition-opacity" 
                                style={{ backgroundColor: note.color && note.color !== '#ffffff' ? note.color : '#ff6347' }}
                            />

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter line-clamp-2 italic leading-tight group-hover:text-secondary transition-colors">{note.title || "SIN TÍTULO"}</h3>
                                <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                    <button onClick={() => { setEditingNote(note); setIsFormOpen(true); }} className="p-3 bg-white/5 border border-white/10 rounded-none text-slate-400 hover:text-white transition-all shadow-2xl">
                                        <Save size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(note.id)} className="p-3 bg-white/5 border border-white/10 rounded-none text-slate-400 hover:text-red-500 transition-all shadow-2xl">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed overflow-hidden text-ellipsis flex-1 mb-8 italic uppercase tracking-tighter group-hover:text-slate-300 transition-colors">
                                {note.content}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-none bg-azure-500 shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] italic group-hover:text-white transition-colors">
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {note.pinned && (
                                    <div className="p-2 bg-secondary/10 border border-secondary/20 rounded-none text-secondary animate-pulse shadow-2xl shadow-secondary/20">
                                        <Pin size={12} />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {filteredNotes.length === 0 && (
                        <div className="col-span-full py-40 text-center border border-dashed border-white/5 rounded-none-[4rem] bg-white/[0.01]">
                            <div className="w-24 h-24 bg-slate-900 text-slate-800 rounded-none-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner">
                                <Search size={40} />
                            </div>
                            <p className="font-black text-slate-800 uppercase tracking-[0.8em] italic text-xs">Cámara de notas vacía</p>
                        </div>
                    )}
                </div>
            )}

            {/* Note Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[400] flex items-center justify-center p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" 
                            onClick={() => setIsFormOpen(false)} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="glass-panel !bg-slate-950/60 w-full max-w-2xl shadow-[0_0_150px_rgba(0,0,0,1)] border border-white/10 overflow-hidden rounded-none-[4rem] relative z-10 backdrop-blur-3xl p-14 border"
                        >
                            <header className="mb-12 flex items-center justify-between border-b border-white/5 pb-8">
                                <div className="flex items-center space-x-6">
                                    <div className="p-4 bg-secondary/10 border border-secondary/20 text-secondary rounded-none shadow-2xl">
                                        <StickyNote size={24} className="drop-shadow-[0_0_10px_rgba(255,99,71,0.5)]" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">
                                            {editingNote ? 'EDITAR <span className="text-secondary">Elemento</span>' : 'REDACTAR <span className="text-secondary">ACTIVO</span>'}
                                        </h2>
                                        <p className="text-[10px] font-black text-slate-500 mt-2 uppercase tracking-[0.4em] italic leading-none">Sistema de Gestión de Conocimiento</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsFormOpen(false)} className="p-5 bg-slate-900 border border-white/10 rounded-none text-slate-600 hover:text-white transition-all shadow-2xl">
                                    <X size={28} />
                                </button>
                            </header>
                            
                            <NoteForm
                                initialData={editingNote}
                                onSave={handleSave}
                                onClose={() => setIsFormOpen(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function NoteForm({ initialData, onClose, onSave }: any) {
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        title: initialData?.title || '',
        content: initialData?.content || '',
        color: initialData?.color || '#ff6347',
        pinned: initialData?.pinned || false
    })

    const colors = ['#ff6347', '#2dd4bf', '#a855f7', '#eab308', '#3b82f6', '#f472b6']

    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2 italic">Identificador del Elemento</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value.toUpperCase() })}
                    placeholder="TÍTULO ESTRATÉGICO..."
                    className="w-full bg-slate-950 border border-white/5 p-6 rounded-none-[2rem] text-[15px] font-black uppercase tracking-widest text-white shadow-inner focus:border-secondary transition-all outline-none italic placeholder:text-slate-900"
                />
            </div>
            
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] ml-2 italic">Cuerpo Estructurado</label>
                <textarea
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value.toUpperCase() })}
                    placeholder="VIERTE TUS PENSAMIENTOS AQUÍ..."
                    className="w-full bg-slate-950 border border-white/5 p-8 rounded-none-[2.5rem] text-[12px] font-black text-white shadow-inner focus:border-secondary transition-all h-64 outline-none resize-none uppercase tracking-widest leading-relaxed placeholder:text-slate-900 italic custom-scrollbar"
                />
            </div>

            <div className="flex flex-wrap items-center justify-between pt-10 border-t border-white/5 gap-8">
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] mr-4 italic">CHROMATIC_TAG:</span>
                    <div className="flex space-x-3 bg-slate-950 p-3 rounded-none border border-white/5 shadow-inner">
                        {colors.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setFormData({ ...formData, color: c })}
                                className={`w-8 h-8 rounded-none transition-all ${formData.color === c ? 'ring-4 ring-white/10 scale-110 shadow-2xl' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                                style={{ backgroundColor: c, boxShadow: formData.color === c ? `0 0 20px ${c}40` : 'none' }}
                            />
                        ))}
                    </div>
                </div>
                
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, pinned: !formData.pinned })}
                    className={`flex items-center gap-4 px-6 py-3 rounded-none border transition-all text-[10px] font-black uppercase tracking-[0.4em] italic shadow-2xl ${formData.pinned ? 'bg-secondary/10 border-secondary/30 text-secondary' : 'bg-slate-950 border-white/5 text-slate-600 hover:text-white'}`}
                >
                    {formData.pinned ? <Pin size={16} className="animate-pulse" /> : <PinOff size={16} />}
                    <span>{formData.pinned ? 'ANCLADO_CRÍTICO' : 'FIJAR_Elemento'}</span>
                </button>
            </div>

            <div className="flex items-center justify-end gap-8 pt-6">
                <button onClick={onClose} className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 hover:text-white transition-all italic">ABORTAR_CMD</button>
                <button
                    onClick={() => onSave(formData)}
                    className="bg-secondary text-white px-12 py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center shadow-[0_15px_40px_-5px_rgba(255,99,71,0.5)] transition-all hover:bg-white hover:text-secondary rounded-none active:scale-95 group italic skew-x-[-12deg]"
                >
                    <div className="skew-x-[12deg] flex items-center gap-4">
                        <Save size={20} className="group-hover:scale-110 transition-transform" />
                        <span>Sincronizar Bloc</span>
                    </div>
                </button>
            </div>
        </div>
    )
}


