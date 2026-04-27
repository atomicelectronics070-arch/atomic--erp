"use client"
// Social Core Integration - v5.0.2

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { 
    Image as ImageIcon, Video, Send, Heart, MessageSquare, 
    MoreHorizontal, Share2, AtSign, Globe, X, Trophy, Trash2,
    TrendingUp, Award, Medal, Zap, Star, Activity
} from "lucide-react"
import { fetchFeed, createPost, toggleLike, addComment, getSalesRanking, deletePost } from "@/lib/actions/social"
import { motion, AnimatePresence } from "framer-motion"

export default function SocialFeed() {
    const { data: session } = useSession()
    const [posts, setPosts] = useState<any[]>([])
    const [ranking, setRanking] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [newPostContent, setNewPostContent] = useState("")
    const [mediaFile, setMediaFile] = useState<string | null>(null)
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoInputRef = useRef<HTMLInputElement>(null)
    const [commentTexts, setCommentTexts] = useState<Record<string, string>>({})
    const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)

    const loadData = async () => {
        setLoading(true)
        const [feedRes, rankRes] = await Promise.all([
            fetchFeed(),
            getSalesRanking()
        ])
        
        if (feedRes.success && feedRes.posts) {
            setPosts(feedRes.posts as any[])
        }
        if (rankRes.success && rankRes.ranking) {
            setRanking(rankRes.ranking as any[])
        }
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setMediaFile(reader.result as string)
                setMediaType(type)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleCreatePost = async () => {
        if (!newPostContent.trim() && !mediaFile) return
        if (!session?.user?.id) return

        setIsSubmitting(true)
        try {
            const res = await createPost(session.user.id, newPostContent, mediaFile || undefined)
            if (res.success) {
            alert("Publicación eliminada correctamente.");
                setNewPostContent("")
                setMediaFile(null)
                setMediaType(null)
                loadData() 
            } else {
                alert("Error al publicar: " + res.error)
                console.error(res.error)
            }
        } catch (err: any) {
            alert("Error de red: " + err.message)
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleLike = async (postId: string) => {
        if (!session?.user?.id) return
        
        setPosts(current => current.map(p => {
            if (p.id === postId) {
                const isLiked = p.likes.some((l: any) => l.userId === session.user.id)
                return {
                    ...p,
                    likes: isLiked 
                        ? p.likes.filter((l: any) => l.userId !== session.user.id)
                        : [...p.likes, { userId: session.user.id }]
                }
            }
            return p
        }))

        await toggleLike(postId, session.user.id)
    }

    const handleComment = async (postId: string) => {
        const text = commentTexts[postId]
        if (!text?.trim() || !session?.user?.id) return

        const res = await addComment(postId, session.user.id, text)
        if (res.success) {
            alert("Publicación eliminada correctamente.");
            setCommentTexts(prev => ({ ...prev, [postId]: "" }))
            loadData()
        }

    const handleDeletePost = async (postId: string) => {
        try {
            if (!confirm("¿Seguro que deseas eliminar esta publicación permanentemente?")) return;
            
            const userId = session?.user?.id;
            if (!userId) {
                alert("Error: No se encontró el ID de usuario en la sesión.");
                return;
            }

            const res = await deletePost(postId, userId);
            
            if (res.success) {
                setPosts(current => current.filter(p => p.id !== postId));
                alert("Publicación eliminada.");
            } else {
                alert("Error del servidor: " + (res.error || "Desconocido"));
            }
        } catch (err: any) {
            alert("Error crítico: " + err.message);
        }
    }
    }

    }

    if (!session) return null

    return (
        <div className="max-w-[1600px] mx-auto px-4 lg:px-10 space-y-12 pb-32 animate-in fade-in duration-1000 relative z-10">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-none bg-primary/10 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-none bg-indigo-500/10 blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start relative z-10">
                
                {/* Main Feed Section (Left/Center) */}
                <div className="flex-1 space-y-12 w-full">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-12">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 text-primary">
                                <Globe size={24} className="drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
                                <span className="text-[11px] uppercase font-black tracking-[0.6em] italic">COMUNIDAD CORPORATIVA // RANKING ACTIVO</span>
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                                FEED <span className="text-primary">SOCIAL</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] max-w-xl italic leading-relaxed">
                                TransmisiÃ³n corporativa de alto rendimiento. Resultados y actualizaciones globales.
                            </p>
                        </div>
                    </div>

                    {/* Create Post Section */}
                    <div className="glass-panel !bg-slate-950/70 border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] rounded-none-[3rem] p-10 relative backdrop-blur-3xl ring-1 ring-white/5">
                        <div className="flex gap-6 items-start">
                            <div className="w-16 h-16 rounded-none-[1.5rem] bg-slate-900 border-2 border-white/10 flex items-center justify-center font-black text-2xl text-white shadow-inner italic shrink-0">
                                {session.user?.name?.[0] || "U"}
                            </div>
                            <div className="flex-1 space-y-6">
                                <textarea 
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Â¿QUÃ‰ NOVEDADES HAY EN EL ECOSISTEMA?"
                                    className="w-full bg-transparent border-none outline-none resize-none text-xl font-black text-white placeholder:text-slate-600 uppercase tracking-tighter italic min-h-[80px]"
                                />
                                
                                {mediaFile && (
                                    <div className="relative rounded-none overflow-hidden border border-white/10 shadow-2xl inline-block max-w-full">
                                        <button onClick={() => { setMediaFile(null); setMediaType(null); }} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-none hover:bg-black/80 backdrop-blur-md z-10 transition-all">
                                            <X size={20} />
                                        </button>
                                        {mediaType === "image" ? (
                                            <img src={mediaFile} alt="Preview" className="max-h-[300px] object-cover" />
                                        ) : (
                                            <video src={mediaFile} controls className="max-h-[300px]" />
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                    <div className="flex items-center gap-4">
                                        <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={(e) => handleFileChange(e, "image")} />
                                        <input type="file" accept="video/*" hidden ref={videoInputRef} onChange={(e) => handleFileChange(e, "video")} />
                                        
                                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 px-6 py-3 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 bg-slate-900/50 border border-white/5 transition-all group italic">
                                            <ImageIcon size={16} className="group-hover:text-primary transition-colors" /> IMAGEN
                                        </button>
                                        <button onClick={() => videoInputRef.current?.click()} className="flex items-center gap-3 px-6 py-3 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 bg-slate-900/50 border border-white/5 transition-all group italic">
                                            <Video size={16} className="group-hover:text-pink-400 transition-colors" /> VIDEO
                                        </button>
                                    </div>
                                    <button 
                                        onClick={handleCreatePost}
                                        disabled={(!newPostContent.trim() && !mediaFile) || isSubmitting}
                                        className="bg-primary text-white px-10 py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 shadow-[0_20px_50px_-10px_rgba(99,102,241,0.6)] transition-all hover:scale-105 rounded-none active:scale-95 group italic skew-x-[-15deg] disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        <div className="skew-x-[15deg] flex items-center gap-4">
                                            {isSubmitting ? (
                                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Send size={18} className="group-hover:translate-x-1 group-active:translate-x-4 transition-transform" />
                                            )}
                                            {isSubmitting ? "PUBLICANDO..." : "PUBLICAR"}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feed Posts */}
                    <div className="space-y-10">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                 <div className="w-16 h-16 border-4 border-white/5 border-t-primary rounded-none animate-spin shadow-[0_0_30px_rgba(99,102,241,0.3)]"></div>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-20 opacity-30">
                                <Globe size={80} className="mx-auto mb-6 text-slate-600" />
                                <p className="text-2xl font-black uppercase tracking-widest italic text-slate-500">SISTEMA SIN TRANSMISIONES ACTIVAS</p>
                            </div>
                        ) : (
                            posts.map(post => {
                                const isLiked = post.likes.some((l: any) => l.userId === session.user?.id)
                                const showComments = activeCommentPost === post.id

                                return (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={post.id} 
                                        className="glass-panel !bg-slate-950/60 border-white/10 shadow-2xl rounded-none-[3rem] p-10 relative backdrop-blur-2xl ring-1 ring-white/5 group"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-none bg-slate-900 border border-white/10 flex items-center justify-center font-black text-xl text-white shadow-inner shadow-primary/10 italic">
                                                    {post.author.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-xl font-black text-white uppercase tracking-tighter italic">{post.author.name}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] inline-flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-primary rounded-none animate-pulse" />
                                                            {post.author.role}
                                                        </span>
                                                        <span className="text-slate-600 px-2">â€¢</span>
                                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{new Date(post.createdAt).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                                                    className="text-slate-600 hover:text-white transition-colors p-2 rounded-none hover:bg-white/5"
                                                >
                                                    <MoreHorizontal size={24} />
                                                </button>
                                                {openMenuId === post.id && (
                                                    <div className="absolute right-0 top-12 z-[100] w-56 glass-panel bg-slate-900 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-none overflow-visible backdrop-blur-3xl">
                                                        <div className="p-2 space-y-1">
                                                            <button
                                                                onClick={(e) => { 
                                                                    e.stopPropagation();
                                                                    handleDeletePost(post.id); 
                                                                    setOpenMenuId(null); 
                                                                }}
                                                                className="w-full flex items-center gap-4 px-6 py-4 text-[12px] font-black text-red-400 hover:bg-red-500/10 uppercase tracking-widest transition-all rounded-none border border-transparent hover:border-red-500/20"
                                                            >
                                                                <Trash2 size={16} /> 
                                                                <span>Eliminar Post</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setOpenMenuId(null)}
                                                                className="w-full flex items-center gap-4 px-6 py-4 text-[12px] font-black text-slate-400 hover:bg-white/5 uppercase tracking-widest transition-all rounded-none"
                                                            >
                                                                <X size={16} /> 
                                                                <span>Cancelar</span>
                                                            </button>
                                                        </div>
                                                        <div className="absolute -top-2 right-4 w-4 h-4 bg-slate-900 border-l border-t border-white/20 rotate-45"></div>
                                                    </div>
                                                )})}
                                                                    placeholder="ESCRIBE UN COMENTARIO..."
                                                                    onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                                                                    className="w-full bg-slate-900/60 border border-white/10 rounded-none py-4 pl-6 pr-14 text-xs font-black text-white italic placeholder:text-slate-600 focus:border-primary transition-all outline-none"
                                                                />
                                                                <button 
                                                                    onClick={() => handleComment(post.id)}
                                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-primary disabled:opacity-30"
                                                                    disabled={!commentTexts[post.id]?.trim()}
                                                                >
                                                                    <Send size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Performance Ranking (Right Sidebar) */}
                <div className="w-full lg:w-[400px] space-y-8 sticky top-32">
                    <div className="glass-panel !bg-slate-950/80 border-primary/20 shadow-[0_50px_100px_-20px_rgba(99,102,241,0.15)] rounded-none-[3rem] p-10 backdrop-blur-3xl ring-1 ring-primary/10">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <Trophy className="text-primary drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" size={32} />
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">RANKING</h3>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic">TOP ASESORES // GLOBAL</p>
                                </div>
                            </div>
                            <Award className="text-slate-800" size={24} />
                        </div>

                        <div className="space-y-6">
                            {ranking.map((user, index) => {
                                const isTop1 = index === 0
                                const isTop2 = index === 1
                                const isTop3 = index === 2

                                return (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        key={user.id} 
                                        className={`group relative flex items-center gap-6 p-6 rounded-none border transition-all duration-500 ${
                                            isTop1 ? 'bg-primary/10 border-primary/30 shadow-[0_15px_30px_-5px_rgba(99,102,241,0.2)]' : 
                                            isTop2 ? 'bg-pink-500/5 border-pink-500/20' :
                                            isTop3 ? 'bg-emerald-500/5 border-emerald-500/20' :
                                            'bg-white/[0.02] border-white/5 hover:bg-white/5'
                                        }`}
                                    >
                                        <div className="relative shrink-0">
                                            <div className={`w-14 h-14 rounded-none flex items-center justify-center font-black text-xl italic shadow-2xl ${
                                                isTop1 ? 'bg-primary text-white' : 
                                                isTop2 ? 'bg-slate-300 text-slate-900 scale-90' :
                                                isTop3 ? 'bg-amber-700 text-white scale-90' :
                                                'bg-slate-900 text-slate-600 scale-90'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            {isTop1 && <Zap size={16} className="absolute -top-1 -right-1 text-white fill-white animate-pulse" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-black text-white uppercase italic tracking-tight truncate group-hover:text-primary transition-colors">{user.name}</p>
                                                <p className="text-[10px] font-black text-primary italic">${user.totalProfit.toLocaleString()}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-slate-900 rounded-none overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min((user.score / (ranking[0]?.score || 1)) * 100, 100)}%` }}
                                                        className={`h-full ${isTop1 ? 'bg-primary' : isTop2 ? 'bg-pink-400' : 'bg-slate-600'}`}
                                                    />
                                                </div>
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{user.salesCount} VTAS</span>
                                            </div>
                                        </div>

                                        <Star className={`opacity-0 group-hover:opacity-100 transition-opacity ${isTop1 ? 'text-primary' : 'text-slate-700'}`} size={16} />
                                    </motion.div>
                                )
                            })}

                            <div className="pt-6 border-t border-white/5">
                                <div className="p-6 bg-slate-900/50 rounded-none border border-white/5 flex items-center justify-between group cursor-help">
                                    <div className="flex items-center gap-4">
                                        <Activity className="text-primary" size={18} />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Tu Rendimiento Global</span>
                                    </div>
                                    <span className="text-[10px] font-black text-white italic group-hover:text-primary transition-colors">ESTABLE // +12%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel !bg-slate-900/40 p-8 rounded-none-[2.5rem] border-white/5 text-center">
                        <TrendingUp className="mx-auto mb-4 text-emerald-400 opacity-30" size={24} />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] leading-relaxed italic">Formula de Ranking: <br/> (Margen Bruto + Volumen de Ventas)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}




