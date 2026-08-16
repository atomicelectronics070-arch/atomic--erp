"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, Edit, Trash2, Shield, Eye, FileText, 
    Check, X, Image as ImageIcon, BookOpen, 
    Settings, Layout, Layers, Key,
    Video, Facebook, Instagram, Youtube,
    Globe, User as UserIcon, Share2, Search, Sparkles, Laptop, Building2
} from "lucide-react"

import MultiSocialPublisher from "@/components/dashboard/MultiSocialPublisher"
import Link from "next/link"

export default function BlogsDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<"mis_blogs" | "laptops" | "bloques" | "videoporteros" | "permisos" | "social_settings" | "entornos">("mis_blogs")
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGEMENT"
  const canPublish = isAdmin || (session?.user as any)?.canCreateBlogs

  // Blogs State
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Environments & Accounts State
  const [environments, setEnvironments] = useState<any[]>([])
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false)
  const [envName, setEnvName] = useState("")
  const [envDesc, setEnvDesc] = useState("")
  const [isAccModalOpen, setIsAccModalOpen] = useState(false)
  const [accName, setAccName] = useState("")
  const [accPlatform, setAccPlatform] = useState("facebook")
  const [targetEnvId, setTargetEnvId] = useState("")

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
  const [contentType, setContentType] = useState<"article" | "video">("article")
  const [videoUrl, setVideoUrl] = useState("")
  
  // Matrix Selection State
  const [selectedEnvId, setSelectedEnvId] = useState<string>("")
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([])
  
  // Social Targets (Legacy/Quick)
  const [socialTargets, setSocialTargets] = useState({
      facebook: false,
      instagram: false,
      youtube: false,
      tiktok: false
  })

  // Social Settings (Admin only)
  const [socialSettings, setSocialSettings] = useState({
      metaPageId: "",
      metaPageToken: "",
      metaInstagramActId: "",
      youtubeChannelId: "",
      youtubeRefreshToken: "",
      tiktokAccessToken: "",
      tiktokOpenId: ""
  })
  const [savingSettings, setSavingSettings] = useState(false)

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

  const fetchEnvironments = async () => {
      try {
          const res = await fetch("/api/environments")
          if (res.ok) {
              const data = await res.json()
              setEnvironments(data)
          }
      } catch (e) {
          console.error(e)
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

  const fetchSocialSettings = async () => {
      if (!isAdmin) return
      try {
          const res = await fetch("/api/social-settings")
          if (res.ok) {
              const data = await res.json()
              if (data) {
                  setSocialSettings(data)
              }
          }
      } catch (e) {
          console.error(e)
      }
  }

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const targets = Object.keys(socialTargets).filter(k => socialTargets[k as keyof typeof socialTargets])
    
    const method = editingBlog ? "PUT" : "POST"
    const body: any = { 
        title, 
        excerpt, 
        content, 
        imageUrl, 
        published,
        contentType,
        videoUrl: contentType === 'video' ? videoUrl : null,
        socialTargets: targets.length > 0 ? targets : null,
        environmentId: selectedEnvId || null,
        targetAccounts: selectedAccountIds.length > 0 ? JSON.stringify(selectedAccountIds) : null
    }
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
    if (!confirm("⚠️ ¿Eliminar este artículo permanentemente?")) return
    const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" })
    if (res.ok) fetchBlogs()
  }

  const handleCreateEnv = async () => {
      if (!envName) return
      const res = await fetch("/api/environments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: envName, description: envDesc })
      })
      if (res.ok) {
          setEnvName(""); setEnvDesc(""); setIsEnvModalOpen(false); fetchEnvironments()
      }
  }

  const handleDeleteEnv = async (id: string) => {
      if (!confirm("¿Eliminar entorno y todas sus vinculaciones?")) return
      await fetch(`/api/environments?id=${id}`, { method: "DELETE" })
      fetchEnvironments()
  }

  const handleCreateAcc = async () => {
      if (!accName || !targetEnvId) return
      const res = await fetch("/api/social-accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: accName, platform: accPlatform, environmentId: targetEnvId })
      })
      if (res.ok) {
          setAccName(""); setIsAccModalOpen(false); fetchEnvironments()
      }
  }

  const handleDeleteAcc = async (id: string) => {
      if (!confirm("¿Eliminar esta cuenta?")) return
      await fetch(`/api/social-accounts?id=${id}`, { method: "DELETE" })
      fetchEnvironments()
  }

  const handleTogglePermission = async (userId: string, currentVal: boolean) => {
    const res = await fetch("/api/admin/blog-permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, canCreateBlogs: !currentVal })
    })
    if (res.ok) fetchUsers()
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
      e.preventDefault()
      setSavingSettings(true)
      try {
          const res = await fetch("/api/social-settings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(socialSettings)
          })
          if (res.ok) {
              alert("Configuración de redes sociales actualizada.")
              fetchSocialSettings()
          }
      } catch (err) {
          console.error(err)
      } finally {
          setSavingSettings(false)
      }
  }

  const openModal = (blog: any = null) => {
    if (blog) {
        setEditingBlog(blog)
        setTitle(blog.title)
        setExcerpt(blog.excerpt || "")
        setContent(blog.content || "")
        setImageUrl(blog.imageUrl || "")
        setPublished(blog.published)
        setContentType(blog.contentType || "article")
        setVideoUrl(blog.videoUrl || "")
        
        let parsedTargets = []
        try { parsedTargets = JSON.parse(blog.socialTargets || "[]") } catch(e) {}
        
        setSocialTargets({
            facebook: parsedTargets.includes("facebook"),
            instagram: parsedTargets.includes("instagram"),
            youtube: parsedTargets.includes("youtube"),
            tiktok: parsedTargets.includes("tiktok")
        })

        setSelectedEnvId(blog.environmentId || "")
        let parsedAccs = []
        try { parsedAccs = JSON.parse(blog.targetAccounts || "[]") } catch(e) {}
        setSelectedAccountIds(parsedAccs)

    } else {
        setEditingBlog(null)
        setTitle("")
        setExcerpt("")
        setContent("")
        setImageUrl("")
        setPublished(false)
        setContentType("article")
        setVideoUrl("")
        setSocialTargets({ facebook: false, instagram: false, youtube: false, tiktok: false })
        setSelectedEnvId("")
        setSelectedAccountIds([])
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBlog(null)
  }

  useEffect(() => {
    fetchBlogs()
    fetchEnvironments()
    if (isAdmin) {
        fetchUsers()
        fetchSocialSettings()
    }
  }, [isAdmin])

  if (!isAdmin && !canPublish) {
    return (
        <div className="flex flex-col items-center justify-center p-20 text-center text-slate-500">
            <Shield size={48} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-black text-white tracking-tight">Acceso Restringido</h2>
            <p className="mt-2 font-medium">No cuentas con privilegios para la creación de contenidos.</p>
        </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 text-white">
      
      {/* 1. PUBLICADOR MULTI-RED SOCIAL (TIKTOK, YOUTUBE, INSTAGRAM, FACEBOOK) */}
      <MultiSocialPublisher />

      {/* 2. GESTIÓN UNIFICADA DE BLOGS & NEWSLETTERS */}
      <div className="bg-neutral-900/90 border border-white/10 rounded-3xl p-6 lg:p-8 space-y-6">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">
              <Sparkles size={12} />
              <span>Gestión Unificada v4.0</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <BookOpen className="text-indigo-400" />
              <span>Gestión de Blogs, Newsletters & Videos</span>
            </h2>
            <p className="text-neutral-400 text-xs font-light mt-1">
              Administra todas las publicaciones públicas, newsletters empresariales y entradas de video.
            </p>
          </div>

          {/* Sub-Tabs Selector */}
          <div className="flex flex-wrap bg-black/60 p-1.5 rounded-2xl border border-white/10 gap-1">
            <button 
                onClick={() => setActiveTab("mis_blogs")}
                className={`px-4 py-2.5 text-xs font-bold transition-all rounded-xl flex items-center gap-2 ${activeTab === 'mis_blogs' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
            >
                <FileText size={14} /> Todos ({blogs.length})
            </button>
            <button 
                onClick={() => setActiveTab("laptops")}
                className={`px-4 py-2.5 text-xs font-bold transition-all rounded-xl flex items-center gap-2 ${activeTab === 'laptops' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
            >
                <Laptop size={14} /> Blog Laptops
            </button>
            <button 
                onClick={() => setActiveTab("bloques")}
                className={`px-4 py-2.5 text-xs font-bold transition-all rounded-xl flex items-center gap-2 ${activeTab === 'bloques' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
            >
                <Building2 size={14} /> Bloques
            </button>
            <button 
                onClick={() => setActiveTab("videoporteros")}
                className={`px-4 py-2.5 text-xs font-bold transition-all rounded-xl flex items-center gap-2 ${activeTab === 'videoporteros' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
            >
                <Video size={14} /> Videoporteros
            </button>
            {isAdmin && (
              <>
                <button 
                    onClick={() => setActiveTab("entornos")}
                    className={`px-4 py-2.5 text-xs font-bold transition-all rounded-xl flex items-center gap-2 ${activeTab === 'entornos' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                >
                    <Layers size={14} /> Entornos
                </button>
                <button 
                    onClick={() => setActiveTab("permisos")}
                    className={`px-4 py-2.5 text-xs font-bold transition-all rounded-xl flex items-center gap-2 ${activeTab === 'permisos' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                >
                    <Key size={14} /> Permisos
                </button>
                <button 
                    onClick={() => setActiveTab("social_settings")}
                    className={`px-4 py-2.5 text-xs font-bold transition-all rounded-xl flex items-center gap-2 ${activeTab === 'social_settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
                >
                    <Settings size={14} /> APIs
                </button>
              </>
            )}
          </div>
        </div>

        {/* TAB 1: TODOS LOS BLOGS & NEWSLETTERS */}
        {activeTab === "mis_blogs" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
                    Artículos & Newsletters Registrados ({blogs.length})
                  </h3>
                  <button 
                      onClick={() => openModal()}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg"
                  >
                      <Plus size={16} /> Crear Nuevo Blog / Newsletter
                  </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                  {blogs.length === 0 && !loading && (
                      <div className="py-16 text-center bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-3">
                          <FileText size={32} className="text-neutral-500" />
                          <p className="text-neutral-400 font-bold uppercase tracking-wider text-xs">No hay contenidos publicados aún.</p>
                      </div>
                  )}
                  {blogs.map(blog => (
                      <div key={blog.id} className="bg-black/40 border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-indigo-500/50 transition-all group">
                          <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 flex items-center justify-center">
                              {blog.contentType === 'video' ? (
                                  <Video size={24} className="text-pink-400" />
                              ) : blog.imageUrl ? (
                                  <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                              ) : (
                                  <ImageIcon size={24} className="text-neutral-500" />
                              )}
                          </div>

                          <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                              <div className="max-w-xl space-y-1">
                                  <div className="flex items-center gap-3">
                                      <h3 className="text-base font-black text-white truncate">{blog.title}</h3>
                                      <span className={`px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md border ${
                                        blog.published 
                                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' 
                                          : 'text-neutral-400 bg-neutral-800 border-white/10'
                                      }`}>
                                          {blog.published ? 'PUBLICADO' : 'BORRADOR'}
                                      </span>
                                  </div>
                                  <p className="text-xs text-neutral-400 line-clamp-1">{blog.excerpt || 'Sin extracto...'}</p>
                              </div>

                              <div className="flex items-center gap-6">
                                  <div className="text-right hidden sm:block">
                                      <p className="text-[9px] font-mono text-neutral-500 uppercase">Autor</p>
                                      <p className="text-xs font-bold text-white">{blog.author?.name || 'Coordinación'}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <button onClick={() => openModal(blog)} className="p-2 text-neutral-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-colors">
                                          <Edit size={16} />
                                      </button>
                                      <button onClick={() => handleDelete(blog.id)} className="p-2 text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors">
                                          <Trash2 size={16} />
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
        )}

        {/* TAB 2: CATÁLOGO DE LAPTOPS */}
        {activeTab === "laptops" && (
          <div className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Laptop className="text-blue-400" size={18} /> Blog Catálogo de Laptops (54 Modelos)
                </h3>
                <p className="text-xs text-neutral-400 mt-1">Colección curada de equipos portátiles con ficha técnica y galerías HD.</p>
              </div>
              <Link href="/web/laptops-blog" target="_blank" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all">
                Ver Blog Público ↗
              </Link>
            </div>
          </div>
        )}

        {/* TAB 3: MÁQUINAS DE BLOQUES */}
        {activeTab === "bloques" && (
          <div className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Building2 className="text-amber-400" size={18} /> Landing Industrial Máquinas de Bloques
                </h3>
                <p className="text-xs text-neutral-400 mt-1">Guía completa de maquinaria pesada, cálculo de ROI y modelos de bloqueadoras.</p>
              </div>
              <Link href="/web/blogs/guia-maquinas-de-bloques" target="_blank" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all">
                Ver Landing Industrial ↗
              </Link>
            </div>
          </div>
        )}

        {/* TAB 4: VIDEOPORTEROS & YOUTUBE */}
        {activeTab === "videoporteros" && (
          <div className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Video className="text-pink-400" size={18} /> Videoporteros & Contenidos YouTube
                </h3>
                <p className="text-xs text-neutral-400 mt-1">Demostraciones en video de kits de videoporteros IP y sistemas de seguridad.</p>
              </div>
              <button onClick={() => openModal()} className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition-all">
                + Añadir Video Blog
              </button>
            </div>
          </div>
        )}

        {/* ADMIN TABS: ENTORNOS, PERMISOS, APIS */}
        {activeTab === "entornos" && isAdmin && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">Entornos de Distribución</h3>
                    <button onClick={() => setIsEnvModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-indigo-500">
                      <Plus size={16} /> Nuevo Entorno
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {environments.map(env => (
                        <div key={env.id} className="bg-black/40 border border-white/10 p-5 rounded-2xl relative space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-base font-black text-white">{env.name}</h4>
                                    <p className="text-xs text-neutral-400">{env.description || 'Sin descripción'}</p>
                                </div>
                                <button onClick={() => handleDeleteEnv(env.id)} className="text-neutral-500 hover:text-red-400"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === "permisos" && isAdmin && (
            <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
               <div className="p-4 border-b border-white/10 text-xs font-mono font-bold text-neutral-400 uppercase">
                  Privilegios de Redacción
               </div>
               <table className="w-full text-left">
                   <thead>
                       <tr className="border-b border-white/10 text-[10px] font-mono uppercase text-neutral-400">
                           <th className="px-6 py-3">Usuario</th>
                           <th className="px-6 py-3">Rol</th>
                           <th className="px-6 py-3 text-center">Publicar Blogs</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 text-xs font-medium">
                       {users.map(u => (
                           <tr key={u.id}>
                               <td className="px-6 py-4">{u.name || u.email}</td>
                               <td className="px-6 py-4"><span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md font-mono text-[10px]">{u.role}</span></td>
                               <td className="px-6 py-4 text-center">
                                   <button onClick={() => handleTogglePermission(u.id, u.canCreateBlogs)} className={`px-3 py-1 rounded-full text-[10px] font-bold ${u.canCreateBlogs ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                       {u.canCreateBlogs ? 'PERMITIDO' : 'BLOQUEADO'}
                                   </button>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
            </div>
        )}

        {activeTab === "social_settings" && isAdmin && (
            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl space-y-6">
                <h3 className="text-base font-black text-white flex items-center gap-2"><Settings size={18} /> API Keys de Redes Sociales</h3>
                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
                    <div>
                        <label className="text-[10px] font-mono uppercase font-bold text-neutral-400 block mb-1">Facebook Page ID</label>
                        <input type="text" className="w-full bg-neutral-900 border border-white/10 p-3 rounded-xl text-xs" value={socialSettings.metaPageId || ''} onChange={e => setSocialSettings({...socialSettings, metaPageId: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-mono uppercase font-bold text-neutral-400 block mb-1">Meta Access Token</label>
                        <input type="password" className="w-full bg-neutral-900 border border-white/10 p-3 rounded-xl text-xs" value={socialSettings.metaPageToken || ''} onChange={e => setSocialSettings({...socialSettings, metaPageToken: e.target.value})} />
                    </div>
                    <button type="submit" disabled={savingSettings} className="px-6 py-3 bg-indigo-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-indigo-500">
                        {savingSettings ? 'Guardando...' : 'Guardar Credenciales'}
                    </button>
                </form>
            </div>
        )}

      </div>

      {/* MODAL CREAR/EDITAR BLOG */}
      <AnimatePresence>
          {isModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-neutral-900 border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 lg:p-8 rounded-3xl relative shadow-2xl space-y-6"
                >
                    <button onClick={closeModal} className="absolute top-6 right-6 text-neutral-400 hover:text-white"><X size={18} /></button>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{editingBlog ? 'Editar Publicación' : 'Crear Nueva Publicación'}</h3>

                    <form onSubmit={handleSaveBlog} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-mono uppercase font-bold text-neutral-400 block mb-1">Título del Blog / Newsletter</label>
                            <input 
                                type="text" required 
                                value={title} onChange={e => setTitle(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded-xl outline-none focus:border-indigo-500"
                                placeholder="Ej: Nueva tecnología de seguridad IP..."
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono uppercase font-bold text-neutral-400 block mb-1">Resumen Corto (Newsletter)</label>
                            <textarea 
                                value={excerpt} onChange={e => setExcerpt(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 p-3 text-xs text-white rounded-xl outline-none focus:border-indigo-500 resize-none"
                                rows={2} placeholder="Breve introducción para envíos por mail..."
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-mono uppercase font-bold text-neutral-400 block mb-1">Contenido Completo del Artículo</label>
                            <textarea 
                                required 
                                value={content} onChange={e => setContent(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 p-4 text-xs text-white rounded-xl outline-none focus:border-indigo-500 min-h-[160px] resize-y"
                                placeholder="Desarrollo completo..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl text-neutral-400 text-xs font-bold">Cancelar</button>
                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg">
                                Guardar Publicación
                            </button>
                        </div>
                    </form>
                </motion.div>
              </div>
          )}
      </AnimatePresence>

    </div>
  )
}
