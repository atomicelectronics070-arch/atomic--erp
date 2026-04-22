import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, User } from "lucide-react"

export default async function BlogArticlePage({ params }: { params: { id: string } }) {
    const blog = await prisma.blog.findUnique({
        where: { id: params.id },
        include: { author: { select: { name: true } } }
    })

    if (!blog || !blog.published) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-pink-600/10 blur-[150px] rounded-none animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-none animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[1px]"></div>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }}></div>
            </div>

            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <Link href="/web/blogs" className="group flex items-center space-x-3 text-white/50 hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-none border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 group-hover:border-indigo-500 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Volver a Noticias</span>
                </Link>
                <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] rounded-none"></div>
                    <span className="text-xl font-black italic tracking-tighter uppercase leading-none text-white">ATOMIC<span className="text-indigo-500">.</span></span>
                </div>
            </nav>

            <article className="relative z-10 pt-40 pb-32">
                {/* Visual Header */}
                <header className="max-w-4xl mx-auto px-6 text-center mb-16">
                    <div className="flex items-center justify-center space-x-6 mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                        <div className="flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-none">
                            <Clock size={12} />
                            <span>{new Date(blog.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <User size={12} className="text-pink-500" />
                            <span>Redactor: <span className="text-white/70">{blog.author?.name || 'Atomic Industries'}</span></span>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-7xl font-black tracking-tight text-white leading-[1] mb-12 uppercase italic">
                        {blog.title}
                    </h1>

                    {blog.excerpt && (
                        <div className="max-w-2xl mx-auto border-l-4 border-indigo-600 bg-white/5 backdrop-blur-md p-8 text-left rounded-none">
                            <p className="text-lg md:text-xl text-white/60 font-medium italic leading-relaxed">
                                "{blog.excerpt}"
                            </p>
                        </div>
                    )}
                </header>

                {/* Cover Image */}
                {blog.imageUrl && (
                    <div className="w-full max-w-6xl mx-auto px-6 mb-24">
                        <div className="w-full aspect-video md:aspect-[21/9] bg-neutral-900 overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/5 rounded-none group">
                            <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60"></div>
                        </div>
                    </div>
                )}

                {/* Content Render */}
                <div className="max-w-3xl mx-auto px-6">
                    <div 
                        className="prose prose-lg prose-invert md:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white prose-a:text-indigo-400 prose-img:rounded-none prose-img:shadow-2xl prose-p:text-white/70 prose-p:leading-relaxed prose-strong:text-indigo-300"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>
            </article>

            {/* Footer Navigation */}
            <footer className="relative z-10 border-t border-white/5 bg-slate-950/20 px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <Link href="/web/blogs" className="inline-flex items-center justify-center space-x-4 bg-indigo-600 text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all shadow-2xl shadow-indigo-500/20 group rounded-none">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Regresar a la Galería</span>
                    </Link>
                </div>
            </footer>
        </div>
    )
}
