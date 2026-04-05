import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, Clock, User, ChevronRight } from "lucide-react"

// Force dynamic to always fetch the latest published blogs
export const dynamic = 'force-dynamic'

export default async function BlogsGallery() {
  const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } }
  })

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }}></div>
      </div>

      <nav className="relative z-10 p-6 md:p-10 flex items-center justify-between pointer-events-auto">
          <Link href="/web" className="group flex items-center space-x-2 text-white/50 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Volver a Tienda</span>
          </Link>
          <div className="text-[10px] uppercase font-black tracking-[0.3em] text-orange-500">Atomic Corporate</div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
          {/* Header */}
          <div className="text-center mb-24 pt-10">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">
                Corporate <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500 italic">Blog.</span>
              </h1>
              <p className="text-white/50 max-w-2xl mx-auto text-lg">
                  Explora las últimas novedades corporativas, guías operativas e inteligencia de mercado.
              </p>
          </div>

          {/* Floating Gallery */}
          {blogs.length === 0 ? (
              <div className="text-center py-20 border border-white/5 bg-white/5 backdrop-blur-sm rounded-3xl">
                  <p className="text-white/50 text-sm font-medium">Próximamente estaremos publicando artículos. Vuelve pronto.</p>
              </div>
          ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-32">
                    {blogs.map((blog, idx) => (
                        <Link 
                            href={`/web/blogs/${blog.id}`}
                            key={blog.id} 
                            className="group relative flex flex-col h-[500px] overflow-hidden bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.1)] rounded-sm"
                            style={{
                                transform: `translateY(${idx % 2 === 1 ? '40px' : '0px'})` // Staggered masonry effect vertically
                            }}
                        >
                            {/* Image Container */}
                            <div className="relative w-full h-[55%] overflow-hidden bg-neutral-900 border-b border-white/10 shrink-0">
                                {blog.imageUrl ? (
                                    <img 
                                        src={blog.imageUrl} 
                                        alt={blog.title} 
                                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" 
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800" />
                                )}
                                {/* Overlay Gradient for readability */}
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
                            </div>

                            {/* Content */}
                            <div className="relative p-8 flex-1 flex flex-col bg-[#030712] group-hover:bg-[#030712]/90 transition-colors">
                                <div className="flex items-center space-x-4 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">
                                    <div className="flex items-center space-x-1 border border-orange-500/30 bg-orange-500/10 px-2 py-1 rounded-sm">
                                        <Clock size={10} />
                                        <span>{new Date(blog.createdAt).toLocaleDateString('es-CO')}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-white/40">
                                        <User size={10} />
                                        <span>{blog.author?.name?.split(' ')[0] || 'Admin'}</span>
                                    </div>
                                </div>
                                <h2 className="text-xl md:text-2xl font-black text-white leading-tight mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-orange-200 transition-all line-clamp-3">
                                    {blog.title}
                                </h2>
                                
                                {/* Animated Arrow */}
                                <div className="mt-auto pt-6 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-orange-500 transition-colors">
                                    <span>Leer Artículo</span>
                                    <div className="w-8 h-px bg-white/20 group-hover:w-12 group-hover:bg-orange-500 transition-all duration-500 relative">
                                      <ChevronRight size={12} className="absolute -right-2 -top-1.5 opacity-0 group-hover:opacity-100 transition-opacity delay-100" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Historial Section */}
                <div className="mt-40 border-t border-white/5 pt-20">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Historial de <span className="text-orange-500">Publicaciones</span></h2>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">Registro cronológico de actividad editorial</p>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-10 hidden md:block"></div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{blogs.length} Entradas</div>
                    </div>

                    <div className="space-y-4">
                        {blogs.map((blog) => (
                            <Link 
                                href={`/web/blogs/${blog.id}`}
                                key={`hist-${blog.id}`}
                                className="group flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all"
                            >
                                <div className="flex items-center space-x-6">
                                    <div className="text-[10px] font-black text-white/20 uppercase w-24">
                                        {new Date(blog.createdAt).toLocaleDateString('es-CO', { month: 'short', day: '2-digit', year: 'numeric' })}
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-orange-500/50 group-hover:bg-orange-500 transition-colors"></div>
                                    <h3 className="text-sm font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-tight">{blog.title}</h3>
                                </div>
                                <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Ver Detalles</span>
                                    <ArrowLeft size={14} className="rotate-180 text-orange-500" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
              </>
          )}
      </main>
    </div>
  )
}
