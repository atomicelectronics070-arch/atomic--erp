"use client"

import { useState, useRef } from "react"
import { 
    ImageIcon, Video, Send, Heart, MessageSquare, 
    MoreHorizontal, Share2, Globe, X, Trophy, Trash2,
    TrendingUp, Award, Zap, Star, Activity, Medal
} from "lucide-react"
import { createPost, toggleLike, addComment, fetchFeed, getSalesRanking, deletePost } from "@/lib/actions/social"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

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

    const refreshData = async () => {
        const [feedRes, rankRes] = await Promise.all([
            fetchFeed(1, 20),
            getSalesRanking()
        ])
        if (feedRes.success) setPosts(feedRes.posts as any[])
        if (rankRes.success) setRanking(rankRes.ranking as any[])
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
                <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#E8341A]/5 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] bg-[#00F0FF]/5 blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="flex flex-col lg:flex-row gap-16 items-start relative z-10">
                <div className="flex-1 space-y-16 w-full">
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-12">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 text-[#E8341A] neon-text">
                                <Globe size={24} />
                                <span className="text-[10px] uppercase font-black tracking-[0.6em] italic">TRANSMISIÓN CORPORATIVA // NODO ALPHA</span>
                            </div>
                            <h1 className="text-7xl font-black tracking-tighter text-white uppercase italic leading-none">FEED <span className="text-[#E8341A] neon-text">SOCIAL</span></h1>
                        </div>
                    </motion.div>

                    <CyberCard className="!p-10 relative group">
                        <div className="flex gap-6 items-start">
                            <div className="w-16 h-16 bg-[#E8341A]/10 border border-[#E8341A]/20 flex items-center justify-center font-black text-2xl text-[#E8341A] neon-text italic shrink-0">
                                {session.user?.name?.[0] || "U"}
                            </div>
                            <div className="flex-1 space-y-8">
                                <textarea 
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="¿QUÉ NOVEDADES HAY EN EL ECOSISTEMA?"
                                    className="w-full bg-transparent border-none outline-none resize-none text-xl font-black text-white placeholder:text-white/10 uppercase tracking-tighter italic min-h-[100px]"
                                />
                                <div className="flex items-center justify-between border-t border-white/5 pt-8">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => fileInputRef.current?.click()} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white bg-white/5 border border-white/5 transition-all italic">FOTO</button>
                                        <button onClick={() => videoInputRef.current?.click()} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white bg-white/5 border border-white/5 transition-all italic">VIDEO</button>
                                        <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={(e) => handleFileChange(e, "image")} />
                                        <input type="file" accept="video/*" hidden ref={videoInputRef} onChange={(e) => handleFileChange(e, "video")} />
                                    </div>
                                    <NeonButton variant="primary" onClick={handleCreatePost} disabled={(!newPostContent.trim() && !mediaFile) || isSubmitting}>
                                        {isSubmitting ? "SYNC..." : "TRANSMITIR"}
                                    </NeonButton>
                                </div>
                            </div>
                        </div>
                    </CyberCard>

                    <div className="space-y-12">
                        <AnimatePresence mode="popLayout">
                            {posts.map((post, i) => (
                                <motion.div layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={post.id}>
                                    <CyberCard className="!p-12 relative group">
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl text-white italic">
                                                    {post.author.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-black text-white uppercase tracking-tighter italic group-hover:text-[#E8341A] transition-colors">{post.author.name}</p>
                                                    <p className="text-[10px] font-black text-[#E8341A] neon-text uppercase tracking-[0.4em] italic mt-1">{post.author.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-2xl font-black text-white/90 uppercase tracking-tighter italic leading-snug mb-10">{post.content}</p>
                                        {post.mediaUrl && (
                                            <div className="mb-10 border border-white/5 overflow-hidden">
                                                <img src={post.mediaUrl} className="w-full max-h-[600px] object-cover group-hover:scale-105 transition-transform duration-1000" />
                                            </div>
                                        )}
                                        <div className="flex gap-10 border-t border-white/5 pt-10">
                                            <button onClick={() => handleLike(post.id)} className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest italic ${post.likes.some((l: any) => l.userId === session.user?.id) ? 'text-[#E8341A] neon-text' : 'text-white/20 hover:text-white'}`}>
                                                <Heart size={18} /> {post.likes.length} APORTES
                                            </button>
                                            <button onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#00F0FF] transition-all italic">
                                                <MessageSquare size={18} /> {post.comments?.length || 0} DEBATES
                                            </button>
                                        </div>
                                    </CyberCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="w-full lg:w-[450px] space-y-12 sticky top-32">
                    <CyberCard className="!p-12 border-[#E8341A]/20">
                        <div className="flex items-center gap-6 mb-12">
                            <Trophy className="text-[#E8341A] neon-text" size={40} />
                            <div>
                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">RANKING</h3>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">TOP ASESORES // GLOBAL</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {ranking.map((user, index) => (
                                <div key={user.id} className={`flex items-center gap-6 p-6 border ${index === 0 ? 'bg-[#E8341A]/5 border-[#E8341A]/30' : 'bg-white/[0.02] border-white/5'} transition-all group`}>
                                    <div className={`w-12 h-12 flex items-center justify-center font-black text-xl italic ${index === 0 ? 'bg-[#E8341A] text-white shadow-[0_0_15px_rgba(232,52,26,0.4)]' : 'bg-white/5 text-white/20'}`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-white uppercase italic tracking-tighter truncate group-hover:text-[#E8341A] transition-colors">{user.name}</p>
                                        <p className="text-[10px] font-black text-[#E8341A] neon-text italic mt-1">${user.totalProfit.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CyberCard>
                    <CyberCard className="!p-12 border-[#00F0FF]/20">
                        <div className="flex items-center gap-6 mb-12">
                            <GraduationCap className="text-[#00F0FF] neon-text" size={40} />
                            <div>
                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">ACADEMIA</h3>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">NEURAL TRAINING // DISPONIBLE</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="p-6 bg-white/[0.02] border border-white/5 space-y-4 group cursor-pointer hover:border-[#00F0FF]/30 transition-all">
                                <p className="text-[10px] font-black text-[#00F0FF] uppercase tracking-widest italic">CURSO DESTACADO</p>
                                <p className="text-sm font-black text-white uppercase italic tracking-tighter">Maestría en Ventas Atómicas</p>
                                <div className="flex justify-between items-center text-[9px] font-black text-white/20 uppercase italic">
                                    <span>12 Módulos</span>
                                    <span className="text-emerald-400">Gratis p/ Staff</span>
                                </div>
                            </div>
                            <Link href="/dashboard/academy" className="block text-center py-4 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[9px] font-black text-[#00F0FF] uppercase tracking-[0.3em] italic hover:bg-[#00F0FF] hover:text-slate-950 transition-all">
                                ACCEDER A CAPACITACIÓN
                            </Link>
                        </div>
                    </CyberCard>

                    <GlassPanel className="p-10 text-center border-white/5 opacity-60">
                        <Activity className="mx-auto mb-6 text-[#E8341A] neon-text" size={32} />
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">NEURAL ENGINE ACTIVE</p>
                    </GlassPanel>
                </div>
            </div>
        </div>
    )
}
