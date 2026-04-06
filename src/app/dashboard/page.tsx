"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Image as ImageIcon, Video, Send, Heart, MessageSquare, MoreHorizontal, Share2, AtSign, Globe, X } from "lucide-react"
import { fetchFeed, createPost, toggleLike, addComment } from "@/lib/actions/social"
import { motion, AnimatePresence } from "framer-motion"

export default function SocialFeed() {
    const { data: session } = useSession()
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [newPostContent, setNewPostContent] = useState("")
    const [mediaFile, setMediaFile] = useState<string | null>(null)
    const [mediaType, setMediaType] = useState<"image" | "video" | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoInputRef = useRef<HTMLInputElement>(null)
    const [commentTexts, setCommentTexts] = useState<Record<string, string>>({})
    const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null)

    const loadFeed = async () => {
        setLoading(true)
        const res = await fetchFeed()
        if (res.success) {
            setPosts(res.posts)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadFeed()
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

        const res = await createPost(session.user.id, newPostContent, mediaFile || undefined)
        if (res.success) {
            setNewPostContent("")
            setMediaFile(null)
            setMediaType(null)
            loadFeed() // Reload to get fresh data with populated relations
        }
    }

    const handleLike = async (postId: string) => {
        if (!session?.user?.id) return
        
        // Optimistic update
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
            setCommentTexts(prev => ({ ...prev, [postId]: "" }))
            loadFeed()
        }
    }

    if (!session) return null

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-32 animate-in fade-in duration-1000 relative z-10">
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[150px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-azure-500/10 blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-white/5 pb-12 relative z-10">
                <div className="space-y-4">
                     <div className="flex items-center space-x-4 text-secondary">
                        <Globe size={24} className="drop-shadow-[0_0_12px_rgba(255,99,71,0.6)]" />
                        <span className="text-[11px] uppercase font-black tracking-[0.6em] italic">COMUNICACIÓN GLOBAL</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                        RED <span className="text-secondary">CORPORATIVA</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] max-w-xl italic leading-relaxed">
                        Transmisión centralizada de activos corporativos, novedades empresariales y multimedia.
                    </p>
                </div>
            </div>

            {/* Create Post Section */}
            <div className="glass-panel !bg-slate-950/70 border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] rounded-[3rem] p-10 relative z-10 backdrop-blur-3xl ring-1 ring-white/5">
                <div className="flex gap-6 items-start">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 border-2 border-white/10 flex items-center justify-center font-black text-2xl text-white shadow-inner italic shrink-0">
                        {session.user?.name?.[0] || "U"}
                    </div>
                    <div className="flex-1 space-y-6">
                        <textarea 
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="¿QUÉ NOVEDADES HAY EN EL ECOSISTEMA?"
                            className="w-full bg-transparent border-none outline-none resize-none text-xl font-black text-white placeholder:text-slate-600 uppercase tracking-tighter italic min-h-[80px]"
                        />
                        
                        {mediaFile && (
                            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl inline-block max-w-full">
                                <button onClick={() => { setMediaFile(null); setMediaType(null); }} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 backdrop-blur-md z-10 transition-all">
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
                                
                                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 bg-slate-900/50 border border-white/5 transition-all group italic">
                                    <ImageIcon size={16} className="group-hover:text-azure-400 transition-colors" /> IMAGEN
                                </button>
                                <button onClick={() => videoInputRef.current?.click()} className="flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 bg-slate-900/50 border border-white/5 transition-all group italic">
                                    <Video size={16} className="group-hover:text-emerald-400 transition-colors" /> VIDEO
                                </button>
                            </div>
                            <button 
                                onClick={handleCreatePost}
                                disabled={!newPostContent.trim() && !mediaFile}
                                className="bg-secondary text-white px-10 py-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-4 shadow-[0_20px_50px_-10px_rgba(255,99,71,0.6)] transition-all hover:scale-105 rounded-2xl active:scale-95 group italic skew-x-[-12deg] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <div className="skew-x-[12deg] flex items-center gap-4">
                                    <Send size={18} className="group-hover:translate-x-1 group-active:translate-x-4 transition-transform" /> PUBLICAR
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed Section */}
            <div className="space-y-10">
                {loading ? (
                    <div className="flex justify-center py-20">
                         <div className="w-16 h-16 border-4 border-white/5 border-t-secondary rounded-full animate-spin shadow-[0_0_30px_rgba(255,99,71,0.3)]"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 opacity-30">
                        <Globe size={80} className="mx-auto mb-6 text-slate-600" />
                        <p className="text-2xl font-black uppercase tracking-widest italic text-slate-500">NO HAY REGISTROS EN EL SISTEMA GLOBAl</p>
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
                                className="glass-panel !bg-slate-950/60 border-white/10 shadow-2xl rounded-[3rem] p-10 relative overflow-hidden backdrop-blur-2xl ring-1 ring-white/5 group"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-xl text-white shadow-inner shadow-secondary/10 italic">
                                            {post.author.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-white uppercase tracking-tighter italic">{post.author.name}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[9px] font-black text-secondary uppercase tracking-[0.3em] inline-flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                    {post.author.role}
                                                </span>
                                                <span className="text-slate-600 px-2">•</span>
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{new Date(post.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-slate-600 hover:text-white transition-colors p-2">
                                        <MoreHorizontal size={24} />
                                    </button>
                                </div>

                                {post.content && (
                                    <p className="text-white/90 text-lg mb-8 font-medium leading-relaxed italic whitespace-pre-wrap">{post.content}</p>
                                )}

                                {post.mediaUrls && (
                                    <div className="mb-8 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                                        {post.mediaUrls.startsWith("data:video") ? (
                                            <video src={post.mediaUrls} controls className="w-full max-h-[600px] bg-black" />
                                        ) : (
                                            <img src={post.mediaUrls} alt="Post media" className="w-full max-h-[600px] object-cover" />
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-8 py-6 border-y border-white/5 mt-4">
                                    <button 
                                        onClick={() => handleLike(post.id)}
                                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isLiked ? 'bg-secondary/10 text-secondary border border-secondary/20 shadow-inner' : 'text-slate-500 hover:bg-white/5 hover:text-white border border-transparent'}`}
                                    >
                                        <Heart size={20} className={isLiked ? 'fill-secondary' : ''} /> 
                                        {post.likes.length} LIKES
                                    </button>
                                    <button 
                                        onClick={() => setActiveCommentPost(showComments ? null : post.id)}
                                        className="flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 hover:text-white transition-all border border-transparent"
                                    >
                                        <MessageSquare size={20} /> 
                                        {post.comments.length} COMENTARIOS
                                    </button>
                                    <button className="flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 hover:text-white transition-all border border-transparent ml-auto">
                                        <Share2 size={20} /> COMPARTIR
                                    </button>
                                </div>

                                {/* Comments Section */}
                                <AnimatePresence>
                                    {showComments && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-8 space-y-6">
                                                {post.comments.map((comment: any) => (
                                                    <div key={comment.id} className="flex gap-5">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center font-black text-sm text-slate-400 shrink-0">
                                                            {comment.author.name[0]}
                                                        </div>
                                                        <div className="bg-white/[0.03] p-5 rounded-3xl rounded-tl-sm border border-white/5 flex-1 shadow-inner">
                                                            <div className="flex items-baseline justify-between mb-2">
                                                                <span className="font-black text-white uppercase text-xs tracking-wider">{comment.author.name}</span>
                                                                <span className="text-[9px] text-slate-500 uppercase">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                                                            </div>
                                                            <p className="text-slate-300 text-sm italic">{comment.content}</p>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="flex gap-5 mt-6 items-center">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-sm text-secondary shrink-0">
                                                        {session.user?.name?.[0]}
                                                    </div>
                                                    <div className="flex-1 relative">
                                                        <input 
                                                            type="text"
                                                            value={commentTexts[post.id] || ""}
                                                            onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                            placeholder="ESCRIBE UN CORREO..."
                                                            onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                                                            className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs font-black text-white italic placeholder:text-slate-600 focus:border-secondary transition-all outline-none"
                                                        />
                                                        <button 
                                                            onClick={() => handleComment(post.id)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-secondary disabled:opacity-30"
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
    )
}
