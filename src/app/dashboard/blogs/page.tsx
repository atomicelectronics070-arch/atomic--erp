"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, Edit, Trash2, Shield, Eye, FileText, 
    Check, X, Image as ImageIcon, BookOpen, 
    Settings, Layout, Layers, Key,
    Video, Facebook, Instagram, Youtube,
    Globe, User as UserIcon, Share2, Search
} from "lucide-react"

export default function BlogsDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<"mis_blogs" | "permisos" | "social_settings" | "entornos">("mis_blogs")
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
  const [isNemotronProcessing, setIsNemotronProcessing] = useState(false)

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

  useEffect(() => {
    fetchBlogs()
    fetchEnvironments()
    if (isAdmin) {
        fetchUsers()
        fetchSocialSettings()
    }
  }, [isAdmin])

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
        // Matrix Data
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

  const toggleAccountSelection = (id: string) => {
      setSelectedAccountIds(prev => 
          prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      )
  }

  if (!isAdmin && !canPublish) {
    return (
        <div className="flex flex-col items-center justify-center p-20 text-center text-slate-500">
            <Shield size={48} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Acceso Restringido</h2>
            <p className="mt-2 font-medium">No cuentas con privilegios para la creación de contenidos.</p>
        </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-6">
          <div>
              <h1 className="text-3xl font-black text-[#0F172A] flex items-center gap-3">
                  <Share2 className="text-indigo-600" /> Omnicanalidad
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                  Distribución y gestión centralizada de contenidos.
              </p>
          </div>
          {isAdmin && (
              <div className="flex bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                  <button 
                      onClick={() => setActiveTab("mis_blogs")}
                      className={`px-4 py-2 text-xs font-bold transition-all rounded-md flex items-center gap-2 ${activeTab === 'mis_blogs' ? 'bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-indigo-600 shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                      <Layout size={14} /> Contenidos
                  </button>
                  <button 
                      onClick={() => setActiveTab("entornos")}
                      className={`px-4 py-2 text-xs font-bold transition-all rounded-md flex items-center gap-2 ${activeTab === 'entornos' ? 'bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-indigo-600 shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                      <Layers size={14} /> Entornos
                  </button>
                  <button 
                      onClick={() => setActiveTab("permisos")}
                      className={`px-4 py-2 text-xs font-bold transition-all rounded-md flex items-center gap-2 ${activeTab === 'permisos' ? 'bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-indigo-600 shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                      <Key size={14} /> Permisos
                  </button>
                  <button 
                      onClick={() => setActiveTab("social_settings")}
                      className={`px-4 py-2 text-xs font-bold transition-all rounded-md flex items-center gap-2 ${activeTab === 'social_settings' ? 'bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-indigo-600 shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                      <Settings size={14} /> APIs API
                  </button>
              </div>
          )}
      </div>

      {activeTab === "mis_blogs" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-6 border border-slate-200 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-3">
                    <BookOpen className="text-slate-400" size={20} />
                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Gestión de Publicaciones</h3>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                >
                    <Plus size={18} /> Nuevo Contenido
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {blogs.length === 0 && !loading && (
                    <div className="py-20 text-center bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
                        <FileText size={32} className="text-slate-300 mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">No hay contenidos publicados.</p>
                    </div>
                )}
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 p-4 rounded-xl flex items-center gap-6 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all group">
                        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                            {blog.contentType === 'video' ? (
                                <Video size={24} className="text-slate-400" />
                            ) : blog.imageUrl ? (
                                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={24} className="text-slate-300" />
                            )}
                        </div>

                        <div className="flex-1 flex justify-between items-center">
                            <div className="max-w-xl">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-black text-[#0F172A] truncate">{blog.title}</h3>
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${blog.published ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-slate-600 bg-slate-100 border border-slate-200'}`}>
                                        {blog.published ? 'Publicado' : 'Borrador'}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 font-medium line-clamp-2">{blog.excerpt || 'Sin extracto...'}</p>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right hidden lg:block">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Autor</p>
                                    <p className="text-sm font-bold text-[#0F172A]">{blog.author?.name || 'Sistema'}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => openModal(blog)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(blog.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
      )}

      {/* OTHER TABS (Entornos, Permisos, Settings) - Refactored to SaaS Aesthetic */}
      {activeTab === "entornos" && isAdmin && (
          <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-6 border border-slate-200 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-3">
                      <Layers className="text-indigo-600" size={20} />
                      <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Entornos de Distribución</h3>
                  </div>
                  <button 
                    onClick={() => setIsEnvModalOpen(true)}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                  >
                    <Plus size={18} /> Nuevo Entorno
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {environments.length === 0 && (
                      <div className="col-span-full py-20 text-center bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-xl">
                          <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Sin entornos configurados.</p>
                      </div>
                  )}
                  {environments.map(env => (
                      <div key={env.id} className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 p-6 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] relative">
                          <div className="flex justify-between items-start mb-6">
                              <div>
                                  <h3 className="text-lg font-black text-[#0F172A]">{env.name}</h3>
                                  <p className="text-sm text-slate-500 mt-1">{env.description || 'Sin descripción'}</p>
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={() => { setTargetEnvId(env.id); setIsAccModalOpen(true) }} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200">
                                      <Plus size={16} />
                                  </button>
                                  <button onClick={() => handleDeleteEnv(env.id)} className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200">
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          </div>
                          
                          <div className="space-y-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cuentas Vinculadas</p>
                              {env.accounts?.length === 0 && <p className="text-sm text-slate-400 italic">No hay cuentas</p>}
                              {env.accounts?.map((acc: any) => (
                                  <div key={acc.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                      <div className="flex items-center gap-3">
                                          {acc.platform === 'facebook' && <Facebook size={16} className="text-blue-600" />}
                                          {acc.platform === 'instagram' && <Instagram size={16} className="text-pink-600" />}
                                          {acc.platform === 'youtube' && <Youtube size={16} className="text-red-600" />}
                                          {acc.platform === 'tiktok' && <span className="font-black text-xs">TK</span>}
                                          <span className="text-sm font-bold text-slate-700">{acc.name}</span>
                                      </div>
                                      <button onClick={() => handleDeleteAcc(acc.id)} className="text-slate-400 hover:text-rose-500"><X size={14} /></button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {activeTab === "permisos" && isAdmin && (
          <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] overflow-hidden">
             <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Privilegios de Redacción</h3>
             </div>
             <table className="w-full text-left">
                 <thead>
                     <tr className="border-b border-slate-100 bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                         <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Usuario</th>
                         <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Rol</th>
                         <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Permiso de Publicación</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {users.map(u => (
                         <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                                         {u.name?.[0] || 'U'}
                                     </div>
                                     <div>
                                         <div className="font-bold text-[#0F172A]">{u.name || 'Sin Nombre'}</div>
                                         <div className="text-xs text-slate-500">{u.email}</div>
                                     </div>
                                 </div>
                             </td>
                             <td className="px-6 py-4">
                                 <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{u.role}</span>
                             </td>
                             <td className="px-6 py-4 text-center">
                                 <button 
                                     onClick={() => handleTogglePermission(u.id, u.canCreateBlogs)}
                                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${u.canCreateBlogs ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                 >
                                     <span className={`inline-block h-4 w-4 transform rounded-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50 transition-transform ${u.canCreateBlogs ? 'translate-x-6' : 'translate-x-1'}`} />
                                 </button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
          </div>
      )}

      {activeTab === "social_settings" && isAdmin && (
          <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] p-8">
              <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-4">
                  <Settings className="text-indigo-600" size={20} />
                  <h2 className="text-lg font-black text-[#0F172A]">API Keys & Credenciales</h2>
              </div>
              
              <form onSubmit={handleSaveSettings} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Meta */}
                      <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                          <h3 className="text-[#0F172A] font-bold flex items-center gap-2"><Facebook size={16} className="text-blue-600" /> Meta Graph API</h3>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Page ID (Facebook)</label>
                              <input type="text" className="w-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-300 p-2.5 rounded-lg text-sm" value={socialSettings.metaPageId || ''} onChange={e => setSocialSettings({...socialSettings, metaPageId: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Page Access Token</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-300 p-2.5 rounded-lg text-sm" value={socialSettings.metaPageToken || ''} onChange={e => setSocialSettings({...socialSettings, metaPageToken: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Instagram Business Account ID</label>
                              <input type="text" className="w-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-300 p-2.5 rounded-lg text-sm" value={socialSettings.metaInstagramActId || ''} onChange={e => setSocialSettings({...socialSettings, metaInstagramActId: e.target.value})} />
                          </div>
                      </div>

                      {/* YouTube */}
                      <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                          <h3 className="text-[#0F172A] font-bold flex items-center gap-2"><Youtube size={16} className="text-red-600" /> YouTube API v3</h3>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Channel ID</label>
                              <input type="text" className="w-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-300 p-2.5 rounded-lg text-sm" value={socialSettings.youtubeChannelId || ''} onChange={e => setSocialSettings({...socialSettings, youtubeChannelId: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Refresh Token</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-300 p-2.5 rounded-lg text-sm" value={socialSettings.youtubeRefreshToken || ''} onChange={e => setSocialSettings({...socialSettings, youtubeRefreshToken: e.target.value})} />
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-end">
                      <button type="submit" disabled={savingSettings} className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                          {savingSettings ? 'Guardando...' : 'Guardar Credenciales'}
                      </button>
                  </div>
              </form>
          </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
          {isModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
                    onClick={closeModal} 
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl rounded-2xl relative z-10 flex flex-col"
                >
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-[#0F172A] tracking-tight">{editingBlog ? 'Editar Contenido' : 'Crear Contenido'}</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Editor Centralizado</p>
                            </div>
                        </div>
                        <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSaveBlog} className="p-8 space-y-6">
                        <div className="flex gap-4 border-b border-slate-100 pb-6">
                            <button
                                type="button"
                                onClick={() => setContentType("article")}
                                className={`flex-1 py-4 flex flex-col items-center gap-2 rounded-xl transition-all border ${contentType === 'article' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                            >
                                <FileText size={20} /> <span className="text-sm font-bold">Artículo (Blog)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setContentType("video")}
                                className={`flex-1 py-4 flex flex-col items-center gap-2 rounded-xl transition-all border ${contentType === 'video' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                            >
                                <Video size={20} /> <span className="text-sm font-bold">Video Social</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">Título Principal</label>
                                <input 
                                    type="text" required 
                                    value={title} onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-[#0F172A] font-bold focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Ej. Nuevas tendencias tecnológicas 2024"
                                />
                            </div>

                            {contentType === 'article' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">Extracto Corto</label>
                                    <textarea 
                                        value={excerpt} onChange={e => setExcerpt(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-[#0F172A] font-medium focus:border-indigo-500 outline-none resize-none transition-all"
                                        rows={2} placeholder="Breve resumen del contenido..."
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">{contentType === 'article' ? 'Contenido Completo' : 'Descripción del Video'}</label>
                                <textarea 
                                    required 
                                    value={content} onChange={e => setContent(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-lg text-[#0F172A] text-sm focus:border-indigo-500 outline-none min-h-[200px] resize-y transition-all"
                                    placeholder={contentType === 'article' ? 'Desarrollo del artículo...' : 'Hashtags, descripción, menciones...'}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {contentType === 'article' ? (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">URL de Imagen (Portada)</label>
                                        <input 
                                            type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-[#0F172A] text-sm focus:border-indigo-500 outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">URL del Video (MP4)</label>
                                        <input 
                                            type="url" required value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-[#0F172A] text-sm focus:border-indigo-500 outline-none"
                                            placeholder="https://...mp4"
                                        />
                                    </div>
                                )}
                                
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1 ml-1 uppercase">Estado de Publicación</label>
                                    <div className="flex items-center gap-3 mt-3">
                                        <button 
                                            type="button"
                                            onClick={() => setPublished(!published)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${published ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-slate-900/50 backdrop-blur-xl border-slate-700/50 transition-transform ${published ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                        <span className="text-sm font-bold text-slate-700">{published ? 'Público Activo' : 'Borrador Privado'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-lg text-slate-500 font-bold text-sm hover:bg-slate-100 transition-colors border border-transparent">
                                Cancelar
                            </button>
                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all flex items-center gap-2">
                                <Check size={18} /> Guardar Contenido
                            </button>
                        </div>
                    </form>
                </motion.div>
              </div>
          )}
      </AnimatePresence>

      {/* Env / Acc Modals (Simplified versions for SaaS) */}
      <AnimatePresence>
          {isEnvModalOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                  <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-8 max-w-md w-full rounded-2xl shadow-xl relative border border-slate-200">
                      <button onClick={() => setIsEnvModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
                      <h3 className="text-xl font-black text-[#0F172A] mb-6">Nuevo Entorno</h3>
                      <div className="space-y-4">
                          <input type="text" placeholder="Nombre del Entorno" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm" value={envName} onChange={e => setEnvName(e.target.value)} />
                          <textarea placeholder="Descripción..." className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm h-24" value={envDesc} onChange={e => setEnvDesc(e.target.value)} />
                          <button onClick={handleCreateEnv} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-indigo-700">Crear Entorno</button>
                      </div>
                  </div>
              </div>
          )}
          {isAccModalOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                  <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 p-8 max-w-md w-full rounded-2xl shadow-xl relative border border-slate-200">
                      <button onClick={() => setIsAccModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
                      <h3 className="text-xl font-black text-[#0F172A] mb-6">Vincular Cuenta</h3>
                      <div className="space-y-4">
                          <input type="text" placeholder="Nombre (Ej. IG Principal)" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm" value={accName} onChange={e => setAccName(e.target.value)} />
                          <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm font-bold text-slate-700" value={accPlatform} onChange={e => setAccPlatform(e.target.value)}>
                              <option value="facebook">Facebook</option>
                              <option value="instagram">Instagram</option>
                              <option value="youtube">YouTube</option>
                              <option value="tiktok">TikTok</option>
                          </select>
                          <button onClick={handleCreateAcc} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-indigo-700">Añadir Cuenta</button>
                      </div>
                  </div>
              </div>
          )}
      </AnimatePresence>
    </div>
  )
}
