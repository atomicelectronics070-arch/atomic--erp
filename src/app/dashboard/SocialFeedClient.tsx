"use client"

import { useState, useRef } from "react"
import { 
    ImageIcon, Video, Send, Heart, MessageSquare, 
    MoreHorizontal, Share2, Globe, X, Trophy, Trash2,
    TrendingUp, Award, Zap, Star, Activity, Medal,
    GraduationCap as School
} from "lucide-react"
import { createPost, toggleLike, addComment, fetchFeed, getSalesRanking, deletePost } from "@/lib/actions/social"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface SocialFeedClientProps {
    initialPosts: any[]
    initialRanking: any[]
    session: any
}

import { CyberCard, NeonButton, CyberInput, GlassPanel } from "@/components/ui/CyberUI"

export default function SocialFeedClient({ initialPosts, initialRanking, session }: SocialFeedClientProps) {
    const [posts, setPosts] = useState<any[]>(initialPosts)
    const [ranking, setRanking] = useState<any[]>(initialRanking)
    const [loading, setLoading] = useState(false)
    const [newPostContent, setNewPostContent] = useState("")
    const [mediaFile, setMediaFile] = useState<string | null>(null)
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoInputRef = useRef<HTMLInputElement>(null)
    const [commentTexts, setCommentTexts] = useState<Record<string, string>>({})
    const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [rankingFilter, setRankingFilter] = useState<'points' | 'value' | 'count' | 'name' | 'quotes'>('quotes')
    const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false)
    const [quickSaleData, setQuickSaleData] = useState({ amount: 0, salespersonId: "", client: "VENTA RÁPIDA RANKING" })
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "MANAGEMENT"

    const handleQuickSale = async () => {
        if (!quickSaleData.amount || !quickSaleData.salespersonId) return
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/finance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...quickSaleData,
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

    const calculatePoints = (value: number) => {
        if (value > 1000) return 15;
        if (value >= 300) return 10;
        if (value >= 100) return 8;
        if (value > 0) return 3;
        return 0;
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
        if (confirm("¿Seguro que quieres eliminar esta transmisión?")) {
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
        <div className="w-full space-y-16 pb-32 relative z-10">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] left-[-10%] w-[30%] h-[30%] bg-[#1E3A8A]/5 blur-[80px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[25%] h-[25%] bg-[#00F0FF]/5 blur-[80px]" />
            </div>

            <div className="flex flex-col lg:flex-row gap-16 items-start relative z-10">
                <div className="flex-1 space-y-16 w-full">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-200 pb-8">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3 text-[#1E3A8A]">
                                <Globe size={16} />
                                <span className="text-[9px] uppercase font-black tracking-[0.4em] italic opacity-60">RED SOCIAL CORPORATIVA // ALPHA NODO</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter text-navy uppercase italic leading-none">Atomic <span className="text-[#1E3A8A]">Feed</span></h1>
                        </div>
                    </motion.div>

                    <CyberCard className="!p-8 relative group bg-white/40">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 bg-[#1E3A8A]/5 border border-[#1E3A8A]/10 flex items-center justify-center font-black text-xl text-[#1E3A8A] italic shrink-0">
                                {session.user?.name?.[0] || "U"}
                            </div>
                            <div className="flex-1 space-y-6">
                                <textarea 
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="COMPARTIR ACTUALIZACIÓN OPERATIVA..."
                                    className="w-full bg-transparent border-none outline-none resize-none text-lg font-black text-navy placeholder:text-navy/5 uppercase tracking-tighter italic min-h-[60px]"
                                />
                                <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-[8px] font-black uppercase tracking-widest text-navy/30 hover:text-navy bg-white/5 transition-all italic">IMAGEN</button>
                                        <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={(e) => handleFileChange(e, "image")} />
                                    </div>
                                    <button onClick={handleCreatePost} disabled={(!newPostContent.trim() && !mediaFile) || isSubmitting} className="bg-[#1E3A8A] text-navy px-6 py-2 text-[9px] font-black uppercase tracking-widest italic hover:scale-105 transition-all">
                                        {isSubmitting ? "SYNC..." : "PUBLICAR"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CyberCard>

                    <div className="space-y-12">
                        <AnimatePresence mode="popLayout">
                            {posts.map((post, i) => (
                                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={post.id}>
                                    <CyberCard className="!p-8 relative group bg-white/20 border-slate-200">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white/5 border border-slate-200 flex items-center justify-center font-black text-sm text-navy italic">
                                                    {post.author.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-navy uppercase tracking-tighter italic">{post.author.name}</p>
                                                    <p className="text-[8px] font-black text-[#1E3A8A] uppercase tracking-[0.3em] italic">{post.author.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-lg font-black text-navy/80 uppercase tracking-tighter italic leading-snug mb-6">{post.content}</p>
                                        {post.mediaUrl && (
                                            <div className="mb-6 border border-slate-200 overflow-hidden rounded-sm">
                                                <img src={post.mediaUrl} className="w-full max-h-[400px] object-contain bg-black/40" />
                                            </div>
                                        )}
                                        <div className="flex gap-8 border-t border-slate-200 pt-6">
                                            <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest italic ${post.likes.some((l: any) => l.userId === session.user?.id) ? 'text-[#1E3A8A]' : 'text-navy/20 hover:text-navy'}`}>
                                                <Heart size={14} /> {post.likes.length}
                                            </button>
                                            <button onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)} className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-navy/20 hover:text-navy transition-all italic">
                                                <MessageSquare size={14} /> {post.comments?.length || 0}
                                            </button>
                                        </div>
                                    </CyberCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="w-full lg:w-[450px] space-y-12 sticky top-32">
                    <CyberCard className="!p-8 border-slate-200 bg-white/20">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <Trophy className="text-[#1E3A8A]" size={24} />
                                <div>
                                    <h3 className="text-xl font-black text-navy uppercase italic tracking-tighter">RANKING ASESORES</h3>
                                    <p className="text-[8px] font-black text-navy/30 uppercase tracking-[0.4em] italic">TOP DESEMPEÑO GLOBAL</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <button 
                                        onClick={() => setIsQuickSaleOpen(true)}
                                        className="bg-[#1E3A8A] text-navy px-4 py-2 text-[8px] font-black uppercase tracking-widest italic hover:scale-105 transition-all shadow-[0_10px_20px_-5px_rgba(232,52,26,0.4)]"
                                    >
                                        + INGRESO
                                    </button>
                                )}
                                <select 
                                    value={rankingFilter}
                                    onChange={(e: any) => setRankingFilter(e.target.value)}
                                    className="bg-black/40 border border-white/10 text-[9px] font-black text-navy uppercase tracking-widest px-4 py-2 outline-none focus:border-[#1E3A8A] italic"
                                >
                                    <option value="quotes">COTIZACIONES (#)</option>
                                    <option value="points">PUNTOS (TOTAL)</option>
                                    <option value="value">MONTO ($)</option>
                                    <option value="count">VENTAS (#)</option>
                                    <option value="name">ASESOR</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[...ranking].sort((a, b) => {
                                if (rankingFilter === 'quotes') return (b.quotesCount || 0) - (a.quotesCount || 0);
                                if (rankingFilter === 'points') return (b.points || 0) - (a.points || 0);
                                if (rankingFilter === 'value') return (b.totalProfit || 0) - (a.totalProfit || 0);
                                if (rankingFilter === 'count') return (b.salesCount || 0) - (a.salesCount || 0);
                                return a.name.localeCompare(b.name);
                            }).map((user, index) => (
                                <div key={user.id} className={`flex flex-col p-4 border ${index === 0 ? 'bg-[#1E3A8A]/5 border-[#1E3A8A]/20' : 'bg-white/[0.01] border-slate-200'} transition-all group gap-3`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 flex items-center justify-center font-black text-[10px] italic ${index === 0 ? 'bg-[#1E3A8A] text-navy' : 'bg-white/5 text-navy/20'}`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <p className="text-[10px] font-black text-navy uppercase italic tracking-tighter truncate group-hover:text-[#1E3A8A] transition-colors">{user.name}</p>
                                            <div className="flex items-center gap-4">
                                                <p className="text-[10px] font-black text-[#1E3A8A] italic">${user.totalProfit.toLocaleString()}</p>
                                                <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-500 italic">
                                                    {user.points || 0} PTS
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* MICRO-STATS HORIZONTAL */}
                                    <div className="grid grid-cols-3 gap-6 pl-10">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-[7px] font-black text-navy/20 uppercase italic">
                                                <span>COTIZACIONES</span>
                                                <span className="text-blue-400">{user.quotesCount}</span>
                                            </div>
                                            <div className="h-0.5 w-full bg-white/5 rounded-none overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${Math.min((user.quotesCount / 50) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-[7px] font-black text-navy/20 uppercase italic">
                                                <span>CRM CONTACTS</span>
                                                <span className="text-violet-400">{user.contactsCount}</span>
                                            </div>
                                            <div className="h-0.5 w-full bg-white/5 rounded-none overflow-hidden">
                                                <div className="h-full bg-violet-500" style={{ width: `${Math.min((user.contactsCount / 100) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-[7px] font-black text-navy/20 uppercase italic">
                                                <span>VENTAS</span>
                                                <span className="text-emerald-400">{user.salesCount}</span>
                                            </div>
                                            <div className="h-0.5 w-full bg-white/5 rounded-none overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${Math.min((user.salesCount / 20) * 100, 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CyberCard>

                    <CyberCard className="!p-8 border-slate-200 bg-[#1E3A8A]/5 shadow-[0_0_50px_rgba(232,52,26,0.1)]">
                        <div className="flex items-center gap-4 mb-8 text-[#1E3A8A]">
                            <div className="p-3 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20">
                                <Zap size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase italic tracking-tighter text-navy">SISTEMA DE PUNTOS ATÓMICOS</h3>
                                <p className="text-[7px] font-black uppercase tracking-[0.4em] opacity-40 italic">PROTOCOLO DE RECOMPENSA</p>
                            </div>
                        </div>
                        <div className="space-y-4 border-l border-[#1E3A8A]/30 pl-6">
                            <div className="flex justify-between items-center group">
                                <span className="text-[10px] font-black text-navy/40 group-hover:text-navy transition-colors uppercase italic tracking-wider">VENTA $0 - $100</span>
                                <span className="text-[#1E3A8A] font-black italic">3 PTS</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-[10px] font-black text-navy/40 group-hover:text-navy transition-colors uppercase italic tracking-wider">VENTA $100 - $200</span>
                                <span className="text-[#1E3A8A] font-black italic">8 PTS</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-[10px] font-black text-navy/40 group-hover:text-navy transition-colors uppercase italic tracking-wider">VENTA $300 - $800</span>
                                <span className="text-[#1E3A8A] font-black italic">10 PTS</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-[10px] font-black text-navy/40 group-hover:text-navy transition-colors uppercase italic tracking-wider">VENTA +$1000</span>
                                <span className="text-[#1E3A8A] font-black italic">15 PTS</span>
                            </div>
                            <div className="flex justify-between items-center group border-t border-slate-200 pt-4">
                                <span className="text-[10px] font-black text-azure-400 group-hover:text-navy transition-colors uppercase italic tracking-wider">CADA COTIZACIÓN</span>
                                <span className="text-azure-400 font-black italic">2 PTS</span>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <p className="text-[8px] font-black text-navy/20 uppercase tracking-[0.2em] leading-relaxed italic">
                                EL RANKING SE CALCULA SOBRE EL CIERRE OPERATIVO. LOS PUNTOS DETERMINAN LA POSICIÓN NEURAL EN EL FEED.
                            </p>
                        </div>
                    </CyberCard>
                    <CyberCard className="!p-12 border-[#00F0FF]/20">
                        <div className="flex items-center gap-6 mb-12">
                            <School className="text-[#00F0FF] neon-text" size={40} />
                            <div>
                                <h3 className="text-3xl font-black text-navy uppercase italic tracking-tighter">ACADEMIA</h3>
                                <p className="text-[10px] font-black text-navy/30 uppercase tracking-[0.5em] italic">NEURAL TRAINING // DISPONIBLE</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="p-6 bg-white/[0.02] border border-slate-200 space-y-4 group cursor-pointer hover:border-[#00F0FF]/30 transition-all">
                                <p className="text-[10px] font-black text-[#00F0FF] uppercase tracking-widest italic">CURSO DESTACADO</p>
                                <p className="text-sm font-black text-navy uppercase italic tracking-tighter">Maestría en Ventas Atómicas</p>
                                <div className="flex justify-between items-center text-[9px] font-black text-navy/20 uppercase italic">
                                    <span>12 Módulos</span>
                                    <span className="text-emerald-400">Gratis p/ Staff</span>
                                </div>
                            </div>
                            <Link href="/dashboard/academy" className="block text-center py-4 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[9px] font-black text-[#00F0FF] uppercase tracking-[0.3em] italic hover:bg-[#00F0FF] hover:text-slate-950 transition-all">
                                ACCEDER A CAPACITACIÓN
                            </Link>
                        </div>
                    </CyberCard>

                    <GlassPanel className="p-10 text-center border-slate-200 opacity-60">
                        <Activity className="mx-auto mb-6 text-[#1E3A8A] neon-text" size={32} />
                        <p className="text-[10px] font-black text-navy/20 uppercase tracking-[0.5em] italic">NEURAL ENGINE ACTIVE</p>
                    </GlassPanel>
                </div>
            </div>

            {/* QUICK SALE MODAL */}
            <AnimatePresence>
                {isQuickSaleOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-white/90 backdrop-blur-3xl">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-white/10 p-12 max-w-lg w-full space-y-10 shadow-[0_0_100px_rgba(232,52,26,0.2)]">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-6">
                                <h2 className="text-2xl font-black text-navy uppercase italic tracking-tighter">REGISTRO <span className="text-[#1E3A8A]">RÁPIDO</span></h2>
                                <button onClick={() => setIsQuickSaleOpen(false)}><X size={24} className="text-navy/20 hover:text-navy" /></button>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-navy/30 uppercase tracking-widest italic">SELECCIONAR ASESOR</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 p-5 text-xs font-black text-navy uppercase italic outline-none focus:border-[#1E3A8A]"
                                        value={quickSaleData.salespersonId}
                                        onChange={(e) => setQuickSaleData({...quickSaleData, salespersonId: e.target.value})}
                                    >
                                        <option value="">ELIJA UN ASESOR...</option>
                                        {ranking.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-navy/30 uppercase tracking-widest italic">MONTO DE VENTA ($)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-white/5 border border-white/10 p-5 text-2xl font-black text-navy outline-none focus:border-[#1E3A8A] italic"
                                        placeholder="0.00"
                                        value={quickSaleData.amount}
                                        onChange={(e) => setQuickSaleData({...quickSaleData, amount: parseFloat(e.target.value)})}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleQuickSale}
                                disabled={isSubmitting}
                                className="w-full bg-[#1E3A8A] text-navy py-6 font-black uppercase tracking-[0.4em] text-[10px] italic hover:bg-white hover:text-[#1E3A8A] transition-all"
                            >
                                {isSubmitting ? "PROCESANDO..." : "CONFIRMAR INGRESO"}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
