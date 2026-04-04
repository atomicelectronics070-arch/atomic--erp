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
        <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-orange-200">
            {/* Header / Nav */}
            <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
                <Link href="/web/blogs" className="group flex items-center space-x-3 text-neutral-500 hover:text-orange-600 transition-colors">
                    <div className="w-8 h-8 rounded-sm mx-auto border border-neutral-200 flex items-center justify-center bg-neutral-50 shadow-sm group-hover:border-orange-600 group-hover:bg-orange-50">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Volver a Noticias</span>
                </Link>
                <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.5)]"></div>
                    <span className="text-xl font-black italic tracking-tighter uppercase leading-none">ATOMIC.</span>
                </div>
            </nav>

            <article className="pt-24 pb-32">
                {/* Visual Header */}
                <header className="max-w-4xl mx-auto px-6 text-center mb-16">
                    <div className="flex items-center justify-center space-x-6 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                        <div className="flex items-center space-x-2 bg-orange-50 text-orange-600 border border-orange-100 px-3 py-1.5 rounded-sm">
                            <Clock size={12} />
                            <span>{new Date(blog.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <User size={12} />
                            <span>Redactor: {blog.author?.name || 'Atomic Industries'}</span>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 leading-[1.1] mb-8">
                        {blog.title}
                    </h1>

                    {blog.excerpt && (
                        <p className="text-lg md:text-xl text-neutral-500 font-medium max-w-2xl mx-auto italic border-l-4 border-orange-600 pl-6 py-2 text-left">
                            "{blog.excerpt}"
                        </p>
                    )}
                </header>

                {/* Cover Image */}
                {blog.imageUrl && (
                    <div className="w-full max-w-6xl mx-auto px-6 mb-16">
                        <div className="w-full aspect-video md:aspect-[21/9] bg-neutral-100 overflow-hidden relative shadow-2xl border border-neutral-200 rounded-sm">
                            <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                {/* Content Render */}
                <div className="max-w-3xl mx-auto px-6">
                    <div 
                        className="prose prose-lg prose-neutral md:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-orange-600 prose-img:rounded-sm prose-img:shadow-lg prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>
            </article>

            {/* Footer */}
            <footer className="border-t border-neutral-200 bg-neutral-50 px-6 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <Link href="/web/blogs" className="inline-flex items-center justify-center space-x-3 bg-neutral-900 text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-xl group rounded-sm">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Regresar a Blogs</span>
                    </Link>
                </div>
            </footer>
        </div>
    )
}
