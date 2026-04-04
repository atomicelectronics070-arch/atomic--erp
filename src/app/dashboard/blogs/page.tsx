"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, Edit, Trash2, Shield, Eye, FileText, Check, X, Image as ImageIcon } from "lucide-react"

export default function BlogsDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<"mis_blogs" | "permisos">("mis_blogs")
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGEMENT"
  const canPublish = isAdmin || session?.user?.canCreateBlogs

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
    const res = await fetch("/api/blogs")
    if (res.ok) {
        const data = await res.json()
        setBlogs(data)
    }
    setLoading(false)
  }

  const fetchUsers = async () => {
    if (!isAdmin) return
    const res = await fetch("/api/admin/blog-permissions")
    if (res.ok) {
        const data = await res.json()
        setUsers(data)
    }
  }

  useEffect(() => {
    fetchBlogs()
    if (isAdmin) fetchUsers()
  }, [isAdmin])

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const method = editingBlog ? "PUT" : "POST"
    const body: any = { title, excerpt, content, imageUrl, published }
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
    if (!confirm("¿Está seguro de eliminar este blog?")) return
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
        <div className="flex flex-col items-center justify-center p-20 text-center">
            <Shield size={48} className="text-orange-500 mb-6" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-800 mb-2">Acceso Denegado</h2>
            <p className="text-neutral-500 font-medium">No tienes permisos para redactar artículos en el blog corporativo. Contacta a administración.</p>
        </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter text-neutral-900">Corporate Blog</h1>
              <p className="text-xs font-bold text-neutral-400 mt-1 uppercase tracking-widest">Gestión de Publicaciones</p>
          </div>
          {isAdmin && (
              <div className="flex space-x-2">
                  <button 
                      onClick={() => setActiveTab("mis_blogs")}
                      className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border transition-colors ${activeTab === 'mis_blogs' ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'}`}
                  >
                      Publicaciones
                  </button>
                  <button 
                      onClick={() => setActiveTab("permisos")}
                      className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border transition-colors ${activeTab === 'permisos' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-neutral-500 border-neutral-200 hover:border-orange-600 hover:text-orange-600'}`}
                  >
                      Permisos
                  </button>
              </div>
          )}
      </div>

      {activeTab === "mis_blogs" && (
          <div className="space-y-6">
            <div className="flex justify-end">
                <button 
                    onClick={() => openModal()}
                    className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-neutral-900 transition-colors shadow-lg shadow-orange-600/20"
                >
                    <Plus size={16} />
                    <span>Redactar Artículo</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.length === 0 && !loading && (
                    <div className="col-span-full py-20 text-center bg-white border border-dashed border-neutral-300">
                        <p className="text-neutral-500 font-medium">No hay blogs creados aún.</p>
                    </div>
                )}
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white border border-neutral-200 overflow-hidden flex flex-col group hover:shadow-xl hover:border-orange-500/50 transition-all">
                        {blog.imageUrl ? (
                            <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover border-b border-neutral-100 group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-48 bg-neutral-50 flex items-center justify-center border-b border-neutral-100">
                                <ImageIcon size={32} className="text-neutral-300" />
                            </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col relative bg-white z-10">
                            <div className="flex items-center space-x-2 mb-3">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 ${blog.published ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {blog.published ? 'Publicado' : 'Borrador'}
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-neutral-900 line-clamp-2 leading-tight mb-2">{blog.title}</h3>
                            <p className="text-xs text-neutral-500 line-clamp-3 mb-6 flex-1">{blog.excerpt || 'Sin extracto'}</p>
                            
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                                <span className="text-[10px] font-black text-neutral-400 uppercase">Por {blog.author?.name || 'Usuario'}</span>
                                <div className="flex space-x-2">
                                    <button onClick={() => openModal(blog)} className="p-2 text-neutral-400 hover:text-blue-600 transition-colors bg-neutral-50 hover:bg-blue-50">
                                        <Edit size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(blog.id)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors bg-neutral-50 hover:bg-red-50">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
      )}

      {activeTab === "permisos" && isAdmin && (
          <div className="bg-white border border-neutral-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Usuario</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Rol Sistema</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Permiso de Escritura</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                            <td className="p-4">
                                <div className="font-bold text-neutral-900 text-sm">{u.name || 'Sin Nombre'}</div>
                                <div className="text-xs text-neutral-500">{u.email}</div>
                            </td>
                            <td className="p-4 text-xs font-bold text-neutral-600">{u.role}</td>
                            <td className="p-4">
                                <button 
                                    onClick={() => handleTogglePermission(u.id, u.canCreateBlogs)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${u.canCreateBlogs ? 'bg-orange-600' : 'bg-neutral-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${u.canCreateBlogs ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-5 flex items-center justify-between z-10">
                    <h2 className="text-lg font-black uppercase tracking-tight text-neutral-900">
                        {editingBlog ? 'Editar Artículo' : 'Nuevo Artículo'}
                    </h2>
                    <button onClick={closeModal} className="text-neutral-400 hover:text-red-500">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSaveBlog} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Título</label>
                            <input 
                                required 
                                type="text"
                                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">URL Imagen Portada</label>
                            <input 
                                type="text"
                                className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Extracto (Resumen corto)</label>
                        <textarea 
                            className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none h-20"
                            value={excerpt}
                            onChange={e => setExcerpt(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center justify-between">
                            <span>Contenido del Artículo</span>
                            <span className="text-[9px] text-neutral-400 font-medium normal-case tracking-normal">Soporta HTML/Cuerpo estructurado</span>
                        </label>
                        <textarea 
                            required
                            className="w-full bg-neutral-50 border border-neutral-200 px-4 py-4 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none font-mono h-96"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="<h1>Blog Title</h1><p>Contenido principal...</p>"
                        />
                    </div>

                    <div className="flex items-center space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setPublished(!published)}
                            className={`flex items-center space-x-2 px-4 py-2 border text-xs font-black uppercase tracking-widest transition-colors ${published ? 'bg-green-600 text-white border-green-600' : 'bg-neutral-100 text-neutral-500 border-neutral-200'}`}
                        >
                            <Check size={14} className={published ? 'opacity-100' : 'opacity-0'} />
                            <span>{published ? 'Publicado (Público)' : 'Borrador (Oculto)'}</span>
                        </button>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-neutral-100 space-x-4">
                        <button type="button" onClick={closeModal} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-orange-600 text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-neutral-900 transition-colors shadow-lg shadow-orange-600/20">
                            Guardar Artículo
                        </button>
                    </div>
                </form>
            </div>
          </div>
      )}
    </div>
  )
}
