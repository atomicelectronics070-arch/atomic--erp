"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, Edit, Trash2, Shield, Eye, FileText, 
    Check, X, Image as ImageIcon, BookOpen, 
    Sparkles, Key, Settings, UserCheck, Layout,
    ExternalLink, Trash, ShieldCheck
} from "lucide-react"

export default function BlogsDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<"mis_blogs" | "permisos">("mis_blogs")
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGEMENT"
  const canPublish = isAdmin || (session?.user as any)?.canCreateBlogs

  // Blogs State
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Users State (Admin only)
  const [users, setUsers] = useState<any[]>([])

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<any>(null)
  
  // Form State
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [published, setPublished] = useState(false)

  const fetchBlogs = async () => {
    setLoading(true)
    try {
        const res = await fetch("/api/blogs")
        if (res.ok) {
            const data = await res.json()
            setBlogs(data)
        }
    } catch (e) {
        console.error(e)
    } finally {
        setLoading(false)
    }
  }

  const fetchUsers = async () => {
    if (!isAdmin) return
    try {
        const res = await fetch("/api/admin/blog-permissions")
        if (res.ok) {
            const data = await res.json()
            setUsers(data)
        }
    } catch (e) {
        console.error(e)
    }
  }

  useEffect(() => {
    fetchBlogs()
    if (isAdmin) fetchUsers()
  }, [isAdmin])

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const method = editingBlog ? "PUT" : "POST"
    const body: any = { title: title.toUpperCase(), excerpt, content, imageUrl, published }
    if (editingBlog) body.id = editingBlog.id

    const res = await fetch("/api/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })

    if (res.ok) {
        closeModal()
        fetchBlogs()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Confirmación Crítica: ¿Eliminar este artículo permanentemente?")) return
    const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" })
    if (res.ok) fetchBlogs()
  }

  const handleTogglePermission = async (userId: string, currentVal: boolean) => {
    const res = await fetch("/api/admin/blog-permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, canCreateBlogs: !currentVal })
    })
    if (res.ok) fetchUsers()
  }

  const openModal = (blog: any = null) => {
    if (blog) {
        setEditingBlog(blog)
        setTitle(blog.title)
        setExcerpt(blog.excerpt || "")
        setContent(blog.content)
        setImageUrl(blog.imageUrl || "")
        setPublished(blog.published)
    } else {
        setEditingBlog(null)
        setTitle("")
        setExcerpt("")
        setContent("")
        setImageUrl("")
        setPublished(false)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBlog(null)
  }

  if (!isAdmin && !canPublish) {
    return (
        <div className="flex flex-col items-center justify-center p-40 text-center animate-in zoom-in duration-700">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-10 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                <Shield size={48} className="text-red-500" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-4 italic">ACCESO RESTRINGIDO</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] max-w-sm italic">Privilegios insuficientes para el subsistema de redacción corporativa. Contacte al nodo de administración.</p>
        </div>
    )
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 relative">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]" />
          <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-azure-500/5 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-16 relative z-10">
          <div>
              <div className="flex items-center space-x-4 mb-4 text-secondary">
                  <BookOpen size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                  <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Red de Contenidos Estratégicos</span>
              </div>
              <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none italic">CORPORATE <span className="text-secondary underline decoration-secondary/30 underline-offset-8">BLOG</span></h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] mt-5 italic leading-relaxed max-w-xl">
                  Gestión y auditoría de publicaciones tácticas para el ecosistema digital Atomic Industries.
              </p>
          </div>
          {isAdmin && (
              <div className="flex glass-panel !bg-slate-950/40 p-2 rounded-2xl border-white/5 shadow-inner ring-1 ring-white/5 backdrop-blur-3xl">
                  <button 
                      onClick={() => setActiveTab("mis_blogs")}
                      className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all rounded-xl italic skew-x-[-12deg] ${activeTab === 'mis_blogs' ? 'bg-secondary text-white shadow-2xl' : 'text-slate-600 hover:text-white'}`}
                  >
                      <div className="skew-x-[12deg] flex items-center gap-3"><Layout size={14} /> PUBLICACIONES</div>
                  </button>
                  <button 
                      onClick={() => setActiveTab("permisos")}
                      className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all rounded-xl italic skew-x-[-12deg] ${activeTab === 'permisos' ? 'bg-azure-500 text-white shadow-2xl' : 'text-slate-600 hover:text-white'}`}
                  >
                      <div className="skew-x-[12deg] flex items-center gap-3"><Key size={14} /> PERMISOS</div>
                  </button>
              </div>
          )}
      </div>

      {activeTab === "mis_blogs" && (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 relative z-10">
            <div className="flex justify-between items-center bg-white/[0.01] p-8 border border-white/5 rounded-[2.5rem] backdrop-blur-xl">
                <div>
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Catálogo de Activos Narrativos</h3>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="flex items-center space-x-6 bg-secondary text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-secondary transition-all shadow-[0_20px_50px_-10px_rgba(255,99,71,0.5)] rounded-2xl active:scale-95 italic skew-x-[-12deg] group"
                >
                    <div className="skew-x-[12deg] flex items-center gap-4">
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        <span>Redactar Nodo</span>
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {blogs.length === 0 && !loading && (
                    <div className="col-span-full py-48 text-center glass-panel border border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-900/60 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                            <ImageIcon size={32} className="text-slate-800" />
                        </div>
                        <p className="text-slate-700 font-black uppercase tracking-[0.6em] text-[11px] italic">Canal desierto: Sin publicaciones detectadas.</p>
                    </div>
                )}
                {blogs.map(blog => (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        key={blog.id} 
                        className="glass-panel border-white/5 overflow-hidden flex flex-col group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] hover:border-secondary/30 transition-all rounded-[3rem] backdrop-blur-3xl relative"
                    >
                        {blog.imageUrl ? (
                            <div className="relative h-64 overflow-hidden">
                                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
                            </div>
                        ) : (
                            <div className="w-full h-64 bg-slate-900/60 flex items-center justify-center border-b border-white/5 shadow-inner">
                                <ImageIcon size={48} className="text-slate-800 animate-pulse" />
                            </div>
                        )}
                        <div className="p-10 flex-1 flex flex-col relative z-20 bg-slate-950/20">
                            <div className="flex items-center space-x-3 mb-6">
                                <span className={`text-[9px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full border italic shadow-2xl ${blog.published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-secondary/10 text-secondary border-secondary/20'}`}>
                                    {blog.published ? 'CONSOLIDADO' : 'BORRADOR'}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-white line-clamp-2 leading-tight mb-4 italic group-hover:text-secondary transition-colors uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{blog.title}</h3>
                            <p className="text-[11px] text-slate-500 font-bold line-clamp-3 mb-10 flex-1 italic leading-relaxed uppercase tracking-tight opacity-60 group-hover:opacity-100 transition-opacity">{blog.excerpt || 'SIN EXTRACTO DISPONIBLE'}</p>
                            
                            <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-500 italic">
                                        {blog.author?.name?.[0] || 'U'}
                                    </div>
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">{blog.author?.name || 'OPERADOR'}</span>
                                </div>
                                <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0">
                                    <button onClick={() => openModal(blog)} className="p-4 glass-panel !bg-slate-900 text-slate-600 hover:text-azure-400 hover:rotate-6 transition-all rounded-2xl border-white/5">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(blog.id)} className="p-4 glass-panel !bg-slate-900 text-slate-600 hover:text-red-500 hover:-rotate-6 transition-all rounded-2xl border-white/5">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
          </div>
      )}

      {activeTab === "permisos" && isAdmin && (
          <div className="glass-panel border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden rounded-[4rem] backdrop-blur-3xl relative z-10">
            <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                 <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] italic">Auditoría de Privilegios de Redacción</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.6em] text-slate-600 italic">IDENTIDAD_NODO</th>
                            <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.6em] text-slate-600 italic">RANGO_SISTEMA</th>
                            <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.6em] text-slate-600 italic text-center">PRIVILEGIO_BLOG</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-12 py-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center font-black text-slate-700 italic group-hover:border-azure-500/40 transition-colors">
                                            {u.name?.[0] || 'N'}
                                        </div>
                                        <div>
                                            <div className="font-black text-white text-base uppercase tracking-tighter italic group-hover:text-azure-400 transition-colors">{u.name || 'ANÓNIMO'}</div>
                                            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-12 py-8">
                                    <span className="text-[10px] font-black text-slate-500 uppercase border border-white/5 px-4 py-1.5 rounded-xl bg-slate-900 italic shadow-inner">
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-12 py-8">
                                    <div className="flex items-center justify-center">
                                        <button 
                                            onClick={() => handleTogglePermission(u.id, u.canCreateBlogs)}
                                            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-500 shadow-2xl ${u.canCreateBlogs ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-slate-900 border border-white/5'}`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-full transition-all duration-500 shadow-inner ${u.canCreateBlogs ? 'translate-x-9 bg-emerald-400' : 'translate-x-2 bg-slate-700'}`} />
                                            <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                                                 <Check size={10} className={`${u.canCreateBlogs ? 'opacity-100' : 'opacity-0'} text-emerald-400 transition-opacity`} />
                                                 <X size={10} className={`${!u.canCreateBlogs ? 'opacity-100' : 'opacity-0'} text-slate-700 transition-opacity`} />
                                            </div>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
          {isModalOpen && (
              <div className="fixed inset-0 z-[400] flex items-center justify-center p-8">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" 
                    onClick={closeModal} 
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="glass-panel !bg-slate-950/60 w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-[0_0_150px_rgba(0,0,0,1)] rounded-[4rem] relative z-10 backdrop-blur-3xl p-14 custom-scrollbar"
                >
                    <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-10">
                        <div className="flex items-center gap-8">
                            <div className="p-5 bg-secondary text-white rounded-2xl shadow-2xl shadow-secondary/30">
                                <Plus size={32} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic">
                                    {editingBlog ? 'EDITAR <span className="text-secondary">ACTIVO</span>' : 'REDACTAR <span className="text-secondary">NODO</span>'}
                                </h2>
                                <p className="text-[10px] font-black text-slate-500 mt-3 uppercase tracking-[0.6em] italic">Subsistema de Publicación Corporativa</p>
                            </div>
                        </div>
                        <button onClick={closeModal} className="p-5 bg-slate-900 border border-white/10 rounded-2xl text-slate-600 hover:text-white hover:rotate-90 transition-all duration-500 shadow-2xl">
                            <X size={32} />
                        </button>
                    </div>

                    <form onSubmit={handleSaveBlog} className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 ml-2 italic">Identificador Maestro / Título</label>
                                <input 
                                    required 
                                    type="text"
                                    className="w-full bg-slate-950/60 border border-white/5 p-6 rounded-[2rem] text-[15px] font-black uppercase tracking-widest text-white shadow-inner focus:border-secondary transition-all outline-none italic placeholder:text-slate-900"
                                    value={title}
                                    onChange={e => setTitle(e.target.value.toUpperCase())}
                                    placeholder="ESPECIFICAR TÍTULO DEL CONTENIDO..."
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 ml-2 italic">Punto de Origen Multimedia (URL)</label>
                                <input 
                                    type="text"
                                    className="w-full bg-slate-950/60 border border-white/5 p-6 rounded-[2rem] text-[12px] font-black text-azure-400 shadow-inner focus:border-azure-500 transition-all outline-none italic placeholder:text-slate-900"
                                    value={imageUrl}
                                    onChange={e => setImageUrl(e.target.value)}
                                    placeholder="https://cdn.atomic.com/node/..."
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 ml-2 italic">Extracto Ejecutivo (Resumen Corporativo)</label>
                            <textarea 
                                className="w-full bg-slate-950/60 border border-white/5 p-8 rounded-[2.5rem] text-[12px] font-black text-white shadow-inner focus:border-secondary transition-all outline-none resize-none h-32 italic uppercase tracking-widest leading-relaxed placeholder:text-slate-900"
                                value={excerpt}
                                onChange={e => setExcerpt(e.target.value)}
                                placeholder="BREVE SÍNTESIS DEL IMPACTO DEL ARTÍCULO..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 ml-2 italic flex items-center justify-between pr-4">
                                <span>Cuerpo Estructurado del Activo</span>
                                <span className="text-[9px] text-slate-700 font-black normal-case tracking-[0.4em] italic uppercase">FORMATO_NATIVO: HTML_SUPPORTED</span>
                            </label>
                            <textarea 
                                required
                                className="w-full bg-slate-950/40 border border-white/5 p-10 rounded-[3rem] text-[13px] font-black text-slate-300 shadow-inner focus:border-secondary transition-all outline-none font-mono h-[500px] leading-loose custom-scrollbar"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="<h1>Title</h1><p>Operational Data...</p>"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-8 pt-10 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => setPublished(!published)}
                                className={`flex items-center space-x-6 px-10 py-5 border rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all italic skew-x-[-12deg] shadow-2xl ${published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-900 text-slate-600 border-white/5'}`}
                            >
                                <div className="skew-x-[12deg] flex items-center gap-4">
                                    <Check size={18} className={published ? 'opacity-100 scale-100' : 'opacity-0 scale-50 transition-all'} />
                                    <span>{published ? 'ESTADO: CONSOLIDADO (PÚBLICO)' : 'ESTADO: BORRADOR (NODO_INTERNO)'}</span>
                                </div>
                            </button>
                            
                             <div className="ms-auto flex items-center gap-8">
                                <button type="button" onClick={closeModal} className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 hover:text-white transition-all italic">
                                    CANCELAR_AUD
                                </button>
                                <button type="submit" className="bg-secondary text-white px-14 py-6 text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_-10px_rgba(255,99,71,0.6)] hover:bg-white hover:text-secondary rounded-[2rem] active:scale-95 italic skew-x-[-12deg] group transition-all">
                                    <div className="skew-x-[12deg] flex items-center gap-6">
                                        <ShieldCheck size={24} className="group-hover/btn:scale-110 transition-transform" />
                                        <span>AUTORIZAR Y PUBLICAR</span>
                                    </div>
                                </button>
                             </div>
                        </div>
                    </form>
                </motion.div>
              </div>
          )}
      </AnimatePresence>
    </div>
  )
}
