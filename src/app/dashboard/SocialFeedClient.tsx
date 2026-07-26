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
                        <span>Oficina Virtual</span>
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
                        <span>🚀 Gestor de Redes</span>
                    </button>

                    <button
                        onClick={() => setMasterMode("feed_interno")}
                        className={`flex-1 sm:flex-initial px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
                            masterMode === 'feed_interno' 
                                ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-105' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                    >
                        <Users size={16} className="text-emerald-400" />
                        <span>💬 Feed Social Interno & Rankings</span>
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

            {/* MODE 3: FEED SOCIAL INTERNO & RANKINGS DE EMPRESA */}
            {masterMode === "feed_interno" && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 px-8 py-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Users size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Muro de Interacción Social Interno</h2>
                                <p className="text-sm text-slate-400 font-medium flex items-center gap-2">
                                    <span className="text-emerald-400 font-bold">Comunidad ATOMIC</span> • Publicaciones & Rankings de Ventas
                                </p>
                            </div>
                        </div>
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
                    <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200 p-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-black text-lg text-indigo-700 shrink-0">
                                {session.user?.name?.[0] || "U"}
                            </div>
                            <div className="flex-1 space-y-4">
                                <textarea 
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="¿Qué quieres compartir con el equipo hoy?"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 outline-none resize-none text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[100px]"
                                />
                                
                                {mediaFile && (
                                    <div className="relative inline-block border border-slate-200 rounded-lg overflow-hidden">
                                        <img src={mediaFile} className="h-32 w-auto object-cover" />
                                        <button onClick={() => setMediaFile(null)} className="absolute top-2 right-2 p-1 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-slate-500 hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => fileInputRef.current?.click()} 
                                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        >
                                            <ImageIcon size={16} /> Añadir Imagen
                                        </button>
                                        <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={(e) => handleFileChange(e, "image")} />
                                    </div>
                                    <button 
                                        onClick={handleCreatePost} 
                                        disabled={(!newPostContent.trim() && !mediaFile) || isSubmitting} 
                                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
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
                                    <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-sm text-slate-600">
                                                    {post.author.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#0F172A]">{post.author.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{post.author.role}</p>
                                                </div>
                                            </div>
                                            {(isAdmin || post.author.id === session.user?.id) && (
                                                <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <p className="text-sm text-slate-700 font-medium leading-relaxed mb-4 whitespace-pre-wrap">
                                            {post.content.split(/(https?:\/\/[^\s]+)/g).map((part: string, index: number) => {
                                                if (part.match(/https?:\/\/[^\s]+/)) {
                                                    return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{part}</a>;
                                                }
                                                return part;
                                            })}
                                        </p>
                                        
                                        {/* Video detection for Tutorial Folder */}
                                        {post.content.includes("1ELD6LkVha7eM7DN8NdtIKzNqMSuUQcEK") && (
                                            <div className="mb-4 relative w-full aspect-video rounded-lg overflow-hidden border border-slate-200">
                                                <iframe 
                                                    src="https://drive.google.com/file/d/16chfPwcoGopBzF1K8LhwYOwhrHiZrNQe/preview" 
                                                    className="w-full h-full" 
                                                    allow="autoplay"
                                                    title="Video Tutorial"
                                                ></iframe>
                                            </div>
                                        )}
                                        
                                        {post.mediaUrls && (
                                            <div className="mb-4 border border-slate-200 overflow-hidden rounded-lg">
                                                <img src={post.mediaUrls} className="w-full max-h-[500px] object-cover" />
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-4 border-t border-slate-100 pt-4 mt-2">
                                            <button 
                                                onClick={() => handleLike(post.id)} 
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${post.likes.some((l: any) => l.userId === session.user?.id) ? 'text-rose-500 bg-rose-50' : 'text-slate-500 hover:bg-slate-50'}`}
                                            >
                                                <Heart size={16} className={post.likes.some((l: any) => l.userId === session.user?.id) ? "fill-rose-500" : ""} /> 
                                                {post.likes.length} Me Gusta
                                            </button>
                                            <button 
                                                onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)} 
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
                                            >
                                                <MessageSquare size={16} /> 
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
                    
                    {/* Ranking Panel */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-slate-200 p-6 sticky top-32">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Ranking Asesores</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Desempeño</p>
                                </div>
                            </div>
                            {isAdmin && (
                                <button 
                                    onClick={() => setIsQuickSaleOpen(true)}
                                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1"
                                >
                                    <Plus size={12} /> Ingreso
                                </button>
                            )}
                        </div>

                        <div className="mb-6">
                            <select 
                                value={rankingFilter}
                                onChange={(e: any) => setRankingFilter(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-[#0F172A] rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                            >
                                <option value="quotes">Cotizaciones Generadas</option>
                                <option value="points">Puntos Acumulados</option>
                                <option value="count">Ventas Realizadas</option>
                                <option value="contacts">Número de Teléfonos Obtenidos</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            {[...ranking].sort((a, b) => {
                                if (rankingFilter === 'quotes') return (b.quotesCount || 0) - (a.quotesCount || 0);
                                if (rankingFilter === 'points') return (b.points || 0) - (a.points || 0);
                                if (rankingFilter === 'count') return (b.salesCount || 0) - (a.salesCount || 0);
                                if (rankingFilter === 'contacts') return (b.contactsCount || 0) - (a.contactsCount || 0);
                                return a.name.localeCompare(b.name);
                            }).map((user, index) => (
                                <div key={user.id} className={`flex flex-col p-3 rounded-xl border ${index === 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-900/50 backdrop-blur-xl border-slate-700/50 border-slate-100'} transition-all`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] ${index === 0 ? 'bg-amber-500 text-white shadow-[0_4px_15px_rgba(0,0,0,0.3)]' : 'bg-slate-100 text-slate-500'}`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <p className="text-xs font-black text-[#0F172A] truncate">{user.name}</p>
                                            <div className="flex items-center gap-3">
                                                <p className="text-xs font-black text-emerald-600">${user.totalProfit.toLocaleString()}</p>
                                                <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-black text-indigo-600">
                                                    {user.points || 0} pts
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bars */}
                                    <div className="grid grid-cols-3 gap-4 mt-3 pl-9">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase">
                                                <span>Cotiz.</span>
                                                <span className="text-blue-600">{user.quotesCount}</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((user.quotesCount / 50) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase">
                                                <span>Leads</span>
                                                <span className="text-violet-600">{user.contactsCount}</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${Math.min((user.contactsCount / 100) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase">
                                                <span>Ventas</span>
                                                <span className="text-emerald-600">{user.salesCount}</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((user.salesCount / 20) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
