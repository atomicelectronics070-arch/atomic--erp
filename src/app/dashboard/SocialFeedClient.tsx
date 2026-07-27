"use client"

import { useState, useRef } from "react"
import { 
    ImageIcon, Video, Send, Heart, MessageSquare, 
    MoreHorizontal, Share2, Globe, X, Trophy, Trash2,
    TrendingUp, Award, Zap, Star, Activity, Medal,
    GraduationCap as School, Phone, Plus, Users
} from "lucide-react"
import PhoneRankingPanel from "@/components/dashboard/PhoneRankingPanel"
import PublicationRankingPanel from "@/components/dashboard/PublicationRankingPanel"
import SalesRankingPanel from "@/components/dashboard/SalesRankingPanel"
import { createPost, toggleLike, addComment, fetchFeed, getSalesRanking, deletePost } from "@/lib/actions/social"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

import VirtualOfficeWorkspace from "@/components/dashboard/VirtualOfficeWorkspace"
import MultiSocialPublisher from "@/components/dashboard/MultiSocialPublisher"
import LiveTradingChart from "@/components/LiveTradingChart"

interface SocialFeedClientProps {
    initialPosts: any[]
    initialRanking: any[]
    session: any
}

export default function SocialFeedClient({ initialPosts, initialRanking, session }: SocialFeedClientProps) {
    const [masterMode, setMasterMode] = useState<"area_trabajo" | "publicador" | "feed_interno">("area_trabajo")
    const [posts, setPosts] = useState<any[]>(initialPosts)
    const [ranking, setRanking] = useState<any[]>(initialRanking)
    const [loading, setLoading] = useState(false)
    const [newPostContent, setNewPostContent] = useState("")
    const [mediaFile, setMediaFile] = useState<string | null>(null)
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [rankingFilter, setRankingFilter] = useState<'points' | 'count' | 'name' | 'quotes' | 'contacts'>('quotes')
    const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false)
    const [quickSaleData, setQuickSaleData] = useState({ amount: 0, salespersonId: "", client: "VENTA RÁPIDA RANKING" })
    
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGEMENT"

    // Meta Semanal — shared via localStorage with bot-ruta
    const [weeklyGoal, setWeeklyGoal] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('atomic_weekly_goal') || '5 capturas + 3 contactos'
        return '5 capturas + 3 contactos'
    })
    const [weeklyStart, setWeeklyStart] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('atomic_weekly_start') || ''
        return ''
    })
    const [weeklyEnd, setWeeklyEnd] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('atomic_weekly_end') || ''
        return ''
    })
    const [goalSaved, setGoalSaved] = useState(false)
    const [goalEditing, setGoalEditing] = useState(false)

    const saveWeeklyGoal = () => {
        localStorage.setItem('atomic_weekly_goal', weeklyGoal)
        localStorage.setItem('atomic_weekly_start', weeklyStart)
        localStorage.setItem('atomic_weekly_end', weeklyEnd)
        setGoalSaved(true)
        setGoalEditing(false)
        setTimeout(() => setGoalSaved(false), 2500)
    }

    const handleQuickSale = async () => {
        if (!quickSaleData.amount || !quickSaleData.salespersonId) return
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/finance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...quickSaleData,
                    profit: quickSaleData.amount, // Set profit equal to amount so points calculate correctly
                    status: "PAGADO",
                    type: "Venta Directa",
                    date: new Date().toISOString().split('T')[0]
                })
            })
            if (res.ok) {
                setIsQuickSaleOpen(false)
                setQuickSaleData({ amount: 0, salespersonId: "", client: "VENTA RÁPIDA RANKING" })
                await refreshData()
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const refreshData = async () => {
        const [feedRes, rankRes] = await Promise.all([
            fetchFeed(1, 20),
            getSalesRanking()
        ])
        if (feedRes.success) setPosts(feedRes.posts as any[])
        if (rankRes.success) setRanking(rankRes.ranking as any[])
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
        const file = e.target.files?.[0]
        if (!file) return
        
        const reader = new FileReader()
        reader.onloadend = () => {
            setMediaFile(reader.result as string)
            setMediaType(type)
        }
        reader.readAsDataURL(file)
    }

    const handleLike = async (postId: string) => {
        await toggleLike(postId, session.user.id)
        refreshData()
    }

    const handleDelete = async (postId: string) => {
        if (confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
            await deletePost(postId, session.user.id)
            refreshData()
        }
    }

    const handleCreatePost = async () => {
        if (!newPostContent.trim() && !mediaFile) return
        setIsSubmitting(true)
        try {
            const res = await createPost(session.user.id, newPostContent, mediaFile || undefined)
            if (res.success) {
                setNewPostContent("")
                setMediaFile(null)
                setMediaType(null)
                await refreshData()
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-[#050505] text-white pb-32 space-y-8">
            
            {/* MASTER SWITCH 3-WAY: ÁREA DE TRABAJO | PUBLICADOR MULTI-RED | FEED SOCIAL INTERNO */}
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-2.5 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-4 shadow-2xl sticky top-20 z-40">
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <button
                        onClick={() => setMasterMode("area_trabajo")}
                        className={`flex-1 sm:flex-initial px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
                            masterMode === 'area_trabajo' 
                                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] scale-105' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                    >
                        <Globe size={16} className="text-cyan-400" />
                        <span>ESTACIONES DE TRABAJO</span>
                    </button>
                    
                    <button
                        onClick={() => setMasterMode("publicador")}
                        className={`flex-1 sm:flex-initial px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
                            masterMode === 'publicador' 
                                ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-[0_0_25px_rgba(236,72,153,0.4)] scale-105' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                    >
                        <Share2 size={16} className="text-pink-400" />
                        <span>GESTOR SOCIAL</span>
                    </button>

                    <button
                        onClick={() => setMasterMode("feed_interno")}
                        className={`flex-1 sm:flex-initial px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
                            masterMode === 'feed_interno' 
                                ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-105' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                    >
                        <Users size={16} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                        <span>RED SOCIAL INTERNA</span>
                    </button>
                </div>

                <div className="hidden xl:flex items-center space-x-3 px-4 py-2 bg-slate-950 rounded-2xl border border-slate-800 text-[10px] font-mono text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-white font-bold">Oficina Virtual & CRM Conectados</span>
                </div>
            </div>

            {/* MODE 1: ÁREA DE TRABAJO (OFICINA VIRTUAL 2.5D) */}
            {masterMode === "area_trabajo" && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <VirtualOfficeWorkspace currentModule="ventas" />
                </div>
            )}

            {/* MODE 2: PUBLICADOR MULTI-RED SOCIAL */}
            {masterMode === "publicador" && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <MultiSocialPublisher />
                </div>
            )}

            {/* MODE 3: RED SOCIAL INTERNA & RANKINGS DE EMPRESA */}
            {masterMode === "feed_interno" && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-slate-900/90 border border-slate-800 px-8 py-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <Users size={26} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Red Social Interna</h2>
                                <p className="text-sm font-mono font-bold flex items-center gap-2 mt-0.5">
                                    <span className="text-white font-black tracking-widest uppercase">ATOMIC</span>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-emerald-400 font-black tracking-widest uppercase">COMUNIDAD</span>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-slate-300 font-medium">Noticias y Ranking de Ventas</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* LIVE TRADING CHART — Visible for all, admin controls only */}
                    <div className="px-2">
                        <LiveTradingChart isAdmin={isAdmin} />
                    </div>

            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Feed & Posts */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Render Old Panels if they exist, wrapping them cleanly */}
                    <div className="hidden">
                        <SalesRankingPanel isAdmin={isAdmin} />
                        <PhoneRankingPanel isAdmin={isAdmin} />
                        <PublicationRankingPanel isAdmin={isAdmin} />
                    </div>

                    {/* Create Post Box */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl p-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-lg text-emerald-300 shrink-0">
                                {session.user?.name?.[0] || "U"}
                            </div>
                            <div className="flex-1 space-y-4">
                                <textarea 
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="¿Qué quieres compartir con el equipo hoy?"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 outline-none resize-none text-sm font-medium text-white placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all min-h-[100px]"
                                />
                                
                                {mediaFile && (
                                    <div className="relative inline-block border border-slate-700 rounded-xl overflow-hidden">
                                        <img src={mediaFile} className="h-32 w-auto object-cover" />
                                        <button onClick={() => setMediaFile(null)} className="absolute top-2 right-2 p-1 bg-slate-900 rounded-full text-slate-400 hover:text-rose-400">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => fileInputRef.current?.click()} 
                                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                                        >
                                            <ImageIcon size={16} /> Añadir Imagen
                                        </button>
                                        <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={(e) => handleFileChange(e, "image")} />
                                    </div>
                                    <button 
                                        onClick={handleCreatePost} 
                                        disabled={(!newPostContent.trim() && !mediaFile) || isSubmitting} 
                                        className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500 disabled:opacity-40 transition-all flex items-center gap-2 hover:scale-105"
                                    >
                                        {isSubmitting ? "Publicando..." : <><Send size={16} /> Publicar</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feed Posts */}
                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {posts.map((post, i) => (
                                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={post.id}>
                                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl p-6 hover:border-slate-700 transition-all">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-sm text-emerald-300">
                                                    {post.author.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white">{post.author.name}</p>
                                                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{post.author.role}</p>
                                                </div>
                                            </div>
                                            {(isAdmin || post.author.id === session.user?.id) && (
                                                <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <p className="text-sm text-slate-100 font-medium leading-relaxed mb-4 whitespace-pre-wrap">
                                            {post.content.split(/(https?:\/\/[^\s]+)/g).map((part: string, index: number) => {
                                                if (part.match(/https?:\/\/[^\s]+/)) {
                                                    return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-bold">{part}</a>;
                                                }
                                                return part;
                                            })}
                                        </p>
                                        
                                        {/* Video detection for Tutorial Folder */}
                                        {post.content.includes("1ELD6LkVha7eM7DN8NdtIKzNqMSuUQcEK") && (
                                            <div className="mb-4 relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700">
                                                <iframe 
                                                    src="https://drive.google.com/file/d/16chfPwcoGopBzF1K8LhwYOwhrHiZrNQe/preview" 
                                                    className="w-full h-full" 
                                                    allow="autoplay"
                                                    title="Video Tutorial"
                                                ></iframe>
                                            </div>
                                        )}
                                        
                                        {post.mediaUrls && (
                                            <div className="mb-4 border border-slate-700 overflow-hidden rounded-xl">
                                                <img src={post.mediaUrls} className="w-full max-h-[500px] object-cover" />
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-3 border-t border-slate-800 pt-4 mt-2">
                                            <button 
                                                onClick={() => handleLike(post.id)} 
                                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                                    post.likes.some((l: any) => l.userId === session.user?.id) 
                                                        ? 'text-rose-400 bg-rose-500/15 border border-rose-500/30' 
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                                                }`}
                                            >
                                                <Heart size={14} className={post.likes.some((l: any) => l.userId === session.user?.id) ? "fill-rose-400" : ""} /> 
                                                {post.likes.length} Me Gusta
                                            </button>
                                            <button 
                                                onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)} 
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all"
                                            >
                                                <MessageSquare size={14} /> 
                                                {post.comments?.length || 0} Comentarios
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Column: Sidebar Panels */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Ranking Panel — 2027 Cyberpunk */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-6 sticky top-32 space-y-5">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white tracking-tight">Ranking de Asesores</h3>
                                    <p className="text-[9px] font-mono font-bold text-amber-400/70 uppercase tracking-widest">Top Desempeño</p>
                                </div>
                            </div>
                            {isAdmin && (
                                <button 
                                    onClick={() => setIsQuickSaleOpen(true)}
                                    className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all flex items-center gap-1"
                                >
                                    <Plus size={12} /> Ingreso
                                </button>
                            )}
                        </div>

                        {/* Filter */}
                        <select 
                            value={rankingFilter}
                            onChange={(e: any) => setRankingFilter(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 text-xs font-mono font-bold text-white rounded-xl px-3 py-2.5 outline-none focus:border-cyan-400 transition-all"
                        >
                            <option value="quotes">📊 Cotizaciones Generadas</option>
                            <option value="points">⭐ Puntos Acumulados</option>
                            <option value="count">💰 Ventas Cerradas</option>
                            <option value="contacts">📱 Teléfonos Captados</option>
                        </select>

                        {/* Rank cards */}
                        <div className="space-y-3">
                            {[...ranking].sort((a, b) => {
                                if (rankingFilter === 'quotes') return (b.quotesCount || 0) - (a.quotesCount || 0);
                                if (rankingFilter === 'points') return (b.points || 0) - (a.points || 0);
                                if (rankingFilter === 'count') return (b.salesCount || 0) - (a.salesCount || 0);
                                if (rankingFilter === 'contacts') return (b.contactsCount || 0) - (a.contactsCount || 0);
                                return a.name.localeCompare(b.name);
                            }).map((user, index) => {
                                const medals = ['🥇', '🥈', '🥉']
                                const isTop = index < 3
                                const cardBg = index === 0 
                                    ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                                    : index === 1
                                    ? 'bg-slate-400/5 border-slate-400/20'
                                    : index === 2
                                    ? 'bg-orange-500/5 border-orange-500/20'
                                    : 'bg-slate-950/80 border-slate-800'
                                return (
                                <div key={user.id} className={`flex flex-col p-4 rounded-2xl border transition-all ${cardBg}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="text-xl font-black w-8 text-center">
                                            {isTop ? medals[index] : `#${index+1}`}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-white truncate">{user.name}</p>
                                            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Asesor</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-black text-emerald-400 font-mono">${user.totalProfit.toLocaleString()}</p>
                                            <span className="text-[9px] font-mono font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                                                {user.points || 0} pts
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bars */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Cotiz.</span>
                                                <span className="text-[9px] font-mono font-black text-cyan-300">{user.quotesCount}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all" style={{ width: `${Math.min((user.quotesCount / 50) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Leads</span>
                                                <span className="text-[9px] font-mono font-black text-indigo-300">{user.contactsCount}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all" style={{ width: `${Math.min((user.contactsCount / 100) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Ventas</span>
                                                <span className="text-[9px] font-mono font-black text-emerald-300">{user.salesCount}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all" style={{ width: `${Math.min((user.salesCount / 20) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Point System Guide */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Activity size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Sistema de Puntos</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Métricas de Desempeño</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-medium text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                <span>Venta $0 - $100</span>
                                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">3 pts</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-medium text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                <span>Venta $100 - $200</span>
                                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">8 pts</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-medium text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                <span>Venta $300 - $800</span>
                                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">10 pts</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-medium text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                <span>Venta +$1000</span>
                                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">15 pts</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-medium text-slate-600 p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                                <span className="text-blue-700">Cotización Generada</span>
                                <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">2 pts</span>
                            </div>
                        </div>
                    </div>

                    {/* 🎯 META SEMANAL WIDGET */}
                    {isAdmin && (
                        <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
                                        🎯 Meta Semanal del Equipo
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Configura los objetivos de la semana</p>
                                </div>
                                <button onClick={() => setGoalEditing(!goalEditing)}
                                    className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                                    {goalEditing ? 'Cancelar' : '✏️ Editar'}
                                </button>
                            </div>

                            {goalEditing ? (
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Meta (descripción)</label>
                                        <input type="text" value={weeklyGoal} onChange={e => setWeeklyGoal(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500 transition-all"
                                            placeholder="Ej: 5 capturas + 3 contactos" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Inicio</label>
                                            <input type="date" value={weeklyStart} onChange={e => setWeeklyStart(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-[#0F172A] outline-none focus:border-indigo-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Cierre</label>
                                            <input type="date" value={weeklyEnd} onChange={e => setWeeklyEnd(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-[#0F172A] outline-none focus:border-indigo-500" />
                                        </div>
                                    </div>
                                    <button onClick={saveWeeklyGoal}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-black text-sm transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2">
                                        💾 Guardar Meta
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Objetivo</p>
                                        <p className="text-lg font-black text-indigo-700">{weeklyGoal}</p>
                                    </div>
                                    {weeklyStart && weeklyEnd && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                            <span>📅</span>
                                            <span>{weeklyStart} → {weeklyEnd}</span>
                                        </div>
                                    )}
                                    {goalSaved && (
                                        <p className="text-xs font-black text-emerald-600 flex items-center gap-1">✅ Meta guardada para todos los asesores</p>
                                    )}
                                    <Link href="/dashboard/bot-ruta"
                                        className="block w-full text-center text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                                        Ver en Bot Ruta →
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 📹 VIDEO DE GOOGLE DRIVE */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Video size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Video de Demostración</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recurso Compartido</p>
                            </div>
                        </div>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200">
                            <iframe 
                                src="https://drive.google.com/file/d/16chfPwcoGopBzF1K8LhwYOwhrHiZrNQe/preview" 
                                className="w-full h-full" 
                                allow="autoplay"
                                title="Video de Demostración"
                            ></iframe>
                        </div>
                    </div>

                    {/* Academy Panel */}
                    <div className="bg-gradient-to-br from-slate-900 to-[#0F172A] rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-slate-800 p-8 text-white relative overflow-hidden">

                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <School size={80} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-black tracking-tight mb-1">Academia Interna</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Capacitación y Recursos</p>
                            
                            <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50/10 border border-white/20 rounded-lg p-4 mb-6 backdrop-blur-sm">
                                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-wider mb-1">CURSO DESTACADO</p>
                                <p className="text-sm font-bold text-white mb-3">Técnicas de Cierre Empresarial</p>
                                <div className="flex justify-between items-center text-xs font-medium text-slate-300">
                                    <span>8 Módulos</span>
                                    <span className="text-emerald-400 font-bold">Gratis Staff</span>
                                </div>
                            </div>
                            
                            <Link href="/dashboard/academy" className="block w-full text-center py-3 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-[#0F172A] rounded-lg text-xs font-black uppercase tracking-wider hover:bg-indigo-50 transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
                                Ingresar al Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Sale Modal */}
            <AnimatePresence>
                {isQuickSaleOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsQuickSaleOpen(false)} />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border border-slate-200 p-8 rounded-2xl max-w-md w-full space-y-6 shadow-2xl">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h2 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
                                    <Zap size={20} className="text-amber-500" /> Registro Rápido
                                </h2>
                                <button onClick={() => setIsQuickSaleOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Seleccionar Asesor</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm font-bold text-[#0F172A] outline-none focus:border-indigo-500"
                                        value={quickSaleData.salespersonId}
                                        onChange={(e) => setQuickSaleData({...quickSaleData, salespersonId: e.target.value})}
                                    >
                                        <option value="">Elegir asesor...</option>
                                        {ranking.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Monto de Venta ($)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-2xl font-black text-[#0F172A] outline-none focus:border-indigo-500"
                                        placeholder="0.00"
                                        value={quickSaleData.amount || ""}
                                        onChange={(e) => setQuickSaleData({...quickSaleData, amount: parseFloat(e.target.value) || 0})}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleQuickSale}
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 text-white py-3.5 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
                            >
                                {isSubmitting ? "Procesando..." : "Confirmar Ingreso"}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
                </div>
            )}
        </div>
    )
}
