"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Plus, Edit, Trash2, Shield, Eye, FileText, 
    Check, X, Image as ImageIcon, BookOpen, 
    Sparkles, Key, Settings, UserCheck, Layout,
    ExternalLink, Trash, ShieldCheck, Share2,
    Video, Facebook, Instagram, Youtube, Twitter,
    Globe, Server, User as UserIcon, Layers
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
        title: title.toUpperCase(), 
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
        const savedBlog = await res.json()
        
        // Social publishing logic here...
        if (published && (targets.length > 0 || selectedAccountIds.length > 0)) {
            // Future: Implement matrix publishing per account
        }
        
        closeModal()
        fetchBlogs()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Confirmación Crítica: ¿Eliminar este artículo permanentemente?")) return
    const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" })
    if (res.ok) fetchBlogs()
  }

  const handleCreateEnv = async () => {
      if (!envName) return
      const res = await fetch("/api/environments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: envName.toUpperCase(), description: envDesc })
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
          body: JSON.stringify({ name: accName.toUpperCase(), platform: accPlatform, environmentId: targetEnvId })
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

  const handleOmniPublish = async () => {
      setIsNemotronProcessing(true)
      const targets = Object.keys(socialTargets).filter(k => socialTargets[k as keyof typeof socialTargets])
      
      try {
          const res = await fetch("/api/blogs/omni-publish", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  text: excerpt || content || title,
                  imageUrl: contentType === 'article' ? imageUrl : null,
                  videoUrl: contentType === 'video' ? videoUrl : null,
                  targets,
                  authorId: (session?.user as any)?.id
              })
          })
          
          if (res.ok) {
              closeModal()
              fetchBlogs()
              alert("Nemotron procesó y distribuyó exitosamente el contenido.")
          } else {
              alert("Error de Nemotron al procesar.")
          }
      } catch(e) {
          console.error(e)
      } finally {
          setIsNemotronProcessing(false)
      }
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
        <div className="flex flex-col items-center justify-center p-40 text-center animate-in zoom-in duration-700">
            <div className="w-24 h-24 bg-red-500/10 rounded-none flex items-center justify-center mb-10 border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                <Shield size={48} className="text-red-500" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-4 italic">ACCESO RESTRINGIDO</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] max-w-sm italic">Privilegios insuficientes para el subsistema de redacción corporativa. Contacte al Elemento de administración.</p>
        </div>
    )
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 relative">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] rounded-none bg-secondary/5 blur-[120px]" />
          <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] rounded-none bg-azure-500/5 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-16 relative z-10">
          <div>
              <div className="flex items-center space-x-4 mb-4 text-secondary">
                  <Share2 size={20} className="drop-shadow-[0_0_8px_rgba(255,99,71,0.5)]" />
                  <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">Omnicanalidad Corporativa</span>
              </div>
              <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none italic">SOCIAL <span className="text-secondary underline decoration-secondary/30 underline-offset-8">HUB</span></h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] mt-5 italic leading-relaxed max-w-xl">
                  Red de distribución multicanal de contenidos estratégicos Atomic Solutions.
              </p>
          </div>
          {isAdmin && (
              <div className="flex flex-wrap glass-panel !bg-slate-950/40 p-2 rounded-none border-white/5 shadow-inner ring-1 ring-white/5 backdrop-blur-3xl gap-2">
                  <button 
                      onClick={() => setActiveTab("mis_blogs")}
                      className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all rounded-none italic skew-x-[-12deg] ${activeTab === 'mis_blogs' ? 'bg-secondary text-white shadow-2xl' : 'text-slate-600 hover:text-white'}`}
                  >
                      <div className="skew-x-[12deg] flex items-center gap-3"><Layout size={14} /> CONTENIDOS</div>
                  </button>
                  <button 
                      onClick={() => setActiveTab("entornos")}
                      className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all rounded-none italic skew-x-[-12deg] ${activeTab === 'entornos' ? 'bg-emerald-500 text-white shadow-2xl' : 'text-slate-600 hover:text-white'}`}
                  >
                      <div className="skew-x-[12deg] flex items-center gap-3"><Layers size={14} /> MATRIZ_ENTORNOS</div>
                  </button>
                  <button 
                      onClick={() => setActiveTab("permisos")}
                      className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all rounded-none italic skew-x-[-12deg] ${activeTab === 'permisos' ? 'bg-azure-500 text-white shadow-2xl' : 'text-slate-600 hover:text-white'}`}
                  >
                      <div className="skew-x-[12deg] flex items-center gap-3"><Key size={14} /> PERMISOS</div>
                  </button>
                  <button 
                      onClick={() => setActiveTab("social_settings")}
                      className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all rounded-none italic skew-x-[-12deg] ${activeTab === 'social_settings' ? 'bg-indigo-500 text-white shadow-2xl' : 'text-slate-600 hover:text-white'}`}
                  >
                      <div className="skew-x-[12deg] flex items-center gap-3"><Settings size={14} /> APIS_SOCIALES</div>
                  </button>
              </div>
          )}
      </div>

      {activeTab === "entornos" && isAdmin && (
          <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 relative z-10">
              <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                      <div className="w-1.5 h-10 bg-emerald-500"></div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">GESTIÓN DE ENTORNOS OPERATIVOS</h2>
                  </div>
                  <button 
                    onClick={() => setIsEnvModalOpen(true)}
                    className="bg-emerald-600 text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest italic skew-x-[-12deg] hover:bg-white hover:text-emerald-600 transition-all"
                  >
                    <div className="skew-x-[12deg] flex items-center gap-3"><Plus size={16} /> NUEVO ENTORNO</div>
                  </button>
              </div>

              <div className="grid grid-cols-1 gap-10">
                  {environments.length === 0 && (
                      <div className="py-20 text-center border border-dashed border-white/5 text-slate-800 uppercase font-black tracking-widest text-[10px] italic">No hay entornos operativos definidos.</div>
                  )}
                  {environments.map(env => (
                      <div key={env.id} className="glass-panel border-white/5 p-8 backdrop-blur-3xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 flex gap-4">
                              <button onClick={() => { setTargetEnvId(env.id); setIsAccModalOpen(true) }} className="text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors flex items-center gap-2 bg-emerald-400/5 px-4 py-2 border border-emerald-400/20">
                                  <Plus size={12} /> Añadir Cuenta
                              </button>
                              <button onClick={() => handleDeleteEnv(env.id)} className="text-slate-700 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                          </div>

                          <div className="mb-8">
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-2">{env.name}</h3>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold italic">{env.description || 'SIN DESCRIPCIÓN OPERATIVA'}</p>
                          </div>

                          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                              {env.accounts?.length === 0 && (
                                  <div className="text-[9px] text-slate-800 uppercase tracking-widest font-black italic">Sin cuentas vinculadas.</div>
                              )}
                              {env.accounts?.map((acc: any) => (
                                  <div key={acc.id} className="shrink-0 w-48 p-4 bg-slate-950/60 border border-white/5 relative group">
                                      <button onClick={() => handleDeleteAcc(acc.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500/40 hover:text-red-500 transition-all"><X size={12} /></button>
                                      <div className="flex flex-col items-center text-center gap-3">
                                          <div className="w-10 h-10 bg-white/5 flex items-center justify-center text-slate-500">
                                              {acc.platform === 'facebook' && <Facebook size={18} />}
                                              {acc.platform === 'instagram' && <Instagram size={18} />}
                                              {acc.platform === 'youtube' && <Youtube size={18} />}
                                              {acc.platform === 'tiktok' && <span className="font-black text-xs">TK</span>}
                                          </div>
                                          <p className="text-[10px] font-black text-white uppercase tracking-widest italic">{acc.name}</p>
                                          <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{acc.platform}</span>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Env Modal */}
      <AnimatePresence>
          {isEnvModalOpen && (
              <div className="fixed inset-0 z-[500] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-3xl">
                  <div className="glass-panel border-white/10 p-12 max-w-xl w-full relative">
                      <button onClick={() => setIsEnvModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24} /></button>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-8">Definir Nuevo Entorno</h3>
                      <div className="space-y-6">
                          <input 
                            type="text" 
                            placeholder="NOMBRE DEL ENTORNO (EJ: SECTOR_GAMING)" 
                            className="w-full bg-slate-950 border border-white/10 p-4 text-xs text-white outline-none focus:border-emerald-500"
                            value={envName}
                            onChange={e => setEnvName(e.target.value)}
                          />
                          <textarea 
                            placeholder="DESCRIPCIÓN DEL ALCANCE..." 
                            className="w-full bg-slate-950 border border-white/10 p-4 text-xs text-white outline-none focus:border-emerald-500 h-24"
                            value={envDesc}
                            onChange={e => setEnvDesc(e.target.value)}
                          />
                          <button onClick={handleCreateEnv} className="w-full bg-emerald-600 text-white py-4 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all">Crear Estructura</button>
                      </div>
                  </div>
              </div>
          )}
      </AnimatePresence>

      {/* Account Modal */}
      <AnimatePresence>
          {isAccModalOpen && (
              <div className="fixed inset-0 z-[500] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-3xl">
                  <div className="glass-panel border-white/10 p-12 max-w-xl w-full relative">
                      <button onClick={() => setIsAccModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24} /></button>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-8">Vincular Nueva Cuenta</h3>
                      <div className="space-y-6">
                          <input 
                            type="text" 
                            placeholder="NOMBRE DE LA CUENTA (EJ: CUENTA 1)" 
                            className="w-full bg-slate-950 border border-white/10 p-4 text-xs text-white outline-none focus:border-emerald-500"
                            value={accName}
                            onChange={e => setAccName(e.target.value)}
                          />
                          <select 
                            className="w-full bg-slate-950 border border-white/10 p-4 text-xs text-white outline-none focus:border-emerald-500"
                            value={accPlatform}
                            onChange={e => setAccPlatform(e.target.value)}
                          >
                              <option value="facebook">FACEBOOK</option>
                              <option value="instagram">INSTAGRAM</option>
                              <option value="youtube">YOUTUBE</option>
                              <option value="tiktok">TIKTOK</option>
                          </select>
                          <button onClick={handleCreateAcc} className="w-full bg-emerald-600 text-white py-4 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all">Sincronizar Cuenta</button>
                      </div>
                  </div>
              </div>
          )}
      </AnimatePresence>

      {activeTab === "social_settings" && isAdmin && (
          <div className="glass-panel border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden rounded-none-[4rem] backdrop-blur-3xl relative z-10 p-12">
               <div className="flex items-center space-x-4 mb-10 text-indigo-400 border-b border-white/5 pb-6">
                    <Settings size={24} />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Configuración de API Keys (Omnicanalidad)</h2>
              </div>
              
              <form onSubmit={handleSaveSettings} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* Meta */}
                      <div className="space-y-6 bg-slate-950/40 p-8 border border-white/5 rounded-none">
                          <h3 className="text-indigo-400 font-black uppercase tracking-widest text-sm flex items-center gap-2"><Facebook size={18} /> <Instagram size={18} /> Meta Graph API</h3>
                          <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Page ID (Facebook)</label>
                              <input type="text" className="w-full bg-slate-950 border border-white/10 p-4 text-xs text-white" value={socialSettings.metaPageId || ''} onChange={e => setSocialSettings({...socialSettings, metaPageId: e.target.value})} />
                          </div>
                          <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Page Access Token</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-white/10 p-4 text-xs text-white" value={socialSettings.metaPageToken || ''} onChange={e => setSocialSettings({...socialSettings, metaPageToken: e.target.value})} />
                          </div>
                          <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Instagram Business Account ID</label>
                              <input type="text" className="w-full bg-slate-950 border border-white/10 p-4 text-xs text-white" value={socialSettings.metaInstagramActId || ''} onChange={e => setSocialSettings({...socialSettings, metaInstagramActId: e.target.value})} />
                          </div>
                      </div>

                      {/* YouTube */}
                      <div className="space-y-6 bg-slate-950/40 p-8 border border-white/5 rounded-none">
                          <h3 className="text-red-500 font-black uppercase tracking-widest text-sm flex items-center gap-2"><Youtube size={18} /> YouTube API v3</h3>
                          <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Channel ID</label>
                              <input type="text" className="w-full bg-slate-950 border border-white/10 p-4 text-xs text-white" value={socialSettings.youtubeChannelId || ''} onChange={e => setSocialSettings({...socialSettings, youtubeChannelId: e.target.value})} />
                          </div>
                          <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Refresh Token (OAuth2)</label>
                              <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-white/10 p-4 text-xs text-white" value={socialSettings.youtubeRefreshToken || ''} onChange={e => setSocialSettings({...socialSettings, youtubeRefreshToken: e.target.value})} />
                          </div>
                      </div>

                      {/* TikTok */}
                      <div className="space-y-6 bg-slate-950/40 p-8 border border-white/5 rounded-none md:col-span-2">
                          <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2"> TikTok Content Posting API</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Open ID</label>
                                  <input type="text" className="w-full bg-slate-950 border border-white/10 p-4 text-xs text-white" value={socialSettings.tiktokOpenId || ''} onChange={e => setSocialSettings({...socialSettings, tiktokOpenId: e.target.value})} />
                              </div>
                              <div className="space-y-4">
                                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Access Token</label>
                                  <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-white/10 p-4 text-xs text-white" value={socialSettings.tiktokAccessToken || ''} onChange={e => setSocialSettings({...socialSettings, tiktokAccessToken: e.target.value})} />
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-end">
                      <button type="submit" disabled={savingSettings} className="bg-indigo-600 text-white px-12 py-4 text-xs font-black uppercase tracking-widest skew-x-[-12deg] hover:bg-white hover:text-indigo-600 transition-all">
                          <span className="skew-x-[12deg] block">{savingSettings ? 'Sincronizando...' : 'Guardar Credenciales'}</span>
                      </button>
                  </div>
              </form>
          </div>
      )}

      {activeTab === "mis_blogs" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700 relative z-10">
            <div className="flex justify-between items-center bg-white/[0.01] p-6 border border-white/5 rounded-none backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-1 h-6 bg-secondary"></div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic">Consola de Activos Narrativos</h3>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="flex items-center space-x-4 bg-secondary text-white px-8 py-3 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-secondary transition-all rounded-none italic skew-x-[-12deg] group"
                >
                    <div className="skew-x-[12deg] flex items-center gap-3">
                        <Plus size={16} />
                        <span>Nuevo Contenido</span>
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {blogs.length === 0 && !loading && (
                    <div className="py-24 text-center glass-panel border border-dashed border-white/5 rounded-none flex flex-col items-center justify-center">
                        <p className="text-slate-700 font-black uppercase tracking-[0.6em] text-[9px] italic text-center">Sin publicaciones detectadas.</p>
                    </div>
                )}
                {blogs.map(blog => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        key={blog.id} 
                        className="glass-panel border-white/5 overflow-hidden flex items-center group hover:bg-white/[0.02] transition-all rounded-none backdrop-blur-3xl relative p-4 h-24"
                    >
                        {/* Compact Thumbnail */}
                        <div className="w-24 h-full shrink-0 overflow-hidden border border-white/5 bg-slate-900 flex items-center justify-center">
                            {blog.contentType === 'video' ? (
                                <Video size={20} className="text-slate-700" />
                            ) : blog.imageUrl ? (
                                <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1s]" />
                            ) : (
                                <ImageIcon size={20} className="text-slate-800" />
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 px-8 flex items-center justify-between">
                            <div className="flex flex-col gap-1 max-w-xl">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-black text-white italic uppercase tracking-tighter truncate group-hover:text-secondary transition-colors">{blog.title}</h3>
                                    <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 border ${blog.published ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-secondary/20 text-secondary bg-secondary/5'}`}>
                                        {blog.published ? 'PUBLICADO' : 'BORRADOR'}
                                    </span>
                                </div>
                                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight italic line-clamp-1 opacity-60">{blog.excerpt || 'Sín extracto ejecutivo registrado'}</p>
                            </div>

                            <div className="flex items-center gap-12">
                                {/* Social Chips */}
                                {blog.socialTargets && (
                                    <div className="flex gap-1">
                                        {JSON.parse(blog.socialTargets).map((t: string) => (
                                            <div key={t} className="w-5 h-5 rounded-none bg-indigo-500/5 text-indigo-500/30 flex items-center justify-center border border-indigo-500/10" title={t}>
                                                {t === 'facebook' && <Facebook size={10} />}
                                                {t === 'instagram' && <Instagram size={10} />}
                                                {t === 'youtube' && <Youtube size={10} />}
                                                {t === 'tiktok' && <span className="text-[6px] font-black">TK</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Metadata */}
                                <div className="flex items-center gap-4 border-l border-white/5 pl-8 hidden lg:flex">
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">Operador</p>
                                        <p className="text-[10px] font-black text-white italic opacity-40">{blog.author?.name || 'SISTEMA'}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button onClick={() => openModal(blog)} className="p-3 border border-white/5 text-slate-700 hover:text-white hover:border-white/20 transition-all">
                                        <Edit size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(blog.id)} className="p-3 border border-white/5 text-slate-700 hover:text-red-500 hover:border-red-500/20 transition-all">
                                        <Trash2 size={14} />
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
          <div className="glass-panel border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden rounded-none-[4rem] backdrop-blur-3xl relative z-10">
            <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                 <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] italic">Detallesoría de Privilegios de Redacción</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.6em] text-slate-600 italic">IDENTIDAD_Elemento</th>
                            <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.6em] text-slate-600 italic">RANGO_SISTEMA</th>
                            <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.6em] text-slate-600 italic text-center">PRIVILEGIO_BLOG</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-12 py-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-none bg-slate-950 border border-white/5 flex items-center justify-center font-black text-slate-700 italic group-hover:border-azure-500/40 transition-colors">
                                            {u.name?.[0] || 'N'}
                                        </div>
                                        <div>
                                            <div className="font-black text-white text-base uppercase tracking-tighter italic group-hover:text-azure-400 transition-colors">{u.name || 'ANÓNIMO'}</div>
                                            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-12 py-8">
                                    <span className="text-[10px] font-black text-slate-500 uppercase border border-white/5 px-4 py-1.5 rounded-none bg-slate-900 italic shadow-inner">
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-12 py-8">
                                    <div className="flex items-center justify-center">
                                        <button 
                                            onClick={() => handleTogglePermission(u.id, u.canCreateBlogs)}
                                            className={`relative inline-flex h-8 w-16 items-center rounded-none transition-all duration-500 shadow-2xl ${u.canCreateBlogs ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-slate-900 border border-white/5'}`}
                                        >
                                            <span className={`inline-block h-5 w-5 transform rounded-none transition-all duration-500 shadow-inner ${u.canCreateBlogs ? 'translate-x-9 bg-emerald-400' : 'translate-x-2 bg-slate-700'}`} />
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
                    className="glass-panel !bg-slate-950/60 w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-[0_0_150px_rgba(0,0,0,1)] rounded-none-[4rem] relative z-10 backdrop-blur-3xl p-14 custom-scrollbar"
                >
                    <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-10">
                        <div className="flex items-center gap-8">
                            <div className="p-5 bg-secondary text-white rounded-none shadow-2xl shadow-secondary/30">
                                <Plus size={32} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic">
                                    {editingBlog ? 'EDITAR <span className="text-secondary">ACTIVO</span>' : 'REDACTAR <span className="text-secondary">Elemento</span>'}
                                </h2>
                                <p className="text-[10px] font-black text-slate-500 mt-3 uppercase tracking-[0.6em] italic">Subsistema de Publicación Corporativa</p>
                            </div>
                        </div>
                        <button onClick={closeModal} className="p-5 bg-slate-900 border border-white/10 rounded-none text-slate-600 hover:text-white hover:rotate-90 transition-all duration-500 shadow-2xl">
                            <X size={32} />
                        </button>
                    </div>

                    <form onSubmit={handleSaveBlog} className="space-y-12">
                        {/* Tipo de Contenido Selector */}
                        <div className="flex gap-4 border-b border-white/5 pb-8">
                            <button
                                type="button"
                                onClick={() => setContentType("article")}
                                className={`flex-1 py-6 flex flex-col items-center gap-3 border transition-all ${contentType === 'article' ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-950/50 border-white/5 text-slate-500 hover:text-white'}`}
                            >
                                <FileText size={24} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Artículo / Imagen</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setContentType("video")}
                                className={`flex-1 py-6 flex flex-col items-center gap-3 border transition-all ${contentType === 'video' ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-slate-950/50 border-white/5 text-slate-500 hover:text-white'}`}
                            >
                                <Video size={24} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Video (Reel/TikTok/Short)</span>
                            </button>
                        </div>

                        {/* Matrix Deployment Section (NEW MACABRE UI) */}
                        <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-none space-y-8">
                             <div className="flex items-center gap-4 border-b border-emerald-500/10 pb-4">
                                <Globe size={20} className="text-emerald-500" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">MATRIZ DE DESPLIEGUE POR ENTORNO</h3>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                 <div className="space-y-4">
                                     <label className="text-[9px] font-black uppercase tracking-widest text-emerald-500 italic">1. Seleccionar Entorno Objetivo</label>
                                     <select 
                                        className="w-full bg-slate-950 border border-white/10 p-4 text-xs text-white outline-none focus:border-emerald-500"
                                        value={selectedEnvId}
                                        onChange={e => { setSelectedEnvId(e.target.value); setSelectedAccountIds([]) }}
                                     >
                                         <option value="">-- SELECCIONAR ENTORNO --</option>
                                         {environments.map(e => (
                                             <option key={e.id} value={e.id}>{e.name}</option>
                                         ))}
                                     </select>
                                 </div>

                                 {selectedEnvId && (
                                     <div className="space-y-4">
                                         <label className="text-[9px] font-black uppercase tracking-widest text-emerald-500 italic">2. Activar Cuentas de Destino</label>
                                         <div className="flex flex-wrap gap-2">
                                             {environments.find(e => e.id === selectedEnvId)?.accounts?.map((acc: any) => (
                                                 <button
                                                    key={acc.id}
                                                    type="button"
                                                    onClick={() => toggleAccountSelection(acc.id)}
                                                    className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-all ${selectedAccountIds.includes(acc.id) ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-950 text-slate-600 border-white/5 hover:border-emerald-500/30'}`}
                                                 >
                                                     {acc.name}
                                                 </button>
                                             ))}
                                         </div>
                                     </div>
                                 )}
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 ml-2 italic">Identificador Maestro / Título</label>
                                <input 
                                    required 
                                    type="text"
                                    className="w-full bg-slate-950/60 border border-white/5 p-6 rounded-none-[2rem] text-[15px] font-black uppercase tracking-widest text-white shadow-inner focus:border-secondary transition-all outline-none italic placeholder:text-slate-900"
                                    value={title}
                                    onChange={e => setTitle(e.target.value.toUpperCase())}
                                    placeholder="ESPECIFICAR TÍTULO DEL CONTENIDO..."
                                />
                            </div>
                            
                            {contentType === 'article' ? (
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 ml-2 italic">Punto de Origen Imagen (URL)</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-slate-950/60 border border-white/5 p-6 rounded-none-[2rem] text-[12px] font-black text-azure-400 shadow-inner focus:border-azure-500 transition-all outline-none italic placeholder:text-slate-900"
                                        value={imageUrl}
                                        onChange={e => setImageUrl(e.target.value)}
                                        placeholder="https://cdn.atomic.com/node/img..."
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary ml-2 italic">Punto de Origen Video (URL .mp4)</label>
                                    <input 
                                        required
                                        type="text"
                                        className="w-full bg-slate-950/60 border border-white/5 p-6 rounded-none-[2rem] text-[12px] font-black text-secondary shadow-inner focus:border-secondary transition-all outline-none italic placeholder:text-slate-900"
                                        value={videoUrl}
                                        onChange={e => setVideoUrl(e.target.value)}
                                        placeholder="https://cdn.atomic.com/node/video.mp4"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 ml-2 italic">Extracto Ejecutivo / Caption Redes Sociales</label>
                            <textarea 
                                className="w-full bg-slate-950/60 border border-white/5 p-8 rounded-none-[2.5rem] text-[12px] font-black text-white shadow-inner focus:border-secondary transition-all outline-none resize-none h-32 italic uppercase tracking-widest leading-relaxed placeholder:text-slate-900"
                                value={excerpt}
                                onChange={e => setExcerpt(e.target.value)}
                                placeholder="BREVE SÍNTESIS PARA COMPARTIR EN REDES..."
                            />
                        </div>

                        {contentType === 'article' && (
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 ml-2 italic flex items-center justify-between pr-4">
                                    <span>Cuerpo Estructurado del Activo (Blog Web)</span>
                                    <span className="text-[9px] text-slate-700 font-black normal-case tracking-[0.4em] italic uppercase">FORMATO_NATIVO: HTML_SUPPORTED</span>
                                </label>
                                <textarea 
                                    className="w-full bg-slate-950/40 border border-white/5 p-10 rounded-none-[3rem] text-[13px] font-black text-slate-300 shadow-inner focus:border-secondary transition-all outline-none font-mono h-[500px] leading-loose custom-scrollbar"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="<h1>Title</h1><p>Operational Data...</p>"
                                />
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-8 pt-10 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => setPublished(!published)}
                                className={`flex items-center space-x-6 px-10 py-5 border rounded-none text-[10px] font-black uppercase tracking-[0.4em] transition-all italic skew-x-[-12deg] shadow-2xl ${published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-900 text-slate-600 border-white/5'}`}
                            >
                                <div className="skew-x-[12deg] flex items-center gap-4">
                                    <Check size={18} className={published ? 'opacity-100 scale-100' : 'opacity-0 scale-50 transition-all'} />
                                    <span>{published ? 'ESTADO: CONSOLIDADO (PÚBLICO)' : 'ESTADO: BORRADOR (Elemento_INTERNO)'}</span>
                                </div>
                            </button>
                            
                            <div className="ms-auto flex items-center gap-8">
                                <button type="button" onClick={closeModal} className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 hover:text-white transition-all italic">
                                    CANCELAR_AUD
                                </button>
                                <button
                                    type="button"
                                    onClick={handleOmniPublish}
                                    disabled={isNemotronProcessing}
                                    className="bg-indigo-600 text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:bg-white hover:text-indigo-600 rounded-none active:scale-95 italic skew-x-[-12deg] group transition-all"
                                >
                                    <div className="skew-x-[12deg] flex items-center gap-4">
                                        <Sparkles size={18} className={isNemotronProcessing ? "animate-spin" : "group-hover:rotate-12 transition-transform"} />
                                        <span>{isNemotronProcessing ? 'NEMOTRON PENSANDO...' : 'AUTO-NEMOTRON'}</span>
                                    </div>
                                </button>
                                <button type="submit" className="bg-secondary text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_-10px_rgba(255,99,71,0.6)] hover:bg-white hover:text-secondary rounded-none active:scale-95 italic skew-x-[-12deg] group transition-all">
                                    <div className="skew-x-[12deg] flex items-center gap-4">
                                        <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
                                        <span>GUARDAR MANUAL</span>
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
